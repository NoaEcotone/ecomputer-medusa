// Medusa API Client for Ecomputer Storefront

const MEDUSA_BACKEND_URL = import.meta.env.VITE_MEDUSA_BACKEND_URL || 'http://localhost:9000';
const MEDUSA_PUBLISHABLE_KEY = import.meta.env.VITE_MEDUSA_PUBLISHABLE_KEY || '';


export interface Product {
  id: string;
  title: string;
  description: string | null;
  handle: string;
  thumbnail: string | null;
  variants: ProductVariant[];
  metadata: Record<string, any> | null;
}

export interface ProductVariant {
  id: string;
  title: string;
  sku: string | null;
  prices: Price[];
  options: VariantOption[];
}

export interface Price {
  amount: number;
  currency_code: string;
}

export interface VariantOption {
  value: string;
  option: {
    title: string;
  };
}

export interface ProductAttributes {
  processor_type?: string;
  processor_family?: string;
  ram_size?: number;
  storage_capacity?: number;
  storage_type?: string;
  screen_size?: number;
  screen_resolution?: string;
  graphics_type?: string;
  graphics_card?: string;
  condition?: string;
  operating_system?: string;
}

export interface ProductWithAttributes extends Product {
  attributes?: ProductAttributes;
}

/**
 * Fetch all products from Medusa
 */
export async function getProducts(): Promise<Product[]> {
  try {
    const response = await fetch(`${MEDUSA_BACKEND_URL}/store/products`, {
    headers: {
      'Content-Type': 'application/json',
      'x-publishable-api-key': MEDUSA_PUBLISHABLE_KEY,
    },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch products: ${response.statusText}`);
    }

    const data = await response.json();
    return data.products || [];
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

/**
 * Fetch all products with their attributes from the custom endpoint
 */
export async function getProductsWithAttributes(): Promise<ProductWithAttributes[]> {
  try {
    const response = await fetch(`${MEDUSA_BACKEND_URL}/store/products-with-attributes`, {
      headers: {
        'Content-Type': 'application/json',
        'x-publishable-api-key': MEDUSA_PUBLISHABLE_KEY,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch products with attributes: ${response.statusText}`);
    }

    const data = await response.json();
    return data.products || [];
  } catch (error) {
    console.error('Error fetching products with attributes:', error);
    return [];
  }
}

/**
 * Get unique filter values from products
 */
export function getFilterOptions(products: ProductWithAttributes[]) {
  const processorTypes = new Set<string>();
  const ramSizes = new Set<number>();
  const storageCapacities = new Set<number>();
  const storageTypes = new Set<string>();
  const screenSizes = new Set<number>();
  const screenResolutions = new Set<string>();
  const graphicsTypes = new Set<string>();
  const conditions = new Set<string>();

  products.forEach(product => {
    const attrs = product.attributes;
    if (!attrs) return;

    if (attrs.processor_type) processorTypes.add(attrs.processor_type);
    if (attrs.ram_size) ramSizes.add(attrs.ram_size);
    if (attrs.storage_capacity) storageCapacities.add(attrs.storage_capacity);
    if (attrs.storage_type) storageTypes.add(attrs.storage_type);
    if (attrs.screen_size) screenSizes.add(attrs.screen_size);
    if (attrs.screen_resolution) screenResolutions.add(attrs.screen_resolution);
    if (attrs.graphics_type) graphicsTypes.add(attrs.graphics_type);
    if (attrs.condition) conditions.add(attrs.condition);
  });

  return {
    processorTypes: Array.from(processorTypes).sort(),
    ramSizes: Array.from(ramSizes).sort((a, b) => a - b),
    storageCapacities: Array.from(storageCapacities).sort((a, b) => a - b),
    storageTypes: Array.from(storageTypes).sort(),
    screenSizes: Array.from(screenSizes).sort((a, b) => a - b),
    screenResolutions: Array.from(screenResolutions).sort(),
    graphicsTypes: Array.from(graphicsTypes).sort(),
    conditions: Array.from(conditions).sort(),
  };
}

/**
 * Format price for display
 */
export function formatPrice(amount: number, currencyCode: string = 'EUR'): string {
  return new Intl.NumberFormat('nl-NL', {
    style: 'currency',
    currency: currencyCode.toUpperCase(),
  }).format(amount / 100);
}
