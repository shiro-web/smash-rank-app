"use client";

import React, { useEffect, useState } from 'react';
import classes from "./Opening.module.scss";
import { useRouter } from 'next/navigation';

const Opening = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        //セッションストレージで初回訪問かどうかを判定
        const handleReload = () => {
          setIsLoading(true);
          setTimeout(() => {
            setIsLoading(false);
          }, 2000);
          return
        };
        return () => {
          handleReload()
        };
      }, [])
  return (
    <div>
      {isLoading ? (<div className={classes.openingWrapper} id="fadeInBox">
        <img src="/opening.png" className={classes.opening}  alt="" />
      </div>)
      :
      (<div className={classes.openingHiddenWrapper} id="fadeInBox">
      </div>)}
      
    </div>
  )
}

export default Opening