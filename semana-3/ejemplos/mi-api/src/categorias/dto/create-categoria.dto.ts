// dto/create-categoria.dto.ts

import { IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCategoriaDto {
  @ApiProperty({
    example: 'Tecnología',
  })
  @IsString()
  nombre: string;

  @ApiPropertyOptional({
    example: 'Productos tecnológicos',
  })
  @IsOptional()
  @IsString()
  descripcion?: string;
}