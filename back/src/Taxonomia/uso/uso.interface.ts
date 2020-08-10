import { Document } from "mongoose";

export interface Uso extends Document {
    readonly nombre: string;
    readonly activo:boolean;

}