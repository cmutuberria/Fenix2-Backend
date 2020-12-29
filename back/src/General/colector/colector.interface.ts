import { Document } from "mongoose";

export interface Colector extends Document {
    readonly acronimo: string;
    readonly nombre: string;
}