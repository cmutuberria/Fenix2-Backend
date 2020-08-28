import { Document } from "mongoose";

export interface Estructura extends Document {
    readonly nombre: string;
    readonly tipo: string;
    readonly padre: string;
    readonly activo:boolean;

    readonly clasificador: string;
    readonly categoria_UICN: string;
    readonly anno_clasificacion: string;
    readonly origen: string;//modelo
    readonly usos: string[];//modelo
    readonly sinonimias:string[];//array de elementos
    readonly nombres_comunes:string[];//array de elementos

}