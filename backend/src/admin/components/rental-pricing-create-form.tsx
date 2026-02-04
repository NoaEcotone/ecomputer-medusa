import { z } from "zod"
import { useForm, FormProvider, Controller } from "react-hook-form"
import { FocusModal, Heading, Label, Input, Button, Select, Switch, toast } from "@medusajs/ui"
import { useState } from "react"
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

export const RentalPricingCreateForm = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<FormData>({
    defaultValues: {
      product_id: "",
      flex_monthly_price: null,
      year_monthly_price: null,
      deposit_amount: 0,
      flex_available: true,
      year_available: true,
    },
  })

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

      // Send request to API
      const response = await fetch("/admin/rental-pricing", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        throw new Error("Failed to create rental pricing")
      }

      // Success
      toast.success("Verhuurprijs succesvol aangemaakt", {
        description: `Product ${data.product_id} is toegevoegd`,
      })

      // Reset form and close modal
      form.reset()
      setIsOpen(false)

      // Refresh page to show new data
      window.location.reload()
    } catch (error) {
      console.error("Error creating rental pricing:", error)
      toast.error("Fout bij aanmaken", {
        description: "Er is een fout opgetreden bij het aanmaken van de verhuurprijs",
      })
    } finally {
      setIsSubmitting(false)
    }
  })

  return (
    <FocusModal open={isOpen} onOpenChange={setIsOpen}>
      <FocusModal.Trigger asChild>
        <Button size="small">Nieuwe Verhuurprijs</Button>
      </FocusModal.Trigger>
      <FocusModal.Content>
        <FormProvider {...form}>
          <form 
            onSubmit={handleSubmit} 
            className="flex h-full flex-col overflow-hidden"
          >
            <FocusModal.Header>
              <div className="flex items-center justify-end gap-x-2">
                <FocusModal.Close asChild>
                  <Button 
                    size="small" 
                    variant="secondary"
                    type="button"
                    disabled={isSubmitting}
                  >
                    Annuleren
                  </Button>
                </FocusModal.Close>
                <Button 
                  type="submit" 
                  size="small"
                  disabled={isSubmitting}
                  isLoading={isSubmitting}
                >
                  Opslaan
                </Button>
              </div>
            </FocusModal.Header>
            <FocusModal.Body>
              <div className="flex flex-1 flex-col items-center overflow-y-auto">
                <div className="mx-auto flex w-full max-w-[720px] flex-col gap-y-8 px-2 py-16">
                  <div>
                    <Heading className="capitalize">
                      Nieuwe Verhuurprijs Toevoegen
                    </Heading>
                    <p className="text-ui-fg-subtle text-sm mt-2">
                      Stel de verhuurprijzen in voor een product. Je kunt Flex (maandelijks opzegbaar) en/of Jaar (12 maanden vast) prijzen instellen.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-6">
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
                </div>
              </div>
            </FocusModal.Body>
          </form>
        </FormProvider>
      </FocusModal.Content>
    </FocusModal>
  )
}
