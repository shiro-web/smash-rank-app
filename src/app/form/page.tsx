"use client"

import React, { useEffect } from 'react';
import classes from "./page.module.scss";
import { useForm } from "react-hook-form";
import toast, { Toaster } from 'react-hot-toast';

type Inputs = {
    email:string;
    content: string;
  }

const Form = () => {
    const {
        register,
        handleSubmit,
        formState: {isSubmitSuccessful,isSubmitting, errors },
      } = useForm<Inputs>()
      const onSubmit = async(values: any) => {
        const {email,content} = values;
        try{
          await fetch("http://localhost:3000/api/send",{
            method:"POST",
            headers:{
              "Content-Type":"application/json"
            },
            body:JSON.stringify({email,content})
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
            <label htmlFor="email" className={classes.labelEmail}>メールアドレス</label>
            <input type='email'  className={classes.inputEmail} id="email" 
            {...register("email" ,{
              required:"メールアドレスは必須です。",
              maxLength:{value:140,message:"140文字以内で入力してください。"},
              pattern: {
                value: /^[^^＾"”`‘'’<>＜＞_＿%$#＆％＄|￥]+$/,
                message: '特殊文字を使用しないでください'
              }})} />
            {errors.email && <p className={classes.caution}>{errors.email?.message}</p>}
            <label htmlFor="content" className={classes.labelContent}>お問い合わせ内容</label>
            <textarea  id='content' className={classes.inputContent}
             {...register("content" , { 
              required: "お問い合わせ内容を入力してください。" ,
              minLength:{value:10,message:"10文字以上で入力してください。"},
              maxLength:{value:150,message:"150文字以内で入力してください。"},
              pattern: {
                value: /^[^^＾"”`‘'’<>＜＞_＿%$#＆％＄|￥]+$/,
                message: '特殊文字を使用しないでください'
              }})
             }/>
            {errors.content && <p className={classes.caution}>{errors.content?.message}</p>}
            <button type='submit' className={classes.sendButton} disabled={isSubmitting}>{isSubmitting ? "送信中" : "送信"}</button>
        </form>
    </div>
  )
}

export default Form