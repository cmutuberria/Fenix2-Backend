import { Module } from '@nestjs/common';
import { UsoController } from './uso.controller';
import { UsoService } from './uso.service';
import { MongooseModule } from '@nestjs/mongoose';
import { usoSchema } from './uso.schema';
import { especieSchema } from '../especie/especie.schema';

@Module({
  imports: [MongooseModule.forFeature([
    { name: 'uso', schema: usoSchema },
    { name: 'especie', schema: especieSchema }
  ])],
  controllers: [UsoController],
  providers: [UsoService]
})
export class UsoModule {}
