import { Module } from '@nestjs/common';
import { AppController } from './fyd.controller';
import { PrismaService } from '../database/prisma.service';
import { FydService } from './fyd.service';
import { ScrapingModule } from './scraping/scraping.module';

@Module({
  imports: [ScrapingModule],
  controllers: [AppController],
  providers: [FydService, PrismaService],
  exports: [FydService],
})
export class FydModule {}
