import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from "@nestjs/mongoose";
import { Especie } from './especie.interface';
import { EspecieDTO } from './especie.dto';
import { Model } from 'mongoose';
import { Estructura } from '../estructura/estructura.interface';

@Injectable()
export class EspecieService {
    constructor(@InjectModel('especie') private readonly model: Model<Especie>,
        @InjectModel('estructura') private readonly estructuraModel: Model<Estructura>) { }

    async getAll(row: number, page: number, filtro: string,
        sort: string) {
        try {
            let query = {};
            if (filtro && filtro != "null" && filtro != "") {
                query = {
                    ...query,
                    nombre: { $regex: filtro, $options: 'i' }
                }
            }
            const data = await this.model.find(query).sort(sort).limit(row)
                .skip(row * page).populate("estructura  clasificador");
            const count = await this.model.countDocuments(query);
            return { data, count }

        } catch (e) { // MongoError
            throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async all() {
        try {
            return await this.model.find({ activo: true }).populate("estructura  clasificador");
        } catch (e) { // MongoError
            throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getOne(id: string): Promise<Especie> {
        try {
            return await this.model.findOne({ $or: [{ _id: id }, { estructura: id }] })
                .populate("clasificador usos").populate({
                    path: 'estructura',
                    // Get friends of friends - populate the 'friends' array for every friend
                    populate: {
                        path: 'padre tipo',
                        populate: { path: 'tipo' }
                    },
                });
        } catch (e) { // MongoError
            throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async create(EspecieDTO: EspecieDTO): Promise<Especie> {
        try {
            const estructura = await new this.estructuraModel(EspecieDTO).save();
            let obj = new this.model({ ...EspecieDTO, estructura: estructura._id });
            return await obj.save();
        } catch (e) { // MongoError
            throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async delete(id: string): Promise<Especie> {
        try {
            //revisar que no esté utilizado

            const especie = await (await this.model.findById(id));
            const hijosCount = await this.estructuraModel.countDocuments({ padre: especie.estructura });
            if (hijosCount > 0) {
                throw new HttpException("No se puede eliminar, la especie tiene hijos",
                    HttpStatus.INTERNAL_SERVER_ERROR);
                //verificar si es especie donde está utilizada
            } else {
                return await this.model.findByIdAndDelete(id);
            }
        } catch (e) { // MongoError
            throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async update(id: string, EspecieDTO: EspecieDTO): Promise<Especie> {
        try {
            return await this.model.findByIdAndUpdate(id, EspecieDTO, { new: true });
        } catch (e) { // MongoError
            throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async edit(id: string, EspecieDTO: EspecieDTO): Promise<Especie> {
        try {
            const estructura = {nombre:EspecieDTO.nombre, padre:EspecieDTO.padre}
            await this.estructuraModel.findByIdAndUpdate(EspecieDTO.estructura,
                estructura, { new: true });
            return await this.model.findByIdAndUpdate(id, EspecieDTO, { new: true });
        } catch (e) { // MongoError
            throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
