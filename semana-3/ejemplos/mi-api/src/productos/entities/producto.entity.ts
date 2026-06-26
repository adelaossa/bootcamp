import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Categoria } from '../../categorias/entities/categoria.entity';

@Entity('productos')
export class Producto {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 200,
  })
  nombre: string;

  @Column('text', {
    nullable: true,
  })
  descripcion?: string;

  @Column('numeric', {
    precision: 10,
    scale: 2,
  })
  precio: number;

  @Column({
    default: 0,
  })
  stock: number;

  @Column({
    default: true,
  })
  activo: boolean;

    @ManyToOne(
    () => Categoria,
    categoria => categoria.productos,
    {
      nullable: false,
      eager: false,
    },
  )
  @JoinColumn({
    name: 'categoria_id',
  })
  categoria: Categoria;
}