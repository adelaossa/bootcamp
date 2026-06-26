// categorias.controller.ts

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  ParseIntPipe,
} from '@nestjs/common';

import {
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { CategoriasService } from './categorias.service';
import { CreateCategoriaDto } from './dto/create-categoria.dto';
import { UpdateCategoriaDto } from './dto/update-categoria.dto';
import { Categoria } from './entities/categoria.entity';

@ApiTags('categorias')
@Controller('categorias')
export class CategoriasController {
  constructor(
    private readonly categoriasService: CategoriasService,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Crear una categoría',
  })
  @ApiResponse({
    status: 201,
    description: 'Categoría creada',
    type: Categoria,
  })
  create(
    @Body() dto: CreateCategoriaDto,
  ) {
    return this.categoriasService.create(dto);
  }

  @Get()
  @ApiOperation({
    summary: 'Listar categorías',
  })
  @ApiResponse({
    status: 200,
    type: Categoria,
    isArray: true,
  })
  findAll() {
    return this.categoriasService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener categoría por ID',
  })
  @ApiResponse({
    status: 200,
    type: Categoria,
  })
  findOne(
    @Param('id', ParseIntPipe)
    id: number,
  ) {
    return this.categoriasService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Actualizar categoría',
  })
  update(
    @Param('id', ParseIntPipe)
    id: number,

    @Body()
    dto: UpdateCategoriaDto,
  ) {
    return this.categoriasService.update(
      id,
      dto,
    );
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Eliminar categoría',
  })
  remove(
    @Param('id', ParseIntPipe)
    id: number,
  ) {
    return this.categoriasService.remove(id);
  }
}