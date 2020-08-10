import { Document } from "mongoose";

export interface Estructura extends Document {
    readonly nombre: string;
    readonly tipo: string;
    readonly activo:boolean;

}