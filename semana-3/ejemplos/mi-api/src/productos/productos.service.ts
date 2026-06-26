import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { Producto } from './entities/producto.entity';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { Categoria } from '../categorias/entities/categoria.entity';

@Injectable()
export class ProductosService {
  constructor(
    @InjectRepository(Producto)
    private readonly productosRepository: Repository<Producto>,

    @InjectRepository(Categoria)
    private readonly categoriasRepository: Repository<Categoria>,
  ) {}

  async create(dto: CreateProductoDto) {
    const categoria =
      await this.categoriasRepository.findOneBy({
        id: dto.categoriaId,
      });

    if (!categoria) {
      throw new NotFoundException(
        'Categoría no encontrada',
      );
    }

    const producto =
      this.productosRepository.create({
        nombre: dto.nombre,
        precio: dto.precio,
        stock: dto.stock,
        categoria,
      });

    return this.productosRepository.save(producto);
  }

  findAll() {
    return this.productosRepository.find({
      relations: {
        categoria: true,
      },
    });
  }

  findOne(id: number) {
    return this.productosRepository.findOne({ where:{ id }, relations: { categoria: true } });
  }

  async update(
    id: number,
    dto: UpdateProductoDto,
  ) {
    await this.productosRepository.update(id, dto);

    return this.findOne(id);
  }

  async remove(id: number) {
    const entity = await this.findOne(id);

    if (entity) {
      await this.productosRepository.remove(entity);
    }

    return entity;
  }
}