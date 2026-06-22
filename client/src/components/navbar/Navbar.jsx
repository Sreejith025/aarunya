import React, { useState, useEffect } from 'react'
import './Navbar.css'
import { Search, Heart, ShoppingBag, User } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useShop } from '../../context/ShopContext'
import { API_BASE_URL } from '../../config'
import {
    SignedIn,
    SignedOut,
    SignInButton,
    UserButton,
    useUser
} from '@clerk/clerk-react'

export default function Navbar() {
    const { user } = useUser()
    const isAdmin = user?.primaryEmailAddress?.emailAddress === 'abisri024@gmail.com'
    const { getCartCount, getWishlistCount } = useShop()
    const navigate = useNavigate()

    // Search states
    const [searchQuery, setSearchQuery] = useState('')
    const [allProducts, setAllProducts] = useState([])
    const [filteredResults, setFilteredResults] = useState([])
    const [showDropdown, setShowDropdown] = useState(false)

    // Fetch all products on focus (prevent pre-fetching unless user interacts)
    const handleSearchFocus = async () => {
        setShowDropdown(true)
        if (allProducts.length === 0) {
            try {
                const res = await fetch(`${API_BASE_URL}/api/products`)
                const data = await res.json()
                if (data.success) {
                    setAllProducts(data.products)
                }
            } catch (err) {
                console.error("Failed to fetch products for search:", err)
            }
        }
    }

    // Handle typing inside search box
    const handleSearchChange = (e) => {
        const query = e.target.value
        setSearchQuery(query)
        
        if (query.trim() === '') {
            setFilteredResults([])
            return
        }

        const lowerQuery = query.toLowerCase()
        const filtered = allProducts.filter(p => 
            p.name.toLowerCase().includes(lowerQuery) ||
            p.category.toLowerCase().includes(lowerQuery) ||
            p.subCategory.toLowerCase().includes(lowerQuery)
        )
        setFilteredResults(filtered.slice(0, 6)) // Limit live results to 6 items
    }

    // Handle enter or search click
    const handleSearchSubmit = (e) => {
        e.preventDefault()
        if (searchQuery.trim() !== '') {
            navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
            setShowDropdown(false)
        }
    }

    // Close dropdown on item click
    const handleItemClick = () => {
        setSearchQuery('')
        setShowDropdown(false)
    }

    // Close dropdown on blur with delay to allow clicks to register
    const handleSearchBlur = () => {
        setTimeout(() => {
            setShowDropdown(false)
        }, 200)
    }

    return (
        <header className="navbar">
            <div className="logo">
                <Link to="/" style={{textDecoration: 'none', color: 'inherit'}}>Aarunya luxe</Link>
            </div>

            <nav className="nav-links">
                <Link to="/">Home</Link>
                <Link to="/women">Women</Link>
                <Link to="/faq">FAQ</Link>
                <Link to="/contact">Contact</Link>
                {isAdmin && (
                    <Link to="/admin" className="admin-link-badge">Admin Dashboard</Link>
                )}
            </nav>

            <div className="nav-right">
                <form className="search-box-container" onSubmit={handleSearchSubmit}>
                    <div className="search-box">
                        <input
                            type="text"
                            placeholder="Search by name, category, or I..."
                            value={searchQuery}
                            onChange={handleSearchChange}
                            onFocus={handleSearchFocus}
                            onBlur={handleSearchBlur}
                        />
                        <button type="submit" className="search-btn-icon">
                            <Search className="search-icon" size={18} />
                        </button>
                    </div>

                    {/* Live Search Dropdown Panel */}
                    {showDropdown && searchQuery.trim() !== '' && (
                        <div className="search-dropdown-panel">
                            {filteredResults.length > 0 ? (
                                <>
                                    <div className="dropdown-section-title">Products found</div>
                                    <div className="dropdown-results-list">
                                        {filteredResults.map(product => {
                                            const imgUrl = product.images?.[0]?.startsWith('/uploads')
                                                ? `${API_BASE_URL}${product.images[0]}`
                                                : product.images?.[0] || 'https://via.placeholder.com/50';
                                            return (
                                                <Link 
                                                    key={product._id} 
                                                    to={`/product/${product._id}`} 
                                                    className="dropdown-result-item"
                                                    onClick={handleItemClick}
                                                >
                                                    <img src={imgUrl} alt={product.name} className="dropdown-item-thumb" />
                                                    <div className="dropdown-item-info">
                                                        <span className="dropdown-item-name">{product.name}</span>
                                                        <span className="dropdown-item-cat">{product.subCategory}</span>
                                                    </div>
                                                    <span className="dropdown-item-price">₹{product.offerPrice || product.price}</span>
                                                </Link>
                                            )
                                        })}
                                    </div>
                                    <button type="submit" className="view-all-results-btn">
                                        View all results
                                    </button>
                                </>
                            ) : (
                                <div className="dropdown-no-results">
                                    No products found for "{searchQuery}"
                                </div>
                            )}
                        </div>
                    )}
                </form>

                <div className="nav-icons">
                    <Link to="/wishlist" className="wishlist-icon-wrapper" title="Liked Products" style={{ color: 'inherit', textDecoration: 'none' }}>
                        <Heart className="icon" size={20} />
                        {getWishlistCount() > 0 && (
                            <span className="wishlist-badge">{getWishlistCount()}</span>
                        )}
                    </Link>
                    <Link to="/cart" className="cart-icon-wrapper" title="Shopping Cart" style={{ color: 'inherit', textDecoration: 'none' }}>
                        <ShoppingBag className="icon" size={20} />
                        {getCartCount() > 0 && (
                            <span className="cart-badge">{getCartCount()}</span>
                        )}
                    </Link>
                </div>

                <SignedOut>
                    <SignInButton mode="modal">
                        <button className="login-btn">
                            <User size={18} />
                            <span>Login</span>
                        </button>
                    </SignInButton>
                </SignedOut>

                <SignedIn>
                    <UserButton afterSignOutUrl="/" />
                </SignedIn>
            </div>
        </header>
    )
}