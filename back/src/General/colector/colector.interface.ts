import { Document } from "mongoose";

export interface Colector extends Document {
    readonly nombre: string;
}