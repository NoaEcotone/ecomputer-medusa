import { useEffect, useState } from "react"
import { Label, Select } from "@medusajs/ui"

interface Product {
  id: string
  title: string
  thumbnail?: string
}

interface ProductSelectorProps {
  value: string
  onChange: (productId: string) => void
  error?: string
}

export const ProductSelector = ({ value, onChange, error }: ProductSelectorProps) => {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch products from Medusa API
    fetch("/admin/products?limit=100", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        setProducts(data.products || [])
        setLoading(false)
      })
      .catch((error) => {
        console.error("Error fetching products:", error)
        setLoading(false)
      })
  }, [])

  return (
    <div className="flex flex-col space-y-2">
      <div className="flex items-center gap-x-1">
        <Label size="small" weight="plus">
          Product *
        </Label>
      </div>
      
      {loading ? (
        <div className="text-sm text-gray-500">Producten laden...</div>
      ) : (
        <Select value={value} onValueChange={onChange}>
          <Select.Trigger>
            <Select.Value placeholder="Selecteer een product..." />
          </Select.Trigger>
          <Select.Content>
            {products.length === 0 ? (
              <Select.Item value="" disabled>
                Geen producten gevonden
              </Select.Item>
            ) : (
              products.map((product) => (
                <Select.Item key={product.id} value={product.id}>
                  <div className="flex items-center gap-2">
                    {product.thumbnail && (
                      <img 
                        src={product.thumbnail} 
                        alt={product.title}
                        className="w-6 h-6 object-cover rounded"
                      />
                    )}
                    <span>{product.title}</span>
                  </div>
                </Select.Item>
              ))
            )}
          </Select.Content>
        </Select>
      )}
      
      {error && (
        <p className="text-ui-fg-error text-xs">
          {error}
        </p>
      )}
      
      <p className="text-ui-fg-subtle text-xs">
        Selecteer het product waarvoor je verhuurprijzen wilt instellen
      </p>
    </div>
  )
}
