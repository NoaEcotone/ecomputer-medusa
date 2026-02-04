import { z } from "zod"
import { useForm, FormProvider, Controller } from "react-hook-form"
import { Drawer, Heading, Label, Input, Button, Switch, toast } from "@medusajs/ui"
import { useState, useEffect } from "react"
import { ProductSelector } from "./product-selector"

// Validation schema
const schema = z.object({
  product_id: z.string().min(1, "Product ID is verplicht"),
  flex_monthly_price: z.number().min(0, "Flex prijs moet positief zijn").optional().nullable(),
  year_monthly_price: z.number().min(0, "Jaar prijs moet positief zijn").optional().nullable(),
  deposit_amount: z.number().min(0, "Borg moet positief zijn"),
  flex_available: z.boolean(),
  year_available: z.boolean(),
})

type FormData = z.infer<typeof schema>

interface RentalPricingEditDrawerProps {
  pricing: any
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export const RentalPricingEditDrawer = ({ 
  pricing, 
  isOpen, 
  onClose, 
  onSuccess 
}: RentalPricingEditDrawerProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<FormData>({
    defaultValues: {
      product_id: pricing?.product_id || "",
      flex_monthly_price: pricing?.flex_monthly_price || null,
      year_monthly_price: pricing?.year_monthly_price || null,
      deposit_amount: pricing?.deposit_amount || 0,
      flex_available: pricing?.flex_available ?? true,
      year_available: pricing?.year_available ?? true,
    },
  })

  // Update form when pricing changes
  useEffect(() => {
    if (pricing) {
      form.reset({
        product_id: pricing.product_id || "",
        flex_monthly_price: pricing.flex_monthly_price || null,
        year_monthly_price: pricing.year_monthly_price || null,
        deposit_amount: pricing.deposit_amount || 0,
        flex_available: pricing.flex_available ?? true,
        year_available: pricing.year_available ?? true,
      })
    }
  }, [pricing, form])

  const handleSubmit = form.handleSubmit(async (data) => {
    setIsSubmitting(true)
    
    try {
      // Prepare data for API
      const payload = {
        product_id: data.product_id,
        flex_monthly_price: data.flex_monthly_price || null,
        year_monthly_price: data.year_monthly_price || null,
        deposit_amount: data.deposit_amount,
        flex_available: data.flex_available,
        year_available: data.year_available,
      }

      // Send PUT request to API
      const response = await fetch(`/admin/rental-pricing/${pricing.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        throw new Error("Failed to update rental pricing")
      }

      // Success
      toast.success("Verhuurprijs succesvol bijgewerkt", {
        description: `Product ${data.product_id} is bijgewerkt`,
      })

      // Close drawer and refresh
      onClose()
      onSuccess()
    } catch (error) {
      console.error("Error updating rental pricing:", error)
      toast.error("Fout bij bijwerken", {
        description: "Er is een fout opgetreden bij het bijwerken van de verhuurprijs",
      })
    } finally {
      setIsSubmitting(false)
    }
  })

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <Drawer.Content>
        <FormProvider {...form}>
          <form onSubmit={handleSubmit} className="flex h-full flex-col">
            <Drawer.Header>
              <Drawer.Title>Verhuurprijs Bewerken</Drawer.Title>
            </Drawer.Header>
            
            <Drawer.Body className="flex-1 overflow-y-auto">
              <div className="flex flex-col gap-y-6 p-6">
                <div>
                  <p className="text-ui-fg-subtle text-sm">
                    Pas de verhuurprijzen aan voor dit product. Je kunt Flex (maandelijks opzegbaar) en/of Jaar (12 maanden vast) prijzen instellen.
                  </p>
                </div>

                {/* Product Selector */}
                <Controller
                  control={form.control}
                  name="product_id"
                  render={({ field, fieldState }) => (
                    <ProductSelector
                      value={field.value}
                      onChange={field.onChange}
                      error={fieldState.error?.message}
                    />
                  )}
                />

                {/* Flex Monthly Price */}
                <div className="grid grid-cols-2 gap-4">
                  <Controller
                    control={form.control}
                    name="flex_monthly_price"
                    render={({ field, fieldState }) => (
                      <div className="flex flex-col space-y-2">
                        <div className="flex items-center gap-x-1">
                          <Label size="small" weight="plus">
                            Flex Maandprijs (€)
                          </Label>
                        </div>
                        <Input 
                          type="number"
                          step="0.01"
                          placeholder="89.99"
                          value={field.value || ""}
                          onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : null)}
                        />
                        {fieldState.error && (
                          <p className="text-ui-fg-error text-xs">
                            {fieldState.error.message}
                          </p>
                        )}
                      </div>
                    )}
                  />

                  <Controller
                    control={form.control}
                    name="flex_available"
                    render={({ field }) => (
                      <div className="flex flex-col space-y-2">
                        <div className="flex items-center gap-x-1">
                          <Label size="small" weight="plus">
                            Flex Beschikbaar
                          </Label>
                        </div>
                        <div className="flex items-center h-10">
                          <Switch 
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </div>
                      </div>
                    )}
                  />
                </div>

                {/* Year Monthly Price */}
                <div className="grid grid-cols-2 gap-4">
                  <Controller
                    control={form.control}
                    name="year_monthly_price"
                    render={({ field, fieldState }) => (
                      <div className="flex flex-col space-y-2">
                        <div className="flex items-center gap-x-1">
                          <Label size="small" weight="plus">
                            Jaar Maandprijs (€)
                          </Label>
                        </div>
                        <Input 
                          type="number"
                          step="0.01"
                          placeholder="69.99"
                          value={field.value || ""}
                          onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : null)}
                        />
                        {fieldState.error && (
                          <p className="text-ui-fg-error text-xs">
                            {fieldState.error.message}
                          </p>
                        )}
                      </div>
                    )}
                  />

                  <Controller
                    control={form.control}
                    name="year_available"
                    render={({ field }) => (
                      <div className="flex flex-col space-y-2">
                        <div className="flex items-center gap-x-1">
                          <Label size="small" weight="plus">
                            Jaar Beschikbaar
                          </Label>
                        </div>
                        <div className="flex items-center h-10">
                          <Switch 
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </div>
                      </div>
                    )}
                  />
                </div>

                {/* Deposit Amount */}
                <Controller
                  control={form.control}
                  name="deposit_amount"
                  render={({ field, fieldState }) => (
                    <div className="flex flex-col space-y-2">
                      <div className="flex items-center gap-x-1">
                        <Label size="small" weight="plus">
                          Borgbedrag (€) *
                        </Label>
                      </div>
                      <Input 
                        type="number"
                        step="0.01"
                        placeholder="500.00"
                        value={field.value}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      />
                      {fieldState.error && (
                        <p className="text-ui-fg-error text-xs">
                          {fieldState.error.message}
                        </p>
                      )}
                      <p className="text-ui-fg-subtle text-xs">
                        Het borgbedrag dat de klant eenmalig betaalt
                      </p>
                    </div>
                  )}
                />
              </div>
            </Drawer.Body>
            
            <Drawer.Footer>
              <div className="flex items-center justify-end gap-x-2">
                <Button 
                  type="button"
                  variant="secondary"
                  onClick={onClose}
                  disabled={isSubmitting}
                >
                  Annuleren
                </Button>
                <Button 
                  type="submit"
                  disabled={isSubmitting}
                  isLoading={isSubmitting}
                >
                  Opslaan
                </Button>
              </div>
            </Drawer.Footer>
          </form>
        </FormProvider>
      </Drawer.Content>
    </Drawer>
  )
}
