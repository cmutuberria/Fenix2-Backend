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
    activo:{
        type:Boolean,
        default:true,
    }, 

    clasificador: { type: Schema.Types.ObjectId, ref: "colector" },
    origen: {type: String},
    categoria_UICN: {type: String},
    anno_clasificacion: {type: String},
    sinonimias: [{type:String}],
    nombres_comunes: [{type:String}],
    usos: [{type: Schema.Types.ObjectId, ref: "uso"}]
},{timestamps:true});