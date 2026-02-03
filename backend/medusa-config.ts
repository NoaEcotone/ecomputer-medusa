import { loadEnv, defineConfig } from '@medusajs/framework/utils'

loadEnv(process.env.NODE_ENV || 'development', process.cwd())

module.exports = defineConfig({
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    http: {
      storeCors: "http://localhost:3000",
      adminCors: process.env.ADMIN_CORS!,
      authCors: process.env.AUTH_CORS!,
      jwtSecret: process.env.JWT_SECRET || "supersecret",
      cookieSecret: process.env.COOKIE_SECRET || "supersecret",
    }
  },
  modules: [
    // Core Commerce Modules
    {
      resolve: "@medusajs/medusa/api-key",
    },
    {
      resolve: "@medusajs/medusa/auth",
      options: {
        providers: [
          {
            resolve: "@medusajs/medusa/auth-emailpass",
            id: "emailpass",
          },
        ],
      },
    },
    {
      resolve: "@medusajs/medusa/cart",
    },
    {
      resolve: "@medusajs/medusa/currency",
    },
    {
      resolve: "@medusajs/medusa/customer",
    },
    {
      resolve: "@medusajs/medusa/fulfillment",
    },
    {
      resolve: "@medusajs/medusa/inventory",
    },
    {
      resolve: "@medusajs/medusa/order",
    },
    {
      resolve: "@medusajs/medusa/payment",
    },
    {
      resolve: "@medusajs/medusa/pricing",
    },
    {
      resolve: "@medusajs/medusa/product",
    },
    {
      resolve: "@medusajs/medusa/promotion",
    },
    {
      resolve: "@medusajs/medusa/region",
    },
    {
      resolve: "@medusajs/medusa/sales-channel",
    },
    {
      resolve: "@medusajs/medusa/stock-location",
    },
    {
      resolve: "@medusajs/medusa/store",
    },
    {
      resolve: "@medusajs/medusa/tax",
    },
    {
      resolve: "@medusajs/medusa/user",
      options: {
        jwt_secret: process.env.JWT_SECRET || "supersecret",
      },
    },
    // Custom Modules
    {
      resolve: "./src/modules/product-attributes",
    },
  ],
})