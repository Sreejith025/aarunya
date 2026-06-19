import { useEffect, useState } from 'react'
import './hero.css'
import heroImg from '../../assets/hero-bg.png'
import Categories from '../categories/Categories'
import ProductCard from '../products/ProductCard'

export default function hero() {
    const [popularProducts, setPopularProducts] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await fetch('http://localhost:5000/api/products')
                const data = await res.json()
                if (data.success) {
                    const popular = data.products.filter(
                        p => p.subCategory === 'Popular Products'
                    )
                    setPopularProducts(popular)
                }
            } catch (err) {
                console.error("Failed to fetch products:", err)
            } finally {
                setLoading(false)
            }
        }
        fetchProducts()
    }, [])

    return (
        <section className="hero">
            <div className="hero-container">
                <img src={heroImg} alt="Winter Sale" className="hero-bg-img" />
                <div className="hero-content">
                    <h2 className="hero-brand">Arunya luxe</h2>
                    <h1 className="hero-title">WINTER SALE</h1>
                    <p className="hero-subtitle">Warm styles, cool prices</p>
                    <button className="hero-btn">Shop Now</button>
                </div>
                <div className="hero-dots">
                    <span className="dot"></span>
                    <span className="dot"></span>
                    <span className="dot"></span>
                    <span className="dot active"></span>
                </div>
            </div>

            <Categories />

            <div className="popular-products-header">
                <span className="squiggle">〰</span>
                <h2>Popular Products</h2>
                <span className="squiggle">〰</span>
            </div>

            {loading ? (
                <div className="loading-products">Loading products...</div>
            ) : popularProducts.length > 0 ? (
                <div className="popular-products-grid">
                    {popularProducts.map(product => (
                        <ProductCard key={product._id} product={product} />
                    ))}
                </div>
            ) : (
                <div className="no-products">
                    No popular products found. Add some from the Admin panel!
                </div>
            )}
        </section>
    )
}
