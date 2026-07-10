import { useState, useEffect } from 'react'
import type { Categoria, Producto, CreateProductoDto } from '../types'

interface ProductFormProps {
  categorias: Categoria[]
  producto?: Producto | null
  onSubmit: (data: CreateProductoDto) => Promise<void>
  onCancel?: () => void
  cargando?: boolean
}

function emptyForm(): CreateProductoDto {
  return { nombre: '', precio: 0, stock: 0, categoriaId: 0 }
}

export default function ProductForm({ categorias, producto, onSubmit, onCancel, cargando }: ProductFormProps) {
  const [form, setForm] = useState<CreateProductoDto>(emptyForm())
  const [errores, setErrores] = useState<Record<string, string>>({})
  const editando = !!producto

  useEffect(() => {
    if (producto) {
      setForm({
        nombre: producto.nombre,
        precio: Number(producto.precio),
        stock: producto.stock,
        categoriaId: producto.categoria?.id ?? 0
      })
    } else {
      setForm(emptyForm())
    }
    setErrores({})
  }, [producto])

  function validar(): boolean {
    const nuevos: Record<string, string> = {}
    if (!form.nombre.trim()) nuevos.nombre = 'El nombre es obligatorio'
    if (form.precio <= 0) nuevos.precio = 'El precio debe ser mayor a 0'
    if (form.stock < 0) nuevos.stock = 'El stock no puede ser negativo'
    setErrores(nuevos)
    return Object.keys(nuevos).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validar()) return
    await onSubmit(form)
    if (!editando) {
      setForm(emptyForm())
    }
    setErrores({})
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border p-4 mb-6">
      <h2 className="text-lg font-semibold mb-4">
        {editando ? 'Editar Producto' : 'Nuevo Producto'}
      </h2>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <input
            value={form.nombre}
            onChange={e => setForm(prev => ({ ...prev, nombre: e.target.value }))}
            placeholder="Nombre del producto"
            className="w-full border rounded px-3 py-2 text-sm"
          />
          {errores.nombre && <p className="text-red-500 text-xs mt-1">{errores.nombre}</p>}
        </div>

        <div>
          <input
            type="number"
            value={form.precio || ''}
            onChange={e => setForm(prev => ({ ...prev, precio: Number(e.target.value) }))}
            placeholder="Precio"
            className="w-full border rounded px-3 py-2 text-sm"
          />
          {errores.precio && <p className="text-red-500 text-xs mt-1">{errores.precio}</p>}
        </div>

        <div>
          <input
            type="number"
            value={form.stock || ''}
            onChange={e => setForm(prev => ({ ...prev, stock: Number(e.target.value) }))}
            placeholder="Stock"
            className="w-full border rounded px-3 py-2 text-sm"
          />
          {errores.stock && <p className="text-red-500 text-xs mt-1">{errores.stock}</p>}
        </div>

        <div>
          <select
            value={form.categoriaId || ''}
            onChange={e => setForm(prev => ({
              ...prev,
              categoriaId: Number(e.target.value)
            }))}
            className="w-full border rounded px-3 py-2 text-sm"
          >
            <option value="">Sin categoria</option>
            {categorias.map(c => (
              <option key={c.id} value={c.id}>{c.nombre}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-4 flex gap-2">
        <button
          type="submit"
          disabled={cargando}
          className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-6 rounded text-sm disabled:opacity-50"
        >
          {cargando ? 'Guardando...' : editando ? 'Actualizar' : 'Crear producto'}
        </button>
        {editando && onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-2 px-6 rounded text-sm"
          >
            Cancelar
          </button>
        )}
      </div>
    </form>
  )
}
