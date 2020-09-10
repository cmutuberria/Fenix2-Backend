import { Module } from '@nestjs/common';
import { UtilsController } from './utils.controller';

@Module({
  //process.env.JWT_SECRET
  imports: [],
  controllers: [UtilsController],
  providers: []
})
export class UtilsModule {}
