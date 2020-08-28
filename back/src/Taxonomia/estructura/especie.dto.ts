export class EspecieDTO {

    readonly nombre: string;//nombre_cientifico    
    readonly tipo: string;//estructura
    readonly padre: string;//estructura
    readonly activo: boolean;
    
    readonly clasificador: string;
    readonly categoria_UICN: string;
    readonly anno_clasificacion: string;
    readonly origen: string;//modelo
    readonly usos: string[];//modelo
    readonly sinonimias:string[];//array de elementos
    readonly nombres_comunes:string[];//array de elementos
}