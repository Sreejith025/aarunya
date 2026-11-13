import { useState, useEffect, useRef } from 'react'
import './Navbar.css'
import { Search, Heart, ShoppingBag, User, Menu, X, ArrowRight } from 'lucide-react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
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
    const location = useLocation()

    // Mobile menu & search states
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [mobileSearchOpen, setMobileSearchOpen] = useState(false)
    const mobileSearchInputRef = useRef(null)

    // Search states
    const [searchQuery, setSearchQuery] = useState('')
    const [allProducts, setAllProducts] = useState([])
    const [filteredResults, setFilteredResults] = useState([])
    const [showDropdown, setShowDropdown] = useState(false)

    // Adjust state during render when route changes (recommended React pattern)
    const [prevPath, setPrevPath] = useState(location.pathname)
    if (prevPath !== location.pathname) {
        setPrevPath(location.pathname)
        setMobileMenuOpen(false)
        setMobileSearchOpen(false)
        setShowDropdown(false)
    }

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

    // Focus mobile search input when opened
    useEffect(() => {
        if (mobileSearchOpen && mobileSearchInputRef.current) {
            mobileSearchInputRef.current.focus()
            handleSearchFocus()
        }
    }, [mobileSearchOpen])

    // Prevent background scrolling when mobile menu drawer is open
    useEffect(() => {
        if (mobileMenuOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = ''
        }
        return () => {
            document.body.style.overflow = ''
        }
    }, [mobileMenuOpen])

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
            setMobileSearchOpen(false)
        }
    }

    // Close dropdown on item click
    const handleItemClick = () => {
        setSearchQuery('')
        setShowDropdown(false)
        setMobileSearchOpen(false)
        setMobileMenuOpen(false)
    }

    // Close dropdown on blur with delay to allow clicks to register
    const handleSearchBlur = () => {
        setTimeout(() => {
            setShowDropdown(false)
        }, 250)
    }

    const isActive = (path) => {
        if (path === '/' && location.pathname === '/') return true
        if (path !== '/' && location.pathname.startsWith(path)) return true
        return false
    }

    return (
        <header className="navbar-wrapper">
            <div className="navbar">
                {/* Brand Logo */}
                <div className="logo">
                    <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
                        Aarunya luxe
                    </Link>
                </div>

                {/* Desktop Navigation Links */}
                <nav className="nav-links">
                    <Link to="/" className={isActive('/') ? 'active' : ''}>Home</Link>
                    <Link to="/women" className={isActive('/women') ? 'active' : ''}>Women</Link>
                    <Link to="/faq" className={isActive('/faq') ? 'active' : ''}>FAQ</Link>
                    <Link to="/contact" className={isActive('/contact') ? 'active' : ''}>Contact</Link>
                    {isAdmin && (
                        <Link to="/admin" className={`admin-link-badge ${isActive('/admin') ? 'active' : ''}`}>
                            Admin Dashboard
                        </Link>
                    )}
                </nav>

                {/* Right Area: Search + Icons + Auth + Mobile Toggles */}
                <div className="nav-right">
                    {/* Desktop Search */}
                    <form className="search-box-container desktop-search" onSubmit={handleSearchSubmit}>
                        <div className="search-box">
                            <input
                                type="text"
                                placeholder="Search by name, category, or item..."
                                value={searchQuery}
                                onChange={handleSearchChange}
                                onFocus={handleSearchFocus}
                                onBlur={handleSearchBlur}
                            />
                            <button type="submit" className="search-btn-icon" aria-label="Search">
                                <Search className="search-icon" size={18} />
                            </button>
                        </div>

                        {/* Live Search Dropdown Panel (Desktop) */}
                        {showDropdown && searchQuery.trim() !== '' && !mobileSearchOpen && (
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

                    {/* Mobile Search Toggle Icon */}
                    <button 
                        type="button" 
                        className={`mobile-search-toggle ${mobileSearchOpen ? 'active' : ''}`}
                        onClick={() => {
                            setMobileSearchOpen(!mobileSearchOpen)
                            if (mobileMenuOpen) setMobileMenuOpen(false)
                        }}
                        aria-label="Toggle search"
                    >
                        {mobileSearchOpen ? <X size={22} /> : <Search size={22} />}
                    </button>

                    {/* Nav Icons: Wishlist & Cart */}
                    <div className="nav-icons">
                        <Link to="/wishlist" className="wishlist-icon-wrapper" title="Liked Products" aria-label="Wishlist">
                            <Heart className="icon" size={22} />
                            {getWishlistCount() > 0 && (
                                <span className="wishlist-badge">{getWishlistCount()}</span>
                            )}
                        </Link>
                        <Link to="/cart" className="cart-icon-wrapper" title="Shopping Cart" aria-label="Cart">
                            <ShoppingBag className="icon" size={22} />
                            {getCartCount() > 0 && (
                                <span className="cart-badge">{getCartCount()}</span>
                            )}
                        </Link>
                    </div>

                    {/* User Auth Button */}
                    <div className="auth-container">
                        <SignedOut>
                            <SignInButton mode="modal">
                                <button className="login-btn" aria-label="Sign In">
                                    <User size={18} />
                                    <span className="login-text">Login</span>
                                </button>
                            </SignInButton>
                        </SignedOut>

                        <SignedIn>
                            <UserButton afterSignOutUrl="/" />
                        </SignedIn>
                    </div>

                    {/* Mobile Hamburger Menu Toggle Button */}
                    <button 
                        type="button" 
                        className="mobile-menu-toggle"
                        onClick={() => {
                            setMobileMenuOpen(!mobileMenuOpen)
                            if (mobileSearchOpen) setMobileSearchOpen(false)
                        }}
                        aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
                        aria-expanded={mobileMenuOpen}
                    >
                        {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
                    </button>
                </div>
            </div>

            {/* Mobile Expandable Search Bar */}
            {mobileSearchOpen && (
                <div className="mobile-search-bar-wrapper">
                    <form className="mobile-search-form" onSubmit={handleSearchSubmit}>
                        <Search className="mobile-search-icon" size={18} />
                        <input
                            ref={mobileSearchInputRef}
                            type="text"
                            placeholder="Search products, kurtis, sarees..."
                            value={searchQuery}
                            onChange={handleSearchChange}
                            onFocus={handleSearchFocus}
                            onBlur={handleSearchBlur}
                        />
                        {searchQuery && (
                            <button 
                                type="button" 
                                className="mobile-search-clear-btn" 
                                onClick={() => setSearchQuery('')}
                                aria-label="Clear search query"
                            >
                                <X size={16} />
                            </button>
                        )}
                    </form>

                    {/* Mobile Live Results Dropdown */}
                    {showDropdown && searchQuery.trim() !== '' && (
                        <div className="mobile-search-dropdown-panel">
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
                                    <button type="button" onClick={handleSearchSubmit} className="view-all-results-btn">
                                        View all results ({filteredResults.length})
                                    </button>
                                </>
                            ) : (
                                <div className="dropdown-no-results">
                                    No products found for "{searchQuery}"
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}

            {/* Mobile Drawer Navigation Menu */}
            <div className={`mobile-drawer-overlay ${mobileMenuOpen ? 'open' : ''}`} onClick={() => setMobileMenuOpen(false)}>
                <div className={`mobile-drawer ${mobileMenuOpen ? 'open' : ''}`} onClick={e => e.stopPropagation()}>
                    <div className="mobile-drawer-header">
                        <span className="mobile-drawer-brand">Aarunya luxe</span>
                        <button 
                            type="button" 
                            className="mobile-drawer-close" 
                            onClick={() => setMobileMenuOpen(false)}
                            aria-label="Close menu"
                        >
                            <X size={24} />
                        </button>
                    </div>

                    <div className="mobile-drawer-nav">
                        <Link to="/" className={`mobile-nav-link ${isActive('/') ? 'active' : ''}`} onClick={() => setMobileMenuOpen(false)}>
                            <span>Home</span>
                            <ArrowRight size={16} className="mobile-nav-arrow" />
                        </Link>
                        <Link to="/women" className={`mobile-nav-link ${isActive('/women') ? 'active' : ''}`} onClick={() => setMobileMenuOpen(false)}>
                            <span>Women Collection</span>
                            <ArrowRight size={16} className="mobile-nav-arrow" />
                        </Link>
                        <Link to="/wishlist" className={`mobile-nav-link ${isActive('/wishlist') ? 'active' : ''}`} onClick={() => setMobileMenuOpen(false)}>
                            <span>Liked Products {getWishlistCount() > 0 && `(${getWishlistCount()})`}</span>
                            <ArrowRight size={16} className="mobile-nav-arrow" />
                        </Link>
                        <Link to="/cart" className={`mobile-nav-link ${isActive('/cart') ? 'active' : ''}`} onClick={() => setMobileMenuOpen(false)}>
                            <span>Shopping Cart {getCartCount() > 0 && `(${getCartCount()})`}</span>
                            <ArrowRight size={16} className="mobile-nav-arrow" />
                        </Link>
                        <Link to="/faq" className={`mobile-nav-link ${isActive('/faq') ? 'active' : ''}`} onClick={() => setMobileMenuOpen(false)}>
                            <span>FAQ</span>
                            <ArrowRight size={16} className="mobile-nav-arrow" />
                        </Link>
                        <Link to="/contact" className={`mobile-nav-link ${isActive('/contact') ? 'active' : ''}`} onClick={() => setMobileMenuOpen(false)}>
                            <span>Contact Us</span>
                            <ArrowRight size={16} className="mobile-nav-arrow" />
                        </Link>

                        {isAdmin && (
                            <Link to="/admin" className={`mobile-nav-link mobile-admin-link ${isActive('/admin') ? 'active' : ''}`} onClick={() => setMobileMenuOpen(false)}>
                                <span>⚡ Admin Dashboard</span>
                                <ArrowRight size={16} className="mobile-nav-arrow" />
                            </Link>
                        )}
                    </div>

                    <div className="mobile-drawer-footer">
                        <SignedOut>
                            <SignInButton mode="modal">
                                <button className="mobile-drawer-login-btn" onClick={() => setMobileMenuOpen(false)}>
                                    <User size={18} />
                                    <span>Sign In / Register</span>
                                </button>
                            </SignInButton>
                        </SignedOut>
                        <SignedIn>
                            <div className="mobile-user-greeting">
                                <UserButton />
                                <div className="user-details-text">
                                    <span className="user-name">{user?.fullName || 'My Account'}</span>
                                    <span className="user-email">{user?.primaryEmailAddress?.emailAddress}</span>
                                </div>
                            </div>
                        </SignedIn>
                    </div>
                </div>
            </div>
        </header>
    )
}
