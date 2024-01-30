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

type Data = {
    character:string;
    createdAt:FieldValue;
    id:string;
    name:string;
    power:number;
    userImage:string;
}

type Ranks = {
    id:string;
    name:string;
    power:number;
    userImage:string;
    character:string;
    createdAt:Timestamp;
  }

const MyPage = ({params}:{params:{id:string}}) => {
    const {user} = useContext(AppContext);
    const [url,setUrl] = useState<string>();
    const [newUrl,setNewUrl] = useState<string>();
    const fileInputRef = useRef<HTMLInputElement>();
    const cropperRef = useRef<ReactCropperElement>();
    const [newPower,setNewPower] = useState<number>();
    const [count,setCount] = useState<number>();
    const [datas,setDatas] = useState<Ranks[]>([]);
    const [list,setList] = useState<Ranks[]>([]);
    const [done,setDone] = useState<boolean>(false);

    useEffect(() => {
        const fetchRanks = async () => {
          const rankDocRef = doc(db,"ranks",params.id);
          const rankCollectionRef = collection(db,"ranks");
          const rankData = await getDoc(rankDocRef);
          setDatas(rankData.data() as Ranks[])
          const rankCount = await getCountFromServer(rankCollectionRef);
          setCount(rankCount.data().count)
        };
        fetchRanks()
      },[done])

      useEffect(() => {
        const fetchRanks = async () => {
          const rankDocRef = collection(db,"ranks");
          const q = query(rankDocRef,orderBy("power","desc"));
          const unsubscribe = onSnapshot(q,(snapshot) => {
            const newRank = snapshot.docs.map((doc) => doc.data() as Ranks)
            setList(newRank);
          });
          return() => {
            unsubscribe();
        };
        };
        fetchRanks()
      },[done])
      
      
    
    const handleFileChange = () => {
        const fileInput = fileInputRef.current;
        if (fileInput && fileInput.files && fileInput.files.length > 0) {
            const selectedFile = fileInput.files[0];
            const imageUrl = URL.createObjectURL(selectedFile);
            setUrl(imageUrl);
        }else{
            console.log()
        }
    }
    
    const convertImagetoText = async () => {
        const worker = await Tesseract.createWorker('eng');
        const rectangle = { left: 1000, top: 545, width: 200, height: 80 };
        const { data: { text } } = await worker.recognize(url!,{rectangle});

        function removeComma(text:string) {
            const removed = text.replace(/,/g, '');
            return parseInt(removed, 10);
        }
        
        const power = removeComma(text);
        try{
            if(power > 0 && power < 100000000 ){
                await worker.terminate();
                setNewPower(power)
                return power;
            }else{
                alert("例にならって画像を投稿してください")
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
    
            if (user && power && croppedUrl) {
                const docRef = doc(db, "ranks", user.uid);
                const datas: Data = {
                    character: croppedUrl,
                    createdAt: serverTimestamp(),
                    id: user.uid,
                    name: user.displayName,
                    power: power,
                    userImage: user.photoURL,
                };
    
                await setDoc(docRef, datas);
            }
        } catch (error) {
            console.error("エラー:", error);
        } finally {
            setDone(true);
        }
    };
    
    
    function getIndex(value:number, arr:Data[]) {
        for(var i = 0; i < arr.length; i++) {
            if(arr[i].power === value) {
                return list.indexOf(arr[i]);
            }
        }
        return -1; //値が存在しなかったとき
    }

    var index = getIndex(datas.power, list) + 1;
        
    return (
        <div className={classes.container}>
            <Cropper
            className={classes.cropper}
            src={url ? url : ""}
            style={{ height: 400, width: 900 }}
            // Cropper.js options
            initialAspectRatio={1/ 1}
            guides={false}
            ref={cropperRef}
            />
           
            <div className={classes.userArea}>
                <div className={classes.userAreaHead}>
                    <p className={classes.authName}>ようこそ{user?.displayName}さん</p>
                    <div>
                        <img className={classes.authImage} src={user?.photoURL} alt="" />
                    </div>
                </div>
                <div className={classes.userAreaBody}>
                    <div>
                        <div className={classes.rankLink}>
                            <Link href={"/"}>ランキング一覧へ</Link>
                        </div>
                        <div className={classes.powerWrapper}>
                            <h3 className={classes.powerCaption}>世界戦闘力</h3>
                            <p className={classes.power}>{datas.power}</p>
                        </div>
                        <div className={classes.rankWrapper}>
                            <h3 className={classes.rankCaption}>ランキング</h3>
                            <p className={classes.rank}><span className={classes.rankSpan}>{index}位</span>/{count}人中（上位<span className={classes.rankSpan}>{Math.floor((index / count!) * 1000)/10}%</span>）</p>
                        </div>
                    </div>
                    <form className={classes.form} action="" onSubmit={handleSubmit}>
                        <Button className={classes.fileButton} color="inherit" component="label" variant="contained" startIcon={<CloudUploadIcon />}>
                                <input className={classes.file} type="file" onChange={handleFileChange} ref={fileInputRef}/>投稿する画像を選ぶ
                        </Button>
                        <img src={url ? url : ""} alt="" accept=".png, .jpeg, .jpg" ref={cropperRef} className={classes.Url}/>
                        {url ? (<button className={classes.submit} type='submit'>送信する</button>) : null}
                        
                    </form>
                    <img src={newUrl ? newUrl : ""} alt="" className={classes.newUrl}/>
                    <div className={classes.example}>
                        <h2 className={classes.exampleTitle}>見本<span className={classes.annotation}>（※初めての方は必ずご覧ください）</span> </h2>
                        <img className={classes.exampleImage} src="../OK.png" alt="" />
                        <p className={classes.exampleDescription}>上の画像のように、Nintendo Switchのスクリーンショット機能を使った画像を使用します。<br />右下のエリアに<img className={classes.cursor} src="../cursor.png" alt="" /> を置かないでください。（読み取れない可能性があります。）</p>
                    </div>
                </div>
            </div>
        </div>
        )
    }

export default MyPage