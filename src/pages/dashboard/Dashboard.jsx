import { useEffect, useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card'
import { LoadingSpinner } from '../../components/ui/LoadingSpinner'
import { Badge } from '../../components/ui/Badge'
import {
  Building2,
  Home,
  Users,
  DollarSign,
  TrendingUp,
  Calendar,
} from 'lucide-react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts'
import { supabase } from '../../utils/supabase'

export function Dashboard() {
  const { profile } = useAuth()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalBuildings: 0,
    totalApartments: 0,
    totalCottageRooms: 0,
    totalRenters: 0,
    monthlyRevenue: 0,
    pendingPayments: 0,
  })
  const [recentPayments, setRecentPayments] = useState([])

  useEffect(() => {
    fetchDashboardData()
  }, [])

  async function fetchDashboardData() {
    setLoading(true)
    try {
      // Fetch buildings count
      const { count: buildingsCount } = await supabase
        .from('buildings')
        .select('*', { count: 'exact', head: true })
        .eq('owner_id', profile?.id)

      // Fetch apartments count
      const { count: apartmentsCount } = await supabase
        .from('apartments')
        .select('*', { count: 'exact', head: true })

      // Fetch cottage rooms count
      const { count: cottageRoomsCount } = await supabase
        .from('cottage_rooms')
        .select('*', { count: 'exact', head: true })

      // Fetch active renters
      const { count: rentersCount } = await supabase
        .from('apartment_renters')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true)

      // Fetch monthly payments
      const currentMonth = new Date().toISOString().slice(0, 7)
      const { data: payments } = await supabase
        .from('monthly_payments')
        .select('*')
        .eq('billing_month', `${currentMonth}-01`)

      const totalRevenue = payments?.reduce((sum, p) => sum + p.paid_amount, 0) || 0
      const pending = payments?.reduce((sum, p) => sum + p.due_amount, 0) || 0

      // Fetch recent payments
      const { data: recent } = await supabase
        .from('monthly_payments')
        .select(`
          *,
          apartment_renters:apartment_renter_id(full_name),
          cottage_renters:cottage_renter_id(full_name)
        `)
        .order('payment_date', { ascending: false })
        .limit(5)

      setStats({
        totalBuildings: buildingsCount || 0,
        totalApartments: apartmentsCount || 0,
        totalCottageRooms: cottageRoomsCount || 0,
        totalRenters: rentersCount || 0,
        monthlyRevenue: totalRevenue,
        pendingPayments: pending,
      })
      setRecentPayments(recent || [])
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const chartData = [
    { month: 'Jan', revenue: 45000 },
    { month: 'Feb', revenue: 52000 },
    { month: 'Mar', revenue: 48000 },
    { month: 'Apr', revenue: 61000 },
    { month: 'May', revenue: 55000 },
    { month: 'Jun', revenue: 67000 },
  ]

  const pieData = [
    { name: 'Apartments', value: stats.totalApartments, color: '#3b82f6' },
    { name: 'Cottages', value: stats.totalCottageRooms, color: '#10b981' },
  ]

  const statCards = [
    { title: 'Total Buildings', value: stats.totalBuildings, icon: Building2, color: 'primary' },
    { title: 'Total Units', value: stats.totalApartments + stats.totalCottageRooms, icon: Home, color: 'blue' },
    { title: 'Active Renters', value: stats.totalRenters, icon: Users, color: 'green' },
    { title: 'Monthly Revenue', value: `৳${stats.monthlyRevenue.toLocaleString()}`, icon: DollarSign, color: 'purple', trend: '+12%' },
    { title: 'Pending Payments', value: `৳${stats.pendingPayments.toLocaleString()}`, icon: TrendingUp, color: 'orange' },
    { title: 'Occupancy Rate', value: '78%', icon: Calendar, color: 'primary', trend: '+5%' },
  ]

  if (loading) {
    return <LoadingSpinner size="lg" className="h-96" />
  }

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {statCards.map((stat, index) => (
          <Card key={index} hover>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="mt-2 text-2xl font-bold text-gray-900">{stat.value}</p>
                  {stat.trend && (
                    <p className="mt-2 text-sm text-green-600">{stat.trend} from last month</p>
                  )}
                </div>
                <div className={`rounded-full bg-${stat.color}-100 p-3`}>
                  <stat.icon className={`h-6 w-6 text-${stat.color}-600`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Revenue Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="revenue" stroke="#3b82f6" fill="#93c5fd" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Unit Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => `${entry.name}: ${entry.value}`}
                  outerRadius={80}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Payments */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Payments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="py-3 text-left text-sm font-medium text-gray-600">Renter</th>
                  <th className="py-3 text-left text-sm font-medium text-gray-600">Month</th>
                  <th className="py-3 text-left text-sm font-medium text-gray-600">Amount</th>
                  <th className="py-3 text-left text-sm font-medium text-gray-600">Status</th>
                  <th className="py-3 text-left text-sm font-medium text-gray-600">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentPayments.map((payment) => (
                  <tr key={payment.id} className="border-b border-gray-100">
                    <td className="py-3 text-sm text-gray-900">
                      {payment.apartment_renters?.full_name || payment.cottage_renters?.full_name}
                    </td>
                    <td className="py-3 text-sm text-gray-600">
                      {new Date(payment.billing_month).toLocaleDateString('default', { month: 'long', year: 'numeric' })}
                    </td>
                    <td className="py-3 text-sm font-medium text-gray-900">৳{payment.paid_amount}</td>
                    <td className="py-3">
                      <Badge variant={payment.status === 'paid' ? 'success' : 'warning'}>
                        {payment.status}
                      </Badge>
                    </td>
                    <td className="py-3 text-sm text-gray-600">
                      {payment.payment_date ? new Date(payment.payment_date).toLocaleDateString() : '-'}
                    </td>
                  </tr>
                ))}
                {recentPayments.length === 0 && (
                  <tr>
                    <td colSpan="5" className="py-8 text-center text-gray-500">
                      No recent payments found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}