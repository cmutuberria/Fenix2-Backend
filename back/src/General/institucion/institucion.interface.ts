
import { Document } from "mongoose";

export interface Institucion extends Document {
    readonly nombre: string;
    readonly pais: string;
    readonly es_privado: boolean;
    readonly tipo_coleccion: boolean;
    readonly director: string;
    readonly email: string;
    readonly telefono: string;
    readonly direccion: string;
    readonly activo:boolean;
}