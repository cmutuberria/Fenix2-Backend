import { Schema } from "mongoose";

export const paisSchema = new Schema({
    nombre: {
        type: String,
        required: true
    },
    sigla: {
        type: String,
        required: true
    },
},{timestamps:true});
