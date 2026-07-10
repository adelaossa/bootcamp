import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorMessage from '../components/ErrorMessage'

const API_URL = import.meta.env.VITE_API_URL

export default function HomePage() {
  const [totales, setTotales] = useState({ productos: 0, categorias: 0 })
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function cargar() {
      try {
        const [resProd, resCat] = await Promise.all([
          fetch(`${API_URL}/productos`),
          fetch(`${API_URL}/categorias`)
        ])

        if (!resProd.ok || !resCat.ok) {
          throw new Error('Error al conectar con la API')
        }

        const productos = await resProd.json()
        const categorias = await resCat.json()

        setTotales({
          productos: productos.length,
          categorias: categorias.length
        })
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido')
      } finally {
        setCargando(false)
      }
    }

    cargar()
  }, [])

  if (cargando) return <LoadingSpinner />
  if (error) return <ErrorMessage message={error} />

  return (
    <div className="text-center py-16">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">Mi App React</h1>
      <p className="text-gray-500 mb-8">Frontend conectado a la API NestJS</p>

      <div className="flex justify-center gap-8">
        <Link to="/productos" className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition w-48">
          <p className="text-3xl font-bold text-blue-600">{totales.productos}</p>
          <p className="text-gray-500 text-sm mt-1">Productos</p>
        </Link>

        <div className="bg-white rounded-lg shadow-sm border p-6 w-48">
          <p className="text-3xl font-bold text-green-600">{totales.categorias}</p>
          <p className="text-gray-500 text-sm mt-1">Categorias</p>
        </div>
      </div>
    </div>
  )
}
