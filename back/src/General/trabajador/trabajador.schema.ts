import { Schema } from "mongoose";
import { Trabajador } from "./trabajador.interface";
import * as bcrypt from "bcryptjs";

const uniqueValidator = require('mongoose-unique-validator');
export const trabajadorSchema = new Schema({
    usuario_general:{
        type:Boolean,
        default:false,
    },
    jardin: { type: Schema.Types.ObjectId, ref: "jardin" },
    nombre: {
        type: String,
        required: true
    },
    apellidos: {
        type: String,
    },
    nro_identificacion: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
    },
    telefono: {
        type: String,
    },
    direccion: {
        type: String,
    },
    usuario: {
        type: String,
        unique:true,
    },
    password: String,
    roles:[{type:String}],
    activo:{
        type:Boolean,
        default:true,
    }
},{timestamps:true});


trabajadorSchema.pre<Trabajador>('save', async function (next) {
    this.password = await bcrypt.hash(this.password, 10);
    next();
});
// trabajadorSchema.index({ nombre: 'text', apellidos: 'text', nro_identificacion: 'text', usuario: 'text' });
trabajadorSchema.index({ nombre: 1, apellidos: 1, nro_identificacion: 1, usuario: 1 });
trabajadorSchema.plugin(uniqueValidator,{message:"Ya existe un trabajador con es {PATH}"});



