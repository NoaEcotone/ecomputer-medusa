import { ExecArgs } from "@medusajs/framework/types"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"

/**
 * Add stock to all inventory items that have 0 stock
 * This ensures all products can be added to cart
 */
export default async function addStockToInventory({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)
  const inventoryService = container.resolve(Modules.INVENTORY)

  logger.info("Adding stock to inventory items...")

  // Get default stock location
  const { data: stockLocations } = await query.graph({
    entity: "stock_location",
    fields: ["id", "name"],
  })

  if (!stockLocations || stockLocations.length === 0) {
    logger.error("No stock locations found. Please create a stock location first.")
    return
  }

  const defaultStockLocation = stockLocations[0]
  logger.info(`Using stock location: ${defaultStockLocation.name} (${defaultStockLocation.id})`)

  // Get all inventory items
  const inventoryItems = await inventoryService.listInventoryItems({}, {
    relations: ["location_levels"],
  })

  if (!inventoryItems || inventoryItems.length === 0) {
    logger.warn("No inventory items found")
    return
  }

  logger.info(`Found ${inventoryItems.length} inventory items`)

  let createdCount = 0
  let updatedCount = 0
  let skippedCount = 0
  let errorCount = 0

  for (const item of inventoryItems) {
    try {
      // Check if inventory item has a level at the stock location
      const existingLevel = item.location_levels?.find(
        (level: any) => level.location_id === defaultStockLocation.id
      )

      if (existingLevel) {
        // Check if stock quantity is 0
        if (existingLevel.stocked_quantity === 0 || existingLevel.stocked_quantity === "0") {
          // Update stock quantity
          await inventoryService.updateInventoryLevels([{
            id: existingLevel.id,
            stocked_quantity: 10,
          }])
          logger.info(`  ✓ Updated stock for inventory item ${item.sku || item.id} (0 → 10)`)
          updatedCount++
        } else {
          logger.info(`  - Inventory item ${item.sku || item.id} already has stock (${existingLevel.stocked_quantity}). Skipping.`)
          skippedCount++
        }
      } else {
        // Create inventory level
        await inventoryService.createInventoryLevels({
          inventory_item_id: item.id,
          location_id: defaultStockLocation.id,
          stocked_quantity: 10,
        })
        logger.info(`  + Created inventory level for ${item.sku || item.id} with stock quantity 10`)
        createdCount++
      }
    } catch (error) {
      logger.error(`  ✗ Error processing inventory item ${item.sku || item.id}: ${error.message}`)
      errorCount++
    }
  }

  logger.info("\n" + "=".repeat(60))
  logger.info("Stock Addition Complete!")
  logger.info(`  + Created: ${createdCount} inventory levels`)
  logger.info(`  ✓ Updated: ${updatedCount} inventory levels (0 → 10)`)
  logger.info(`  - Skipped: ${skippedCount} (already had stock)`)
  if (errorCount > 0) {
    logger.warn(`  ✗ Errors: ${errorCount}`)
  }
  logger.info("=".repeat(60))
  logger.info("\nCart functionality should now work!")
}
