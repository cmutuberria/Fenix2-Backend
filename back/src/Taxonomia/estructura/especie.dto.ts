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
             img_individuo: string;//
    readonly img_herbario: string;//
    readonly f_floracion: string[];//
    readonly f_fructificacion: string[];//
    readonly f_hojas_desarrollo: string[];//
    readonly f_brotes_floreales: string[];//
    readonly f_observaciones: string;//
    readonly habitat: string;//
    readonly amenazas: string;//
    readonly galeria: string[];//
}