import { Schema } from "mongoose";

export const tipoEstructuraSchema = new Schema({
    nombre: {
        type: String,
        required: true        
    },  
    label: {
        type: String,
        required: true        
    },  
    orden: {
        type: Number,
        required: true
    },
    es_taxon:{type:Boolean, default:false}, //0 estructura, 1 taxon 
    vista_ampliada:{type:Boolean, default:false}, //0 detalle de estructura, 1 detalle {tipo} //especie y sub especies solo tienen vista ampliada
    padres: [{ type: Schema.Types.ObjectId, ref: "tipoEstructura" }],    
    hijos: [{ type: Schema.Types.ObjectId, ref: "tipoEstructura" }],            
},{timestamps:true});