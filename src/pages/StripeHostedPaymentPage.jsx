import React, { useMemo, useState, useEffect, useRef } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { FaCheck, FaShieldAlt, FaLock, FaArrowLeft, FaBan } from 'react-icons/fa';
import { MdOutlinePayments, MdOutlineSecurity, MdOutlineSupport } from 'react-icons/md';
import Swal from 'sweetalert2';
import { STRIPE_CONFIG, getStripeConfigStatus } from '../config/stripe';
import { useSubscriptionPlans } from '../context/SubscriptionPlansContext';

const stripePromise = loadStripe(STRIPE_CONFIG.PUBLISHABLE_KEY);
const baseUrl = `${import.meta.env.VITE_API_BASE_URL}/stripe`;

const buildSubscriptionPlans = (subscriptionPlans, mostPopularPlan) => {
    if (!subscriptionPlans || subscriptionPlans.length === 0) {
        return [];
    }

    const getPlanData = (planName) => {
        const plan = subscriptionPlans.find((p) => p.name === planName);
        if (!plan) {
            Swal.fire({
                title: `Plan ${planName} not found in subscription plans`,
                icon: "warning",
                timer: 1500,
                showConfirmButton: false,
                showCancelButton: false,
            });
            return null;
        }
        return plan;
    };

    const basicPlan = getPlanData("Basic");
    const proPlan = getPlanData("Pro");
    const enterprisePlan = getPlanData("Enterprise");

    if (!basicPlan || !proPlan || !enterprisePlan) {
        Swal.fire({
            title: "One or more required subscription plans are missing",
            icon: "warning",
            timer: 1500,
            showConfirmButton: false,
            showCancelButton: false,
        });
        return [];
    }

    const plans = [
        {
            id: "basic",
            name: "Basic Plan",
            _id: basicPlan._id,
            monthlyPrice: basicPlan.monthlyPrice || 0,
            yearlyPrice: basicPlan.yearlyPrice || 0,
            features: [
                `Up to ${basicPlan.maxRFPProposalGenerations || 0} AI - RFP Proposal Generations per month`,
                `Up to ${basicPlan.maxGrantProposalGenerations || 0} AI - Grant Proposal Generations per month`,
                "AI-Driven RFP Discovery",
                "AI-Driven Grant Discovery",
                "AI-Proposal Recommendation",
                "Basic Compliance Check",
                "Proposal Tracking Dashboard",
                `${basicPlan.maxEditors || 0} Editors, ${basicPlan.maxViewers || 0} Viewers, Unlimited Members`,
                "Rich Text Editor",
                "Team Collaboration",
                "AI Magic Brush",
                "Support",
            ],
            missingFeatures: [
                "Advanced Compliance Check",
                "AI Image Generation for Proposals",
                "AI Chat Assist",
                "AI Scoring System",
                "AI Competitor Industry Insights",
                "RFP Matchmaking",
            ],
            popular: mostPopularPlan === "Basic",
        },
        {
            id: "professional",
            name: "Professional Plan",
            _id: proPlan._id,
            monthlyPrice: proPlan.monthlyPrice || 0,
            yearlyPrice: proPlan.yearlyPrice || 0,
            features: [
                "Includes All Basic Features",
                `Up to ${proPlan.maxRFPProposalGenerations || 0} AI - RFP Proposal Generations per month`,
                `Up to ${proPlan.maxGrantProposalGenerations || 0} AI - Grant Proposal Generations per month`,
                `${proPlan.maxEditors || 0} Editors, ${proPlan.maxViewers || 0} Viewers, Unlimited Members`,
                "Advanced Compliance Check",
                "AI Image Generation for Proposals",
                "AI Chat Assist",
                "AI Scoring System",
                "AI Competitor Industry Insights",
                "RFP Matchmaking",
            ],
            missingFeatures: ["Dedicated Support"],
            popular: mostPopularPlan === "Pro",
        },
    ];

    if (!enterprisePlan.isContact) {
        plans.push({
            id: "enterprise",
            name: "Enterprise Plan",
            _id: enterprisePlan._id,
            monthlyPrice: enterprisePlan.monthlyPrice || 0,
            yearlyPrice: enterprisePlan.yearlyPrice || 0,
            features: [
                "Includes All Basic & Pro Features",
                `Up to ${enterprisePlan.maxRFPProposalGenerations || 0} AI - RFP Proposal Generations per month`,
                `Up to ${enterprisePlan.maxGrantProposalGenerations || 0} AI - Grant Proposal Generations per month`,
                "Unlimited Editors, Unlimited Viewers, Unlimited Members",
                "Dedicated Support",
            ],
            missingFeatures: [],
            popular: mostPopularPlan === "Enterprise",
        });
    }

    return plans;
};

const StripeHostedPaymentPage = () => {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const { subscriptionPlans, mostPopularPlan } = useSubscriptionPlans();
    const checkoutRef = useRef(null);

    const stripeConfig = getStripeConfigStatus();

    const subscriptionPlansData = useMemo(() => buildSubscriptionPlans(subscriptionPlans, mostPopularPlan), [subscriptionPlans, mostPopularPlan]);

    const [selectedPlan, setSelectedPlan] = useState(null);
    const [billingCycle, setBillingCycle] = useState('monthly');
    const [showCheckout, setShowCheckout] = useState(false);
    const [paymentSuccess, setPaymentSuccess] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (subscriptionPlansData.length > 0) {
            setIsLoading(false);
        }
    }, [subscriptionPlansData]);

    useEffect(() => {
        if (searchParams.get('success') === 'true') {
            setPaymentSuccess(true);
            setSelectedPlan(null);
            setShowCheckout(false);
            setSearchParams({}, { replace: true });
            setTimeout(() => {
                navigate('/login');
            }, 2500);
        } else if (searchParams.get('canceled') === 'true') {
            Swal.fire({
                title: 'Payment cancelled',
                icon: "info",
                text: 'You have cancelled the payment on the Stripe checkout page.',
                timer: 3000,
                showConfirmButton: false,
                showCancelButton: false,
            });
            setSearchParams({}, { replace: true });
        }
    }, [searchParams, navigate, setSearchParams]);

    const handlePlanSelect = (plan) => {
        setSelectedPlan(plan);
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
        if (!selectedPlan || !selectedPlan._id) {
            setError('No plan selected. Please choose a plan to continue.');
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

            const successUrl = `${window.location.origin}/payment/hosted?success=true`;
            const cancelUrl = `${window.location.origin}/payment/hosted?canceled=true`;

            const response = await axios.post(
                `${baseUrl}${STRIPE_CONFIG.API_ENDPOINTS.CREATE_CHECKOUT_SESSION}`,
                {
                    planId: selectedPlan._id,
                    billingCycle,
                    successUrl,
                    cancelUrl,
                },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            if (response.data?.url) {
                //Open the url in a new tab
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
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Loading Plans...</h2>
                    <p className="text-gray-600">
                        Please wait while we load your subscription options.
                    </p>
                </div>
            </div>
        );
    }

    if (paymentSuccess) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FaCheck className="w-8 h-8 text-green-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h2>
                    <p className="text-gray-600 mb-6">
                        Your payment was completed through Stripe Checkout. You’ll be redirected to login shortly.
                    </p>
                    <div className="animate-pulse">
                        <div className="w-2 h-2 bg-green-500 rounded-full mx-auto"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (subscriptionPlansData.length === 0) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
                    <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FaBan className="w-8 h-8 text-yellow-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">No Plans Available</h2>
                    <p className="text-gray-600 mb-6">
                        We couldn’t load any subscription plans. Please try again later or contact support.
                    </p>
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
                        Choose Your Plan
                    </h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Select the perfect plan for your RFP management needs. Checkout is powered by Stripe’s hosted payment page.
                    </p>
                </div>

                <div className="flex justify-center mb-8">
                    <div className="bg-white rounded-full p-1 shadow-lg border">
                        <div className="flex">
                            <button
                                onClick={() => setBillingCycle('monthly')}
                                className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 ${billingCycle === 'monthly'
                                    ? 'bg-[#6C63FF] text-white shadow-md'
                                    : 'text-gray-600 hover:text-gray-900'
                                    }`}
                            >
                                Monthly
                            </button>
                            <button
                                onClick={() => setBillingCycle('yearly')}
                                className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 ${billingCycle === 'yearly'
                                    ? 'bg-[#6C63FF] text-white shadow-md'
                                    : 'text-gray-600 hover:text-gray-900'
                                    }`}
                            >
                                Yearly
                            </button>
                        </div>
                    </div>
                </div>

                <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${subscriptionPlansData?.length === 2 ? 2 : 3} gap-8 mb-12 justify-center items-stretch w-full mx-auto`}>
                    {subscriptionPlansData.map((plan) => (
                        <div
                            key={plan.id}
                            className={`bg-white rounded-2xl shadow-lg relative border-2 transition-all duration-300 hover:shadow-xl ${plan.popular ? 'border-[#6C63FF]' : 'border-[#E5E7EB]'
                                } ${selectedPlan?.id === plan.id ? 'ring-2 ring-[#6C63FF] ring-opacity-50' : ''}`}
                        >
                            {plan.popular && (
                                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                                    <span className="bg-gradient-to-r from-[#6C63FF] to-[#8B7CF6] text-white text-xs font-semibold px-4 py-1 rounded-full">
                                        Most Popular
                                    </span>
                                </div>
                            )}

                            <div className="p-8">
                                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                                <div className="mb-6">
                                    <span className="text-4xl font-bold text-gray-900">
                                        ${billingCycle === 'yearly' ? plan.yearlyPrice : plan.monthlyPrice}
                                    </span>
                                    <span className="text-gray-600">
                                        /{billingCycle === 'yearly' ? 'year' : 'month'}
                                    </span>
                                </div>

                                <ul className="space-y-3 mb-8">
                                    {plan.features.map((feature, index) => (
                                        <li key={index} className="flex items-start">
                                            <FaCheck className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                                            <span className="text-gray-700">{feature}</span>
                                        </li>
                                    ))}
                                    {plan.missingFeatures.map((feature, index) => (
                                        <li key={index} className="flex items-start">
                                            <FaBan className="w-5 h-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" />
                                            <span className="text-gray-700">{feature}</span>
                                        </li>
                                    ))}
                                </ul>

                                <button
                                    onClick={() => handlePlanSelect(plan)}
                                    className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-200 ${plan.popular
                                        ? 'bg-gradient-to-r from-[#6C63FF] to-[#8B7CF6] text-white hover:from-[#5A52E8] hover:to-[#7A6CF0]'
                                        : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                                        }`}
                                >
                                    {selectedPlan?.id === plan.id ? 'Selected' : 'Choose Plan'}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {showCheckout && selectedPlan && (
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
                                        <span className="text-gray-600">Plan:</span>
                                        <span className="font-medium">{selectedPlan.name}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Billing Cycle:</span>
                                        <span className="font-medium capitalize">{billingCycle}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Amount:</span>
                                        <span className="font-bold text-lg">
                                            ${billingCycle === 'yearly' ? selectedPlan.yearlyPrice : selectedPlan.monthlyPrice}
                                        </span>
                                    </div>
                                    {billingCycle === 'yearly' && (
                                        <div className="flex justify-between text-green-600">
                                            <span>Yearly Savings:</span>
                                            <span className="font-medium">
                                                ${Math.round((selectedPlan.monthlyPrice * 12 - selectedPlan.yearlyPrice) / 12)}/month
                                            </span>
                                        </div>
                                    )}
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
                        Why Choose Our Platform?
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
        </div>
    );
};

export default StripeHostedPaymentPage;


