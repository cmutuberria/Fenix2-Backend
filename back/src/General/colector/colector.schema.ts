import { Schema } from "mongoose";
//colector/introductor/clasificador
export const colectorSchema = new Schema({
    acronimo: {
        type: String,
        required: true
    }, 
    nombre: {
        type: String
    },    
},{timestamps:true});
// paisSchema.plugin(MongoosePaginate);
