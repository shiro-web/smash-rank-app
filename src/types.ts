import { Timestamp } from "firebase/firestore";

export type Data = {
    userName:string;
    characterName:string;
    character:string;
    createdAt:Timestamp;
    id:string;
    name:string;
    power:number;
    userImage:string;
}