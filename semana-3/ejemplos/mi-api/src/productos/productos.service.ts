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
    const producto = await this.productosRepository.findOneBy({ id });

    if (!producto) {
      throw new NotFoundException(`Producto ${id} no encontrado`);
    }

    if (dto.nombre !== undefined) producto.nombre = dto.nombre;
    if (dto.descripcion !== undefined) producto.descripcion = dto.descripcion;
    if (dto.precio !== undefined) producto.precio = dto.precio;
    if (dto.stock !== undefined) producto.stock = dto.stock;
    if (dto.activo !== undefined) producto.activo = dto.activo;

    if (dto.categoriaId !== undefined) {
      const categoria = await this.categoriasRepository.findOneBy({
        id: dto.categoriaId,
      });

      if (!categoria) {
        throw new NotFoundException('Categoría no encontrada');
      }

      producto.categoria = categoria;
    }

    return this.productosRepository.save(producto);
  }

  async remove(id: number) {
    const entity = await this.findOne(id);

    if (entity) {
      await this.productosRepository.remove(entity);
    }

    return entity;
  }
}