import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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
        "Matched": "bg-[#DBEAFE] text-[#2563EB]",
    };

    return (
        <span className={`px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap inline-block ${statusStyles[status] || 'bg-gray-100 text-gray-700'}`}>
            {status}
        </span>
    );
};

const RFPDetails = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [item, setItem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const itemData = location.state?.item;
    const type = location.state?.type || 'rfp';
    const isRFP = type === 'rfp';

    useEffect(() => {
        if (itemData) {
            setItem(itemData);
            setLoading(false);
        } else {
            setError('Item not found');
            setLoading(false);
        }
    }, [itemData]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="flex flex-col items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
                    <p className="text-gray-500 mt-4">Loading details...</p>
                </div>
            </div>
        );
    }

    if (error || !item) {
        return (
            <div className="min-h-screen">
                <NavbarComponent />
                <main className="w-full mx-auto py-8 px-4 md:px-12 mt-20">
                    <div className="bg-white rounded-lg shadow p-6">
                        <p className="text-red-600">{error || 'Item not found'}</p>
                        <button
                            onClick={() => navigate('/discover')}
                            className="mt-4 px-4 py-2 bg-[#2563EB] text-white rounded-md hover:bg-[#1D4ED8] transition-colors"
                            title="Return to discovery page"
                        >
                            Back to Discovery
                        </button>
                    </div>
                </main>
            </div>
        );
    }

    // Extract common fields
    const title = isRFP
        ? (item.title || 'Not Provided')
        : (item.OPPORTUNITY_TITLE || 'Not Provided');
    const organizationOrAgency = isRFP
        ? (item.organization || 'Not Provided')
        : (item.AGENCY_NAME || 'Not Provided');
    const deadline = isRFP
        ? (item.deadline || 'Not Provided')
        : (item.CLOSE_DATE || item.ESTIMATED_APPLICATION_DUE_DATE || 'Not Provided');
    const status = isRFP
        ? (item.type || 'Not Provided')
        : (item.OPPORTUNITY_STATUS || 'Not Provided');
    const description = isRFP
        ? item.description
        : (item.FUNDING_DESCRIPTION || '');
    const externalUrl = isRFP
        ? (item.link || item.url || item.urlLink)
        : (item.OPPORTUNITY_NUMBER_LINK || item.LINK_TO_ADDITIONAL_INFORMATION || item.url || item.urlLink || item.link);

    const handleExternalLink = () => {
        if (externalUrl && externalUrl !== '#') {
            window.open(externalUrl, '_blank', 'noopener,noreferrer');
        }
    };

    // Format date helper
    const formatDate = (dateString) => {
        if (!dateString || dateString === 'Not Provided' || dateString === 'Not Disclosed') return 'Not Provided';
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
        if (!amount || amount === 'Not Found' || amount === 'Not Provided' || amount === 'none') return 'Not Provided';
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
                    onClick={() => navigate('/discover')}
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
                    title="Return to discovery page"
                >
                    <MdOutlineArrowBack className="w-5 h-5" />
                    <span>Back to Discovery</span>
                </button>

                {/* Details Card */}
                <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
                    <div className="border-b border-gray-200 pb-6 mb-6">
                        <div className="flex items-start gap-4 mb-4">
                            {isRFP && item.logo && item.logo !== "None" && (
                                <img
                                    src={item.logo}
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
                                        {isRFP ? 'RFP' : 'Grant'}
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
                            <p className="text-lg text-gray-900">{organizationOrAgency}</p>
                        </div>

                        {isRFP && item.organizationType && (
                            <div>
                                <label className="block text-sm font-medium text-gray-500 mb-2">
                                    Organization Type
                                </label>
                                <p className="text-lg text-gray-900">{item.organizationType}</p>
                            </div>
                        )}

                        {!isRFP && item.AGENCY_CODE && (
                            <div>
                                <label className="block text-sm font-medium text-gray-500 mb-2">
                                    Agency Code
                                </label>
                                <p className="text-lg text-gray-900">{item.AGENCY_CODE}</p>
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

                        {!isRFP && item.ESTIMATED_APPLICATION_DUE_DATE && (
                            <div>
                                <label className="block text-sm font-medium text-gray-500 mb-2">
                                    Estimated Application Due Date
                                </label>
                                <p className="text-lg text-gray-900">
                                    {formatDate(item.ESTIMATED_APPLICATION_DUE_DATE)}
                                </p>
                            </div>
                        )}

                        {!isRFP && item.POSTED_DATE && (
                            <div>
                                <label className="block text-sm font-medium text-gray-500 mb-2">
                                    Posted Date
                                </label>
                                <p className="text-lg text-gray-900">
                                    {formatDate(item.POSTED_DATE)}
                                </p>
                            </div>
                        )}

                        {!isRFP && item.ESTIMATED_POST_DATE && (
                            <div>
                                <label className="block text-sm font-medium text-gray-500 mb-2">
                                    Estimated Post Date
                                </label>
                                <p className="text-lg text-gray-900">
                                    {formatDate(item.ESTIMATED_POST_DATE)}
                                </p>
                            </div>
                        )}

                        {isRFP && item.solicitationNumber && (
                            <div>
                                <label className="block text-sm font-medium text-gray-500 mb-2">
                                    Solicitation Number
                                </label>
                                <p className="text-lg text-gray-900">{item.solicitationNumber}</p>
                            </div>
                        )}

                        {!isRFP && item.OPPORTUNITY_NUMBER && (
                            <div>
                                <label className="block text-sm font-medium text-gray-500 mb-2">
                                    Opportunity Number
                                </label>
                                <p className="text-lg text-gray-900">{item.OPPORTUNITY_NUMBER}</p>
                            </div>
                        )}

                        {isRFP && item.match !== undefined && (
                            <div>
                                <label className="block text-sm font-medium text-gray-500 mb-2">
                                    Match Score
                                </label>
                                <p className="text-lg text-gray-900">{item.match.toFixed(2)}%</p>
                            </div>
                        )}

                        {isRFP && item.budget && item.budget !== 'Not Found' && item.budget !== 'Not found' && (
                            <div>
                                <label className="block text-sm font-medium text-gray-500 mb-2">
                                    Budget
                                </label>
                                <p className="text-lg text-gray-900">{item.budget}</p>
                            </div>
                        )}

                        {!isRFP && item.ESTIMATED_TOTAL_FUNDING && (
                            <div>
                                <label className="block text-sm font-medium text-gray-500 mb-2">
                                    Estimated Total Funding
                                </label>
                                <p className="text-lg text-gray-900">
                                    {formatCurrency(item.ESTIMATED_TOTAL_FUNDING)}
                                </p>
                            </div>
                        )}

                        {!isRFP && item.AWARD_CEILING && item.AWARD_CEILING !== 'none' && (
                            <div>
                                <label className="block text-sm font-medium text-gray-500 mb-2">
                                    Award Ceiling
                                </label>
                                <p className="text-lg text-gray-900">
                                    {formatCurrency(item.AWARD_CEILING)}
                                </p>
                            </div>
                        )}

                        {!isRFP && item.AWARD_FLOOR && item.AWARD_FLOOR !== 'none' && (
                            <div>
                                <label className="block text-sm font-medium text-gray-500 mb-2">
                                    Award Floor
                                </label>
                                <p className="text-lg text-gray-900">
                                    {formatCurrency(item.AWARD_FLOOR)}
                                </p>
                            </div>
                        )}

                        {!isRFP && item.EXPECTED_NUMBER_OF_AWARDS && (
                            <div>
                                <label className="block text-sm font-medium text-gray-500 mb-2">
                                    Expected Number of Awards
                                </label>
                                <p className="text-lg text-gray-900">{item.EXPECTED_NUMBER_OF_AWARDS}</p>
                            </div>
                        )}

                        {isRFP && item.baseType && (
                            <div>
                                <label className="block text-sm font-medium text-gray-500 mb-2">
                                    Base Type
                                </label>
                                <p className="text-lg text-gray-900">{item.baseType}</p>
                            </div>
                        )}

                        {isRFP && item.setAside && (
                            <div>
                                <label className="block text-sm font-medium text-gray-500 mb-2">
                                    Set Aside
                                </label>
                                <p className="text-lg text-gray-900">{item.setAside}</p>
                            </div>
                        )}

                        {isRFP && item.fundingType && item.fundingType !== 'Not found' && (
                            <div>
                                <label className="block text-sm font-medium text-gray-500 mb-2">
                                    Funding Type
                                </label>
                                <p className="text-lg text-gray-900">{item.fundingType}</p>
                            </div>
                        )}

                        {!isRFP && item.FUNDING_INSTRUMENT_TYPE && (
                            <div>
                                <label className="block text-sm font-medium text-gray-500 mb-2">
                                    Funding Instrument Type
                                </label>
                                <p className="text-lg text-gray-900">{item.FUNDING_INSTRUMENT_TYPE}</p>
                            </div>
                        )}

                        {!isRFP && item.CATEGORY_OF_FUNDING_ACTIVITY && (
                            <div>
                                <label className="block text-sm font-medium text-gray-500 mb-2">
                                    Category of Funding Activity
                                </label>
                                <p className="text-lg text-gray-900">{item.CATEGORY_OF_FUNDING_ACTIVITY}</p>
                            </div>
                        )}

                        {!isRFP && item.ASSISTANCE_LISTINGS && (
                            <div>
                                <label className="block text-sm font-medium text-gray-500 mb-2">
                                    Assistance Listings
                                </label>
                                <p className="text-lg text-gray-900">{item.ASSISTANCE_LISTINGS}</p>
                            </div>
                        )}

                        {!isRFP && item.COST_SHARING_MATCH_REQUIRMENT && (
                            <div>
                                <label className="block text-sm font-medium text-gray-500 mb-2">
                                    Cost Sharing Match Requirement
                                </label>
                                <p className="text-lg text-gray-900">{item.COST_SHARING_MATCH_REQUIRMENT}</p>
                            </div>
                        )}

                        {!isRFP && item.ELIGIBLE_APPLICANTS && (
                            <div>
                                <label className="block text-sm font-medium text-gray-500 mb-2">
                                    Eligible Applicants
                                </label>
                                <p className="text-lg text-gray-900">{item.ELIGIBLE_APPLICANTS}</p>
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
                    {(isRFP && (item.contact || item.email)) ||
                        (!isRFP && (item.GRANTOR_CONTACT || item.GRANTOR_CONTACT_EMAIL || item.GRANTOR_CONTACT_PHONE)) ? (
                        <div className="mt-8 pt-6 border-t border-gray-200">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">Contact Information</h2>
                            <div className="space-y-4">
                                {isRFP && item.contact && item.contact !== 'Not Provided' && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-500 mb-2">
                                            Contact
                                        </label>
                                        <div
                                            className="text-gray-900"
                                            dangerouslySetInnerHTML={{ __html: item.contact }}
                                        />
                                    </div>
                                )}

                                {!isRFP && item.GRANTOR_CONTACT && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-500 mb-2">
                                            Grantor Contact
                                        </label>
                                        <p className="text-gray-900">{item.GRANTOR_CONTACT}</p>
                                    </div>
                                )}

                                {!isRFP && item.GRANTOR_CONTACT_EMAIL && item.GRANTOR_CONTACT_EMAIL !== 'Not Provided' && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-500 mb-2">
                                            Grantor Contact Email
                                        </label>
                                        <p className="text-gray-900">{item.GRANTOR_CONTACT_EMAIL}</p>
                                    </div>
                                )}

                                {!isRFP && item.GRANTOR_CONTACT_PHONE && item.GRANTOR_CONTACT_PHONE !== 'Not Provided' && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-500 mb-2">
                                            Grantor Contact Phone
                                        </label>
                                        <p className="text-gray-900">{item.GRANTOR_CONTACT_PHONE}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : null}

                    {/* Additional Information Section */}
                    {(isRFP && item.timeline) || (!isRFP && item.FUNDING_CATEGORY_EXPLANATION && item.FUNDING_CATEGORY_EXPLANATION !== 'Not Provided') ? (
                        <div className="mt-8 pt-6 border-t border-gray-200">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">Additional Information</h2>
                            <div className="space-y-4">
                                {isRFP && item.timeline && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-500 mb-2">
                                            Timeline
                                        </label>
                                        <p className="text-gray-900 whitespace-pre-wrap">{item.timeline}</p>
                                    </div>
                                )}

                                {!isRFP && item.FUNDING_CATEGORY_EXPLANATION && item.FUNDING_CATEGORY_EXPLANATION !== 'Not Provided' && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-500 mb-2">
                                            Funding Category Explanation
                                        </label>
                                        <p className="text-gray-900">{item.FUNDING_CATEGORY_EXPLANATION}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : null}

                    {/* External Links Section */}
                    {(externalUrl && externalUrl !== '#') || (!isRFP && item.LINK_TO_ADDITIONAL_INFORMATION && item.LINK_TO_ADDITIONAL_INFORMATION !== 'Not Provided') ? (
                        <div className="mt-8 pt-6 border-t border-gray-200">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">External Links</h2>
                            <div className="flex flex-wrap gap-4">
                                {externalUrl && externalUrl !== '#' && (
                                    <button
                                        onClick={handleExternalLink}
                                        className="flex items-center gap-2 px-6 py-3 bg-[#2563EB] text-white rounded-md hover:bg-[#1D4ED8] transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98] font-medium"
                                        title="Open the original RFP/Grant posting in a new tab"
                                    >
                                        <span>{isRFP ? 'View on RFPMart.com' : 'View on Grants.gov'}</span>
                                        <MdOutlineOpenInNew className="w-5 h-5" />
                                    </button>
                                )}
                                {!isRFP && item.LINK_TO_ADDITIONAL_INFORMATION && item.LINK_TO_ADDITIONAL_INFORMATION !== 'Not Provided' && (
                                    <button
                                        onClick={() => window.open(item.LINK_TO_ADDITIONAL_INFORMATION, '_blank', 'noopener,noreferrer')}
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

export default RFPDetails;

