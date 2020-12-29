import { Schema } from "mongoose";

export const estructuraSchema = new Schema(
         {
           nombre: {
             type: String,
             required: true,
           },
           tipo: {
             type: Schema.Types.ObjectId,
             ref: 'tipoEstructura',
             required: true,
           },
           padre: { type: Schema.Types.ObjectId, ref: 'estructura' },
           activo: {
             type: Boolean,
             default: true,
           },

           clasificadores: [
             { type: Schema.Types.ObjectId, ref: 'colector' },
           ],
           origen: { type: String },
           categoria_UICN: { type: String },
           anno_clasificacion: { type: String },
           sinonimias: [{ type: String }],
           nombres_comunes: [{ type: String }],
           usos: [{ type: Schema.Types.ObjectId, ref: 'uso' }],
           img_individuo: { type: String },
           img_herbario: { type: String },
           f_floracion: [{ type: String }],
           f_fructificacion: [{ type: String }],
           f_hojas_desarrollo: [{ type: String }],
           f_brotes_florales: [{ type: String }],
           f_es_peregnifolia: { type: Boolean },
           f_perdida_follage: [{ type: String }],
           f_observaciones: { type: String },
           habitat: { type: String },
           a_amenazas: [{ type: Schema.Types.ObjectId, ref: 'amenaza' }],
           a_estreses: [{ type: Schema.Types.ObjectId, ref: 'amenaza' }],
           a_observaciones: { type: String },
           galeria: [{ type: String }],
           referencias: [{ type: String }],
         },
         { timestamps: true },
       );