import { Button, Drawer, Input, Label, Select, Textarea, toast } from "@medusajs/ui"
import { useState, useEffect } from "react"

interface ContractEditDrawerProps {
  contract: any
  open: boolean
  onClose: () => void
  onSuccess: () => void
}

export const ContractEditDrawer = ({
  contract,
  open,
  onClose,
  onSuccess,
}: ContractEditDrawerProps) => {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    status: "",
    end_date: "",
    earliest_end_date: "",
    monthly_amount: 0,
    deposit_amount: 0,
    deposit_paid: false,
    deposit_refunded: false,
    notes: "",
  })

  // Update form data when contract changes
  useEffect(() => {
    if (contract) {
      setFormData({
        status: contract.status || "",
        end_date: contract.end_date ? contract.end_date.split("T")[0] : "",
        earliest_end_date: contract.earliest_end_date
          ? contract.earliest_end_date.split("T")[0]
          : "",
        monthly_amount: contract.monthly_amount || 0,
        deposit_amount: contract.deposit_amount || 0,
        deposit_paid: contract.deposit_paid || false,
        deposit_refunded: contract.deposit_refunded || false,
        notes: contract.notes || "",
      })
    }
  }, [contract])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Only send defined values to avoid MikroORM errors
      const updateData: any = {}
      if (formData.status !== contract.status) updateData.status = formData.status
      if (formData.end_date !== (contract.end_date || "").split("T")[0])
        updateData.end_date = formData.end_date || null
      if (
        formData.earliest_end_date !==
        (contract.earliest_end_date || "").split("T")[0]
      )
        updateData.earliest_end_date = formData.earliest_end_date || null
      if (formData.monthly_amount !== contract.monthly_amount)
        updateData.monthly_amount = formData.monthly_amount
      if (formData.deposit_amount !== contract.deposit_amount)
        updateData.deposit_amount = formData.deposit_amount
      if (formData.deposit_paid !== contract.deposit_paid)
        updateData.deposit_paid = formData.deposit_paid
      if (formData.deposit_refunded !== contract.deposit_refunded)
        updateData.deposit_refunded = formData.deposit_refunded
      if (formData.notes !== (contract.notes || ""))
        updateData.notes = formData.notes

      const response = await fetch(`/admin/rental-contracts/${contract.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(updateData),
      })

      if (!response.ok) {
        throw new Error("Failed to update contract")
      }

      toast.success("Contract bijgewerkt", {
        description: "De wijzigingen zijn succesvol opgeslagen",
      })

      onSuccess()
      onClose()
    } catch (error) {
      console.error("Error updating contract:", error)
      toast.error("Fout", {
        description: "Er is een fout opgetreden bij het bijwerken van het contract",
      })
    } finally {
      setLoading(false)
    }
  }

  const updateFormData = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <Drawer open={open} onOpenChange={onClose}>
      <Drawer.Content>
        <Drawer.Header>
          <Drawer.Title>Contract Bewerken</Drawer.Title>
          <Drawer.Description>
            Wijzig contract details, status en financiële informatie
          </Drawer.Description>
        </Drawer.Header>

        <Drawer.Body className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Status */}
            <div>
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => updateFormData("status", value)}
              >
                <Select.Trigger>
                  <Select.Value />
                </Select.Trigger>
                <Select.Content>
                  <Select.Item value="in_afwachting">In Afwachting</Select.Item>
                  <Select.Item value="actief">Actief</Select.Item>
                  <Select.Item value="eindigt_binnenkort">
                    Eindigt Binnenkort
                  </Select.Item>
                  <Select.Item value="beëindigd">Beëindigd</Select.Item>
                  <Select.Item value="geannuleerd">Geannuleerd</Select.Item>
                </Select.Content>
              </Select>
            </div>

            {/* Dates */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="earliest_end_date">
                  Vroegst Mogelijke Einddatum
                </Label>
                <Input
                  id="earliest_end_date"
                  type="date"
                  value={formData.earliest_end_date}
                  onChange={(e) =>
                    updateFormData("earliest_end_date", e.target.value)
                  }
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

            {/* Financial */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="monthly_amount">Maandbedrag (€)</Label>
                <Input
                  id="monthly_amount"
                  type="number"
                  step="0.01"
                  value={formData.monthly_amount}
                  onChange={(e) =>
                    updateFormData("monthly_amount", parseFloat(e.target.value) || 0)
                  }
                />
              </div>

              <div>
                <Label htmlFor="deposit_amount">Borgbedrag (€)</Label>
                <Input
                  id="deposit_amount"
                  type="number"
                  step="0.01"
                  value={formData.deposit_amount}
                  onChange={(e) =>
                    updateFormData("deposit_amount", parseFloat(e.target.value) || 0)
                  }
                />
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="deposit_paid"
                    checked={formData.deposit_paid}
                    onChange={(e) =>
                      updateFormData("deposit_paid", e.target.checked)
                    }
                    className="rounded"
                  />
                  <Label htmlFor="deposit_paid" className="cursor-pointer">
                    Borg Betaald
                  </Label>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="deposit_refunded"
                    checked={formData.deposit_refunded}
                    onChange={(e) =>
                      updateFormData("deposit_refunded", e.target.checked)
                    }
                    className="rounded"
                  />
                  <Label htmlFor="deposit_refunded" className="cursor-pointer">
                    Borg Terugbetaald
                  </Label>
                </div>
              </div>
            </div>

            {/* Notes */}
            <div>
              <Label htmlFor="notes">Opmerkingen</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => updateFormData("notes", e.target.value)}
                rows={4}
                placeholder="Optionele opmerkingen..."
              />
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button type="button" variant="secondary" onClick={onClose}>
                Annuleren
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Bezig met opslaan..." : "Opslaan"}
              </Button>
            </div>
          </form>
        </Drawer.Body>
      </Drawer.Content>
    </Drawer>
  )
}
