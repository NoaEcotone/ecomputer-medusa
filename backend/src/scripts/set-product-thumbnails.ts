import { ExecArgs } from "@medusajs/framework/types"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"

/**
 * Set the first image from each product's gallery as the thumbnail
 * This ensures all products have thumbnails for cart and product listings
 */
export default async function setProductThumbnails({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const productService = container.resolve(Modules.PRODUCT)

  logger.info("Setting product thumbnails from first gallery image...")

  // Get all products with their images
  let products
  try {
    const result = await productService.listProducts({}, {
      relations: ["images"],
    })
    products = result.data || result
    
    logger.info(`Raw result type: ${typeof result}`)
    logger.info(`Has data property: ${!!result.data}`)
    logger.info(`Products array length: ${products?.length || 0}`)
  } catch (error) {
    logger.error(`Error fetching products: ${error.message}`)
    throw error
  }

  if (!products || products.length === 0) {
    logger.warn("No products found")
    return
  }

  logger.info(`Found ${products.length} products`)

  let updatedCount = 0
  let skippedCount = 0
  let noImagesCount = 0

  for (const product of products) {
    try {
      // Check if product already has a thumbnail
      if (product.thumbnail) {
        logger.info(`  - Product "${product.title}" already has thumbnail. Skipping.`)
        skippedCount++
        continue
      }

      // Check if product has images
      if (!product.images || product.images.length === 0) {
        logger.warn(`  ⚠️  Product "${product.title}" has no images. Cannot set thumbnail.`)
        noImagesCount++
        continue
      }

      // Get first image URL
      const firstImage = product.images[0]
      const thumbnailUrl = firstImage.url

      // Update product with thumbnail
      await productService.updateProducts([{
        id: product.id,
        thumbnail: thumbnailUrl,
      }])

      logger.info(`  ✓ Set thumbnail for "${product.title}" → ${thumbnailUrl}`)
      updatedCount++
    } catch (error) {
      logger.error(`  ✗ Error processing product "${product.title}": ${error.message}`)
    }
  }

  logger.info("\n" + "=".repeat(60))
  logger.info("Thumbnail Update Complete!")
  logger.info(`  ✓ Updated: ${updatedCount} products`)
  logger.info(`  - Skipped: ${skippedCount} (already had thumbnail)`)
  if (noImagesCount > 0) {
    logger.warn(`  ⚠️  No images: ${noImagesCount} products`)
  }
  logger.info("=".repeat(60))
  logger.info("\nProduct thumbnails should now appear in cart and listings!")
}
