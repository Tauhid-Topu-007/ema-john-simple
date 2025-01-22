import "./App.css";
import React, { createContext, useState } from "react";
import Header from "./components/Header/Header";
import Shop from "./components/Shop/Shop";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";

import Review from "./components/Review/Review";
import Inventory from "./components/Inventory/Inventory";
import NotFound from "./components/NotFound/NotFound";
import ProductDetail from "./components/ProductDetail/ProductDetail";
import Login from "./components/Login/Login";
import Shipment from "./components/Shipment/Shipment";

export const UserContext = createContext();

function PrivateRoute({ isAuthenticated, children }) {
  return isAuthenticated ? children : <Navigate to="/login" />;
}

function App(props) {
  const [loggedInUser, setLoggedInUser] = useState({});
  const isAuthenticated =false; // Replace with actual authentication logic

  return (
    <UserContext.Provider value={[loggedInUser, setLoggedInUser]}>
      <Header />
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/review" element={<Review />} />
          {/* <Route path="/manage" element={<Inventory />} /> */}
          <Route
            path="/manage"
            element={
              <PrivateRoute isAuthenticated={isAuthenticated}>
                <Shipment />
              </PrivateRoute>
            }
          />
          <Route path="/" element={<Shop />} />
          <Route
            path="/product/:productKey"
            element={<ProductDetail />}
          />
          <Route
            path="/shipment"
            element={
              <PrivateRoute isAuthenticated={isAuthenticated}>
                <Shipment />
              </PrivateRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </UserContext.Provider>
  );
}

export default App;
