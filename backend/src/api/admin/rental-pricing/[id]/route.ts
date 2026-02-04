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
  
  const pricing = await rentalModuleService.retrieveRentalPricing(id)
  
  res.json({ rental_pricing: pricing })
}

export const POST = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const rentalModuleService = req.scope.resolve("rental")
  const { id } = req.params
  
  const body = req.body as {
    flex_monthly_price?: number | null
    year_monthly_price?: number | null
    deposit_amount?: number | null
    flex_available?: boolean
    year_available?: boolean
  }
  
  const {
    flex_monthly_price,
    year_monthly_price,
    deposit_amount,
    flex_available,
    year_available
  } = body
  
  const pricing = await rentalModuleService.updateRentalPricings({
    id,
    flex_monthly_price,
    year_monthly_price,
    deposit_amount,
    flex_available,
    year_available
  })
  
  res.json({ rental_pricing: pricing })
}

export const DELETE = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const rentalModuleService = req.scope.resolve("rental")
  const { id } = req.params
  
  await rentalModuleService.deleteRentalPricings(id)
  
  res.json({ 
    id,
    deleted: true
  })
}
