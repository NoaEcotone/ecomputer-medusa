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
  
  // Create quote request
  const quoteRequest = await rentalModuleService.createQuoteRequests({
    customer_name,
    customer_email,
    customer_phone,
    company_name: company_name || null,
    message: message || null,
    requested_items: JSON.stringify(requested_items),
    status: "nieuw"
  })
  
  res.json({ quote_request: quoteRequest })
}
