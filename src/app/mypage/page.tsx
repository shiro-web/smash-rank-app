"use client";

import React, { useContext, useEffect, useRef, useState } from 'react';
import Tesseract from "tesseract.js";
import Cropper, { ReactCropperElement } from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import classes from "./page.module.scss";
import { serverTimestamp,FieldValue, doc, setDoc, collection, query, where, onSnapshot, Timestamp } from 'firebase/firestore';
import { db } from '@/firebase';
import AppContext from '@/context/AppContext';
import {Button} from "@mui/material";
import CloudUploadIcon from '@mui/icons-material/Logout';


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

const MyPage = () => {
    const {user} = useContext(AppContext);
    const [url,setUrl] = useState<string>();
    const [newUrl,setNewUrl] = useState<string>();
    const fileInputRef = useRef<HTMLInputElement>();
    const cropperRef = useRef<ReactCropperElement>();
    const [newPower,setNewPower] = useState<number>();
    const [datas,setDatas] = useState<Ranks[]>([]);

    // useEffect(() => {
    //     console.log(user)
    //     const fetchRanks = async () => {
    //       const rankDocRef = doc(db,"ranks",user!.uid);
    //       const unsubscribe = onSnapshot(rankDocRef,(snapshot) => {
    //         const newRank = snapshot.docs.map((doc) => doc.data() as Ranks)
    //         setDatas(newRank);
    //       });
    //       return() => {
    //         unsubscribe();
    //     };
    //     };
    //     fetchRanks()
    //   },[])
    
    const handleFileChange = () => {
        const fileInput = fileInputRef.current;
        if (fileInput && fileInput.files && fileInput.files.length > 0) {
            const selectedFile = fileInput.files[0];
            const imageUrl = URL.createObjectURL(selectedFile);
            setUrl(imageUrl);
            console.log("ok")
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
                return newPower;
            }else{
                alert("例にならって画像を投稿してください")
                return;
            }
        }catch(e){
            console.log(e)
            return;
        }
    };

    const onCrop = () => {
        const cropper = cropperRef.current?.cropper;
        cropper?.setCropBoxData({left:599,top:308, width:30, height:30})
        const canvas = cropper?.getCroppedCanvas();
        const data = canvas?.toDataURL();
        setNewUrl(data);
        return newUrl;
      };

    const handleSubmit = async(e:React.FormEvent) => {
        e.preventDefault();
        convertImagetoText();
        onCrop();
        console.log(newUrl)
        if(user && newPower && newUrl){
            const docRef = doc(db,"ranks",user.uid);
            const datas:Data = {
                character:newUrl,
                createdAt:serverTimestamp(),
                id:user.uid,
                name:user.displayName,
                power:newPower,
                userImage:user.photoURL,
            }
            console.log("mae")
                await setDoc(docRef,datas)
            
        }
    }

   
      
    
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
                <div>
                    <img className={classes.authImage} src={user?.photoURL} alt="" />
                </div>
                <p className={classes.authName}>{user?.displayName}</p>
                <div>
                    <div className={classes.powerWrapper}>
                        <h3 className={classes.powerCaption}>世界戦闘力</h3>
                        <p className={classes.power}>14000000</p>
                    </div>
                    <div className={classes.rankWrapper}>
                        <h3 className={classes.rankCaption}>ランキング</h3>
                        <p className={classes.rank}><span className={classes.rankSpan}>1</span>位/100000</p>
                    </div>
                </div>
            </div>
            <form className={classes.form} action="" onSubmit={handleSubmit}>
                <img src={url ? url : ""} alt="" accept=".png, .jpeg, .jpg" ref={cropperRef} className={classes.Url}/>
                <Button className={classes.fileButton} color="inherit" component="label" variant="contained" startIcon={<CloudUploadIcon />}>
                    <label>
                        <input className={classes.file} type="file" onChange={handleFileChange} ref={fileInputRef}/>ファイルを選択
                    </label>
                </Button>
                {url ? (<button className={classes.submit} type='submit'>送信</button>) : null}
                
            </form>
            <img src={newUrl ? newUrl : ""} alt="" 
            className={classes.newUrl}
            />
        </div>
        )
    }

export default MyPage