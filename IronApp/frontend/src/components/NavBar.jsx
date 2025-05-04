import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Menu, X, User, Book, Home, LogOut } from 'lucide-react'
import useAuth from '../features/auth/hooks/useAuth'
import logoGym from '../assets/logoGym.png'

/* 
NavBar component has a logo, a navigation bar for profile, food log, and dashboard, and a logout button.
*/

export default function NavBar() {
  const [isOpen, setIsOpen] = useState(false)
  const { logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const navigation = [
    { name: 'Dashboard', href: '/', icon: Home },
    { name: 'Food Log', href: '/food-log', icon: Book },
    { name: 'Profile', href: '/profile', icon: User },
  ]

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className="bg-[var(--neutral-color-blue)] shadow-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between">
          <div className="flex">
            <div className="flex flex-shrink-0 items-center">
              <img className="h-15 w-auto" src={logoGym} alt="GymNutrition" />
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navigation.map((item) => {
                const Icon = item.icon
                const isActive = location.pathname === item.href
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${
                      isActive
                        ? 'border-b-2 border-[var(--primary-color-teal)] text-white'
                        : 'border-b-2 border-transparent text-gray-300 hover:border-gray-300 hover:text-white'
                    }`}
                  >
                    <Icon className="mr-1 h-4 w-4" />
                    {item.name}
                  </Link>
                )
              })}
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            <button
              onClick={handleLogout}
              className="group flex items-center rounded-md bg-[var(--primary-color-teal)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--secondary-color-green)] transition-colors"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </button>
          </div>
          <div className="flex items-center sm:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center rounded-md p-2 text-gray-300 hover:bg-[var(--primary-color-blue)] hover:text-white"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="sm:hidden">
          <div className="space-y-1 px-2 pb-3 pt-2">
            {navigation.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.href
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`rounded-md px-3 py-2 text-base font-medium flex items-center ${
                    isActive
                      ? 'bg-[var(--primary-color-blue)] text-white'
                      : 'text-gray-300 hover:bg-[var(--primary-color-blue)/50] hover:text-white'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  <Icon className="mr-2 h-5 w-5" />
                  {item.name}
                </Link>
              )
            })}
            <button
              onClick={handleLogout}
              className="mt-2 flex w-full items-center rounded-md bg-[var(--primary-color-teal)] px-3 py-2 text-base font-medium text-white hover:bg-[var(--secondary-color-green)]"
            >
              <LogOut className="mr-2 h-5 w-5" />
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  )
}
