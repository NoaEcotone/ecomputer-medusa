import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductFilters, { FilterState } from '@/components/ProductFilters';
import ProductGrid from '@/components/ProductGrid';
import {
  getProductsWithAttributes,
  getFilterOptions,
  ProductWithAttributes,
} from '@/lib/medusa';
import { Loader2 } from 'lucide-react';

export default function Laptops() {
  const [allProducts, setAllProducts] = useState<ProductWithAttributes[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<ProductWithAttributes[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<FilterState>({
    processorTypes: [],
    ramSizes: [],
    storageCapacities: [],
    storageTypes: [],
    screenSizes: [],
    screenResolutions: [],
    graphicsTypes: [],
  });

  // Fetch products on mount
  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      const products = await getProductsWithAttributes();
      setAllProducts(products);
      setFilteredProducts(products);
      setLoading(false);
    }
    fetchProducts();
  }, []);

  // Apply filters whenever filters change
  useEffect(() => {
    if (allProducts.length === 0) return;

    const filtered = allProducts.filter((product) => {
      const attrs = product.attributes;
      if (!attrs) return false;

      // Processor Type
      if (
        filters.processorTypes.length > 0 &&
        (!attrs.processor_type || !filters.processorTypes.includes(attrs.processor_type))
      ) {
        return false;
      }

      // RAM Size
      if (
        filters.ramSizes.length > 0 &&
        (!attrs.ram_size || !filters.ramSizes.includes(attrs.ram_size))
      ) {
        return false;
      }

      // Storage Capacity
      if (
        filters.storageCapacities.length > 0 &&
        (!attrs.storage_capacity || !filters.storageCapacities.includes(attrs.storage_capacity))
      ) {
        return false;
      }

      // Storage Type
      if (
        filters.storageTypes.length > 0 &&
        (!attrs.storage_type || !filters.storageTypes.includes(attrs.storage_type))
      ) {
        return false;
      }

      // Screen Size
      if (
        filters.screenSizes.length > 0 &&
        (!attrs.screen_size || !filters.screenSizes.includes(attrs.screen_size))
      ) {
        return false;
      }

      // Screen Resolution
      if (
        filters.screenResolutions.length > 0 &&
        (!attrs.screen_resolution || !filters.screenResolutions.includes(attrs.screen_resolution))
      ) {
        return false;
      }

      // Graphics Type
      if (
        filters.graphicsTypes.length > 0 &&
        (!attrs.graphics_type || !filters.graphicsTypes.includes(attrs.graphics_type))
      ) {
        return false;
      }

      return true;
    });

    setFilteredProducts(filtered);
  }, [filters, allProducts]);

  const filterOptions = getFilterOptions(allProducts);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Producten laden...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 bg-gray-50">
        {/* Page Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="container py-8">
            <h1 className="text-3xl font-bold mb-2">Laptops</h1>
            <p className="text-gray-600">
              {allProducts.length} {allProducts.length === 1 ? 'product' : 'producten'} beschikbaar
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="container py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar */}
            <aside className="lg:w-64 flex-shrink-0">
              <div className="sticky top-20">
                <ProductFilters
                  options={filterOptions}
                  filters={filters}
                  onFilterChange={setFilters}
                />
              </div>
            </aside>

            {/* Products Grid */}
            <div className="flex-1">
              {/* Results Count */}
              <div className="mb-6">
                <p className="text-sm text-gray-600">
                  {filteredProducts.length} {filteredProducts.length === 1 ? 'resultaat' : 'resultaten'}
                </p>
              </div>

              {/* Product Grid */}
              <ProductGrid products={filteredProducts} />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
