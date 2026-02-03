import { MedusaService } from "@medusajs/framework/utils"
import ProductAttributes from "./models/product-attributes"

/**
 * Product Attributes Service
 * 
 * Provides CRUD operations for product attributes.
 * Generated methods include:
 * - createProductAttributes(data)
 * - updateProductAttributes(id, data)
 * - retrieveProductAttributes(id)
 * - listProductAttributes(filters)
 * - deleteProductAttributes(id)
 */
class ProductAttributesService extends MedusaService({
  ProductAttributes,
}) {}

export default ProductAttributesService
