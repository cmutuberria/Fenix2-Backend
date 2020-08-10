import { Module } from '@nestjs/common';
import { ColectorController } from './colector.controller';
import { ColectorService } from './colector.service';
import { MongooseModule } from '@nestjs/mongoose';
import { colectorSchema } from './colector.schema';

@Module({
  imports: [MongooseModule.forFeature([
    { name: 'colector', schema: colectorSchema }
  ])],
  controllers: [ColectorController],
  providers: [ColectorService]
})
export class ColectorModule {}
