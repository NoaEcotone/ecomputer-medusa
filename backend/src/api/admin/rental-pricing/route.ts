import type {
  MedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"

export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const rentalModuleService = req.scope.resolve("rental")
  
  const { product_id } = req.query
  
  let pricings
  if (product_id) {
    pricings = await rentalModuleService.listRentalPricings({
      product_id: product_id as string
    })
  } else {
    pricings = await rentalModuleService.listRentalPricings()
  }
  
  res.json({ rental_pricings: pricings })
}

export const POST = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const rentalModuleService = req.scope.resolve("rental")
  
  const body = req.body as {
    product_id: string
    flex_monthly_price?: number | null
    year_monthly_price?: number | null
    deposit_amount?: number | null
    flex_available?: boolean
    year_available?: boolean
  }
  
  const {
    product_id,
    flex_monthly_price,
    year_monthly_price,
    deposit_amount,
    flex_available,
    year_available
  } = body
  
  const pricing = await rentalModuleService.createRentalPricings({
    product_id,
    flex_monthly_price,
    year_monthly_price,
    deposit_amount,
    flex_available: flex_available ?? false,
    year_available: year_available ?? false
  })
  
  res.json({ rental_pricing: pricing })
}
