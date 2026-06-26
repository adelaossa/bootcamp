// categorias.service.ts

import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Categoria } from './entities/categoria.entity';
import { CreateCategoriaDto } from './dto/create-categoria.dto';
import { UpdateCategoriaDto } from './dto/update-categoria.dto';

@Injectable()
export class CategoriasService {
  constructor(
    @InjectRepository(Categoria)
    private readonly repository: Repository<Categoria>,
  ) {}

  async create(dto: CreateCategoriaDto) {
    const categoria = this.repository.create(dto);

    return this.repository.save(categoria);
  }

  findAll() {
    return this.repository.find({
      relations: {
        productos: true,
      },
    });
  }

  async findOne(id: number) {
    const categoria = await this.repository.findOne({
      where: { id },
      relations: {
        productos: true,
      },
    });

    if (!categoria) {
      throw new NotFoundException(
        `Categoría ${id} no encontrada`,
      );
    }

    return categoria;
  }

  async update(
    id: number,
    dto: UpdateCategoriaDto,
  ) {
    const categoria = await this.findOne(id);

    Object.assign(categoria, dto);

    return this.repository.save(categoria);
  }

  async remove(id: number) {
    const categoria = await this.findOne(id);

    await this.repository.remove(categoria);

    return {
      message: 'Categoría eliminada correctamente',
    };
  }
}