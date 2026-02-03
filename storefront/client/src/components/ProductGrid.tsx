import { Link } from 'wouter';
import { Laptop } from 'lucide-react';
import { ProductWithAttributes, formatPrice } from '../lib/medusa';

interface ProductGridProps {
  products: ProductWithAttributes[];
}

export default function ProductGrid({ products }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <Laptop className="w-16 h-16 text-gray-300 mb-4" />
        <p className="text-xl font-medium text-gray-600 mb-2">Geen producten gevonden</p>
        <p className="text-sm text-gray-500">Probeer andere filters</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

function ProductCard({ product }: { product: ProductWithAttributes }) {
  const attrs = product.attributes;
  const variant = product.variants?.[0];
  const price = variant?.prices?.[0];
  
  // Use thumbnail if available, otherwise use first image from images array
  const imageUrl = product.thumbnail || product.images?.[0]?.url;

  return (
    <Link
      href={`/products/${product.handle}`}
      className="group bg-white border border-gray-200 rounded-lg overflow-hidden hover:border-black hover:shadow-lg transition-all duration-300"
    >
      {/* Image */}
      <div className="aspect-[4/3] bg-gray-100 relative overflow-hidden">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Laptop className="w-16 h-16 text-gray-300" />
          </div>
        )}
        
        {/* Condition Badge */}
        {attrs?.condition && (
          <div className="absolute top-3 right-3 bg-white px-3 py-1 rounded-full text-xs font-medium border border-gray-200 shadow-sm">
            {attrs.condition}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Title */}
        <h3 className="font-semibold text-black group-hover:underline line-clamp-2 min-h-[3rem]">
          {product.title}
        </h3>

        {/* Specs */}
        {attrs && (
          <div className="space-y-1 text-sm text-gray-600">
            {attrs.processor_type && (
              <div className="flex items-center gap-2">
                <span className="text-gray-400">•</span>
                <span className="truncate">{attrs.processor_type}</span>
              </div>
            )}
            {attrs.ram_size && (
              <div className="flex items-center gap-2">
                <span className="text-gray-400">•</span>
                <span>{attrs.ram_size} GB RAM</span>
              </div>
            )}
            {attrs.storage_capacity && (
              <div className="flex items-center gap-2">
                <span className="text-gray-400">•</span>
                <span>
                  {attrs.storage_capacity >= 1000
                    ? `${attrs.storage_capacity / 1000} TB`
                    : `${attrs.storage_capacity} GB`}
                  {attrs.storage_type && ` ${attrs.storage_type}`}
                </span>
              </div>
            )}
            {attrs.screen_size && (
              <div className="flex items-center gap-2">
                <span className="text-gray-400">•</span>
                <span>{attrs.screen_size}" scherm</span>
              </div>
            )}
          </div>
        )}

        {/* Price */}
        {price && (
          <div className="pt-3 border-t border-gray-200">
            <p className="text-xl font-bold text-black">
              {formatPrice(price.amount, price.currency_code)}
            </p>
          </div>
        )}
      </div>
    </Link>
  );
}
