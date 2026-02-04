import { model } from "@medusajs/framework/utils"

/**
 * Quote Request Model
 * 
 * Stores quote requests for short-term rentals (1 day to 4 weeks).
 * These are handled manually by admin and not available in the webshop.
 */
const QuoteRequest = model.define("quote_request", {
  id: model.id().primaryKey(),
  
  // Company Information
  company_name: model.text(),
  contact_person: model.text(),
  email: model.text(),
  phone: model.text().nullable(),
  
  // Rental Period
  desired_period_start: model.dateTime(),
  desired_period_end: model.dateTime(),
  
  // Request Details
  requested_items: model.json(), // Store as JSON array of requested products
  
  // Status
  status: model.enum([
    "nieuw",
    "in_behandeling",
    "offerte_verstuurd",
    "geaccepteerd",
    "afgewezen"
  ]).default("nieuw"),
  
  // Additional Information
  notes: model.text().nullable(),
})

export default QuoteRequest
