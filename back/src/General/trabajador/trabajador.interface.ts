
import { Document } from "mongoose";

export interface Trabajador extends Document {
    readonly usuario_general:boolean;
    readonly jardin: string;
    readonly nombre: string;
    readonly apellidos: string;
    readonly nro_identificacion: string;
    readonly email: string;
    readonly telefono: string;
    readonly direccion: string;
    readonly usuario: string;
     password: string;
    readonly roles: string[];
    readonly activo:boolean;
}