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
  
  const body = req.body as {
    status?: "nieuw" | "in_behandeling" | "offerte_verstuurd" | "geaccepteerd" | "afgewezen"
    notes?: string
    requested_items?: Record<string, any>
  }
  
  const {
    status,
    notes,
    requested_items
  } = body
  
  // Only include defined values to avoid MikroORM errors
  const updateData: any = { id }
  if (status !== undefined) updateData.status = status
  if (notes !== undefined) updateData.notes = notes
  if (requested_items !== undefined) updateData.requested_items = requested_items
  
  const quoteRequest = await rentalModuleService.updateQuoteRequests(updateData)
  
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
