import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from 'react-router-dom';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import App from './App.jsx';
import Login from './login.jsx';
import Signup from './signup.jsx';
import Profile from './profile.jsx';
import Shop from './shop.jsx';
import Cart from './cart.jsx';
import Orders from './orders.jsx';
import Item from './item.jsx';
import Delivery from './delivery.jsx';
import Sell from './sell.jsx';
import ProtectedRoute from './ProtectedRoute.jsx';
import Error from './error.jsx';
import Support from './support.jsx';

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<App />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/profile" element={<Profile />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/item/:name/:seller" element={<Item />} />
        <Route path="/delivery" element={<Delivery />} />
        <Route path="/sell" element={<Sell />} />
        <Route path="/support" element={<Support />} />
        <Route path="*" element={<Error />} />
      </Route>
    </>
  )
);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ToastContainer />
    <RouterProvider router={router} />
  </StrictMode>
);
