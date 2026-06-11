import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Plus } from 'lucide-react'

export default function Buildings() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Buildings Management</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Building
        </Button>
      </div>
      
      <Card>
        <CardContent className="p-8 text-center text-gray-500">
          Building management module coming soon...
        </CardContent>
      </Card>
    </div>
  )
}