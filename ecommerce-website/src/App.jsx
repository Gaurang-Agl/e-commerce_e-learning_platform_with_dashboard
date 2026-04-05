import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import CartDrawer from './components/CartDrawer';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailsPage from './pages/ProductDetailsPage';
import CoursesPage from './pages/CoursesPage';
import CourseDetailsPage from './pages/CourseDetailsPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderSuccessPage from './pages/OrderSuccessPage';
import OrdersPage from './pages/OrdersPage';

export default function App() {
  return (
    <>
      <Navbar />
      <CartDrawer />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/product/:id" element={<ProductDetailsPage />} />
        <Route path="/courses" element={<CoursesPage />} />
        <Route path="/course/:id" element={<CourseDetailsPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/order-success" element={<OrderSuccessPage />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="*" element={
          <div className="page-wrapper" style={{ textAlign: 'center', paddingTop: '6rem' }}>
            <div style={{ fontSize: '5rem', marginBottom: '1rem' }}>🚀</div>
            <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>404 — Page Not Found</h1>
            <p style={{ color: 'var(--text-secondary)' }}>The page you're looking for doesn't exist.</p>
          </div>
        } />
      </Routes>
      <Footer />
    </>
  );
}
