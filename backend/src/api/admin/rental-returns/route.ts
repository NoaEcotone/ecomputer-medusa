import type {
  MedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"

export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const rentalModuleService = req.scope.resolve("rental")
  
  const { contract_id } = req.query
  
  let returns
  if (contract_id) {
    returns = await rentalModuleService.listRentalReturns({
      contract_id: contract_id as string
    })
  } else {
    returns = await rentalModuleService.listRentalReturns()
  }
  
  res.json({ rental_returns: returns })
}

export const POST = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const rentalModuleService = req.scope.resolve("rental")
  
  const body = req.body as {
    contract_id: string
    return_date: string | Date
    condition: string
    damage_description?: string
    deposit_withheld?: number
    withhold_reason?: string
  }
  
  const {
    contract_id,
    return_date,
    condition,
    damage_description,
    deposit_withheld,
    withhold_reason
  } = body
  
  const rentalReturn = await rentalModuleService.createRentalReturns({
    contract_id,
    return_date: typeof return_date === 'string' ? new Date(return_date) : return_date,
    condition,
    damage_description,
    deposit_withheld: deposit_withheld || 0,
    withhold_reason
  })
  
  res.json({ rental_return: rentalReturn })
}
