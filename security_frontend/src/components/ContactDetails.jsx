import React from 'react';
import './ContactDetails.css';
import { MdEmail, MdPhone } from 'react-icons/md';

const ContactDetails = () => {
    return (
        <div className="contact-container">
            <div className="contact-content">
                <h3>Contact Details</h3>
                <div className="contact-info">
                    <div className="contact-left">
                        <MdEmail size={32} /> 
                        <p>Email: example@example.com</p>
                    </div>
                    <div className="contact-right">
                        <MdPhone size={32} /> 
                        <p>Phone: +1234567890</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactDetails;
