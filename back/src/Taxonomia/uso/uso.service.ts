import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from "@nestjs/mongoose";
import { UsoDTO } from './uso.dto';
import { Uso } from './uso.interface';
import { Model } from 'mongoose';
import { Estructura } from '../estructura/estructura.interface';

@Injectable()
export class UsoService {
    constructor(@InjectModel('uso') private readonly model: Model<Uso>,
    @InjectModel('estructura') private readonly especieModel: Model<Estructura>) { }

    async getAll( row: number, page: number, filtro: string,
        sort: string) {
        try {
            let query = {};
            if (filtro && filtro != "null" && filtro != "") {
                query = {
                    ...query,
                    $or: [{ nombre: { $regex: filtro, $options: 'i' } }],
                }
            }
            const data = await this.model.find(query).sort(sort).limit(row).skip(row * page);
            const count = await this.model.countDocuments(query);
            return { data, count }

        } catch (e) { // MongoError
            throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async all() {
        try {
            return await this.model.find({activo:true}).sort("nombre");
        } catch (e) { // MongoError
            throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getNotAssigned(idEspecie:string) {
        try {
            const especie= await this.especieModel.findById(idEspecie);
            return await this.model.find({_id: { $nin: especie.usos}}).sort("nombre");
        } catch (e) { // MongoError
            throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getOne(id: string): Promise<Uso> {
        try {
            return await this.model.findById(id);
        } catch (e) { // MongoError
            throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async create(UsoDTO: UsoDTO): Promise<Uso> {
        try {
            const obj = new this.model(UsoDTO);
            return await obj.save();
        } catch (e) { // MongoError
            throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async delete(id: string): Promise<Uso> {
        try {
            //Revisar que no esté utilizado
            return await this.model.findByIdAndDelete(id);
        } catch (e) { // MongoError
            throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async update(id: string, UsoDTO: UsoDTO): Promise<Uso> {
        try {
            return await this.model.findByIdAndUpdate(id, UsoDTO, { new: true });
        } catch (e) { // MongoError
            throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
