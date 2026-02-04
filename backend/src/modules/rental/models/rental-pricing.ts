import { model } from "@medusajs/framework/utils"

/**
 * Rental Pricing Model
 * 
 * Stores rental pricing information for products.
 * Each product can have different pricing for Flex and Jaar rental types.
 */
const RentalPricing = model.define("rental_pricing", {
  id: model.id().primaryKey(),
  product_id: model.text().index(),
  
  // Pricing
  flex_monthly_price: model.bigNumber().nullable(),
  year_monthly_price: model.bigNumber().nullable(),
  deposit_amount: model.bigNumber().nullable(),
  
  // Availability
  flex_available: model.boolean().default(false),
  year_available: model.boolean().default(false),
})

export default RentalPricing
