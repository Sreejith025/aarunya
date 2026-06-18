import React, { useState } from 'react';
import Navbar from '../../components/navbar/Navbar';
import './FAQ.css';
import Footer from '../../components/footer/Footer';
import { 
    Search, 
    ChevronDown, 
    HelpCircle, 
    ShoppingBag, 
    CreditCard, 
    MessageSquare,
    Mail,
    PhoneCall
} from 'lucide-react';

const faqCategories = [
    { id: 'all', name: 'All Questions', icon: HelpCircle },
    { id: 'general', name: 'General', icon: HelpCircle },
    { id: 'orders', name: 'Orders & Shipping', icon: ShoppingBag },
    { id: 'payments', name: 'Payments', icon: CreditCard },
    { id: 'support', name: 'Returns & Support', icon: MessageSquare }
];

const faqData = [
    {
        id: 1,
        category: 'general',
        question: "What is Aarunya Luxe?",
        answer: "Aarunya Luxe is a women’s fashion store offering trendy and premium clothing including kurtis, sarees, tops, skirts, jeans, and activewear at affordable prices."
    },
    {
        id: 2,
        category: 'general',
        question: "What products do you sell?",
        answer: "We offer a wide collection of women’s fashion products such as:\n• Kurtis\n• Sarees\n• Tops\n• Skirts\n• Jeans\n• Activewear"
    },
    {
        id: 3,
        category: 'orders',
        question: "How can I place an order?",
        answer: "Simply browse products, select your favorite item, add it to cart, and proceed to checkout."
    },
    {
        id: 4,
        category: 'payments',
        question: "What payment methods are available?",
        answer: "We support:\n• UPI Payments\n• QR Code Payment\n• Google Pay (GPay)\n• PhonePe\n• Paytm\n• Cash on Delivery (if available)"
    },
    {
        id: 5,
        category: 'payments',
        question: "How do I pay using UPI QR?",
        answer: "At checkout, scan the QR code using any UPI app like GPay, PhonePe, or Paytm and complete the payment. After payment, upload the screenshot or order ID if required."
    },
    {
        id: 6,
        category: 'orders',
        question: "How long does delivery take?",
        answer: "Orders are usually delivered within 3–7 business days, depending on your location."
    },
    {
        id: 7,
        category: 'orders',
        question: "Can I cancel my order?",
        answer: "Yes, orders can be canceled before shipping. Once shipped, cancellation may not be possible."
    },
    {
        id: 8,
        category: 'support',
        question: "Do you offer returns or exchanges?",
        answer: "Yes, we offer returns/exchanges for damaged or incorrect products within a limited time period."
    },
    {
        id: 9,
        category: 'orders',
        question: "How can I track my order?",
        answer: "You can track your order using the tracking link or order status shared after dispatch."
    },
    {
        id: 10,
        category: 'general',
        question: "Are your products high quality?",
        answer: "Yes, we carefully select quality materials to ensure comfort, durability, and style."
    },
    {
        id: 11,
        category: 'support',
        question: "Do you provide customer support?",
        answer: "Yes! Our support team is available to help with orders, payments, and product-related queries."
    },
    {
        id: 12,
        category: 'support',
        question: "How can I contact Aarunya Luxe?",
        answer: "You can contact us through:\n• WhatsApp Support\n• Email Support\n• Contact Form on Website"
    },
    {
        id: 13,
        category: 'support',
        question: "Are there discounts or seasonal sales?",
        answer: "Yes, we regularly provide exclusive discounts, festive offers, and seasonal sales."
    },
    {
        id: 14,
        category: 'payments',
        question: "Is my payment secure?",
        answer: "Yes, all payments are processed securely through trusted payment methods."
    },
    {
        id: 15,
        category: 'orders',
        question: "Do you ship across India?",
        answer: "Yes, we provide delivery across most locations in India."
    }
];

export default function FAQ() {
    const [activeCategory, setActiveCategory] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [expandedIndex, setExpandedIndex] = useState(null);

    const toggleAccordion = (id) => {
        if (expandedIndex === id) {
            setExpandedIndex(null);
        } else {
            setExpandedIndex(id);
        }
    };

    // Filter by Category and Search query
    const filteredFAQs = faqData.filter(faq => {
        const matchesCategory = activeCategory === 'all' || faq.category === activeCategory;
        const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
                             faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    // Helper to render the answer properly with lists if it has bullet points
    const renderAnswer = (answer) => {
        if (answer.includes('\n•')) {
            const parts = answer.split('\n');
            const mainText = parts[0];
            const listItems = parts.slice(1).map(item => item.replace('•', '').trim());

            return (
                <div className="faq-answer-content">
                    <p>{mainText}</p>
                    <ul className="faq-bullet-list">
                        {listItems.map((item, idx) => (
                            <li key={idx}>{item}</li>
                        ))}
                    </ul>
                </div>
            );
        }
        return <p className="faq-answer-content">{answer}</p>;
    };

    return (
        <div className="faq-page">
            <Navbar />
            
            {/* Header Banner Section */}
            <div className="faq-header-banner">
                <div className="faq-banner-overlay"></div>
                <div className="faq-banner-content">
                    <h1>Frequently Asked Questions</h1>
                    <p>Have questions about orders, payments, or collections? We've got you covered.</p>
                    
                    {/* Search Bar inside Banner */}
                    <div className="faq-search-wrapper">
                        <Search className="faq-search-icon" size={20} />
                        <input 
                            type="text" 
                            placeholder="Search your question here..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        {searchQuery && (
                            <button 
                                className="faq-search-clear"
                                onClick={() => setSearchQuery('')}
                            >
                                Clear
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <div className="faq-container">
                {/* Categories Navigation */}
                <div className="faq-categories-tabs">
                    {faqCategories.map(cat => {
                        const IconComponent = cat.icon;
                        return (
                            <button
                                key={cat.id}
                                className={`faq-tab-btn ${activeCategory === cat.id ? 'active' : ''}`}
                                onClick={() => {
                                    setActiveCategory(cat.id);
                                    setExpandedIndex(null); // Close accordions when changing categories
                                }}
                            >
                                <IconComponent className="tab-icon" size={18} />
                                <span>{cat.name}</span>
                            </button>
                        );
                    })}
                </div>

                {/* FAQ Accordion List */}
                <div className="faq-accordion-section">
                    {filteredFAQs.length > 0 ? (
                        filteredFAQs.map((faq) => {
                            const isOpen = expandedIndex === faq.id;
                            return (
                                <div 
                                    key={faq.id} 
                                    className={`faq-accordion-item ${isOpen ? 'open' : ''}`}
                                >
                                    <button 
                                        className="faq-question-btn"
                                        onClick={() => toggleAccordion(faq.id)}
                                        aria-expanded={isOpen}
                                    >
                                        <span className="faq-question-text">{faq.question}</span>
                                        <div className={`faq-chevron-icon-wrapper ${isOpen ? 'rotated' : ''}`}>
                                            <ChevronDown size={20} />
                                        </div>
                                    </button>
                                    
                                    <div className="faq-answer-wrapper" style={{ maxHeight: isOpen ? '300px' : '0px' }}>
                                        <div className="faq-answer-inner">
                                            {renderAnswer(faq.answer)}
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="faq-no-results">
                            <p>No questions found matching your search term.</p>
                            <button onClick={() => { setSearchQuery(''); setActiveCategory('all'); }} className="reset-search-btn">
                                View All Questions
                            </button>
                        </div>
                    )}
                </div>

                {/* Support CTA Cards */}
                <div className="faq-contact-cta">
                    <h2>Still have questions?</h2>
                    <p>If you couldn't find the answers you were looking for, please connect with us directly.</p>
                    
                    <div className="faq-contact-grid">
                        <a href="https://wa.me/917690063562" target="_blank" rel="noopener noreferrer" className="faq-contact-card whatsapp">
                            <div className="contact-icon-box">
                                <MessageSquare size={24} />
                            </div>
                            <h3>Chat on WhatsApp</h3>
                            <p>Quick response for orders & queries</p>
                            <span className="contact-action-link">Message Us &rarr;</span>
                        </a>

                        <a href="mailto:aarunyacloset@gmail.com" className="faq-contact-card email">
                            <div className="contact-icon-box">
                                <Mail size={24} />
                            </div>
                            <h3>Email Support</h3>
                            <p>Get in touch via support email</p>
                            <span className="contact-action-link">Email Us &rarr;</span>
                        </a>

                        <div className="faq-contact-card phone">
                            <div className="contact-icon-box">
                                <PhoneCall size={24} />
                            </div>
                            <h3>Phone Support</h3>
                            <p>Mon - Sat, 10:00 AM - 6:00 PM</p>
                            <span className="contact-action-link">+91 7690063562</span>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}
