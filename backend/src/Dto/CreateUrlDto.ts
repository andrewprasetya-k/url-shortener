import { IsNotEmpty, IsUrl } from 'class-validator';

export class CreateUrlDto {
  @IsUrl()
  @IsNotEmpty({ message: 'Original URL should not be empty' })
  originalUrl: string;
}
