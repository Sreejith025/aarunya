import React, { useState } from 'react';
import Navbar from '../../components/navbar/Navbar';
import Footer from '../../components/footer/Footer';
import { useShop } from '../../context/ShopContext';
import './Contact.css';
import { 
    Mail, 
    Phone, 
    MapPin, 
    Clock, 
    Send, 
    CheckCircle, 
    AlertTriangle 
} from 'lucide-react';

export default function Contact() {
    const { showToast } = useShop();

    // Form inputs state
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [subject, setSubject] = useState('General Inquiry');
    const [message, setMessage] = useState('');

    // Status states
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState(null); // 'success' | 'error' | null
    const [errorMsg, setErrorMsg] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Client-side validation
        if (!name.trim() || !email.trim() || !message.trim()) {
            showToast("Please fill in all required fields.", "info");
            return;
        }

        setIsSubmitting(true);
        setSubmitStatus(null);
        setErrorMsg('');

        try {
            const response = await fetch('http://localhost:5000/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: name.trim(),
                    email: email.trim(),
                    subject,
                    message: message.trim()
                })
            });

            const data = await response.json();

            if (response.ok && data.success) {
                setSubmitStatus('success');
                showToast("Message sent successfully! ✨", "success");
                // Reset form fields
                setName('');
                setEmail('');
                setSubject('General Inquiry');
                setMessage('');
            } else {
                setSubmitStatus('error');
                setErrorMsg(data.message || "Failed to submit message. Please try again.");
                showToast("Error sending message.", "info");
            }
        } catch (err) {
            console.error("Contact submit error:", err);
            setSubmitStatus('error');
            setErrorMsg("Network error. Please check your connection and try again.");
            showToast("Failed to connect to server.", "info");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="contact-page">
            <Navbar />
            
            {/* Contact Header Banner */}
            <div className="contact-header-banner">
                <div className="contact-banner-overlay"></div>
                <div className="contact-banner-content">
                    <h1>Get In Touch</h1>
                    <p>Have questions about a style, an order, or shipping? Contact our dedicated support team.</p>
                </div>
            </div>

            <div className="contact-container">
                <div className="contact-grid">
                    
                    {/* Left Column: Contact Details */}
                    <div className="contact-info-column">
                        <h2>Contact Information</h2>
                        <p className="contact-info-subtitle">We would love to hear from you. Drop us a line or visit us!</p>
                        
                        <div className="contact-info-cards">
                            <div className="contact-detail-card">
                                <div className="detail-icon-box">
                                    <MapPin size={22} />
                                </div>
                                <div className="detail-content">
                                    <h3>Our Store Location</h3>
                                    <p>Aarunya Luxe Boutique</p>
                                    <p>123 Fashion Street, Sector 5</p>
                                    <p>Behar, Karnataka - 560001, India</p>
                                </div>
                            </div>

                            <div className="contact-detail-card">
                                <div className="detail-icon-box">
                                    <Phone size={22} />
                                </div>
                                <div className="detail-content">
                                    <h3>Call & WhatsApp Support</h3>
                                    <p>Mobile: +91 7690063526</p>
                                    <p>WhatsApp: +91 7690063526</p>
                                </div>
                            </div>

                            <div className="contact-detail-card">
                                <div className="detail-icon-box">
                                    <Mail size={22} />
                                </div>
                                <div className="detail-content">
                                    <h3>Email Support</h3>
                                    <p className="detail-email">aarunyacloset@gmail.com</p>
                                    <p className="detail-email">info@aarunyaluxe.com</p>
                                </div>
                            </div>

                            <div className="contact-detail-card">
                                <div className="detail-icon-box">
                                    <Clock size={22} />
                                </div>
                                <div className="detail-content">
                                    <h3>Support Hours</h3>
                                    <p>Monday - Saturday</p>
                                    <p>10:00 AM - 6:00 PM IST</p>
                                    <p>Response within 24 hours</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Contact Form */}
                    <div className="contact-form-column">
                        {submitStatus === 'success' ? (
                            <div className="contact-success-card">
                                <div className="success-icon-wrapper">
                                    <CheckCircle size={48} className="success-icon" />
                                </div>
                                <h2>Thank You!</h2>
                                <p>Your message has been successfully received. A member of our support team will get in touch with you shortly.</p>
                                <button 
                                    className="send-another-btn"
                                    onClick={() => setSubmitStatus(null)}
                                >
                                    Send Another Message
                                </button>
                            </div>
                        ) : (
                            <div className="contact-form-card">
                                <h2>Send a Message</h2>
                                <p className="form-subtitle">Fill out the form below and we'll reply as soon as possible.</p>
                                
                                {submitStatus === 'error' && (
                                    <div className="contact-error-alert">
                                        <AlertTriangle size={18} className="error-alert-icon" />
                                        <span>{errorMsg}</span>
                                    </div>
                                )}

                                <form onSubmit={handleSubmit} className="contact-form">
                                    <div className="form-group-row">
                                        <div className="form-group">
                                            <label htmlFor="form-name">Full Name <span className="required">*</span></label>
                                            <input 
                                                type="text" 
                                                id="form-name"
                                                placeholder="Enter your name" 
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                required
                                                disabled={isSubmitting}
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="form-email">Email Address <span className="required">*</span></label>
                                            <input 
                                                type="email" 
                                                id="form-email"
                                                placeholder="Enter your email" 
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                required
                                                disabled={isSubmitting}
                                            />
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="form-subject">Inquiry Subject</label>
                                        <select 
                                            id="form-subject"
                                            value={subject}
                                            onChange={(e) => setSubject(e.target.value)}
                                            disabled={isSubmitting}
                                        >
                                            <option value="General Inquiry">General Inquiry</option>
                                            <option value="Order & Delivery Issue">Order & Delivery Issue</option>
                                            <option value="Product Availability">Product Availability & Sizes</option>
                                            <option value="Returns & Refunds">Returns & Refunds</option>
                                            <option value="Wholesale Business">Wholesale Business</option>
                                        </select>
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="form-message">Message <span className="required">*</span></label>
                                        <textarea 
                                            id="form-message"
                                            rows="5"
                                            placeholder="Write your message here..."
                                            value={message}
                                            onChange={(e) => setMessage(e.target.value)}
                                            required
                                            disabled={isSubmitting}
                                        ></textarea>
                                    </div>

                                    <button 
                                        type="submit" 
                                        className="contact-submit-btn"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <span className="submit-spinner"></span>
                                                <span>Sending message...</span>
                                            </>
                                        ) : (
                                            <>
                                                <Send size={18} />
                                                <span>Send Message</span>
                                            </>
                                        )}
                                    </button>
                                </form>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}
