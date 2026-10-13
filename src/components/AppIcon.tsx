'use client'

import {
  Activity,
  CalendarDays,
  CircleCheck,
  Clock,
  LayoutDashboard,
  Package,
  Palette,
  Sparkles,
  Store,
} from 'lucide-react'

const iconMap = {
  '⌂': Store,
  '◈': Package,
  '▣': Palette,
  '✦': Sparkles,
  '▦': LayoutDashboard,
  '◔': Clock,
  '◷': CalendarDays,
  '✓': CircleCheck,
  '●': Activity,
}

function AppIcon({ name, size = 22 }) {
  const Icon = iconMap[name]

  if (!Icon) {
    return <>{name}</>
  }

  return (
    <Icon
      size={size}
      aria-hidden="true"
    />
  )
}

export default AppIcon