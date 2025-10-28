import { IsNotEmpty, IsUrl } from 'class-validator';

export class UrlDto {
  @IsUrl()
  @IsNotEmpty({ message: 'Original URL should not be empty' })
  originalUrl: string;
}
