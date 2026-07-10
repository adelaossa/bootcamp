import { useState, useEffect } from 'react'
import type { Categoria, CreateCategoriaDto } from '../types'

interface CategoryFormProps {
  categoria?: Categoria | null
  onSubmit: (data: CreateCategoriaDto) => Promise<void>
  onCancel?: () => void
  cargando?: boolean
}

export default function CategoryForm({ categoria, onSubmit, onCancel, cargando }: CategoryFormProps) {
  const [form, setForm] = useState<CreateCategoriaDto>({ nombre: '', descripcion: '' })
  const [error, setError] = useState<string | null>(null)
  const editando = !!categoria

  useEffect(() => {
    if (categoria) {
      setForm({ nombre: categoria.nombre, descripcion: categoria.descripcion ?? '' })
    } else {
      setForm({ nombre: '', descripcion: '' })
    }
    setError(null)
  }, [categoria])

  function validar(): boolean {
    if (!form.nombre.trim()) {
      setError('El nombre es obligatorio')
      return false
    }
    setError(null)
    return true
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validar()) return
    await onSubmit(form)
    if (!editando) setForm({ nombre: '', descripcion: '' })
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border p-4 mb-6">
      <h2 className="text-lg font-semibold mb-4">
        {editando ? 'Editar Categoria' : 'Nueva Categoria'}
      </h2>

      <div className="flex gap-3">
        <div className="flex-1">
          <input
            value={form.nombre}
            onChange={e => setForm(prev => ({ ...prev, nombre: e.target.value }))}
            placeholder="Nombre de la categoria"
            className="w-full border rounded px-3 py-2 text-sm"
          />
          {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
        </div>

        <div className="flex-1">
          <input
            value={form.descripcion ?? ''}
            onChange={e => setForm(prev => ({ ...prev, descripcion: e.target.value }))}
            placeholder="Descripcion (opcional)"
            className="w-full border rounded px-3 py-2 text-sm"
          />
        </div>

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={cargando}
            className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded text-sm disabled:opacity-50"
          >
            {cargando ? 'Guardando...' : editando ? 'Actualizar' : 'Crear'}
          </button>
          {editando && onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-2 px-4 rounded text-sm"
            >
              Cancelar
            </button>
          )}
        </div>
      </div>
    </form>
  )
}
