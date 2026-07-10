import { useEffect, useState } from 'react'
import type { Producto, Categoria, CreateProductoDto } from '../types'
import ProductCard from '../components/ProductCard'
import ProductForm from '../components/ProductForm'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorMessage from '../components/ErrorMessage'
import EmptyState from '../components/EmptyState'

const API_URL = import.meta.env.VITE_API_URL

export default function ProductsPage() {
  const [productos, setProductos] = useState<Producto[]>([])
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [cargando, setCargando] = useState(true)
  const [guardando, setGuardando] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [editando, setEditando] = useState<Producto | null>(null)

  useEffect(() => {
    cargarDatos()
  }, [])

  async function cargarDatos() {
    try {
      const [resProd, resCat] = await Promise.all([
        fetch(`${API_URL}/productos`),
        fetch(`${API_URL}/categorias`)
      ])
      if (!resProd.ok || !resCat.ok) throw new Error('Error al conectar con la API')
      setProductos(await resProd.json())
      setCategorias(await resCat.json())
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
    } finally {
      setCargando(false)
    }
  }

  async function handleSubmit(data: CreateProductoDto) {
    setGuardando(true)
    try {
      if (editando) {
        const response = await fetch(`${API_URL}/productos/${editando.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        })
        if (!response.ok) {
          const err = await response.json()
          throw new Error(err.message || 'Error al actualizar')
        }
        const actualizado = await response.json()
        setProductos(prev => prev.map(p => p.id === actualizado.id ? actualizado : p))
        setEditando(null)
      } else {
        const response = await fetch(`${API_URL}/productos`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        })
        if (!response.ok) {
          const err = await response.json()
          throw new Error(err.message || 'Error al crear')
        }
        const creado = await response.json()
        setProductos(prev => [...prev, creado])
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error al guardar producto')
    } finally {
      setGuardando(false)
    }
  }

  async function handleDelete(id: number) {
    try {
      const response = await fetch(`${API_URL}/productos/${id}`, { method: 'DELETE' })
      if (!response.ok) throw new Error('Error al eliminar')
      setProductos(prev => prev.filter(p => p.id !== id))
      if (editando?.id === id) setEditando(null)
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error al eliminar')
    }
  }

  if (cargando) return <LoadingSpinner />
  if (error) return <ErrorMessage message={error} />

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Productos</h1>

      <ProductForm
        categorias={categorias}
        producto={editando}
        onSubmit={handleSubmit}
        onCancel={() => setEditando(null)}
        cargando={guardando}
      />

      {productos.length === 0 ? (
        <EmptyState message="No hay productos. Crea el primero usando el formulario." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {productos.map(p => (
            <ProductCard
              key={p.id}
              producto={p}
              onEdit={setEditando}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  )
}
