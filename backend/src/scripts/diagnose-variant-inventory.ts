import { ExecArgs } from "@medusajs/framework/types"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"

/**
 * Diagnose inventory setup for a specific variant or all variants
 * This helps identify what's missing in the inventory configuration
 */
export default async function diagnoseVariantInventory({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)
  const inventoryService = container.resolve(Modules.INVENTORY)

  logger.info("Diagnosing variant inventory setup...")

  // Get all product variants with their inventory items
  const { data: variants } = await query.graph({
    entity: "product_variant",
    fields: [
      "id",
      "sku",
      "title",
      "manage_inventory",
      "allow_backorder",
      "product.id",
      "product.title",
      "inventory_items.*",
    ],
  })

  if (!variants || variants.length === 0) {
    logger.warn("No product variants found")
    return
  }

  // Get all stock locations
  const { data: stockLocations } = await query.graph({
    entity: "stock_location",
    fields: ["id", "name"],
  })

  // Get all sales channels
  const { data: salesChannels } = await query.graph({
    entity: "sales_channel",
    fields: ["id", "name"],
  })

  logger.info(`\nFound ${variants.length} variants, ${stockLocations?.length || 0} stock locations, ${salesChannels?.length || 0} sales channels\n`)

  let hasIssues = false

  for (const variant of variants) {
    const issues: string[] = []

    // Check if manage_inventory is enabled
    if (!variant.manage_inventory) {
      issues.push("❌ manage_inventory is disabled")
    }

    // Check if variant has inventory items
    if (!variant.inventory_items || variant.inventory_items.length === 0) {
      issues.push("❌ No inventory items linked")
    } else {
      // Check each inventory item
      for (const invItem of variant.inventory_items) {
        try {
          // Get full inventory item with levels
          const fullInvItem = await inventoryService.retrieveInventoryItem(invItem.id, {
            relations: ["location_levels"],
          })

          if (!fullInvItem.location_levels || fullInvItem.location_levels.length === 0) {
            issues.push(`❌ Inventory item ${invItem.id} has no location levels`)
          } else {
            // Check stock at each location
            for (const level of fullInvItem.location_levels) {
              if (level.stocked_quantity === 0 || level.stocked_quantity === "0") {
                issues.push(`⚠️  Stock is 0 at location ${level.location_id}`)
              }
            }
          }
        } catch (error) {
          issues.push(`❌ Error retrieving inventory item: ${error.message}`)
        }
      }
    }

    // Log results
    if (issues.length > 0) {
      hasIssues = true
      logger.warn(`\n🔴 ISSUES FOUND: ${variant.product.title} - ${variant.title}`)
      logger.warn(`   SKU: ${variant.sku}`)
      logger.warn(`   Variant ID: ${variant.id}`)
      issues.forEach(issue => logger.warn(`   ${issue}`))
    } else {
      logger.info(`✅ ${variant.product.title} - ${variant.title} (SKU: ${variant.sku})`)
    }
  }

  // Check sales channel to stock location links
  logger.info("\n" + "=".repeat(60))
  logger.info("Checking Sales Channel → Stock Location Links...")
  logger.info("=".repeat(60))

  for (const channel of salesChannels || []) {
    const { data: linkedLocations } = await query.graph({
      entity: "sales_channel",
      fields: ["id", "name", "stock_locations.*"],
      filters: { id: channel.id },
    })

    if (!linkedLocations?.[0]?.stock_locations || linkedLocations[0].stock_locations.length === 0) {
      logger.warn(`⚠️  Sales channel "${channel.name}" is NOT linked to any stock location`)
      hasIssues = true
    } else {
      logger.info(`✅ Sales channel "${channel.name}" → ${linkedLocations[0].stock_locations.map((l: any) => l.name).join(", ")}`)
    }
  }

  logger.info("\n" + "=".repeat(60))
  if (hasIssues) {
    logger.warn("❌ Issues found! See details above.")
    logger.info("\nTo fix:")
    logger.info("1. Run: npx medusa exec ./src/scripts/add-stock-to-inventory.ts")
    logger.info("2. Ensure all variants have manage_inventory enabled")
    logger.info("3. Ensure sales channels are linked to stock locations")
  } else {
    logger.info("✅ All variants are properly configured!")
    logger.info("Cart functionality should work.")
  }
  logger.info("=".repeat(60))
}
