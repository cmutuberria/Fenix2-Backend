import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from "@nestjs/mongoose";
import { Trabajador } from './trabajador.interface';
import { TrabajadorDTO } from './trabajador.dto';
import * as bcrypt from "bcryptjs";
import { Model } from 'mongoose';

@Injectable()
export class TrabajadorService {
    constructor(@InjectModel('trabajador') private readonly model: Model<Trabajador>) { }

    async findOne(username: string): Promise<Trabajador> {
        return await this.model.findOne({ usuario: username });
    }
    async isUnique(field: string, value: string, _id: string) {
        let query = {};
        if (_id && _id != "null" && _id != "") {
            query["_id"]={$ne:_id}
        }
        query[field]=value
       return await this.model.countDocuments(query);
    }
    async getAll(institucion: string, row: number, page: number, filtro: string,
        sort: string) {
        try {
            let query = {};
            if (filtro && filtro != "null" && filtro != "") {
                query = {
                    ...query,
                    $or: [{ nombre: { $regex: filtro, $options: 'i' } },
                    { apellidos: { $regex: filtro, $options: 'i' } },
                    { nro_identificacion: { $regex: filtro, $options: 'i' } },
                    { usuario: { $regex: filtro, $options: 'i' } }],
                }
            }
            /* if (filtro&&filtro!="null"&&filtro!="") {
                query={
                    ...query,
                    $text: { $search: filtro },
                }
            } */
            if (institucion && institucion != "null" && institucion != "") {
                query = {
                    ...query,
                    "institucion": institucion
                }
            }
            const data = await this.model.find(query).populate("institucion").sort(sort).limit(row).skip(row * page);
            const count = await this.model.countDocuments(query);
            return { data, count }

        } catch (e) { // MongoError
            throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async getOne(id: string): Promise<Trabajador> {
        try {
            return await this.model.findById(id).populate('institucion');
        } catch (e) { // MongoError
            throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async create(TrabajadorDTO: TrabajadorDTO): Promise<Trabajador> {
        try {
            let obj = new this.model(TrabajadorDTO);
            obj.password = obj.nro_identificacion;
            return await obj.save();
        } catch (e) { // MongoError
            throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async delete(id: string): Promise<Trabajador> {
        try {
            //revisar que no esté utilizado
            return await this.model.findByIdAndDelete(id);
        } catch (e) { // MongoError
            throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async update(id: string, TrabajadorDTO: TrabajadorDTO): Promise<Trabajador> {
        try {
            return await this.model.findByIdAndUpdate(id, TrabajadorDTO, { new: true });
        } catch (e) { // MongoError
            throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async changePassword(id: string, password: string): Promise<Trabajador> {
        try {
            let trabajador = await this.model.findById(id);
            trabajador.password = await bcrypt.hash(password, 10);
            return await this.model.findByIdAndUpdate(id, trabajador, { new: true });
        } catch (e) { // MongoError
            throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }
}
