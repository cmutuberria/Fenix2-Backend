import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from "@nestjs/mongoose";
import { Institucion } from './institucion.interface';
import { InstitucionDTO } from './institucion.dto';
import { Model } from 'mongoose';

@Injectable()
export class InstitucionService {
    constructor(@InjectModel('institucion') private readonly model: Model<Institucion>) { }

    async getAll(row: number, page: number, filtro: string,
        sort: string) {
        try {
            let query = {};
            if (filtro && filtro != "null" && filtro != "") {
                query = {
                    ...query,
                    $or: [{ nombre: { $regex: filtro, $options: 'i' } },
                    { tipo_coleccion: { $regex: filtro, $options: 'i' } },
                    { email: { $regex: filtro, $options: 'i' } }],
                }
            }
            const data = await this.model.find(query).sort(sort).limit(row).skip(row * page).populate("pais");
            const count = await this.model.countDocuments(query);
            return { data, count }

        } catch (e) { // MongoError
            throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async all() {
        try {
            return await this.model.find({ activo: true });
        } catch (e) { // MongoError
            throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getOne(id: string): Promise<Institucion> {
        try {
            return await this.model.findById(id).populate("pais");
        } catch (e) { // MongoError
            throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async create(InstitucionDTO: InstitucionDTO): Promise<Institucion> {
        try {
            let obj = new this.model(InstitucionDTO);
            return await obj.save();
        } catch (e) { // MongoError
            throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async delete(id: string): Promise<Institucion> {
        try {
            //revisar que no esté utilizado
            return await this.model.findByIdAndDelete(id);
        } catch (e) { // MongoError
            throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async update(id: string, InstitucionDTO: InstitucionDTO): Promise<Institucion> {
        try {
            return await this.model.findByIdAndUpdate(id, InstitucionDTO, { new: true });
        } catch (e) { // MongoError
            throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
