import { Schema } from "mongoose";

export const institucionSchema = new Schema({
    nombre: {
        type: String,
        required: true
    },
    tipo_coleccion: {
        type: String,
        required: true
    },
    pais: { type: Schema.Types.ObjectId, ref: "pais" },
    es_privado:{
        type:Boolean,
        default:true,
    },
    email: {
        type: String,
    },
    telefono: {
        type: String,
    },
    direccion: {
        type: String,
    },    
    activo:{
        type:Boolean,
        default:true,
    }
   
},{timestamps:true});





