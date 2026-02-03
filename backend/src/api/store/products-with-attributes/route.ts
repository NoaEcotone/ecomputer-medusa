import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";

/**
 * Custom Store API Endpoint: Products with Attributes
 * 
 * Returns all published products with their associated attributes
 * for the Ecomputer storefront.
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

    // Fetch products with their variants and prices
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

    // Fetch all product attributes
    const { data: allAttributes } = await query.graph({
      entity: "product_attributes",
      fields: [
        "id",
        "product_id",
        "processor_type",
        "processor_family",
        "ram_size",
        "storage_capacity",
        "storage_type",
        "screen_size",
        "screen_resolution",
        "graphics_type",
        "graphics_card",
        "condition",
        "operating_system",
      ],
    });

    // Create a map of product_id -> attributes for quick lookup
    const attributesMap = new Map();
    allAttributes.forEach((attr: any) => {
      attributesMap.set(attr.product_id, attr);
    });

    // Combine products with their attributes
    const productsWithAttributes = products.map((product: any) => {
      const attributes = attributesMap.get(product.id);
      
      return {
        ...product,
        attributes: attributes || null,
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
