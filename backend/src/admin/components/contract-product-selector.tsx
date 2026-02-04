import { Button, Input, Label, Select, Table } from "@medusajs/ui"
import { Plus, Trash } from "@medusajs/icons"
import { useEffect, useState } from "react"

interface Product {
  id: string
  title: string
  thumbnail?: string
}

interface RentalPricing {
  product_id: string
  flex_monthly_price: number | null
  year_monthly_price: number | null
  deposit_amount: number | null
  flex_available: boolean
  year_available: boolean
}

interface ContractItem {
  product_id: string
  product_title?: string
  quantity: number
  serial_number?: string
  monthly_price: number
}

interface ContractProductSelectorProps {
  contractType: "flex" | "jaar" | "offerte"
  items: ContractItem[]
  onChange: (items: ContractItem[]) => void
}

export const ContractProductSelector = ({
  contractType,
  items,
  onChange,
}: ContractProductSelectorProps) => {
  const [products, setProducts] = useState<Product[]>([])
  const [pricings, setPricings] = useState<Record<string, RentalPricing>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch products and pricing
    Promise.all([
      fetch("/admin/products?limit=1000", { credentials: "include" }).then((r) => r.json()),
      fetch("/admin/rental-pricing", { credentials: "include" }).then((r) => r.json()),
    ])
      .then(([productsData, pricingData]) => {
        setProducts(productsData.products || [])
        
        // Create pricing lookup by product_id
        const pricingMap: Record<string, RentalPricing> = {}
        ;(pricingData.rental_pricings || []).forEach((pricing: RentalPricing) => {
          pricingMap[pricing.product_id] = pricing
        })
        setPricings(pricingMap)
        
        setLoading(false)
      })
      .catch((error) => {
        console.error("Error fetching data:", error)
        setLoading(false)
      })
  }, [])

  const addItem = () => {
    onChange([
      ...items,
      {
        product_id: "",
        quantity: 1,
        serial_number: "",
        monthly_price: 0,
      },
    ])
  }

  const removeItem = (index: number) => {
    onChange(items.filter((_, i) => i !== index))
  }

  const updateItem = (index: number, field: keyof ContractItem, value: any) => {
    const newItems = [...items]
    newItems[index] = { ...newItems[index], [field]: value }
    
    // Auto-fill monthly price when product is selected
    if (field === "product_id" && value) {
      const pricing = pricings[value]
      const product = products.find((p) => p.id === value)
      
      if (pricing) {
        const price =
          contractType === "flex"
            ? pricing.flex_monthly_price
            : pricing.year_monthly_price
        newItems[index].monthly_price = price || 0
      }
      
      if (product) {
        newItems[index].product_title = product.title
      }
    }
    
    onChange(newItems)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("nl-NL", {
      style: "currency",
      currency: "EUR",
    }).format(amount)
  }

  const getTotalMonthly = () => {
    return items.reduce((sum, item) => sum + item.monthly_price * item.quantity, 0)
  }

  if (loading) {
    return <div className="text-sm text-gray-500">Producten laden...</div>
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label>Producten</Label>
        <Button size="small" variant="secondary" onClick={addItem}>
          <Plus className="mr-2" />
          Product Toevoegen
        </Button>
      </div>

      {items.length === 0 ? (
        <div className="text-sm text-gray-500 py-4 text-center border border-dashed rounded">
          Geen producten toegevoegd. Klik op "Product Toevoegen" om te beginnen.
        </div>
      ) : (
        <Table>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Product</Table.HeaderCell>
              <Table.HeaderCell>Aantal</Table.HeaderCell>
              <Table.HeaderCell>Serienummer</Table.HeaderCell>
              <Table.HeaderCell>Maandprijs</Table.HeaderCell>
              <Table.HeaderCell>Subtotaal</Table.HeaderCell>
              <Table.HeaderCell></Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {items.map((item, index) => (
              <Table.Row key={index}>
                <Table.Cell>
                  <Select
                    value={item.product_id}
                    onValueChange={(value) => updateItem(index, "product_id", value)}
                  >
                    <Select.Trigger className="w-full">
                      <Select.Value placeholder="Selecteer product" />
                    </Select.Trigger>
                    <Select.Content>
                      {products.map((product) => (
                        <Select.Item key={product.id} value={product.id}>
                          {product.title}
                        </Select.Item>
                      ))}
                    </Select.Content>
                  </Select>
                </Table.Cell>
                <Table.Cell>
                  <Input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) =>
                      updateItem(index, "quantity", parseInt(e.target.value) || 1)
                    }
                    className="w-20"
                  />
                </Table.Cell>
                <Table.Cell>
                  <Input
                    type="text"
                    value={item.serial_number || ""}
                    onChange={(e) => updateItem(index, "serial_number", e.target.value)}
                    placeholder="Optioneel"
                  />
                </Table.Cell>
                <Table.Cell>
                  <Input
                    type="number"
                    step="0.01"
                    value={item.monthly_price}
                    onChange={(e) =>
                      updateItem(index, "monthly_price", parseFloat(e.target.value) || 0)
                    }
                    className="w-32"
                  />
                </Table.Cell>
                <Table.Cell>
                  {formatCurrency(item.monthly_price * item.quantity)}
                </Table.Cell>
                <Table.Cell>
                  <Button
                    size="small"
                    variant="transparent"
                    onClick={() => removeItem(index)}
                  >
                    <Trash className="text-red-500" />
                  </Button>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      )}

      {items.length > 0 && (
        <div className="flex justify-end pt-4 border-t">
          <div className="text-right">
            <div className="text-sm text-gray-500">Totaal Maandbedrag</div>
            <div className="text-2xl font-bold">{formatCurrency(getTotalMonthly())}</div>
          </div>
        </div>
      )}
    </div>
  )
}
