import { Document } from "mongoose";

export interface Amenaza extends Document {
    readonly nombre: string;
    readonly tipo: boolean; 
    readonly activo: boolean; 
}