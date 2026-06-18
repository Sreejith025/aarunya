import React, { createContext, useContext, useState, useEffect } from 'react';

const ShopContext = createContext();

export function ShopProvider({ children }) {
    // Cart state: array of { product, quantity, size, color }
    const [cart, setCart] = useState(() => {
        try {
            const saved = localStorage.getItem('aarunya_cart');
            return saved ? JSON.parse(saved) : [];
        } catch (e) {
            console.error("Failed to parse cart from localStorage", e);
            return [];
        }
    });

    // Wishlist state: array of product objects
    const [wishlist, setWishlist] = useState(() => {
        try {
            const saved = localStorage.getItem('aarunya_wishlist');
            return saved ? JSON.parse(saved) : [];
        } catch (e) {
            console.error("Failed to parse wishlist from localStorage", e);
            return [];
        }
    });

    // Toast state
    const [toast, setToast] = useState({ visible: false, message: '', type: 'success' });

    // Sync cart to localStorage
    useEffect(() => {
        localStorage.setItem('aarunya_cart', JSON.stringify(cart));
    }, [cart]);

    // Sync wishlist to localStorage
    useEffect(() => {
        localStorage.setItem('aarunya_wishlist', JSON.stringify(wishlist));
    }, [wishlist]);

    // Show toast message helper
    const showToast = (message, type = 'success') => {
        setToast({ visible: true, message, type });
    };

    // Auto-hide toast
    useEffect(() => {
        if (toast.visible) {
            const timer = setTimeout(() => {
                setToast(prev => ({ ...prev, visible: false }));
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [toast.visible]);

    // Add product to cart
    const addToCart = (product, quantity = 1, size = 'S', color = '') => {
        setCart(prevCart => {
            // Check if product with same id, size, and color already exists
            const existingIndex = prevCart.findIndex(
                item => item.product._id === product._id && item.size === size && item.color === color
            );

            if (existingIndex > -1) {
                // If it exists, update quantity
                const newCart = [...prevCart];
                newCart[existingIndex].quantity += quantity;
                return newCart;
            } else {
                // Otherwise, add new item
                return [...prevCart, { product, quantity, size, color }];
            }
        });
        showToast(`"${product.name}" added to cart!`);
    };

    // Remove product variant from cart
    const removeFromCart = (productId, size = 'S', color = '') => {
        setCart(prevCart => prevCart.filter(
            item => !(item.product._id === productId && item.size === size && item.color === color)
        ));
        showToast("Item removed from cart.", "info");
    };

    // Update quantity for a cart item
    const updateQuantity = (productId, size, color, quantity) => {
        if (quantity <= 0) {
            removeFromCart(productId, size, color);
            return;
        }
        setCart(prevCart => prevCart.map(item => 
            (item.product._id === productId && item.size === size && item.color === color)
                ? { ...item, quantity }
                : item
        ));
    };

    // Toggle product in wishlist
    const toggleWishlist = (product) => {
        let isAdded = false;
        setWishlist(prevWishlist => {
            const exists = prevWishlist.some(item => item._id === product._id);
            if (exists) {
                isAdded = false;
                return prevWishlist.filter(item => item._id !== product._id);
            } else {
                isAdded = true;
                return [...prevWishlist, product];
            }
        });

        // We use a small timeout to show correct text because state update is async
        setTimeout(() => {
            showToast(isAdded ? `"${product.name}" added to wishlist!` : `Removed "${product.name}" from wishlist.`);
        }, 50);
    };

    // Check if product is in wishlist
    const isWishlisted = (productId) => {
        return wishlist.some(item => item._id === productId);
    };

    // Get total items in cart
    const getCartCount = () => {
        return cart.reduce((total, item) => total + item.quantity, 0);
    };

    // Get total items in wishlist
    const getWishlistCount = () => {
        return wishlist.length;
    };

    return (
        <ShopContext.Provider value={{
            cart,
            wishlist,
            addToCart,
            removeFromCart,
            updateQuantity,
            toggleWishlist,
            isWishlisted,
            getCartCount,
            getWishlistCount,
            showToast
        }}>
            {children}
            
            {/* Elegant Premium Toast Notification */}
            {toast.visible && (
                <div className={`shop-toast-notification ${toast.type}`}>
                    <div className="toast-content">
                        <span className="toast-icon">✨</span>
                        <span className="toast-message">{toast.message}</span>
                    </div>
                </div>
            )}
        </ShopContext.Provider>
    );
}

export function useShop() {
    const context = useContext(ShopContext);
    if (!context) {
        throw new Error('useShop must be used within a ShopProvider');
    }
    return context;
}
