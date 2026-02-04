import { defineRouteConfig } from "@medusajs/admin-sdk"
import { Container, Heading, Label, Input, Select, Textarea, Button, toast } from "@medusajs/ui"
import { useState } from "react"
import { CustomerSelector } from "../../../components/customer-selector"
import { ContractProductSelector } from "../../../components/contract-product-selector"

interface ContractItem {
  product_id: string
  product_title?: string
  quantity: number
  serial_number?: string
  monthly_price: number
}

const NewContractPage = () => {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    contract_number: `CONT-${Date.now()}`,
    customer_id: "",
    type: "flex" as "flex" | "jaar" | "offerte",
    start_date: new Date().toISOString().split("T")[0],
    end_date: "",
    earliest_end_date: "",
    monthly_amount: 0,
    deposit_amount: 0,
    deposit_paid: false,
    notes: "",
  })
  const [items, setItems] = useState<ContractItem[]>([])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validation
    if (!formData.customer_id) {
      toast.error("Fout", {
        description: "Selecteer een klant",
      })
      return
    }
    
    if (items.length === 0) {
      toast.error("Fout", {
        description: "Voeg minimaal één product toe",
      })
      return
    }
    
    if (items.some((item) => !item.product_id)) {
      toast.error("Fout", {
        description: "Alle producten moeten geselecteerd zijn",
      })
      return
    }
    
    setLoading(true)
    
    try {
      // Calculate total monthly amount from items
      const totalMonthly = items.reduce(
        (sum, item) => sum + item.monthly_price * item.quantity,
        0
      )
      
      // Calculate earliest end date based on type
      let earliestEndDate = formData.earliest_end_date
      if (!earliestEndDate && formData.start_date) {
        const startDate = new Date(formData.start_date)
        if (formData.type === "jaar") {
          // 1 year contract
          startDate.setFullYear(startDate.getFullYear() + 1)
        } else {
          // Flex: 3 months minimum
          startDate.setMonth(startDate.getMonth() + 3)
        }
        earliestEndDate = startDate.toISOString().split("T")[0]
      }
      
      const response = await fetch("/admin/rental-contracts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          ...formData,
          monthly_amount: totalMonthly,
          earliest_end_date: earliestEndDate,
          items: items.map((item) => ({
            product_id: item.product_id,
            quantity: item.quantity,
            serial_number: item.serial_number || null,
          })),
        }),
      })
      
      if (!response.ok) {
        throw new Error("Failed to create contract")
      }
      
      toast.success("Contract aangemaakt", {
        description: `Contract ${formData.contract_number} is succesvol aangemaakt`,
      })
      
      // Redirect to contracts list
      setTimeout(() => {
        window.location.href = "/app/rentals"
      }, 1000)
    } catch (error) {
      console.error("Error creating contract:", error)
      toast.error("Fout", {
        description: "Er is een fout opgetreden bij het aanmaken van het contract",
      })
    } finally {
      setLoading(false)
    }
  }
  
  const updateFormData = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("nl-NL", {
      style: "currency",
      currency: "EUR",
    }).format(amount)
  }
  
  // Calculate total monthly from items
  const totalMonthly = items.reduce(
    (sum, item) => sum + item.monthly_price * item.quantity,
    0
  )

  return (
    <Container>
      <div className="px-6 py-4">
        <div className="flex items-center justify-between mb-6">
          <Heading level="h1">Nieuw Verhuurcontract</Heading>
          <Button
            variant="secondary"
            onClick={() => {
              window.location.href = "/app/rentals"
            }}
          >
            Annuleren
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Contract Information */}
          <div className="bg-white rounded-lg border p-6 space-y-4">
            <Heading level="h2">Contract Informatie</Heading>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="contract_number">Contractnummer</Label>
                <Input
                  id="contract_number"
                  value={formData.contract_number}
                  onChange={(e) => updateFormData("contract_number", e.target.value)}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="type">Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => updateFormData("type", value)}
                >
                  <Select.Trigger>
                    <Select.Value />
                  </Select.Trigger>
                  <Select.Content>
                    <Select.Item value="flex">FLEX (3 maanden opzegtermijn)</Select.Item>
                    <Select.Item value="jaar">JAAR (1 jaar vast)</Select.Item>
                    <Select.Item value="offerte">OFFERTE</Select.Item>
                  </Select.Content>
                </Select>
              </div>
            </div>
            
            <div>
              <Label htmlFor="customer_id">Klant</Label>
              <CustomerSelector
                value={formData.customer_id}
                onChange={(value) => updateFormData("customer_id", value)}
              />
            </div>
          </div>

          {/* Dates */}
          <div className="bg-white rounded-lg border p-6 space-y-4">
            <Heading level="h2">Data</Heading>
            
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="start_date">Startdatum</Label>
                <Input
                  id="start_date"
                  type="date"
                  value={formData.start_date}
                  onChange={(e) => updateFormData("start_date", e.target.value)}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="earliest_end_date">
                  Vroegst Mogelijke Einddatum
                  <span className="text-xs text-gray-500 ml-2">
                    (Automatisch berekend indien leeg)
                  </span>
                </Label>
                <Input
                  id="earliest_end_date"
                  type="date"
                  value={formData.earliest_end_date}
                  onChange={(e) => updateFormData("earliest_end_date", e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="end_date">
                  Einddatum
                  <span className="text-xs text-gray-500 ml-2">(Optioneel)</span>
                </Label>
                <Input
                  id="end_date"
                  type="date"
                  value={formData.end_date}
                  onChange={(e) => updateFormData("end_date", e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Products */}
          <div className="bg-white rounded-lg border p-6 space-y-4">
            <Heading level="h2">Producten</Heading>
            <ContractProductSelector
              contractType={formData.type}
              items={items}
              onChange={setItems}
            />
          </div>

          {/* Financial */}
          <div className="bg-white rounded-lg border p-6 space-y-4">
            <Heading level="h2">Financieel</Heading>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Maandbedrag (Automatisch berekend)</Label>
                <div className="text-2xl font-bold text-green-600">
                  {formatCurrency(totalMonthly)}
                </div>
              </div>
              
              <div>
                <Label htmlFor="deposit_amount">Borgbedrag</Label>
                <Input
                  id="deposit_amount"
                  type="number"
                  step="0.01"
                  value={formData.deposit_amount}
                  onChange={(e) =>
                    updateFormData("deposit_amount", parseFloat(e.target.value) || 0)
                  }
                  required
                />
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="deposit_paid"
                checked={formData.deposit_paid}
                onChange={(e) => updateFormData("deposit_paid", e.target.checked)}
                className="rounded"
              />
              <Label htmlFor="deposit_paid" className="cursor-pointer">
                Borg is betaald
              </Label>
            </div>
          </div>

          {/* Notes */}
          <div className="bg-white rounded-lg border p-6 space-y-4">
            <Heading level="h2">Opmerkingen</Heading>
            <Textarea
              value={formData.notes}
              onChange={(e) => updateFormData("notes", e.target.value)}
              placeholder="Optionele opmerkingen..."
              rows={4}
            />
          </div>

          {/* Submit */}
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                window.location.href = "/app/rentals"
              }}
            >
              Annuleren
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Bezig met opslaan..." : "Contract Aanmaken"}
            </Button>
          </div>
        </form>
      </div>
    </Container>
  )
}

export const config = defineRouteConfig({
  label: "Nieuw Contract",
})

export default NewContractPage
