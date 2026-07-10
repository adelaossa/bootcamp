import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import type { Producto } from '../types'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorMessage from '../components/ErrorMessage'

const API_URL = import.meta.env.VITE_API_URL

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [producto, setProducto] = useState<Producto | null>(null)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return

    async function cargar() {
      setCargando(true)
      try {
        const response = await fetch(`${API_URL}/productos/${id}`)

        if (response.status === 404) {
          setError('Producto no encontrado')
          return
        }

        if (!response.ok) {
          throw new Error(`Error ${response.status}`)
        }

        setProducto(await response.json())
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar')
      } finally {
        setCargando(false)
      }
    }

    cargar()
  }, [id])

  if (cargando) return <LoadingSpinner />
  if (error) return <ErrorMessage message={error} />
  if (!producto) return <ErrorMessage message="Producto no encontrado" />

  return (
    <div>
      <Link to="/productos" className="text-blue-500 hover:underline text-sm">← Volver a productos</Link>

      <div className="bg-white rounded-lg shadow-sm border p-6 mt-4">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">{producto.nombre}</h1>

        {producto.descripcion && (
          <p className="text-gray-500 mb-4">{producto.descripcion}</p>
        )}

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-500">Precio</span>
            <p className="text-xl font-bold text-gray-800">${producto.precio}</p>
          </div>
          <div>
            <span className="text-gray-500">Stock</span>
            <p className="text-xl font-bold text-gray-800">{producto.stock}</p>
          </div>
          <div>
            <span className="text-gray-500">Estado</span>
            <p className={`font-medium ${producto.activo ? 'text-green-600' : 'text-red-600'}`}>
              {producto.activo ? 'Activo' : 'Inactivo'}
            </p>
          </div>
          <div>
            <span className="text-gray-500">Categoria</span>
            <p className="font-medium text-gray-800">
              {producto.categoria?.nombre ?? 'Sin categoria'}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
