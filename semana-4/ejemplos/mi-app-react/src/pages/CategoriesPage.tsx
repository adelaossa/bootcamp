import { useEffect, useState } from 'react'
import type { Categoria, CreateCategoriaDto } from '../types'
import CategoryCard from '../components/CategoryCard'
import CategoryForm from '../components/CategoryForm'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorMessage from '../components/ErrorMessage'
import EmptyState from '../components/EmptyState'

const API_URL = import.meta.env.VITE_API_URL

export default function CategoriesPage() {
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [cargando, setCargando] = useState(true)
  const [guardando, setGuardando] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [editando, setEditando] = useState<Categoria | null>(null)

  useEffect(() => {
    cargarDatos()
  }, [])

  async function cargarDatos() {
    try {
      const response = await fetch(`${API_URL}/categorias`)
      if (!response.ok) throw new Error('Error al conectar con la API')
      setCategorias(await response.json())
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
    } finally {
      setCargando(false)
    }
  }

  async function handleSubmit(data: CreateCategoriaDto) {
    setGuardando(true)
    try {
      if (editando) {
        const response = await fetch(`${API_URL}/categorias/${editando.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        })
        if (!response.ok) {
          const err = await response.json()
          throw new Error(err.message || 'Error al actualizar')
        }
        const actualizada = await response.json()
        setCategorias(prev => prev.map(c => c.id === actualizada.id ? actualizada : c))
        setEditando(null)
      } else {
        const response = await fetch(`${API_URL}/categorias`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        })
        if (!response.ok) {
          const err = await response.json()
          throw new Error(err.message || 'Error al crear')
        }
        const creada = await response.json()
        setCategorias(prev => [...prev, creada])
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error al guardar categoria')
    } finally {
      setGuardando(false)
    }
  }

  async function handleDelete(id: number) {
    try {
      const response = await fetch(`${API_URL}/categorias/${id}`, { method: 'DELETE' })
      if (!response.ok) throw new Error('Error al eliminar')
      setCategorias(prev => prev.filter(c => c.id !== id))
      if (editando?.id === id) setEditando(null)
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error al eliminar')
    }
  }

  if (cargando) return <LoadingSpinner />
  if (error) return <ErrorMessage message={error} />

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Categorias</h1>

      <CategoryForm
        categoria={editando}
        onSubmit={handleSubmit}
        onCancel={() => setEditando(null)}
        cargando={guardando}
      />

      {categorias.length === 0 ? (
        <EmptyState message="No hay categorias. Crea la primera usando el formulario." />
      ) : (
        <div className="space-y-2">
          {categorias.map(c => (
            <CategoryCard
              key={c.id}
              categoria={c}
              onEdit={setEditando}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  )
}
