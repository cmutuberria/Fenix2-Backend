import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from "@nestjs/mongoose";
import { ColectorDTO } from './colector.dto';
import { Colector } from './colector.interface';
import { Model } from 'mongoose';

@Injectable()
export class ColectorService {
    constructor(@InjectModel('colector') private readonly model: Model<Colector>) { }

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
    async getOne(id: string): Promise<Colector> {
        try {
            return await this.model.findById(id);
        } catch (e) { // MongoError
            throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getCuba(): Promise<Colector> {
        try {
            return await this.model.findOne({ nombre: "Cuba" });
        } catch (e) { // MongoError
            throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async create(ColectorDTO: ColectorDTO): Promise<Colector> {
        try {
            const obj = new this.model(ColectorDTO);
            return await obj.save();
        } catch (e) { // MongoError
            throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async delete(id: string): Promise<Colector> {
        try {
            //Revisar que no esté utilizado
            return await this.model.findByIdAndDelete(id);
        } catch (e) { // MongoError
            throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async update(id: string, ColectorDTO: ColectorDTO): Promise<Colector> {
        try {
            return await this.model.findByIdAndUpdate(id, ColectorDTO, { new: true });
        } catch (e) { // MongoError
            throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
