import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Search, ArrowRight } from 'lucide-react';
import Navbar from '../../components/navbar/Navbar';
import ProductCard from '../../components/products/ProductCard';
import Footer from '../../components/footer/Footer';
import { API_BASE_URL } from '../../config';
import './SearchPage.css';

export default function SearchPage() {
    const location = useLocation();
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    // Parse the query parameter 'q' from the URL
    const searchParams = new URLSearchParams(location.search);
    const query = searchParams.get('q') || '';

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const res = await fetch(`${API_BASE_URL}/api/products`);
                const data = await res.json();
                if (data.success) {
                    setProducts(data.products);
                }
            } catch (err) {
                console.error("Failed to fetch products for search page:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    // Filter products based on search query
    useEffect(() => {
        if (!query.trim()) {
            setFilteredProducts([]);
            return;
        }

        const lowerQuery = query.toLowerCase();
        const filtered = products.filter(p => 
            p.name.toLowerCase().includes(lowerQuery) ||
            p.category.toLowerCase().includes(lowerQuery) ||
            p.subCategory.toLowerCase().includes(lowerQuery)
        );
        setFilteredProducts(filtered);
    }, [products, query]);

    return (
        <div className="search-results-page">
            <Navbar />
            
            <div className="search-results-container">
                {/* Breadcrumbs */}
                <div className="breadcrumbs">
                    <Link to="/">Home</Link>
                    <span className="separator">/</span>
                    <span className="current">Search Results</span>
                </div>

                <div className="search-results-header">
                    <h1 className="search-results-title">
                        Search Results for "{query}"
                    </h1>
                    {!loading && (
                        <span className="search-results-count">
                            ({filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'} found)
                        </span>
                    )}
                </div>

                {loading ? (
                    <div className="search-loading-state">
                        <div className="spinner"></div>
                        <p>Searching our catalog...</p>
                    </div>
                ) : filteredProducts.length > 0 ? (
                    <div className="search-grid-wrapper">
                        <div className="search-products-grid">
                            {filteredProducts.map(product => (
                                <ProductCard key={product._id} product={product} />
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="empty-search-state">
                        <div className="empty-icon-container">
                            <Search size={44} className="empty-search-icon" />
                        </div>
                        <h2>No results found</h2>
                        <p>We couldn't find any products matching "{query}". Double check your spelling, or try searching for a category like "kurti", "saree", "tops", or "jeans".</p>
                        <Link to="/women" className="browse-btn">
                            Browse Women's Collection
                            <ArrowRight size={16} />
                        </Link>
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
}
