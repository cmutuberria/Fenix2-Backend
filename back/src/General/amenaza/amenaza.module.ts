import { Module, HttpModule } from '@nestjs/common';
import { AmenazaController } from './amenaza.controller';
import { AmenazaService } from './amenaza.service';
import { MongooseModule } from '@nestjs/mongoose';
import { amenazaSchema } from './amenaza.schema';

@Module({
  imports: [HttpModule, MongooseModule.forFeature([
    { name: 'amenaza', schema: amenazaSchema }
  ])],
  controllers: [AmenazaController],
  providers: [AmenazaService]
})
export class AmenazaModule {}
