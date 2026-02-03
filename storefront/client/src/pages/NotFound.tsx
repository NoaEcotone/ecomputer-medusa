import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 flex items-center justify-center">
        <div className="text-center px-4">
          <h1 className="text-6xl font-bold mb-4">404</h1>
          <h2 className="text-2xl font-semibold mb-4">Pagina niet gevonden</h2>
          <p className="text-gray-600 mb-8">
            De pagina die je zoekt bestaat niet of is verplaatst.
          </p>
          <Link href="/">
            <Button className="gap-2">
              <Home className="w-4 h-4" />
              Terug naar Home
            </Button>
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
