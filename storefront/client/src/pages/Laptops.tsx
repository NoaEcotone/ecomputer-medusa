import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductFilters, { FilterState } from '@/components/ProductFilters';
import ProductGrid from '@/components/ProductGrid';
import {
  getProductsWithAttributes,
  getFilterOptions,
  ProductWithAttributes,
} from '@/lib/medusa';
import { Loader2, ArrowUpDown } from 'lucide-react';

type SortOption = 'popular' | 'price-asc' | 'price-desc' | 'newest';

export default function Laptops() {
  const [allProducts, setAllProducts] = useState<ProductWithAttributes[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<ProductWithAttributes[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<SortOption>('popular');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]);
  const [maxPrice, setMaxPrice] = useState(5000);
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
      
      // Filter to only show laptops (exclude monitors, desktops, etc.)
      const laptopsOnly = products.filter(product => {
        const title = product.title.toLowerCase();
        // Exclude monitors and desktops
        if (title.includes('monitor') || title.includes('desktop') || title.includes('all-in-one')) {
          return false;
        }
        // Include laptops, notebooks, chromebooks, etc.
        return true;
      });
      
      // Calculate max price from all products
      const prices = laptopsOnly
        .map(p => p.variants?.[0]?.prices?.[0]?.amount || 0)
        .filter(p => p > 0);
      const calculatedMaxPrice = prices.length > 0 ? Math.ceil(Math.max(...prices) / 100) : 5000;
      setMaxPrice(calculatedMaxPrice);
      setPriceRange([0, calculatedMaxPrice]);
      
      setAllProducts(laptopsOnly);
      setFilteredProducts(laptopsOnly);
      setLoading(false);
    }
    fetchProducts();
  }, []);

  // Apply filters and sorting whenever they change
  useEffect(() => {
    if (allProducts.length === 0) return;

    let filtered = allProducts.filter((product) => {
      const attrs = product.attributes;
      if (!attrs) return false;

      // Price Range Filter
      const price = product.variants?.[0]?.prices?.[0]?.amount;
      if (price) {
        const priceInEuros = price / 100;
        if (priceInEuros < priceRange[0] || priceInEuros > priceRange[1]) {
          return false;
        }
      }

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

    // Apply sorting
    filtered = [...filtered].sort((a, b) => {
      const priceA = a.variants?.[0]?.prices?.[0]?.amount || 0;
      const priceB = b.variants?.[0]?.prices?.[0]?.amount || 0;

      switch (sortBy) {
        case 'price-asc':
          return priceA - priceB;
        case 'price-desc':
          return priceB - priceA;
        case 'newest':
          // Sort by created_at if available, otherwise keep order
          return 0;
        case 'popular':
        default:
          // Default order (most popular - could be based on sales, views, etc.)
          return 0;
      }
    });

    setFilteredProducts(filtered);
  }, [filters, allProducts, sortBy, priceRange]);

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
              <div className="sticky top-20 space-y-4">
                {/* Price Slider */}
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold mb-4">Prijs</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span>€{priceRange[0]}</span>
                      <span>€{priceRange[1]}</span>
                    </div>
                    <div className="space-y-2">
                      <input
                        type="range"
                        min="0"
                        max={maxPrice}
                        value={priceRange[1]}
                        onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black"
                      />
                      <div className="flex items-center gap-2 text-sm">
                        <input
                          type="number"
                          min="0"
                          max={priceRange[1]}
                          value={priceRange[0]}
                          onChange={(e) => setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])}
                          className="w-20 px-2 py-1 border border-gray-300 rounded"
                        />
                        <span className="text-gray-500">-</span>
                        <input
                          type="number"
                          min={priceRange[0]}
                          max={maxPrice}
                          value={priceRange[1]}
                          onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value) || maxPrice])}
                          className="w-20 px-2 py-1 border border-gray-300 rounded"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Filters */}
                <ProductFilters
                  options={filterOptions}
                  filters={filters}
                  onFilterChange={setFilters}
                />
              </div>
            </aside>

            {/* Products Grid */}
            <div className="flex-1">
              {/* Toolbar with Results Count and Sorting */}
              <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <p className="text-sm text-gray-600">
                  {filteredProducts.length} {filteredProducts.length === 1 ? 'resultaat' : 'resultaten'}
                </p>

                {/* Sort Dropdown */}
                <div className="flex items-center gap-2">
                  <ArrowUpDown className="w-4 h-4 text-gray-500" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as SortOption)}
                    className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  >
                    <option value="popular">Meest Populair</option>
                    <option value="price-asc">Prijs: Laag naar Hoog</option>
                    <option value="price-desc">Prijs: Hoog naar Laag</option>
                    <option value="newest">Nieuwste</option>
                  </select>
                </div>
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
