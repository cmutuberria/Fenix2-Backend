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
    padres: [{ type: Schema.Types.ObjectId, ref: "tipoEstructura" }],    
    hijos: [{ type: Schema.Types.ObjectId, ref: "tipoEstructura" }],            
},{timestamps:true});