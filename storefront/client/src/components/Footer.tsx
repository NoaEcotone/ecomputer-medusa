export default function Footer() {
  return (
    <footer className="bg-black text-white mt-auto">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="font-bold text-lg mb-4">Ecomputer</h3>
            <p className="text-gray-400 text-sm">
              Professionele laptops voor zakelijk gebruik. Groot assortiment van HP, Dell, Lenovo en meer.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-lg mb-4">Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/" className="text-gray-400 hover:text-white transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a href="/laptops" className="text-gray-400 hover:text-white transition-colors">
                  Laptops
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-bold text-lg mb-4">Contact</h3>
            <p className="text-gray-400 text-sm">
              Voor vragen of meer informatie, neem contact met ons op.
            </p>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} Ecomputer. Alle rechten voorbehouden.</p>
        </div>
      </div>
    </footer>
  );
}
