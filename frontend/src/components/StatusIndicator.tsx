import { Badge } from "@/components/ui/badge"

interface StatusIndicatorProps {
  status: 'online' | 'away' | 'busy' | 'offline'
  showText?: boolean
}

export function StatusIndicator({ status, showText = false }: StatusIndicatorProps) {
  const statusConfig = {
    online: { color: 'bg-green-500', text: 'Online', textColor: 'text-green-600' },
    away: { color: 'bg-yellow-500', text: 'Away', textColor: 'text-yellow-600' },
    busy: { color: 'bg-red-500', text: 'Busy', textColor: 'text-red-600' },
    offline: { color: 'bg-muted-foreground', text: 'Offline', textColor: 'text-muted-foreground' }
  }

  const config = statusConfig[status]

  if (showText) {
    return (
      <Badge variant="secondary" className="text-xs">
        <div className={`w-2 h-2 rounded-full mr-1 ${config.color}`} />
        <span className={config.textColor}>{config.text}</span>
      </Badge>
    )
  }

  return (
    <div className={`w-3 h-3 rounded-full ${config.color} border-2 border-background`} />
  )
}