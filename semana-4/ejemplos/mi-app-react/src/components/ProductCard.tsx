import { Link } from 'react-router-dom'
import type { Producto } from '../types'

interface ProductCardProps {
  producto: Producto
  onEdit?: (producto: Producto) => void
  onDelete?: (id: number) => void
}

export default function ProductCard({ producto, onEdit, onDelete }: ProductCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-4 hover:shadow-md transition">
      <div className="flex justify-between items-start mb-2">
        <Link to={`/productos/${producto.id}`} className="font-semibold text-blue-600 hover:underline">
          {producto.nombre}
        </Link>
        <div className="flex gap-2">
          {onEdit && (
            <button
              onClick={() => onEdit(producto)}
              className="text-blue-500 hover:text-blue-700 text-sm font-medium"
            >
              Editar
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(producto.id)}
              className="text-red-500 hover:text-red-700 text-sm font-medium"
            >
              Eliminar
            </button>
          )}
        </div>
      </div>

      {producto.descripcion && (
        <p className="text-gray-500 text-sm mb-2 line-clamp-2">{producto.descripcion}</p>
      )}

      <div className="flex justify-between items-center text-sm">
        <span className="text-lg font-bold text-gray-800">${producto.precio}</span>
        <span className="text-gray-500">Stock: {producto.stock}</span>
      </div>

      {producto.categoria && (
        <span className="inline-block mt-2 text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">
          {producto.categoria.nombre}
        </span>
      )}
    </div>
  )
}
