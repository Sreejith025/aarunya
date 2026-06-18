import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ArrowRight } from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import Navbar from '../../components/navbar/Navbar';
import ProductCard from '../../components/products/ProductCard';
import Footer from '../../components/footer/Footer';
import './Wishlist.css';

export default function Wishlist() {
    const { wishlist } = useShop();

    return (
        <div className="wishlist-page">
            <Navbar />
            
            <div className="wishlist-container">
                {/* Breadcrumbs */}
                <div className="breadcrumbs">
                    <Link to="/">Home</Link>
                    <span className="separator">/</span>
                    <span className="current">Liked Products</span>
                </div>

                <h1 className="wishlist-page-title">Liked Products</h1>

                {wishlist.length === 0 ? (
                    <div className="empty-wishlist-state">
                        <div className="empty-icon-container">
                            <Heart size={44} className="empty-heart-icon" />
                        </div>
                        <h2>Your list is empty</h2>
                        <p>Save items you like here so you can easily find them later or add them to your shopping bag!</p>
                        <Link to="/women" className="browse-btn">
                            Browse Collection
                            <ArrowRight size={16} />
                        </Link>
                    </div>
                ) : (
                    <div className="wishlist-grid-wrapper">
                        <div className="wishlist-products-grid">
                            {wishlist.map(product => (
                                <ProductCard key={product._id} product={product} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
}
