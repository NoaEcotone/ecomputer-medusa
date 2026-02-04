import { MedusaService } from "@medusajs/framework/utils"
import RentalPricing from "./models/rental-pricing"
import RentalContract from "./models/rental-contract"
import RentalContractItem from "./models/rental-contract-item"
import RentalReturn from "./models/rental-return"
import QuoteRequest from "./models/quote-request"

/**
 * Rental Service
 * 
 * Provides methods to manage rental-related data:
 * - Rental pricing for products
 * - Rental contracts
 * - Contract items
 * - Returns
 * - Quote requests
 */
class RentalModuleService extends MedusaService({
  RentalPricing,
  RentalContract,
  RentalContractItem,
  RentalReturn,
  QuoteRequest,
}) {}

export default RentalModuleService
