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
    img_individuo:{type:String},
    img_herbario:{type:String},
    f_floracion:[{type:String}],
    f_fructificacion:[{type:String}],
    f_hojas_desarrollo:[{type:String}],
    f_brotes_floreales:[{type:String}],
    f_observaciones:{type:String},
    habitat:{type:String},
    amenazas:{type:String},
    galeria:[{type:String}],
    activo:{
        type:Boolean,
        default:true,
    }
   
},{timestamps:true});





