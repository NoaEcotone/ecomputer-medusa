import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { CartProvider } from "./contexts/CartContext";
import { QuoteCartProvider } from "./contexts/QuoteCartContext";
import CartDrawer from "./components/CartDrawer";
import QuoteCartDrawer from "./components/QuoteCartDrawer";
import Home from "./pages/Home";
import Laptops from "./pages/Laptops";
import ProductDetail from "./pages/ProductDetail";
import About from "./pages/About";
import Contact from "./pages/Contact";
import NotFound from "@/pages/NotFound";


function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/laptops" component={Laptops} />
      <Route path="/products/:handle" component={ProductDetail} />
      <Route path="/about" component={About} />
      <Route path="/contact" component={Contact} />
      <Route path="/404" component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        // switchable
      >
        <CartProvider>
          <QuoteCartProvider>
            <TooltipProvider>
              <Toaster />
              <Router />
              <CartDrawer />
              <QuoteCartDrawer />
            </TooltipProvider>
          </QuoteCartProvider>
        </CartProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
