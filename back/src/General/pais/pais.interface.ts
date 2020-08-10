import { Document } from "mongoose";

export interface Pais extends Document {
    readonly nombre: string;
    readonly sigla: string;
}