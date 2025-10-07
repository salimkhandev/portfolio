import { faGithub, faLinkedin, faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import Snackbar from "@mui/material/Snackbar";
import axios from 'axios';
import { Form, Formik } from 'formik';
import { useEffect, useRef, useState } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import AOS from 'aos';
import 'aos/dist/aos.css'; // Import AOS styles

import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import LoadingButton from '@mui/lab/LoadingButton';
import { Alert, TextField } from '@mui/material';

const Contact = () => {
    useEffect(() => {
        AOS.init({
            duration: 800, // Duration of animations
        });
    }, []);
    const [recaptchaValue, setRecaptchaValue] = useState('');
    const [snackbar, setSnackbar] = useState({ open: false, message: "" });
    const recaptchaRef = useRef();

    const handleRecaptchaChange = (value) => {
        setRecaptchaValue(value);
        // console the vlaue

    };

    const handleSubmit = async (values, { setSubmitting, resetForm }) => {
        if (!recaptchaValue) {
            alert("Please complete the reCAPTCHA.");
            console.log(recaptchaRef.current,'❤️');
            setSubmitting(false);
            return;
        }

        try {
            const response = await axios.post('https://portfolio-backend-git-main-salimkhandevs-projects.vercel.app/submit-form', {
                ...values,
                recaptchaToken: recaptchaValue,
            }, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            resetForm();
            // setRecaptchaValue('');
            recaptchaRef.current.reset();

            console.log('Success:', response.data);
            
        } catch (error) {
            // Handle any errors
            console.error('Error:', error);
        }

        setSubmitting(false);
        setSnackbar({ open: true, message: "Thank you! Your message has been sent." });
    };
    const handleCloseSnackbar = () => {
        setSnackbar({ open: false, message: "" });
    };

    return (
        <section id="contact" className="min-h-screen py-20 relative bg-gradient-to-b from-black via-[#0a1122] to-black overflow-hidden">
            {/* Decorative background elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl"></div>
            </div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="max-w-3xl mx-auto md:bg-[#1a2544]/40 md:backdrop-blur-xl rounded-2xl md:border md:border-white/10 md:shadow-2xl"
                    data-aos="fade-up"
                >
                    {/* Header Section */}
                    <div className="text-center p-8 border-b border-white/10">
                        <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-6">
                            Get in Touch
                        </h2>
                        
                        {/* Social Links */}
                        <div className="flex justify-center space-x-6 mt-4">
                            {[
                                { icon: faWhatsapp, href: "https://wa.me/923201970649", color: "hover:text-green-400" },
                                { icon: faGithub, href: "http://github.com/salimkhandev", color: "hover:text-gray-400" },
                                { icon: faLinkedin, href: "https://www.linkedin.com/in/salimkhandev", color: "hover:text-blue-400" }
                            ].map((social, index) => (
                                <a
                                    key={index}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`transform hover:scale-110 transition-all duration-300 ${social.color}`}
                                >
                                    <FontAwesomeIcon icon={social.icon} className="text-3xl text-white/80" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Form Section */}
                    <div className="p-8">
                        <Formik
                            initialValues={{ name: '', email: '', message: '' }}
                            validate={values => {
                                const errors = {};
                                if (!values.name) errors.name = 'Required';
                                if (!values.email) {
                                    errors.email = 'Required';
                                } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
                                    errors.email = 'Invalid email address';
                                }
                                if (!values.message) errors.message = 'Required';
                                return errors;
                            }}
                            onSubmit={handleSubmit}
                        >
                            {({ isSubmitting, errors, touched }) => (
                                <Form className="space-y-6">
                                    {/* Replace with MUI components */}
                                    <TextField
                                        fullWidth
                                        id="name"
                                        name="name"
                                        label="Name"
                                        variant="outlined"
                                        error={errors.name && touched.name}
                                        helperText={errors.name && touched.name ? errors.name : ""}
                                        InputProps={{
                                            sx: {
                                                color: 'white',
                                                '& .MuiOutlinedInput-notchedOutline': {
                                                    borderColor: 'rgba(255, 255, 255, 0.1)'
                                                },
                                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                                    borderColor: 'rgba(255, 255, 255, 0.3)'
                                                },
                                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                                    borderColor: '#3b82f6'
                                                },
                                                backgroundColor: 'rgba(255, 255, 255, 0.05)'
                                            }
                                        }}
                                        InputLabelProps={{
                                            sx: { color: 'rgba(255, 255, 255, 0.7)' }
                                        }}
                                        FormHelperTextProps={{
                                            sx: { color: '#f87171' }
                                        }}
                                    />

                                    <TextField
                                        fullWidth
                                        id="email"
                                        name="email"
                                        label="Email"
                                        variant="outlined"
                                        error={errors.email && touched.email}
                                        helperText={errors.email && touched.email ? errors.email : ""}
                                        InputProps={{
                                            sx: {
                                                color: 'white',
                                                '& .MuiOutlinedInput-notchedOutline': {
                                                    borderColor: 'rgba(255, 255, 255, 0.1)'
                                                },
                                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                                    borderColor: 'rgba(255, 255, 255, 0.3)'
                                                },
                                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                                    borderColor: '#3b82f6'
                                                },
                                                backgroundColor: 'rgba(255, 255, 255, 0.05)'
                                            }
                                        }}
                                        InputLabelProps={{
                                            sx: { color: 'rgba(255, 255, 255, 0.7)' }
                                        }}
                                        FormHelperTextProps={{
                                            sx: { color: '#f87171' }
                                        }}
                                    />

                                    <TextField
                                        fullWidth
                                        id="message"
                                        name="message"
                                        label="Message"
                                        variant="outlined"
                                        multiline
                                        rows={4}
                                        error={errors.message && touched.message}
                                        helperText={errors.message && touched.message ? errors.message : ""}
                                        InputProps={{
                                            sx: {
                                                color: 'white',
                                                '& .MuiOutlinedInput-notchedOutline': {
                                                    borderColor: 'rgba(255, 255, 255, 0.1)'
                                                },
                                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                                    borderColor: 'rgba(255, 255, 255, 0.3)'
                                                },
                                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                                    borderColor: '#3b82f6'
                                                },
                                                backgroundColor: 'rgba(255, 255, 255, 0.05)'
                                            }
                                        }}
                                        InputLabelProps={{
                                            sx: { color: 'rgba(255, 255, 255, 0.7)' }
                                        }}
                                        FormHelperTextProps={{
                                            sx: { color: '#f87171' }
                                        }}
                                    />

                                    {/* ReCAPTCHA */}
                                    <div className="flex justify-center">
                                        <ReCAPTCHA
                                            sitekey="6LfPzhUqAAAAAC7Qz5KXAwdmLlHVE83PtS2uyzXO"
                                            onChange={handleRecaptchaChange}
                                            ref={recaptchaRef}
                                            theme="dark"
                                        />
                                    </div>

                                    {/* Submit Button using MUI Button */}
                                    <div className="flex justify-center">
                                        <LoadingButton
                                            type="submit"
                                            variant="contained"
                                            loading={isSubmitting}
                                            loadingPosition="end"
                                            endIcon={<FontAwesomeIcon icon={faPaperPlane} />}
                                            sx={{
                                                background: 'linear-gradient(to right, #3b82f6, #a855f7)',
                                                padding: '10px 20px',
                                                borderRadius: '8px',
                                                '&:hover': {
                                                    background: 'linear-gradient(to right, #2563eb, #9333ea)',
                                                    transform: 'translateY(-2px)',
                                                    boxShadow: '0 4px 20px rgba(59, 130, 246, 0.3)'
                                                },
                                                transition: 'all 0.3s ease'
                                            }}
                                        >
                                            Send Message
                                        </LoadingButton>
                                    </div>
                                </Form>
                            )}
                        </Formik>
                    </div>
                </div>

                {/* Snackbar */}
                <Snackbar
                    open={snackbar.open}
                    autoHideDuration={3000}
                    onClose={handleCloseSnackbar}
                    anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                >
                    <Alert 
                        onClose={handleCloseSnackbar} 
                        severity="success" 
                        variant="filled"
                        sx={{
                            background: 'linear-gradient(to right, #3b82f6, #a855f7)',
                            color: 'white'
                        }}
                    >
                        {snackbar.message}
                    </Alert>
                </Snackbar>
            </div>
        </section>
    );
};

export default Contact;
