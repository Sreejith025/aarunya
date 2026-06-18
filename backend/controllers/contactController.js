const Contact = require('../models/Contact');

// @desc    Submit a contact message
// @route   POST /api/contact
// @access  Public
const submitContactMessage = async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;

        // Basic validation
        if (!name || !email || !subject || !message) {
            return res.status(400).json({ 
                success: false, 
                message: "Please fill out all required fields." 
            });
        }

        // Save to database
        const contactMessage = new Contact({
            name,
            email,
            subject,
            message
        });

        await contactMessage.save();

        res.status(201).json({
            success: true,
            message: "Your message has been received! We'll get back to you soon."
        });
    } catch (error) {
        console.error("Error saving contact message:", error);
        res.status(500).json({ 
            success: false, 
            message: "Server error. Please try again later." 
        });
    }
};

module.exports = {
    submitContactMessage
};
