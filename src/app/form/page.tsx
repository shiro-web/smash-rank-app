"use client"

import React from 'react';
import classes from "./page.module.scss";
import { useForm, SubmitHandler } from "react-hook-form";
type Inputs = {
    content: string;
  }

const Form = () => {
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
      } = useForm<Inputs>()
      const onSubmit: SubmitHandler<Inputs> = (data) => console.log(data);


  return (
    <div>
        <form className={classes.form} onSubmit={handleSubmit(onSubmit)}>
            <h2 className={classes.formTitle}>お問い合わせ</h2>
            <label htmlFor="content" className={classes.labelContent}>お問い合わせ内容</label>
            <input type="textarea" id='content' className={classes.inputContent} {...register("content" , { required: "お問い合わせ内容を入力してください。" ,minLength:{value:10,message:"10文字以上で入力してください。"}})}/>
            {errors.content && <p className={classes.caution}>{errors.content?.message}</p>}
            <button type='submit' className={classes.sendButton}>送信</button>
        </form>
    </div>
  )
}

export default Form