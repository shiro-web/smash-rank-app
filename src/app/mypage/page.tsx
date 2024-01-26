"use client";
import { create } from 'domain';
import React, { useEffect, useRef, useState } from 'react';
import Tesseract, { createWorker } from "tesseract.js";
import Cropper, { ReactCropperElement } from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import classes from "./page.module.scss";



const MyPage = () => {
    const [url,setUrl] = useState<string | null>(null);
    const [newurl,setNewUrl] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const cropperRef = useRef<ReactCropperElement>(null);

    
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
        const { data: { text } } = await worker.recognize(url,{rectangle});
        console.log(text);
        await worker.terminate();
    };

    const onCrop = () => {
        const cropper = cropperRef.current?.cropper;
        cropper?.setCropBoxData({left:600,top:308, width:30, height:30})
        let canvas = cropper!.getCroppedCanvas();
        
        let data = canvas.toDataURL();
        setNewUrl(data)
      };

    const handleSubmit = (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        convertImagetoText();
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
            crop={onCrop}
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
        <img src={newurl ? newurl : ""} alt="" 
        // className={classes.newUrl}
        />
    </div>
  )
}

export default MyPage