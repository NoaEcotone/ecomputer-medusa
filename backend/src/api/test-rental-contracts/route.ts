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
    const contracts = await rentalModuleService.listRentalContracts()
    
    res.json({ 
      success: true,
      rental_contracts: contracts 
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
      contract_number,
      customer_id,
      type,
      status,
      start_date,
      end_date,
      earliest_end_date,
      monthly_amount,
      deposit_amount,
      deposit_paid,
      deposit_refunded,
      notes
    } = req.body
    
    const contract = await rentalModuleService.createRentalContracts({
      contract_number,
      customer_id,
      type,
      status: status || "in_afwachting",
      start_date,
      end_date,
      earliest_end_date,
      monthly_amount,
      deposit_amount,
      deposit_paid: deposit_paid ?? false,
      deposit_refunded: deposit_refunded ?? false,
      notes
    })
    
    res.json({ 
      success: true,
      rental_contract: contract 
    })
  } catch (error: any) {
    res.status(500).json({ 
      success: false,
      error: error.message 
    })
  }
}
