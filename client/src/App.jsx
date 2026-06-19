import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/home/home'
import Addproduct from './pages/admin/Addproduct'
import Products from "./components/products/Products";
import Women from "./pages/women/Women";
import ProductDetails from "./pages/product/ProductDetails";
import Cart from './pages/cart/Cart';
import Wishlist from './pages/wishlist/Wishlist';
import SearchPage from './pages/search/SearchPage';
import FAQ from './pages/faq/FAQ';
import Contact from './pages/contact/Contact';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<Addproduct />} />
        <Route path="/women" element={<Women />} />
        <Route path="/products" element={<Products />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App