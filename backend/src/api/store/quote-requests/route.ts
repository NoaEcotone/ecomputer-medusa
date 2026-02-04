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
    message,
    requested_items
  } = body
  
  // Map storefront fields to model fields
  // Model expects: company_name, contact_person, email, phone, desired_period_start/end
  // Storefront sends: customer_name, customer_email, customer_phone, company_name (optional)
  
  // For storefront quotes, we use placeholder dates (to be discussed with customer)
  const now = new Date()
  const futureDate = new Date()
  futureDate.setMonth(futureDate.getMonth() + 1) // Default 1 month from now
  
  // Create quote request
  const quoteRequest = await rentalModuleService.createQuoteRequests({
    company_name: company_name || "Particulier", // Use "Particulier" if no company
    contact_person: customer_name,
    email: customer_email,
    phone: customer_phone,
    desired_period_start: now,
    desired_period_end: futureDate,
    requested_items: JSON.stringify(requested_items),
    notes: message || null,
    status: "nieuw"
  })
  
  res.json({ quote_request: quoteRequest })
}
