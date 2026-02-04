import { model } from "@medusajs/framework/utils"

/**
 * Rental Return Model
 * 
 * Stores information about returned rental items.
 * Tracks return condition, damage, and deposit withholding.
 */
const RentalReturn = model.define("rental_return", {
  id: model.id().primaryKey(),
  
  // Relations
  contract_id: model.text().index(),
  
  // Return Information
  return_date: model.dateTime(),
  condition: model.text(),
  damage_description: model.text().nullable(),
  
  // Deposit Information
  deposit_withheld: model.bigNumber().default(0),
  withhold_reason: model.text().nullable(),
})

export default RentalReturn
