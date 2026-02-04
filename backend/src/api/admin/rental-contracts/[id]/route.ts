import type {
  MedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"

export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const rentalModuleService = req.scope.resolve("rental")
  const { id } = req.params
  
  const contract = await rentalModuleService.retrieveRentalContract(id)
  
  // Also get contract items
  const items = await rentalModuleService.listRentalContractItems({
    contract_id: id
  })
  
  res.json({ 
    rental_contract: contract,
    contract_items: items
  })
}

export const POST = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const rentalModuleService = req.scope.resolve("rental")
  const { id } = req.params
  
  const body = req.body as {
    status?: string
    end_date?: string
    earliest_end_date?: string
    monthly_amount?: number
    deposit_amount?: number
    deposit_paid?: boolean
    deposit_refunded?: boolean
    notes?: string
  }
  
  const {
    status,
    end_date,
    earliest_end_date,
    monthly_amount,
    deposit_amount,
    deposit_paid,
    deposit_refunded,
    notes
  } = body
  
  const contract = await rentalModuleService.updateRentalContracts({
    id,
    status,
    end_date,
    earliest_end_date,
    monthly_amount,
    deposit_amount,
    deposit_paid,
    deposit_refunded,
    notes
  })
  
  res.json({ rental_contract: contract })
}

export const DELETE = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const rentalModuleService = req.scope.resolve("rental")
  const { id } = req.params
  
  // Delete associated items first
  const items = await rentalModuleService.listRentalContractItems({
    contract_id: id
  })
  
  if (items.length > 0) {
    await Promise.all(
      items.map((item: any) => 
        rentalModuleService.deleteRentalContractItems(item.id)
      )
    )
  }
  
  // Then delete the contract
  await rentalModuleService.deleteRentalContracts(id)
  
  res.json({ 
    id,
    deleted: true
  })
}
