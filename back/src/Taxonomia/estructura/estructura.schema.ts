import { Schema } from "mongoose";

export const estructuraSchema = new Schema({
    nombre: {
        type: String,
        required: true        
    },   
    tipo: {
        type: Schema.Types.ObjectId, ref: "tipoEstructura" ,
        required: true
    },  
    padre: { type: Schema.Types.ObjectId, ref: "estructura" }, 
    tieneHijos:{
        type:Boolean,
        default:false,
    },   
    activo:{
        type:Boolean,
        default:true,
    } 
},{timestamps:true});