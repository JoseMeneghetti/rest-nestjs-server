import { Module } from '@nestjs/common';
import { FydModule } from './fyd/fyd.module';
import { GotModule } from '@t00nday/nestjs-got';

@Module({
  imports: [FydModule, GotModule.register()],
  controllers: [],
  providers: [],
})
export class AppModule {}
