import React, { useState, useEffect, useRef } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { FaCheck, FaShieldAlt, FaLock, FaArrowLeft, FaBan } from 'react-icons/fa';
import { MdOutlinePayments, MdOutlineSecurity, MdOutlineSupport } from 'react-icons/md';
import Swal from 'sweetalert2';
import { STRIPE_CONFIG, getStripeConfigStatus } from '../config/stripe';

const stripePromise = loadStripe(STRIPE_CONFIG.PUBLISHABLE_KEY);
const baseUrl = `${import.meta.env.VITE_API_BASE_URL}`;

const AddOnsPage = () => {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const stripeConfig = getStripeConfigStatus();
    const checkoutRef = useRef(null);

    const [addOns, setAddOns] = useState([]);
    const [selectedAddOn, setSelectedAddOn] = useState(null);
    const [showCheckout, setShowCheckout] = useState(false);
    const [paymentSuccess, setPaymentSuccess] = useState(false);
    const [paymentCanceled, setPaymentCanceled] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState(null);
    const [redirectUrl, setRedirectUrl] = useState(null);

    // Fetch add-ons from backend
    useEffect(() => {
        const fetchAddOns = async () => {
            try {
                setIsLoading(true);
                const token = localStorage.getItem('token');
                if (!token) {
                    setError('Authentication required. Please log in again.');
                    setIsLoading(false);
                    return;
                }

                const response = await axios.get(
                    `${baseUrl}/getAddOnPlans`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        }
                    }
                );

                if (response.data && Array.isArray(response.data)) {
                    setAddOns(response.data);
                } else if (response.data && response.data.addOns && Array.isArray(response.data.addOns)) {
                    setAddOns(response.data.addOns);
                } else {
                    setAddOns([]);
                }
            } catch (err) {
                console.error('Error fetching add-ons:', err);
                setAddOns([]);
                if (err.response && err.response.status === 401) {
                    setError('Authentication expired. Please log in again.');
                } else {
                    setError('Failed to load add-ons. Please try again later.');
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchAddOns();
    }, []);

    useEffect(() => {
        // Handle Stripe success/cancel redirects
        const successParam = searchParams.get('success');
        const canceledParam = searchParams.get('canceled');
        const redirectParam = searchParams.get('redirect');

        if (successParam === 'true') {
            setPaymentSuccess(true);
            setSelectedAddOn(null);
            setShowCheckout(false);
            // Store redirect URL if provided
            if (redirectParam) {
                setRedirectUrl(decodeURIComponent(redirectParam));
            }
            // Clear URL parameters
            setSearchParams({}, { replace: true });
        } else if (canceledParam === 'true') {
            setPaymentCanceled(true);
            setSelectedAddOn(null);
            setShowCheckout(false);
            // Store redirect URL if provided
            if (redirectParam) {
                setRedirectUrl(decodeURIComponent(redirectParam));
            }
            // Clear URL parameters
            setSearchParams({}, { replace: true });
        }
    }, [searchParams, setSearchParams]);

    const handleAddOnSelect = (addOn) => {
        setSelectedAddOn(addOn);
        setShowCheckout(true);
        setError(null);
    };

    // Auto-scroll to checkout when it becomes visible
    useEffect(() => {
        if (showCheckout && checkoutRef.current) {
            setTimeout(() => {
                checkoutRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 100);
        }
    }, [showCheckout]);

    const handleHostedCheckout = async () => {
        if (!selectedAddOn || !selectedAddOn._id) {
            setError('No add-on selected. Please choose an add-on to continue.');
            return;
        }

        if (!stripeConfig.hasKey || !stripeConfig.isValid) {
            setError('Stripe configuration is invalid. Please contact support.');
            return;
        }

        try {
            setIsProcessing(true);
            setError(null);

            const token = localStorage.getItem('token');
            if (!token) {
                setError('Authentication required. Please log in again.');
                setIsProcessing(false);
                return;
            }

            // Get the current page URL to redirect back after payment
            const currentUrl = window.location.pathname;
            const encodedRedirect = encodeURIComponent(currentUrl);
            const successUrl = `${window.location.origin}/add-ons?success=true&redirect=${encodedRedirect}`;
            const cancelUrl = `${window.location.origin}/add-ons?canceled=true&redirect=${encodedRedirect}`;

            const response = await axios.post(
                `${baseUrl}/stripe${STRIPE_CONFIG.API_ENDPOINTS.CREATE_CHECKOUT_SESSION_ADD_ON}`,
                {
                    addOnId: selectedAddOn._id,
                    successUrl,
                    cancelUrl,
                },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            if (response.data?.url) {
                // Open the url in a new tab
                window.open(response.data.url, '_blank');
                return;
            }

            if (response.data?.sessionId) {
                const stripe = await stripePromise;
                if (!stripe) {
                    throw new Error('Stripe failed to initialize. Please refresh and try again.');
                }

                const { error: stripeError } = await stripe.redirectToCheckout({
                    sessionId: response.data.sessionId,
                });

                if (stripeError) {
                    setError(stripeError.message || 'Failed to redirect to Stripe Checkout. Please try again.');
                }
                setIsProcessing(false);
                return;
            }

            setError('Invalid response from payment server. Please try again.');
            setIsProcessing(false);
        } catch (err) {
            if (err.response && err.response.status === 401) {
                setError('Authentication expired. Please log in again.');
            } else if (err.response && err.response.data && err.response.data.message) {
                setError(err.response.data.message);
            } else {
                setError('Failed to initialize Stripe Checkout. Please try again.');
            }
            setIsProcessing(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#6C63FF] mx-auto mb-4"></div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Loading Add-Ons...</h2>
                    <p className="text-gray-600">
                        Please wait while we load available add-ons.
                    </p>
                </div>
            </div>
        );
    }

    const handleSuccessClose = () => {
        setPaymentSuccess(false);
        if (redirectUrl) {
            navigate(redirectUrl);
        } else {
            navigate('/dashboard');
        }
    };

    const handleCancelClose = () => {
        setPaymentCanceled(false);
        if (redirectUrl) {
            navigate(redirectUrl);
        } else {
            // Stay on add-ons page if no redirect URL
            navigate('/add-ons');
        }
    };

    if (addOns.length === 0 && !isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
                    <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FaBan className="w-8 h-8 text-yellow-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">No Add-Ons Available</h2>
                    <p className="text-gray-600 mb-6">
                        {error || "We couldn't load any add-ons at this time. Please try again later or contact support."}
                    </p>
                    <button
                        onClick={() => navigate(-1)}
                        className="px-6 py-2 bg-[#6C63FF] text-white rounded-lg hover:bg-[#5A52E8] transition-colors"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <button
                            onClick={() => navigate(-1)}
                            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
                        >
                            <FaArrowLeft className="w-4 h-4 mr-2" />
                            Back
                        </button>
                        <div className="flex items-center space-x-2">
                            <MdOutlineSecurity className="w-5 h-5 text-green-500" />
                            <span className="text-sm text-gray-600">Secure Payment via Stripe Checkout</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        Available Add-Ons
                    </h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Enhance your subscription with powerful add-ons. Checkout is powered by Stripe's hosted payment page.
                    </p>
                </div>

                <div className={`grid grid-cols-1 md:grid-cols-2 ${addOns.length <= 2 ? 'lg:grid-cols-2' : 'lg:grid-cols-3'} gap-8 mb-12 justify-center items-stretch w-full mx-auto`}>
                    {addOns.map((addOn) => (
                        <div
                            key={addOn._id || addOn.id}
                            className={`bg-white rounded-2xl shadow-lg relative border-2 transition-all duration-300 hover:shadow-xl ${addOn.popular ? 'border-[#6C63FF]' : 'border-[#E5E7EB]'
                                } ${selectedAddOn?._id === addOn._id ? 'ring-2 ring-[#6C63FF] ring-opacity-50' : ''}`}
                        >
                            {addOn.popular && (
                                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                                    <span className="bg-gradient-to-r from-[#6C63FF] to-[#8B7CF6] text-white text-xs font-semibold px-4 py-1 rounded-full">
                                        Popular
                                    </span>
                                </div>
                            )}

                            <div className="p-8">
                                <h3 className="text-2xl font-bold text-gray-900 mb-2">{addOn.name || addOn.title}</h3>
                                <div className="mb-6">
                                    <span className="text-4xl font-bold text-gray-900">
                                        ${addOn.price || addOn.monthlyPrice || 0}
                                    </span>
                                    {addOn.billingCycle && (
                                        <span className="text-gray-600">
                                            /{addOn.billingCycle}
                                        </span>
                                    )}
                                </div>

                                {addOn.description && (
                                    <p className="text-gray-600 mb-4">{addOn.description}</p>
                                )}

                                <div className="mb-8 space-y-2">
                                    {addOn.type && (
                                        <div className="flex items-center">
                                            <span className="text-sm font-medium text-gray-700 mr-2">Type:</span>
                                            <span className="text-sm text-gray-600">{addOn.type}</span>
                                        </div>
                                    )}
                                    {addOn.quantity && (
                                        <div className="flex items-center">
                                            <span className="text-sm font-medium text-gray-700 mr-2">Quantity:</span>
                                            <span className="text-sm text-gray-600">{addOn.quantity}</span>
                                        </div>
                                    )}
                                </div>

                                <button
                                    onClick={() => handleAddOnSelect(addOn)}
                                    className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-200 ${addOn.popular
                                        ? 'bg-gradient-to-r from-[#6C63FF] to-[#8B7CF6] text-white hover:from-[#5A52E8] hover:to-[#7A6CF0]'
                                        : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                                        }`}
                                >
                                    {selectedAddOn?._id === addOn._id ? 'Selected' : 'Purchase Add-On'}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {showCheckout && selectedAddOn && (
                    <div ref={checkoutRef} className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-gray-900">Complete Your Purchase</h2>
                            <button
                                onClick={() => setShowCheckout(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                ×
                            </button>
                        </div>

                        <div className="grid lg:grid-cols-2 gap-8">
                            <div className="bg-gray-50 rounded-lg p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Add-On:</span>
                                        <span className="font-medium">{selectedAddOn.name || selectedAddOn.title}</span>
                                    </div>
                                    {selectedAddOn.description && (
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Description:</span>
                                            <span className="font-medium text-sm text-right max-w-xs">{selectedAddOn.description}</span>
                                        </div>
                                    )}
                                    {selectedAddOn.type && (
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Type:</span>
                                            <span className="font-medium">{selectedAddOn.type}</span>
                                        </div>
                                    )}
                                    {selectedAddOn.quantity && (
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Quantity:</span>
                                            <span className="font-medium">{selectedAddOn.quantity}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Amount:</span>
                                        <span className="font-bold text-lg">
                                            ${selectedAddOn.price || selectedAddOn.monthlyPrice || 0}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col justify-between space-y-4">
                                <div className="bg-gray-50 rounded-lg p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Stripe Checkout</h3>
                                    <p className="text-sm text-gray-600 mb-4">
                                        You&rsquo;ll be redirected to Stripe&rsquo;s hosted payment page to securely complete your purchase.
                                    </p>
                                    {error && (
                                        <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-4">
                                            <p className="text-sm text-red-600">{error}</p>
                                        </div>
                                    )}
                                    <button
                                        onClick={handleHostedCheckout}
                                        disabled={isProcessing}
                                        className="w-full bg-gradient-to-r from-[#6C63FF] to-[#8B7CF6] text-white font-semibold py-3 px-6 rounded-lg hover:from-[#5A52E8] hover:to-[#7A6CF0] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-md hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98]"
                                        title={isProcessing ? "Redirecting to Stripe Checkout..." : "Continue to Stripe Checkout"}
                                    >
                                        {isProcessing ? (
                                            <div className="flex items-center space-x-2">
                                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                                <span>Preparing Checkout...</span>
                                            </div>
                                        ) : (
                                            <>
                                                <MdOutlinePayments className="w-5 h-5 mr-2" />
                                                Continue to Stripe Checkout
                                            </>
                                        )}
                                    </button>
                                </div>
                                <div className="text-center text-sm text-gray-500">
                                    <p className="flex items-center justify-center">
                                        <FaShieldAlt className="w-4 h-4 mr-2 text-green-500" />
                                        Stripe handles all payment information securely.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <div className="mt-16">
                    <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
                        Why Choose Our Add-Ons?
                    </h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <FaShieldAlt className="w-8 h-8 text-blue-600" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Enterprise Security</h3>
                            <p className="text-gray-600">
                                Bank-level encryption and security measures to protect your sensitive data.
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <MdOutlineSupport className="w-8 h-8 text-green-600" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">24/7 Support</h3>
                            <p className="text-gray-600">
                                Round-the-clock customer support to help you succeed with your RFPs.
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <FaCheck className="w-8 h-8 text-purple-600" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Hosted Checkout</h3>
                            <p className="text-gray-600">
                                Seamless payments managed by Stripe&rsquo;s PCI-compliant checkout experience.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="mt-16 text-center">
                    <div className="flex items-center justify-center space-x-8 text-gray-400">
                        <div className="flex items-center">
                            <FaLock className="w-4 h-4 mr-2" />
                            <span className="text-sm">SSL Encrypted</span>
                        </div>
                        <div className="flex items-center">
                            <FaShieldAlt className="w-4 h-4 mr-2" />
                            <span className="text-sm">PCI Compliant</span>
                        </div>
                        <div className="flex items-center">
                            <MdOutlinePayments className="w-4 h-4 mr-2" />
                            <span className="text-sm">Stripe Powered</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Success Modal */}
            {paymentSuccess && (
                <div className="fixed inset-0 z-[1100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FaCheck className="w-8 h-8 text-green-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Purchase Successful!</h2>
                        <p className="text-gray-600 mb-6">
                            Your add-on purchase was completed through Stripe Checkout. Your account has been updated.
                        </p>
                        <button
                            onClick={handleSuccessClose}
                            className="w-full bg-gradient-to-r from-[#6C63FF] to-[#8B7CF6] text-white font-semibold py-3 px-6 rounded-lg hover:from-[#5A52E8] hover:to-[#7A6CF0] transition-all duration-200 shadow-md hover:shadow-lg"
                        >
                            Continue
                        </button>
                    </div>
                </div>
            )}

            {/* Cancel Modal */}
            {paymentCanceled && (
                <div className="fixed inset-0 z-[1100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
                        <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FaBan className="w-8 h-8 text-yellow-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Cancelled</h2>
                        <p className="text-gray-600 mb-6">
                            You have cancelled the payment on the Stripe checkout page. No charges were made to your account.
                        </p>
                        <button
                            onClick={handleCancelClose}
                            className="w-full bg-gray-200 text-gray-900 font-semibold py-3 px-6 rounded-lg hover:bg-gray-300 transition-all duration-200 shadow-md hover:shadow-lg"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AddOnsPage;

