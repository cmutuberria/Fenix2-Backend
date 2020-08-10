import { Document } from "mongoose";

export interface TipoEstructura extends Document {
    readonly nombre: string;
    readonly label: string;
    readonly orden: number;
    readonly padres: string[];
    readonly hijos: string[];   

}