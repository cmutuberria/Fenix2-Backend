import { Schema } from "mongoose";

export const especieSchema = new Schema({
    nombre: {
        type: String,
        required: true
    },
    estructura: { type: Schema.Types.ObjectId, ref: "estructura" },    
    clasificador: { type: Schema.Types.ObjectId, ref: "colector" },
    origen: {type: String},
    categoria_UICN: {type: String},
    anno_clasificacion: {type: String},
    sinonimias: [{type:String}],
    nombres_comunes: [{type:String}],
    usos: [{type: Schema.Types.ObjectId, ref: "uso"}],
    activo:{
        type:Boolean,
        default:true,
    }
   
},{timestamps:true});





