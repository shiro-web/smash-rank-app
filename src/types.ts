import { FieldValue, Timestamp } from "firebase/firestore";

export type Data = {
    character:string;
    createdAt:FieldValue;
    id:string;
    name:string;
    power:number;
    userImage:string;
}