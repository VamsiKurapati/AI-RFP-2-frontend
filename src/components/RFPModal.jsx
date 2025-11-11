import { useNavigate } from 'react-router-dom';
import { MdOutlineClose } from 'react-icons/md';

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

const hasMeaningfulValue = (value) => {
    if (value === null || value === undefined) return false;
    if (typeof value !== 'string') return true;

    const trimmed = value.trim();
    if (!trimmed) return false;

    const lower = trimmed.toLowerCase();
    return lower !== 'not provided' && lower !== 'not specified';
};

const RFPModal = ({ item, type, isOpen, onClose }) => {
    const navigate = useNavigate();

    if (!isOpen || !item) return null;

    const isRFP = type === 'rfp';

    // Extract fields based on type
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

    const budget = isRFP
        ? (item.budget === 'Not found' ? 'Not Disclosed' : item.budget || 'Not Disclosed')
        : (item.AWARD_CEILING === 'none' ? 'Not Disclosed' : item.AWARD_CEILING ? `$${item.AWARD_CEILING}` : 'Not Disclosed');

    const description = isRFP
        ? (item.description || 'Not Provided')
        : (item.FUNDING_DESCRIPTION || 'Not Provided');

    const externalUrl = isRFP
        ? (item.link || item.url || item.urlLink)
        : (item.OPPORTUNITY_NUMBER_LINK || item.LINK_TO_ADDITIONAL_INFORMATION || item.url || item.urlLink || item.link);

    const docsLink = item.docsLink || item.DOCS_LINK || '';
    const office = item.office || item.OFFICE || '';
    const issuingOffice = item.issuingOffice || item.ISSUING_OFFICE || '';
    const stateOrProvince = item.state || item.STATE || '';
    const country = item.country || item.COUNTRY || '';
    const location = [stateOrProvince, country].filter((part) => part && part !== 'Not Provided' && part !== 'Not specified').join(', ');
    const matchScoreDisplay = typeof item.match === 'number' ? `${item.match.toFixed(2)}%` : item.match;
    const hasDocsLink = hasMeaningfulValue(docsLink);

    // Format date helper
    const formatDate = (dateString) => {
        if (!dateString || dateString === 'Not Provided' || dateString === 'Not Disclosed') return 'Not Provided';
        try {
            return new Date(dateString).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        } catch (e) {
            return dateString;
        }
    };

    const handleViewFullDetails = () => {
        navigate('/rfp-details', {
            state: {
                item,
                type: isRFP ? 'rfp' : 'grant'
            }
        });
        onClose();
    };

    const handleExternalLink = (e) => {
        e.stopPropagation();
        if (externalUrl && externalUrl !== '#') {
            window.open(externalUrl, '_blank', 'noopener,noreferrer');
        }
    };

    const handleDocsLink = (e) => {
        e.stopPropagation();
        if (hasDocsLink) {
            window.open(docsLink, '_blank', 'noopener,noreferrer');
        }
    };

    // Truncate description for modal preview
    const truncatedDescription = description && description.length > 300
        ? description.substring(0, 300) + '...'
        : description;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                {/* Modal Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
                    <h2 className="text-2xl font-semibold text-gray-900 pr-4">{title}</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 transition-colors shrink-0"
                        aria-label="Close modal"
                        title="Close modal"
                    >
                        <MdOutlineClose className="w-6 h-6" />
                    </button>
                </div>

                {/* Modal Body */}
                <div className="p-6 space-y-4">
                    <div>
                        <label className="text-sm font-medium text-gray-500">
                            {isRFP ? 'Organization' : 'Agency Name'}
                        </label>
                        <p className="text-lg text-gray-900 mt-1">{organizationOrAgency}</p>
                    </div>

                    {isRFP && hasMeaningfulValue(office) && (
                        <div>
                            <label className="text-sm font-medium text-gray-500">Office</label>
                            <p className="text-lg text-gray-900 mt-1">{office}</p>
                        </div>
                    )}

                    {isRFP && hasMeaningfulValue(issuingOffice) && (
                        <div>
                            <label className="text-sm font-medium text-gray-500">Issuing Office</label>
                            <p className="text-lg text-gray-900 mt-1">{issuingOffice}</p>
                        </div>
                    )}

                    {hasMeaningfulValue(location) && (
                        <div>
                            <label className="text-sm font-medium text-gray-500">Location</label>
                            <p className="text-lg text-gray-900 mt-1">{location}</p>
                        </div>
                    )}

                    <div>
                        <label className="text-sm font-medium text-gray-500">
                            {isRFP ? 'Deadline' : 'Close Date / Due Date'}
                        </label>
                        <p className="text-lg text-gray-900 mt-1">{formatDate(deadline)}</p>
                    </div>

                    {isRFP && hasMeaningfulValue(matchScoreDisplay) && (
                        <div>
                            <label className="text-sm font-medium text-gray-500">Match Score</label>
                            <p className="text-lg text-gray-900 mt-1">{matchScoreDisplay}</p>
                        </div>
                    )}

                    <div>
                        <label className="text-sm font-medium text-gray-500">
                            {isRFP ? 'Budget' : 'Award Ceiling'}
                        </label>
                        <p className="text-lg text-gray-900 mt-1">{budget}</p>
                    </div>

                    <div>
                        <label className="text-sm font-medium text-gray-500">Status</label>
                        <div className="mt-1">{statusBadge(status)}</div>
                    </div>

                    {isRFP && item.solicitationNumber && (
                        <div>
                            <label className="text-sm font-medium text-gray-500">Solicitation Number</label>
                            <p className="text-lg text-gray-900 mt-1">{item.solicitationNumber}</p>
                        </div>
                    )}

                    {!isRFP && item.OPPORTUNITY_NUMBER && (
                        <div>
                            <label className="text-sm font-medium text-gray-500">Opportunity Number</label>
                            <p className="text-lg text-gray-900 mt-1">{item.OPPORTUNITY_NUMBER}</p>
                        </div>
                    )}

                    {description && (
                        <div>
                            <label className="text-sm font-medium text-gray-500">
                                {isRFP ? 'Description' : 'Funding Description'}
                            </label>
                            <p className="text-gray-900 mt-1 whitespace-pre-wrap">{truncatedDescription}</p>
                        </div>
                    )}
                </div>

                {/* Modal Footer */}
                <div className="flex items-center justify-end gap-4 p-6 border-t border-gray-200 sticky bottom-0 bg-white">
                    {isRFP ? (
                        <button
                            onClick={handleDocsLink}
                            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={!hasDocsLink}
                            title={hasDocsLink ? "View related documents" : "Documents link not available"}
                        >
                            View Documents
                        </button>
                    ) : (
                        hasDocsLink && (
                            <button
                                onClick={handleDocsLink}
                                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                                title="View related documents"
                            >
                                View Documents
                            </button>
                        )
                    )}
                    <button
                        onClick={handleExternalLink}
                        className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={!externalUrl || externalUrl === '#'}
                        title={!externalUrl || externalUrl === '#' ? "No external link available" : "View external link in a new tab"}
                    >
                        View External Link
                    </button>
                    <button
                        onClick={handleViewFullDetails}
                        className="px-6 py-2 bg-[#2563EB] text-white rounded-md hover:bg-[#1D4ED8] transition-colors font-medium"
                        title="View full details about this RFP/Grant"
                    >
                        View Full Details
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RFPModal;

