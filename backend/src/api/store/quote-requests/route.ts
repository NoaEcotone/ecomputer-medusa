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
    product_id: string
    rental_type: string
    quantity: number
    desired_period_start: string
    desired_period_end: string
    message?: string
  }
  
  const {
    customer_name,
    customer_email,
    customer_phone,
    company_name,
    product_id,
    rental_type,
    quantity,
    desired_period_start,
    desired_period_end,
    message
  } = body
  
  // Validate required fields
  if (!customer_name || !customer_email || !customer_phone || !product_id || !rental_type || !desired_period_start || !desired_period_end) {
    return res.status(400).json({ 
      error: "Missing required fields",
      required: ["customer_name", "customer_email", "customer_phone", "product_id", "rental_type", "desired_period_start", "desired_period_end"]
    })
  }
  
  // Create requested_items array with single item
  const requested_items = [{
    product_id,
    rental_type,
    quantity: quantity || 1
  }]
  
  // Create quote request
  const quoteRequest = await rentalModuleService.createQuoteRequests({
    company_name: company_name || "Particulier",
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
