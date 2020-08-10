import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from "@nestjs/mongoose";
import { PaisDTO } from './pais.dto';
import { Pais } from './pais.interface';
import { Model } from 'mongoose';

@Injectable()
export class PaisService {
    constructor(@InjectModel('pais') private readonly model: Model<Pais>) { }

    async getAll( row: number, page: number, filtro: string,
        sort: string) {
        try {
            let query = {};
            if (filtro && filtro != "null" && filtro != "") {
                query = {
                    ...query,
                    $or: [{ nombre: { $regex: filtro, $options: 'i' } },
                    { sigla: { $regex: filtro, $options: 'i' } }],
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
            return await this.model.find();
        } catch (e) { // MongoError
            throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getOne(id: string): Promise<Pais> {
        try {
            return await this.model.findById(id);
        } catch (e) { // MongoError
            throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getCuba(): Promise<Pais> {
        try {
            return await this.model.findOne({ nombre: "Cuba" });
        } catch (e) { // MongoError
            throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async create(PaisDTO: PaisDTO): Promise<Pais> {
        try {
            const obj = new this.model(PaisDTO);
            return await obj.save();
        } catch (e) { // MongoError
            throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async delete(id: string): Promise<Pais> {
        try {
            //Revisar que no esté utilizado
            return await this.model.findByIdAndDelete(id);
        } catch (e) { // MongoError
            throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async update(id: string, PaisDTO: PaisDTO): Promise<Pais> {
        try {
            return await this.model.findByIdAndUpdate(id, PaisDTO, { new: true });
        } catch (e) { // MongoError
            throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
