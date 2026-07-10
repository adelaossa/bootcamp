import { NavLink } from 'react-router-dom'

export default function Navbar() {
  const baseClass = "px-3 py-2 rounded-md text-sm font-medium"
  const activeClass = "bg-blue-100 text-blue-700"
  const inactiveClass = "text-gray-600 hover:text-gray-900"

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-5xl mx-auto px-6 py-3 flex gap-4 items-center">
        <NavLink to="/" className={({ isActive }) =>
          `${baseClass} ${isActive ? activeClass : inactiveClass}`
        }>
          Inicio
        </NavLink>
        <NavLink to="/productos" className={({ isActive }) =>
          `${baseClass} ${isActive ? activeClass : inactiveClass}`
        }>
          Productos
        </NavLink>
        <NavLink to="/categorias" className={({ isActive }) =>
          `${baseClass} ${isActive ? activeClass : inactiveClass}`
        }>
          Categorias
        </NavLink>
      </div>
    </nav>
  )
}
