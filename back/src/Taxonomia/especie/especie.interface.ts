
import { Document } from "mongoose";

export interface Especie extends Document {
    readonly nombre: string;
    readonly estructura: string;
    readonly clasificador: string;
    readonly origen: string;//modelo
    readonly categoria_UICN: string;
    readonly anno_clasificacion: string;
    readonly sinonimias:string[];//array de elementos
    readonly nombres_comunes:string[];//array de elementos
    readonly usos: string[];//modelo
    readonly activo: boolean;
}