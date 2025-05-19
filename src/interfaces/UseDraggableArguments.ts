export interface UseDraggableArguments {
  id: string | number
  attributes?: {
    role?: string
    roleDescription?: string
    tabIndex?: number
  }
  data?: Record<string, unknown>
  disabled?: boolean
}
