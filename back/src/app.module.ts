import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from "@nestjs/mongoose";
import uri from './uri'
import { TrabajadorModule } from './General/trabajador/trabajador.module';
import { AuthModule } from './auth/auth.module';
import { PaisModule } from './General/pais/pais.module';
import { InstitucionModule } from './General/institucion/institucion.module';
import { ColectorModule } from './General/colector/colector.module';
import { UsoModule } from './Taxonomia/uso/uso.module';
import { EspecieModule } from './Taxonomia/especie/especie.module';
import { EstructuraModule } from './Taxonomia/estructura/estructura.module';
import { TipoEstructuraModule } from './Taxonomia/tipo-estructura/tipo-estructura.module';
import { CategoriaUICNModule } from './General/categoria-uicn/categoria-uicn.module';
import { UtilsModule } from './utils/utils.module';


// You may want to move this variable into a separate file then import it to make it cleaner

@Module({
  imports: [MongooseModule.forRoot(uri, { useNewUrlParser: true, useFindAndModify: false }),
    AuthModule, 
    UtilsModule,
    // Configuracion general
    TrabajadorModule, PaisModule, InstitucionModule, ColectorModule, CategoriaUICNModule,
    // Taxonomia
    TipoEstructuraModule, EstructuraModule, UsoModule, EspecieModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
