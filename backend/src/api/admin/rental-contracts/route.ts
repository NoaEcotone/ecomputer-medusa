import type {
  MedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"

export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const rentalModuleService = req.scope.resolve("rental")
  
  const { customer_id, status, type } = req.query
  
  const filters: any = {}
  if (customer_id) filters.customer_id = customer_id
  if (status) filters.status = status
  if (type) filters.type = type
  
  const contracts = await rentalModuleService.listRentalContracts(filters)
  
  res.json({ rental_contracts: contracts })
}

export const POST = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const rentalModuleService = req.scope.resolve("rental")
  
  const body = req.body as {
    contract_number: string
    customer_id: string
    type: string
    status?: string
    start_date: string
    end_date?: string
    earliest_end_date?: string
    monthly_amount: number
    deposit_amount: number
    deposit_paid?: boolean
    deposit_refunded?: boolean
    notes?: string
    items?: any[]
  }
  
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
    notes,
    items
  } = body
  
  // Create contract
  // @ts-ignore - MedusaService overload issue
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
  
  // Create contract items if provided
  if (items && items.length > 0) {
    const contractItems = await Promise.all(
      items.map((item: any) =>
        rentalModuleService.createRentalContractItems({
          contract_id: contract.id,
          product_id: item.product_id,
          quantity: item.quantity || 1,
          serial_number: item.serial_number,
          condition_on_delivery: item.condition_on_delivery
        })
      )
    )
    
    return res.json({ 
      rental_contract: contract,
      contract_items: contractItems
    })
  }
  
  res.json({ rental_contract: contract })
}
