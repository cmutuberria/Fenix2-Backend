import { Module } from '@nestjs/common';
import { JardinController } from './jardin.controller';
import { JardinService } from './jardin.service';
import { MongooseModule } from '@nestjs/mongoose';
import { jardinSchema } from './jardin.schema';

@Module({
  imports: [MongooseModule.forFeature([
    { name: 'jardin', schema: jardinSchema }    
  ])],
  controllers: [JardinController],
  providers: [JardinService],
  exports: [JardinService]//para que sea visible fuera de este módulo
})
export class JardinModule { }
