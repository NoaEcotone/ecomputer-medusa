import { useCart } from '@/contexts/CartContext';
import { formatPrice } from '@/lib/medusa';
import { X, ShoppingBag, Minus, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';

export default function CartDrawer() {
  const { cart, isCartOpen, closeCart, updateCartItem, removeFromCart, itemCount } = useCart();

  if (!isCartOpen) return null;

  const handleUpdateQuantity = async (lineItemId: string, currentQuantity: number, change: number) => {
    const newQuantity = currentQuantity + change;
    if (newQuantity < 1) return;
    
    try {
      await updateCartItem(lineItemId, newQuantity);
    } catch (error) {
      console.error('Failed to update quantity:', error);
    }
  };

  const handleRemoveItem = async (lineItemId: string) => {
    try {
      await removeFromCart(lineItemId);
    } catch (error) {
      console.error('Failed to remove item:', error);
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40 transition-opacity"
        onClick={closeCart}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <ShoppingBag className="w-6 h-6" />
            <h2 className="text-xl font-bold">
              Winkelwagen {itemCount > 0 && `(${itemCount})`}
            </h2>
          </div>
          <button
            onClick={closeCart}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Sluit winkelwagen"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6">
          {!cart || !cart.items || cart.items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <ShoppingBag className="w-16 h-16 text-gray-300 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Je winkelwagen is leeg
              </h3>
              <p className="text-gray-600 mb-6">
                Voeg producten toe om te beginnen met huren
              </p>
              <Button onClick={closeCart} asChild>
                <Link href="/laptops">
                  <a>Bekijk Laptops</a>
                </Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200"
                >
                  {/* Product Image */}
                  <div className="w-20 h-20 bg-white rounded-lg overflow-hidden flex-shrink-0 border border-gray-200">
                    {item.thumbnail || item.variant?.product?.thumbnail ? (
                      <img
                        src={item.thumbnail || item.variant?.product?.thumbnail}
                        alt={item.product_title || item.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-100">
                        <ShoppingBag className="w-8 h-8 text-gray-300" />
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm mb-1 truncate">
                      {item.product_title || item.variant?.product?.title || item.title}
                    </h3>
                    {item.variant_title && item.variant_title !== 'Default' && item.variant_title !== 'Default Variant' && (
                      <p className="text-xs text-gray-600 mb-2">{item.variant_title}</p>
                    )}
                    
                    <div className="flex items-center justify-between">
                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-lg">
                        <button
                          onClick={() => handleUpdateQuantity(item.id, item.quantity, -1)}
                          className="p-1.5 hover:bg-gray-100 transition-colors rounded-l-lg"
                          aria-label="Verminder aantal"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="px-3 font-medium text-sm">{item.quantity}</span>
                        <button
                          onClick={() => handleUpdateQuantity(item.id, item.quantity, 1)}
                          className="p-1.5 hover:bg-gray-100 transition-colors rounded-r-lg"
                          aria-label="Verhoog aantal"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Price */}
                      <div className="text-right">
                        <p className="font-bold text-sm">
                          {formatPrice(item.subtotal || (item.unit_price * item.quantity), cart.currency_code)}
                        </p>
                        {item.quantity > 1 && item.unit_price && (
                          <p className="text-xs text-gray-600">
                            {formatPrice(item.unit_price, cart.currency_code)} per stuk
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      className="mt-2 flex items-center gap-1 text-xs text-red-600 hover:text-red-700 transition-colors"
                    >
                      <Trash2 className="w-3 h-3" />
                      Verwijderen
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer with Summary */}
        {cart && cart.items && cart.items.length > 0 && (
          <div className="border-t border-gray-200 p-6 space-y-4">
            {/* Subtotal */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotaal</span>
                <span className="font-medium">
                  {formatPrice(cart.subtotal, cart.currency_code)}
                </span>
              </div>
              {cart.tax_total > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">BTW</span>
                  <span className="font-medium">
                    {formatPrice(cart.tax_total, cart.currency_code)}
                  </span>
                </div>
              )}
              {cart.shipping_total > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Verzending</span>
                  <span className="font-medium">
                    {formatPrice(cart.shipping_total, cart.currency_code)}
                  </span>
                </div>
              )}
            </div>

            {/* Total */}
            <div className="flex justify-between items-center pt-4 border-t border-gray-200">
              <span className="text-lg font-bold">Totaal</span>
              <span className="text-2xl font-bold">
                {formatPrice(cart.total, cart.currency_code)}
              </span>
            </div>

            {/* Info Message */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-900">
                <strong>Let op:</strong> Huurperiode en betaalopties worden binnenkort toegevoegd. 
                Neem contact op voor meer informatie.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2">
              <Button
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                size="lg"
                asChild
              >
                <Link href="/contact">
                  <a onClick={closeCart}>Neem Contact Op</a>
                </Link>
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={closeCart}
                asChild
              >
                <Link href="/laptops">
                  <a>Verder Winkelen</a>
                </Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
