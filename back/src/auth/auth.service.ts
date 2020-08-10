import { Injectable } from '@nestjs/common';
import { TrabajadorService } from '../General/trabajador/trabajador.service';
import * as bcrypt from "bcryptjs";
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        private readonly trabajadorService: TrabajadorService,
        private readonly jwtService: JwtService) { }

    async validateLogin(usuario: string, password: string): Promise<any> {
        const trabajador = await this.trabajadorService.findOne(usuario);
        if (trabajador) {
            const comparePass = await bcrypt.compare(password, trabajador.password);
            if (comparePass) {
                return {
                    "usuario_general": trabajador.usuario_general,
                    "roles": trabajador.roles,
                    "activo": trabajador.activo,
                    "_id": trabajador._id,
                    "nombre": trabajador.nombre,
                    "apellidos":trabajador.apellidos,
                    "nro_identificacion": trabajador.nro_identificacion,
                    "email": trabajador.email,
                    "telefono": trabajador.telefono,
                    "direccion": trabajador.direccion,
                    "usuario": trabajador.usuario,
                    "jardin": trabajador.jardin
                };
            }
        }
        return null;
    }

    async validateUser(usuario: string, _id: string): Promise<any> {
        const trabajador = await this.trabajadorService.findOne(usuario);
        if (trabajador && trabajador._id == _id) {
            return {
                "usuario_general": trabajador.usuario_general,
                "roles": trabajador.roles,
                "activo": trabajador.activo,
                "_id": trabajador._id,
                "nombre": trabajador.nombre,
                "apellidos":trabajador.apellidos,
                "nro_identificacion": trabajador.nro_identificacion,
                "email": trabajador.email,
                "telefono": trabajador.telefono,
                "direccion": trabajador.direccion,
                "usuario": trabajador.usuario,
                "jardin": trabajador.jardin
            };
        }
        return null;
    }

    login(trabajador: any) {
        const payload = { usuario: trabajador.usuario, _id: trabajador._id, roles: trabajador.roles };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }
}
