export class EspecieDTO {
  readonly nombre: string; //nombre_cientifico
  readonly tipo: string; //estructura
  readonly padre: string; //estructura
  readonly activo: boolean;

  readonly clasificadores: string[];
  readonly categoria_UICN: string;
  readonly anno_clasificacion: string;
  readonly origen: string; //modelo
  readonly usos: string[]; //modelo
  readonly sinonimias: string[]; //array de elementos
  readonly nombres_comunes: string[]; //array de elementos
  img_individuo: string; //
  img_herbario: string; //
  readonly f_floracion: string[]; //
  readonly f_fructificacion: string[]; //
  readonly f_hojas_desarrollo: string[]; //
  readonly f_brotes_florales: string[]; //
  readonly f_es_peregnifolia: boolean; //
  readonly f_perdida_follage: string[]; //
  readonly f_observaciones: string; //
  readonly habitat: string; //
  readonly a_amenazas: string[]; //
  readonly a_estreses: string[]; //
  readonly a_observaciones: string; //
  galeria: string[]; //
  readonly referencias: string[]; //
}
