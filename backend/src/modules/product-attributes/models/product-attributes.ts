import { model } from "@medusajs/framework/utils"

/**
 * Product Attributes Model
 * 
 * Stores filterable laptop specifications for Ecomputer products.
 * These attributes enable advanced filtering and search functionality.
 */
const ProductAttributes = model.define("product_attributes", {
  id: model.id().primaryKey(),
  product_id: model.text().index(),
  
  // Processor Information
  processor_type: model.text().nullable(),
  processor_family: model.enum([
    "intel-core-i5",
    "intel-core-i7",
    "intel-core-i9",
    "intel-core-ultra-7",
    "ryzen-5",
    "other"
  ]).nullable(),
  
  // Memory & Storage
  ram_size: model.number().nullable(), // in GB (8, 16, 32, 64)
  storage_capacity: model.number().nullable(), // in GB (256, 512, 1000)
  storage_type: model.enum([
    "SSD",
    "NVMe",
    "M.2 NVMe"
  ]).nullable(),
  
  // Display Specifications
  screen_size: model.number().nullable(), // in inches (13.3, 14, 15.6, etc.)
  screen_resolution: model.text().nullable(), // e.g., "1920x1080", "2560x1440"
  
  // Graphics
  graphics_type: model.enum([
    "Geïntegreerd",
    "Dedicated"
  ]).nullable(),
  graphics_card: model.text().nullable(), // e.g., "Intel Iris Xe Graphics", "NVIDIA T1200"
  
  // General Product Info
  condition: model.enum([
    "Nieuw",
    "Renewed"
  ]).nullable(),
  operating_system: model.text().nullable(), // e.g., "Windows 11 Pro"
})

export default ProductAttributes
