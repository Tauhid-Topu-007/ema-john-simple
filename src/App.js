import "./App.css";
import React from "react";
import Header from "./components/Header/Header";
import Shop from "./components/Shop/Shop";
import {
  BrowserRouter as Router,
  Route,
  Routes,
} from "react-router-dom";

import Review from "./components/Review/Review";
import Inventory from "./components/Inventory/Inventory";
import NotFound from "./components/NotFound/NotFound";
import ProductDetail from "./components/ProductDetail/ProductDetail";

function App() {
  return (
    <div>
      <Header />
      <Router>
        <Routes>
          <Route path="/shop" element={<Shop/>} />
          <Route path="/review" element={<Review/>} />
          <Route path="/manage" element={<Inventory/>} />
          <Route path="/" element={<Shop/>} />
          <Route path="/product/:productKey" element={<ProductDetail></ProductDetail>} />
          <Route path="*" element={<NotFound/>} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
