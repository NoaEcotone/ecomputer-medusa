import { ExecArgs } from "@medusajs/framework/types"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"

/**
 * Link default sales channel to default stock location
 * This is required for cart/order functionality to work
 */
export default async function linkSalesChannelToStockLocation({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const link = container.resolve(ContainerRegistrationKeys.LINK)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)

  logger.info("Linking sales channel to stock location...")

  // Get default sales channel
  const { data: salesChannels } = await query.graph({
    entity: "sales_channel",
    fields: ["id", "name"],
  })

  if (!salesChannels || salesChannels.length === 0) {
    logger.error("No sales channels found. Please create a sales channel first.")
    return
  }

  const defaultSalesChannel = salesChannels[0]
  logger.info(`Found sales channel: ${defaultSalesChannel.name} (${defaultSalesChannel.id})`)

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
  logger.info(`Found stock location: ${defaultStockLocation.name} (${defaultStockLocation.id})`)

  // Check if link already exists
  const { data: existingLinks } = await query.graph({
    entity: "sales_channel",
    fields: ["id", "stock_locations.*"],
    filters: {
      id: defaultSalesChannel.id,
    },
  })

  if (existingLinks?.[0]?.stock_locations?.length > 0) {
    logger.info("✅ Sales channel is already linked to stock location(s). Skipping.")
    return
  }

  // Create link between sales channel and stock location
  await link.create({
    [Modules.SALES_CHANNEL]: {
      sales_channel_id: defaultSalesChannel.id,
    },
    [Modules.STOCK_LOCATION]: {
      stock_location_id: defaultStockLocation.id,
    },
  })

  logger.info(`✅ Successfully linked sales channel "${defaultSalesChannel.name}" to stock location "${defaultStockLocation.name}"`)
  logger.info("Cart functionality should now work!")
}
