import { Module } from '@nestjs/common';
import { ScrapingService } from './scraping.service';
import { TelegramService } from './telegram.service';
import { FydService } from '../fyd.service';
import { PrismaService } from 'src/database/prisma.service';

@Module({
  controllers: [],
  providers: [ScrapingService, TelegramService, FydService, PrismaService],
  exports: [ScrapingService],
})
export class ScrapingModule {}
