import { useState, useEffect } from 'react';
import { useRoute } from 'wouter';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ProductWithAttributes, formatPrice } from '@/lib/medusa';
import { Loader2, ArrowLeft, Laptop } from 'lucide-react';
import { Link } from 'wouter';
import RentalPricing from '@/components/RentalPricing';
import QuoteRequestDialog from '@/components/QuoteRequestDialog';

export default function ProductDetail() {
  const [, params] = useRoute('/products/:handle');
  const handle = params?.handle;

  const [product, setProduct] = useState<ProductWithAttributes | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [quoteDialogOpen, setQuoteDialogOpen] = useState(false);
  const [selectedRentalType, setSelectedRentalType] = useState<'flex' | 'jaar'>('flex');

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
  
  // Build image gallery array
  const imageGallery = [];
  if (product.thumbnail) {
    imageGallery.push({ url: product.thumbnail, id: 'thumbnail' });
  }
  if (product.images && product.images.length > 0) {
    product.images.forEach(img => {
      // Avoid duplicate if thumbnail is same as first image
      if (!product.thumbnail || img.url !== product.thumbnail) {
        imageGallery.push(img);
      }
    });
  }
  
  const currentImage = imageGallery[selectedImageIndex];

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
            {/* Product Images Gallery */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="bg-white rounded-lg overflow-hidden border border-gray-200">
                <div className="aspect-[4/3] bg-gray-100 flex items-center justify-center">
                  {currentImage ? (
                    <img
                      src={currentImage.url}
                      alt={product.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Laptop className="w-32 h-32 text-gray-300" />
                  )}
                </div>
              </div>

              {/* Thumbnail Gallery */}
              {imageGallery.length > 1 && (
                <div className="grid grid-cols-6 gap-2">
                  {imageGallery.map((img, index) => (
                    <button
                      key={img.id || index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`aspect-square bg-white rounded-lg overflow-hidden border-2 transition-all ${
                        selectedImageIndex === index
                          ? 'border-black shadow-md'
                          : 'border-gray-200 hover:border-gray-400'
                      }`}
                    >
                      <img
                        src={img.url}
                        alt={`${product.title} - afbeelding ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              {/* Title */}
              <div>
                <h1 className="text-3xl font-bold mb-2">{product.title}</h1>
                {product.description && (() => {
                  const MAX_CHARS = 300; // Show first 300 characters
                  const isLongDescription = product.description.length > MAX_CHARS;
                  const displayText = isLongDescription && !isDescriptionExpanded 
                    ? product.description.substring(0, MAX_CHARS) + '...'
                    : product.description;
                  
                  return (
                    <div>
                      <p className="text-gray-600 whitespace-pre-line">{displayText}</p>
                      {isLongDescription && (
                        <button
                          onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                          className="text-blue-600 hover:text-blue-800 font-medium text-sm mt-2 transition-colors"
                        >
                          {isDescriptionExpanded ? 'Minder lezen' : 'Meer lezen'}
                        </button>
                      )}
                    </div>
                  );
                })()}
              </div>

              {/* Rental Pricing - Replaces old price display */}
              <RentalPricing
                productId={product.id}
                onRequestQuote={(type) => {
                  setSelectedRentalType(type);
                  setQuoteDialogOpen(true);
                }}
              />

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

              {/* Removed: Add to Cart Section - Replaced with Rental Pricing above */}
            </div>
          </div>

          {/* Full Specifications Table */}
          {attrs && (
            <div className="mt-12 bg-white rounded-lg border border-gray-200 p-8">
              <h2 className="text-2xl font-bold mb-6">Volledige Specificaties</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
                {attrs.processor_type && (
                  <SpecRow label="Processor Type" value={attrs.processor_type} />
                )}
                {attrs.processor_family && (
                  <SpecRow label="Processor Familie" value={attrs.processor_family} />
                )}
                {attrs.ram_size && (
                  <SpecRow label="RAM Geheugen" value={`${attrs.ram_size} GB`} />
                )}
                {attrs.storage_capacity && (
                  <SpecRow 
                    label="Opslag Capaciteit" 
                    value={attrs.storage_capacity >= 1000 
                      ? `${attrs.storage_capacity / 1000} TB` 
                      : `${attrs.storage_capacity} GB`
                    } 
                  />
                )}
                {attrs.storage_type && (
                  <SpecRow label="Opslag Type" value={attrs.storage_type} />
                )}
                {attrs.screen_size && (
                  <SpecRow label="Schermgrootte" value={`${attrs.screen_size}"`} />
                )}
                {attrs.screen_resolution && (
                  <SpecRow label="Schermresolutie" value={attrs.screen_resolution} />
                )}
                {attrs.graphics_type && (
                  <SpecRow label="Videokaart Type" value={attrs.graphics_type} />
                )}
                {attrs.graphics_card && (
                  <SpecRow label="Videokaart" value={attrs.graphics_card} />
                )}
                {attrs.operating_system && (
                  <SpecRow label="Besturingssysteem" value={attrs.operating_system} />
                )}
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
      
      {/* Quote Request Dialog */}
      <QuoteRequestDialog
        open={quoteDialogOpen}
        onOpenChange={setQuoteDialogOpen}
        productId={product.id}
        productTitle={product.title}
        rentalType={selectedRentalType}
      />
    </div>
  );
}

function SpecRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between py-2 border-b border-gray-100">
      <span className="text-gray-600">{label}</span>
      <span className="font-medium text-right">{value}</span>
    </div>
  );
}
