import { useState } from 'react';
import { FaGoogle, FaMicrosoft } from 'react-icons/fa';
import { SiGooglecalendar } from 'react-icons/si';
import { MdOutlineClose } from 'react-icons/md';

const AddToCalendarButtons = ({ title, description, start, end }) => {
    const [showOutlookModal, setShowOutlookModal] = useState(false);
    // Format dates for Google Calendar (YYYYMMDDTHHmmss)
    const formatGoogleDate = (date) => {
        if (!date) return null;
        const d = new Date(date);
        if (isNaN(d.getTime())) return null;

        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        const hours = String(d.getHours()).padStart(2, '0');
        const minutes = String(d.getMinutes()).padStart(2, '0');
        const seconds = String(d.getSeconds()).padStart(2, '0');
        return `${year}${month}${day}T${hours}${minutes}${seconds}`;
    };

    // Format dates for Outlook Calendar (YYYYMMDDTHHmmssZ)
    const formatOutlookDate = (date) => {
        if (!date) return null;
        const d = new Date(date);
        if (isNaN(d.getTime())) return null;
        return d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    };

    // Create Google Calendar URL
    const googleCalendarUrl = () => {
        const startFormatted = formatGoogleDate(start);
        const endFormatted = formatGoogleDate(end);

        // Default to current date/time if dates are invalid
        const defaultDate = formatGoogleDate(new Date());
        const datesParam = startFormatted && endFormatted
            ? `${startFormatted}/${endFormatted}`
            : `${defaultDate}/${defaultDate}`;

        const params = new URLSearchParams({
            action: 'TEMPLATE',
            text: title || 'Event',
            details: description || '',
            dates: datesParam,
        });
        return `https://calendar.google.com/calendar/render?${params.toString()}`;
    };

    // Create Outlook Calendar URL
    const outlookCalendarUrl = (type = 'office') => {
        const startFormatted = start ? formatOutlookDate(start) : formatOutlookDate(new Date());
        const endFormatted = end ? formatOutlookDate(end) : formatOutlookDate(new Date());

        const params = new URLSearchParams({
            subject: title || 'Event',
            body: description || '',
            startdt: startFormatted || new Date().toISOString(),
            enddt: endFormatted || new Date().toISOString(),
        });

        const baseUrl = type === 'live'
            ? 'https://outlook.live.com/calendar/0/deeplink/compose'
            : 'https://outlook.office.com/calendar/0/deeplink/compose';

        return `${baseUrl}?${params.toString()}`;
    };

    const handleOutlookClick = (e) => {
        e.preventDefault();
        setShowOutlookModal(true);
    };

    const handleOutlookTypeSelection = (type) => {
        const url = outlookCalendarUrl(type);
        window.open(url, '_blank', 'noopener,noreferrer');
        setShowOutlookModal(false);
    };

    return (
        <div className="flex gap-1 mt-1">
            {/* <a
                href={googleCalendarUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition flex items-center justify-center"
                title="Add to Google Calendar"
            >
                <SiGooglecalendar className="w-3 h-3" />
            </a> */}
            <a
                href={googleCalendarUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-1.5 bg-[#4285F4] text-white text-xs rounded-md hover:bg-[#3367D6] transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-[1.02] active:scale-[0.98]"
                title="Add to Google Calendar"
            >
                <SiGooglecalendar className="w-3 h-3" />
            </a>
            <button
                onClick={handleOutlookClick}
                className="flex items-center gap-2 px-3 py-1.5 bg-[#4285F4] text-white text-xs rounded-md hover:bg-[#3367D6] transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-[1.02] active:scale-[0.98]"
                title="Add to Outlook Calendar"
            >
                <FaMicrosoft className="w-3 h-3" />
            </button>

            {/* Outlook Type Selection Modal */}
            {showOutlookModal && (
                <>
                    <div
                        className="fixed inset-0 bg-black bg-opacity-50 z-50"
                        onClick={() => setShowOutlookModal(false)}
                    ></div>
                    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl p-6 w-80 max-w-[90vw] z-50 shadow-xl">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-semibold text-gray-900">Select Outlook Type</h3>
                            <button
                                onClick={() => setShowOutlookModal(false)}
                                className="text-gray-500 hover:text-gray-700 transition-colors"
                            >
                                <MdOutlineClose className="w-6 h-6" />
                            </button>
                        </div>
                        <div className="space-y-3">
                            <button
                                onClick={() => handleOutlookTypeSelection('live')}
                                className="w-full flex items-center justify-center gap-3 p-4 rounded-lg border-2 border-gray-200 hover:border-[#4285F4] hover:bg-[#EFF6FF] transition-all duration-200 font-medium text-gray-700 hover:text-[#4285F4]"
                            >
                                <span>Outlook.com (Live)</span>
                            </button>
                            <button
                                onClick={() => handleOutlookTypeSelection('office')}
                                className="w-full flex items-center justify-center gap-3 p-4 rounded-lg border-2 border-gray-200 hover:border-[#4285F4] hover:bg-[#EFF6FF] transition-all duration-200 font-medium text-gray-700 hover:text-[#4285F4]"
                            >
                                <span>Office 365</span>
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default AddToCalendarButtons;

