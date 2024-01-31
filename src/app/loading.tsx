import React from 'react';
import { CircularProgress } from '@mui/material';
import classes from "./loading.module.scss";


const Loading = () => {
  return (
    <div className={classes.loading}>
        <CircularProgress />
    </div>
  )
}

export default Loading