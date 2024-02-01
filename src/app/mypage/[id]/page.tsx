"use client";

import React, { useContext, useEffect, useRef, useState } from 'react';
import Tesseract from "tesseract.js";
import Cropper, { ReactCropperElement } from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import classes from "./page.module.scss";
import { serverTimestamp,FieldValue, doc, setDoc, collection, query, where, onSnapshot, Timestamp, orderBy, getDoc, getCountFromServer } from 'firebase/firestore';
import { auth, db } from '@/firebase';
import AppContext from '@/context/AppContext';
import {Button} from "@mui/material";
import CloudUploadIcon from '@mui/icons-material/Logout';
import Link from 'next/link';
import toast, { Toaster } from 'react-hot-toast'
import { useRouter } from 'next/navigation';
import Image from 'next/image';

type Data = {
    character:string;
    createdAt:FieldValue;
    id:string;
    name:string;
    power:number;
    userImage:string;
}

const MyPage = ({params}:{params:{id:string}}) => {
    const router = useRouter();
    const {user} = useContext(AppContext);
    const [url,setUrl] = useState<string>();
    const [newUrl,setNewUrl] = useState<string>();
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const cropperRef = useRef<ReactCropperElement>(null);
    const [newPower,setNewPower] = useState<number>();
    const [count,setCount] = useState<number>();
    const [datas,setDatas] = useState<Data[]>([]);
    const [list,setList] = useState<Data[]>([]);
    const [done,setDone] = useState<boolean>(false);

    useEffect(() => {
        if(!user){
            router.push("/");
        }
          const fetchRanks = async () => {
          const rankDocRef = doc(db,"ranks",params.id);
          const rankData = await getDoc(rankDocRef);
          setDatas([rankData.data() as Data]);
        };
        fetchRanks()
      },[done,params.id, router, user])

      useEffect(() => {
          const fetchRanks = async () => {
          const rankCollectionRef = collection(db,"ranks");
          const q = query(rankCollectionRef,orderBy("power","desc"));
          const rankCount = await getCountFromServer(rankCollectionRef);
          setCount(rankCount.data().count);
          const unsubscribe = onSnapshot(q,(snapshot) => {
            const newRank = snapshot.docs.map((doc) => doc.data() as Data)
            setList(newRank);
          });
          return() => {
            unsubscribe();
          };
        };
        fetchRanks()
      },[done,params.id, router, user])
      
    const handleFileChange = () => {
        const fileInput = fileInputRef.current;
        if (fileInput && fileInput.files && fileInput.files.length > 0) {
            const selectedFile = fileInput.files[0];
            const imageUrl = URL.createObjectURL(selectedFile);
            setUrl(imageUrl);
        }
    }
    
    const convertImagetoText = async () => {
        const worker = await Tesseract.createWorker('eng');
        const rectangle = { left: 1000, top: 545, width: 200, height: 80 };
        const { data: { text } } = await worker.recognize(url!,{rectangle});
        
        const power = parseInt(text.replace(/,/g, ''), 10);
        try{
            if(power > 10000 && power < 100000000 ){
                await worker.terminate();
                setNewPower(power)
                return power;
            }else{
                toast.error("例にならって画像を投稿してください")
                return;
            }
        }catch(e){
            console.error(e)
            return;
        }
    };

    const onCrop = async() => {
        const cropper = cropperRef.current?.cropper;
        cropper?.setCropBoxData({left:599,top:308, width:30, height:30})
        const canvas = cropper?.getCroppedCanvas();
        const data = canvas?.toDataURL();
        setNewUrl(data);
        return data;
      };

      const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setDone(false);
    
        try {
            const power = await convertImagetoText();
            const croppedUrl = await onCrop();
    
            if (user && power && croppedUrl && user.displayName && user.photoURL) {
                const docRef = doc(db, "ranks", user.uid);
                const datas: Data = {
                    character: croppedUrl,
                    createdAt: serverTimestamp(),
                    id: user.uid,
                    name: user.displayName,
                    power: power,
                    userImage: user.photoURL,
                };
                toast.loading("投稿中です。",{id:"1"})
                await setDoc(docRef, datas);
                toast.success("投稿に成功しました",{id:"1"})
            }
        } catch (error) {
            console.error("エラー:", error);
        } finally {
            setDone(true);
        }
    };
    
    const  getIndex = (value:number, arr:Data[]) => {
        for(var i = 0; i < arr.length; i++) {
            if(arr[i].power === value) {
                return list.indexOf(arr[i]);
            }
        }
        return -1; //値が存在しなかったとき
    }
    
    const index = datas.length > 0 ? getIndex(datas[0].power, list) + 1 : -1;

    return (
        <div className={classes.container}>
            <Toaster />
            <Cropper
            className={classes.cropper}
            src={url ? url : ""}
            style={{ height: 400, width: 900 }}
            // Cropper.js options
            ref={cropperRef}
            />
           
            <div className={classes.userArea}>
                <div className={classes.userAreaHead}>
                    <p className={classes.authName}>ようこそ{user ? user.displayName : null}さん</p>
                    <div>
                        <Image className={classes.authImage} src={user?.photoURL || ""} alt="" width={48} height={48}/>
                    </div>
                </div>
                <div className={classes.userAreaBody}>
                    <div>
                        <div className={classes.rankLink}>
                            <Link href={"/"}>ランキング一覧へ</Link>
                        </div>
                        <div className={classes.powerWrapper}>
                            <h3 className={classes.powerCaption}>世界戦闘力</h3>
                            <p className={classes.power}>{datas.length > 0 ? datas[0].power.toLocaleString() : "N/A"}</p>
                        </div>
                        <div className={classes.rankWrapper}>
                            <h3 className={classes.rankCaption}>ランキング</h3>
                            <p className={classes.rank}><span className={classes.rankSpan}>{index}位</span>/{count}人中（上位<span className={classes.rankSpan}>{Math.floor((index / count!) * 1000)/10}%</span>）</p>
                        </div>
                    </div>
                    <form className={classes.form} action="" onSubmit={handleSubmit}>
                        <Button className={classes.fileButton} color="inherit" component="label" variant="contained" startIcon={<CloudUploadIcon />}>
                                <input className={classes.file} type="file" onChange={handleFileChange} ref={fileInputRef} accept=".png, .jpeg, .jpg"/>投稿する画像を選ぶ
                        </Button>
                        <img src={url ? url : ""} alt="" ref={cropperRef} className={classes.Url}/>
                        {url ? (<button className={classes.submit} type='submit'>送信する</button>) : null}
                        
                    </form>
                    <Image src={newUrl ? newUrl : ""} alt="" className={classes.newUrl} width={50} height={50}/>
                    <div className={classes.example}>
                        <h2 className={classes.exampleTitle}>見本<span className={classes.annotation}>（※初めての方は必ずご覧ください）</span> </h2>
                        <Image className={classes.exampleImage} src="/OK.png" alt="OK例" width={675} height={380} layout='responsive'/>
                        <p className={classes.exampleDescription}>上の画像のように、Nintendo Switchのスクリーンショット機能を使った画像を使用します。<br />右下のエリアに<Image className={classes.cursor} src="/cursor.png" alt="" width={24} height={24}/> を置かないでください。（読み取れない可能性があります。）</p>
                    </div>
                </div>
            </div>
        </div>
        )
    }

export default MyPage