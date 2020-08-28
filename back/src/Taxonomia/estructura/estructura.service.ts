import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from "@nestjs/mongoose";
import { EstructuraDTO } from './estructura.dto';
import { Estructura } from './estructura.interface';
import { Model } from 'mongoose';
import { TipoEstructura } from '../tipo-estructura/tipo-estructura.interface';
import { EspecieDTO } from './especie.dto';

@Injectable()
export class EstructuraService {
    constructor(@InjectModel('estructura') private readonly model: Model<Estructura>,
        @InjectModel('tipoEstructura') private readonly tipoEstructuraModel: Model<TipoEstructura>) { }

    async getAll(row: number, page: number, filtro: string,
        sort: string, tipo: string) {
        try {
            let query = { tipo: tipo };
            if (filtro && filtro != "null" && filtro != "") {
                query["nombre"] = { $regex: filtro, $options: 'i' }

            }
            const data = await this.model.find(query).sort(sort).limit(row).skip(row * page).populate("padre");
            const count = await this.model.countDocuments(query);
            return { data, count }

        } catch (e) { // MongoError
            throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getAllEspecies(row: number, page: number, filtro: string,sort: string) {
        try {
            const tipoEstructuraEspecie = this.tipoEstructuraModel.findOne({nombre:"Especie"})
            let query = { tipo: (await tipoEstructuraEspecie)._id }
            if (filtro && filtro != "null" && filtro != "") {
                query["nombre"] = { $regex: filtro, $options: 'i' }
            }
            const data = await this.model.find(query).sort(sort).limit(row).skip(row * page).populate("padre")
            const count = await this.model.countDocuments(query)
            return { data, count }

        } catch (e) { // MongoError
            throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }
    async all() {
        try {
            return await this.model.find({ activo: true }).sort("nombre");
        } catch (e) { // MongoError
            throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async root() {
        try {
            return await this.model.aggregate([
                {
                    $match: { padre: null }
                },
                {
                    $lookup: {
                        from: "tipoestructuras",
                        localField: "tipo",
                        foreignField: "_id",
                        as: "tipo"
                    }
                },
                { $unwind: "$tipo" },

            ]);
        } catch (e) { // MongoError
            throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async parentCandidates(idTipo: string) {
        try {
            const tiposCandidates = await (await this.tipoEstructuraModel.findById(idTipo)).padres
            //return tiposCandidates
            return await this.model.aggregate([
                {
                    $match: { tipo: { $in: tiposCandidates } }
                },
                {
                    $lookup: {
                        from: "tipoestructuras",
                        localField: "tipo",
                        foreignField: "_id",
                        as: "tipo"
                    }
                },
                { $unwind: "$tipo" },

            ]);

        } catch (e) { // MongoError
            throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async allTipo(tipo: string) {
        try {
            return await this.model.find({ activo: true, tipo: tipo }).sort("nombre");
        } catch (e) { // MongoError
            throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getOne(id: string): Promise<Estructura> {
        try {
            return await this.model.findById(id).populate({
                path: 'padre',
                // Get friends of friends - populate the 'friends' array for every friend
                populate: { path: 'tipo' }
              }).populate("tipo clasificador usos");
        } catch (e) { // MongoError
            throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getOneWithParents(id: string) {
        try {
            return await this.model.aggregate([{
                $addFields: {
                    convertedId: { $toString: "$_id" }
                }
            }, {
                $match: { convertedId: id }
            }, {
                $graphLookup: {
                    from: "estructuras",
                    startWith: "$padre",
                    connectFromField: "padre",
                    connectToField: "_id",
                    as: "padres"
                }
            }]);
        } catch (e) { // MongoError
            throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getParents(id: string) {
        try {
            return await this.model.aggregate([{
                $addFields: {
                    convertedId: { $toString: "$_id" }
                }
            }, {
                $match: { convertedId: id }
            }, {
                $graphLookup: {
                    from: "estructuras",
                    startWith: "$padre",
                    connectFromField: "padre",
                    connectToField: "_id",
                    as: "padres"
                }
            }, { $unwind: "$padres" },
            {
                $project:
                {
                    tipo: "$padres.tipo",
                    nombre: "$padres.nombre",
                    padre: "$padres.padre",
                    _id: "$padres._id"

                }
            }, {
                $lookup: {
                    from: "tipoestructuras",
                    localField: "tipo",
                    foreignField: "_id",
                    as: "tipo"
                }

            },
            { $unwind: "$tipo" },
            { $sort: { "tipo.orden": 1, "nombre":1 } },
            ]);
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
                $match: { convertedId: id }
            }, {
                $graphLookup: {
                    from: "estructuras",
                    startWith: "$_id",
                    connectFromField: "_id",
                    connectToField: "padre",
                    maxDepth: 0,
                    as: "hijos"
                }

            },
            { $unwind: "$hijos" },
            {
                $project:
                {
                    tipo: "$hijos.tipo",
                    nombre: "$hijos.nombre",
                   // padre: "$hijos.padre",
                    _id: "$hijos._id"

                }
            }, {
                $lookup: {
                    from: "tipoestructuras",
                    localField: "tipo",
                    foreignField: "_id",
                    as: "tipo"
                }

            },
            { $unwind: "$tipo" },
            { $sort: { "tipo.orden": 1, "nombre":1 } },
            ]);
        } catch (e) { // MongoError
            throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async create(EstructuraDTO: EstructuraDTO): Promise<Estructura> {
        try {
            const obj = new this.model(EstructuraDTO);
            return await obj.save();
        } catch (e) { // MongoError
            throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async createEspecie(EspecieDTO: EspecieDTO): Promise<Estructura> {
        try {
            const obj = new this.model(EspecieDTO);
            return await obj.save();
        } catch (e) { // MongoError
            throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async delete(id: string): Promise<Estructura> {
        try {
          const hijosCount =  await this.model.countDocuments({padre:id});
          if (hijosCount>0) {
              throw new HttpException("No se puede eliminar, la estructura tiene hijos", 
              HttpStatus.INTERNAL_SERVER_ERROR);
              //verificar si es especie donde está utilizada
            } else {
                return await this.model.findByIdAndDelete(id);
            }            
        } catch (e) { // MongoError
            throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async update(id: string, EstructuraDTO: EstructuraDTO): Promise<Estructura> {
        try {
            return await this.model.findByIdAndUpdate(id, EstructuraDTO, { new: true });
        } catch (e) { // MongoError
            throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
