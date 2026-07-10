import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div className="text-center py-20">
      <h1 className="text-6xl font-bold text-gray-300">404</h1>
      <p className="text-gray-500 mt-4 text-lg">Pagina no encontrada</p>
      <Link to="/" className="text-blue-500 hover:underline mt-4 inline-block">
        Volver al inicio
      </Link>
    </div>
  )
}
