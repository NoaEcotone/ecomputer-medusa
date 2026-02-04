import { useState } from 'react';
import { X, Trash2, ShoppingCart, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useQuoteCart } from '@/contexts/QuoteCartContext';
import { toast } from 'sonner';

export default function QuoteCartDrawer() {
  const { items, removeItem, updateQuantity, clearCart, isOpen, closeCart } = useQuoteCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Customer form state
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [message, setMessage] = useState('');

  const rentalTypeLabels = {
    flex: 'Flex (3+ maanden)',
    jaar: 'Jaar (12 maanden)',
    korte_termijn: 'Korte Termijn (1 dag - 4 weken)',
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('nl-NL');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (items.length === 0) {
      toast.error('Lege offerte', { description: 'Voeg eerst producten toe aan je offerte' });
      return;
    }

    if (!customerName || !customerEmail || !customerPhone) {
      toast.error('Vul alle verplichte velden in');
      return;
    }

    setIsSubmitting(true);

    try {
      const MEDUSA_BACKEND_URL = import.meta.env.VITE_MEDUSA_BACKEND_URL || 'http://localhost:9000';

      // Submit each item as a separate quote request
      const promises = items.map((item) =>
        fetch(`${MEDUSA_BACKEND_URL}/store/quote-requests`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({
            customer_name: customerName,
            customer_email: customerEmail,
            customer_phone: customerPhone,
            company_name: companyName || undefined,
            product_id: item.productId,
            rental_type: item.rentalType,
            quantity: item.quantity,
            desired_period_start: item.desiredPeriodStart,
            desired_period_end: item.desiredPeriodEnd,
            message: message || undefined,
          }),
        })
      );

      const responses = await Promise.all(promises);
      const allSuccessful = responses.every((res) => res.ok);

      if (!allSuccessful) {
        throw new Error('Some requests failed');
      }

      toast.success('Offerte aanvraag verstuurd!', {
        description: `We hebben je aanvraag voor ${items.length} product(en) ontvangen en nemen zo snel mogelijk contact met je op.`,
      });

      // Clear form and cart
      setCustomerName('');
      setCustomerEmail('');
      setCustomerPhone('');
      setCompanyName('');
      setMessage('');
      clearCart();
      closeCart();
    } catch (error) {
      console.error('Error submitting quote request:', error);
      toast.error('Er is een fout opgetreden', {
        description: 'Probeer het later opnieuw',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40"
        onClick={closeCart}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full md:w-[600px] bg-white shadow-xl z-50 overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ShoppingCart className="w-6 h-6" />
            <h2 className="text-xl font-semibold">Offerte Aanvraag</h2>
          </div>
          <button
            onClick={closeCart}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Cart Items */}
          {items.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingCart className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-600">Je offerte is leeg</p>
              <p className="text-sm text-gray-500 mt-2">
                Voeg producten toe vanaf de productpagina's
              </p>
            </div>
          ) : (
            <>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Producten ({items.length})</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearCart}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Alles verwijderen
                  </Button>
                </div>

                {items.map((item, index) => (
                  <div
                    key={`${item.productId}-${item.rentalType}-${index}`}
                    className="bg-gray-50 rounded-lg p-4 space-y-3"
                  >
                    <div className="flex items-start gap-3">
                      {item.productThumbnail && (
                        <img
                          src={item.productThumbnail}
                          alt={item.productTitle}
                          className="w-16 h-16 object-cover rounded"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm truncate">
                          {item.productTitle}
                        </h4>
                        <p className="text-xs text-gray-600 mt-1">
                          {rentalTypeLabels[item.rentalType]}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {formatDate(item.desiredPeriodStart)} - {formatDate(item.desiredPeriodEnd)}
                        </p>
                      </div>
                      <button
                        onClick={() => removeItem(item.productId, item.rentalType)}
                        className="p-1 hover:bg-red-100 rounded text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      <Label htmlFor={`qty-${index}`} className="text-xs">
                        Aantal:
                      </Label>
                      <Input
                        id={`qty-${index}`}
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) =>
                          updateQuantity(
                            item.productId,
                            item.rentalType,
                            parseInt(e.target.value) || 1
                          )
                        }
                        className="w-20 h-8 text-sm"
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Customer Form */}
              <form onSubmit={handleSubmit} className="space-y-4 border-t border-gray-200 pt-6">
                <h3 className="font-semibold">Jouw gegevens</h3>

                <div>
                  <Label htmlFor="name">
                    Naam <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    required
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="email">
                    Email <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    required
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="phone">
                    Telefoon <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    required
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="company">Bedrijfsnaam (optioneel)</Label>
                  <Input
                    id="company"
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="message">Bericht (optioneel)</Label>
                  <Textarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Eventuele opmerkingen of vragen..."
                    className="mt-1"
                    rows={3}
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  size="lg"
                >
                  {isSubmitting ? (
                    <>Bezig met versturen...</>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Offerte Aanvragen
                    </>
                  )}
                </Button>
              </form>
            </>
          )}
        </div>
      </div>
    </>
  );
}
