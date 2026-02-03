import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";

/**
 * Custom Store API Endpoint: Products with Attributes
 * 
 * Returns all published products with their attributes extracted from metadata.
 * This is simpler and more reliable than using a separate attributes table.
 * 
 * GET /store/products-with-attributes
 */
export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
) {
  try {
    // Get the query service to fetch data
    const query = req.scope.resolve(ContainerRegistrationKeys.QUERY);

    // Fetch products with their variants, prices, and metadata
    const { data: products } = await query.graph({
      entity: "product",
      fields: [
        "id",
        "title",
        "description",
        "handle",
        "thumbnail",
        "metadata",
        "status",
        "variants.*",
        "variants.prices.*",
      ],
      filters: {
        status: ["published"],
      },
    });

    // Extract filterable attributes from metadata
    const productsWithAttributes = products.map((product: any) => {
      const metadata = product.metadata || {};
      
      // Extract filterable attributes from metadata
      const attributes = {
        processor_type: metadata.processor_type || null,
        processor_family: metadata.processor_family || null,
        ram_size: metadata.ram_size || null,
        storage_capacity: metadata.storage_capacity || null,
        storage_type: metadata.storage_type || null,
        screen_size: metadata.screen_size || null,
        screen_resolution: metadata.screen_resolution || null,
        graphics_type: metadata.graphics_type || null,
        graphics_card: metadata.graphics_card || null,
        condition: metadata.condition || null,
        operating_system: metadata.operating_system || null,
      };
      
      // Only include attributes if at least one field has a value
      const hasAttributes = Object.values(attributes).some(val => val !== null);
      
      return {
        ...product,
        attributes: hasAttributes ? attributes : null,
      };
    });

    res.json({
      products: productsWithAttributes,
      count: productsWithAttributes.length,
    });

  } catch (error) {
    console.error("Error fetching products with attributes:", error);
    res.status(500).json({
      error: "Failed to fetch products",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
