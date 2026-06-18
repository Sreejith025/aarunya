import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
    Heart, Star, Minus, Plus, ChevronDown, ChevronUp, 
    Truck, RotateCcw, ShieldCheck, ShoppingCart 
} from 'lucide-react';
import Navbar from '../../components/navbar/Navbar';
import Footer from '../../components/footer/Footer';
import { useShop } from '../../context/ShopContext';
import './ProductDetails.css';

export default function ProductDetails() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedImage, setSelectedImage] = useState('');
    const [selectedColor, setSelectedColor] = useState('');
    const [selectedSize, setSelectedSize] = useState('S');
    const [quantity, setQuantity] = useState(1);
    const { isWishlisted, toggleWishlist, addToCart, showToast } = useShop();
    const [accordions, setAccordions] = useState({
        details: true,
        shipping: false,
        reviews: false
    });

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await fetch(`http://localhost:5000/api/products/${id}`);
                const data = await res.json();
                if (data.success) {
                    setProduct(data.product);
                    if (data.product.images && data.product.images.length > 0) {
                        setSelectedImage(data.product.images[0]);
                    }
                    if (data.product.colors && data.product.colors.length > 0) {
                        setSelectedColor(data.product.colors[0]);
                    }
                } else {
                    setError(data.message || 'Product not found');
                }
            } catch (err) {
                console.error("Error fetching product details:", err);
                setError('Failed to connect to the server');
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    const toggleAccordion = (section) => {
        setAccordions(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    const renderStars = (rating) => {
        const stars = [];
        const floor = Math.floor(rating);
        for (let i = 1; i <= 5; i++) {
            if (i <= floor) {
                stars.push(<Star key={i} size={16} fill="#ffb800" color="#ffb800" />);
            } else if (i === floor + 1 && rating % 1 !== 0) {
                stars.push(
                    <div key={i} className="half-star-container">
                        <Star size={16} color="#e2e8f0" />
                        <div className="half-star-overlay">
                            <Star size={16} fill="#ffb800" color="#ffb800" />
                        </div>
                    </div>
                );
            } else {
                stars.push(<Star key={i} size={16} color="#cbd5e1" />);
            }
        }
        return stars;
    };

    if (loading) {
        return (
            <div className="product-details-page">
                <Navbar />
                <div className="details-loading">
                    <div className="spinner"></div>
                    <p>Loading product details...</p>
                </div>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="product-details-page">
                <Navbar />
                <div className="details-error">
                    <h2>Oops!</h2>
                    <p>{error || 'Product details could not be loaded.'}</p>
                    <Link to="/" className="back-home-btn">Back to Home</Link>
                </div>
            </div>
        );
    }

    const { name, description, price, offerPrice, category, subCategory, images, colors, stock } = product;

    // Construct image URL utility
    const getFullImageUrl = (img) => {
        if (!img) return '';
        return img.startsWith('/uploads') ? `http://localhost:5000${img}` : img;
    };

    const discountPercentage = (price > 0 && offerPrice > 0 && price > offerPrice)
        ? Math.round(((price - offerPrice) / price) * 100)
        : 0;

    return (
        <div className="product-details-page">
            <Navbar />
            
            <div className="details-container">
                {/* Breadcrumbs */}
                <div className="breadcrumbs">
                    <Link to="/">Home</Link>
                    <span className="separator">/</span>
                    <Link to={category === 'Women' ? '/women' : '/'}>{category}</Link>
                    <span className="separator">/</span>
                    <span className="current">{subCategory}</span>
                </div>

                <div className="product-details-grid">
                    {/* Left Column: Gallery */}
                    <div className="gallery-column">
                        <div className="main-image-container">
                            <img src={getFullImageUrl(selectedImage)} alt={name} className="main-product-image" />
                            {discountPercentage > 0 && (
                                <span className="detail-discount-badge">-{discountPercentage}% OFF</span>
                            )}
                            <button 
                                className={`detail-wishlist-btn ${isWishlisted(product._id) ? 'active' : ''}`}
                                onClick={() => toggleWishlist(product)}
                                aria-label={isWishlisted(product._id) ? "Remove from wishlist" : "Add to wishlist"}
                            >
                                <Heart 
                                    size={20} 
                                    fill={isWishlisted(product._id) ? "#ff3b6a" : "none"} 
                                    color={isWishlisted(product._id) ? "#ff3b6a" : "#7e42ac"} 
                                />
                            </button>
                        </div>

                        {images && images.length > 0 && (
                            <div className="thumbnails-wrapper">
                                <div className="thumbnails-list">
                                    {images.map((img, idx) => (
                                        <button
                                            key={idx}
                                            className={`thumbnail-btn ${selectedImage === img ? 'active' : ''}`}
                                            onClick={() => setSelectedImage(img)}
                                        >
                                            <img src={getFullImageUrl(img)} alt={`${name}-thumb-${idx}`} />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Column: Info details */}
                    <div className="info-column">
                        <span className="product-info-category">{subCategory}</span>
                        <h1 className="product-info-title">{name}</h1>

                        {/* Rating Row */}
                        <div className="rating-row">
                            <div className="stars-list">
                                {renderStars(4.5)}
                            </div>
                            <span className="rating-value">4.5</span>
                            <span className="rating-count">(120 reviews)</span>
                            {stock > 0 ? (
                                <span className="stock-status in-stock">In Stock</span>
                            ) : (
                                <span className="stock-status out-of-stock">Out of Stock</span>
                            )}
                        </div>

                        {/* Price Row */}
                        <div className="price-row">
                            <span className="detail-offer-price">₹{offerPrice}</span>
                            {price > offerPrice && (
                                <>
                                    <span className="detail-original-price">₹{price}</span>
                                    <span className="detail-discount-text">{discountPercentage}% OFF</span>
                                </>
                            )}
                        </div>

                        <p className="product-info-description">{description}</p>
                        
                        <hr className="divider" />

                        {/* Colours Selection */}
                        {colors && colors.length > 0 && (
                            <div className="selection-group">
                                <h3 className="selection-title">Colours available</h3>
                                <div className="colors-pills-list">
                                    {colors.map((color, idx) => (
                                        <button
                                            key={idx}
                                            className={`color-pill-btn ${selectedColor === color ? 'active' : ''}`}
                                            onClick={() => setSelectedColor(color)}
                                        >
                                            {color}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Sizes Selection */}
                        <div className="selection-group">
                            <h3 className="selection-title">Sizes available</h3>
                            <div className="sizes-pills-list">
                                {['S', 'M', 'L', 'XL', 'XXL'].map((size) => (
                                    <button
                                        key={size}
                                        className={`size-pill-btn ${selectedSize === size ? 'active' : ''}`}
                                        onClick={() => setSelectedSize(size)}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Quantity Selector */}
                        <div className="selection-group qty-group">
                            <h3 className="selection-title">Quantity</h3>
                            <div className="qty-selector">
                                <button 
                                    className="qty-btn" 
                                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                                    disabled={quantity <= 1}
                                >
                                    <Minus size={14} />
                                </button>
                                <span className="qty-value">{quantity}</span>
                                <button 
                                    className="qty-btn" 
                                    onClick={() => setQuantity(q => q + 1)}
                                >
                                    <Plus size={14} />
                                </button>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="actions-row">
                            <button 
                                className="add-to-cart-action-btn"
                                onClick={() => addToCart(product, quantity, selectedSize, selectedColor)}
                            >
                                <ShoppingCart size={18} />
                                Add to Cart
                            </button>
                            <button 
                                className="buy-now-action-btn"
                                onClick={() => {
                                    addToCart(product, quantity, selectedSize, selectedColor);
                                    showToast("Proceeding to checkout...", "info");
                                }}
                            >
                                Buy now
                            </button>
                        </div>

                        {/* Trust Badges */}
                        <div className="trust-badges-grid">
                            <div className="trust-badge-item">
                                <Truck size={20} />
                                <span>Fast Delivery</span>
                            </div>
                            <div className="trust-badge-item">
                                <RotateCcw size={20} />
                                <span>Easy Returns</span>
                            </div>
                            <div className="trust-badge-item">
                                <ShieldCheck size={20} />
                                <span>100% Original</span>
                            </div>
                        </div>

                        {/* Info Accordions */}
                        <div className="accordions-container">
                            {/* Details Accordion */}
                            <div className="accordion-item">
                                <button className="accordion-header" onClick={() => toggleAccordion('details')}>
                                    <span>Product Details</span>
                                    {accordions.details ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                </button>
                                {accordions.details && (
                                    <div className="accordion-content">
                                        <p>Crafted with premium materials and high attention to detail, this item features authentic designs suitable for everyday wear or special occasions.</p>
                                        <ul>
                                            <li>Material: 100% Premium Cotton Blend</li>
                                            <li>Fit Type: Regular Fit</li>
                                            <li>Care Instructions: Hand Wash Recommended</li>
                                            <li>Country of Origin: India</li>
                                        </ul>
                                    </div>
                                )}
                            </div>

                            {/* Shipping Accordion */}
                            <div className="accordion-item">
                                <button className="accordion-header" onClick={() => toggleAccordion('shipping')}>
                                    <span>Shipping & Delivery</span>
                                    {accordions.shipping ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                </button>
                                {accordions.shipping && (
                                    <div className="accordion-content">
                                        <p>We provide free standard shipping on all orders. Expected delivery times:</p>
                                        <ul>
                                            <li>Metro Cities: 3 - 5 business days</li>
                                            <li>Other Regions: 5 - 7 business days</li>
                                            <li>Easy 14-day replacement/return window.</li>
                                        </ul>
                                    </div>
                                )}
                            </div>

                            {/* Reviews Accordion */}
                            <div className="accordion-item">
                                <button className="accordion-header" onClick={() => toggleAccordion('reviews')}>
                                    <span>Customer Reviews (120)</span>
                                    {accordions.reviews ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                </button>
                                {accordions.reviews && (
                                    <div className="accordion-content">
                                        <div className="reviews-summary">
                                            <div className="summary-left">
                                                <h2>4.5</h2>
                                                <div className="stars-list">{renderStars(4.5)}</div>
                                                <p>Based on 120 ratings</p>
                                            </div>
                                            <div className="summary-right">
                                                <div className="rating-bar-row">
                                                    <span>5 star</span>
                                                    <div className="bar-bg"><div className="bar-fill" style={{width: '75%'}}></div></div>
                                                    <span>75%</span>
                                                </div>
                                                <div className="rating-bar-row">
                                                    <span>4 star</span>
                                                    <div className="bar-bg"><div className="bar-fill" style={{width: '15%'}}></div></div>
                                                    <span>15%</span>
                                                </div>
                                                <div className="rating-bar-row">
                                                    <span>3 star</span>
                                                    <div className="bar-bg"><div className="bar-fill" style={{width: '6%'}}></div></div>
                                                    <span>6%</span>
                                                </div>
                                                <div className="rating-bar-row">
                                                    <span>2 star</span>
                                                    <div className="bar-bg"><div className="bar-fill" style={{width: '3%'}}></div></div>
                                                    <span>3%</span>
                                                </div>
                                                <div className="rating-bar-row">
                                                    <span>1 star</span>
                                                    <div className="bar-bg"><div className="bar-fill" style={{width: '1%'}}></div></div>
                                                    <span>1%</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}
