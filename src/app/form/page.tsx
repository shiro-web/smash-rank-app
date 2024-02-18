import React from 'react';
import classes from "./page.module.scss";

const Form = () => {
  return (
    <div>
        <form className={classes.form}>
            <label htmlFor="content" className={classes.labelContent}>お問い合わせ内容</label>
            <input type="textarea" id='content' className={classes.inputContent}/>
            <button className={classes.sendButton}>送信</button>
        </form>
    </div>
  )
}

export default Form