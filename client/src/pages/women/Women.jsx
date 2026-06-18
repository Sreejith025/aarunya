import React, { useState, useEffect } from 'react';
import Navbar from '../../components/navbar/Navbar';
import ProductCard from '../../components/products/ProductCard';
import './Women.css';
import { useSearchParams } from 'react-router-dom';
import Footer from '../../components/footer/Footer';

import kurtiImg from "../../assets/images/categories/kurti.jpg";
import topsImg from "../../assets/images/categories/tops.jpg";
import sareesImg from "../../assets/images/categories/sarees.webp";
import skirtsImg from "../../assets/images/categories/skirts.jpg";
import jeansImg from "../../assets/images/categories/jeans.jpg";
import activewearImg from "../../assets/images/categories/activewear.jpg";

const categoriesData = [
  { id: 1, name: "Tops", image: topsImg },
  { id: 2, name: "Sarees", image: sareesImg },
  { id: 3, name: "Jeans", image: jeansImg },
  { id: 4, name: "Skirts", image: skirtsImg },
  { id: 5, name: "Kurti", image: kurtiImg },
  { id: 6, name: "Activewear", image: activewearImg },
];

export default function Women() {
    const [searchParams, setSearchParams] = useSearchParams();
    const categoryQuery = searchParams.get('category');

    const [selectedCategory, setSelectedCategory] = useState(() => {
        if (categoryQuery) {
            const matched = categoriesData.find(cat => cat.name.toLowerCase() === categoryQuery.toLowerCase());
            if (matched) return matched.name;
        }
        return "Sarees";
    });
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    // Sync selectedCategory when category query param changes (e.g. forward/back buttons or navbar links)
    useEffect(() => {
        if (categoryQuery) {
            const matched = categoriesData.find(cat => cat.name.toLowerCase() === categoryQuery.toLowerCase());
            if (matched && matched.name !== selectedCategory) {
                setSelectedCategory(matched.name);
            }
        }
    }, [categoryQuery]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await fetch('http://localhost:5000/api/products');
                const data = await res.json();
                if (data.success) {
                    setProducts(data.products);
                }
            } catch (err) {
                console.error("Failed to fetch products:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    const handleCategoryClick = (categoryName) => {
        setSelectedCategory(categoryName);
        setSearchParams({ category: categoryName.toLowerCase() });
    };

    // Filter products: category is Women, and subCategory matches selectedCategory (case-insensitive)
    const filteredProducts = products.filter(p => 
        p.category === 'Women' && 
        p.subCategory.toLowerCase() === selectedCategory.toLowerCase()
    );

    return (
        <div className="women-page">
            <Navbar />
            
            <div className="women-banner">
                <div className="women-banner-content">
                    <h1>Women's Collection</h1>
                    <p>Discover the latest trends in women's fashion with our curated selection of elegant and stylish clothing</p>
                </div>
            </div>

            <div className="women-categories-section">
                <h2>Shop by Category</h2>
                <div className="women-categories-list">
                    {categoriesData.map(cat => (
                        <div 
                            key={cat.id} 
                            className={`women-category-card ${selectedCategory === cat.name ? 'active' : ''}`}
                            onClick={() => handleCategoryClick(cat.name)}
                        >
                            <div className="women-category-icon">
                                <img src={cat.image} alt={cat.name} />
                            </div>
                            <span>{cat.name}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="women-products-section">
                <h2>Women Products - {selectedCategory}</h2>
                {loading ? (
                    <div className="products-grid loading-state">
                        <p>Loading products...</p>
                    </div>
                ) : filteredProducts.length > 0 ? (
                    <div className="women-products-grid">
                        {filteredProducts.map(product => (
                            <ProductCard key={product._id} product={product} />
                        ))}
                    </div>
                ) : (
                    <div className="products-grid no-products-state">
                        <p>No products found in category "{selectedCategory}". Add some from the Admin panel!</p>
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
}

