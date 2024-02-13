"use client";

import React, { useEffect, useState } from 'react';
import classes from "./Opening.module.scss";

const Opening = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
      
          setIsLoading(true);
          setTimeout(() => {
            setIsLoading(false);
          }, 3000);
      
       
      }, [])
      
  return (
    <div>
      {isLoading ? 
      (<div className={classes.openingWrapper} id="fadeInBox">
        <img src="/opening.png" className={classes.opening}  alt="" />
      </div>
      )
      :
      (<div className={classes.openingHiddenWrapper} id="fadeInBox">
       </div>
       )}
      
    </div>
  )
}

export default Opening