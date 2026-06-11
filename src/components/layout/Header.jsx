import { useAuth } from '../../hooks/useAuth'
import { Bell, User } from 'lucide-react'
import { cn } from '../../lib/utils'

export function Header() {
  const { profile } = useAuth()

  return (
    <header className="sticky top-0 z-20 bg-white border-b border-gray-200">
      <div className="flex h-16 items-center justify-between px-8">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">
            Welcome back, {profile?.full_name?.split(' ')[0] || 'User'}
          </h2>
          <p className="text-sm text-gray-600">
            Here's what's happening with your properties today.
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <button className="relative rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600">
            <Bell className="h-5 w-5" />
            <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500" />
          </button>
          
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100">
              <User className="h-4 w-4 text-primary-600" />
            </div>
            <div className="hidden md:block">
              <p className="text-sm font-medium text-gray-700">{profile?.full_name}</p>
              <p className="text-xs capitalize text-gray-500">{profile?.role}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}