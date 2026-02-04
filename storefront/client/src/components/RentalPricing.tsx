import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Calendar, Shield } from 'lucide-react';
import { useQuoteCart } from '@/contexts/QuoteCartContext';
import { toast } from 'sonner';

interface RentalPricingData {
  id: string;
  product_id: string;
  flex_monthly_price: number | null;
  year_monthly_price: number | null;
  deposit_amount: number | null;
  flex_available: boolean;
  year_available: boolean;
}

interface RentalPricingProps {
  productId: string;
  productTitle: string;
  productHandle: string;
  productThumbnail?: string;
}

export default function RentalPricing({ productId, productTitle, productHandle, productThumbnail }: RentalPricingProps) {
  const [pricing, setPricing] = useState<RentalPricingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Separate state for each rental type
  const [flexQuantity, setFlexQuantity] = useState(1);
  const [flexStartDate, setFlexStartDate] = useState('');
  const [flexEndDate, setFlexEndDate] = useState('');
  
  const [yearQuantity, setYearQuantity] = useState(1);
  const [yearStartDate, setYearStartDate] = useState('');
  const [yearEndDate, setYearEndDate] = useState('');
  
  const [shortQuantity, setShortQuantity] = useState(1);
  const [shortStartDate, setShortStartDate] = useState('');
  const [shortEndDate, setShortEndDate] = useState('');

  const { addItem } = useQuoteCart();

  useEffect(() => {
    async function fetchPricing() {
      setLoading(true);
      setError(null);

      try {
        const MEDUSA_BACKEND_URL = import.meta.env.VITE_MEDUSA_BACKEND_URL || 'http://localhost:9000';
        const MEDUSA_PUBLISHABLE_KEY = import.meta.env.VITE_MEDUSA_PUBLISHABLE_KEY || '';

        const response = await fetch(
          `${MEDUSA_BACKEND_URL}/store/rental-pricing?product_id=${productId}`,
          {
            headers: {
              'Content-Type': 'application/json',
              'x-publishable-api-key': MEDUSA_PUBLISHABLE_KEY,
            },
          }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch rental pricing');
        }

        const data = await response.json();
        
        if (data.rental_pricings && data.rental_pricings.length > 0) {
          setPricing(data.rental_pricings[0]);
        } else {
          setError('Geen verhuurprijzen beschikbaar voor dit product');
        }
      } catch (err) {
        setError('Er is een fout opgetreden bij het laden van de verhuurprijzen');
        console.error('Error fetching rental pricing:', err);
      } finally {
        setLoading(false);
      }
    }

    if (productId) {
      fetchPricing();
    }
  }, [productId]);

  const formatPrice = (amount: number | null) => {
    if (amount === null) return '-';
    return new Intl.NumberFormat('nl-NL', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount);
  };

  const validateDates = (type: 'flex' | 'jaar' | 'korte_termijn', startDate: string, endDate: string): string | null => {
    if (!startDate || !endDate) {
      return 'Selecteer een start- en einddatum';
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (start < today) {
      return 'Startdatum kan niet in het verleden liggen';
    }

    if (end <= start) {
      return 'Einddatum moet na de startdatum liggen';
    }

    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (type === 'flex' && diffDays < 90) {
      return 'Flex huur vereist minimaal 3 maanden (90 dagen)';
    }

    if (type === 'jaar' && diffDays < 365) {
      return 'Jaar huur vereist minimaal 12 maanden (365 dagen)';
    }

    if (type === 'korte_termijn' && diffDays > 28) {
      return 'Korte termijn huur kan maximaal 4 weken (28 dagen) zijn';
    }

    return null;
  };

  const handleAddToCart = (type: 'flex' | 'jaar' | 'korte_termijn') => {
    let quantity, startDate, endDate;

    if (type === 'flex') {
      quantity = flexQuantity;
      startDate = flexStartDate;
      endDate = flexEndDate;
    } else if (type === 'jaar') {
      quantity = yearQuantity;
      startDate = yearStartDate;
      endDate = yearEndDate;
    } else {
      quantity = shortQuantity;
      startDate = shortStartDate;
      endDate = shortEndDate;
    }

    // Validate
    const error = validateDates(type, startDate, endDate);
    if (error) {
      toast.error('Ongeldige datum', { description: error });
      return;
    }

    if (quantity < 1) {
      toast.error('Ongeldig aantal', { description: 'Aantal moet minimaal 1 zijn' });
      return;
    }

    // Add to cart
    addItem({
      productId,
      productTitle,
      productHandle,
      productThumbnail,
      rentalType: type,
      quantity,
      desiredPeriodStart: startDate,
      desiredPeriodEnd: endDate,
    });

    const typeLabels = {
      flex: 'Flex',
      jaar: 'Jaar',
      korte_termijn: 'Korte Termijn',
    };

    toast.success('Toegevoegd aan offerte', {
      description: `${quantity}x ${productTitle} (${typeLabels[type]})`,
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
      </div>
    );
  }

  if (error || !pricing) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-sm text-yellow-900">
          {error || 'Verhuurprijzen niet beschikbaar'}
        </p>
      </div>
    );
  }

  const hasFlexPricing = pricing.flex_available && pricing.flex_monthly_price !== null;
  const hasYearPricing = pricing.year_available && pricing.year_monthly_price !== null;

  if (!hasFlexPricing && !hasYearPricing) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <p className="text-sm text-gray-600">
          Dit product is momenteel niet beschikbaar voor verhuur.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold mb-2">Verhuurprijzen</h2>
        <p className="text-sm text-gray-600">
          Kies een huurperiode, aantal en datums, en voeg toe aan je offerte
        </p>
      </div>

      {/* Pricing Options */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Flex Option - LEFT */}
        {hasFlexPricing && (
          <div className="bg-white border-2 border-blue-200 rounded-lg p-6 flex flex-col">
            <div className="flex items-start justify-between mb-4">
              <div>
                <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100 mb-2">
                  FLEX
                </Badge>
                <h3 className="text-2xl font-bold">
                  {formatPrice(pricing.flex_monthly_price)}
                  <span className="text-sm font-normal text-gray-600">/maand</span>
                </h3>
              </div>
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
            
            <ul className="space-y-2 mb-4 text-sm text-gray-600">
              <li className="flex items-start">
                <span className="mr-2">✓</span>
                <span>Flexibele huurperiode</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">✓</span>
                <span>3 maanden opzegtermijn</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">✓</span>
                <span>Minimum 3 maanden</span>
              </li>
            </ul>

            <div className="space-y-3 mb-4">
              <div>
                <Label htmlFor="flex-quantity" className="text-xs">Aantal</Label>
                <Input
                  id="flex-quantity"
                  type="number"
                  min="1"
                  value={flexQuantity}
                  onChange={(e) => setFlexQuantity(parseInt(e.target.value) || 1)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="flex-start" className="text-xs">Startdatum</Label>
                <Input
                  id="flex-start"
                  type="date"
                  value={flexStartDate}
                  onChange={(e) => setFlexStartDate(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="flex-end" className="text-xs">Einddatum</Label>
                <Input
                  id="flex-end"
                  type="date"
                  value={flexEndDate}
                  onChange={(e) => setFlexEndDate(e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>

            <Button
              onClick={() => handleAddToCart('flex')}
              className="w-full bg-blue-600 hover:bg-blue-700 mt-auto text-sm"
            >
              Toevoegen aan Offerte
            </Button>
          </div>
        )}

        {/* Year Option - MIDDLE */}
        {hasYearPricing && (
          <div className="bg-white border-2 border-purple-200 rounded-lg p-6 flex flex-col">
            <div className="flex items-start justify-between mb-4">
              <div>
                <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100 mb-2">
                  JAAR
                </Badge>
                <h3 className="text-2xl font-bold">
                  {formatPrice(pricing.year_monthly_price)}
                  <span className="text-sm font-normal text-gray-600">/maand</span>
                </h3>
              </div>
              <Calendar className="w-6 h-6 text-purple-600" />
            </div>
            
            <ul className="space-y-2 mb-4 text-sm text-gray-600">
              <li className="flex items-start">
                <span className="mr-2">✓</span>
                <span>1 jaar vaste periode</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">✓</span>
                <span>Lagere maandprijs</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">✓</span>
                <span>Beste prijs-kwaliteit</span>
              </li>
            </ul>

            <div className="space-y-3 mb-4">
              <div>
                <Label htmlFor="year-quantity" className="text-xs">Aantal</Label>
                <Input
                  id="year-quantity"
                  type="number"
                  min="1"
                  value={yearQuantity}
                  onChange={(e) => setYearQuantity(parseInt(e.target.value) || 1)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="year-start" className="text-xs">Startdatum</Label>
                <Input
                  id="year-start"
                  type="date"
                  value={yearStartDate}
                  onChange={(e) => setYearStartDate(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="year-end" className="text-xs">Einddatum</Label>
                <Input
                  id="year-end"
                  type="date"
                  value={yearEndDate}
                  onChange={(e) => setYearEndDate(e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>

            <Button
              onClick={() => handleAddToCart('jaar')}
              className="w-full bg-purple-600 hover:bg-purple-700 mt-auto text-sm"
            >
              Toevoegen aan Offerte
            </Button>
          </div>
        )}

        {/* Short-term Option - RIGHT */}
        <div className="bg-white border-2 border-green-200 rounded-lg p-6 flex flex-col">
          <div className="flex items-start justify-between mb-4">
            <div>
              <Badge className="bg-green-100 text-green-800 hover:bg-green-100 mb-2">
                KORTE TERMIJN
              </Badge>
              <h3 className="text-2xl font-bold">
                Op aanvraag
              </h3>
            </div>
            <Calendar className="w-6 h-6 text-green-600" />
          </div>
          
          <ul className="space-y-2 mb-4 text-sm text-gray-600">
            <li className="flex items-start">
              <span className="mr-2">✓</span>
              <span>1 dag tot 4 weken</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">✓</span>
              <span>Handmatige offerte</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">✓</span>
              <span>Snelle beschikbaarheid</span>
            </li>
          </ul>

          <div className="space-y-3 mb-4">
            <div>
              <Label htmlFor="short-quantity" className="text-xs">Aantal</Label>
              <Input
                id="short-quantity"
                type="number"
                min="1"
                value={shortQuantity}
                onChange={(e) => setShortQuantity(parseInt(e.target.value) || 1)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="short-start" className="text-xs">Startdatum</Label>
              <Input
                id="short-start"
                type="date"
                value={shortStartDate}
                onChange={(e) => setShortStartDate(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="short-end" className="text-xs">Einddatum</Label>
              <Input
                id="short-end"
                type="date"
                value={shortEndDate}
                onChange={(e) => setShortEndDate(e.target.value)}
                className="mt-1"
              />
            </div>
          </div>

          <Button
            onClick={() => handleAddToCart('korte_termijn')}
            className="w-full bg-green-600 hover:bg-green-700 mt-auto text-sm"
          >
            Toevoegen aan Offerte
          </Button>
        </div>
      </div>

      {/* Deposit Info */}
      {pricing.deposit_amount !== null && pricing.deposit_amount > 0 && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 flex items-start gap-3">
          <Shield className="w-5 h-5 text-gray-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-gray-900">Borgbedrag</p>
            <p className="text-sm text-gray-600">
              Eenmalig {formatPrice(pricing.deposit_amount)} borg bij aanvang contract
              (wordt terugbetaald bij retournering)
            </p>
          </div>
        </div>
      )}

      {/* Additional Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-900">
          <strong>Let op:</strong> Dit zijn indicatieprijzen. Na het indienen van je offerte 
          nemen wij contact met u op om de details te bespreken en de offerte definitief te maken.
        </p>
      </div>
    </div>
  );
}
