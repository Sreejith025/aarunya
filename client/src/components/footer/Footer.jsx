import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';
import { 
    Mail, 
    Phone, 
    MapPin, 
    Heart 
} from 'lucide-react';

export default function Footer() {
    return (
        <footer className="main-footer">
            <div className="footer-top-container">
                <div className="footer-grid">
                    
                    {/* Column 1: Brand Info */}
                    <div className="footer-col brand-col">
                        <Link to="/" className="footer-logo">Aarunya luxe</Link>
                        <p className="footer-tagline">
                            Step into a world of trendy, premium women's clothing. We curate the finest kurtis, sarees, tops, skirts, and activewear to deliver elegance at affordable prices.
                        </p>
                        <div className="footer-social-links">
                            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-icon-btn" aria-label="Instagram">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-instagram"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
                            </a>
                            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-icon-btn" aria-label="Facebook">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-facebook"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                            </a>
                            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-icon-btn" aria-label="Twitter">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-twitter"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
                            </a>
                        </div>
                    </div>

                    {/* Column 2: Shop Links */}
                    <div className="footer-col links-col">
                        <h3>Shop Categories</h3>
                        <ul className="footer-links-list">
                            <li><Link to="/women?category=kurti">Kurtis</Link></li>
                            <li><Link to="/women?category=sarees">Sarees</Link></li>
                            <li><Link to="/women?category=tops">Tops & Shirts</Link></li>
                            <li><Link to="/women?category=skirts">Skirts</Link></li>
                            <li><Link to="/women?category=jeans">Jeans</Link></li>
                            <li><Link to="/women?category=activewear">Activewear</Link></li>
                        </ul>
                    </div>

                    {/* Column 3: Quick Links */}
                    <div className="footer-col links-col">
                        <h3>Quick Links</h3>
                        <ul className="footer-links-list">
                            <li><Link to="/">Home</Link></li>
                            <li><Link to="/women">Women Collection</Link></li>
                            <li><Link to="/faq">Frequently Asked Questions</Link></li>
                            <li><Link to="/contact">Contact Support</Link></li>
                            <li><Link to="/wishlist">My Wishlist</Link></li>
                            <li><Link to="/cart">Shopping Cart</Link></li>
                        </ul>
                    </div>

                    {/* Column 4: Contact details */}
                    <div className="footer-col contact-col">
                        <h3>Reach Out</h3>
                        <ul className="footer-contact-details">
                            <li>
                                <MapPin size={18} className="contact-icon" />
                                <span>123 Fashion Street, Sector 5, Bengaluru, KA - 560001, India</span>
                            </li>
                            <li>
                                <Phone size={18} className="contact-icon" />
                                <span>+91 7690063562</span>
                            </li>
                            <li>
                                <Mail size={18} className="contact-icon" />
                                <span className="contact-email">aarunyacloset@gmail.com</span>
                            </li>
                        </ul>
                    </div>

                </div>
            </div>

            {/* Footer Bottom Copyright & Payment Badges */}
            <div className="footer-bottom-container">
                <div className="footer-bottom-inner">
                    <p className="copyright-text">
                        © 2026 Aarunya Luxe. Crafted with <Heart size={12} fill="#ff3b6a" color="#ff3b6a" style={{ display: 'inline', verticalAlign: 'middle', margin: '0 2px' }} /> in India.
                    </p>
                    
                    <div className="payment-badges-row">
                        <span className="pay-badge">UPI</span>
                        <span className="pay-badge">GPay</span>
                        <span className="pay-badge">PhonePe</span>
                        <span className="pay-badge">Paytm</span>
                        <span className="pay-badge">COD</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
