// Cart API functions for Medusa.js
// Handles all cart operations: create, retrieve, add items, update, remove

const MEDUSA_BACKEND_URL = import.meta.env.VITE_MEDUSA_BACKEND_URL || 'http://localhost:9000';
const MEDUSA_PUBLISHABLE_KEY = import.meta.env.VITE_MEDUSA_PUBLISHABLE_KEY || '';

export interface CartItem {
  id: string;
  title: string;
  variant_id: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
  thumbnail: string | null;
  product_title: string;
  variant_title: string;
}

export interface Cart {
  id: string;
  items: CartItem[];
  total: number;
  subtotal: number;
  tax_total: number;
  shipping_total: number;
  region_id: string;
  currency_code: string;
}

/**
 * Get cart ID from localStorage
 */
function getCartId(): string | null {
  return localStorage.getItem('cart_id');
}

/**
 * Save cart ID to localStorage
 */
function setCartId(cartId: string): void {
  localStorage.setItem('cart_id', cartId);
}

/**
 * Clear cart ID from localStorage
 */
function clearCartId(): void {
  localStorage.removeItem('cart_id');
}

/**
 * Create a new cart
 */
export async function createCart(): Promise<Cart> {
  try {
    const response = await fetch(`${MEDUSA_BACKEND_URL}/store/carts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-publishable-api-key': MEDUSA_PUBLISHABLE_KEY,
      },
      body: JSON.stringify({
        region_id: 'reg_01JKHQVXQXQXQXQXQXQXQXQXQX', // Default region, adjust as needed
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to create cart');
    }

    const data = await response.json();
    const cart = data.cart;
    setCartId(cart.id);
    return cart;
  } catch (error) {
    console.error('Error creating cart:', error);
    throw error;
  }
}

/**
 * Retrieve existing cart or create new one
 */
export async function getCart(): Promise<Cart | null> {
  const cartId = getCartId();

  if (!cartId) {
    return null;
  }

  try {
    const response = await fetch(`${MEDUSA_BACKEND_URL}/store/carts/${cartId}`, {
      headers: {
        'Content-Type': 'application/json',
        'x-publishable-api-key': MEDUSA_PUBLISHABLE_KEY,
      },
    });

    if (!response.ok) {
      // Cart doesn't exist anymore, clear the ID
      clearCartId();
      return null;
    }

    const data = await response.json();
    return data.cart;
  } catch (error) {
    console.error('Error fetching cart:', error);
    clearCartId();
    return null;
  }
}

/**
 * Get or create cart
 */
export async function getOrCreateCart(): Promise<Cart> {
  let cart = await getCart();
  
  if (!cart) {
    cart = await createCart();
  }

  return cart;
}

/**
 * Add item to cart
 */
export async function addToCart(variantId: string, quantity: number = 1): Promise<Cart> {
  try {
    const cart = await getOrCreateCart();

    const response = await fetch(`${MEDUSA_BACKEND_URL}/store/carts/${cart.id}/line-items`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-publishable-api-key': MEDUSA_PUBLISHABLE_KEY,
      },
      body: JSON.stringify({
        variant_id: variantId,
        quantity,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to add item to cart');
    }

    const data = await response.json();
    return data.cart;
  } catch (error) {
    console.error('Error adding to cart:', error);
    throw error;
  }
}

/**
 * Update cart item quantity
 */
export async function updateCartItem(lineItemId: string, quantity: number): Promise<Cart> {
  const cartId = getCartId();
  
  if (!cartId) {
    throw new Error('No cart found');
  }

  try {
    const response = await fetch(
      `${MEDUSA_BACKEND_URL}/store/carts/${cartId}/line-items/${lineItemId}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-publishable-api-key': MEDUSA_PUBLISHABLE_KEY,
        },
        body: JSON.stringify({
          quantity,
        }),
      }
    );

    if (!response.ok) {
      throw new Error('Failed to update cart item');
    }

    const data = await response.json();
    return data.cart;
  } catch (error) {
    console.error('Error updating cart item:', error);
    throw error;
  }
}

/**
 * Remove item from cart
 */
export async function removeFromCart(lineItemId: string): Promise<Cart> {
  const cartId = getCartId();
  
  if (!cartId) {
    throw new Error('No cart found');
  }

  try {
    const response = await fetch(
      `${MEDUSA_BACKEND_URL}/store/carts/${cartId}/line-items/${lineItemId}`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'x-publishable-api-key': MEDUSA_PUBLISHABLE_KEY,
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to remove item from cart');
    }

    const data = await response.json();
    return data.cart;
  } catch (error) {
    console.error('Error removing from cart:', error);
    throw error;
  }
}

/**
 * Clear entire cart
 */
export async function clearCart(): Promise<void> {
  clearCartId();
}

/**
 * Get cart item count
 */
export function getCartItemCount(cart: Cart | null): number {
  if (!cart || !cart.items) {
    return 0;
  }
  return cart.items.reduce((total, item) => total + item.quantity, 0);
}
