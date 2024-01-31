import {  Timestamp } from "firebase/firestore";

export type Data = {
    character:string;
    createdAt:Timestamp;
    id:string;
    name:string;
    power:number;
    userImage:string;
}