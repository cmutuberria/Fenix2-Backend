import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { AmenazaDTO } from './amenaza.dto';
import { Amenaza } from './amenaza.interface';
import { Model } from 'mongoose';

@Injectable()
export class AmenazaService {
  //[x: string]: any;
  constructor(@InjectModel('amenaza') private readonly model: Model<Amenaza>) {}


  async getAll(row: number, page: number, filtro: string, sort: string) {
    try {
      let query = {};
      if (filtro && filtro != 'null' && filtro != '') {
        query = {
          ...query,
          $or: [
            { nombre: { $regex: filtro, $options: 'i' } },
            { sigla: { $regex: filtro, $options: 'i' } },
          ],
        };
      }
      const data = await this.model
        .find(query)
        .sort(sort)
        .limit(row)
        .skip(row * page);
      const count = await this.model.countDocuments(query);
      return { data, count };
    } catch (e) {
      // MongoError
      throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  async all() {
    try {
      return await this.model.find();
    } catch (e) {
      // MongoError
      throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  async getOne(id: string): Promise<Amenaza> {
    try {
      return await this.model.findById(id);
    } catch (e) {
      // MongoError
      throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  async getAmenazas(tipo:number) {
    try {
      return await this.model.find({ tipo: tipo });
    } catch (e) {
      // MongoError
      throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  async create(AmenazaDTO: AmenazaDTO): Promise<Amenaza> {
    try {
      const obj = new this.model(AmenazaDTO);
      return await obj.save();
    } catch (e) {
      // MongoError
      throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async delete(id: string): Promise<Amenaza> {
    try {
      //Revisar que no esté utilizado
      return await this.model.findByIdAndDelete(id);
    } catch (e) {
      // MongoError
      throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  async update(id: string, AmenazaDTO: AmenazaDTO): Promise<Amenaza> {
    try {
      return await this.model.findByIdAndUpdate(id, AmenazaDTO, { new: true });
    } catch (e) {
      // MongoError
      throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
