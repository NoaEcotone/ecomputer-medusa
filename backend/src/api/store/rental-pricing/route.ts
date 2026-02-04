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
  
  const {
    product_id,
    flex_monthly_price,
    year_monthly_price,
    deposit_amount,
    flex_available,
    year_available
  } = req.body
  
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
