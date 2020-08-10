import { Module } from '@nestjs/common';
import { EspecieController } from './especie.controller';
import { EspecieService } from './especie.service';
import { MongooseModule } from '@nestjs/mongoose';
import { especieSchema } from './especie.schema';
import { estructuraSchema } from '../estructura/estructura.schema';

@Module({
  imports: [MongooseModule.forFeature([
    { name: 'especie', schema: especieSchema },    
    { name: 'estructura', schema: estructuraSchema }    
  ])],
  controllers: [EspecieController],
  providers: [EspecieService],
  exports: [EspecieService]//para que sea visible fuera de este módulo
})
export class EspecieModule { }
