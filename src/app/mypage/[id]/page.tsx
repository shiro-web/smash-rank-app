"use client";

import React, { useContext, useEffect, useRef, useState } from 'react';
import Tesseract from "tesseract.js";
import Cropper, { ReactCropperElement } from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import classes from "./page.module.scss";
import { serverTimestamp, doc, setDoc, collection, query, onSnapshot, orderBy, getDoc, getCountFromServer, FieldValue, where, getDocs } from 'firebase/firestore';
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
    const [characterDatas,setCaracterDatas] = useState<Data[]>([]);
    const [list,setList] = useState<Data[]>([]);
    const [characterList,setCharacterList] = useState<Data[]>([]);
    const [done,setDone] = useState<boolean>(false);
    const [numDiffPixels, setNumDiffPixels] = useState<number>();
    const [characterImage,setCharacterImage] = useState<string>();
    const [characterName,setCharacterName] = useState<string>();
    const [anonymous,setAnonymous] = useState<boolean>(true);
    const [limit,setLimit] = useState<number>(100000000);
    const [characterRank,setCharacterRank] = useState<number>();
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
            router.push("/");
            return;
        }
        const fetchRanks = async () => {
            const rankDocRef = doc(db, "ranks", params.id);
            const rankData = await getDoc(rankDocRef);
    
            const rankCollectionRef = collection(db, "ranks");
            const q = query(rankCollectionRef, where("characterName", "==", rankData.data()?.characterName), orderBy("power", "desc"));
            const rankCount = await getCountFromServer(q);
            setDatas([rankData.data() as Data]);
            const newCount = rankCount.data().count;
            setCharacterRank(newCount)
            onSnapshot(q,(snapshot) => {
                const newCharacterRank = snapshot.docs.map((doc) => doc.data() as Data)
                setCharacterList(newCharacterRank);
              });
        };

        fetchRanks()
      },[done,params.id, router, user,datas])


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
                return arr.indexOf(arr[i]);
            }
        }
        return -1; //値が存在しなかったとき
    }

    const index = datas.length > 0 ? getIndex(datas[0]?.power, list) + 1 : -1;
    const topNumber = count > 0 ? Math.floor((index / count) * 1000) / 10 : 0;
    const characterIndex = datas.length > 0 ? getIndex(datas[0]?.power, characterList) + 1 : -1;
    
    // const modifiedPhotoURL = user && user.photoURL ? user.photoURL.replace("_normal", "200x200") : "";
    return (
        <div className={classes.container}>
            <Toaster />
            <Cropper
            className={classes.cropper}
            src={url ? url : ""}
            style={{ height: 400, width: 900 }}
            ref={cropperRef}
            />
           
            <div className={classes.userArea}>
                <div className={classes.userAreaHead}>
                    <Link href={"../"} className={classes.backButoon}>
                        <img className={classes.arrow} src="/right-arrow.png" alt="" />
                        <p className={classes.backButtonText}>ランキング一覧へ</p>
                    </Link>
                    <p className={classes.pageTitle}>マイページ</p>
                    <div>
                        {user && (<Image className={classes.authImage} src={user.photoURL || ""} alt="" width={48} height={48}/>)}
                    </div>
                    <p className={classes.authName}>{user ? user.displayName : null}</p>
                </div>
                <div className={classes.userAreaBody}>
                    <div>
                        {/* <Link href={"/"} className={classes.topLink}><span className={classes.top}>トップページに戻る</span></Link> */}
                        <div className={classes.characterArea}>
                            {datas.length > 0 ?
                            (
                            <div className={classes.characterWrapper}>
                                <div className={classes.characterData}>
                                    <Link href={`/fighter/${datas[0].characterName}`}><Image className={classes.characterImg} src={datas[0].character == "anonymous" ? "/Anonymous.png" : datas[0].character} width={38} height={38} alt="使用キャラクター"/></Link>
                                    <div className={classes.characterText}>
                                        <p className={classes.charactertitle}>キャラ内順位</p>
                                        <p className={classes.characterRank}><span className={classes.characterSpan}>{characterIndex}位</span>/{characterRank}人中</p>
                                    </div>
                                </div>
                                <Link href={"/fighters"} className={classes.characterLink}>
                                    <img className={classes.icon} src="/crown-icon.png" alt="" />
                                    <p className={classes.characterLinkText}>キャラごとのランキング</p>
                                    <img className={classes.arrow} src="/right-arrow.png" alt="" />
                                </Link>
                            </div>
                            )
                        :
                        null
                        }
                        </div>
                        {datas.length > 0 && datas[0]?.power ?  
                        (<>
                        {/* <Link href={"#usage"} className={classes.usageLink}>
                            <img className={classes.arrow} src="/bottom-arrow.png" alt="" />
                            <p className={classes.backButtonText}>使い方</p>
                        </Link> */}
                        <div className={classes.dataWrapper}>
                            <div className={classes.rankWrapper}>
                            <h3 className={classes.rankCaption}>全体順位</h3>
                                <Chart topNumber={topNumber}/>
                                <div className={classes.rank}>
                                    <p className={classes.rankNumber}><span className={classes.rankSpan}>{index}位</span>/{count}人中</p>
                                </div>
                            </div>
                            <div className={classes.powerWrapper}>
                                <h3 className={classes.powerCaption}>世界戦闘力</h3>
                                <img className={classes.powerImage} src="/powerIcon.png" alt=""/>
                                <div className={classes.power}>
                                    <p className={classes.powerNumber}>{datas[0]?.power.toLocaleString()}</p>
                                </div>
                            </div>
                        </div> 
                            <div className={classes.TwitterShareButton}>
                                <TwitterShareButton index={index} count={count}/>
                            </div>
                        </>
                        ) : 
                        <div>
                            <Image className={classes.characterImg} src="/first-time.png" width={300} height={300} alt="使用キャラクター"/>
                            <p className={classes.emptyState}>はじめまして！<br/> 画像を投稿して、ランキングに参加しましょう！</p>
                        </div>
                        }
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
                    <div className={classes.example} id='usage'>
                        <h1 className={classes.title}>当サイトの使い方</h1>
                        <div className={classes.infoWrapper}>
                            <h2 className={classes.info}>① 写真を撮る</h2>
                            <p className={classes.description}>オンライン対戦時のキャラクターセレクト画面に遷移します。（以下の画像参考）Nintendo Switchのスクリーンショット機能を使って、写真を撮ります。</p>
                            <Image className={classes.usageImage} src="/usage.png" alt="セレクト画面" width={675} height={380} layout='responsive'/>
                            <p className={classes.exampleDescription}>上の画像のように、右下のエリアに<Image className={classes.cursor} src="/cursor.png" alt="" width={24} height={24}/> を置かないでください。（読み取れない可能性があります。）</p>
                        </div>
                        <div className={classes.infoWrapper}>
                            <h2 className={classes.info}>② 当サイトでX(旧Twitter)ログインをする</h2>
                            <p className={classes.description}>当サイトでX(旧Twitter)ログインをします。<br />ログインをすると、自動的にマイページに飛びます。</p>
                            {/* <Image className={classes.mypageImage} src="/mypage.png" alt="OK例" width={675} height={380} layout='responsive'/> */}
                        </div>
                        <div className={classes.infoWrapper}>
                            <h2 className={classes.info}>③画像を投稿する</h2>
                            <p className={classes.description}>①で撮ったスクリーンショットをマイページの「投稿する画像を選ぶ」ボタンから投稿します<br />画像を投稿すると、自動的にランキングに反映されます。</p>
                        </div>
                    </div>
                </div>
            </div>
            
        </div>
        )
    }

export default MyPage