import { Schema } from "mongoose";
//colector/introductor/clasificador
export const colectorSchema = new Schema({
    nombre: {
        type: String,
        required: true
    },    
},{timestamps:true});
// paisSchema.plugin(MongoosePaginate);
