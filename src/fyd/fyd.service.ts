import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class FydService {
  constructor(private prisma: PrismaService) {}

  async compare(resultToDb: any, dbId: string): Promise<void> {
    const productsFromDb: any = await this.prisma.lastListProducts
      .findUnique({
        where: { id: dbId }, // id do dunk
      })
      .then((data: any) => {
        return JSON.parse(data?.products);
      });

    const newProducts = resultToDb
      .filter(
        (productFetch: any) =>
          !productsFromDb.find((productDb: any) =>
            productDb.id.includes(productFetch.id),
          ),
      )
      .concat(
        productsFromDb.filter(
          (productFetch: any) =>
            !resultToDb.filter((productDb: any) =>
              productDb.id.includes(productFetch.id),
            ),
        ),
      );

    await this.prisma.lastListProducts.update({
      where: { id: dbId }, // id do dunk
      data: { products: JSON.stringify(resultToDb) },
    });

    return newProducts;
  }
}
