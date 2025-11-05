import { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import axios from 'axios';
import NavbarComponent from './NavbarComponent';
import { MdOutlineArrowBack, MdOutlineOpenInNew } from 'react-icons/md';

const statusBadge = (status) => {
    const statusStyles = {
        "In Progress": "bg-[#DBEAFE] text-[#2563EB]",
        "Won": "bg-[#FEF9C3] text-[#CA8A04]",
        "Submitted": "bg-[#DCFCE7] text-[#16A34A]",
        "Rejected": "bg-[#FEE2E2] text-[#DC2626]",
        "Posted": "bg-[#DBEAFE] text-[#2563EB]",
        "Forecasted": "bg-[#FEF3C7] text-[#F59E42]",
        "Closed": "bg-[#FEE2E2] text-[#DC2626]",
        "Archived": "bg-[#F3F4F6] text-[#6B7280]",
    };

    return (
        <span className={`px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap inline-block ${statusStyles[status] || 'bg-gray-100 text-gray-700'}`}>
            {status}
        </span>
    );
};

const ProposalDetails = () => {
    const location = useLocation();
    const [searchParams] = useSearchParams();
    const type = searchParams.get('type') || 'rfp';
    const navigate = useNavigate();
    const [proposal, setProposal] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const isRFP = type === 'rfp';
    const BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/dashboard`;

    const proposalDetails = location.state?.proposal;

    useEffect(() => {
        const fetchProposalDetails = async () => {
            setLoading(true);
            setError(null);
            try {
                const token = localStorage.getItem('token');

                // First try dedicated endpoint (if it exists)
                try {
                    const id = isRFP
                        ? (proposalDetails.rfpId || proposalDetails._id)
                        : (proposalDetails.grantId || proposalDetails._id);

                    const endpoint = isRFP
                        ? `${BASE_URL}/getRFPDetails/${id}`
                        : `${BASE_URL}/getGrantDetails/${id}`;

                    const res = await axios.get(endpoint, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });

                    if (res.status === 200 && res.data) {
                        setProposal(res.data);
                        setLoading(false);
                        return;
                    }
                } catch (dedicatedErr) {
                    // If dedicated endpoint doesn't exist, fall back to dashboard data
                    console.log('Dedicated endpoint not available, using dashboard data');
                    // Use data from location.state if available
                    if (proposalDetails) {
                        setProposal(proposalDetails);
                        setLoading(false);
                        return;
                    }
                }
            } catch (err) {
                // If there's an error, try to use data from location.state
                if (proposalDetails) {
                    setProposal(proposalDetails);
                    setLoading(false);
                    return;
                }
                setError(err.response?.data?.message || 'Failed to load proposal details');
            } finally {
                setLoading(false);
            }
        };

        if (proposalDetails) {
            fetchProposalDetails();
        }
    }, [proposalDetails, type, isRFP, BASE_URL]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="flex flex-col items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
                    <p className="text-gray-500 mt-4">Loading proposal details...</p>
                </div>
            </div>
        );
    }

    if (error || !proposal) {
        return (
            <div className="min-h-screen">
                <NavbarComponent />
                <main className="w-full mx-auto py-8 px-4 md:px-12 mt-20">
                    <div className="bg-white rounded-lg shadow p-6">
                        <p className="text-red-600">{error || 'Proposal not found'}</p>
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="mt-4 px-4 py-2 bg-[#2563EB] text-white rounded-md hover:bg-[#1D4ED8] transition-colors"
                            title="Return to dashboard"
                        >
                            Back to Dashboard
                        </button>
                    </div>
                </main>
            </div>
        );
    }

    // Extract common fields
    const title = isRFP
        ? (proposal.title || proposal.OPPORTUNITY_TITLE || 'Not Provided')
        : (proposal.OPPORTUNITY_TITLE || proposal.title || 'Not Provided');
    const clientOrAgency = isRFP
        ? (proposal.organization || proposal.client || 'Not Provided')
        : (proposal.AGENCY_NAME || proposal.client || 'Not Provided');
    const deadline = isRFP
        ? (proposal.deadline || proposal.CLOSE_DATE)
        : (proposal.CLOSE_DATE || proposal.ESTIMATED_APPLICATION_DUE_DATE || proposal.deadline);
    const status = isRFP
        ? (proposal.status || proposal.type || 'Not Provided')
        : (proposal.OPPORTUNITY_STATUS || proposal.status || 'Not Provided');
    const submittedAt = proposal.submittedAt;
    const description = isRFP
        ? proposal.description
        : (proposal.FUNDING_DESCRIPTION || proposal.description);
    const externalUrl = isRFP
        ? (proposal.link || proposal.url || proposal.urlLink)
        : (proposal.OPPORTUNITY_NUMBER_LINK || proposal.LINK_TO_ADDITIONAL_INFORMATION || proposal.url || proposal.urlLink || proposal.link);

    const handleExternalLink = () => {
        if (externalUrl && externalUrl !== '#') {
            window.open(externalUrl, '_blank', 'noopener,noreferrer');
        }
    };

    // Format date helper
    const formatDate = (dateString) => {
        if (!dateString) return 'Not Provided';
        try {
            return new Date(dateString).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        } catch (e) {
            return dateString;
        }
    };

    // Format currency helper
    const formatCurrency = (amount) => {
        if (!amount || amount === 'Not Found' || amount === 'Not Provided') return 'Not Provided';
        if (typeof amount === 'string' && isNaN(amount)) return amount;
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(parseFloat(amount));
    };

    // Format HTML content helper
    const formatHTML = (htmlString) => {
        if (!htmlString) return null;
        return { __html: htmlString };
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <NavbarComponent />
            <main className="w-full mx-auto py-8 px-4 md:px-12 mt-20 max-w-6xl">
                {/* Back Button */}
                <button
                    onClick={() => navigate('/dashboard')}
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
                    title="Return to dashboard"
                >
                    <MdOutlineArrowBack className="w-5 h-5" />
                    <span>Back to Dashboard</span>
                </button>

                {/* Proposal Details Card */}
                <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
                    <div className="border-b border-gray-200 pb-6 mb-6">
                        <div className="flex items-start gap-4 mb-4">
                            {isRFP && proposal.logo && (
                                <img
                                    src={proposal.logo}
                                    alt="Organization logo"
                                    className="w-16 h-16 object-contain"
                                    onError={(e) => {
                                        e.target.style.display = 'none';
                                    }}
                                />
                            )}
                            <div className="flex-1">
                                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{title}</h1>
                                <div className="flex items-center gap-3">
                                    {statusBadge(status)}
                                    <span className="text-sm text-gray-500">
                                        {isRFP ? 'RFP Proposal' : 'Grant Proposal'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-500 mb-2">
                                {isRFP ? 'Organization' : 'Agency Name'}
                            </label>
                            <p className="text-lg text-gray-900">{clientOrAgency}</p>
                        </div>

                        {isRFP && proposal.organizationType && (
                            <div>
                                <label className="block text-sm font-medium text-gray-500 mb-2">
                                    Organization Type
                                </label>
                                <p className="text-lg text-gray-900">{proposal.organizationType}</p>
                            </div>
                        )}

                        {!isRFP && proposal.AGENCY_CODE && (
                            <div>
                                <label className="block text-sm font-medium text-gray-500 mb-2">
                                    Agency Code
                                </label>
                                <p className="text-lg text-gray-900">{proposal.AGENCY_CODE}</p>
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-gray-500 mb-2">
                                {isRFP ? 'Deadline' : 'Close Date / Due Date'}
                            </label>
                            <p className="text-lg text-gray-900">
                                {deadline ? formatDate(deadline) : 'Not Provided'}
                            </p>
                        </div>

                        {!isRFP && proposal.ESTIMATED_APPLICATION_DUE_DATE && (
                            <div>
                                <label className="block text-sm font-medium text-gray-500 mb-2">
                                    Estimated Application Due Date
                                </label>
                                <p className="text-lg text-gray-900">
                                    {formatDate(proposal.ESTIMATED_APPLICATION_DUE_DATE)}
                                </p>
                            </div>
                        )}

                        {!isRFP && proposal.POSTED_DATE && (
                            <div>
                                <label className="block text-sm font-medium text-gray-500 mb-2">
                                    Posted Date
                                </label>
                                <p className="text-lg text-gray-900">
                                    {formatDate(proposal.POSTED_DATE)}
                                </p>
                            </div>
                        )}

                        {!isRFP && proposal.ESTIMATED_POST_DATE && (
                            <div>
                                <label className="block text-sm font-medium text-gray-500 mb-2">
                                    Estimated Post Date
                                </label>
                                <p className="text-lg text-gray-900">
                                    {formatDate(proposal.ESTIMATED_POST_DATE)}
                                </p>
                            </div>
                        )}

                        {isRFP && proposal.solicitationNumber && (
                            <div>
                                <label className="block text-sm font-medium text-gray-500 mb-2">
                                    Solicitation Number
                                </label>
                                <p className="text-lg text-gray-900">{proposal.solicitationNumber}</p>
                            </div>
                        )}

                        {!isRFP && proposal.OPPORTUNITY_NUMBER && (
                            <div>
                                <label className="block text-sm font-medium text-gray-500 mb-2">
                                    Opportunity Number
                                </label>
                                <p className="text-lg text-gray-900">{proposal.OPPORTUNITY_NUMBER}</p>
                            </div>
                        )}

                        {isRFP && proposal.match !== undefined && (
                            <div>
                                <label className="block text-sm font-medium text-gray-500 mb-2">
                                    Match Score
                                </label>
                                <p className="text-lg text-gray-900">{proposal.match.toFixed(2)}%</p>
                            </div>
                        )}

                        {isRFP && proposal.budget && proposal.budget !== 'Not Found' && (
                            <div>
                                <label className="block text-sm font-medium text-gray-500 mb-2">
                                    Budget
                                </label>
                                <p className="text-lg text-gray-900">{proposal.budget}</p>
                            </div>
                        )}

                        {!isRFP && proposal.ESTIMATED_TOTAL_FUNDING && (
                            <div>
                                <label className="block text-sm font-medium text-gray-500 mb-2">
                                    Estimated Total Funding
                                </label>
                                <p className="text-lg text-gray-900">
                                    {formatCurrency(proposal.ESTIMATED_TOTAL_FUNDING)}
                                </p>
                            </div>
                        )}

                        {!isRFP && proposal.AWARD_CEILING && (
                            <div>
                                <label className="block text-sm font-medium text-gray-500 mb-2">
                                    Award Ceiling
                                </label>
                                <p className="text-lg text-gray-900">
                                    {formatCurrency(proposal.AWARD_CEILING)}
                                </p>
                            </div>
                        )}

                        {!isRFP && proposal.AWARD_FLOOR && (
                            <div>
                                <label className="block text-sm font-medium text-gray-500 mb-2">
                                    Award Floor
                                </label>
                                <p className="text-lg text-gray-900">
                                    {formatCurrency(proposal.AWARD_FLOOR)}
                                </p>
                            </div>
                        )}

                        {!isRFP && proposal.EXPECTED_NUMBER_OF_AWARDS && (
                            <div>
                                <label className="block text-sm font-medium text-gray-500 mb-2">
                                    Expected Number of Awards
                                </label>
                                <p className="text-lg text-gray-900">{proposal.EXPECTED_NUMBER_OF_AWARDS}</p>
                            </div>
                        )}

                        {isRFP && proposal.baseType && (
                            <div>
                                <label className="block text-sm font-medium text-gray-500 mb-2">
                                    Base Type
                                </label>
                                <p className="text-lg text-gray-900">{proposal.baseType}</p>
                            </div>
                        )}

                        {isRFP && proposal.setAside && (
                            <div>
                                <label className="block text-sm font-medium text-gray-500 mb-2">
                                    Set Aside
                                </label>
                                <p className="text-lg text-gray-900">{proposal.setAside}</p>
                            </div>
                        )}

                        {isRFP && proposal.fundingType && proposal.fundingType !== 'Not found' && (
                            <div>
                                <label className="block text-sm font-medium text-gray-500 mb-2">
                                    Funding Type
                                </label>
                                <p className="text-lg text-gray-900">{proposal.fundingType}</p>
                            </div>
                        )}

                        {!isRFP && proposal.FUNDING_INSTRUMENT_TYPE && (
                            <div>
                                <label className="block text-sm font-medium text-gray-500 mb-2">
                                    Funding Instrument Type
                                </label>
                                <p className="text-lg text-gray-900">{proposal.FUNDING_INSTRUMENT_TYPE}</p>
                            </div>
                        )}

                        {!isRFP && proposal.CATEGORY_OF_FUNDING_ACTIVITY && (
                            <div>
                                <label className="block text-sm font-medium text-gray-500 mb-2">
                                    Category of Funding Activity
                                </label>
                                <p className="text-lg text-gray-900">{proposal.CATEGORY_OF_FUNDING_ACTIVITY}</p>
                            </div>
                        )}

                        {!isRFP && proposal.ASSISTANCE_LISTINGS && (
                            <div>
                                <label className="block text-sm font-medium text-gray-500 mb-2">
                                    Assistance Listings
                                </label>
                                <p className="text-lg text-gray-900">{proposal.ASSISTANCE_LISTINGS}</p>
                            </div>
                        )}

                        {!isRFP && proposal.COST_SHARING_MATCH_REQUIRMENT && (
                            <div>
                                <label className="block text-sm font-medium text-gray-500 mb-2">
                                    Cost Sharing Match Requirement
                                </label>
                                <p className="text-lg text-gray-900">{proposal.COST_SHARING_MATCH_REQUIRMENT}</p>
                            </div>
                        )}

                        {!isRFP && proposal.ELIGIBLE_APPLICANTS && (
                            <div>
                                <label className="block text-sm font-medium text-gray-500 mb-2">
                                    Eligible Applicants
                                </label>
                                <p className="text-lg text-gray-900">{proposal.ELIGIBLE_APPLICANTS}</p>
                            </div>
                        )}

                        {submittedAt && (
                            <div>
                                <label className="block text-sm font-medium text-gray-500 mb-2">
                                    Submission Date
                                </label>
                                <p className="text-lg text-gray-900">{formatDate(submittedAt)}</p>
                            </div>
                        )}
                    </div>

                    {/* Description Section */}
                    {description && (
                        <div className="mt-8 pt-6 border-t border-gray-200">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">
                                {isRFP ? 'Description' : 'Funding Description'}
                            </h2>
                            {isRFP ? (
                                <p className="text-gray-900 whitespace-pre-wrap">{description}</p>
                            ) : (
                                <div
                                    className="text-gray-900 prose prose-sm max-w-none"
                                    dangerouslySetInnerHTML={formatHTML(description)}
                                />
                            )}
                        </div>
                    )}

                    {/* Contact Information Section */}
                    {(isRFP && (proposal.contact || proposal.email)) ||
                        (!isRFP && (proposal.GRANTOR_CONTACT || proposal.GRANTOR_CONTACT_EMAIL || proposal.GRANTOR_CONTACT_PHONE)) ? (
                        <div className="mt-8 pt-6 border-t border-gray-200">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">Contact Information</h2>
                            <div className="space-y-4">
                                {isRFP && proposal.contact && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-500 mb-2">
                                            Contact
                                        </label>
                                        <div
                                            className="text-gray-900"
                                            dangerouslySetInnerHTML={{ __html: proposal.contact }}
                                        />
                                    </div>
                                )}

                                {isRFP && proposal.email && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-500 mb-2">
                                            Email
                                        </label>
                                        <p className="text-gray-900">{proposal.email}</p>
                                    </div>
                                )}

                                {!isRFP && proposal.GRANTOR_CONTACT && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-500 mb-2">
                                            Grantor Contact
                                        </label>
                                        <p className="text-gray-900">{proposal.GRANTOR_CONTACT}</p>
                                    </div>
                                )}

                                {!isRFP && proposal.GRANTOR_CONTACT_EMAIL && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-500 mb-2">
                                            Grantor Contact Email
                                        </label>
                                        <p className="text-gray-900">{proposal.GRANTOR_CONTACT_EMAIL}</p>
                                    </div>
                                )}

                                {!isRFP && proposal.GRANTOR_CONTACT_PHONE && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-500 mb-2">
                                            Grantor Contact Phone
                                        </label>
                                        <p className="text-gray-900">{proposal.GRANTOR_CONTACT_PHONE}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : null}

                    {/* Additional Information Section */}
                    {(isRFP && proposal.timeline) || (!isRFP && proposal.FUNDING_CATEGORY_EXPLANATION) ? (
                        <div className="mt-8 pt-6 border-t border-gray-200">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">Additional Information</h2>
                            <div className="space-y-4">
                                {isRFP && proposal.timeline && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-500 mb-2">
                                            Timeline
                                        </label>
                                        <p className="text-gray-900 whitespace-pre-wrap">{proposal.timeline}</p>
                                    </div>
                                )}

                                {!isRFP && proposal.FUNDING_CATEGORY_EXPLANATION && proposal.FUNDING_CATEGORY_EXPLANATION !== 'Not Provided' && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-500 mb-2">
                                            Funding Category Explanation
                                        </label>
                                        <p className="text-gray-900">{proposal.FUNDING_CATEGORY_EXPLANATION}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : null}

                    {/* External Links Section */}
                    {(externalUrl && externalUrl !== '#') || (!isRFP && proposal.LINK_TO_ADDITIONAL_INFORMATION) ? (
                        <div className="mt-8 pt-6 border-t border-gray-200">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">External Links</h2>
                            <div className="flex flex-wrap gap-4">
                                {externalUrl && externalUrl !== '#' && (
                                    <button
                                        onClick={handleExternalLink}
                                        className="flex items-center gap-2 px-6 py-3 bg-[#2563EB] text-white rounded-md hover:bg-[#1D4ED8] transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98] font-medium"
                                        title="Open the original RFP/Grant posting in a new tab"
                                    >
                                        <span>{isRFP ? 'View on SAM.gov' : 'View on Grants.gov'}</span>
                                        <MdOutlineOpenInNew className="w-5 h-5" />
                                    </button>
                                )}
                                {!isRFP && proposal.LINK_TO_ADDITIONAL_INFORMATION && (
                                    <button
                                        onClick={() => window.open(proposal.LINK_TO_ADDITIONAL_INFORMATION, '_blank', 'noopener,noreferrer')}
                                        className="flex items-center gap-2 px-6 py-3 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98] font-medium"
                                        title="Open additional information document"
                                    >
                                        <span>View Additional Information</span>
                                        <MdOutlineOpenInNew className="w-5 h-5" />
                                    </button>
                                )}
                            </div>
                        </div>
                    ) : null}
                </div>
            </main>
        </div>
    );
};

export default ProposalDetails;


