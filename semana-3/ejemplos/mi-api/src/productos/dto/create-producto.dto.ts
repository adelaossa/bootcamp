import {
  IsString,
  IsNumber,
  IsOptional,
  IsBoolean,
  Min,
  IsInt,
} from 'class-validator';

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateProductoDto {

  @ApiProperty({
    example: 'Laptop Lenovo',
    description: 'Nombre del producto',
  })
  @IsString()
  nombre: string;

  @ApiPropertyOptional({
    example: 'Laptop Core i7 de 16GB RAM',
  })
  @IsOptional()
  @IsString()
  descripcion?: string;

  @ApiProperty({
    example: 3500.50,
  })
  @IsNumber()
  @Min(0)
  precio: number;

  @ApiProperty({
    example: 10,
  })
  @IsNumber()
  @Min(0)
  stock: number;

  @ApiPropertyOptional({
    example: true,
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  activo?: boolean;

  @ApiProperty({
    example: 1,
    description: 'ID de la categoría',
  })
  @IsInt()
  categoriaId: number;
}