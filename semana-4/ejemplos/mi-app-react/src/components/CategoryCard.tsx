import type { Categoria } from '../types'

interface CategoryCardProps {
  categoria: Categoria
  onEdit?: (categoria: Categoria) => void
  onDelete?: (id: number) => void
}

export default function CategoryCard({ categoria, onEdit, onDelete }: CategoryCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-4 flex justify-between items-center">
      <div>
        <p className="font-semibold text-gray-800">{categoria.nombre}</p>
        {categoria.descripcion && (
          <p className="text-gray-500 text-sm mt-1">{categoria.descripcion}</p>
        )}
      </div>
      <div className="flex gap-2">
        {onEdit && (
          <button
            onClick={() => onEdit(categoria)}
            className="text-blue-500 hover:text-blue-700 text-sm font-medium"
          >
            Editar
          </button>
        )}
        {onDelete && (
          <button
            onClick={() => onDelete(categoria.id)}
            className="text-red-500 hover:text-red-700 text-sm font-medium"
          >
            Eliminar
          </button>
        )}
      </div>
    </div>
  )
}
