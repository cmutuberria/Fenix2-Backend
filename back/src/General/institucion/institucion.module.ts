import { Module } from '@nestjs/common';
import { InstitucionController } from './institucion.controller';
import { InstitucionService } from './institucion.service';
import { MongooseModule } from '@nestjs/mongoose';
import { institucionSchema } from './institucion.schema';

@Module({
  imports: [MongooseModule.forFeature([
    { name: 'institucion', schema: institucionSchema }    
  ])],
  controllers: [InstitucionController],
  providers: [InstitucionService],
  exports: [InstitucionService]//para que sea visible fuera de este módulo
})
export class InstitucionModule { }
