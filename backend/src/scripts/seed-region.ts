import { ExecArgs } from "@medusajs/framework/types"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"
import { createRegionsWorkflow } from "@medusajs/medusa/core-flows"

/**
 * Seed script to create a default region for the Netherlands
 * This is required for cart functionality to work
 */
export default async function seedDefaultRegion({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const regionModuleService = container.resolve(Modules.REGION)

  logger.info("Checking if regions exist...")

  // Check if any regions already exist
  const existingRegions = await regionModuleService.listRegions()

  if (existingRegions.length > 0) {
    logger.info(`Found ${existingRegions.length} existing region(s). Skipping seed.`)
    return
  }

  logger.info("No regions found. Creating default region for Netherlands...")

  // Create default region for Netherlands
  const { result: regions } = await createRegionsWorkflow(container).run({
    input: {
      regions: [
        {
          name: "Netherlands",
          currency_code: "eur",
          countries: ["nl"],
          automatic_taxes: true,
          is_tax_inclusive: true,
        },
      ],
    },
  })

  logger.info(`✅ Successfully created region: ${regions[0].name} (${regions[0].currency_code})`)
  logger.info(`Region ID: ${regions[0].id}`)
}
