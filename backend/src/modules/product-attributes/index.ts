import ProductAttributesService from "./service"
import { Module } from "@medusajs/framework/utils"

export const PRODUCT_ATTRIBUTES_MODULE = "productAttributes"

export default Module(PRODUCT_ATTRIBUTES_MODULE, {
  service: ProductAttributesService,
})
