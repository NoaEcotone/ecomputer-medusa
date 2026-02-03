import { ExecArgs } from "@medusajs/framework/types"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"

/**
 * Setup inventory for all product variants
 * This ensures all variants have inventory items linked to the stock location
 */
export default async function setupInventory({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)
  const remoteLink = container.resolve(ContainerRegistrationKeys.REMOTE_LINK)
  const inventoryService = container.resolve(Modules.INVENTORY)

  logger.info("Setting up inventory for all product variants...")

  // Get all product variants
  const { data: variants } = await query.graph({
    entity: "product_variant",
    fields: ["id", "sku", "title", "manage_inventory", "product.*"],
  })

  if (!variants || variants.length === 0) {
    logger.warn("No product variants found")
    return
  }

  logger.info(`Found ${variants.length} product variants`)

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

  let createdCount = 0
  let skippedCount = 0
  let errorCount = 0

  for (const variant of variants) {
    try {
      // Check if variant already has an inventory item
      const { data: existingLinks } = await query.graph({
        entity: "product_variant",
        fields: ["id", "inventory_items.*"],
        filters: {
          id: variant.id,
        },
      })

      if (existingLinks?.[0]?.inventory_items?.length > 0) {
        logger.info(`  ✓ Variant "${variant.title}" already has inventory item. Skipping.`)
        skippedCount++
        continue
      }

      // Create inventory item
      const inventoryItem = await inventoryService.createInventoryItems({
        sku: variant.sku || `inv-${variant.id}`,
      })

      logger.info(`  + Created inventory item for variant "${variant.title}" (${inventoryItem.id})`)

      // Link inventory item to product variant
      await remoteLink.create({
        [Modules.PRODUCT]: {
          variant_id: variant.id,
        },
        [Modules.INVENTORY]: {
          inventory_item_id: inventoryItem.id,
        },
      })

      logger.info(`  → Linked inventory item to variant "${variant.title}"`)

      // Create inventory level (stock quantity at location)
      await inventoryService.createInventoryLevels({
        inventory_item_id: inventoryItem.id,
        location_id: defaultStockLocation.id,
        stocked_quantity: 10, // Default stock quantity
      })

      logger.info(`  ✓ Added stock quantity (10) for variant "${variant.title}" at location "${defaultStockLocation.name}"`)
      createdCount++
    } catch (error) {
      logger.error(`  ✗ Error processing variant "${variant.title}": ${error.message}`)
      errorCount++
    }
  }

  logger.info("\n" + "=".repeat(60))
  logger.info("Inventory Setup Complete!")
  logger.info(`  ✓ Created: ${createdCount} inventory items`)
  logger.info(`  - Skipped: ${skippedCount} (already had inventory)`)
  if (errorCount > 0) {
    logger.warn(`  ✗ Errors: ${errorCount}`)
  }
  logger.info("=".repeat(60))
  logger.info("\nCart functionality should now work!")
}
