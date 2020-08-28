import { Module, HttpModule } from '@nestjs/common';
import { PaisController } from './pais.controller';
import { PaisService } from './pais.service';
import { MongooseModule } from '@nestjs/mongoose';
import { paisSchema } from './pais.schema';

@Module({
  imports: [HttpModule, MongooseModule.forFeature([
    { name: 'pais', schema: paisSchema }
  ])],
  controllers: [PaisController],
  providers: [PaisService]
})
export class PaisModule {}
