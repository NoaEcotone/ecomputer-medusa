import type {
  MedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"

export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const rentalModuleService = req.scope.resolve("rental")
  
  try {
    const pricings = await rentalModuleService.listRentalPricings()
    
    res.json({ 
      success: true,
      rental_pricings: pricings 
    })
  } catch (error: any) {
    res.status(500).json({ 
      success: false,
      error: error.message 
    })
  }
}

export const POST = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const rentalModuleService = req.scope.resolve("rental")
  
  try {
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
    
    res.json({ 
      success: true,
      rental_pricing: pricing 
    })
  } catch (error: any) {
    res.status(500).json({ 
      success: false,
      error: error.message 
    })
  }
}
