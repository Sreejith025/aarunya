import React from 'react';
import { Heart, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useShop } from '../../context/ShopContext';
import './ProductCard.css';

export default function ProductCard({ product }) {
    const { _id, name, price, offerPrice, subCategory, images, colors } = product;
    const { toggleWishlist, isWishlisted, addToCart } = useShop();

    // Calculate discount percentage
    const discount = (price > 0 && offerPrice > 0 && price > offerPrice)
        ? Math.round(((price - offerPrice) / price) * 100)
        : 0;

    // Construct image URL
    const imageUrl = images && images.length > 0
        ? (images[0].startsWith('/uploads') ? `http://localhost:5000${images[0]}` : images[0])
        : 'https://via.placeholder.com/300x400?text=No+Image';

    const wish = isWishlisted(_id);

    const handleWishlistClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleWishlist(product);
    };

    const handleAddToCartClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const defaultColor = colors && colors.length > 0 ? colors[0] : '';
        addToCart(product, 1, 'S', defaultColor);
    };

    return (
        <div className="product-card">
            <div className="card-top-badges">
                {discount > 0 && (
                    <span className="discount-badge">-{discount}%</span>
                )}
                <button 
                    className={`wishlist-btn ${wish ? 'active' : ''}`} 
                    onClick={handleWishlistClick}
                    aria-label={wish ? "Remove from wishlist" : "Add to wishlist"}
                >
                    <Heart 
                        size={18} 
                        fill={wish ? "#ff3b6a" : "none"} 
                        color={wish ? "#ff3b6a" : "#7e42ac"} 
                        className="wishlist-icon" 
                    />
                </button>
            </div>
            
            <Link to={`/product/${_id}`} className="product-card-link">
                <div className="product-image-container">
                    <img src={imageUrl} alt={name} className="product-image" />
                </div>
                <div className="product-card-body">
                    <span className="product-card-subcategory">{subCategory}</span>
                    <p className="product-card-title" title={name}>{name}</p>
                    <div className="product-card-price-row">
                        <span className="offer-price">₹{offerPrice}</span>
                        {price > offerPrice && (
                            <span className="original-price">₹{price}</span>
                        )}
                    </div>
                </div>
            </Link>

            <button className="add-to-cart-button" onClick={handleAddToCartClick}>
                <ShoppingBag size={16} />
                <span>Add to Cart</span>
            </button>
        </div>
    );
}


