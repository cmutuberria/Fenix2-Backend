export class EspecieDTO {

    readonly padre: string;//estructura
    readonly tipo: string;//estructura
    readonly nombre: string;//nombre_cientifico
    readonly estructura: string;
    readonly clasificador: string;
    readonly categoria_UICN: string;
    readonly anno_clasificacion: string;
    readonly origen: string;//modelo
    readonly usos: string[];//modelo
    readonly sinonimias:string[];//array de elementos
    readonly nombres_comunes:string[];//array de elementos
    readonly activo: boolean;
}