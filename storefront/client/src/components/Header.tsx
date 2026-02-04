import { Link } from "wouter";
import { Laptop, Menu, X, ShoppingBag, FileText } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/contexts/CartContext";
import { useQuoteCart } from "@/contexts/QuoteCartContext";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { itemCount, toggleCart } = useCart();
  const { getTotalItems, openCart } = useQuoteCart();
  const quoteItemCount = getTotalItems();

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="container">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <Laptop className="w-7 h-7" />
            <span className="text-xl font-bold">Ecomputer</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="flex items-center gap-6">
            <nav className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-sm font-medium hover:text-gray-600 transition-colors">
              Home
            </Link>
            <Link href="/laptops" className="text-sm font-medium hover:text-gray-600 transition-colors">
              Laptops
            </Link>
            <Link href="/about" className="text-sm font-medium hover:text-gray-600 transition-colors">
              Over Ons
            </Link>
            <Link href="/contact" className="text-sm font-medium hover:text-gray-600 transition-colors">
              Contact
            </Link>
          </nav>

          {/* Quote Cart Button */}
          <button
            onClick={openCart}
            className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Offerte Aanvraag"
            title="Offerte Aanvraag"
          >
            <FileText className="w-6 h-6" />
            {quoteItemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-green-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {quoteItemCount}
              </span>
            )}
          </button>

          {/* Cart Button (kept for compatibility) */}
          <button
            onClick={toggleCart}
            className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Winkelwagen"
          >
            <ShoppingBag className="w-6 h-6" />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden py-4 border-t border-gray-200">
            <Link
              href="/"
              className="block py-2 text-sm font-medium hover:text-gray-600 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/laptops"
              className="block py-2 text-sm font-medium hover:text-gray-600 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Laptops
            </Link>
            <Link
              href="/about"
              className="block py-2 text-sm font-medium hover:text-gray-600 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Over Ons
            </Link>
            <Link
              href="/contact"
              className="block py-2 text-sm font-medium hover:text-gray-600 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Contact
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}
