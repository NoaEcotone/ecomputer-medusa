import { model } from "@medusajs/framework/utils"

/**
 * Rental Contract Item Model
 * 
 * Stores individual items (products) associated with a rental contract.
 * Tracks quantity, serial numbers, and condition information.
 */
const RentalContractItem = model.define("rental_contract_item", {
  id: model.id().primaryKey(),
  
  // Relations
  contract_id: model.text().index(),
  product_id: model.text().index(),
  
  // Item Information
  quantity: model.number().default(1),
  serial_number: model.text().nullable(),
  
  // Condition Tracking
  condition_on_delivery: model.text().nullable(),
  condition_on_return: model.text().nullable(),
})

export default RentalContractItem
