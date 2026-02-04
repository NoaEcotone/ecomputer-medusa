import type {
  MedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"

export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const rentalModuleService = req.scope.resolve("rental")
  
  const { status } = req.query
  
  let quoteRequests
  if (status) {
    quoteRequests = await rentalModuleService.listQuoteRequests({
      status: status as string
    })
  } else {
    quoteRequests = await rentalModuleService.listQuoteRequests()
  }
  
  res.json({ quote_requests: quoteRequests })
}

export const POST = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const rentalModuleService = req.scope.resolve("rental")
  
  const body = req.body as {
    company_name: string
    contact_person: string
    email: string
    phone?: string
    desired_period_start: string
    desired_period_end: string
    requested_items?: Record<string, any>
    status?: "nieuw" | "in_behandeling" | "offerte_verstuurd" | "geaccepteerd" | "afgewezen"
    notes?: string
  }
  
  const {
    company_name,
    contact_person,
    email,
    phone,
    desired_period_start,
    desired_period_end,
    requested_items,
    status,
    notes
  } = body
  
  const quoteRequest = await rentalModuleService.createQuoteRequests({
    company_name,
    contact_person,
    email,
    phone,
    desired_period_start,
    desired_period_end,
    requested_items,
    status: status || "nieuw",
    notes
  })
  
  res.json({ quote_request: quoteRequest })
}
