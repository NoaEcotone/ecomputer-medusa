import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Laptop, Leaf, Award, Users } from 'lucide-react';

export default function About() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 bg-gray-50">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-gray-900 to-gray-700 text-white">
          <div className="container py-16 md:py-24">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Over Ecomputer</h1>
            <p className="text-xl text-gray-200 max-w-3xl">
              Wij maken hoogwaardige refurbished laptops toegankelijk voor iedereen door middel van flexibele huuroplossingen.
            </p>
          </div>
        </div>

        {/* Mission Section */}
        <div className="container py-16">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-6 text-center">Onze Missie</h2>
            <p className="text-lg text-gray-700 leading-relaxed mb-8">
              Bij Ecomputer geloven we dat iedereen toegang moet hebben tot kwaliteitsapparatuur, zonder de hoge aanschafkosten. 
              Door refurbished laptops aan te bieden via een flexibel huursysteem, maken we professionele technologie betaalbaar 
              en duurzaam. Onze laptops zijn zorgvuldig geselecteerd, getest en opgeknapt om optimale prestaties te garanderen.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              We richten ons op zakelijke gebruikers, studenten en particulieren die op zoek zijn naar betrouwbare laptops 
              zonder langetermijnverplichtingen. Met onze huuroplossing betaal je alleen voor wat je nodig hebt, wanneer je het nodig hebt.
            </p>
          </div>
        </div>

        {/* Values Section */}
        <div className="bg-white py-16">
          <div className="container">
            <h2 className="text-3xl font-bold mb-12 text-center">Onze Waarden</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Quality */}
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                  <Award className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Kwaliteit</h3>
                <p className="text-gray-600">
                  Alle laptops worden grondig getest en opgeknapt volgens de hoogste standaarden.
                </p>
              </div>

              {/* Sustainability */}
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                  <Leaf className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Duurzaamheid</h3>
                <p className="text-gray-600">
                  Door refurbished apparaten te gebruiken, verlengen we de levensduur en verminderen we e-waste.
                </p>
              </div>

              {/* Flexibility */}
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4">
                  <Laptop className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Flexibiliteit</h3>
                <p className="text-gray-600">
                  Huur een laptop voor de periode die jij nodig hebt, zonder langetermijnverplichtingen.
                </p>
              </div>

              {/* Service */}
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-4">
                  <Users className="w-8 h-8 text-orange-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Service</h3>
                <p className="text-gray-600">
                  Persoonlijke ondersteuning en snelle levering voor een zorgeloze ervaring.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Why Refurbished Section */}
        <div className="container py-16">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-6 text-center">Waarom Refurbished?</h2>
            <div className="space-y-6">
              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <h3 className="text-xl font-semibold mb-3">💰 Kostenbesparend</h3>
                <p className="text-gray-700">
                  Refurbished laptops zijn tot 70% goedkoper dan nieuwe modellen, zonder in te leveren op prestaties.
                </p>
              </div>

              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <h3 className="text-xl font-semibold mb-3">🌍 Milieuvriendelijk</h3>
                <p className="text-gray-700">
                  Door een refurbished laptop te kiezen, help je e-waste te verminderen en draag je bij aan een circulaire economie.
                </p>
              </div>

              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <h3 className="text-xl font-semibold mb-3">✅ Getest & Gecertificeerd</h3>
                <p className="text-gray-700">
                  Onze laptops doorlopen een streng testproces en worden geleverd met garantie voor jouw gemoedsrust.
                </p>
              </div>

              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <h3 className="text-xl font-semibold mb-3">🚀 Direct Beschikbaar</h3>
                <p className="text-gray-700">
                  Geen lange levertijden zoals bij nieuwe modellen. Onze laptops zijn direct leverbaar.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-16">
          <div className="container text-center">
            <h2 className="text-3xl font-bold mb-4">Klaar om te starten?</h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Ontdek ons assortiment hoogwaardige refurbished laptops en vind de perfecte match voor jouw behoeften.
            </p>
            <a
              href="/laptops"
              className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Bekijk Laptops
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
