import { Module } from '@nestjs/common';
import { TipoEstructuraController } from './tipo-estructura.controller';
import { TipoEstructuraService } from './tipo-estructura.service';
import { MongooseModule } from '@nestjs/mongoose';
import { tipoEstructuraSchema } from './tipo-estructura.schema';

@Module({
  imports: [MongooseModule.forFeature([
    { name: 'tipoEstructura', schema: tipoEstructuraSchema }
  ])],
  controllers: [TipoEstructuraController],
  providers: [TipoEstructuraService]
})
export class TipoEstructuraModule {}
