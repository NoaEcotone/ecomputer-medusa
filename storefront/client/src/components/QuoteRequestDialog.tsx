import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, CheckCircle2 } from 'lucide-react';

interface QuoteRequestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productId: string;
  productTitle: string;
  rentalType: 'flex' | 'jaar';
}

export default function QuoteRequestDialog({
  open,
  onOpenChange,
  productId,
  productTitle,
  rentalType,
}: QuoteRequestDialogProps) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    company_name: '',
    desired_period_start: '',
    desired_period_end: '',
    message: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const MEDUSA_BACKEND_URL = import.meta.env.VITE_MEDUSA_BACKEND_URL || 'http://localhost:9000';
      const MEDUSA_PUBLISHABLE_KEY = import.meta.env.VITE_MEDUSA_PUBLISHABLE_KEY || '';

      // Prepare requested items
      const requestedItems = [
        {
          product_id: productId,
          product_title: productTitle,
          rental_type: rentalType,
          quantity: 1,
        },
      ];

      const response = await fetch(`${MEDUSA_BACKEND_URL}/store/quote-requests`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-publishable-api-key': MEDUSA_PUBLISHABLE_KEY,
        },
        body: JSON.stringify({
          ...formData,
          requested_items: requestedItems,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit quote request');
      }

      setSuccess(true);
      
      // Reset form after 2 seconds and close dialog
      setTimeout(() => {
        setFormData({
          customer_name: '',
          customer_email: '',
          customer_phone: '',
          company_name: '',
          desired_period_start: '',
          desired_period_end: '',
          message: '',
        });
        setSuccess(false);
        onOpenChange(false);
      }, 2000);
    } catch (err) {
      setError('Er is een fout opgetreden. Probeer het later opnieuw.');
      console.error('Error submitting quote request:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateFormData = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Offerte Aanvragen</DialogTitle>
          <DialogDescription>
            Vul uw gegevens in en wij nemen zo snel mogelijk contact met u op.
          </DialogDescription>
        </DialogHeader>

        {success ? (
          <div className="py-8 text-center">
            <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Offerte Aanvraag Verstuurd!</h3>
            <p className="text-gray-600">
              Bedankt voor uw aanvraag. Wij nemen zo snel mogelijk contact met u op.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Product Info */}
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Product:</span>
                <span className="font-medium">{productTitle}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Huurtype:</span>
                <span className="font-medium uppercase">{rentalType}</span>
              </div>
            </div>

            {/* Customer Info */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="customer_name">
                  Naam <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="customer_name"
                  value={formData.customer_name}
                  onChange={(e) => updateFormData('customer_name', e.target.value)}
                  required
                  placeholder="Uw volledige naam"
                />
              </div>

              <div>
                <Label htmlFor="customer_email">
                  E-mailadres <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="customer_email"
                  type="email"
                  value={formData.customer_email}
                  onChange={(e) => updateFormData('customer_email', e.target.value)}
                  required
                  placeholder="uw@email.nl"
                />
              </div>

              <div>
                <Label htmlFor="customer_phone">
                  Telefoonnummer <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="customer_phone"
                  type="tel"
                  value={formData.customer_phone}
                  onChange={(e) => updateFormData('customer_phone', e.target.value)}
                  required
                  placeholder="06-12345678"
                />
              </div>

              <div>
                <Label htmlFor="company_name">
                  Bedrijfsnaam <span className="text-gray-400">(optioneel)</span>
                </Label>
                <Input
                  id="company_name"
                  value={formData.company_name}
                  onChange={(e) => updateFormData('company_name', e.target.value)}
                  placeholder="Uw bedrijfsnaam"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="desired_period_start">
                    Gewenste startdatum <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="desired_period_start"
                    type="date"
                    value={formData.desired_period_start}
                    onChange={(e) => updateFormData('desired_period_start', e.target.value)}
                    required
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>

                <div>
                  <Label htmlFor="desired_period_end">
                    Gewenste einddatum <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="desired_period_end"
                    type="date"
                    value={formData.desired_period_end}
                    onChange={(e) => updateFormData('desired_period_end', e.target.value)}
                    required
                    min={formData.desired_period_start || new Date().toISOString().split('T')[0]}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="message">
                  Bericht <span className="text-gray-400">(optioneel)</span>
                </Label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => updateFormData('message', e.target.value)}
                  placeholder="Eventuele aanvullende informatie of vragen..."
                  rows={4}
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm text-red-900">{error}</p>
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={loading}
              >
                Annuleren
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Versturen...
                  </>
                ) : (
                  'Offerte Aanvragen'
                )}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
