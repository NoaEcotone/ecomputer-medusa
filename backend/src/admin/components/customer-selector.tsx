import { Select } from "@medusajs/ui"
import { useEffect, useState } from "react"

interface Customer {
  id: string
  email: string
  first_name: string
  last_name: string
  company_name?: string
}

interface CustomerSelectorProps {
  value: string
  onChange: (customerId: string) => void
}

export const CustomerSelector = ({ value, onChange }: CustomerSelectorProps) => {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch customers from Medusa API
    fetch("/admin/customers?limit=1000", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        setCustomers(data.customers || [])
        setLoading(false)
      })
      .catch((error) => {
        console.error("Error fetching customers:", error)
        setLoading(false)
      })
  }, [])

  const getCustomerLabel = (customer: Customer) => {
    const name = `${customer.first_name || ""} ${customer.last_name || ""}`.trim()
    const company = customer.company_name ? ` (${customer.company_name})` : ""
    return `${name}${company} - ${customer.email}`
  }

  if (loading) {
    return (
      <div className="text-sm text-gray-500">
        Klanten laden...
      </div>
    )
  }

  return (
    <Select value={value} onValueChange={onChange}>
      <Select.Trigger>
        <Select.Value placeholder="Selecteer een klant" />
      </Select.Trigger>
      <Select.Content>
        {customers.map((customer) => (
          <Select.Item key={customer.id} value={customer.id}>
            {getCustomerLabel(customer)}
          </Select.Item>
        ))}
      </Select.Content>
    </Select>
  )
}
