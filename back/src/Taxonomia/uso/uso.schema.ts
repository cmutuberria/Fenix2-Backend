import { Schema } from "mongoose";

export const usoSchema = new Schema({
    nombre: {
        type: String,
        required: true
    },   
    activo:{
        type:Boolean,
        default:true,
    } 
},{timestamps:true});
