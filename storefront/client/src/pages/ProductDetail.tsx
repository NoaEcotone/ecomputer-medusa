import { useEffect, useState } from 'react';
import { useRoute } from 'wouter';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ProductWithAttributes, formatPrice } from '@/lib/medusa';
import { Loader2, ArrowLeft, Laptop } from 'lucide-react';
import { Link } from 'wouter';

export default function ProductDetail() {
  const [, params] = useRoute('/products/:handle');
  const handle = params?.handle;

  const [product, setProduct] = useState<ProductWithAttributes | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProduct() {
      if (!handle) return;

      setLoading(true);
      setError(null);

      try {
        const MEDUSA_BACKEND_URL = import.meta.env.VITE_MEDUSA_BACKEND_URL || 'http://localhost:9000';
        const MEDUSA_PUBLISHABLE_KEY = import.meta.env.VITE_MEDUSA_PUBLISHABLE_KEY || '';

        const response = await fetch(`${MEDUSA_BACKEND_URL}/store/products-with-attributes`, {
          headers: {
            'Content-Type': 'application/json',
            'x-publishable-api-key': MEDUSA_PUBLISHABLE_KEY,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch product');
        }

        const data = await response.json();
        const foundProduct = data.products.find((p: ProductWithAttributes) => p.handle === handle);

        if (!foundProduct) {
          setError('Product niet gevonden');
        } else {
          setProduct(foundProduct);
        }
      } catch (err) {
        setError('Er is een fout opgetreden bij het laden van het product');
        console.error('Error fetching product:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, [handle]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Product laden...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">{error || 'Product niet gevonden'}</h1>
            <Link href="/laptops">
              <a className="text-blue-600 hover:underline">← Terug naar laptops</a>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const attrs = product.attributes;
  const variant = product.variants?.[0];
  const price = variant?.prices?.[0];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 bg-gray-50">
        <div className="container py-8">
          {/* Breadcrumb */}
          <div className="mb-6">
            <Link href="/laptops">
              <a className="flex items-center gap-2 text-gray-600 hover:text-black transition-colors">
                <ArrowLeft className="w-4 h-4" />
                Terug naar laptops
              </a>
            </Link>
          </div>

          {/* Product Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Product Image */}
            <div className="bg-white rounded-lg overflow-hidden border border-gray-200">
              <div className="aspect-[4/3] bg-gray-100 flex items-center justify-center">
                {product.thumbnail ? (
                  <img
                    src={product.thumbnail}
                    alt={product.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Laptop className="w-32 h-32 text-gray-300" />
                )}
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              {/* Title and Condition */}
              <div>
                {attrs?.condition && (
                  <span className="inline-block px-3 py-1 bg-gray-100 text-sm font-medium rounded-full mb-3">
                    {attrs.condition}
                  </span>
                )}
                <h1 className="text-3xl font-bold mb-2">{product.title}</h1>
                {product.description && (
                  <p className="text-gray-600">{product.description}</p>
                )}
              </div>

              {/* Price */}
              {price && (
                <div className="py-4 border-y border-gray-200">
                  <p className="text-3xl font-bold">
                    {formatPrice(price.amount, price.currency_code)}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">Prijs per maand (huurperiode volgt later)</p>
                </div>
              )}

              {/* Key Specs */}
              {attrs && (
                <div className="bg-gray-50 rounded-lg p-6 space-y-3">
                  <h2 className="font-semibold text-lg mb-4">Belangrijkste specificaties</h2>
                  
                  {attrs.processor_type && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Processor</span>
                      <span className="font-medium">{attrs.processor_type}</span>
                    </div>
                  )}
                  
                  {attrs.ram_size && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">RAM Geheugen</span>
                      <span className="font-medium">{attrs.ram_size} GB</span>
                    </div>
                  )}
                  
                  {attrs.storage_capacity && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Opslag</span>
                      <span className="font-medium">
                        {attrs.storage_capacity >= 1000
                          ? `${attrs.storage_capacity / 1000} TB`
                          : `${attrs.storage_capacity} GB`}
                        {attrs.storage_type && ` ${attrs.storage_type}`}
                      </span>
                    </div>
                  )}
                  
                  {attrs.screen_size && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Schermgrootte</span>
                      <span className="font-medium">{attrs.screen_size}" {attrs.screen_resolution}</span>
                    </div>
                  )}
                  
                  {attrs.graphics_type && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Videokaart</span>
                      <span className="font-medium">{attrs.graphics_card || attrs.graphics_type}</span>
                    </div>
                  )}
                  
                  {attrs.operating_system && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Besturingssysteem</span>
                      <span className="font-medium">{attrs.operating_system}</span>
                    </div>
                  )}
                </div>
              )}

              {/* CTA Placeholder */}
              <div className="space-y-3">
                <button
                  disabled
                  className="w-full bg-gray-300 text-gray-600 px-6 py-3 rounded-lg font-medium cursor-not-allowed"
                >
                  Toevoegen aan winkelwagen (binnenkort beschikbaar)
                </button>
                <p className="text-sm text-gray-500 text-center">
                  Huurperiode en checkout worden later toegevoegd
                </p>
              </div>
            </div>
          </div>

          {/* Additional Specs */}
          {product.metadata && (
            <div className="mt-12 bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-2xl font-bold mb-6">Volledige specificaties</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                {Object.entries(product.metadata).map(([key, value]) => {
                  // Skip attributes that are already shown above
                  if (['processor_type', 'processor_family', 'ram_size', 'storage_capacity', 
                       'storage_type', 'screen_size', 'screen_resolution', 'graphics_type', 
                       'graphics_card', 'condition', 'operating_system'].includes(key)) {
                    return null;
                  }

                  // Skip null/empty values
                  if (!value || value === 'null') return null;

                  // Format the key
                  const formattedKey = key
                    .replace(/_/g, ' ')
                    .replace(/\b\w/g, (l) => l.toUpperCase());

                  // Format the value
                  let formattedValue = value;
                  if (typeof value === 'string' && value.startsWith('{')) {
                    try {
                      const parsed = JSON.parse(value);
                      formattedValue = Object.entries(parsed)
                        .filter(([, v]) => v && v !== 'null')
                        .map(([k, v]) => `${k}: ${v}`)
                        .join(', ');
                      if (!formattedValue) return null;
                    } catch {
                      // Keep original value if parsing fails
                    }
                  }

                  return (
                    <div key={key} className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">{formattedKey}</span>
                      <span className="font-medium text-right">{formattedValue}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
