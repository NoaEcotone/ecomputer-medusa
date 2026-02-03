import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, Laptop, Shield, Truck } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-gray-50 to-white py-20 md:py-32">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Professionele Laptops voor Zakelijk Gebruik
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Groot assortiment van HP, Dell, Lenovo en meer. Vind de perfecte laptop voor jouw bedrijf.
              </p>
              <Link href="/laptops">
                <Button size="lg" className="gap-2">
                  Bekijk Laptops
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-white">
          <div className="container">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <FeatureCard
                icon={<Laptop className="w-8 h-8" />}
                title="Groot Assortiment"
                description="Ruime keuze uit verschillende merken en specificaties"
              />
              <FeatureCard
                icon={<Shield className="w-8 h-8" />}
                title="Kwaliteitsgarantie"
                description="Alle laptops worden grondig getest en gecontroleerd"
              />
              <FeatureCard
                icon={<Truck className="w-8 h-8" />}
                title="Snelle Levering"
                description="Snel en betrouwbaar geleverd bij jou op kantoor"
              />
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-black text-white">
          <div className="container text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Klaar om te beginnen?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Ontdek ons volledige assortiment professionele laptops
            </p>
            <Link href="/laptops">
              <Button size="lg" variant="outline" className="bg-white text-black hover:bg-gray-100 gap-2">
                Bekijk Alle Laptops
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="text-center p-6">
      <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}
