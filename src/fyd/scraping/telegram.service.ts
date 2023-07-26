// send-email.service.ts
import { Injectable } from '@nestjs/common';
import got from 'got';

@Injectable()
export class TelegramService {
  async sendTelegram(newProducts: any, storeName: string): Promise<any> {
    const url = `https://api.telegram.org/bot${process.env.TELEGRAM_TOKEN}/sendPhoto`;

    //SEND TELEGRAM
    newProducts.forEach(async (product: any) => {
      let productUrl = '';
      let photo = '';
      if (storeName === 'nike') {
        productUrl = `https://nike.com.br/snkrs/${product.url}`;
        photo = `https://imgnike-a.akamaihd.net/400x400/${product?.id}.jpg`;
      } else {
        productUrl = product.id; //id is the URL
        photo = product.url; // url is the Img
      }
      try {
        await got.get(url, {
          http2: true,
          headers: {
            'user-agent':
              'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.5; en-US; rv:1.8.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/53.0.0 Mobile Safari/537.36',
            'Managed-UserAgentRefererHeaders': 'true',
            'Accept-Language': 'en-US,en;q=0.5',
          },
          searchParams: {
            chat_id: '-1001832045025',
            photo: photo,
            caption: `${
              storeName !== 'nike' ? storeName.toUpperCase() : ''
            } \n 🚀 ${product?.name.replace(
              'Nike',
              '',
            )}\n✅ Link: ${`${productUrl}`}
            \n `,
          },
        });
      } catch (error) {
        console.error(error);
        throw error;
      }

      await new Promise((resolve) => setTimeout(resolve, 1500));
    });
  }
}
