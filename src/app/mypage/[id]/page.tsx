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
import { PNG } from 'pngjs';
import pixelmatch from 'pixelmatch';

type Data = {
    characterName:string;
    character:string;
    createdAt:FieldValue;
    id:string;
    name:string;
    power:number;
    userImage:string;
}

const MyPage = ({params}:{params:{id:string}}) => {
    const localCharacter = ["banjo_and_kazooie.png","bayonetta.png","bowser.png","bowser_jr.png","byleth.png","captain_falcon.png","chrom.png","cloud.png","corrin.png","daisy.png","dark_pit.png","dark_samus.png","diddy_kong.png","donkey_kong.png","dr_mario.png","duck_hunt.png","falco.png","fox.png","ganondorf.png","greninja.png","hero.png","homura.png","ice_climber.png","ike.png","incineroar.png","inkling.png","isabelle.png","jigglypuff.png","joker.png","kazuya.png","ken.png","king_dedede.png","king_k_rool.png","kirby.png","link.png","little_mac.png","lucario.png","lucas.png","lucina.png","luigi.png","mario.png","marth.png","megaman.png","metaknight.png","mewtwo.png","mii_brawler.png","mii_gunner.png","mii_swordfighter.png","minmin.png","mr_game_and_watch.png","ness.png","olimar.png","pacman.png","palutena.png","peach.png","pichu.png","pikachu.png","piranha_plant.png","pit.png","pokemon_trainer.png","richter.png","ridley.png","rob.png","robin.png","rosalina_luma.png","roy.png","ryu.png","samus.png","sephiroth.png","sheik.png","shulk.png","simon.png","snake.png","sonic.png","sora.png","steve.png","terry.png","toon_link.png","villager.png","wario.png","wii_fit_trainer.png","wolf.png","yoshi.png","young_link.png","zelda.png","zero_suit_samus.png"]
    const router = useRouter();
    const {user} = useContext(AppContext);
    const [url,setUrl] = useState<string>();
    const [newUrl,setNewUrl] = useState<string>();
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const cropperRef = useRef<ReactCropperElement>(null);
    const [newPower,setNewPower] = useState<number | null>(null);
    const [count,setCount] = useState<number>();
    const [datas,setDatas] = useState<Data[]>([]);
    const [list,setList] = useState<Data[]>([]);
    const [done,setDone] = useState<boolean>(false);
    const [numDiffPixels, setNumDiffPixels] = useState<number>();
    const [characterImage,setCharacterImage] = useState<string>();
    const [characterName,setCharacterName] = useState<string>();

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
            if(power > 1000000 && power < 14180000 ){
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
        for (let i = 0; i < localCharacter.length; i++) {
  
          const img1Data = await loadImage(`/${localCharacter[i]}`);
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
          
          if (diffPixels < 200) {
            setCharacterImage(localCharacter[i]);
            setCharacterName(localCharacter[i].slice(0, -4));
            return localCharacter[i].slice(0, -4)
          } 
        };
      }
  

      const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setDone(false);
        toast.loading("投稿中です。",{id:"1"})
        try {
            const power = await convertImagetoText();
            const croppedUrl = await onCrop();
            const characterName = await compareImages(croppedUrl!);
            if(!characterName){
                alert("適切な画像を投稿してください")
                toast.error("投稿に失敗しました。",{id:"1"})
            }
            if (user && power && croppedUrl && user.displayName && user.photoURL && characterName) {
                
                const docRef = doc(db, "ranks", user.uid);
                const datas: Data = {
                    characterName:characterName,
                    character: croppedUrl,
                    createdAt: serverTimestamp(),
                    id: user.uid,
                    name: user.displayName,
                    power: power,
                    userImage: user.photoURL,
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
                            <p className={classes.power}>{datas.length > 0 ? datas[0]?.power.toLocaleString() : "N/A"}</p>
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