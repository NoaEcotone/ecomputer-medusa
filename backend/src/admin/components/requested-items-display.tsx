import { Badge } from "@medusajs/ui"

interface RequestedItem {
  product_id: string
  product_title?: string
  rental_type: string
  quantity: number
}

interface RequestedItemsDisplayProps {
  requestedItemsJson: string
}

export default function RequestedItemsDisplay({ requestedItemsJson }: RequestedItemsDisplayProps) {
  let items: RequestedItem[] = []
  
  try {
    items = JSON.parse(requestedItemsJson)
  } catch (error) {
    return (
      <div className="text-sm text-ui-fg-subtle">
        Fout bij het laden van items
      </div>
    )
  }

  if (!Array.isArray(items) || items.length === 0) {
    return (
      <div className="text-sm text-ui-fg-subtle">
        Geen items
      </div>
    )
  }

  const rentalTypeLabels: Record<string, { label: string; color: string }> = {
    flex: { label: "Flex", color: "blue" },
    jaar: { label: "Jaar", color: "purple" },
    korte_termijn: { label: "Korte Termijn", color: "green" },
  }

  return (
    <div className="space-y-2">
      {items.map((item, index) => {
        const rentalInfo = rentalTypeLabels[item.rental_type] || { label: item.rental_type, color: "grey" }
        
        return (
          <div
            key={index}
            className="flex items-center gap-3 p-3 bg-ui-bg-subtle rounded-lg border border-ui-border-base"
          >
            {/* Product Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <p className="text-sm font-medium text-ui-fg-base truncate">
                  {item.product_title || item.product_id}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge size="2xsmall" color={rentalInfo.color as any}>
                  {rentalInfo.label}
                </Badge>
                <span className="text-xs text-ui-fg-subtle">
                  Aantal: {item.quantity}
                </span>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
