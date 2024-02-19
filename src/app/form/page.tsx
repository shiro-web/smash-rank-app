"use client"

import React, { useContext, useEffect, useState } from 'react';
import classes from "./page.module.scss";
import { useForm, SubmitHandler } from "react-hook-form";
import AppContext from '@/context/AppContext';
import toast, { Toaster } from 'react-hot-toast';

type Inputs = {
    uid:string;
    content: string;
  }

const Form = () => {
  const {user} = useContext(AppContext);
  const [success,setSuccess] = useState()
    const {
        register,
        handleSubmit,
        watch,
        formState: {isSubmitSuccessful,isSubmitting, errors },
      } = useForm<Inputs>()
      const onSubmit: SubmitHandler<Inputs> = async(values: any) => {
        console.log("happy")
        const {uid,content} = values;
        try{
          await fetch("http://localhost:3000/api/send",{
            method:"POST",
            headers:{
              "Content-Type":"application/json"
            },
            body:JSON.stringify({uid,content})
          });
        }catch(error){
          console.error(error)
        }
      };

      useEffect(() => {
        if(isSubmitSuccessful){
          toast.success('送信に成功しました');
        }
      },[isSubmitSuccessful])

  return (
    <div>
        <Toaster />
        <form className={classes.form} onSubmit={handleSubmit(onSubmit)} >
            <h2 className={classes.formTitle}>お問い合わせ</h2>
            <div className={classes.formHidden}>
              <label htmlFor="uid" className={classes.labelUid}>ユーザーID</label>
              <input type='text' defaultValue={user?.uid}  className={classes.uid} id="uid" {...register("uid" ,{required:true})} />
            </div>
            <label htmlFor="content" className={classes.labelContent}>お問い合わせ内容</label>
            <textarea  id='content' className={classes.inputContent}
             {...register("content" , { 
              required: "お問い合わせ内容を入力してください。" ,
              minLength:{value:10,message:"10文字以上で入力してください。"},
              maxLength:{value:150,message:"150文字以内で入力してください。"}})
             }/>
            {errors.content && <p className={classes.caution}>{errors.content?.message}</p>}
            <button type='submit' className={classes.sendButton} disabled={isSubmitting}>{isSubmitting ? "送信中" : "送信"}</button>
        </form>
    </div>
  )
}

export default Form