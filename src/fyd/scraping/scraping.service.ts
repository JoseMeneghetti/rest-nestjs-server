import { Injectable } from '@nestjs/common';
import got from 'got';
import { TelegramService } from './telegram.service';
import { FydService } from '../fyd.service';
import cheerio from 'cheerio';

@Injectable()
export class ScrapingService {
  constructor(
    private readonly telegramService: TelegramService,
    private readonly fydService: FydService,
  ) {}

  async nike(url: string, id: string): Promise<any> {
    try {
      const response: any = await got.get(url, {
        http2: true,
        headers: {
          accept: 'application/json, text/plain, */*',
          'user-agent':
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.5; en-US; rv:1.8.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/53.0.0 Mobile Safari/537.36',
          'Managed-UserAgentRefererHeaders': 'true',
          'Accept-Language': 'en-US,en;q=0.5',
          origin: 'https://www.nike.com.br',
          referer: 'https://www.nike.com.br/',
        },
      });

      const result = JSON.parse([response.body].toString());

      const products = result['products'].filter(
        (product: any) => product.details.group === 'Calçados',
      );

      const resultToDb = products.map((product: any) => {
        return { id: product.id, name: product.name, url: product.url };
      });

      // Prisma
      const newProducts: any = await this.fydService.compare(resultToDb, id);

      // Telegram
      if (newProducts?.length) {
        await this.telegramService.sendTelegram(newProducts, 'nike');
      }

      return { products: newProducts, total_products: products.length };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async artWalk(url: string, id: string): Promise<any> {
    let pageNumber = 1;
    let hasMorePages = true;
    const products = [];

    while (hasMorePages) {
      const new_url = `${url}${pageNumber}`;
      try {
        const response = await got.get(new_url, {
          http2: true,
          headers: {
            accept: `text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7`,
            'user-agent':
              'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.5; en-US; rv:1.8.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/53.0.0 Mobile Safari/537.36',
            'Managed-UserAgentRefererHeaders': 'true',
            'Accept-Language': 'en-US,en;q=0.5',
            cookie:
              'vtex_segment=eyJjYW1wYWlnbnMiOm51bGwsImNoYW5uZWwiOiIxIiwicHJpY2VUYWJsZXMiOm51bGwsInJlZ2lvbklkIjoiVTFjallYSjBkMkZzYXpBd00zWXdNVHRoY25SM1lXeHJNREEwZGpBeE8yRnlkSGRoYkdzd01EWTdZWEowZDJGc2F6QXhNanRoY25SM1lXeHJNREV6TzJGeWRIZGhiR3N3TVRZN1lYSjBkMkZzYXpBME5EdGhjblIzWVd4ck1EWXlPMkZ5ZEhkaGJHc3dOek03WVhKMGQyRnNhekEzTnp0aGNuUjNZV3hyTURjNE8yRnlkSGRoYkdzd056azdZWEowZDJGc2F6QTRNRHRoY25SM1lXeHJNRGt3TzJGeWRIZGhiR3RsWTI5dGJRPT0iLCJ1dG1fY2FtcGFpZ24iOm51bGwsInV0bV9zb3VyY2UiOm51bGwsInV0bWlfY2FtcGFpZ24iOm51bGwsImN1cnJlbmN5Q29kZSI6IkJSTCIsImN1cnJlbmN5U3ltYm9sIjoiUiQiLCJjb3VudHJ5Q29kZSI6IkJSQSIsImN1bHR1cmVJbmZvIjoicHQtQlIiLCJjaGFubmVsUHJpdmFjeSI6InB1YmxpYyJ9',
          },
        });

        const html = [response.body].toString();
        const $ = cheerio.load(html);
        const links = $('ul > li > div:not(.produto-indisponivel) a[title]')
          .map((i, link) => {
            return {
              name: $(link).attr('title'),
              url: $(link).attr('href'),
              img: $(link).children('img').attr('src'),
            };
          })
          .get();

        if (links.length === 0) {
          hasMorePages = false;
        } else {
          products.push(...links);
          pageNumber++;
        }
      } catch (error) {
        console.error(error);
        throw error;
      }
    }

    const resultToDb = products.map((product: any) => {
      return {
        id: product.url,
        name: product.name,
        url: product.img,
      };
    });

    // Prisma
    const newProducts: any = await this.fydService.compare(resultToDb, id);

    //Telegram;
    if (newProducts?.length) {
      await this.telegramService.sendTelegram(newProducts, 'artwalk');
    }

    return { products: newProducts, total_products: products.length };
  }
  catch(error) {
    console.error(error);
    throw error;
  }
}
