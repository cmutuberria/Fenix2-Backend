import { Schema } from "mongoose";

export const amenazaSchema = new Schema({
    nombre: {
        type: String,
        required: true
    },    
    tipo: {
        type: Boolean,//1 amenaza, 0 estrés 
        default:true
    },
    activo: {
        type: Boolean,
        default:true
    },
},{timestamps:true});
