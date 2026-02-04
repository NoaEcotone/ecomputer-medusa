import type {
  MedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"

export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const rentalModuleService = req.scope.resolve("rental")
  const { id } = req.params
  
  const quoteRequest = await rentalModuleService.retrieveQuoteRequest(id)
  
  res.json({ quote_request: quoteRequest })
}

export const POST = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const rentalModuleService = req.scope.resolve("rental")
  const { id } = req.params
  
  const {
    status,
    notes,
    requested_items
  } = req.body
  
  const quoteRequest = await rentalModuleService.updateQuoteRequests(id, {
    status,
    notes,
    requested_items
  })
  
  res.json({ quote_request: quoteRequest })
}

export const DELETE = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const rentalModuleService = req.scope.resolve("rental")
  const { id } = req.params
  
  await rentalModuleService.deleteQuoteRequests(id)
  
  res.json({ 
    id,
    deleted: true
  })
}
