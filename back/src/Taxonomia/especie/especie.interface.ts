
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
    readonly img_individuo: string;//
    readonly img_herbario: string;//
    readonly f_floracion: string[];//
    readonly f_fructificacion: string[];//
    readonly f_hojas_desarrollo: string[];//
    readonly f_brotes_floreales: string[];//
    readonly f_observaciones: string;//
    readonly habitat: string;//
    readonly amenazas: string;//
    readonly galeria: string[];//
    readonly activo: boolean;
}