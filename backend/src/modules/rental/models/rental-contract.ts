import { model } from "@medusajs/framework/utils"

/**
 * Rental Contract Model
 * 
 * Stores rental contract information for customers.
 * Tracks contract status, dates, and payment information.
 */
const RentalContract = model.define("rental_contract", {
  id: model.id().primaryKey(),
  
  // Contract Information
  contract_number: model.text().unique().index(),
  customer_id: model.text().index(),
  
  // Contract Type & Status
  type: model.enum([
    "flex",
    "jaar",
    "offerte"
  ]),
  status: model.enum([
    "in_afwachting",
    "actief",
    "eindigt_binnenkort",
    "beëindigd",
    "geannuleerd"
  ]).default("in_afwachting"),
  
  // Dates
  start_date: model.dateTime(),
  end_date: model.dateTime().nullable(),
  earliest_end_date: model.dateTime(),
  
  // Financial
  monthly_amount: model.bigNumber(),
  deposit_amount: model.bigNumber(),
  deposit_paid: model.boolean().default(false),
  deposit_refunded: model.boolean().default(false),
  
  // Additional Information
  notes: model.text().nullable(),
})

export default RentalContract
