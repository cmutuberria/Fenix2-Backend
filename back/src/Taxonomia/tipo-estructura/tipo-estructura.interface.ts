import { Document } from "mongoose";

export interface TipoEstructura extends Document {
    readonly nombre: string;
    readonly label: string;
    readonly orden: number;
    readonly es_taxon: boolean;
    readonly vista_ampliada: boolean;
    readonly padres: string[];
    readonly hijos: string[];   

}