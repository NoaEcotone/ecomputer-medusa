import type {
  MedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"

export const POST = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const rentalModuleService = req.scope.resolve("rental")
  
  const body = req.body as {
    customer_name: string
    customer_email: string
    customer_phone: string
    company_name?: string
    desired_period_start: string
    desired_period_end: string
    message?: string
    requested_items: Array<{
      product_id: string
      product_title: string
      rental_type: string
      quantity: number
    }>
  }
  
  const {
    customer_name,
    customer_email,
    customer_phone,
    company_name,
    desired_period_start,
    desired_period_end,
    message,
    requested_items
  } = body
  
  // Create quote request
  const quoteRequest = await rentalModuleService.createQuoteRequests({
    company_name: company_name || "Particulier", // Use "Particulier" if no company
    contact_person: customer_name,
    email: customer_email,
    phone: customer_phone,
    desired_period_start: new Date(desired_period_start),
    desired_period_end: new Date(desired_period_end),
    requested_items: JSON.stringify(requested_items),
    notes: message || null,
    status: "nieuw"
  })
  
  res.json({ quote_request: quoteRequest })
}
