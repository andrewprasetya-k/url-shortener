import { IsNotEmpty, IsString, IsUrl, IsOptional, Matches } from 'class-validator';

export class CreateUrlDto {
  @IsOptional()
  @IsString({ message: 'URL name must be a string' })
  urlName?: string;

  @IsOptional()
  @Matches(/^[a-zA-Z0-9-_]*$/, { message: 'Custom alias can only contain alphanumeric characters, hyphens, and underscores' })
  @IsString({ message: 'Custom alias must be a string' })
  customShortLink?: string;

  @IsUrl({
    require_protocol: true,
    require_valid_protocol: true,
    protocols: ['http', 'https']
  }, { message: 'Original URL must be a valid URL with http:// or https://' })
  @IsNotEmpty({ message: 'Original URL should not be empty' })
  originalUrl: string;
}
