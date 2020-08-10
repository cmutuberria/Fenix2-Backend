import { Module } from '@nestjs/common';
import { CategoriaUICNController } from './categoria-uicn.controller';

@Module({
  imports: [],
  controllers: [CategoriaUICNController],
  providers: []
})
export class CategoriaUICNModule {}
