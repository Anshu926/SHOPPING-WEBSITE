import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Landing from "./Landing";
import CustomerSignup from "./pages/CustomerSignup";
import CustomerLogin from "./pages/CustomerLogin";
import SellerSignup from "./pages/SellerSignup";
import SellerLogin from "./pages/SellerLogin";
import CustomerDashboard from "./pages/CustomerDashboard";
import SellerDashboard from "./pages/SellerDashboard";
import CreateProduct from "./pages/CreateProduct";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/customer/Cart";
import PlaceOrder from "./pages/customer/PlaceOrder";
import SellerOrders from "./pages/seller/Orders";

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/"                       element={<Landing />} />
        <Route path="/customer/signup"        element={<CustomerSignup />} />
        <Route path="/customer/login"         element={<CustomerLogin />} />
        <Route path="/seller/signup"          element={<SellerSignup />} />
        <Route path="/seller/login"           element={<SellerLogin />} />
        <Route path="/customer/dashboard"     element={<CustomerDashboard />} />
        <Route path="/seller/dashboard"       element={<SellerDashboard />} />
        <Route path="/seller/create-product"  element={<CreateProduct />} />
        <Route path="/seller/orders"          element={<SellerOrders />} />
        <Route path="/customer/cart"          element={<Cart />} />
        <Route path="/customer/place_order"   element={<PlaceOrder />} />
        <Route path="/products/:id"           element={<ProductDetails />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
