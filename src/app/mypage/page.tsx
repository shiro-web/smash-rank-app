"use client";
import { create } from 'domain';
import React, { useEffect, useRef, useState } from 'react';
import Tesseract, { createWorker } from "tesseract.js";
import Cropper, { ReactCropperElement } from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import classes from "./page.module.scss";
import { Timestamp, addDoc, collection, serverTimestamp,FieldValue } from 'firebase/firestore';
import { db } from '@/firebase';

type Data = {
    character:string;
    createdAt:FieldValue;
    id:string;
    name:string;
    power:number;
    userImage:string;
}

const MyPage = () => {
    const [url,setUrl] = useState<string | null>(null);
    const [newUrl,setNewUrl] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const cropperRef = useRef<ReactCropperElement>(null);
    const [newPower,setNewPower] = useState<number>();

    
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
        cropper?.setCropBoxData({left:600,top:308, width:30, height:30})
        let canvas = cropper!.getCroppedCanvas();
        let data = canvas.toDataURL();
        setNewUrl(data);
        return newUrl;
      };

    const handleSubmit = async(e: { preventDefault: () => void; }) => {
        e.preventDefault();
        convertImagetoText();
        onCrop();
        if(newPower && newUrl){
            const docRef = collection(db,"ranks");
            const data:Data = {
                character:newUrl,
                createdAt:serverTimestamp(),
                id:"a",
                name:"a",
                power:newPower,
                userImage:"ss",
            }
                await addDoc(docRef,data)
            
        }
    }
    
    return (
        <div>
            <Cropper
            // className={classes.cropper}
            src={url ? url : ""}
            style={{ height: 400, width: 900 }}
            // Cropper.js options
            initialAspectRatio={1 / 1}
            guides={false}
            ref={cropperRef}
            movable={false}
            />
        <form action="" onSubmit={handleSubmit}>
            <input type="file" onChange={handleFileChange} ref={fileInputRef}/>
            <button type='submit'>送信</button>
        </form>
        <img src={url ? url : ""} alt="" ref={cropperRef}
        className={classes.Url}
        />
        <img src={newUrl ? newUrl : ""} alt="" 
        // className={classes.newUrl}
        />
    </div>
  )
}

export default MyPage