// categorias/entities/categoria.entity.ts

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
} from 'typeorm';

import { Producto } from '../../productos/entities/producto.entity';

@Entity('categorias')
export class Categoria {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    unique: true,
    length: 100,
  })
  nombre: string;

  @Column({
    nullable: true,
    type: 'text',
  })
  descripcion?: string;

  @OneToMany(
    () => Producto,
    producto => producto.categoria,
  )
  productos: Producto[];
}