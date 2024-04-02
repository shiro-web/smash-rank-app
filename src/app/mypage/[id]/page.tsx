"use client";

import React, { useContext, useEffect, useRef, useState } from 'react';
import Tesseract from "tesseract.js";
import Cropper, { ReactCropperElement } from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import classes from "./page.module.scss";
import { serverTimestamp, doc, setDoc, collection, query, onSnapshot, orderBy, getDoc, getCountFromServer, FieldValue } from 'firebase/firestore';
import { auth, db } from '@/firebase';
import AppContext from '@/context/AppContext';
import {Button} from "@mui/material";
import CloudUploadIcon from '@mui/icons-material/Logout';
import Link from 'next/link';
import toast, { Toaster } from 'react-hot-toast'
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { PNG } from 'pngjs';
import pixelmatch from 'pixelmatch';
import TwitterShareButton from '@/components/TwitterShareButton';
import localCharacters from '@/characters';
import { onAuthStateChanged } from 'firebase/auth';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';import Chart from '@/components/Chart';
;

export type Data = {
    userName:string;
    characterName:string;
    character:string;
    createdAt:FieldValue;
    id:string;
    name:string;
    power:number;
    userImage:string;
}

const MyPage = ({params}:{params:{id:string}}) => {
    const router = useRouter();
    const {user,userName,setUserName} = useContext(AppContext);
    const [url,setUrl] = useState<string>();
    const [newUrl,setNewUrl] = useState<string>();
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const cropperRef = useRef<ReactCropperElement>(null);
    const [newPower,setNewPower] = useState<number | null>(null);
    const [count,setCount] = useState<number>(0);
    const [datas,setDatas] = useState<Data[]>([]);
    const [list,setList] = useState<Data[]>([]);
    const [done,setDone] = useState<boolean>(false);
    const [numDiffPixels, setNumDiffPixels] = useState<number>();
    const [characterImage,setCharacterImage] = useState<string>();
    const [characterName,setCharacterName] = useState<string>();
    const [anonymous,setAnonymous] = useState<boolean>(true);
    const [limit,setLimit] = useState<number>(15000000);
    const [newUserName,setNewUserName] = useState<string | null>(() => {
        const localUserName = localStorage.getItem("userName");
        return localUserName
});

    useEffect(() => {
        onAuthStateChanged(auth,(user) => {
            if(user && userName){
                localStorage.setItem('userName', userName!);
                setNewUserName(userName)
            }else{
               
            }
        })
    },[])

    useEffect(() => {
        const interval = setInterval(() => {
          // 毎日0時にlimitを4320増やす
          const now = new Date();
          if (now.getHours() === 0 && now.getMinutes() === 0) {
            setLimit(prevLimit => prevLimit + 4320);
          }
        }, 60000); // 1分ごとにチェック
    
        return () => clearInterval(interval); // コンポーネントがアンマウントされるときにクリアする
      }, []); // 初回のみ実行

    useEffect(() => {
        if(!user){
            router.push("/");
            return;
        }
        const fetchRanks = async () => {
          const rankDocRef = doc(db,"ranks",params.id);
          const rankData = await getDoc(rankDocRef);
          setDatas([rankData.data() as Data]);
        };

        fetchRanks()
      },[done,params.id, router, user])

      useEffect(() => {
        if(!user){
            return;
        }
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

      const handleChecked = (anonymous:boolean) => {
        setAnonymous(!anonymous);
      }
      
    const handleFileChange = () => {
        const fileInput = fileInputRef.current;

        if (fileInput && fileInput.files && fileInput.files.length > 0) {
            const selectedFile = fileInput.files[0];
            const imageUrl = URL.createObjectURL(selectedFile);
            setUrl(imageUrl);
        }
    };
    
    const convertImagetoText = async () => {
        const worker = await Tesseract.createWorker('eng');
        const rectangle = { left: 1000, top: 545, width: 200, height: 80 };
        const { data: { text } } = await worker.recognize(url!,{rectangle});
        
        const power = parseInt(text.replace(/,/g, ''), 10);

        try{
            if(power > 1000000 && power < limit ){
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

      const loadImage = async (src: string | URL | Request) => {
        const response = await fetch(src);
        const arrayBuffer = await response.arrayBuffer();
        return Buffer.from(arrayBuffer);
      };

      const compareImages = async (userPostImage:string) => {
        for (let i = 0; i < localCharacters.length; i++) {
  
          const img1Data = await loadImage(`/${localCharacters[i]}`);
          const img2Data = await loadImage(userPostImage);
          
          const img1 = PNG.sync.read(img1Data);
          const img2 = PNG.sync.read(img2Data);
          
          const { width, height } = img1;
          const diff = new PNG({ width, height });
          
          const diffPixels = pixelmatch(
          img1.data,
          img2.data,
          diff.data,
          width,
          height,
          { threshold: 0.1 }
          );
          setNumDiffPixels(diffPixels);
          if (diffPixels < 1010) {
            setCharacterImage(localCharacters[i]);
            setCharacterName(localCharacters[i].slice(0, -4));
            return localCharacters[i].slice(0, -4)
          } 
        };
      }
  

      const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setDone(false);
        toast.loading("投稿中です。10秒ほどお待ちください。",{id:"1"})
        try {
            const power = await convertImagetoText();
            const croppedUrl = await onCrop();
            const characterName = await compareImages(croppedUrl!);
            if(!characterName){
                alert("適切な画像を投稿してください")
                toast.error("投稿に失敗しました。",{id:"1"})
            }
            if (user && power && croppedUrl && user.displayName && user.photoURL && characterName && newUserName) {
                
                const docRef = doc(db, "ranks", user.uid);
                const datas: Data = {
                    userName:anonymous ? "anonymous" : newUserName,
                    characterName:anonymous ? "anonymous" : characterName,
                    character: anonymous ? "anonymous" : croppedUrl,
                    createdAt: serverTimestamp(),
                    id: user.uid,
                    name: anonymous ? "anonymous" : user.displayName,
                    power: power,
                    userImage:  anonymous ? "anonymous" : user.photoURL,
                };
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
    
    const index = datas.length > 0 ? getIndex(datas[0]?.power, list) + 1 : -1;
    const topNumber = count > 0 ? Math.floor((index / count) * 1000) / 10 : 0;
    const modifiedPhotoURL = user && user.photoURL ? user.photoURL.replace("normal", "200x200") : "";
console.log( user?.photoURL)
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
                    {/* <p className={classes.pageTitle}>マイページ</p> */}
                    <div>
                        {user && (<Image className={classes.authImage} src={user.photoURL || ""} alt="" width={48} height={48}/>)}
                    </div>
                    <p className={classes.authName}>{user ? user.displayName : null}</p>
                </div>
                <div className={classes.userAreaBody}>
                    <div>
                        {/* <Link href={"/"} className={classes.topLink}><span className={classes.top}>トップページに戻る</span></Link> */}
                        {datas.length > 0 && datas[0]?.power ?  
                        (<>
                        <div className={classes.dataWrapper}>
                            <div className={classes.rankWrapper}>
                                <Chart topNumber={topNumber}/>
                                <div className={classes.rank}>
                                    <h3 className={classes.rankCaption}>順位</h3>
                                    <p className={classes.rankNumber}><span className={classes.rankSpan}>{index}位</span>/{count}人中</p>
                                </div>
                            </div>
                            <div className={classes.powerWrapper}>
                                <img className={classes.powerImage} src="/powerIcon.png" alt=""/>
                                <div className={classes.power}>
                                    <h3 className={classes.powerCaption}>世界戦闘力</h3>
                                    <p className={classes.powerNumber}>{datas[0]?.power.toLocaleString()}</p>
                                </div>
                            </div>
                        </div> 
                            <div className={classes.TwitterShareButton}>
                                <TwitterShareButton index={index} count={count}/>
                            </div>
                        </>
                        ) : 
                        <p className={classes.emptyState}>はじめまして！<br/> 画像を投稿して、ランキングに参加しましょう！</p>}
                    </div>
                    <form className={classes.form} action="" onSubmit={handleSubmit}>
                        <Button className={classes.fileButton} color="inherit" component="label" variant="contained" startIcon={<CloudUploadIcon />}>
                                <input className={classes.file} type="file" onChange={handleFileChange} ref={fileInputRef} accept=".png, .jpeg, .jpg"/>画像アップロード
                        </Button>
                        <div className={classes.anonymousWrapper}>
                            <div className={classes.checkbox}>
                                <input type="checkbox" className={classes.anonymous} id='anonymous' defaultChecked={true} checked={anonymous} disabled={false} onChange={(e) => handleChecked(anonymous)}/>
                                <label htmlFor='anonymous'>匿名を希望します</label>
                            </div>
                            {/* <p>チェックを入れた状態で画像を投稿すると、匿名でランキングに参加することができます。</p> */}
                        </div>
                        <img src={url ? url : ""} alt="" ref={cropperRef} className={classes.Url}/>
                        {url ? (<button className={classes.submit} type='submit'>送信する</button>) : null} 
                        <Link href={"/info"} className={classes.info}><HelpOutlineIcon style={{fontSize:"16px"}} className={classes.helpIcon}/> 画像が投稿できないとき</Link>
                    </form>
                    <Image src={newUrl ? newUrl : ""} alt="" className={classes.newUrl} width={50} height={50}/>
                    <div className={classes.example}>
                        <h2 className={classes.exampleTitle}>見本<span className={classes.annotation}>（※初めての方は必ずご覧ください）</span> </h2>
                        <Image className={classes.exampleImage} src="/OK.png" alt="OK例" width={675} height={380} layout="responsive"/>
                        <p className={classes.exampleDescription}>上の画像のように、Nintendo Switchのスクリーンショット機能を使った画像を使用します。<br />右下のエリアに<Image className={classes.cursor} src="/cursor.png" alt="" width={24} height={24}/> を置かないでください。（読み取れない可能性があります。）</p>
                    </div>
                </div>
            </div>
            
        </div>
        )
    }

export default MyPage