import { Module } from '@nestjs/common';
import { TrabajadorController } from './trabajador.controller';
import { TrabajadorService } from './trabajador.service';
import { MongooseModule } from '@nestjs/mongoose';
import { trabajadorSchema } from './trabajador.schema';

@Module({
  imports: [MongooseModule.forFeature([
    { name: 'trabajador', schema: trabajadorSchema }    
  ])],
  controllers: [TrabajadorController],
  providers: [TrabajadorService],
  exports: [TrabajadorService]//para que sea visible fuera de este módulo
})
export class TrabajadorModule { }
