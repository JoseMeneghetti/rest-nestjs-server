import { IsNotEmpty } from 'class-validator';

export class CreateLastListProducts {
  @IsNotEmpty({ message: 'name should not be empty' })
  name: string;
  @IsNotEmpty({ message: 'products should not be empty' })
  products: string;
}
