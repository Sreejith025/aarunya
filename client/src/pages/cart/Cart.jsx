import React from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import Navbar from '../../components/navbar/Navbar';
import Footer from '../../components/footer/Footer';
import { API_BASE_URL } from '../../config';
import './Cart.css';

export default function Cart() {
    const { cart, updateQuantity, removeFromCart, getCartCount, showToast } = useShop();

    // Helper to get full image URL
    const getFullImageUrl = (img) => {
        if (!img) return 'https://via.placeholder.com/150?text=No+Image';
        return img.startsWith('/uploads') ? `${API_BASE_URL}${img}` : img;
    };

    // Calculate subtotal
    const subtotal = cart.reduce((total, item) => {
        const itemPrice = item.product.offerPrice || item.product.price || 0;
        return total + itemPrice * item.quantity;
    }, 0);

    const shipping = 0; // Free Shipping
    const total = subtotal + shipping;

    const handleCheckout = () => {
        showToast("Order placed successfully! Thank you for shopping with Aarunya Luxe.", "success");
    };

    return (
        <div className="cart-page">
            <Navbar />
            
            <div className="cart-container">
                {/* Breadcrumbs */}
                <div className="breadcrumbs">
                    <Link to="/">Home</Link>
                    <span className="separator">/</span>
                    <span className="current">Shopping Bag</span>
                </div>

                <h1 className="cart-page-title">Shopping Bag ({getCartCount()} items)</h1>

                {cart.length === 0 ? (
                    <div className="empty-cart-state">
                        <div className="empty-icon-container">
                            <ShoppingBag size={48} className="empty-bag-icon" />
                        </div>
                        <h2>Your bag is empty</h2>
                        <p>Looks like you haven't added anything to your bag yet. Let's find some beautiful styles for you!</p>
                        <Link to="/women" className="continue-shopping-btn">
                            Continue Shopping
                            <ArrowRight size={16} />
                        </Link>
                    </div>
                ) : (
                    <div className="cart-content-grid">
                        {/* Cart Items List */}
                        <div className="cart-items-column">
                            {cart.map((item, index) => {
                                const { product, quantity, size, color } = item;
                                const itemPrice = product.offerPrice || product.price || 0;
                                const originalPrice = product.price || 0;
                                const hasDiscount = originalPrice > itemPrice;

                                return (
                                    <div key={`${product._id}-${size}-${color}-${index}`} className="cart-item-card">
                                        <div className="item-image-wrapper">
                                            <img 
                                                src={getFullImageUrl(product.images?.[0])} 
                                                alt={product.name} 
                                                className="item-image"
                                            />
                                        </div>

                                        <div className="item-details-wrapper">
                                            <div className="item-info-header">
                                                <div>
                                                    <span className="item-subcategory">{product.subCategory}</span>
                                                    <Link to={`/product/${product._id}`} className="item-title-link">
                                                        <h3 className="item-name">{product.name}</h3>
                                                    </Link>
                                                </div>
                                                <button 
                                                    className="item-remove-btn" 
                                                    onClick={() => removeFromCart(product._id, size, color)}
                                                    aria-label="Remove item"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>

                                            {/* Attributes: Size and Color */}
                                            <div className="item-attributes">
                                                {size && (
                                                    <span className="attr-pill">
                                                        <strong>Size:</strong> {size}
                                                    </span>
                                                )}
                                                {color && (
                                                    <span className="attr-pill">
                                                        <strong>Color:</strong> {color}
                                                    </span>
                                                )}
                                            </div>

                                            {/* Quantity and Price row */}
                                            <div className="item-footer-row">
                                                <div className="qty-controls">
                                                    <button 
                                                        className="qty-btn" 
                                                        onClick={() => updateQuantity(product._id, size, color, quantity - 1)}
                                                        disabled={quantity <= 1}
                                                    >
                                                        <Minus size={12} />
                                                    </button>
                                                    <span className="qty-number">{quantity}</span>
                                                    <button 
                                                        className="qty-btn" 
                                                        onClick={() => updateQuantity(product._id, size, color, quantity + 1)}
                                                    >
                                                        <Plus size={12} />
                                                    </button>
                                                </div>

                                                <div className="item-price-info">
                                                    {hasDiscount && (
                                                        <span className="item-original-price">₹{originalPrice * quantity}</span>
                                                    )}
                                                    <span className="item-total-price">₹{itemPrice * quantity}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Order Summary Card */}
                        <div className="cart-summary-column">
                            <div className="summary-card">
                                <h3 className="summary-title">Order Summary</h3>
                                
                                <div className="summary-row">
                                    <span>Bag Subtotal</span>
                                    <span>₹{subtotal}</span>
                                </div>
                                <div className="summary-row">
                                    <span>Shipping & Handling</span>
                                    <span className="free-shipping">FREE</span>
                                </div>
                                <div className="summary-row tax-row">
                                    <span>Estimated GST (Included)</span>
                                    <span>₹{Math.round(subtotal * 0.05)}</span>
                                </div>

                                <hr className="summary-divider" />

                                <div className="summary-row total-row">
                                    <span>Total</span>
                                    <span>₹{total}</span>
                                </div>

                                <button className="checkout-action-btn" onClick={handleCheckout}>
                                    Proceed to Checkout
                                    <ArrowRight size={18} />
                                </button>

                                <div className="secure-checkout-tag">
                                    🔒 Secure checkout with Aarunya SafePay
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
}
