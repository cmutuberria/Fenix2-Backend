import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from "@nestjs/mongoose";
import { TipoEstructuraDTO } from './tipo-estructura.dto';
import { TipoEstructura } from './tipo-estructura.interface';
import { Model } from 'mongoose';

@Injectable()
export class TipoEstructuraService {
    constructor(@InjectModel('tipoEstructura') private readonly model: Model<TipoEstructura>) { }

    async getAll(row: number, page: number, filtro: string,
        sort: string, tipo: string) {
        try {
            let query = { tipo: tipo };
            if (filtro && filtro != "null" && filtro != "") {
                query["nombre"] = { $regex: filtro, $options: 'i' }

            }
            const data = await this.model.find(query).sort(sort).limit(row).skip(row * page).populate("padres  hijos");
            const count = await this.model.countDocuments(query);
            return { data, count }

        } catch (e) { // MongoError
            throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async all() {
        try {
            // return await this.model.find().sort("orden");
            return await this.model.find({"nombre": {$ne:"especie"}}).sort("orden").populate("padres hijos");
        } catch (e) { // MongoError
            throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async getOne(id: string): Promise<TipoEstructura> {
        try {
            return await this.model.findById(id).populate("padres hijos");;
        } catch (e) { // MongoError
            throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getEspecie(): Promise<TipoEstructura> {
        try {
            return await this.model.findOne({nombre:{$eq:"Especie"}}).populate("padres hijos");;
        } catch (e) { // MongoError
            throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getChildrens(id: string) {
        try {
            return await this.model.aggregate([{
                $addFields: {
                    convertedId: { $toString: "$_id" }
                }
            }, {
                $match: { convertedId: id}
            },
            {
                $unwind: "$hijos"
            }, {
                $lookup: {
                    from: "tipoestructuras",
                    localField: "hijos",
                    foreignField: "_id",
                    as: "hijo"
                }
            },{
                $unwind: "$hijo"
            },{
                $project:
                {
                    _id: "$hijo._id",
                    nombre: "$hijo.nombre",
                    label: "$hijo.label",
                    orden: "$hijo.orden",

                }
            },{
                $match: {nombre: {$ne:"especie" } }
            },{ 
                $sort: { "orden": 1, "nombre": 1 } },
            ]);
        } catch (e) { // MongoError
            throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getAllChildrens(id: string) {
        try {
            return await this.model.aggregate([{
                $addFields: {
                    convertedId: { $toString: "$_id" }
                }
            }, {
                $match: { convertedId: id}
            },
            {
                $unwind: "$hijos"
            }, {
                $lookup: {
                    from: "tipoestructuras",
                    localField: "hijos",
                    foreignField: "_id",
                    as: "hijo"
                }
            },{
                $unwind: "$hijo"
            },{
                $project:
                {
                    _id: "$hijo._id",
                    nombre: "$hijo.nombre",
                    label: "$hijo.label",
                    orden: "$hijo.orden",

                }            
            },{ 
                $sort: { "orden": 1, "nombre": 1 } },
            ]);
        } catch (e) { // MongoError
            throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async create(TipoEstructuraDTO: TipoEstructuraDTO): Promise<TipoEstructura> {
        try {
            const obj = new this.model(TipoEstructuraDTO);
            return await obj.save();
        } catch (e) { // MongoError
            throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async delete(id: string): Promise<TipoEstructura> {
        try {
            //Revisar que no esté utilizado
            return await this.model.findByIdAndDelete(id);
        } catch (e) { // MongoError
            throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async update(id: string, TipoEstructuraDTO: TipoEstructuraDTO): Promise<TipoEstructura> {
        try {
            return await this.model.findByIdAndUpdate(id, TipoEstructuraDTO, { new: true });
        } catch (e) { // MongoError
            throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
