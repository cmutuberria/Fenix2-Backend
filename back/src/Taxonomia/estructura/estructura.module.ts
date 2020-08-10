import { Module } from '@nestjs/common';
import { EstructuraController } from './estructura.controller';
import { EstructuraService } from './estructura.service';
import { MongooseModule } from '@nestjs/mongoose';
import { estructuraSchema } from './estructura.schema';
import { tipoEstructuraSchema } from '../tipo-estructura/tipo-estructura.schema';

@Module({
  imports: [MongooseModule.forFeature([
    { name: 'estructura', schema: estructuraSchema },
    { name: 'tipoEstructura', schema: tipoEstructuraSchema }
  ])],
  controllers: [EstructuraController],
  providers: [EstructuraService]
})
export class EstructuraModule {}
