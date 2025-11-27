import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import {
    MdOutlineSearch,
    MdOutlineAdd,
    MdOutlineNotifications,
    MdOutlineManageAccounts,
    MdOutlinePayments,
    MdOutlineHeadsetMic,
    MdOutlineFilterList,
    MdOutlineLogout,
    MdOutlineLock,
    MdOutlineDocumentScanner,
    MdOutlineFileUpload,
    MdOutlineMoney,
    MdOutlineKeyboardArrowDown,
    MdOutlineShoppingBag,
    MdOutlineHeadphones,
    MdOutlineAccountCircle,
    MdOutlineMenu,
    MdOutlineVisibility,
    MdOutlineClose,
    MdOutlineEmail,
    MdOutlineFilePresent,
    MdOutlineFileDownload,
    MdLanguage,
    MdOutlinePhone,
    MdOutlinePermContactCalendar,
    MdOutlineEdit,
    MdOutlinePowerSettingsNew,
    MdOutlineSubscriptions,
    MdOutlinePriceChange,
    MdOutlineAddShoppingCart
} from 'react-icons/md';
import { FaRegCheckCircle } from "react-icons/fa";
import { LuCrown } from "react-icons/lu";
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import TextAlign from '@tiptap/extension-text-align';
import { TextStyle } from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';
import CodeBlock from '@tiptap/extension-code-block';
import Blockquote from '@tiptap/extension-blockquote';
import Image from '@tiptap/extension-image';
import { IoLogoLinkedin } from "react-icons/io";

import axios from 'axios';
import { useNavigate, Navigate } from "react-router-dom";
import { useUser } from '../context/UserContext';
import ToastContainer from '../pages/ToastContainer';
import { toast } from 'react-toastify';
import Card from '../components/SuperAdminComponents/Card';
import Swal from 'sweetalert2';
import { validateNumberInput } from '../utils/sanitization';


import proposalimg from '../assets/superAdmin/proposal.png';
import parrow from '../assets/superAdmin/parrow.png';
import user from '../assets/superAdmin/user.png';
import bluearrow from '../assets/superAdmin/bluearrow.png';
import redarrow from '../assets/superAdmin/redarrow.png';
import licenseimg from '../assets/superAdmin/license.png';
import revenue from '../assets/superAdmin/revenue.png';
import payment from '../assets/superAdmin/payment.png';
import error from '../assets/superAdmin/error.png';
import request from '../assets/superAdmin/request.png';
import other from '../assets/superAdmin/other.png';
import ShowCustomDetails from '../components/SuperAdminComponents/ShowCustomDetails';

const SubscriptionManagementModal = React.memo(({
    isOpen,
    mode,
    form,
    onChange,
    onClose,
    onSubmit,
    onDeactivate,
    loading,
    note,
    onNoteChange,
    record,
    formatSubscriptionExpiry
}) => {
    if (!isOpen) return null;

    const actionLabel = mode === 'create' ? 'Activate Plan' : 'Save Changes';

    return (
        <div className="fixed inset-0 z-[1100] flex items-center justify-center bg-black/40 p-4">
            <div className="bg-white rounded-2xl w-full max-w-xl shadow-xl flex flex-col max-h-[90vh]">
                <div className="flex items-center justify-between sticky top-0 bg-white px-6 pt-6 pb-4 border-b border-[#E5E7EB] z-10">
                    <h3 className="text-xl font-semibold text-[#111827]">
                        {mode === 'create' ? 'Activate Subscription Plan' : 'Update Subscription Plan'}
                    </h3>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-gray-100 text-[#4B5563]"
                    >
                        <MdOutlineClose className="w-5 h-5" />
                    </button>
                </div>

                <div className="px-6 pb-6 space-y-6 overflow-y-auto mt-4">
                    {mode === 'edit' && record ? (
                        <div className="bg-[#F8FAFC] border border-[#E5E7EB] rounded-lg p-4 text-sm text-[#4B5563] space-y-2">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                                <span><span className="font-medium">User Email:</span> {record.email}</span>
                                {record.raw?.userName && (
                                    <span><span className="font-medium">User Name:</span> {record.raw.userName}</span>
                                )}
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                                <span><span className="font-medium">Start Date:</span> {formatSubscriptionExpiry(record.startDate)}</span>
                                <span><span className="font-medium">Expires At:</span> {formatSubscriptionExpiry(record.expiresAt)}</span>
                            </div>
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                                <span><span className="font-medium">Auto Renewal:</span> {record.autoRenewal ? 'Yes' : 'No'}</span>
                                <span><span className="font-medium">Current Usage:</span> {`${record.raw?.current_rfp_proposal_generations ?? 0}/${record.raw?.max_rfp_proposal_generations ?? 0} RFP • ${record.raw?.current_grant_proposal_generations ?? 0}/${record.raw?.max_grant_proposal_generations ?? 0} Grant`}</span>
                            </div>
                        </div>
                    ) : null}

                    <div className="mt-4 space-y-4">
                        <div className="flex flex-col">
                            <label className="text-sm font-medium text-[#4B5563] mb-1">Email ID</label>
                            <input
                                type="email"
                                value={form.email}
                                onChange={(e) => onChange('email', e.target.value)}
                                placeholder="company@example.com"
                                className="border border-[#E5E7EB] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#6C63FF]"
                                disabled={loading}
                            />
                        </div>

                        <div className="flex flex-col">
                            <label className="text-sm font-medium text-[#4B5563] mb-1">Plan Type</label>
                            <select
                                value={form.planName}
                                onChange={(e) => onChange('planName', e.target.value)}
                                className="border border-[#E5E7EB] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#6C63FF]"
                                disabled={loading}
                            >
                                <option value="">Select plan</option>
                                {["Basic", "Pro", "Enterprise"].map(option => (
                                    <option key={option} value={option}>{option}</option>
                                ))}
                            </select>
                        </div>

                        <div className="flex flex-col">
                            <label className="text-sm font-medium text-[#4B5563] mb-1">Plan Duration</label>
                            <select
                                value={form.duration}
                                onChange={(e) => onChange('duration', e.target.value)}
                                className="border border-[#E5E7EB] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#6C63FF]"
                                disabled={loading}
                            >
                                {["Monthly", "Yearly"].map(option => (
                                    <option key={option} value={option}>{option}</option>
                                ))}
                            </select>
                        </div>

                        {/* {mode === 'edit' && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="flex flex-col">
                                    <label className="text-sm font-medium text-[#4B5563] mb-1">Max Editors</label>
                                    <input
                                        type="number"
                                        value={form.maxEditors ?? ''}
                                        onChange={(e) => onChange('maxEditors', e.target.value)}
                                        placeholder="Enter max editors"
                                        className="border border-[#E5E7EB] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#6C63FF]"
                                        disabled={loading}
                                        min="0"
                                    />
                                </div>

                                <div className="flex flex-col">
                                    <label className="text-sm font-medium text-[#4B5563] mb-1">Max Viewers</label>
                                    <input
                                        type="number"
                                        value={form.maxViewers ?? ''}
                                        onChange={(e) => onChange('maxViewers', e.target.value)}
                                        placeholder="Enter max viewers"
                                        className="border border-[#E5E7EB] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#6C63FF]"
                                        disabled={loading}
                                        min="0"
                                    />
                                </div>

                                <div className="flex flex-col">
                                    <label className="text-sm font-medium text-[#4B5563] mb-1">Max RFP Generations</label>
                                    <input
                                        type="number"
                                        value={form.maxRFPProposalGenerations ?? ''}
                                        onChange={(e) => onChange('maxRFPProposalGenerations', e.target.value)}
                                        placeholder="Enter max RFP generations"
                                        className="border border-[#E5E7EB] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#6C63FF]"
                                        disabled={loading}
                                        min="0"
                                    />
                                </div>

                                <div className="flex flex-col">
                                    <label className="text-sm font-medium text-[#4B5563] mb-1">Max Grant Generations</label>
                                    <input
                                        type="number"
                                        value={form.maxGrantProposalGenerations ?? ''}
                                        onChange={(e) => onChange('maxGrantProposalGenerations', e.target.value)}
                                        placeholder="Enter max grant generations"
                                        className="border border-[#E5E7EB] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#6C63FF]"
                                        disabled={loading}
                                        min="0"
                                    />
                                </div>
                            </div>
                        )} */}

                        <div className="flex flex-col">
                            <label className="text-sm font-medium text-[#4B5563] mb-1">Note (optional)</label>
                            <textarea
                                value={note}
                                onChange={(e) => onNoteChange(e.target.value)}
                                rows={3}
                                placeholder={mode === 'edit' ? "Explain why you are updating this plan (Included in the owner notification email, only if you provide a note)." : "Explain why you are activating this plan (Included in the owner notification email, only if you provide a note)."}
                                className="border border-[#E5E7EB] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#6C63FF]"
                                disabled={loading}
                            />
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        {mode === 'edit' ? (
                            record?.isActive ? (
                                <button
                                    onClick={() => onDeactivate(note)}
                                    className="flex-1 sm:flex-none px-4 py-2 border border-[#FCA5A5] text-[#B91C1C] rounded-lg hover:bg-red-50 transition disabled:opacity-60 disabled:cursor-not-allowed"
                                    disabled={loading}
                                    title="Deactivate this plan immediately"
                                >
                                    Deactivate Plan
                                </button>
                            ) : (
                                <span className="text-xs text-[#6B7280]">Plan already inactive</span>
                            )
                        ) : null}

                        <div className="flex items-center gap-2 w-full sm:w-auto">
                            <button
                                onClick={onClose}
                                className="flex-1 sm:flex-none px-4 py-2 border border-[#E5E7EB] text-[#4B5563] rounded-lg hover:bg-gray-50 transition"
                                disabled={loading}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={onSubmit}
                                className="flex-1 sm:flex-none px-4 py-2 bg-gradient-to-r from-[#6C63FF] to-[#3F73BD] text-white rounded-lg shadow-md hover:shadow-lg transition disabled:opacity-60 disabled:cursor-not-allowed"
                                disabled={loading}
                            >
                                {loading ? 'Processing...' : actionLabel}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
});


const SuperAdmin = () => {
    const navigate = useNavigate();
    const { role } = useUser();
    const isSuperAdmin = (role || '').toLowerCase() === 'superadmin';
    const [activeTab, setActiveTab] = useState(() => {
        // Load activeTab from URL hash or default to 'user-management'
        return window.location.hash.slice(1) ? window.location.hash.slice(1) : 'user-management';
    });
    const [previousTab, setPreviousTab] = useState('user-management');
    // Search Terms
    const [searchTerm, setSearchTerm] = useState('');
    const [transactionSearchTerm, setTransactionSearchTerm] = useState('');
    const [supportSearchTerm, setSupportSearchTerm] = useState('');
    const [notificationSearchTerm, setNotificationSearchTerm] = useState('');

    // Inner Tabs
    const [supportTab, setSupportTab] = useState('Enterprise');
    const [emailContentInnerTab, setEmailContentInnerTab] = useState('templates');

    // Profile
    const [showMobileMenu, setShowMobileMenu] = useState(false);

    // View Modals
    const [viewUserModal, setViewUserModal] = useState(false);
    const [viewSupportModal, setViewSupportModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [selectedSupport, setSelectedSupport] = useState(null);

    // Invoice modal states for inline display
    const [openInvoiceRows, setOpenInvoiceRows] = useState(new Set());

    // Ref for the resolved description textarea
    const supportResolvedDescriptionRef = useRef(null);

    // Ref for the admin message textarea
    const adminMessageRef = useRef('');

    // Plan & Subscription inner tabs
    const [planManagementInnerTab, setPlanManagementInnerTab] = useState('plan');

    // Subscription management state
    const [subscriptionSearchTerm, setSubscriptionSearchTerm] = useState('');
    const [subscriptionPlanFilter, setSubscriptionPlanFilter] = useState('all');
    const [subscriptionDurationFilter, setSubscriptionDurationFilter] = useState('all');
    const [subscriptionFilterModal, setSubscriptionFilterModal] = useState(false);
    const [filteredSubscriptions, setFilteredSubscriptions] = useState([]);
    const [subscriptionModalOpen, setSubscriptionModalOpen] = useState(false);
    const [subscriptionModalMode, setSubscriptionModalMode] = useState('create');
    const createDefaultSubscriptionForm = useCallback(() => ({
        email: '',
        planName: '',
        duration: 'Monthly',
        expiresAt: '',
        maxEditors: '',
        maxViewers: '',
        maxRFPProposalGenerations: '',
        maxGrantProposalGenerations: ''
    }), []);
    const [subscriptionForm, setSubscriptionForm] = useState(createDefaultSubscriptionForm);
    const [subscriptionActionLoading, setSubscriptionActionLoading] = useState(false);
    const [selectedSubscriptionRecord, setSelectedSubscriptionRecord] = useState(null);
    const [subscriptionNote, setSubscriptionNote] = useState('');
    const [selectedSubscriptions, setSelectedSubscriptions] = useState(() => new Set());
    const [bulkActionNote, setBulkActionNote] = useState('');
    const [bulkProcessing, setBulkProcessing] = useState(false);

    // Filters
    const [userStatusFilter, setUserStatusFilter] = useState('all');
    const [transactionStatusFilter, setTransactionStatusFilter] = useState('all');
    const [transactionDateFilter, setTransactionDateFilter] = useState('all');
    const [supportStatusFilter, setSupportStatusFilter] = useState('all');
    const [supportPriorityFilter, setSupportPriorityFilter] = useState('all');
    const [supportTypeFilter, setSupportTypeFilter] = useState('all');
    const [notificationTimeFilter, setNotificationTimeFilter] = useState('All Time');
    const [notificationCategoryFilter, setNotificationCategoryFilter] = useState('All Categories');

    // Filter Modals
    const [userFilterModal, setUserFilterModal] = useState(false);
    const [transactionFilterModal, setTransactionFilterModal] = useState(false);
    const [supportFilterModal, setSupportFilterModal] = useState(false);
    const [notificationTimeFilterModal, setNotificationTimeFilterModal] = useState(false);
    const [notificationCategoryFilterModal, setNotificationCategoryFilterModal] = useState(false);



    // Data
    const [usersStats, setUsersStats] = useState({});
    const [companiesData, setCompaniesData] = useState([]);
    const [paymentsStats, setPaymentsStats] = useState({});
    const [paymentsData, setPaymentsData] = useState([]);
    let planManagementStats = { "Active Users": 0, "Revenue This Month": 0 };
    const [supportTicketsStats, setSupportTicketsStats] = useState({});
    const [supportTicketsStatsCompleted, setSupportTicketsStatsCompleted] = useState({});
    const [supportTicketsStatsEnterprise, setSupportTicketsStatsEnterprise] = useState({});
    const [supportTicketsData, setSupportTicketsData] = useState([]);
    const [completedTicketsData, setCompletedTicketsData] = useState([]);
    const [enterpriseTicketsData, setEnterpriseTicketsData] = useState([]);
    const [notificationsData, setNotificationsData] = useState([]);
    const [subscriptionsData, setSubscriptionsData] = useState([]);
    const [subscriptionsLoading, setSubscriptionsLoading] = useState(false);
    const [plans, setPlans] = useState([]);
    const [editingPlans, setEditingPlans] = useState({});
    const [isYearlyb, setIsYearlyb] = useState(false);
    const [isYearlyp, setIsYearlyp] = useState(false);
    const [isYearlye, setIsYearlye] = useState(false);
    const [isContact, setIsContact] = useState(false);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [currentPageTransactions, setCurrentPageTransactions] = useState(1);
    const [currentPageSupport, setCurrentPageSupport] = useState(1);
    const [currentPageEnterpriseSupport, setCurrentPageEnterpriseSupport] = useState(1);
    const [currentPageNotifications, setCurrentPageNotifications] = useState(1);
    const [currentPageSubscriptions, setCurrentPageSubscriptions] = useState(1);
    const [rowsPerPageSubscriptions, setRowsPerPageSubscriptions] = useState(10);

    const [loading, setLoading] = useState(false);
    const [emailSendingLoading, setEmailSendingLoading] = useState(false);

    const baseUrl = `${import.meta.env.VITE_API_BASE_URL}`;

    // Safely render potentially non-primitive values in JSX
    const safeText = (value) => {
        if (value === null || value === undefined) return '—';
        return typeof value === 'object' ? JSON.stringify(value) : String(value);
    };

    // Email Content Management state
    const [emailContentData, setEmailContentData] = useState([]);
    const [emailContentSearchTerm, setEmailContentSearchTerm] = useState('');
    const [filteredEmailContent, setFilteredEmailContent] = useState([]);
    const [emailEditModalOpen, setEmailEditModalOpen] = useState(false);
    const [selectedEmailForEdit, setSelectedEmailForEdit] = useState(null);
    const [emailEditForm, setEmailEditForm] = useState({
        emailType: '',
        emailSubject: '',
        emailBody: ''
    });

    // Custom Email state
    const [customEmailForm, setCustomEmailForm] = useState({
        subject: '',
        body: '',
        sendTo: 'All',
        customEmails: ''
    });
    const [sendToDropdownOpen, setSendToDropdownOpen] = useState(false);
    const imageUploadRef = useRef(null);


    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const userLocale = navigator.language || 'en-US';
        return date.toLocaleDateString(userLocale, {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    // New functions for user blocking/unblocking
    const handleUserBlockToggle = async (userId, currentBlockedStatus) => {
        try {
            const newBlockedStatus = !currentBlockedStatus;
            const res = await axios.put(`${baseUrl}/admin/updateCompanyStatus/${userId}`, {
                blocked: newBlockedStatus
            }, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (res.status === 200) {
                setCompaniesData(prev => (prev || []).map(u => u._id === userId ? { ...u, blocked: newBlockedStatus } : u));
                setFilteredUsers(prev => (prev || []).map(u => u._id === userId ? { ...u, blocked: newBlockedStatus } : u));
                toast.success(`User ${newBlockedStatus ? 'blocked' : 'unblocked'} successfully`);
                setTimeout(() => {
                    window.location.reload();
                }, 2000);
            }
        } catch (e) {
            toast.error('Failed to update user status');
        }
    };

    // New functions for support ticket management
    const handleSupportStatusUpdate = useCallback(async (ticketId, newStatus) => {
        try {
            // Prepare update data
            const updateData = {
                status: newStatus
            };

            // Get current ticket data
            const currentTicket = supportTicketsData.find(t => t._id === ticketId) || {};
            const currentAdminMessages = currentTicket.adminMessages || [];

            // Always include resolved description if it exists (regardless of status)
            const resolvedDescription = supportResolvedDescriptionRef.current && supportResolvedDescriptionRef.current.value ? supportResolvedDescriptionRef.current.value.trim() : '';
            if (resolvedDescription) {
                updateData.Resolved_Description = resolvedDescription;
            }

            const res = await axios.put(`${baseUrl}/admin/updateSupportTicket/${ticketId}`, updateData, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (res.status === 200) {
                if (adminMessageRef.current) {
                    adminMessageRef.current.value = '';
                }
                // Don't clear resolved description - preserve it for display

                toast.success(`Ticket status updated to ${newStatus}`);

                setTimeout(() => {
                    window.location.reload();
                }, 2000);
            }
        } catch (e) {
            toast.error('Failed to update ticket status');
        }
    }, [supportTicketsData, selectedSupport]);

    // Function to add messages without changing status
    const handleAddMessage = useCallback(async (ticketId) => {
        try {
            const newAdminMessage = adminMessageRef.current ? adminMessageRef.current.value.trim() : '';

            if (!newAdminMessage) {
                toast.warning('Please enter a message');
                return;
            }
            // Prepare update data
            const updateData = {
                newAdminMessage
            };

            const res = await axios.post(`${baseUrl}/admin/addAdminMessage/${ticketId}`, updateData, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (res.status === 200) {
                if (adminMessageRef.current) {
                    adminMessageRef.current.value = '';
                }
                // Don't clear resolved description - preserve it for display

                toast.success('Message added successfully');

                // Create message object with proper structure
                const newMessageObject = {
                    message: newAdminMessage,
                    createdAt: new Date().toISOString(),
                    created_at: new Date().toISOString()
                };

                // Add new message to the support ticket
                setSupportTicketsData(prev => (prev || []).map(t => t._id === ticketId ? { ...t, adminMessages: [...(t.adminMessages || []), newMessageObject] } : t));
                setFilteredSupport(prev => (prev || []).map(t => t._id === ticketId ? { ...t, adminMessages: [...(t.adminMessages || []), newMessageObject] } : t));

                // Update selectedSupport to show the new message immediately in the modal
                setSelectedSupport(prev => {
                    if (prev && prev._id === ticketId) {
                        return { ...prev, adminMessages: [...(prev.adminMessages || []), newMessageObject] };
                    }
                    return prev;
                });
            }
        } catch (e) {
            toast.error('Failed to add message');
        }
    }, [supportTicketsData, selectedSupport]);



    // View modal functions
    const openUserModal = (user) => {
        setSelectedUser(user);
        setViewUserModal(true);
    };

    const openSupportModal = async (support) => {
        try {
            if (support.status !== "In Progress" && support.status !== "Completed" && support.status !== "Withdrawn") {
                // Always set status to "In Progress" when opening modal
                const res = await axios.put(`${baseUrl}/admin/updateSupportTicket/${support._id}`, {
                    status: 'In Progress'
                }, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                if (res.status === 200) {
                    const updatedSupport = { ...support, status: 'In Progress' };
                    setSupportTicketsData(prev => (prev || []).map(t => t._id === support._id ? updatedSupport : t));
                    setFilteredSupport(prev => (prev || []).map(t => t._id === support._id ? updatedSupport : t));
                    setSelectedSupport(updatedSupport);
                    // Don't clear admin message here - let user keep their message
                    if (supportResolvedDescriptionRef.current) {
                        supportResolvedDescriptionRef.current.value = updatedSupport.resolvedDescription || '';
                    }
                    setViewSupportModal(true);
                }
            } else {
                // Check if we're switching to a different ticket
                if (selectedSupport && selectedSupport._id !== support._id) {
                    if (adminMessageRef.current) {
                        adminMessageRef.current.value = ''; // Clear message when switching tickets
                    }
                }
                setSelectedSupport(support);
                if (supportResolvedDescriptionRef.current) {
                    supportResolvedDescriptionRef.current.value = support.resolvedDescription || '';
                }

                setViewSupportModal(true);
            }
        } catch (e) {
            toast.error('Failed to update support ticket');
            return;
        }
    };

    // Invoice row toggle functions
    const toggleInvoiceRow = (rowId) => {
        setOpenInvoiceRows(prev => {
            const newSet = new Set(prev);
            if (newSet.has(rowId)) {
                newSet.delete(rowId);
            } else {
                newSet.add(rowId);
            }
            return newSet;
        });
    };

    const closeAllInvoiceRows = () => {
        setOpenInvoiceRows(new Set());
    };



    // Close modals when clicking outside
    const handleModalBackdropClick = useCallback((e) => {
        if (e.target === e.currentTarget) {
            setViewUserModal(false);
            setViewSupportModal(false);
            // Clear admin message when closing
            if (adminMessageRef.current) {
                adminMessageRef.current.value = '';
            }
            if (supportResolvedDescriptionRef.current) {
                supportResolvedDescriptionRef.current.value = '';
            }

        }
    }, []);

    // Set default URL hash on component mount if no hash exists or invalid hash
    useEffect(() => {
        const validTabs = ['user-management', 'payments', 'plan-management', 'contact-request', 'support', 'notifications', 'email-content'];
        const currentHash = window.location.hash.slice(1);

        if (!window.location.hash || window.location.hash === '#' || !validTabs.includes(currentHash)) {
            window.location.hash = 'user-management';
        }
    }, []);

    // Handle URL hash changes (browser back/forward buttons)
    useEffect(() => {
        const handleHashChange = () => {
            const hash = window.location.hash.slice(1) ? window.location.hash.slice(1) : 'user-management';
            setActiveTab(hash);
        };

        window.addEventListener('hashchange', handleHashChange);
        return () => window.removeEventListener('hashchange', handleHashChange);
    }, []);

    // Close modals with Escape key
    useEffect(() => {
        const handleEscapeKey = (e) => {
            if (e.key === 'Escape') {
                setViewUserModal(false);
                setViewSupportModal(false);
                // Clear admin message when closing
                if (adminMessageRef.current) {
                    adminMessageRef.current.value = '';
                }
                if (supportResolvedDescriptionRef.current) {
                    supportResolvedDescriptionRef.current.value = '';
                }

                // Close filter modals
                setNotificationTimeFilterModal(false);
                setNotificationCategoryFilterModal(false);
            }
        };

        document.addEventListener('keydown', handleEscapeKey);

        // Close filter modals when clicking outside
        const handleClickOutside = (e) => {
            if (!e.target.closest('.notification-filter-modal')) {
                setNotificationTimeFilterModal(false);
                setNotificationCategoryFilterModal(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('keydown', handleEscapeKey);
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Initialize refs when selectedSupport changes
    useEffect(() => {
        if (selectedSupport) {
            if (supportResolvedDescriptionRef.current) {
                supportResolvedDescriptionRef.current.value = selectedSupport.resolvedDescription || '';
            }
            if (adminMessageRef.current) {
                adminMessageRef.current.value = '';
            }


        }
    }, [selectedSupport]);


    // User filter: single select with toggle back to 'all'
    const handleUserStatusChangeFilter = (value) => {
        setUserStatusFilter(value);
        closeAllInvoiceRows();
    };

    // Transaction filters are split by group
    const handleTransactionStatusChangeFilter = (value) => {
        setTransactionStatusFilter(value);
        closeAllInvoiceRows();
    };

    const handleTransactionDateChangeFilter = (value) => {
        setTransactionDateFilter(value);
        closeAllInvoiceRows();
    };

    // Support filters split by group
    const handleSupportStatusChangeFilter = (value) => {
        setSupportStatusFilter(value);
        closeAllInvoiceRows();
    };

    const handleSupportPriorityChangeFilter = (value) => {
        setSupportPriorityFilter(value);
        closeAllInvoiceRows();
    };

    const handleSupportTypeChangeFilter = (value) => {
        setSupportTypeFilter(value);
        closeAllInvoiceRows();
    };

    const fetchAllSubscriptions = useCallback(async () => {
        if (!isSuperAdmin) {
            return;
        }
        setSubscriptionsLoading(true);
        try {
            const response = await axios.get(`${baseUrl}/admin/getSubscriptionsOfAllUsers`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            const list = Array.isArray(response.data) ? response.data : [];
            //sort list by active users first and then by inactive users
            list.sort((a, b) => {
                if (a.active && !b.active) return -1;
                if (!a.active && b.active) return 1;
                return 0;
            });
            setSubscriptionsData(list);
        } catch (error) {
            console.error('Failed to fetch subscriptions:', error);
            toast.error(error.response?.data?.message || 'Failed to fetch subscriptions');
            setSubscriptionsData([]);
        } finally {
            setSubscriptionsLoading(false);
        }
    }, [baseUrl, isSuperAdmin]);

    // Plan & Subscription helpers
    const toTitleCase = (value = '') =>
        value
            .toString()
            .split(/[^a-zA-Z0-9]+/)
            .filter(Boolean)
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ');

    const getDurationLabel = (start, end) => {
        if (!start || !end) return 'N/A';

        const startDate = new Date(start);
        const endDate = new Date(end);

        if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
            return 'N/A';
        }

        const diffMs = endDate.getTime() - startDate.getTime();
        if (diffMs <= 0) return 'N/A';

        const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

        if (diffDays >= 360 && diffDays <= 372) return 'Yearly';
        if (diffDays >= 27 && diffDays <= 33) return 'Monthly';
        if (diffDays >= 13 && diffDays <= 16) return 'Bi-Weekly';
        if (diffDays >= 6 && diffDays <= 8) return 'Weekly';
        if (diffDays === 1) return 'Daily';

        if (diffDays % 30 === 0) {
            const months = diffDays / 30;
            return `${months} Month${months > 1 ? 's' : ''}`;
        }

        if (diffDays % 7 === 0) {
            const weeks = diffDays / 7;
            return `${weeks} Week${weeks > 1 ? 's' : ''}`;
        }

        return `${diffDays} Days`;
    };

    const getNumberOfMonths = (duration) => {
        const numberOfMonths = duration / 30;
        return Math.floor(numberOfMonths);
    };

    const formatSubscriptionExpiry = (value) => {
        if (!value) return 'N/A';

        const parsed = new Date(value);
        if (!Number.isNaN(parsed.getTime())) {
            return formatDate(value);
        }

        if (typeof value === 'string') {
            return toTitleCase(value);
        }

        return 'N/A';
    };

    const formatDateForInput = (value) => {
        if (!value) return '';
        const parsed = new Date(value);
        if (Number.isNaN(parsed.getTime())) {
            return typeof value === 'string' ? value : '';
        }
        return parsed.toISOString().slice(0, 10);
    };

    const convertDateInputToISO = (value) => {
        if (!value) return null;
        const normalized = value.includes('T') ? value : `${value}T00:00:00Z`;
        const parsed = new Date(normalized);
        if (Number.isNaN(parsed.getTime())) {
            return null;
        }
        return parsed.toISOString();
    };

    const toInputString = (value) => (value === null || value === undefined ? '' : String(value));

    const parseOptionalNumber = (value) => {
        const trimmed = value === null || value === undefined ? '' : String(value).trim();
        if (!trimmed) return undefined;
        const parsed = Number(trimmed);
        return Number.isNaN(parsed) ? undefined : parsed;
    };

    const handleSubscriptionPlanFilterChange = (value) => {
        setSubscriptionPlanFilter(prev => (prev === value ? 'all' : value));
        closeAllInvoiceRows();
    };

    const handleSubscriptionDurationFilterChange = (value) => {
        setSubscriptionDurationFilter(prev => (prev === value ? 'all' : value));
        closeAllInvoiceRows();
    };

    const resetSubscriptionFilters = () => {
        setSubscriptionPlanFilter('all');
        setSubscriptionDurationFilter('all');
    };

    const handleSubscriptionFormChange = (field, value) => {
        setSubscriptionForm(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const closeSubscriptionModal = () => {
        setSubscriptionModalOpen(false);
        setSubscriptionActionLoading(false);
        setSubscriptionForm(createDefaultSubscriptionForm());
        setSelectedSubscriptionRecord(null);
        setSubscriptionNote('');
    };

    const openCreateSubscriptionModal = () => {
        setSubscriptionModalMode('create');
        setSubscriptionForm({
            ...createDefaultSubscriptionForm(),
            planName: 'Basic'
        });
        setSelectedSubscriptionRecord(null);
        setSubscriptionNote('');
        setSubscriptionModalOpen(true);
    };

    const openEditSubscriptionModal = (record) => {
        if (!record) return;
        setSubscriptionModalMode('edit');
        setSelectedSubscriptionRecord(record);
        const raw = record.raw || {};
        setSubscriptionForm({
            ...createDefaultSubscriptionForm(),
            email: record.email || '',
            planName: record.planName || 'Basic',
            duration: record.duration === 'N/A' ? 'Monthly' : record.duration,
            expiresAt: formatDateForInput(record.expiresAtRaw || record.expiresAt),
            maxEditors: toInputString(raw.maxEditors ?? raw.max_editors),
            maxViewers: toInputString(raw.maxViewers ?? raw.max_viewers),
            maxRFPProposalGenerations: toInputString(raw.maxRFPProposalGenerations ?? raw.max_rfp_proposal_generations),
            maxGrantProposalGenerations: toInputString(raw.maxGrantProposalGenerations ?? raw.max_grant_proposal_generations)
        });
        setSubscriptionModalOpen(true);
        setSubscriptionNote('');
    };

    const handleSubscriptionSubmit = async () => {
        const trimmedEmail = (subscriptionForm.email || '').trim();
        const planName = (subscriptionForm.planName || '').trim();
        const type = (subscriptionForm.duration || '').trim();

        if (!trimmedEmail || !planName || !type) {
            toast.warning('Email, plan name and type are required');
            return;
        }

        // const expiresAtIso = convertDateInputToISO(subscriptionForm.expiresAt);
        const note = subscriptionNote.trim();

        const payload = {
            userEmail: trimmedEmail,
            planName,
            type,
            note: note || ""
        };

        if (subscriptionModalMode === 'edit') {
            const maxEditors = parseOptionalNumber(subscriptionForm.maxEditors);
            const maxViewers = parseOptionalNumber(subscriptionForm.maxViewers);
            const maxRfp = parseOptionalNumber(subscriptionForm.maxRFPProposalGenerations);
            const maxGrant = parseOptionalNumber(subscriptionForm.maxGrantProposalGenerations);

            if (maxEditors !== undefined) {
                payload.maxEditors = maxEditors;
            }
            if (maxViewers !== undefined) {
                payload.maxViewers = maxViewers;
            }
            if (maxRfp !== undefined) {
                payload.maxRFPProposalGenerations = maxRfp;
            }
            if (maxGrant !== undefined) {
                payload.maxGrantProposalGenerations = maxGrant;
            }
        }

        setSubscriptionActionLoading(true);
        const url = subscriptionModalMode === 'create' ? `${baseUrl}/admin/assignSubscription` : `${baseUrl}/admin/updateUserSubscription`;
        try {
            const response = await axios.post(url, payload, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });
            if (response.status === 200) {
                toast.success(`Subscription plan ${subscriptionModalMode === 'create' ? 'assigned' : 'updated'} successfully`);
                await fetchAllSubscriptions();
                closeSubscriptionModal();
            } else {
                toast.error(`Failed to ${subscriptionModalMode === 'create' ? 'assign' : 'update'} subscription plan. Please try again.`);
            }
        } catch (error) {
            console.error(`Failed to ${subscriptionModalMode === 'create' ? 'assign' : 'update'} subscription plan:`, error);
            toast.error(`Failed to ${subscriptionModalMode === 'create' ? 'assign' : 'update'} subscription plan. Please try again.`);
        } finally {
            setSubscriptionActionLoading(false);
        }
    };

    const handleSubscriptionDeactivate = async (record, noteValue = subscriptionNote) => {
        if (!record) return;
        if (!record.isActive) {
            Swal.fire({
                title: 'This plan is already inactive.',
                icon: 'info',
                timer: 1500,
                showConfirmButton: false,
                showCancelButton: false,
            });
            return;
        }

        const finalNote = (noteValue || '').trim();

        setSubscriptionActionLoading(true);
        try {
            const response = await axios.post(`${baseUrl}/admin/deactivateSubscription`, {
                userEmail: record.email,
                note: finalNote
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });
            if (response.status === 200) {
                toast.success('Subscription plan deactivated successfully');
                await fetchAllSubscriptions();
                closeSubscriptionModal();
            } else {
                toast.error('Failed to deactivate subscription plan. Please try again.');
            }
        } catch (error) {
            console.error('Failed to deactivate subscription:', error);
            toast.error('Failed to deactivate subscription plan. Please try again.');
        } finally {
            setSubscriptionActionLoading(false);
        }
    };

    // Export helpers
    const exportArrayToCSV = (filename, headers, rows) => {
        const csvContent = [
            headers.join(','),
            ...rows.map(row => headers.map(h => {
                const val = row[h] ?? '';
                const escaped = String(val).replace(/"/g, '""');
                return `"${escaped}"`;
            }).join(','))
        ].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const handleExportUsers = () => {
        const headers = ['_id', 'companyName', 'email', 'establishedYear', 'location', 'status'];
        const rows = (filteredUsers || []).map(u => ({
            _id: u._id,
            companyName: u.companyName,
            email: u.email,
            establishedYear: u.establishedYear,
            location: u.location,
            status: u.status
        }));
        exportArrayToCSV('companies.csv', headers, rows);
    };

    const handleExportTransactions = () => {
        const headers = ['plan_name', 'company_name', 'company_email', 'payment_method', 'price', 'status', 'transaction_id', 'paid_at'];
        const rows = (filteredTransactions || []).map(t => ({
            plan_name: t.planName,
            company_name: t.companyName || "Not Disclosed",
            company_email: t.email || "Not Disclosed",
            payment_method: t.payment_method || "Not Disclosed",
            price: t.price || "Not Disclosed",
            status: t.status || "Not Disclosed",
            transaction_id: t.transaction_id || "Not Disclosed",
            paid_at: t.paid_at || "Not Disclosed"
        }));
        exportArrayToCSV('transactions.csv', headers, rows);
    };

    const handleExportSubscriptions = () => {
        const headers = ['company_name', 'email', 'plan_name', 'plan_duration', 'start_date', 'renewal_date', 'expires_at', 'auto_renewal'];
        const source = (filteredSubscriptions && filteredSubscriptions.length > 0) ? filteredSubscriptions : subscriptionRows;
        const rows = (source || []).map(record => ({
            company_name: record.companyName,
            email: record.email,
            plan_name: record.planName,
            plan_duration: record.duration,
            start_date: record.startDate ? formatSubscriptionExpiry(record.startDate) : 'N/A',
            renewal_date: record.renewalDate ? formatSubscriptionExpiry(record.renewalDate) : 'N/A',
            expires_at: record.expiresAt,
            auto_renewal: record.autoRenewal ? 'Yes' : 'No'
        }));
        exportArrayToCSV('subscriptions.csv', headers, rows);
    };

    const handleNotificationCategoryFilter = (value) => {
        setNotificationCategoryFilter(value);
    };

    // Format filter values for display
    const formatFilterDisplay = (value, filterType) => {
        if (filterType === 'time') {
            switch (value) {
                case 'last7Days': return 'Last 7 Days';
                case 'last14Days': return 'Last 14 Days';
                case 'last30Days': return 'Last 30 Days';
                case 'today': return 'Today';
                case 'yesterday': return 'Yesterday';
                case 'All Time': return 'All Time';
                default: return value;
            }
        } else if (filterType === 'category') {
            switch (value) {
                case 'account access': return 'Account & Access';
                case 'billing & payments': return 'Billing & Payments';
                case 'technical errors': return 'Technical Errors';
                case 'feature requests': return 'Feature Requests';
                case 'proposal issues': return 'Proposal Issues';
                case 'others': return 'Others';
                case 'All Categories': return 'All Categories';
                default: return value;
            }
        }
        return value;
    };

    // Pagination utility functions
    const paginateData = (data, currentPage, rowsPerPage) => {
        const startIndex = (currentPage - 1) * rowsPerPage;
        const endIndex = startIndex + rowsPerPage;
        return data.slice(startIndex, endIndex);
    };

    const getTotalPages = (data, rowsPerPage) => {
        return Math.ceil(data.length / rowsPerPage);
    };

    const PaginationComponent = ({ currentPage, totalPages, onPageChange, totalItems, rowsPerPage, onRowsPerPageChange }) => {
        const pageNumbers = [];
        const maxVisiblePages = 5;

        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            pageNumbers.push(i);
        }

        return (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4 p-4 border-t border-[#E5E7EB]">
                <div className="flex items-center gap-2">
                    <span className="text-sm text-[#6B7280]">Rows per page:</span>
                    <select
                        value={rowsPerPage}
                        onChange={(e) => onRowsPerPageChange(Number(e.target.value))}
                        className="border border-[#E5E7EB] rounded-lg px-2 py-1 text-sm focus:ring-2 focus:ring-[#2563EB] focus:border-transparent"
                    >
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={25}>25</option>
                        <option value={50}>50</option>
                        <option value={100}>100</option>
                    </select>
                    <span className="text-sm text-[#6B7280]">
                        {((currentPage - 1) * rowsPerPage) + 1}-{Math.min(currentPage * rowsPerPage, totalItems)} of {totalItems}
                    </span>
                </div>

                <div className="flex items-center gap-1">
                    <button
                        onClick={() => onPageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-3 py-1 text-sm border border-[#E5E7EB] rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#F3F4F6]"
                    >
                        Previous
                    </button>

                    {startPage > 1 && (
                        <>
                            <button
                                onClick={() => onPageChange(1)}
                                className="px-3 py-1 text-sm border border-[#E5E7EB] rounded-lg hover:bg-[#F3F4F6]"
                            >
                                1
                            </button>
                            {startPage > 2 && <span className="px-2 text-[#6B7280]">...</span>}
                        </>
                    )}

                    {pageNumbers.map(number => (
                        <button
                            key={number}
                            onClick={() => onPageChange(number)}
                            className={`px-3 py-1 text-sm border rounded-lg ${currentPage === number
                                ? 'bg-[#2563EB] text-white border-[#2563EB]'
                                : 'border-[#E5E7EB] hover:bg-[#F3F4F6]'
                                }`}
                        >
                            {number}
                        </button>
                    ))}

                    {endPage < totalPages && (
                        <>
                            {endPage < totalPages - 1 && <span className="px-2 text-[#6B7280]">...</span>}
                            <button
                                onClick={() => onPageChange(totalPages)}
                                className="px-3 py-1 text-sm border border-[#E5E7EB] rounded-lg hover:bg-[#F3F4F6]"
                            >
                                {totalPages}
                            </button>
                        </>
                    )}

                    <button
                        onClick={() => onPageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1 text-sm border border-[#E5E7EB] rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#F3F4F6]"
                    >
                        Next
                    </button>
                </div>
            </div>
        );
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Active':
                return 'bg-[#DCFCE7] text-[#15803D]';
            case 'Blocked':
                return 'bg-[#FEE2E2] text-[#DC2626]';
            case 'Inactive':
                return 'bg-[#FEF9C3] text-[#CA8A04]';
            case 'Success':
                return 'bg-[#DCFCE7] text-[#15803D]';
            case 'Pending':
                return 'bg-[#FEF9C3] text-[#CA8A04]';
            case 'Failed':
                return 'bg-[#FEE2E2] text-[#DC2626]';
            case 'Pending Refund':
                return 'bg-[#FEF9C3] text-[#CA8A04]';
            case 'Refunded':
                return 'bg-[#FEF9C3] text-[#CA8A04]';
            case 'Completed':
                return 'bg-[#DCFCE7] text-[#15803D]';
            case 'In Progress':
                return 'bg-[#DBEAFE] text-[#2563EB]';
            case 'Re-Opened':
                return 'bg-[#FEE2E2] text-[#DC2626]';
            case 'Withdrawn':
                return 'bg-[#4B5563] text-[#FFFFFF]';
            case 'Cancelled':
                return 'bg-[#F3F4F6] text-[#6B7280]';
            case 'Connected':
                return 'bg-[#DCFCE7] text-[#15803D]';
            default:
                return 'bg-[#FEF9C3] text-[#CA8A04]';
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'Low':
                return 'bg-[#DCFCE7] text-[#15803D]';
            case 'Medium':
                return 'bg-[#FEF9C3] text-[#CA8A04]';
            case 'High':
                return 'bg-[#FEE2E2] text-[#DC2626]';
            default:
                return 'bg-[#F3F4F6] text-[#6B7280]';
        }
    };

    const [filteredUsers, setFilteredUsers] = useState([]);
    const [filteredTransactions, setFilteredTransactions] = useState([]);
    const [filteredSupport, setFilteredSupport] = useState([]);
    const [filteredEnterpriseSupport, setFilteredEnterpriseSupport] = useState([]);
    const [filteredNotifications, setFilteredNotifications] = useState([]);

    useEffect(() => {
        const fetchCompanyStats = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`${baseUrl}/admin/getCompanyStatsAndData`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                const stats = response.data.stats;
                setUsersStats(stats);
                const companiesData = response.data.CompanyData;
                setCompaniesData(companiesData);
                setFilteredUsers(companiesData);
                planManagementStats["Active Users"] = stats["Active Users"];
            } catch (error) {
                //console.log("error", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCompanyStats();
    }, []);

    useEffect(() => {
        const fetchPaymentStats = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`${baseUrl}/admin/getPaymentStatsAndData`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                const paymentsData = response.data.PaymentData;
                setPaymentsData(paymentsData);
                const ps = response.data.PaymentStats || {};
                const { revenueThisMonth, ...otherStats } = ps;
                setPaymentsStats(otherStats);
                planManagementStats["Revenue This Month"] = revenueThisMonth || 0;
                setFilteredTransactions(paymentsData);
            } catch (error) {
                //console.log("error", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPaymentStats();
    }, []);

    useEffect(() => {
        const fetchSupportStats = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`${baseUrl}/admin/getSupportStatsAndData`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });

                // Set the three separate data sources
                const supportTicketsData = response.data.supportTicketsData || [];
                const completedTicketsData = response.data.completedTicketsData || [];
                const enterpriseTicketsData = response.data.enterpriseTicketsData || [];

                setSupportTicketsData(supportTicketsData);
                setCompletedTicketsData(completedTicketsData);
                setEnterpriseTicketsData(enterpriseTicketsData);

                // Set the three separate stats objects
                const supportTicketsStats = response.data.TicketStats || {};
                const supportTicketsStatsCompleted = response.data.TicketStatsCompleted || {};
                const supportTicketsStatsEnterprise = response.data.TicketStatsEnterprise || {};

                setSupportTicketsStats(supportTicketsStats);
                setSupportTicketsStatsCompleted(supportTicketsStatsCompleted);
                setSupportTicketsStatsEnterprise(supportTicketsStatsEnterprise);

                // Set initial filtered data based on current tab
                if (supportTab === 'active') {
                    setFilteredSupport(supportTicketsData);
                } else if (supportTab === 'Enterprise') {
                    setFilteredEnterpriseSupport(enterpriseTicketsData);
                } else if (supportTab === 'resolved') {
                    setFilteredSupport(completedTicketsData);
                }
            } catch (error) {
                //console.log("error", error);
            } finally {
                setLoading(false);
            }
        };

        fetchSupportStats();
    }, []);

    useEffect(() => {
        const fetchNotificationsData = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`${baseUrl}/admin/getNotificationsData`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                const notificationsData = response.data;
                setNotificationsData(notificationsData);
                setFilteredNotifications(notificationsData);
            } catch (error) {
                //console.log("error", error);
            } finally {
                setLoading(false);
            }
        };

        fetchNotificationsData();
    }, []);

    useEffect(() => {
        //console.log("searchTerm", searchTerm);
        //console.log("companies", companiesData);
        if (searchTerm) {
            setFilteredUsers((companiesData || []).filter(user =>
                (user.companyName && user.companyName.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase()))
            ));
        } else {
            setFilteredUsers(companiesData);
        }
    }, [searchTerm]);

    useEffect(() => {
        //console.log("transactionSearchTerm", transactionSearchTerm);
        //console.log("payments", paymentsData);
        if (transactionSearchTerm) {
            setFilteredTransactions((paymentsData || []).filter(transaction => {
                const term = transactionSearchTerm.toLowerCase();
                return (
                    (transaction.transaction_id && transaction.transaction_id.toLowerCase().includes(term)) ||
                    (transaction.user_id && transaction.user_id.toLowerCase().includes(term)) ||
                    (transaction.payment_method && String(transaction.payment_method).toLowerCase().includes(term)) ||
                    (transaction.companyName && transaction.companyName.toLowerCase().includes(term))
                );
            }));
        } else {
            setFilteredTransactions(paymentsData);
        }
    }, [transactionSearchTerm]);

    useEffect(() => {
        //console.log("supportSearchTerm", supportSearchTerm);
        //console.log("support", supportTicketsData);
        const term = (supportSearchTerm || '').toLowerCase();

        // Get the appropriate data source based on current tab
        let baseData = [];
        if (supportTab === 'active') {
            baseData = supportTicketsData || [];
        } else if (supportTab === 'Enterprise') {
            baseData = enterpriseTicketsData || [];
        } else if (supportTab === 'resolved') {
            baseData = completedTicketsData || [];
        }

        const filterFn = (ticket) =>
            (ticket.type && ticket.type.toLowerCase().includes(term)) ||
            (ticket.subject && ticket.subject.toLowerCase().includes(term)) ||
            (ticket.ticket_id && ticket.ticket_id.toLowerCase().includes(term));

        if (supportTab === 'Enterprise') {
            setFilteredEnterpriseSupport(term ? baseData.filter(filterFn) : baseData);
        } else {
            setFilteredSupport(term ? baseData.filter(filterFn) : baseData);
        }
    }, [supportSearchTerm, supportTab, supportTicketsData, completedTicketsData, enterpriseTicketsData]);

    useEffect(() => {
        //console.log("notificationSearchTerm", notificationSearchTerm);
        //console.log("notifications", notificationsData);

        if (notificationSearchTerm) {
            const term = notificationSearchTerm.toLowerCase();
            setFilteredNotifications((notificationsData || []).filter(notification =>
                (notification.title && notification.title.toLowerCase().includes(term)) ||
                (notification.description && notification.description.toLowerCase().includes(term)) ||
                (notification.type && notification.type.toLowerCase().includes(term))
            ));
        } else {
            setFilteredNotifications(notificationsData);
        }
    }, [notificationSearchTerm]);

    useEffect(() => {
        const base = notificationsData || [];
        const filtered = base.filter(notification => {
            // time filter
            const time = new Date(notification.created_at || notification.createdAt || notification.time);
            const today = new Date();
            const yesterday = new Date(today);
            yesterday.setDate(today.getDate() - 1);
            const last7Days = new Date(today);
            last7Days.setDate(today.getDate() - 7);
            const last14Days = new Date(today);
            last14Days.setDate(today.getDate() - 14);
            const last30Days = new Date(today);
            last30Days.setDate(today.getDate() - 30);

            let timeOk = true;
            if (notificationTimeFilter === 'today') timeOk = time.toDateString() === today.toDateString();
            else if (notificationTimeFilter === 'yesterday') timeOk = time.toDateString() === yesterday.toDateString();
            else if (notificationTimeFilter === 'last7Days') timeOk = time >= last7Days;
            else if (notificationTimeFilter === 'last14Days') timeOk = time >= last14Days;
            else if (notificationTimeFilter === 'last30Days') timeOk = time >= last30Days;

            // category filter
            const type = (notification.type || '').toLowerCase();
            const cat = (notificationCategoryFilter || 'All Categories').toLowerCase();
            const categoryOk = cat === 'all categories' ? true : type === cat;

            return timeOk && categoryOk;
        });
        setFilteredNotifications(filtered);
    }, [notificationsData, notificationTimeFilter, notificationCategoryFilter]);

    useEffect(() => {
        const base = companiesData || [];
        if (userStatusFilter === 'all') {
            setFilteredUsers(base);
        } else if (userStatusFilter === 'blocked') {
            setFilteredUsers(base.filter(u => u.blocked === true));
        } else if (userStatusFilter === 'active') {
            setFilteredUsers(base.filter(u => !u.blocked && (u.status || '').toLowerCase() === 'active'));
        } else if (userStatusFilter === 'inactive') {
            setFilteredUsers(base.filter(u => !u.blocked && (u.status || '').toLowerCase() === 'inactive'));
        } else {
            setFilteredUsers(base.filter(u => !u.blocked && (u.status || '').toLowerCase() === userStatusFilter));
        }
    }, [companiesData, userStatusFilter]);

    useEffect(() => {
        const base = paymentsData || [];
        const byStatus = transactionStatusFilter === 'all' ? base : base.filter(t => t.status === transactionStatusFilter);
        let result = byStatus;
        if (transactionDateFilter !== 'all') {
            const now = new Date();
            let since = null;

            // Handle all the date filter options from the UI
            if (transactionDateFilter === 'Today') {
                const today = new Date(now);
                today.setHours(0, 0, 0, 0);
                since = today;
            } else if (transactionDateFilter === 'Last 24 Hours') {
                since = new Date(now.getTime() - 24 * 60 * 60 * 1000);
            } else if (transactionDateFilter === 'Last 7 Days' || transactionDateFilter === 'last7Days') {
                since = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            } else if (transactionDateFilter === 'Last 14 Days' || transactionDateFilter === 'last15Days' || transactionDateFilter === 'last14Days') {
                since = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
            } else if (transactionDateFilter === 'Last 30 Days' || transactionDateFilter === 'last30Days') {
                since = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            }

            if (since) {
                result = result.filter(t => {
                    const transactionDate = new Date(t.created_at || t.createdAt);
                    return transactionDate >= since;
                });
            }
        }
        setFilteredTransactions(result);
    }, [paymentsData, transactionStatusFilter, transactionDateFilter]);

    useEffect(() => {
        // Get the appropriate data source based on current tab
        let baseData = [];
        if (supportTab === 'active') {
            baseData = supportTicketsData || [];
        } else if (supportTab === 'Enterprise') {
            baseData = enterpriseTicketsData || [];
        } else if (supportTab === 'resolved') {
            baseData = completedTicketsData || [];
        }

        const filterPipeline = (base) => {
            // For completed tickets tab, don't apply status filter
            if (supportTab === 'resolved') {
                const byPriority = supportPriorityFilter === 'all' ? base : base.filter(t => (t.priority || '').toLowerCase() === supportPriorityFilter.toLowerCase());
                const byType = supportTypeFilter === 'all' ? byPriority : byPriority.filter(t => (t.category || '').toLowerCase() === supportTypeFilter.toLowerCase());
                return byType;
            } else {
                // For other tabs, apply all filters including status
                const byStatus = supportStatusFilter === 'all' ? base : base.filter(t => (t.status === supportStatusFilter));
                const byPriority = supportPriorityFilter === 'all' ? byStatus : byStatus.filter(t => (t.priority || '').toLowerCase() === supportPriorityFilter.toLowerCase());
                const byType = supportTypeFilter === 'all' ? byPriority : byPriority.filter(t => (t.category || '').toLowerCase() === supportTypeFilter.toLowerCase());
                return byType;
            }
        };

        if (supportTab === 'Enterprise') {
            setFilteredEnterpriseSupport(filterPipeline(baseData));
        } else {
            setFilteredSupport(filterPipeline(baseData));
        }
    }, [supportTab, supportTicketsData, completedTicketsData, enterpriseTicketsData, supportStatusFilter, supportPriorityFilter, supportTypeFilter]);

    const subscriptionRows = useMemo(() => {
        const base = Array.isArray(subscriptionsData) ? subscriptionsData : [];

        return base.map(subscription => {
            const planName = toTitleCase(subscription.plan_name || 'Unknown');
            const duration = getDurationLabel(subscription.start_date, subscription.end_date);
            const expiresAtRaw = subscription.end_date;

            const now = Date.now();
            const expiresTimestamp = expiresAtRaw ? new Date(expiresAtRaw).getTime() : null;
            const isActive = !subscription.canceled_at && expiresTimestamp && expiresTimestamp >= now;

            return {
                id: subscription._id,
                companyName: subscription.companyName || 'N/A',
                email: subscription.userEmail || '',
                planName,
                duration,
                expiresAt: formatSubscriptionExpiry(expiresAtRaw),
                expiresAtRaw,
                status: isActive ? 'Active' : 'Inactive',
                isActive,
                autoRenewal: subscription.auto_renewal,
                renewalDate: subscription.renewal_date,
                startDate: subscription.start_date,
                planPrice: subscription.plan_price,
                canceledAt: subscription.canceled_at,
                raw: subscription
            };
        });
    }, [subscriptionsData]);

    const subscriptionPlanOptions = useMemo(() => {
        const set = new Set();
        subscriptionRows.forEach(row => {
            if (row.planName && row.planName !== 'N/A') {
                set.add(row.planName);
            }
        });
        return Array.from(set).sort();
    }, [subscriptionRows]);

    const subscriptionDurationOptions = useMemo(() => {
        const set = new Set();
        subscriptionRows.forEach(row => {
            if (row.duration && row.duration !== 'N/A') {
                set.add(row.duration);
            }
        });
        return Array.from(set).sort();
    }, [subscriptionRows]);

    useEffect(() => {
        setSelectedSubscriptions(prev => {
            if (prev.size === 0) return prev;
            const activeIds = new Set(subscriptionRows.filter(row => row.isActive).map(row => row.id));
            let changed = false;
            const next = new Set();
            prev.forEach(id => {
                if (activeIds.has(id)) {
                    next.add(id);
                } else {
                    changed = true;
                }
            });
            return changed ? next : prev;
        });
    }, [subscriptionRows]);

    const toggleSubscriptionSelection = (record) => {
        if (!record?.id || !record?.isActive) return;
        setSelectedSubscriptions(prev => {
            const next = new Set(prev);
            if (next.has(record.id)) {
                next.delete(record.id);
            } else {
                next.add(record.id);
            }
            return next;
        });
    };

    const handleBulkDeactivate = async () => {
        if (selectedSubscriptions.size === 0) {
            toast.info('Select at least one subscription to deactivate.');
            return;
        }

        const selectedRecords = subscriptionRows.filter(row => row.isActive && selectedSubscriptions.has(row.id));
        if (selectedRecords.length === 0) {
            toast.info('Only active plans can be bulk deactivated.');
            return;
        }

        const result = await Swal.fire({
            title: `Deactivate ${selectedRecords.length} subscription${selectedRecords.length > 1 ? 's' : ''}?`,
            text: 'All selected plans will be deactivated immediately and emails will be sent to each organization owner.',
            icon: 'warning',
            input: 'textarea',
            inputLabel: 'Optional note for the notification emails',
            inputPlaceholder: 'Enter a reason (shared with each organization owner)',
            inputValue: bulkActionNote,
            inputAttributes: {
                'aria-label': 'Enter a reason for bulk deactivation'
            },
            showCancelButton: true,
            confirmButtonColor: '#d33',
            confirmButtonText: 'Yes, deactivate',
            cancelButtonText: 'Cancel'
        });

        if (!result.isConfirmed) return;

        const note = (result.value || '').trim();

        setBulkProcessing(true);
        try {
            const response = await axios.post(`${baseUrl}/admin/bulkDeactivateSubscriptions`, {
                userEmails: selectedRecords.map(row => row.email),
                note: note || ""
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });
            if (response.status === 200) {
                toast.success(`Subscription plan deactivated successfully for ${selectedRecords.length} account(s).`);
                setTimeout(() => {
                    window.location.reload();
                }, 1500);
            } else {
                toast.error('Failed to deactivate subscription plan. Please try again.');
            }
        } catch (error) {
            console.error('Failed to deactivate subscription plan:', error);
            toast.error('Failed to deactivate subscription plan. Please try again.');
        } finally {
            setBulkProcessing(false);
        }
    };

    useEffect(() => {
        let result = subscriptionRows;

        const term = (subscriptionSearchTerm || '').trim().toLowerCase();
        if (term) {
            result = result.filter(row =>
                (row.companyName || '').toLowerCase().includes(term) ||
                (row.email || '').toLowerCase().includes(term) ||
                (row.planName || '').toLowerCase().includes(term) ||
                (row.raw?.userName || '').toLowerCase().includes(term)
            );
        }

        if (subscriptionPlanFilter !== 'all') {
            result = result.filter(row => (row.planName || '').toLowerCase() === subscriptionPlanFilter.toLowerCase());
        }

        if (subscriptionDurationFilter !== 'all') {
            result = result.filter(row => (row.duration || '').toLowerCase() === subscriptionDurationFilter.toLowerCase());
        }

        setFilteredSubscriptions(result);
    }, [subscriptionRows, subscriptionSearchTerm, subscriptionPlanFilter, subscriptionDurationFilter]);

    useEffect(() => {
        setCurrentPageSubscriptions(1);
    }, [subscriptionRows, subscriptionSearchTerm, subscriptionPlanFilter, subscriptionDurationFilter]);

    useEffect(() => {
        if (planManagementInnerTab !== 'subscription') {
            setSubscriptionFilterModal(false);
        }
    }, [planManagementInnerTab]);

    // Add-Ons management state
    const [addOns, setAddOns] = useState([]);
    const [addOnsLoading, setAddOnsLoading] = useState(false);
    const [addOnModalOpen, setAddOnModalOpen] = useState(false);
    const [addOnModalMode, setAddOnModalMode] = useState('create'); // 'create' or 'edit'
    const [selectedAddOn, setSelectedAddOn] = useState(null);
    const [addOnForm, setAddOnForm] = useState({
        name: '',
        description: '',
        // type: 'RFP Proposals Generation',
        quantity: '',
        price: '',
        popular: false
    });
    // const addOnTypes = ["RFP Proposals Generation", "Grant Proposal Generations", "RFP + Grant Proposal Generations"];

    useEffect(() => {
        if (activeTab !== 'plan-management') {
            setPlanManagementInnerTab('plan');
            closeSubscriptionModal();
        }
    }, [activeTab]);

    // Handle tab changes and update filtered data
    useEffect(() => {
        if (supportTab === 'active') {
            setFilteredSupport(supportTicketsData || []);
        } else if (supportTab === 'Enterprise') {
            setFilteredEnterpriseSupport(enterpriseTicketsData || []);
        } else if (supportTab === 'resolved') {
            setFilteredSupport(completedTicketsData || []);
        }
    }, [supportTab, supportTicketsData, completedTicketsData, enterpriseTicketsData]);

    // Removed duplicate notifications filter effect; combined above


    useEffect(() => {
        // Reset pagination when search terms change
        setCurrentPage(1);
        closeAllInvoiceRows();
    }, [searchTerm]);

    useEffect(() => {
        // Reset pagination when transaction search terms change
        setCurrentPageTransactions(1);
        closeAllInvoiceRows();
    }, [transactionSearchTerm]);

    useEffect(() => {
        // Reset pagination when support search terms change
        setCurrentPageSupport(1);
        setCurrentPageEnterpriseSupport(1);
        closeAllInvoiceRows();
    }, [supportSearchTerm]);

    useEffect(() => {
        // Reset pagination when notification search terms change
        setCurrentPageNotifications(1);
        closeAllInvoiceRows();
    }, [notificationSearchTerm]);

    useEffect(() => {
        // Reset pagination when user filters change
        setCurrentPage(1);
        closeAllInvoiceRows();
    }, [userStatusFilter]);

    useEffect(() => {
        // Reset pagination when transaction filters change
        setCurrentPageTransactions(1);
        closeAllInvoiceRows();
    }, [transactionStatusFilter, transactionDateFilter]);

    useEffect(() => {
        // Reset pagination when support filters change
        setCurrentPageSupport(1);
        setCurrentPageEnterpriseSupport(1);
        closeAllInvoiceRows();
    }, [supportStatusFilter, supportPriorityFilter, supportTypeFilter]);

    useEffect(() => {
        // Reset pagination when notification filters change
        setCurrentPageNotifications(1);
        closeAllInvoiceRows();
    }, [notificationTimeFilter, notificationCategoryFilter]);



    const renderUserManagement = () => (
        <div className='h-full '>
            {/* Summary Cards */}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                {/* CARD 1 - Total Proposals */}

                <div className="h-[242px] rounded-2xl bg-gradient-to-b from-[#413B99] to-[#6C63FF] p-6 flex justify-between items-center shadow-lg w-full">
                    {/* Left Content */}
                    <div>
                        <h2 className="text-white text-2xl font-bold">Welcome!</h2>
                        <p className="text-white text-sm mt-2">Total Proposals Generated</p>
                        <div className="flex items-center gap-2 mt-4">
                            <span className="text-white text-4xl font-bold">
                                {usersStats["Total Proposals"]}
                            </span>
                            <img src={parrow} alt="trend" className="w-[56px] h-[56px]" />
                        </div>
                    </div>

                    {/* Right Illustration */}
                    <div>
                        <img src={proposalimg} alt="Proposals" className="mt-[92px] w-[192px] h-[150px]" />
                    </div>
                </div>


                {/* CARD 2 - Remaining Data */}
                <div className="h-[242px] rounded-2xl bg-gradient-to-b from-[#413B99] to-[#6C63FF] p-6 flex justify-between shadow-lg w-full">
                    {/* Left Section */}
                    <div>
                        <h2 className="text-white text-2xl font-bold">Total Users</h2>
                        <p className="text-white text-4xl font-bold mt-2">
                            {usersStats["Total Users"]}
                        </p>

                        <div className="flex gap-4 mt-4">
                            {/* Active Users */}
                            <div className="w-[129px] h-[84px] bg-white/20 backdrop-blur-md rounded-lg px-4 py-2 border border-white">
                                <p className="text-black text-[14px]">Active Users</p>
                                <p className="flex text-lg font-bold">
                                    <span className="text-white text-4xl font-bold">
                                        {usersStats["Active Users"]}
                                    </span>
                                    <img src={bluearrow} alt="trend" className="w-[56px] h-[56px]" />
                                </p>
                            </div>
                            {/* Inactive Users */}
                            <div className="w-[129px] h-[84px] bg-white/20 backdrop-blur-md rounded-lg px-4 py-2 border border-white">
                                <p className="text-black text-[14px]">Inactive Users</p>
                                <p className="flex text-lg font-bold">
                                    <span className="text-white text-4xl font-bold">
                                        {usersStats["Inactive Users"]}
                                    </span>
                                    <img src={redarrow} alt="trend" className="w-[50px] h-[50px]" />
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Right Illustration */}
                    <div className="flex items-center">
                        <img src={user} alt="Users" className="mt-[92px] w-[192px] h-[150px]" />
                    </div>
                </div>
            </div>


            {/* Search and Filter Bar */}
            <div className="mb-6 py-4">
                <div className="flex flex-col gap-3 xs:gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4 lg:flex-1">
                        <div className="relative">
                            <MdOutlineSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#9CA3AF] w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search users by name or email..."
                                value={searchTerm}
                                onChange={(e) => {
                                    setSearchTerm(e.target.value);
                                    closeAllInvoiceRows();
                                }}
                                className="pl-10 pr-4 py-2 border border-[#E5E7EB] rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:border-transparent w-full sm:w-[530px] md:max-w-[480px] lg:min-w-[530px] lg:max-w-[530px] text-[#374151] placeholder-[#9CA3AF] bg-white disabled:opacity-50 disabled:cursor-not-allowed"
                                title="Search users by name or email"
                            />
                        </div>

                        <div className="relative">
                            <button className="bg-white flex items-center justify-center space-x-2 px-4 py-2 border border-[#E5E7EB] rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98] w-full sm:w-auto"
                                onClick={() => setUserFilterModal(!userFilterModal)}
                                title="Filter users by status"
                            >
                                <MdOutlineFilterList className="w-5 h-5" />
                                <span className="text-[16px] text-[#9CA3AF]">Filter</span>
                            </button>

                            {userFilterModal && (
                                <div className="absolute top-10 left-0 w-64 bg-white rounded-lg shadow-lg p-2 flex flex-col gap-2 z-1000 border border-[#E5E7EB] z-1000">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-[14px] font-medium text-[#111827]">Filters</span>
                                        <button
                                            className="text-[12px] text-[#2563EB] hover:underline transition-colors duration-200"
                                            onClick={() => setUserStatusFilter('all')}
                                            title="Clear all user status filters"
                                        >
                                            Clear
                                        </button>
                                    </div>
                                    <div className="flex items-start space-x-2 hover:bg-gray-50 p-2 rounded cursor-pointer mb-2">
                                        <input type="radio" name="userStatusFilter" id="user_all" value="all"
                                            checked={userStatusFilter === 'all'}
                                            onChange={(e) => handleUserStatusChangeFilter(e.target.value)}
                                            className="mt-1"
                                        />
                                        <label htmlFor="user_all" className="cursor-pointer leading-none">All</label>
                                    </div>
                                    {/* Status */}
                                    <span className="text-[16px] font-medium text-[#4B5563]">Status :</span>
                                    <div className="ml-4">
                                        <div className="flex items-start space-x-2 hover:bg-gray-50 p-2 rounded cursor-pointer mb-2">
                                            <input type="radio" name="userStatusFilter" id="active" value="active"
                                                checked={userStatusFilter === 'active'}
                                                onClick={(e) => { if (userStatusFilter === e.target.value) handleUserStatusChangeFilter('all'); }}
                                                onChange={(e) => handleUserStatusChangeFilter(e.target.value)}
                                                className="mt-1"
                                            />
                                            <label htmlFor="active" className="cursor-pointer leading-none">Active</label>
                                        </div>
                                        <div className="flex items-start space-x-2 hover:bg-gray-50 p-2 rounded cursor-pointer mb-2">
                                            <input type="radio" name="userStatusFilter" id="blocked" value="blocked"
                                                checked={userStatusFilter === 'blocked'}
                                                onClick={(e) => { if (userStatusFilter === e.target.value) handleUserStatusChangeFilter('all'); }}
                                                onChange={(e) => handleUserStatusChangeFilter(e.target.value)}
                                                className="mt-1"
                                            />
                                            <label htmlFor="blocked" className="cursor-pointer leading-none">Blocked</label>
                                        </div>
                                        <div className="flex items-start space-x-2 hover:bg-gray-50 p-2 rounded cursor-pointer mb-2">
                                            <input type="radio" name="userStatusFilter" id="inactive" value="inactive"
                                                checked={userStatusFilter === 'inactive'}
                                                onClick={(e) => { if (userStatusFilter === e.target.value) handleUserStatusChangeFilter('all'); }}
                                                onChange={(e) => handleUserStatusChangeFilter(e.target.value)}
                                                className="mt-1"
                                            />
                                            <label htmlFor="inactive" className="cursor-pointer leading-none">Inactive</label>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="flex flex-col gap-3 xs:flex-row xs:items-center xs:gap-3 sm:flex-row sm:items-center sm:gap-3 lg:justify-end">
                        <button
                            onClick={handleExportUsers}
                            className="flex items-center justify-center space-x-2 px-4 py-2 bg-gradient-to-b from-[#6C63FF] to-[#3F73BD] text-white rounded-lg transition-colors w-full sm:w-auto"
                        >
                            <MdOutlineFileUpload className="w-5 h-5" />
                            <span className="text-[16px] text-white">Export</span>
                        </button>
                    </div>

                </div>
            </div>

            {/* Users Table */}
            <div className="bg-white border border-[#E5E7EB] mb-6 overflow-x-auto rounded-2xl">
                <table className="w-full rounded-2xl">
                    <thead className="bg-[#F8F8FF] border-b border-[#0000001A]">
                        <tr>
                            <th className="p-4 text-left text-[16px] font-medium text-[#4B5563] w-1/10">
                                #
                            </th>
                            <th className="p-4 text-left text-[16px] font-medium text-[#4B5563] w-1/3">
                                Company Name
                            </th>
                            <th className="p-4 text-left text-[16px] font-medium text-[#4B5563] w-1/3">
                                Email
                            </th>
                            <th className="p-4 text-left text-[16px] font-medium text-[#4B5563] w-1/6">
                                Status
                            </th>
                            <th className="p-4 text-left text-[16px] font-medium text-[#4B5563] w-1/6">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {(() => {
                            const paginatedUsers = paginateData(filteredUsers, currentPage, rowsPerPage);
                            return paginatedUsers.length > 0 ? paginatedUsers.map((user, index) => (
                                <React.Fragment key={index}>
                                    <tr>
                                        <td className="bg-white p-4 whitespace-nowrap text-[16px] font-medium text-[#4B5563]">
                                            {(currentPage - 1) * rowsPerPage + (index + 1)}
                                        </td>
                                        <td className="flex  p-4 whitespace-nowrap">

                                            <img src={user.logoUrl ? `${baseUrl}/profile/getProfileImage/file/${user.logoUrl}` : "https://via.placeholder.com/150"} alt="User Logo" className="mt-1 mr-1 w-[30px] h-[30px] rounded-full" />

                                            <div className="flex flex-col">
                                                <span className="text-[16px] font-medium text-[#4B5563]">{user.companyName}</span>
                                                <span className="text-[14px] text-[#6C63FF] ">{user.website}</span>
                                            </div>
                                        </td>
                                        <td className="p-4 whitespace-nowrap text-[16px] text-[#6C63FF]">
                                            {user.email}
                                        </td>
                                        <td className="p-4 whitespace-nowrap">
                                            <span className={`inline-flex px-2 py-1 text-[12px] rounded-full ${getStatusColor(user.blocked ? 'Blocked' : user.status)}`}>
                                                {user.blocked ? 'Blocked' : user.status}
                                            </span>
                                        </td>
                                        <td className="p-4 whitespace-nowrap text-[16px] font-medium">
                                            <div className="flex items-center space-x-2">
                                                <button
                                                    className="p-2 rounded-lg transition-colors flex items-center justify-center hover:bg-blue-50"
                                                    onClick={() => openUserModal(user)}
                                                    title="View Details"
                                                >
                                                    <MdOutlineVisibility className="w-5 h-5 text-[#2563EB]" />
                                                </button>

                                            </div>
                                        </td>
                                    </tr>
                                </React.Fragment>
                            )) : (
                                <tr>
                                    <td colSpan={4} className="px-6 py-4 whitespace-nowrap text-[16px] font-medium text-[#4B5563] text-center">
                                        No users found
                                    </td>
                                </tr>
                            );
                        })()}
                    </tbody>
                </table>
                {filteredUsers.length > 0 && (
                    <PaginationComponent
                        currentPage={currentPage}
                        totalPages={getTotalPages(filteredUsers, rowsPerPage)}
                        onPageChange={(page) => {
                            setCurrentPage(page);
                            closeAllInvoiceRows();
                        }}
                        totalItems={filteredUsers.length}
                        rowsPerPage={rowsPerPage}
                        onRowsPerPageChange={(newRowsPerPage) => {
                            setRowsPerPage(newRowsPerPage);
                            setCurrentPage(1); // Reset to first page when changing rows per page
                            closeAllInvoiceRows();
                        }}
                    />
                )}
            </div>
        </div>
    );


    const renderPayments = () => (
        <div className="h-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                {/* Card-1 - Total Revenue */}

                <div className="h-[242px] rounded-2xl bg-gradient-to-b from-[#413B99] to-[#6C63FF] p-4 flex justify-between shadow-lg w-full">
                    {/* Left Section */}
                    <div>
                        <div>
                            <h2 className="text-white text-2xl font-bold">Total Revenue</h2>
                            <p className="text-white text-3xl font-bold mt-2 overflow-hidden">
                                $ {paymentsStats["Total Revenue"] ? paymentsStats["Total Revenue"] : "N/A"}
                            </p>
                        </div>

                        <div className="flex gap-4 mt-4">
                            <div className=" mt-2 bg-white/20 backdrop-blur-md rounded-lg px-4 py-2 border border-white">
                                <p className="text-white text-[14px]">Revenue This Month</p>
                                <p className="flex text-lg font-bold">
                                    <span className="text-white text-3xl font-bold">
                                        $ {paymentsStats["Revenue This Month"] ? paymentsStats["Revenue This Month"] : "N/A"}
                                    </span>
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Right Illustration */}
                    <div className="flex items-center">
                        <img src={revenue} alt="Users" className="mt-[92px] w-[192px] h-[150px]" />
                    </div>
                </div>

                {/* Card-2 - Total Users */}


                <div className="h-[242px] rounded-2xl bg-gradient-to-b from-[#413B99] to-[#6C63FF] p-6 flex justify-between shadow-lg w-full">
                    {/* Left Section */}
                    <div>
                        <h2 className="text-white text-2xl font-bold">Active Subscriptions</h2>
                        <p className="text-white text-3xl font-bold mt-2">
                            {paymentsStats["Active Subscriptions"] ? paymentsStats["Active Subscriptions"] : "N/A"}
                        </p>

                        <div className="flex gap-4 mt-4">
                            <div className=" mt-2 bg-white/20 backdrop-blur-md rounded-lg px-4 py-2 border border-white">
                                <p className="text-white text-[14px]">Inactive Subscriptions</p>
                                <p className="flex text-lg font-bold">
                                    <span className="text-white text-3xl font-bold">
                                        {paymentsStats["Inactive Subscriptions"] ? paymentsStats["Inactive Subscriptions"] : "N/A"}
                                    </span>
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Right Illustration */}
                    <div className="flex items-center">
                        <img src={payment} alt="Users" className="mt-[92px] w-[180px] h-[150px]" />
                    </div>
                </div>


            </div>


            {/* Search and Filter Bar */}
            <div className="mb-6 py-4">
                <div className="flex flex-col gap-3 xs:gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4 lg:flex-1">
                        {/* Search */}
                        <div className="relative">
                            <MdOutlineSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#9CA3AF] w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search transactions..."
                                value={transactionSearchTerm}
                                onChange={(e) => {
                                    setTransactionSearchTerm(e.target.value);
                                    closeAllInvoiceRows();
                                }}
                                className="pl-10 pr-4 py-2 border border-[#E5E7EB] rounded-lg focus:ring-2 focus:ring-[#6C63FF] focus:border-transparent w-full sm:w-[530px] md:max-w-[480px] lg:min-w-[530px] lg:max-w-[530px] text-[#374151] placeholder-[#9CA3AF] bg-white disabled:opacity-50 disabled:cursor-not-allowed"
                                title="Search transactions by company name, email, or transaction ID"
                            />
                        </div>

                        {/* Filter */}
                        <div className="relative">
                            <button
                                className="bg-white flex items-center justify-center space-x-2 px-4 py-2 border border-[#E5E7EB] rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98] w-full sm:w-auto"
                                onClick={() => setTransactionFilterModal(!transactionFilterModal)}
                                title="Filter transactions by status and date"
                            >
                                <MdOutlineFilterList className="w-5 h-5" />
                                <span className="text-[16px] text-[#9CA3AF]">Filter</span>
                            </button>
                            {transactionFilterModal && (
                                <div className="absolute top-10 left-0 w-64 bg-white rounded-lg shadow-lg p-2 flex flex-col gap-2 z-50 border border-[#E5E7EB]">
                                    {/* Filter content same as before */}
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-[14px] font-medium text-[#111827]">Filters</span>
                                        <button
                                            className="text-[12px] text-[#2563EB] hover:underline transition-colors duration-200"
                                            onClick={() => { handleTransactionStatusChangeFilter('all'); handleTransactionDateChangeFilter('all'); }}
                                            title="Clear all transaction filters"
                                        >
                                            Clear
                                        </button>
                                    </div>
                                    {/* All */}
                                    <div className="flex items-center space-x-2">
                                        <input type="radio" name="transactionStatusFilter" id="all" value="all"
                                            checked={transactionStatusFilter === 'all'}
                                            onChange={(e) => handleTransactionStatusChangeFilter(e.target.value)}
                                        />
                                        <label htmlFor="all" className="cursor-pointer leading-none">All</label>
                                    </div>
                                    {/* Status */}
                                    <span className="text-[16px] font-medium text-[#4B5563]">Status :</span>
                                    <div className="ml-4">
                                        <div className="flex items-start space-x-2 hover:bg-gray-50 p-2 rounded cursor-pointer mb-2">
                                            <input type="radio" name="transactionStatusFilter" id="success" value="Success"
                                                checked={transactionStatusFilter === 'Success'}
                                                onClick={(e) => { if (transactionStatusFilter === e.target.value) handleTransactionStatusChangeFilter('all'); }}
                                                onChange={(e) => handleTransactionStatusChangeFilter(e.target.value)}
                                                className="mt-1"
                                            />
                                            <label htmlFor="success" className="cursor-pointer leading-none">Success</label>
                                        </div>
                                        <div className="flex items-start space-x-2 hover:bg-gray-50 p-2 rounded cursor-pointer mb-2">
                                            <input type="radio" name="transactionStatusFilter" id="failed" value="Failed"
                                                checked={transactionStatusFilter === 'Failed'}
                                                onClick={(e) => { if (transactionStatusFilter === e.target.value) handleTransactionStatusChangeFilter('all'); }}
                                                onChange={(e) => handleTransactionStatusChangeFilter(e.target.value)}
                                                className="mt-1"
                                            />
                                            <label htmlFor="failed" className="cursor-pointer leading-none">Failed</label>
                                        </div>
                                        <div className="flex items-start space-x-2 hover:bg-gray-50 p-2 rounded cursor-pointer mb-2">
                                            <input type="radio" name="transactionStatusFilter" id="refunded" value="Refunded"
                                                checked={transactionStatusFilter === 'Refunded'}
                                                onClick={(e) => { if (transactionStatusFilter === e.target.value) handleTransactionStatusChangeFilter('all'); }}
                                                onChange={(e) => handleTransactionStatusChangeFilter(e.target.value)}
                                                className="mt-1"
                                            />
                                            <label htmlFor="refunded" className="cursor-pointer leading-none">Refunded</label>
                                        </div>
                                        <div className="flex items-start space-x-2 hover:bg-gray-50 p-2 rounded cursor-pointer mb-2">
                                            <input type="radio" name="transactionStatusFilter" id="pendingRefund" value="Pending Refund"
                                                checked={transactionStatusFilter === 'Pending Refund'}
                                                onClick={(e) => { if (transactionStatusFilter === e.target.value) handleTransactionStatusChangeFilter('all'); }}
                                                onChange={(e) => handleTransactionStatusChangeFilter(e.target.value)}
                                                className="mt-1"
                                            />
                                            <label htmlFor="pendingRefund" className="cursor-pointer leading-none">Pending Refund</label>
                                        </div>
                                    </div>
                                    {/* Date */}
                                    <span className="text-[16px] font-medium text-[#4B5563]">Date :</span>
                                    <div className="ml-4">
                                        <div className="flex items-start space-x-2 hover:bg-gray-50 p-2 rounded cursor-pointer mb-2">
                                            <input type="radio" name="transactionDateFilter" id="today" value="Today"
                                                checked={transactionDateFilter === 'Today'}
                                                onClick={(e) => { if (transactionDateFilter === e.target.value) handleTransactionDateChangeFilter('all'); }}
                                                onChange={(e) => handleTransactionDateChangeFilter(e.target.value)}
                                                className="mt-1"
                                            />
                                            <label htmlFor="today" className="cursor-pointer leading-none">Today</label>
                                        </div>
                                        <div className="flex items-start space-x-2 hover:bg-gray-50 p-2 rounded cursor-pointer mb-2">
                                            <input type="radio" name="transactionDateFilter" id="last24hours" value="Last 24 Hours"
                                                checked={transactionDateFilter === 'Last 24 Hours'}
                                                onClick={(e) => { if (transactionDateFilter === e.target.value) handleTransactionDateChangeFilter('all'); }}
                                                onChange={(e) => handleTransactionDateChangeFilter(e.target.value)}
                                                className="mt-1"
                                            />
                                            <label htmlFor="last24hours" className="cursor-pointer leading-none">Last 24 Hours</label>
                                        </div>
                                        <div className="flex items-start space-x-2 hover:bg-gray-50 p-2 rounded cursor-pointer mb-2">
                                            <input type="radio" name="transactionDateFilter" id="last7days" value="Last 7 Days"
                                                checked={transactionDateFilter === 'Last 7 Days'}
                                                onClick={(e) => { if (transactionDateFilter === e.target.value) handleTransactionDateChangeFilter('all'); }}
                                                onChange={(e) => handleTransactionDateChangeFilter(e.target.value)}
                                                className="mt-1"
                                            />
                                            <label htmlFor="last7days" className="cursor-pointer leading-none">Last 7 Days</label>
                                        </div>
                                        <div className="flex items-start space-x-2 hover:bg-gray-50 p-2 rounded cursor-pointer mb-2">
                                            <input type="radio" name="transactionDateFilter" id="last14days" value="Last 14 Days"
                                                checked={transactionDateFilter === 'Last 14 Days'}
                                                onClick={(e) => { if (transactionDateFilter === e.target.value) handleTransactionDateChangeFilter('all'); }}
                                                onChange={(e) => handleTransactionDateChangeFilter(e.target.value)}
                                                className="mt-1"
                                            />
                                            <label htmlFor="last14days" className="cursor-pointer leading-none">Last 14 Days</label>
                                        </div>
                                        <div className="flex items-start space-x-2 hover:bg-gray-50 p-2 rounded cursor-pointer mb-2">
                                            <input type="radio" name="transactionDateFilter" id="last30days" value="Last 30 Days"
                                                checked={transactionDateFilter === 'Last 30 Days'}
                                                onClick={(e) => { if (transactionDateFilter === e.target.value) handleTransactionDateChangeFilter('all'); }}
                                                onChange={(e) => handleTransactionDateChangeFilter(e.target.value)}
                                                className="mt-1"
                                            />
                                            <label htmlFor="last30days" className="cursor-pointer leading-none">Last 30 Days</label>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Export Button */}
                    <div className="flex flex-col gap-3 xs:flex-row xs:items-center xs:gap-3 sm:flex-row sm:items-center sm:gap-3 lg:justify-end">
                        <button
                            onClick={handleExportTransactions}
                            className="flex items-center justify-center space-x-2 px-4 py-2 bg-gradient-to-b from-[#6C63FF] to-[#3F73BD] text-white rounded-lg transition-colors w-full sm:w-auto"
                        >
                            <MdOutlineFileUpload className="w-5 h-5" />
                            <span className="text-[16px] text-white">Export</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Transactions Table */}
            <div className="bg-white border border-[#E5E7EB] mb-6 overflow-x-auto rounded-2xl">
                <table className="w-full rounded-2xl">
                    <thead className="bg-[#F8F8FF] border-b border-[#0000001A]">
                        <tr>
                            <th className="p-4 text-left text-[16px] font-medium text-[#4B5563]">
                                Transaction ID
                            </th>
                            <th className="p-4 text-left text-[16px] font-medium text-[#4B5563]">
                                Company/User
                            </th>
                            <th className="p-4 text-left text-[16px] font-medium text-[#4B5563]">
                                Amount
                            </th>
                            <th className="p-4 text-left text-[16px] font-medium text-[#4B5563]">
                                Status
                            </th>
                            <th className="p-4 text-left text-[16px] font-medium text-[#4B5563]">
                                Action
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {(() => {
                            const paginatedTransactions = paginateData(
                                filteredTransactions,
                                currentPageTransactions,
                                rowsPerPage
                            );
                            return paginatedTransactions.length > 0 ? (
                                paginatedTransactions.map((transaction, index) => (
                                    <React.Fragment key={index}>
                                        <tr className="hover:bg-[#F8FAFC] transition-colors">
                                            <td className="p-4 whitespace-nowrap text-[16px] font-medium text-[#4B5563]">
                                                {transaction.transaction_id}
                                            </td>
                                            <td className="p-4 whitespace-nowrap text-[16px] font-medium text-[#4B5563]">
                                                {transaction.companyName}
                                            </td>
                                            <td className="p-4 whitespace-nowrap text-[16px] font-medium text-[#6C63FF]">
                                                ${transaction.price}
                                            </td>
                                            <td className="p-4 whitespace-nowrap">
                                                <span
                                                    className={`inline-flex px-3 py-1 text-[12px] font-semibold rounded-full ${getStatusColor(
                                                        transaction.status
                                                    )}`}
                                                >
                                                    {transaction.status}
                                                </span>
                                            </td>
                                            <td className="p-4 whitespace-nowrap text-[16px] font-medium">
                                                <button
                                                    className="p-2 rounded-lg transition-colors flex items-center justify-center hover:bg-blue-50"
                                                    onClick={() =>
                                                        toggleInvoiceRow(`payment-${transaction.transaction_id}`)
                                                    }
                                                    title="View Invoice"
                                                >
                                                    <MdOutlineVisibility className="w-5 h-5 text-[#6C63FF]" />
                                                </button>
                                            </td>
                                        </tr>
                                        <InlineInvoiceModal
                                            data={transaction}
                                            isOpen={openInvoiceRows.has(
                                                `payment-${transaction.transaction_id}`
                                            )}
                                            onClose={() =>
                                                toggleInvoiceRow(`payment-${transaction.transaction_id}`)
                                            }
                                        />
                                    </React.Fragment>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan={5}
                                        className="px-6 py-4 whitespace-nowrap text-[16px] font-medium text-[#4B5563] text-center"
                                    >
                                        No transactions found
                                    </td>
                                </tr>
                            );
                        })()}
                    </tbody>
                </table>

                {filteredTransactions.length > 0 && (
                    <PaginationComponent
                        currentPage={currentPageTransactions}
                        totalPages={getTotalPages(filteredTransactions, rowsPerPage)}
                        onPageChange={(page) => {
                            setCurrentPageTransactions(page);
                            closeAllInvoiceRows();
                        }}
                        totalItems={filteredTransactions.length}
                        rowsPerPage={rowsPerPage}
                        onRowsPerPageChange={(newRowsPerPage) => {
                            setRowsPerPage(newRowsPerPage);
                            setCurrentPageTransactions(1);
                            closeAllInvoiceRows();
                        }}
                    />
                )}
            </div>
        </div>
    );
    const subPlan = async () => {
        if (!isSuperAdmin) return;
        try {
            const data = await axios.get(`${baseUrl}/admin/getSubscriptionPlansData`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            setPlans(data.data);
            for (let i = 0; i < data.data.plans.length; i++) {
                if (data.data.plans[i].name === "Enterprise") {
                    setIsContact(data.data.plans[i].isContact);
                    break;
                }
            }
        } catch (err) {
            Swal.fire({
                title: "Failed to fetch plans:",
                icon: "warning",
                timer: 1500,
                showConfirmButton: false,
                showCancelButton: false,
            });
        }
    };

    useEffect(() => {
        if (!isSuperAdmin) return;
        subPlan();
    }, [isSuperAdmin]);

    useEffect(() => {
        if (!isSuperAdmin) return;
        fetchAllSubscriptions();
    }, [fetchAllSubscriptions, isSuperAdmin]);


    const startEdit = (plan) => {
        const value = {
            editPrice: {
                value:
                    plan.name === "Basic" && isYearlyb
                        ? plan.yearlyPrice
                        : plan.name === "Pro" && isYearlyp
                            ? plan.yearlyPrice
                            : plan.name === "Enterprise" && isYearlye
                                ? plan.yearlyPrice
                                : plan.monthlyPrice,
                planId: plan._id,
                planName: plan.name,
            },
            editValue: {
                maxEditors: plan.maxEditors,
                maxViewers: plan.maxViewers,
                maxRFPProposalGenerations: plan.maxRFPProposalGenerations,
                maxGrantProposalGenerations: plan.maxGrantProposalGenerations,
                maxMagicBrushUsage: plan.maxMagicBrushUsage,
                maxImageGenerationUsage: plan.maxImageGenerationUsage,
            },
        };
        setEditingPlans((prev) => ({ ...prev, [plan._id]: value }));
    };

    const cancelEdit = (planId) => {
        setEditingPlans((prev) => {
            const updated = { ...prev };
            delete updated[planId];
            return updated;
        });
    };


    const saveEdit = async (planId) => {
        const planState = editingPlans[planId];
        if (!planState) return;

        setLoading(true);
        try {
            let payload = {};
            const { editPrice, editValue } = planState;

            if (editPrice.planName === "Basic") {
                payload = isYearlyb
                    ? { yearlyPrice: editPrice.value }
                    : { monthlyPrice: editPrice.value };
            } else if (editPrice.planName === "Pro") {
                payload = isYearlyp
                    ? { yearlyPrice: editPrice.value }
                    : { monthlyPrice: editPrice.value };
            } else if (editPrice.planName === "Enterprise") {
                payload = isYearlye
                    ? { yearlyPrice: editPrice.value }
                    : { monthlyPrice: editPrice.value };
            }

            payload = { ...payload, ...editValue };

            await axios.put(
                `${baseUrl}/admin/updateSubscriptionPlanPrice/${editPrice.planId}`,
                payload,
                {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                }
            );

            await subPlan();
            cancelEdit(planId);
        } catch (err) {
            Swal.fire({
                title: "Failed to update plan:",
                icon: "warning",
                timer: 1500,
                showConfirmButton: false,
                showCancelButton: false,
            });
        } finally {
            setLoading(false);
        }
    };






    const getPlanSection = (planName) => {
        const plan = plans.plans?.find((p) => p.name === planName);
        if (!plan) return null;

        const editPrice = editingPlans[plan._id]?.editPrice;

        return (
            <div
                className={`border rounded-2xl p-6 w-full h-[900px] sm:h-[650px] lg:h-[900px] shadow-md relative transition-transform hover:scale-105 flex flex-col ${plans.mostPopularPlan === planName
                    ? "border-blue-500"
                    : "border-gray-300"
                    }`}
            >
                {plans.mostPopularPlan === planName && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-[#2F3349] to-[#717AAF] text-white text-xs px-3 py-1 rounded-full">
                        Most Popular
                    </div>
                )}

                {planName === "Basic" ? (
                    <>
                        {!editingPlans[plan._id] ? (
                            <p className="text-2xl font-bold mb-4">
                                ${isYearlyb ? plan.yearlyPrice : plan.monthlyPrice}
                                <span className="text-sm font-normal">/{isYearlyb ? "year" : "month"}</span>
                            </p>
                        ) : (
                            <input
                                type="number"
                                value={editPrice?.value || ""}
                                onChange={(e) =>
                                    setEditingPlans((prev) => ({
                                        ...prev,
                                        [plan._id]: {
                                            ...prev[plan._id],
                                            editPrice: { ...prev[plan._id].editPrice, value: e.target.value },
                                        },
                                    }))
                                }
                                className="text-2xl font-bold mb-4 border rounded-lg px-2 py-1 w-full"
                            />
                        )}
                        <div className="flex items-center mb-4 relative bg-gray-200 rounded-full w-[160px] p-1 ml-[50%] -translate-x-1/2">
                            {/* Sliding background knob */}
                            <div
                                className={`absolute top-1 left-1 w-[75px] h-[28px] rounded-full bg-[#6C63FF] transition-transform duration-300 ${isYearlyb ? "translate-x-[78px]" : "translate-x-0"
                                    }`}
                            ></div>

                            {/* Monthly button */}
                            <span
                                className={`relative z-10 flex-1 text-center py-1 text-sm font-medium cursor-pointer transition-colors ${!isYearlyb ? "text-white" : "text-[#6C63FF]"
                                    }`}
                                onClick={() => setIsYearlyb(false)}
                                style={{ userSelect: "none" }}
                            >
                                Monthly
                            </span>

                            {/* Yearly button */}
                            <span
                                className={`relative z-10 flex-1 text-center py-1 text-sm font-medium cursor-pointer transition-colors ${isYearlyb ? "text-white" : "text-[#6C63FF]"
                                    }`}
                                onClick={() => setIsYearlyb(true)}
                                style={{ userSelect: "none" }}
                            >
                                Yearly
                            </span>
                        </div>
                        <h2 className="text-lg font-semibold mb-2">{plan.name}</h2>
                        <ul className="space-y-2 mb-6">
                            <li className="flex items-center text-gray-700">
                                <span className="text-green-500 p-1">
                                    <FaRegCheckCircle className="w-4 h-4" />
                                </span>
                                AI-Driven RFP Discovery
                            </li>
                            <li className="flex items-center text-gray-700">
                                <span className="text-green-500 p-1">
                                    <FaRegCheckCircle className="w-4 h-4" />
                                </span>
                                AI-Driven Grant Discovery
                            </li>
                            <li className="flex items-center text-gray-700">
                                <span className="text-green-500 p-1">
                                    <FaRegCheckCircle className="w-4 h-4" />
                                </span>
                                Proposals Tracking Dashboard
                            </li>
                            <li className="flex items-center text-gray-700">
                                <span className="text-green-500 p-1">
                                    <FaRegCheckCircle className="w-4 h-4" />
                                </span>
                                {editingPlans[plan._id] ? (
                                    <>
                                        Up to
                                        <input
                                            type="number"
                                            value={editingPlans[plan._id].editValue.maxRFPProposalGenerations}
                                            onChange={(e) => {
                                                const validated = validateNumberInput(e.target.value, true);
                                                setEditingPlans((prev) => ({
                                                    ...prev,
                                                    [plan._id]: {
                                                        ...prev[plan._id],
                                                        editValue: {
                                                            ...prev[plan._id].editValue,
                                                            maxRFPProposalGenerations: validated,
                                                        },
                                                    },
                                                }));
                                            }}
                                            onKeyDown={(e) => {
                                                if (e.key === '-' || e.key === 'e' || e.key === 'E' || e.key === '+') {
                                                    e.preventDefault();
                                                }
                                            }}
                                            className="w-1/2 border rounded-lg px-2 py-1"
                                        />
                                        AI - RFP Proposal Generations
                                    </>
                                ) : (
                                    <span>
                                        Up to{" "}
                                        {editingPlans[plan._id]?.editValue?.maxRFPProposalGenerations ??
                                            plan.maxRFPProposalGenerations}{" "}
                                        AI - RFP Proposal Generations
                                    </span>
                                )}


                            </li>
                            <li className="flex items-center text-gray-700">
                                <span className="text-green-500 p-1">
                                    <FaRegCheckCircle className="w-4 h-4" />
                                </span>
                                {editingPlans[plan._id] ? (
                                    <>
                                        Up to
                                        <input
                                            type="number"
                                            value={editingPlans[plan._id].editValue.maxGrantProposalGenerations}
                                            onChange={(e) =>
                                                setEditingPlans((prev) => ({
                                                    ...prev,
                                                    [plan._id]: {
                                                        ...prev[plan._id],
                                                        editValue: {
                                                            ...prev[plan._id].editValue,
                                                            maxGrantProposalGenerations: e.target.value,
                                                        },
                                                    },
                                                }))
                                            }
                                            className="w-1/2 border rounded-lg px-2 py-1"
                                        />
                                        AI - Grant Proposal Generations
                                    </>
                                ) : (
                                    <span>
                                        Up to{" "}
                                        {editingPlans[plan._id]?.editValue?.maxGrantProposalGenerations ??
                                            plan.maxGrantProposalGenerations}{" "}
                                        AI - Grant Proposal Generations
                                    </span>
                                )}

                            </li>
                            <li className="flex items-center text-gray-700">
                                <span className="text-green-500 p-1">
                                    <FaRegCheckCircle className="w-4 h-4" />
                                </span>
                                Rich Proposal Editor
                            </li>
                            <li className="flex items-center text-gray-700">
                                <span className="text-green-500 p-1">
                                    <FaRegCheckCircle className="w-4 h-4" />
                                </span>
                                {editingPlans[plan._id] ? (
                                    <span className="flex items-center gap-2">
                                        AI Magic Brush -
                                        <input
                                            type="number"
                                            value={editingPlans[plan._id].editValue.maxMagicBrushUsage}
                                            onChange={(e) => {
                                                const validated = validateNumberInput(e.target.value, true);
                                                setEditingPlans((prev) => ({
                                                    ...prev,
                                                    [plan._id]: {
                                                        ...prev[plan._id],
                                                        editValue: {
                                                            ...prev[plan._id].editValue,
                                                            maxMagicBrushUsage: validated,
                                                        },
                                                    },
                                                }));
                                            }}
                                            onKeyDown={(e) => {
                                                if (e.key === '-' || e.key === 'e' || e.key === 'E' || e.key === '+') {
                                                    e.preventDefault();
                                                }
                                            }}
                                            className="w-20 border rounded-lg px-2 py-1 text-center"
                                        />
                                        times per month
                                    </span>
                                ) : (
                                    <span>
                                        AI Magic Brush - {editingPlans[plan._id]?.editValue?.maxMagicBrushUsage ?? plan.maxMagicBrushUsage ?? 0} times per month
                                    </span>
                                )}
                            </li>
                            <li className="flex items-center text-gray-700">
                                <span className="text-green-500 p-1">
                                    <FaRegCheckCircle className="w-4 h-4" />
                                </span>
                                Team Collaboration - Upto 2 users can collaborate at a time
                            </li>
                            <li className="flex items-center text-gray-700">
                                <span className="text-green-500 p-1">
                                    <FaRegCheckCircle className="w-4 h-4" />
                                </span>
                                Basic Compliance Check - Upto 2 times per RFP
                            </li>
                            <li className="flex items-center text-gray-700">
                                <span className="text-green-500 p-1">
                                    <FaRegCheckCircle className="w-4 h-4" />
                                </span>
                                {editingPlans[plan._id] ? (
                                    <>
                                        <input
                                            type="number"
                                            value={editingPlans[plan._id].editValue.maxEditors}
                                            onChange={(e) => {
                                                const validated = validateNumberInput(e.target.value, true);
                                                setEditingPlans((prev) => ({
                                                    ...prev,
                                                    [plan._id]: {
                                                        ...prev[plan._id],
                                                        editValue: {
                                                            ...prev[plan._id].editValue,
                                                            maxEditors: validated,
                                                        },
                                                    },
                                                }));
                                            }}
                                            onKeyDown={(e) => {
                                                if (e.key === '-' || e.key === 'e' || e.key === 'E' || e.key === '+') {
                                                    e.preventDefault();
                                                }
                                            }}
                                            className="w-1/2 border rounded-lg px-2 py-1 focus:ring-2 focus:ring-blue-400 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                                            placeholder="Max editors"
                                            title="Enter maximum number of editors"
                                        />
                                        Editors,
                                        <input
                                            type="number"
                                            value={editingPlans[plan._id].editValue.maxViewers}
                                            onChange={(e) => {
                                                const validated = validateNumberInput(e.target.value, true);
                                                setEditingPlans((prev) => ({
                                                    ...prev,
                                                    [plan._id]: {
                                                        ...prev[plan._id],
                                                        editValue: {
                                                            ...prev[plan._id].editValue,
                                                            maxViewers: validated,
                                                        },
                                                    },
                                                }));
                                            }}
                                            onKeyDown={(e) => {
                                                if (e.key === '-' || e.key === 'e' || e.key === 'E' || e.key === '+') {
                                                    e.preventDefault();
                                                }
                                            }}
                                            className="w-1/2 border rounded-lg px-2 py-1 focus:ring-2 focus:ring-blue-400 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                                            placeholder="Max viewers"
                                            title="Enter maximum number of viewers"
                                        />
                                        Viewers, Unlimited Members
                                    </>
                                ) : (
                                    <>
                                        {editingPlans[plan._id]?.editValue?.maxEditors
                                            ? `${editingPlans[plan._id].editValue.maxEditors} Editors, ${editingPlans[plan._id].editValue.maxViewers} Viewers, Unlimited Members`
                                            : `${plan.maxEditors} Editors, ${plan.maxViewers} Viewers, Unlimited Members`}
                                    </>
                                )}


                            </li>
                            <li className="flex items-center text-gray-700">
                                <span className="text-green-500 p-1">
                                    <FaRegCheckCircle className="w-4 h-4" />
                                </span>
                                Support
                            </li>
                        </ul>
                    </>
                ) : planName === "Pro" ? (
                    <>
                        {!editingPlans[plan._id] ? (
                            <p className="text-2xl font-bold mb-4">
                                ${isYearlyp ? plan.yearlyPrice : plan.monthlyPrice}
                                <span className="text-sm font-normal">/{isYearlyp ? "year" : "month"}</span>
                            </p>
                        ) : (
                            <input
                                type="number"
                                value={editPrice?.value || ""}
                                onChange={(e) =>
                                    setEditingPlans((prev) => ({
                                        ...prev,
                                        [plan._id]: {
                                            ...prev[plan._id],
                                            editPrice: { ...prev[plan._id].editPrice, value: e.target.value },
                                        },
                                    }))
                                }
                                className="text-2xl font-bold mb-4 border rounded-lg px-2 py-1 w-full"
                            />
                        )}
                        <div className="flex items-center mb-4 relative bg-gray-200 rounded-full w-[160px] p-1 ml-[50%] -translate-x-1/2">
                            {/* Sliding background knob */}
                            <div
                                className={`absolute top-1 left-1 w-[75px] h-[28px] rounded-full bg-[#6C63FF] transition-transform duration-300 ${isYearlyp ? "translate-x-[78px]" : "translate-x-0"
                                    }`}
                            ></div>

                            {/* Monthly button */}
                            <span
                                className={`relative z-10 flex-1 text-center py-1 text-sm font-medium cursor-pointer transition-colors ${!isYearlyp ? "text-white" : "text-[#6C63FF]"
                                    }`}
                                onClick={() => setIsYearlyp(false)}
                                style={{ userSelect: "none" }}
                            >
                                Monthly
                            </span>

                            {/* Yearly button */}
                            <span
                                className={`relative z-10 flex-1 text-center py-1 text-sm font-medium cursor-pointer transition-colors ${isYearlyp ? "text-white" : "text-[#6C63FF]"
                                    }`}
                                onClick={() => setIsYearlyp(true)}
                                style={{ userSelect: "none" }}
                            >
                                Yearly
                            </span>
                        </div>
                        <h2 className="text-lg font-semibold mb-2">{plan.name}</h2>
                        <ul className="space-y-2 mb-6">
                            <li className="flex items-center text-[#6C63FF] text-lg font-semibold">
                                <span className="text-green-500 p-1">
                                    <FaRegCheckCircle className="w-4 h-4" />
                                </span>
                                Includes All Basic Features
                            </li>
                            <li className="flex items-center text-gray-700">
                                <span className="text-green-500 p-1">
                                    <FaRegCheckCircle className="w-4 h-4" />
                                </span>
                                {editingPlans[plan._id] ? (
                                    <span className="flex items-center gap-2">
                                        AI Magic Brush -
                                        <input
                                            type="number"
                                            value={editingPlans[plan._id].editValue.maxMagicBrushUsage}
                                            onChange={(e) => {
                                                const validated = validateNumberInput(e.target.value, true);
                                                setEditingPlans((prev) => ({
                                                    ...prev,
                                                    [plan._id]: {
                                                        ...prev[plan._id],
                                                        editValue: {
                                                            ...prev[plan._id].editValue,
                                                            maxMagicBrushUsage: validated,
                                                        },
                                                    },
                                                }));
                                            }}
                                            onKeyDown={(e) => {
                                                if (e.key === '-' || e.key === 'e' || e.key === 'E' || e.key === '+') {
                                                    e.preventDefault();
                                                }
                                            }}
                                            className="w-20 border rounded-lg px-2 py-1 text-center"
                                        />
                                        times per month
                                    </span>
                                ) : (
                                    <span>
                                        AI Magic Brush - {editingPlans[plan._id]?.editValue?.maxMagicBrushUsage ?? plan.maxMagicBrushUsage ?? 0} times per month
                                    </span>
                                )}
                            </li>
                            <li className="flex items-center text-gray-700">
                                <span className="text-green-500 p-1">
                                    <FaRegCheckCircle className="w-4 h-4" />
                                </span>
                                {editingPlans[plan._id] ? (
                                    <span className="flex items-center gap-2">
                                        AI Image Generation for Proposals - Upto
                                        <input
                                            type="number"
                                            value={editingPlans[plan._id].editValue.maxImageGenerationUsage}
                                            onChange={(e) => {
                                                const validated = validateNumberInput(e.target.value, true);
                                                setEditingPlans((prev) => ({
                                                    ...prev,
                                                    [plan._id]: {
                                                        ...prev[plan._id],
                                                        editValue: {
                                                            ...prev[plan._id].editValue,
                                                            maxImageGenerationUsage: validated,
                                                        },
                                                    },
                                                }));
                                            }}
                                            onKeyDown={(e) => {
                                                if (e.key === '-' || e.key === 'e' || e.key === 'E' || e.key === '+') {
                                                    e.preventDefault();
                                                }
                                            }}
                                            className="w-20 border rounded-lg px-2 py-1 text-center"
                                        />
                                        times per month
                                    </span>
                                ) : (
                                    <span>
                                        AI Image Generation for Proposals - Upto {editingPlans[plan._id]?.editValue?.maxImageGenerationUsage ?? plan.maxImageGenerationUsage ?? 0} times per month
                                    </span>
                                )}
                            </li>
                            <li className="flex items-center text-gray-700">
                                <span className="text-green-500 p-1">
                                    <FaRegCheckCircle className="w-4 h-4" />
                                </span>
                                AI Chat Assist
                            </li>
                            <li className="flex items-center text-gray-700">
                                <span className="text-green-500 p-1">
                                    <FaRegCheckCircle className="w-4 h-4" />
                                </span>
                                Team Collaboration - Upto 5 users can collaborate at a time
                            </li>
                            <li className="flex items-center text-gray-700">
                                <span className="text-green-500 p-1">
                                    <FaRegCheckCircle className="w-4 h-4" />
                                </span>
                                Advanced Compliance Check - Upto 3 times per RFP
                            </li>
                            <li className="flex items-center text-gray-700">
                                <span className="text-green-500 p-1">
                                    <FaRegCheckCircle className="w-4 h-4" />
                                </span>
                                AI Scoring System
                            </li>
                            <li className="flex items-center text-gray-700">
                                <span className="text-green-500 p-1">
                                    <FaRegCheckCircle className="w-4 h-4" />
                                </span>
                                AI Competitor Industry Insights
                            </li>
                            <li className="flex items-center text-gray-700">
                                <span className="text-green-500 p-1">
                                    <FaRegCheckCircle className="w-4 h-4" />
                                </span>
                                RFP Matchmaking
                            </li>
                            <li className="flex items-center text-gray-700">
                                <span className="text-green-500 p-1">
                                    <FaRegCheckCircle className="w-4 h-4" />
                                </span>
                                {editingPlans[plan._id] ? (
                                    <span className="flex items-center gap-2">
                                        Up to
                                        <input
                                            type="number"
                                            value={editingPlans[plan._id].editValue.maxRFPProposalGenerations}
                                            onChange={(e) => {
                                                const validated = validateNumberInput(e.target.value, true);
                                                setEditingPlans((prev) => ({
                                                    ...prev,
                                                    [plan._id]: {
                                                        ...prev[plan._id],
                                                        editValue: {
                                                            ...prev[plan._id].editValue,
                                                            maxRFPProposalGenerations: validated,
                                                        },
                                                    },
                                                }));
                                            }}
                                            onKeyDown={(e) => {
                                                if (e.key === '-' || e.key === 'e' || e.key === 'E' || e.key === '+') {
                                                    e.preventDefault();
                                                }
                                            }}
                                            className="w-20 border rounded-lg px-2 py-1 text-center"
                                        />
                                        AI - RFP Proposal Generations
                                    </span>
                                ) : (
                                    <span>
                                        Up to{" "}
                                        {editingPlans[plan._id]?.editValue?.maxRFPProposalGenerations
                                            ? editingPlans[plan._id].editValue.maxRFPProposalGenerations
                                            : plan.maxRFPProposalGenerations}{" "}
                                        AI - RFP Proposal Generations
                                    </span>
                                )}

                            </li>
                            <li className="flex items-center text-gray-700">
                                <span className="text-green-500 p-1">
                                    <FaRegCheckCircle className="w-4 h-4" />
                                </span>
                                {editingPlans[plan._id] ? (
                                    <>
                                        Up to
                                        <input
                                            type="number"
                                            value={editingPlans[plan._id].editValue.maxGrantProposalGenerations}
                                            onChange={(e) => {
                                                const validated = validateNumberInput(e.target.value, true);
                                                setEditingPlans((prev) => ({ ...prev, [plan._id]: { ...prev[plan._id], editValue: { ...prev[plan._id].editValue, maxGrantProposalGenerations: validated } } }));
                                            }}
                                            onKeyDown={(e) => {
                                                if (e.key === '-' || e.key === 'e' || e.key === 'E' || e.key === '+') {
                                                    e.preventDefault();
                                                }
                                            }}
                                            className="w-1/2 border rounded-lg px-2 py-1"
                                        />
                                        AI - Grant Proposal Generations
                                    </>
                                ) : (
                                    <span>
                                        Up to {editingPlans[plan._id]?.editValue?.maxGrantProposalGenerations ? editingPlans[plan._id].editValue.maxGrantProposalGenerations : plan.maxGrantProposalGenerations} AI - Grant Proposal Generations
                                    </span>
                                )}

                            </li>
                            <li className="flex items-center text-gray-700">
                                <span className="text-green-500 p-1">
                                    <FaRegCheckCircle className="w-4 h-4" />
                                </span>
                                {editingPlans[plan._id] ? (
                                    <>
                                        <input
                                            type="number"
                                            value={editingPlans[plan._id].editValue.maxEditors}
                                            onChange={(e) => {
                                                const validated = validateNumberInput(e.target.value, true);
                                                setEditingPlans((prev) => ({ ...prev, [plan._id]: { ...prev[plan._id], editValue: { ...prev[plan._id].editValue, maxEditors: validated } } }));
                                            }}
                                            onKeyDown={(e) => {
                                                if (e.key === '-' || e.key === 'e' || e.key === 'E' || e.key === '+') {
                                                    e.preventDefault();
                                                }
                                            }}
                                            className="w-1/2 border rounded-lg px-2 py-1 focus:ring-2 focus:ring-blue-400 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                                            placeholder="Max editors"
                                            title="Enter maximum number of editors"
                                        />
                                        Editors,
                                        <input
                                            type="number"
                                            value={editingPlans[plan._id].editValue.maxViewers}
                                            onChange={(e) => {
                                                const validated = validateNumberInput(e.target.value, true);
                                                setEditingPlans((prev) => ({ ...prev, [plan._id]: { ...prev[plan._id], editValue: { ...prev[plan._id].editValue, maxViewers: validated } } }));
                                            }}
                                            onKeyDown={(e) => {
                                                if (e.key === '-' || e.key === 'e' || e.key === 'E' || e.key === '+') {
                                                    e.preventDefault();
                                                }
                                            }}
                                            className="w-1/2 border rounded-lg px-2 py-1 focus:ring-2 focus:ring-blue-400 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                                            placeholder="Max viewers"
                                            title="Enter maximum number of viewers"
                                        />
                                        Viewers, Unlimited Members
                                    </>
                                ) : (
                                    <>
                                        {editingPlans[plan._id]?.editValue?.maxEditors
                                            ? `${editingPlans[plan._id].editValue.maxEditors} Editors, ${editingPlans[plan._id].editValue.maxViewers} Viewers, Unlimited Members`
                                            : `${plan.maxEditors} Editors, ${plan.maxViewers} Viewers, Unlimited Members`}
                                    </>
                                )}

                            </li>
                        </ul>
                    </>
                ) : planName === "Enterprise" ? (
                    <>
                        {/*IsContact Toggle Button */}
                        <div className="flex justify-end">
                            <div className="flex items-center gap-2">
                                <span className="text-gray-700">Contact Us</span>
                                <button
                                    onClick={updateContacts}
                                    className={`w-12 h-6 flex items-center rounded-full p-1 transition-all duration-300 shadow-md hover:shadow-lg ${isContact ? "bg-green-500" : "bg-gray-300"
                                        }`}
                                    title={isContact ? "Disable 'Contact Us' option" : "Enable 'Contact Us' option"}
                                >
                                    <div
                                        className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300 ${isContact ? "translate-x-6" : "translate-x-0"
                                            }`}
                                    ></div>
                                </button>
                            </div>
                        </div>


                        {!editingPlans[plan._id] ? (
                            <p className="text-2xl font-bold mb-4">
                                ${isYearlye ? plan.yearlyPrice : plan.monthlyPrice}
                                <span className="text-sm font-normal">/{isYearlye ? "year" : "month"}</span>
                            </p>
                        ) : (
                            <input
                                type="number"
                                value={editPrice?.value || ""}
                                onChange={(e) =>
                                    setEditingPlans((prev) => ({
                                        ...prev,
                                        [plan._id]: {
                                            ...prev[plan._id],
                                            editPrice: { ...prev[plan._id].editPrice, value: e.target.value },
                                        },
                                    }))
                                }
                                className="text-2xl font-bold mb-4 border rounded-lg px-2 py-1 w-full"
                            />
                        )}


                        <div className="flex items-center mb-4 relative bg-gray-200 rounded-full w-[160px] p-1 ml-[50%] -translate-x-1/2">
                            {/* Sliding background knob */}
                            <div
                                className={`absolute top-1 left-1 w-[75px] h-[28px] rounded-full bg-[#6C63FF] transition-transform duration-300 ${isYearlye ? "translate-x-[78px]" : "translate-x-0"
                                    }`}
                            ></div>

                            {/* Monthly button */}
                            <span
                                className={`relative z-10 flex-1 text-center py-1 text-sm font-medium cursor-pointer transition-colors ${!isYearlye ? "text-white" : "text-[#6C63FF]"
                                    }`}
                                onClick={() => setIsYearlye(false)}
                                style={{ userSelect: "none" }}
                                title="Switch to monthly billing"
                            >
                                Monthly
                            </span>

                            {/* Yearly button */}
                            <span
                                className={`relative z-10 flex-1 text-center py-1 text-sm font-medium cursor-pointer transition-colors ${isYearlye ? "text-white" : "text-[#6C63FF]"
                                    }`}
                                onClick={() => setIsYearlye(true)}
                                style={{ userSelect: "none" }}
                                title="Switch to yearly billing"
                            >
                                Yearly
                            </span>
                        </div>


                        <h2 className="text-lg font-semibold mb-2">{plan.name}</h2>
                        <ul className="space-y-2 mb-6">
                            <li className="flex items-center text-[#6C63FF] text-lg font-semibold">
                                <span className="text-green-500 p-1">
                                    <FaRegCheckCircle className="w-4 h-4" />
                                </span>
                                Includes All Basic & Pro Features
                            </li>
                            <li className="flex items-center text-gray-700">
                                <span className="text-green-500 p-1">
                                    <FaRegCheckCircle className="w-4 h-4" />
                                </span>
                                {editingPlans[plan._id] ? (
                                    <>
                                        Up to

                                        <input type="number" value={editingPlans[plan._id].editValue.maxRFPProposalGenerations} onChange={(e) => setEditingPlans((prev) => ({ ...prev, [plan._id]: { ...prev[plan._id], editValue: { ...prev[plan._id].editValue, maxRFPProposalGenerations: e.target.value } } }))} className="w-1/2 border rounded-lg px-2 py-1" />
                                        AI - RFP Proposal Generations
                                    </>
                                ) : (
                                    <span>
                                        {isContact
                                            ? "Custom AI-RFP Proposal Generations"
                                            : `Up to ${editingPlans[plan._id]?.editValue?.maxRFPProposalGenerations
                                                ? editingPlans[plan._id].editValue.maxRFPProposalGenerations
                                                : plan.maxRFPProposalGenerations
                                            } AI - RFP Proposal Generations`
                                        }
                                    </span>
                                )}

                            </li>
                            <li className="flex items-center text-gray-700">
                                <span className="text-green-500 p-1">
                                    <FaRegCheckCircle className="w-4 h-4" />
                                </span>
                                {editingPlans[plan._id] ? (
                                    <>
                                        Up to
                                        <input
                                            type="number"
                                            value={editingPlans[plan._id].editValue.maxGrantProposalGenerations}
                                            onChange={(e) =>
                                                setEditingPlans((prev) => ({
                                                    ...prev,
                                                    [plan._id]: {
                                                        ...prev[plan._id],
                                                        editValue: {
                                                            ...prev[plan._id].editValue,
                                                            maxGrantProposalGenerations: e.target.value,
                                                        },
                                                    },
                                                }))
                                            }
                                            className="w-1/2 border rounded-lg px-2 py-1"
                                        />
                                        AI - Grant Proposal Generations
                                    </>
                                ) : (
                                    <span>

                                        {isContact
                                            ? "Custom AI-Grant Proposal Generations"
                                            : `Up to ${editingPlans[plan._id]?.editValue?.maxGrantProposalGenerations
                                                ? editingPlans[plan._id].editValue.maxGrantProposalGenerations
                                                : plan.maxGrantProposalGenerations
                                            } AI - Grant Proposal Generations`
                                        }

                                    </span>
                                )}

                            </li>
                            <li className="flex items-center text-gray-700">
                                <span className="text-green-500 p-1">
                                    <FaRegCheckCircle className="w-4 h-4" />
                                </span>
                                {isContact
                                    ? "Custom Editors, Custom Viewers, Custom Members"
                                    : "Unlimited Editors, Unlimited Viewers, Unlimited Members"
                                }


                            </li>
                            <li className="flex items-center text-gray-700">
                                <span className="text-green-500 p-1">
                                    <FaRegCheckCircle className="w-4 h-4" />
                                </span>
                                Dedicated Support
                            </li>


                        </ul>
                    </>
                ) : null}

                {
                    ((!isContact) || (isContact && plan.name !== "Enterprise")) && (
                        !editingPlans[plan._id] ? (
                            <button
                                className="w-full py-2 rounded-lg bg-gradient-to-b from-[#6C63FF] to-[#3F73BD] text-white font-medium shadow mt-auto transition-all duration-200 hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98]"
                                onClick={() => startEdit(plan)}
                                title="Edit subscription plan details"
                            >
                                Edit
                            </button>
                        ) : (
                            <div className="flex gap-2 mt-auto">
                                <button
                                    className="w-1/2 py-2 rounded-lg bg-gray-300 text-black font-medium shadow transition-all duration-200 hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                                    onClick={() => cancelEdit(plan._id)}
                                    disabled={loading}
                                    title={loading ? "Please wait..." : "Cancel editing plan"}
                                >
                                    Cancel
                                </button>
                                <button
                                    className="w-1/2 py-2 rounded-lg bg-gradient-to-b from-[#6C63FF] to-[#3F73BD] text-white font-medium shadow transition-all duration-200 hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                                    onClick={() => saveEdit(plan._id)}
                                    disabled={loading}
                                    title={loading ? "Saving plan changes..." : "Save plan changes"}
                                >
                                    {loading ? "Saving..." : "Save"}
                                </button>
                            </div>
                        )
                    )
                }
            </div>
        );



    };
    const updateContacts = async () => {
        const plan = plans.plans?.find((p) => p.name === "Enterprise");
        try {
            await axios.put(
                `${baseUrl}/admin/updateSubscriptionPlanIsContact/${plan._id}`,
                {
                    isContact: !isContact,
                },
                {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                }
            );
            setIsContact(!isContact);
        } catch (error) {
            Swal.fire({
                title: "Failed to update contacts: " + (error.response?.data?.message || error.message),
                icon: "error",
                timer: 1500,
                showConfirmButton: false,
                showCancelButton: false,
            });
        } finally {
            setLoading(false);
        }
    };




    const renderSubscriptionManagement = () => {
        const source = filteredSubscriptions || [];
        const paginatedSubscriptions = paginateData(source, currentPageSubscriptions, rowsPerPageSubscriptions);
        const selectedCount = selectedSubscriptions.size;
        const selectableVisible = paginatedSubscriptions.filter(record => record.isActive);
        const allVisibleSelected = selectableVisible.length > 0 && selectableVisible.every(record => selectedSubscriptions.has(record.id));
        const toggleVisibleSelection = (checked) => {
            setSelectedSubscriptions(prev => {
                const next = new Set(prev);
                selectableVisible.forEach(record => {
                    if (!record?.id) return;
                    if (checked) {
                        next.add(record.id);
                    } else {
                        next.delete(record.id);
                    }
                });
                return next;
            });
        };
        const statusBadgeClass = (status) =>
            status === 'Active'
                ? 'bg-green-100 text-green-700 border border-green-200'
                : 'bg-gray-100 text-gray-600 border border-gray-200';

        return (
            <div className="h-full">
                <div className="mt-10 space-y-6">
                    <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6">
                        <div className="flex flex-col gap-3 xs:gap-4 lg:flex-row lg:items-center lg:justify-between">
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:flex-wrap sm:gap-4 lg:flex-1">
                                <div className="relative flex-1 min-w-[220px]">
                                    <MdOutlineSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#9CA3AF] w-5 h-5" />
                                    <input
                                        type="text"
                                        placeholder="Search by company or email..."
                                        value={subscriptionSearchTerm}
                                        onChange={(e) => {
                                            setSubscriptionSearchTerm(e.target.value);
                                            closeAllInvoiceRows();
                                        }}
                                        className="pl-10 pr-4 py-2 border border-[#E5E7EB] rounded-lg focus:ring-2 focus:ring-[#6C63FF] focus:border-transparent w-full text-[#374151] placeholder-[#9CA3AF] bg-white"
                                        title="Search subscriptions"
                                    />
                                </div>

                                <div className="relative md:w-auto w-full md:flex-shrink-0">
                                    <button
                                        className="bg-white flex items-center justify-center space-x-2 px-4 py-2 border border-[#E5E7EB] rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98] w-full md:w-auto"
                                        onClick={() => setSubscriptionFilterModal(prev => !prev)}
                                        title="Filter subscriptions"
                                    >
                                        <MdOutlineFilterList className="w-5 h-5" />
                                        <span className="text-[16px] text-[#9CA3AF]">Filter</span>
                                    </button>

                                    {subscriptionFilterModal && (
                                        <div className="absolute top-12 left-0 md:left-auto md:right-0 w-72 bg-white rounded-lg shadow-lg p-4 flex flex-col gap-4 z-[1000] border border-[#E5E7EB]">
                                            <div className="flex items-center justify-between">
                                                <span className="text-[14px] font-medium text-[#111827]">Filters</span>
                                                <button
                                                    className="text-[12px] text-[#2563EB] hover:underline"
                                                    onClick={() => {
                                                        resetSubscriptionFilters();
                                                        setSubscriptionFilterModal(false);
                                                    }}
                                                >
                                                    Clear All
                                                </button>
                                            </div>

                                            <div>
                                                <span className="text-[14px] font-medium text-[#4B5563]">Plan Type</span>
                                                <div className="mt-2 space-y-1">
                                                    <label className="flex items-center space-x-2 text-sm text-[#4B5563] hover:bg-gray-50 p-2 rounded cursor-pointer">
                                                        <input
                                                            type="radio"
                                                            name="subscriptionPlanFilter"
                                                            value="all"
                                                            checked={subscriptionPlanFilter === 'all'}
                                                            onChange={() => setSubscriptionPlanFilter('all')}
                                                        />
                                                        <span>All</span>
                                                    </label>
                                                    {subscriptionPlanOptions.length > 0 ? (
                                                        subscriptionPlanOptions.map(option => (
                                                            <label
                                                                key={option}
                                                                className="flex items-center space-x-2 text-sm text-[#4B5563] hover:bg-gray-50 p-2 rounded cursor-pointer"
                                                            >
                                                                <input
                                                                    type="radio"
                                                                    name="subscriptionPlanFilter"
                                                                    value={option}
                                                                    checked={subscriptionPlanFilter === option}
                                                                    onChange={() => handleSubscriptionPlanFilterChange(option)}
                                                                />
                                                                <span>{option}</span>
                                                            </label>
                                                        ))
                                                    ) : (
                                                        <p className="text-sm text-[#9CA3AF]">No plan data found</p>
                                                    )}
                                                </div>
                                            </div>

                                            <div>
                                                <span className="text-[14px] font-medium text-[#4B5563]">Duration</span>
                                                <div className="mt-2 space-y-1">
                                                    <label className="flex items-center space-x-2 text-sm text-[#4B5563] hover:bg-gray-50 p-2 rounded cursor-pointer">
                                                        <input
                                                            type="radio"
                                                            name="subscriptionDurationFilter"
                                                            value="all"
                                                            checked={subscriptionDurationFilter === 'all'}
                                                            onChange={() => setSubscriptionDurationFilter('all')}
                                                        />
                                                        <span>All</span>
                                                    </label>
                                                    {["Monthly", "Yearly"].map((option) => (
                                                        <label
                                                            key={option}
                                                            className="flex items-center space-x-2 text-sm text-[#4B5563] hover:bg-gray-50 p-2 rounded cursor-pointer"
                                                        >
                                                            <input
                                                                type="radio"
                                                                name="subscriptionDurationFilter"
                                                                value={option}
                                                                checked={subscriptionDurationFilter === option}
                                                                onChange={() => handleSubscriptionDurationFilterChange(option)}
                                                            />
                                                            <span>{option}</span>
                                                        </label>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="flex flex-col gap-3 xs:flex-row xs:items-center xs:gap-3 sm:flex-row sm:items-center sm:gap-3 lg:justify-end w-full lg:w-auto">
                                <button
                                    onClick={openCreateSubscriptionModal}
                                    className="flex items-center justify-center space-x-2 px-4 py-2 bg-white border border-[#6C63FF] text-[#6C63FF] rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98] w-full sm:w-auto"
                                >
                                    <div className="flex items-center space-x-2">
                                        <MdOutlineAdd className="w-5 h-5" />
                                        <span className="text-[16px] font-medium ">Add</span>
                                    </div>
                                </button>
                                <button
                                    onClick={handleExportSubscriptions}
                                    className="flex items-center justify-center space-x-2 px-4 py-2 bg-gradient-to-b from-[#6C63FF] to-[#3F73BD] text-white rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98] w-full sm:w-auto"
                                >
                                    <span className="text-[16px] font-medium">Export</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white border border-[#E5E7EB] rounded-2xl overflow-x-auto">
                        {subscriptionsLoading && subscriptionRows.length === 0 ? (
                            <div className="p-8 flex justify-center">
                                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#6C63FF]"></div>
                            </div>
                        ) : null}

                        {selectedCount > 0 && (
                            <div className="bg-[#EEF2FF] border border-[#C7D2FE] rounded-t-2xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                                <div>
                                    <p className="text-[#1E3A8A] font-semibold">
                                        {selectedCount} subscription{selectedCount > 1 ? 's' : ''} selected
                                    </p>
                                    <p className="text-sm text-[#1E3A8A] opacity-80">
                                        Bulk deactivation happens instantly and the organization owner receives an email notification.
                                    </p>
                                </div>
                                <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full sm:w-auto">
                                    <textarea
                                        className="w-full sm:w-64 px-3 py-2 border border-[#C7D2FE] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6C63FF] text-sm text-[#1E3A8A]"
                                        rows={2}
                                        placeholder="Optional note for the email notification"
                                        value={bulkActionNote}
                                        onChange={(e) => setBulkActionNote(e.target.value)}
                                    />
                                    <button
                                        onClick={handleBulkDeactivate}
                                        disabled={bulkProcessing}
                                        className="px-4 py-2 bg-gradient-to-b from-[#EF4444] to-[#B91C1C] text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed min-w-[190px]"
                                    >
                                        {bulkProcessing ? 'Processing...' : `Deactivate ${selectedCount > 1 ? 'Selected Accounts' : 'Selected Account'}`}
                                    </button>
                                </div>
                            </div>
                        )}

                        <table className="w-full rounded-2xl">
                            <thead className="bg-[#F8F8FF] border-b border-[#0000001A]">
                                <tr>
                                    <th className="p-4 w-12">
                                        <div className="flex items-center justify-center">
                                            <input
                                                type="checkbox"
                                                className="w-4 h-4 text-[#6C63FF] border-[#6C63FF] rounded focus:ring-[#6C63FF]"
                                                checked={selectableVisible.length > 0 && allVisibleSelected}
                                                disabled={selectableVisible.length === 0}
                                                onChange={(e) => toggleVisibleSelection(e.target.checked)}
                                                aria-label="Select all visible active subscriptions"
                                            />
                                        </div>
                                    </th>
                                    <th className="p-4 text-left text-[16px] font-medium text-[#4B5563] w-1/3">Company</th>
                                    <th className="p-4 text-left text-[16px] font-medium text-[#4B5563] w-1/3">Plan Type & Duration</th>
                                    <th className="p-4 text-left text-[16px] font-medium text-[#4B5563] w-1/5 text-center">Status</th>
                                    <th className="p-4 text-left text-[16px] font-medium text-[#4B5563] w-1/5">Expires On</th>
                                    <th className="p-4 text-left text-[16px] font-medium text-[#4B5563] w-[140px] text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedSubscriptions.length > 0 ? (
                                    paginatedSubscriptions.map((record, index) => {
                                        const combinedPlan = record.duration && record.duration !== 'N/A'
                                            ? `${record.planName} / ${record.duration}`
                                            : record.planName;

                                        return (
                                            <tr key={record.id || index} className="hover:bg-[#F8FAFC] transition-colors">
                                                <td className="p-4 text-center">
                                                    <input
                                                        type="checkbox"
                                                        className="w-4 h-4 text-[#6C63FF] border-[#6C63FF] rounded focus:ring-[#6C63FF] disabled:opacity-40 disabled:cursor-not-allowed"
                                                        checked={record.isActive && selectedSubscriptions.has(record.id)}
                                                        disabled={!record.isActive}
                                                        onChange={() => toggleSubscriptionSelection(record)}
                                                        aria-label={`Select ${record.companyName}`}
                                                        title={record.isActive ? 'Select for bulk actions' : 'Plan already inactive'}
                                                    />
                                                </td>
                                                <td className="p-4 whitespace-nowrap text-[16px] font-medium text-[#4B5563]">
                                                    <div className="flex flex-col">
                                                        <span>{record.companyName}</span>
                                                        {record.email && (
                                                            <span className="text-sm text-[#6B7280]">{record.email}</span>
                                                        )}
                                                        {record.raw?.userName && (
                                                            <span className="text-xs text-[#9CA3AF]">{record.raw.userName}</span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="p-4 whitespace-nowrap text-[16px] font-medium text-[#4B5563]">
                                                    {combinedPlan}
                                                </td>
                                                <td className="p-4 whitespace-nowrap text-[16px] font-medium text-[#4B5563]">
                                                    <div className="flex flex-col gap-1">
                                                        <span className={`inline-flex items-center justify-center px-3 py-1 text-xs font-semibold rounded-full ${statusBadgeClass(record.status)}`}>
                                                            {record.status}
                                                        </span>
                                                        {/* <span className="text-xs text-[#6B7280]">
                                                            {record.autoRenewal ? 'Auto-renews enabled' : 'Manual renewal'}
                                                        </span> */}
                                                    </div>
                                                </td>
                                                <td className="p-4 whitespace-nowrap text-[16px] font-medium text-[#4B5563]">
                                                    {record.expiresAt}
                                                </td>
                                                <td className="p-4 whitespace-nowrap">
                                                    <div className="flex items-center justify-center gap-2">
                                                        <button
                                                            className="inline-flex items-center justify-center w-10 h-10 rounded-lg border border-[#E5E7EB] bg-white transition-all duration-200 hover:bg-[#EEF2FF]"
                                                            onClick={() => openEditSubscriptionModal(record)}
                                                            title="Assign or edit plan"
                                                        >
                                                            <MdOutlineEdit className="w-5 h-5 text-[#6C63FF]" />
                                                        </button>
                                                        {/* {record.isActive && (
                                                            <button
                                                                className="inline-flex items-center justify-center w-10 h-10 rounded-lg border border-[#FCA5A5] bg-white transition-all duration-200 hover:bg-red-50"
                                                                onClick={() => handleSubscriptionDeactivate(record)}
                                                                title="Deactivate plan"
                                                            >
                                                                <MdOutlinePowerSettingsNew className="w-5 h-5 text-[#DC2626]" />
                                                            </button>
                                                        )} */}
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-8 text-center text-[16px] font-medium text-[#4B5563]">
                                            {subscriptionsLoading ? 'Loading subscriptions...' : 'No subscriptions found'}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>

                        {source.length > 0 && (
                            <div className="px-4 pb-6">
                                <PaginationComponent
                                    currentPage={currentPageSubscriptions}
                                    totalPages={getTotalPages(source, rowsPerPageSubscriptions)}
                                    onPageChange={(page) => setCurrentPageSubscriptions(page)}
                                    totalItems={source.length}
                                    rowsPerPage={rowsPerPageSubscriptions}
                                    onRowsPerPageChange={(value) => {
                                        setRowsPerPageSubscriptions(value);
                                        setCurrentPageSubscriptions(1);
                                    }}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    // Fetch add-ons from backend
    const fetchAddOns = async () => {
        setAddOnsLoading(true);
        try {
            const response = await axios.get(
                `${baseUrl}/getAddOnPlans`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );
            setAddOns(response.data || []);
        } catch (error) {
            console.error('Error fetching add-ons:', error);
            Swal.fire({
                title: "Failed to fetch add-ons",
                icon: "error",
                timer: 1500,
                showConfirmButton: false,
                showCancelButton: false,
            });
            setAddOns([]);
        } finally {
            setAddOnsLoading(false);
        }
    };

    // Open create add-on modal
    const openCreateAddOnModal = () => {
        setAddOnModalMode('create');
        setSelectedAddOn(null);
        setAddOnForm({
            name: '',
            description: '',
            type: '',
            quantity: '',
            price: '',
            popular: false
        });
        setAddOnModalOpen(true);
    };

    // Open edit add-on modal
    const openEditAddOnModal = (addOn) => {
        setAddOnModalMode('edit');
        setSelectedAddOn(addOn);
        setAddOnForm({
            name: addOn.name || addOn.title || '',
            description: addOn.description || '',
            // type: addOn.type || '',
            quantity: addOn.quantity || '',
            price: addOn.price || addOn.monthlyPrice || '',
            popular: addOn.popular || false
        });
        setAddOnModalOpen(true);
    };

    // Close add-on modal
    const closeAddOnModal = () => {
        setAddOnModalOpen(false);
        setSelectedAddOn(null);
        setAddOnForm({
            name: '',
            description: '',
            // type: '',
            quantity: '',
            price: '',
            popular: false
        });
    };

    // Handle add-on form submission
    const handleAddOnSubmit = async () => {
        if (!addOnForm.name.trim() || !addOnForm.quantity || !addOnForm.price) {
            Swal.fire({
                title: "Please fill in all required fields",
                icon: "warning",
                timer: 1500,
                showConfirmButton: false,
                showCancelButton: false,
            });
            return;
        }

        if (parseInt(addOnForm.quantity) <= 0) {
            Swal.fire({
                title: "Quantity must be greater than 0",
                icon: "warning",
                timer: 1500,
                showConfirmButton: false,
                showCancelButton: false,
            });
            return;
        }

        setAddOnsLoading(true);
        try {
            const payload = {
                name: addOnForm.name.trim(),
                description: addOnForm.description.trim(),
                // type: addOnForm.type,
                quantity: parseInt(addOnForm.quantity),
                price: parseFloat(addOnForm.price),
                popular: addOnForm.popular
            };

            if (addOnModalMode === 'create') {
                await axios.post(
                    `${baseUrl}/admin/createAddOnPlan`,
                    payload,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`,
                        },
                    }
                );
                toast.success('Add-on created successfully');
            } else {
                await axios.put(
                    `${baseUrl}/admin/updateAddOnPlan/${selectedAddOn._id}`,
                    payload,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`,
                        },
                    }
                );
                toast.success('Add-on updated successfully');
            }

            await fetchAddOns();
            closeAddOnModal();
        } catch (error) {
            console.error('Error saving add-on:', error);
            Swal.fire({
                title: `Failed to ${addOnModalMode === 'create' ? 'create' : 'update'} add-on`,
                text: error.response?.data?.message || error.message,
                icon: "error",
                timer: 2000,
                showConfirmButton: false,
                showCancelButton: false,
            });
        } finally {
            setAddOnsLoading(false);
        }
    };

    // Delete add-on
    const handleDeleteAddOn = async (addOnId) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!'
        });

        if (result.isConfirmed) {
            setAddOnsLoading(true);
            try {
                await axios.delete(
                    `${baseUrl}/admin/deleteAddOnPlan/${addOnId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`,
                        },
                    }
                );
                toast.success('Add-on deleted successfully');
                await fetchAddOns();
            } catch (error) {
                console.error('Error deleting add-on:', error);
                Swal.fire({
                    title: "Failed to delete add-on",
                    text: error.response?.data?.message || error.message,
                    icon: "error",
                    timer: 2000,
                    showConfirmButton: false,
                    showCancelButton: false,
                });
            } finally {
                setAddOnsLoading(false);
            }
        }
    };

    // Fetch add-ons when tab is active
    useEffect(() => {
        if (planManagementInnerTab === 'addons' && isSuperAdmin) {
            fetchAddOns();
        }
    }, [planManagementInnerTab, isSuperAdmin]);

    const renderAddOnsManagement = () => {
        return (
            <div className="h-full">
                <div className="mt-10 space-y-6">
                    <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6">
                        <div className="flex flex-col gap-3 xs:gap-4 lg:flex-row lg:items-center lg:justify-between">
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:flex-wrap sm:gap-4 lg:flex-1">
                                <h2 className="text-xl font-semibold text-[#111827]">Manage Add-Ons</h2>
                            </div>

                            <div className="flex flex-col gap-3 xs:flex-row xs:items-center xs:gap-3 sm:flex-row sm:items-center sm:gap-3 lg:justify-end w-full lg:w-auto">
                                <button
                                    onClick={openCreateAddOnModal}
                                    className="flex items-center justify-center space-x-2 px-4 py-2 bg-white border border-[#6C63FF] text-[#6C63FF] rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98] w-full sm:w-auto"
                                >
                                    <div className="flex items-center space-x-2">
                                        <MdOutlineAdd className="w-5 h-5" />
                                        <span className="text-[16px] font-medium">Create Add-On</span>
                                    </div>
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white border border-[#E5E7EB] rounded-2xl overflow-x-auto">
                        {addOnsLoading && addOns.length === 0 ? (
                            <div className="p-8 flex justify-center">
                                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#6C63FF]"></div>
                            </div>
                        ) : addOns.length === 0 ? (
                            <div className="p-8 text-center text-[#4B5563]">
                                <p className="text-lg">No add-ons found. Create your first add-on!</p>
                            </div>
                        ) : (
                            <div className="p-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {addOns.map((addOn) => (
                                        <div
                                            key={addOn._id || addOn.id}
                                            className={`border rounded-2xl p-6 shadow-md relative transition-transform hover:scale-105 flex flex-col ${addOn.popular ? "border-[#6C63FF]" : "border-gray-300"
                                                }`}
                                        >
                                            {addOn.popular && (
                                                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-[#6C63FF] to-[#8B7CF6] text-white text-xs px-3 py-1 rounded-full">
                                                    Popular
                                                </div>
                                            )}

                                            <h3 className="text-xl font-bold text-gray-900 mb-2">{addOn.name || addOn.title}</h3>
                                            <div className="mb-4">
                                                <span className="text-2xl font-bold text-gray-900">
                                                    ${addOn.price || addOn.monthlyPrice || 0}
                                                </span>
                                            </div>

                                            {addOn.description && (
                                                <p className="text-gray-600 mb-4 text-sm">{addOn.description}</p>
                                            )}

                                            <div className="mb-4 flex-grow">
                                                {/* {addOn.type && (
                                                    <div className="mb-2">
                                                        <span className="text-sm font-medium text-gray-700">Type: </span>
                                                        <span className="text-sm text-gray-600">{addOn.type}</span>
                                                    </div>
                                                )} */}
                                                {addOn.quantity && (
                                                    <div>
                                                        <span className="text-sm font-medium text-gray-700">Quantity: </span>
                                                        <span className="text-sm text-gray-600">{addOn.quantity}</span>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex gap-2 mt-auto">
                                                <button
                                                    className="flex-1 py-2 rounded-lg bg-gradient-to-b from-[#6C63FF] to-[#3F73BD] text-white font-medium shadow transition-all duration-200 hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98]"
                                                    onClick={() => openEditAddOnModal(addOn)}
                                                    title="Edit add-on"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    className="flex-1 py-2 rounded-lg bg-red-500 text-white font-medium shadow transition-all duration-200 hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98]"
                                                    onClick={() => handleDeleteAddOn(addOn._id || addOn.id)}
                                                    title="Delete add-on"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Add-On Modal */}
                {addOnModalOpen && (
                    <div className="fixed inset-0 z-[1100] flex items-center justify-center bg-black/40 p-4">
                        <div className="bg-white rounded-2xl w-full max-w-2xl shadow-xl flex flex-col max-h-[90vh]">
                            <div className="flex items-center justify-between sticky top-0 bg-white px-6 pt-6 pb-4 border-b border-[#E5E7EB] z-10">
                                <h3 className="text-xl font-semibold text-[#111827]">
                                    {addOnModalMode === 'create' ? 'Create New Add-On' : 'Edit Add-On'}
                                </h3>
                                <button
                                    onClick={closeAddOnModal}
                                    className="p-2 rounded-full hover:bg-gray-100 text-[#4B5563]"
                                >
                                    <MdOutlineClose className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="px-6 pb-6 space-y-6 overflow-y-auto mt-4">
                                <div className="flex flex-col">
                                    <label className="text-md font-bold text-[#4B5563] mb-1">Add-On Type</label>
                                    {/* <select
                                        value={addOnForm.type}
                                        onChange={(e) => setAddOnForm(prev => ({ ...prev, type: e.target.value }))}
                                        className="border border-[#E5E7EB] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#6C63FF]"
                                        disabled={addOnsLoading}
                                    >
                                        <option value="">Select add-on type</option>
                                        {addOnTypes.map((type) => (
                                            <option key={type} value={type}>{type}</option>
                                        ))}
                                    </select> */}
                                    <span className="text-md text-gray-600">RFP Proposals Generation</span>
                                </div>

                                <div className="flex flex-col">
                                    <label className="text-sm font-medium text-[#4B5563] mb-1">Add-On Name *</label>
                                    <input
                                        type="text"
                                        value={addOnForm.name}
                                        onChange={(e) => setAddOnForm(prev => ({ ...prev, name: e.target.value }))}
                                        placeholder="Enter add-on name"
                                        className="border border-[#E5E7EB] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#6C63FF]"
                                        disabled={addOnsLoading}
                                    />
                                </div>

                                <div className="flex flex-col">
                                    <label className="text-sm font-medium text-[#4B5563] mb-1">Description</label>
                                    <textarea
                                        value={addOnForm.description}
                                        onChange={(e) => setAddOnForm(prev => ({ ...prev, description: e.target.value }))}
                                        placeholder="Enter add-on description"
                                        rows={3}
                                        className="border border-[#E5E7EB] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#6C63FF]"
                                        disabled={addOnsLoading}
                                    />
                                </div>

                                <div className="flex flex-col">
                                    <label className="text-sm font-medium text-[#4B5563] mb-1">Quantity *</label>
                                    <input
                                        type="number"
                                        min="1"
                                        step="1"
                                        value={addOnForm.quantity}
                                        onChange={(e) => {
                                            const validated = validateNumberInput(e.target.value, false);
                                            setAddOnForm(prev => ({ ...prev, quantity: validated }));
                                        }}
                                        onKeyDown={(e) => {
                                            if (e.key === '-' || e.key === 'e' || e.key === 'E' || e.key === '+') {
                                                e.preventDefault();
                                            }
                                        }}
                                        placeholder="Enter quantity (e.g., 50)"
                                        className="border border-[#E5E7EB] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#6C63FF]"
                                        disabled={addOnsLoading}
                                    />
                                </div>

                                <div className="flex flex-col">
                                    <label className="text-sm font-medium text-[#4B5563] mb-1">Price ($) *</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={addOnForm.price}
                                        onChange={(e) => {
                                            const validated = validateNumberInput(e.target.value, true);
                                            setAddOnForm(prev => ({ ...prev, price: validated }));
                                        }}
                                        onKeyDown={(e) => {
                                            if (e.key === '-' || e.key === 'e' || e.key === 'E' || e.key === '+') {
                                                e.preventDefault();
                                            }
                                        }}
                                        placeholder="Enter price"
                                        className="border border-[#E5E7EB] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#6C63FF]"
                                        disabled={addOnsLoading}
                                    />
                                </div>

                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id="popular"
                                        checked={addOnForm.popular}
                                        onChange={(e) => setAddOnForm(prev => ({ ...prev, popular: e.target.checked }))}
                                        className="w-4 h-4 text-[#6C63FF] border-gray-300 rounded focus:ring-[#6C63FF]"
                                        disabled={addOnsLoading}
                                    />
                                    <label htmlFor="popular" className="ml-2 text-sm font-medium text-[#4B5563]">
                                        Mark as Popular
                                    </label>
                                </div>

                                <div className="flex gap-2 pt-4">
                                    <button
                                        onClick={closeAddOnModal}
                                        disabled={addOnsLoading}
                                        className="flex-1 py-2 rounded-lg bg-gray-300 text-black font-medium shadow transition-all duration-200 hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleAddOnSubmit}
                                        disabled={addOnsLoading}
                                        className="flex-1 py-2 rounded-lg bg-gradient-to-b from-[#6C63FF] to-[#3F73BD] text-white font-medium shadow transition-all duration-200 hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {addOnsLoading ? 'Saving...' : (addOnModalMode === 'create' ? 'Create' : 'Update')}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    };

    const renderPlanCards = () => (
        <div className="h-full">

            <div className="flex flex-col lg:flex-row w-full gap-6 justify-center items-start mt-10">
                {getPlanSection("Basic")}
                {getPlanSection("Pro")}
                {getPlanSection("Enterprise")}
            </div>

            {
                isContact && (
                    <ShowCustomDetails />
                )
            }

        </div>
    );

    const renderPlanManagement = () => (
        <div className="h-full">
            <nav className="flex space-x-8">
                <button
                    onClick={() => { setPlanManagementInnerTab('plan') }}
                    className={`py-2 px-3 border-b-2 font-medium text-[16px] transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] ${planManagementInnerTab === 'plan'
                        ? 'border-[#6C63FF] text-[#FFFFFF] rounded-t-lg bg-[#2563EB]'
                        : 'border-transparent text-[#4B5563]'
                        }`}
                    title="View Plan Management"
                >
                    {/* /Plan Management - use icon till small screen and text on large screen */}
                    <div className="flex items-center gap-2">
                        <MdOutlinePriceChange className="w-5 h-5" />
                        <span className="hidden sm:block">Plan Management</span>
                    </div>
                </button>
                <button
                    onClick={() => { setPlanManagementInnerTab('subscription') }}
                    className={`py-2 px-3 border-b-2 font-medium text-[16px] transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] ${planManagementInnerTab === 'subscription'
                        ? 'border-[#6C63FF] text-[#FFFFFF] rounded-t-lg bg-[#2563EB]'
                        : 'border-transparent text-[#4B5563]'
                        }`}
                    title="View Subscription Management"
                >
                    {/* /Subscription Management - use icon till small screen and text on large screen */}
                    <div className="flex items-center gap-2">
                        <MdOutlineSubscriptions className="w-5 h-5" />
                        <span className="hidden sm:block">Subscription Management</span>
                    </div>
                </button>
                <button
                    onClick={() => { setPlanManagementInnerTab('addons') }}
                    className={`py-2 px-3 border-b-2 font-medium text-[16px] transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] ${planManagementInnerTab === 'addons'
                        ? 'border-[#6C63FF] text-[#FFFFFF] rounded-t-lg bg-[#2563EB]'
                        : 'border-transparent text-[#4B5563]'
                        }`}
                    title="View Add-On Management"
                >
                    {/* /Add-On Management - use icon till small screen and text on large screen */}
                    <div className="flex items-center gap-2">
                        <MdOutlineAddShoppingCart className="w-5 h-5" />
                        <span className="hidden sm:block">Add-On Management</span>
                    </div>
                </button>
            </nav>

            {planManagementInnerTab === 'plan' ? renderPlanCards() : planManagementInnerTab === 'subscription' ? renderSubscriptionManagement() : renderAddOnsManagement()}
        </div>
    );

    const [contactRequestSearchTerm, setContactRequestSearchTerm] = useState('');
    const [contactRequestData, setContactRequestData] = useState([]);
    const [filteredContactRequest, setFilteredContactRequest] = useState([]);
    const [currentPageContact, setCurrentPageContact] = useState(1);
    const [contactDetailsModalOpen, setContactDetailsModalOpen] = useState(false);
    const [selectedContactRequest, setSelectedContactRequest] = useState(null);

    const contactRequestDatafetch = async () => {
        try {
            const response = await axios.get(`${baseUrl}/admin/getContactData`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            setContactRequestData(response.data || []);
            setFilteredContactRequest(response.data || []);
        } catch (e) {
            // ignore
        }
    };

    useEffect(() => {
        contactRequestDatafetch();
    }, []);

    // Email Content Management functions
    const fetchEmailContent = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${baseUrl}/admin/getEmailContentFromDB`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            const emailContent = response.data.emailContent || [];
            setEmailContentData(emailContent);
            setFilteredEmailContent(emailContent);
        } catch (error) {
            console.error('Error fetching email content:', error);
            toast.error('Failed to fetch email content');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (activeTab === 'email-content') {
            fetchEmailContent();
        }
    }, [activeTab]);



    const startEditEmailContent = (emailContent) => {
        setSelectedEmailForEdit(emailContent);
        setEmailEditForm({
            emailType: emailContent.emailType || '',
            emailSubject: emailContent.emailSubject || '',
            emailBody: emailContent.emailBody || ''
        });
        setEmailEditModalOpen(true);
    };

    const cancelEditEmailContent = () => {
        setEmailEditModalOpen(false);
        setSelectedEmailForEdit(null);
        setEmailEditForm({
            emailType: '',
            emailSubject: '',
            emailBody: ''
        });
    };

    const handleEmailEditFormChange = (field, value) => {
        setEmailEditForm(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSaveEmailContent = async () => {
        if (!selectedEmailForEdit) return;

        setLoading(true);
        try {
            await axios.put(`${baseUrl}/admin/updateEmailContentinDB/${selectedEmailForEdit._id}`, {
                emailSubject: emailEditForm.emailSubject,
                emailBody: emailEditForm.emailBody,
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            toast.success('Email content updated successfully');
            cancelEditEmailContent();
            fetchEmailContent(); // Refresh the data
        } catch (error) {
            console.error('Error updating email content:', error);
            toast.error(error.response?.data?.message || 'Failed to update email content');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const term = (emailContentSearchTerm || '').toLowerCase();
        const base = emailContentData || [];
        const filtered = term
            ? base.filter(email =>
                (email.emailSubject || '').toLowerCase().includes(term) ||
                (email.emailType || '').toLowerCase().includes(term) ||
                (email.emailBody || '').toLowerCase().includes(term)
            )
            : base;
        setFilteredEmailContent(filtered);
    }, [emailContentSearchTerm, emailContentData]);

    useEffect(() => {
        const term = (contactRequestSearchTerm || '').toLowerCase();
        const base = contactRequestData || [];
        const filtered = term
            ? base.filter(r =>
                (r.name || '').toLowerCase().includes(term) ||
                (r.company || '').toLowerCase().includes(term) ||
                (r.email || '').toLowerCase().includes(term) ||
                (r.status || '').toLowerCase().includes(term)
            )
            : base;
        setFilteredContactRequest(filtered);
    }, [contactRequestSearchTerm, contactRequestData]);

    const renderContactRequest = () => (
        <div className='h-full'>
            {/* Search Bar */}
            <div className="mb-6 py-4">
                <div className="flex flex-col gap-3 xs:gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4 lg:flex-1">
                        <div className="relative">
                            <MdOutlineSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#9CA3AF] w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search By Name, Company, Email, Or Status"
                                value={contactRequestSearchTerm}
                                onChange={(e) => {
                                    setContactRequestSearchTerm(e.target.value);
                                    setCurrentPageContact(1);
                                    closeAllInvoiceRows();
                                }}
                                className="pl-10 pr-4 py-2 border border-[#E5E7EB] rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:border-transparent w-full sm:w-[530px] md:max-w-[480px] lg:min-w-[530px] lg:max-w-[530px] text-[#374151] placeholder-[#9CA3AF] bg-white disabled:opacity-50 disabled:cursor-not-allowed"
                                title="Search contact requests by name, company, email, or status"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Contact Requests Table */}
            <div className="bg-white border border-[#E5E7EB] mb-6 overflow-x-auto rounded-2xl">
                <table className="w-full rounded-2xl">
                    <thead className="bg-[#F8FAFC] border-b border-[#0000001A]">
                        <tr>
                            <th className="p-4 text-left text-[16px] font-medium text-[#4B5563]">Name</th>
                            <th className="p-4 text-left text-[16px] font-medium text-[#4B5563]">Company</th>
                            <th className="p-4 text-left text-[16px] font-medium text-[#4B5563]">Email</th>
                            <th className="p-4 text-left text-[16px] font-medium text-[#4B5563]">Description</th>
                            <th className="p-4 text-left text-[16px] font-medium text-[#4B5563]">Status</th>
                            <th className="p-4 text-left text-[16px] font-medium text-[#4B5563]">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {(() => {
                            const statusWeight = (s) => {
                                const t = (s || '').toLowerCase();
                                if (t === 'open') return 0;
                                if (t === 'connected') return 2;
                                return 1;
                            };
                            const sorted = [...(filteredContactRequest || [])].sort((a, b) => statusWeight(a?.status) - statusWeight(b?.status));
                            const paginated = paginateData(sorted, currentPageContact, rowsPerPage);
                            return paginated.length > 0 ? paginated.map((row, idx) => (
                                <tr key={idx} className="hover:bg-[#F8FAFC] transition-colors">
                                    <td className="p-4 text-[16px] text-[#4B5563]">{row.name || '—'}</td>
                                    <td className="p-4 text-[16px] text-[#4B5563]">{row.company || '—'}</td>
                                    <td className="p-4 text-[16px] text-[#6C63FF]">{row.email || '—'}</td>
                                    <td className="p-4 text-[16px] text-[#4B5563]"><div className="max-w-[240px] line-clamp-2 truncate">{row.description || '—'}</div></td>
                                    <td className="p-4 whitespace-nowrap">
                                        <span className={`inline-flex px-2 py-1 text-[12px] font-semibold rounded-full ${getStatusColor((row.status || 'Pending'))}`}>
                                            {row.status || 'Pending'}
                                        </span>
                                    </td>
                                    <td className="p-4 text-[16px] text-[#4B5563] whitespace-nowrap">
                                        <button
                                            className="text-[#2563EB] px-4 py-2 rounded-md"
                                            onClick={() => {
                                                const selected = (contactRequestData || []).find(r => r._id === row._id);
                                                setSelectedContactRequest(selected || row);
                                                setContactDetailsModalOpen(true);
                                            }}
                                        >
                                            <MdOutlineVisibility className="w-5 h-5" />
                                        </button>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={5} className="p-4 text-center text-gray-500">No contact requests found</td>
                                </tr>
                            );
                        })()}
                    </tbody>
                </table>
                {filteredContactRequest.length > 0 && (
                    <PaginationComponent
                        currentPage={currentPageContact}
                        totalPages={getTotalPages(filteredContactRequest, rowsPerPage)}
                        onPageChange={(page) => { setCurrentPageContact(page); closeAllInvoiceRows(); }}
                        totalItems={filteredContactRequest.length}
                        rowsPerPage={rowsPerPage}
                        onRowsPerPageChange={(newRowsPerPage) => { setRowsPerPage(newRowsPerPage); setCurrentPageContact(1); closeAllInvoiceRows(); }}
                    />
                )}
            </div>

            {contactDetailsModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30" onClick={(e) => { if (e.target === e.currentTarget) setContactDetailsModalOpen(false); }}>
                    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-lg font-semibold text-gray-900">Contact Request</h3>
                            <button onClick={() => setContactDetailsModalOpen(false)} className="text-gray-500 hover:text-gray-700">
                                <MdOutlineClose className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="text-sm text-gray-700 space-y-1 mb-4">
                            <p><strong>Name:</strong> {selectedContactRequest?.name || '—'}</p>
                            <p><strong>Company:</strong> {selectedContactRequest?.company || '—'}</p>
                            <p><strong>Email:</strong> {selectedContactRequest?.email || '—'}</p>
                            <p><strong>Status:</strong> {selectedContactRequest?.status || 'Pending'}</p>
                        </div>
                        <div className="flex gap-3">
                            <button
                                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                                onClick={async () => {
                                    try {
                                        const id = selectedContactRequest?._id;
                                        await axios.delete(`${baseUrl}/admin/deleteContactData/${id}`, {
                                            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                                        });
                                        setContactDetailsModalOpen(false);
                                        toast.success('Contact request deleted');
                                        setTimeout(() => {
                                            window.location.reload();
                                        }, 2000);
                                    } catch (e) {
                                        toast.error('Failed to delete');
                                    }
                                }}
                            >
                                Delete
                            </button>
                            {selectedContactRequest?.status !== 'Connected' && (
                                <button
                                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98]"
                                    onClick={async () => {
                                        try {
                                            const id = selectedContactRequest?._id;
                                            await axios.put(`${baseUrl}/admin/updateContactData/${id}`, { status: 'Connected' }, {
                                                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                                            });
                                            setContactDetailsModalOpen(false);
                                            toast.success('Marked as Connected');
                                            setTimeout(() => {
                                                window.location.reload();
                                            }, 2000);
                                        } catch (e) {
                                            toast.error('Failed to update');
                                        }
                                    }}
                                    title="Mark this contact request as Connected"
                                >
                                    Mark as Connected
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );


    const renderEmailContent = () => (
        <div className="h-full">
            {/* Email Content Inner Tabs */}
            <div className="mb-6">
                <nav className="flex space-x-8">
                    <button
                        onClick={() => { setEmailContentInnerTab('templates') }}
                        className={`py-2 px-2 border-b-2 font-medium text-[16px] transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] ${emailContentInnerTab === 'templates'
                            ? 'border-[#6C63FF] text-[#FFFFFF] rounded-t-lg bg-[#2563EB]'
                            : 'border-transparent text-[#4B5563]'
                            }`}
                        title="View and edit email templates"
                    >
                        Email Templates
                    </button>
                    <button
                        onClick={() => { setEmailContentInnerTab('custom') }}
                        className={`py-2 px-2 border-b-2 font-medium text-[16px] transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] ${emailContentInnerTab === 'custom'
                            ? 'border-[#6C63FF] text-[#FFFFFF] rounded-t-lg bg-[#2563EB]'
                            : 'border-transparent text-[#4B5563]'
                            }`}
                        title="Create and send custom emails"
                    >
                        Custom Email
                    </button>
                </nav>
            </div>

            {emailContentInnerTab === 'templates' ? renderEmailTemplates() : renderCustomEmail()}
        </div>
    );

    const renderEmailTemplates = () => (
        <div className="h-full">
            {/* Search Bar */}
            <div className="mb-6 py-4">
                <div className="flex flex-col gap-3 xs:gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4 lg:flex-1">
                        <div className="relative">
                            <MdOutlineSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#9CA3AF] w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search by email subject, type, or body content..."
                                value={emailContentSearchTerm}
                                onChange={(e) => {
                                    setEmailContentSearchTerm(e.target.value);
                                    closeAllInvoiceRows();
                                }}
                                className="pl-10 pr-4 py-2 border border-[#E5E7EB] rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:border-transparent w-full sm:w-[530px] md:max-w-[480px] lg:min-w-[530px] lg:max-w-[530px] text-[#374151] placeholder-[#9CA3AF] bg-white disabled:opacity-50 disabled:cursor-not-allowed"
                                title="Search through all email content by typing keywords from subject, email type, or body. Press Enter or click search to filter results."
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Email Content Table */}
            <div className="bg-white border border-[#E5E7EB] mb-6 overflow-x-auto rounded-2xl">
                <table className="w-full rounded-2xl">
                    <thead className="bg-[#F8FAFC] border-b border-[#0000001A]">
                        <tr>
                            <th className="p-4 text-left text-[16px] font-medium text-[#4B5563]" title="The type or category of the email template (e.g., Welcome Email, Password Reset)">Email Type</th>
                            <th className="p-4 text-left text-[16px] font-medium text-[#4B5563]" title="The subject line that will appear in the email">Subject</th>
                            <th className="p-4 text-left text-[16px] font-medium text-[#4B5563]" title="Preview of the HTML body content of the email">Body</th>
                            <th className="p-4 text-left text-[16px] font-medium text-[#4B5563]" title="Actions you can perform on the email content">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredEmailContent.length > 0 ? filteredEmailContent.map((email) => (
                            <tr key={email._id} className="border-b border-[#E5E7EB] hover:bg-[#F8FAFC]">
                                <td className="p-4 text-[16px] text-[#4B5563]">
                                    <span className="inline-flex px-2 py-1 text-[12px] font-semibold rounded-full bg-[#DBEAFE] text-[#1E40AF]">
                                        {email.emailType}
                                    </span>
                                </td>
                                <td className="p-4 text-[16px] text-[#4B5563]">
                                    <span className="line-clamp-2">{email.emailSubject}</span>
                                </td>
                                <td className="p-4 text-[16px] text-[#4B5563]">
                                    <div
                                        className="line-clamp-3 prose prose-sm max-w-none"
                                        dangerouslySetInnerHTML={{ __html: email.emailBody?.substring(0, 200) + (email.emailBody?.length > 200 ? '...' : '') }}
                                    />
                                </td>
                                <td className="p-4 text-[16px] text-[#4B5563] whitespace-nowrap">
                                    <button
                                        onClick={() => startEditEmailContent(email)}
                                        className="px-4 py-2 bg-[#6C63FF] text-white rounded-lg hover:bg-[#5A52E5] transition-colors"
                                        title="Click to open the email editor and modify the subject and body content. Email type cannot be changed."
                                    >
                                        Edit
                                    </button>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan={4} className="p-4 text-center text-gray-500">No email content found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Email Edit Modal */}
            {emailEditModalOpen && selectedEmailForEdit && (
                <>
                    <style dangerouslySetInnerHTML={{
                        __html: `
                        .email-preview-content img {
                            max-width: 100% !important;
                            height: auto !important;
                        }
                        .email-preview-content table {
                            max-width: 100% !important;
                            table-layout: auto !important;
                            display: block !important;
                            overflow-x: auto !important;
                        }
                        .email-preview-content pre {
                            max-width: 100% !important;
                            overflow-x: auto !important;
                            white-space: pre-wrap !important;
                            word-wrap: break-word !important;
                        }
                        .email-preview-content * {
                            max-width: 100% !important;
                            box-sizing: border-box !important;
                        }
                        .email-preview-content {
                            overflow-wrap: break-word !important;
                            word-break: break-word !important;
                        }
                    `}} />
                    <div
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
                        onClick={(e) => {
                            if (e.target === e.currentTarget) {
                                cancelEditEmailContent();
                            }
                        }}
                    >
                        <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
                            {/* Modal Header */}
                            <div className="flex items-center justify-between p-6 border-b border-[#E5E7EB] bg-[#F8FAFC]">
                                <div>
                                    <h3 className="text-xl font-semibold text-gray-900">Edit Email Content</h3>
                                    <p className="text-sm text-gray-500 mt-1" title="Modify the email subject and HTML body. Email type is read-only. See live preview on the right as you edit.">
                                        Edit email subject and body with live preview. Email type is read-only.
                                    </p>
                                </div>
                                <button
                                    onClick={cancelEditEmailContent}
                                    className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-lg"
                                    title="Close the email editor without saving changes. All unsaved edits will be discarded."
                                >
                                    <MdOutlineClose className="w-6 h-6" />
                                </button>
                            </div>

                            {/* Modal Body - Split View */}
                            <div className="flex-1 overflow-hidden flex flex-col lg:flex-row">
                                {/* Left Side - Editor */}
                                <div className="flex-1 overflow-y-auto p-6 border-r border-[#E5E7EB] bg-white">
                                    <div className="space-y-4">
                                        {/* Email Type */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Email Type
                                                <span className="ml-2 text-xs text-gray-500 font-normal" title="This field is read-only and cannot be modified. It identifies the type of email template.">
                                                    (Read-only)
                                                </span>
                                            </label>
                                            <input
                                                type="text"
                                                value={emailEditForm.emailType}
                                                readOnly
                                                disabled
                                                className="w-full px-4 py-2 border border-[#E5E7EB] rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
                                                placeholder="e.g., Welcome Email, Password Reset, etc."
                                                title="Email type is read-only and cannot be edited. This identifies the category or purpose of this email template."
                                            />
                                        </div>

                                        {/* Email Subject */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Email Subject <span className="text-red-500">*</span>
                                                <span className="ml-2 text-xs text-gray-500 font-normal" title="The subject line that recipients will see in their email inbox">(Required)</span>
                                            </label>
                                            <input
                                                type="text"
                                                value={emailEditForm.emailSubject}
                                                onChange={(e) => handleEmailEditFormChange('emailSubject', e.target.value)}
                                                className="w-full px-4 py-2 border border-[#E5E7EB] rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:border-transparent"
                                                placeholder="e.g., Welcome to Our Platform!, Password Reset Request, Account Verification..."
                                                title="Enter the email subject line that will appear in the recipient's inbox. This is required and should be clear and descriptive."
                                            />
                                        </div>

                                        {/* Email Body HTML Editor */}
                                        <div className="w-full mb-4">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Email Body (HTML) <span className="text-red-500">*</span>
                                                <span className="ml-2 text-xs text-gray-500 font-normal" title="The main content of the email in HTML format">(Required)</span>
                                            </label>
                                            <textarea
                                                value={emailEditForm.emailBody}
                                                onChange={(e) => handleEmailEditFormChange('emailBody', e.target.value)}
                                                className="w-full px-4 py-3 border border-[#E5E7EB] rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:border-transparent font-mono text-sm"
                                                rows={15}
                                                placeholder="Enter HTML content here...&#10;&#10;Example:&#10;&lt;p&gt;Hello &lt;strong&gt;{{name}}&lt;/strong&gt;,&lt;/p&gt;&#10;&lt;p&gt;Welcome to our platform!&lt;/p&gt;&#10;&lt;a href=&quot;{{link}}&quot;&gt;Click here&lt;/a&gt;"
                                                title="Enter the email body content using HTML. You can use tags like &lt;p&gt;, &lt;strong&gt;, &lt;a&gt;, &lt;div&gt;, &lt;img&gt;, etc. The live preview on the right will show how it will appear. This field is required."
                                            />
                                            <div className="mt-2 space-y-1">
                                                <p className="text-xs text-gray-500">
                                                    💡 <strong>Tip:</strong> You can use HTML tags like &lt;p&gt;, &lt;strong&gt;, &lt;a&gt;, &lt;img&gt;, &lt;div&gt;, etc.
                                                </p>
                                                <p className="text-xs text-gray-500" title="Common HTML tags you can use: &lt;p&gt; for paragraphs, &lt;strong&gt; or &lt;b&gt; for bold, &lt;em&gt; or &lt;i&gt; for italic, &lt;a href='url'&gt; for links, &lt;br&gt; for line breaks, &lt;h1&gt;-&lt;h6&gt; for headings">
                                                    📝 <strong>Supported tags:</strong> p, div, span, strong, em, a, img, ul, ol, li, h1-h6, br, hr
                                                </p>
                                                <p className="text-xs text-gray-500" title="The preview panel on the right updates automatically as you type, so you can see exactly how the email will appear to recipients">
                                                    👁️ <strong>Live Preview:</strong> See how your email will look in real-time on the right panel
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Side - Live Preview */}
                                <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
                                    <div className="sticky top-0 bg-gray-50 pb-4 mb-4 border-b border-[#E5E7EB]">
                                        <h4 className="text-lg font-semibold text-gray-900">Live Preview</h4>
                                        <p className="text-sm text-gray-500 mt-1" title="This preview updates automatically as you type. It shows exactly how the email will appear to recipients when sent.">
                                            This is how the email will appear to recipients. Updates in real-time as you edit.
                                        </p>
                                    </div>
                                    <div className="bg-white rounded-lg shadow-sm border border-[#E5E7EB] p-6">
                                        {/* Preview Email Header */}
                                        <div className="mb-4 pb-4 border-b border-[#E5E7EB]">
                                            <div className="text-xs text-gray-500 mb-1" title="The email type category (read-only)">Email Type:</div>
                                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-[#DBEAFE] text-[#1E40AF]" title={`Email type: ${emailEditForm.emailType || 'Not set'}`}>
                                                {emailEditForm.emailType || 'Not set'}
                                            </span>
                                        </div>

                                        {/* Preview Subject */}
                                        <div className="mb-4 pb-4 border-b border-[#E5E7EB]">
                                            <div className="text-xs text-gray-500 mb-2" title="The subject line as it will appear in the email inbox">Subject:</div>
                                            <h3 className="text-lg font-semibold text-gray-900" title={`Email subject: ${emailEditForm.emailSubject || 'No subject entered'}`}>
                                                {emailEditForm.emailSubject || 'No subject'}
                                            </h3>
                                        </div>

                                        {/* Preview Body - Rendered HTML */}
                                        <div className="mt-4">
                                            <div className="text-xs text-gray-500 mb-2" title="The rendered HTML content as it will appear in the email">Body:</div>
                                            <div
                                                className="overflow-x-auto overflow-y-auto max-h-[400px] border border-[#E5E7EB] rounded-lg p-4 bg-white"
                                                title="Email body preview - scroll if content is long. This shows exactly how the HTML will be rendered in the email."
                                            >
                                                <div
                                                    className="prose prose-sm max-w-none text-gray-700 min-h-[200px] break-words email-preview-content"
                                                    style={{
                                                        wordBreak: 'break-word',
                                                        overflowWrap: 'break-word',
                                                        maxWidth: '100%'
                                                    }}
                                                    dangerouslySetInnerHTML={{
                                                        __html: emailEditForm.emailBody || '<p class="text-gray-400 italic">Start typing HTML in the editor to see a live preview here...</p>'
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Modal Footer */}
                            <div className="flex items-center justify-end gap-3 p-6 border-t border-[#E5E7EB] bg-[#F8FAFC]">
                                <button
                                    onClick={cancelEditEmailContent}
                                    disabled={loading}
                                    className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    title="Cancel editing and discard all changes. The email content will revert to its previous state."
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSaveEmailContent}
                                    disabled={loading || !emailEditForm.emailType || !emailEditForm.emailSubject || !emailEditForm.emailBody}
                                    className="px-6 py-2 bg-[#2563EB] text-white rounded-lg hover:bg-[#1D4ED8] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    title={!emailEditForm.emailType || !emailEditForm.emailSubject || !emailEditForm.emailBody
                                        ? "Please fill in all required fields (Subject and Body) before saving"
                                        : "Save all changes to the email content. This will update the email template in the database."}
                                >
                                    {loading ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );

    const handleCustomEmailChange = (field, value) => {
        setCustomEmailForm(prev => ({
            ...prev,
            [field]: value
        }));
    };

    // Tiptap Editor for Custom Email Body
    const emailEditor = useEditor({
        extensions: [
            StarterKit,
            Underline,
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: 'text-blue-600 underline cursor-pointer',
                },
            }),
            TextAlign.configure({
                types: ['heading', 'paragraph'],
            }),
            TextStyle,
            Color,
            Highlight.configure({
                multicolor: true,
            }),
            CodeBlock,
            Blockquote,
            Image.configure({
                inline: true,
                allowBase64: true,
                HTMLAttributes: {
                    class: 'max-w-full h-auto rounded-lg',
                },
            }),
            Placeholder.configure({
                placeholder: 'Enter email body content. You can use the toolbar above to format your text...',
            }),
        ],
        content: customEmailForm.body,
        onUpdate: ({ editor }) => {
            handleCustomEmailChange('body', editor.getHTML());
        },
        editorProps: {
            attributes: {
                class: 'tiptap-editor focus:outline-none min-h-[300px] px-4 py-3',
            },
        },
    });

    // Update editor content when form is reset
    useEffect(() => {
        if (emailEditor && customEmailForm.body === '') {
            emailEditor.commands.setContent('');
        }
    }, [customEmailForm.body, emailEditor]);

    const handleSendCustomEmail = async () => {
        if (!customEmailForm.subject) {
            toast.error('Please fill in Subject field');
            return;
        }

        // Get HTML directly from editor to ensure we have the latest content
        const bodyHTML = emailEditor ? emailEditor.getHTML() : customEmailForm.body;

        if (!bodyHTML || bodyHTML.trim() === '' || bodyHTML === '<p></p>') {
            toast.error('Please fill in Body field');
            return;
        }

        if (customEmailForm.sendTo === 'Custom Members' && !customEmailForm.customEmails.trim()) {
            toast.error('Please enter email addresses for Custom Members');
            return;
        }

        setEmailSendingLoading(true);
        try {
            const payload = {
                subject: customEmailForm.subject,
                body: bodyHTML, // Send HTML format
                sendTo: customEmailForm.sendTo,
                ...(customEmailForm.sendTo === 'Custom Members' && {
                    customEmails: customEmailForm.customEmails.split(',').map(email => email.trim()).filter(email => email)
                })
            };

            const response = await axios.post(`${baseUrl}/admin/sendCustomEmail`, payload, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });

            if (response.status === 200) {
                toast.success(response?.data?.message || 'Custom email sent successfully');
                setCustomEmailForm({
                    subject: '',
                    body: '',
                    sendTo: 'All',
                    customEmails: ''
                });
                emailEditor.commands.setContent('');
                setSendToDropdownOpen(false);
            } else {
                toast.error(response?.data?.message || 'Failed to send custom email');
            }
        } catch (error) {
            console.error('Error sending custom email:', error);
            toast.error(error.response?.data?.message || 'Failed to send custom email');
        } finally {
            setEmailSendingLoading(false);
        }
    };

    const renderCustomEmail = () => (
        <div className="h-full">
            <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-md relative">
                {/* Send Button */}
                <div className="flex justify-end pb-4 border-b border-[#E5E7EB]">
                    <button
                        onClick={handleSendCustomEmail}
                        disabled={loading || !customEmailForm.subject || !customEmailForm.body || (customEmailForm.sendTo === 'Custom Members' && !customEmailForm.customEmails.trim())}
                        className="px-6 py-2 bg-[#6C63FF] text-white rounded-lg hover:bg-[#5A52E5] disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                    >
                        {loading ? 'Sending...' : 'Send Email'}
                    </button>
                </div>

                {/* Send To Dropdown */}
                <div className="relative mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Send To <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                        <button
                            type="button"
                            onClick={() => setSendToDropdownOpen(!sendToDropdownOpen)}
                            className="w-full px-4 py-3 bg-white border border-[#E5E7EB] rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:border-transparent text-left flex items-center justify-between hover:border-[#6C63FF] transition-colors shadow-sm"
                        >
                            <span className="text-gray-900 font-medium">{customEmailForm.sendTo}</span>
                            <MdOutlineKeyboardArrowDown
                                className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${sendToDropdownOpen ? 'transform rotate-180' : ''}`}
                            />
                        </button>

                        {sendToDropdownOpen && (
                            <>
                                <div
                                    className="fixed inset-0 z-10"
                                    onClick={() => setSendToDropdownOpen(false)}
                                />
                                <div className="absolute z-20 w-full mt-2 bg-white border border-[#E5E7EB] rounded-lg shadow-xl overflow-hidden">
                                    {[
                                        { value: 'All', label: 'All', icon: '👥', description: 'Send to all users' },
                                        { value: 'Active Users', label: 'Active Users', icon: '✅', description: 'Send to active users only' },
                                        { value: 'Inactive Users', label: 'Inactive Users', icon: '⏸️', description: 'Send to inactive users only' },
                                        { value: 'Custom Members', label: 'Custom Members', icon: '📧', description: 'Send to specific email addresses' }
                                    ].map((option) => (
                                        <button
                                            key={option.value}
                                            type="button"
                                            onClick={() => {
                                                handleCustomEmailChange('sendTo', option.value);
                                                setSendToDropdownOpen(false);
                                            }}
                                            className={`w-full px-4 py-3 text-left hover:bg-[#F3F4F6] transition-colors flex items-start gap-3 ${customEmailForm.sendTo === option.value
                                                ? 'bg-[#EEF2FF] border-l-4 border-[#6C63FF]'
                                                : ''
                                                }`}
                                        >
                                            <span className="text-lg mt-0.5">{option.icon}</span>
                                            <div className="flex-1">
                                                <div className={`font-normal ${customEmailForm.sendTo === option.value ? 'text-[#6C63FF]' : 'text-gray-900'}`}>
                                                    {option.label}
                                                </div>
                                                <div className="text-xs text-gray-500 mt-0.5">
                                                    {option.description}
                                                </div>
                                            </div>
                                            {customEmailForm.sendTo === option.value && (
                                                <span className="text-[#6C63FF] mt-1">
                                                    <FaRegCheckCircle className="w-5 h-5" />
                                                </span>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* Custom Members Email Input */}
                {customEmailForm.sendTo === 'Custom Members' && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email Addresses <span className="text-red-500">*</span>
                            <span className="ml-2 text-xs text-gray-500 font-normal">(Separate multiple emails with commas)</span>
                        </label>
                        <input
                            type="text"
                            value={customEmailForm.customEmails}
                            onChange={(e) => handleCustomEmailChange('customEmails', e.target.value)}
                            className="w-full px-4 py-2 border border-[#E5E7EB] rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:border-transparent"
                            placeholder="email1@example.com, email2@example.com, email3@example.com"
                        />
                        <p className="mt-2 text-xs text-gray-500">
                            Enter email addresses separated by commas (e.g., user1@example.com, user2@example.com)
                        </p>
                    </div>
                )}

                <div className="mt-4 space-y-6">
                    {/* Subject Field */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Subject <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={customEmailForm.subject}
                            onChange={(e) => handleCustomEmailChange('subject', e.target.value)}
                            className="w-full px-4 py-2 border border-[#E5E7EB] rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:border-transparent"
                            placeholder="Enter email subject"
                        />
                    </div>

                    {/* Body Field - Tiptap Editor */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Body <span className="text-red-500">*</span>
                        </label>
                        <div className="border border-[#E5E7EB] rounded-lg overflow-hidden bg-white">
                            {/* Toolbar */}
                            {emailEditor && (
                                <div className="flex items-center gap-1 p-2 border-b border-[#E5E7EB] bg-gray-50 flex-wrap">
                                    {/* Text Formatting */}
                                    <button
                                        type="button"
                                        onClick={() => emailEditor.chain().focus().toggleBold().run()}
                                        disabled={!emailEditor.can().chain().focus().toggleBold().run()}
                                        className={`p-2 rounded hover:bg-gray-200 transition-colors ${emailEditor.isActive('bold') ? 'bg-gray-300' : ''}`}
                                        title="Bold"
                                    >
                                        <strong>B</strong>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => emailEditor.chain().focus().toggleItalic().run()}
                                        disabled={!emailEditor.can().chain().focus().toggleItalic().run()}
                                        className={`p-2 rounded hover:bg-gray-200 transition-colors ${emailEditor.isActive('italic') ? 'bg-gray-300' : ''}`}
                                        title="Italic"
                                    >
                                        <em>I</em>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => emailEditor.chain().focus().toggleUnderline().run()}
                                        disabled={!emailEditor.can().chain().focus().toggleUnderline().run()}
                                        className={`p-2 rounded hover:bg-gray-200 transition-colors ${emailEditor.isActive('underline') ? 'bg-gray-300' : ''}`}
                                        title="Underline"
                                    >
                                        <u>U</u>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => emailEditor.chain().focus().toggleStrike().run()}
                                        disabled={!emailEditor.can().chain().focus().toggleStrike().run()}
                                        className={`p-2 rounded hover:bg-gray-200 transition-colors ${emailEditor.isActive('strike') ? 'bg-gray-300' : ''}`}
                                        title="Strikethrough"
                                    >
                                        <span style={{ textDecoration: 'line-through' }}>S</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => emailEditor.chain().focus().toggleCode().run()}
                                        disabled={!emailEditor.can().chain().focus().toggleCode().run()}
                                        className={`p-2 rounded hover:bg-gray-200 transition-colors ${emailEditor.isActive('code') ? 'bg-gray-300' : ''}`}
                                        title="Inline Code"
                                    >
                                        {'</>'}
                                    </button>
                                    <div className="w-px h-6 bg-gray-300 mx-1" />

                                    {/* Headings */}
                                    <button
                                        type="button"
                                        onClick={() => emailEditor.chain().focus().toggleHeading({ level: 1 }).run()}
                                        className={`p-2 rounded hover:bg-gray-200 transition-colors ${emailEditor.isActive('heading', { level: 1 }) ? 'bg-gray-300' : ''}`}
                                        title="Heading 1"
                                    >
                                        H1
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => emailEditor.chain().focus().toggleHeading({ level: 2 }).run()}
                                        className={`p-2 rounded hover:bg-gray-200 transition-colors ${emailEditor.isActive('heading', { level: 2 }) ? 'bg-gray-300' : ''}`}
                                        title="Heading 2"
                                    >
                                        H2
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => emailEditor.chain().focus().toggleHeading({ level: 3 }).run()}
                                        className={`p-2 rounded hover:bg-gray-200 transition-colors ${emailEditor.isActive('heading', { level: 3 }) ? 'bg-gray-300' : ''}`}
                                        title="Heading 3"
                                    >
                                        H3
                                    </button>
                                    <div className="w-px h-6 bg-gray-300 mx-1" />

                                    {/* Lists */}
                                    <button
                                        type="button"
                                        onClick={() => emailEditor.chain().focus().toggleBulletList().run()}
                                        className={`p-2 rounded hover:bg-gray-200 transition-colors ${emailEditor.isActive('bulletList') ? 'bg-gray-300' : ''}`}
                                        title="Bullet List"
                                    >
                                        •
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => emailEditor.chain().focus().toggleOrderedList().run()}
                                        className={`p-2 rounded hover:bg-gray-200 transition-colors ${emailEditor.isActive('orderedList') ? 'bg-gray-300' : ''}`}
                                        title="Numbered List"
                                    >
                                        1.
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => emailEditor.chain().focus().toggleBlockquote().run()}
                                        className={`p-2 rounded hover:bg-gray-200 transition-colors ${emailEditor.isActive('blockquote') ? 'bg-gray-300' : ''}`}
                                        title="Blockquote"
                                    >
                                        "
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => emailEditor.chain().focus().toggleCodeBlock().run()}
                                        className={`p-2 rounded hover:bg-gray-200 transition-colors ${emailEditor.isActive('codeBlock') ? 'bg-gray-300' : ''}`}
                                        title="Code Block"
                                    >
                                        {'{}'}
                                    </button>
                                    <div className="w-px h-6 bg-gray-300 mx-1" />

                                    {/* Text Alignment */}
                                    <button
                                        type="button"
                                        onClick={() => emailEditor.chain().focus().setTextAlign('left').run()}
                                        className={`p-2 rounded hover:bg-gray-200 transition-colors ${emailEditor.isActive({ textAlign: 'left' }) ? 'bg-gray-300' : ''}`}
                                        title="Align Left"
                                    >
                                        ⬅
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => emailEditor.chain().focus().setTextAlign('center').run()}
                                        className={`p-2 rounded hover:bg-gray-200 transition-colors ${emailEditor.isActive({ textAlign: 'center' }) ? 'bg-gray-300' : ''}`}
                                        title="Align Center"
                                    >
                                        ⬌
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => emailEditor.chain().focus().setTextAlign('right').run()}
                                        className={`p-2 rounded hover:bg-gray-200 transition-colors ${emailEditor.isActive({ textAlign: 'right' }) ? 'bg-gray-300' : ''}`}
                                        title="Align Right"
                                    >
                                        ➡
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => emailEditor.chain().focus().setTextAlign('justify').run()}
                                        className={`p-2 rounded hover:bg-gray-200 transition-colors ${emailEditor.isActive({ textAlign: 'justify' }) ? 'bg-gray-300' : ''}`}
                                        title="Justify"
                                    >
                                        ⬌⬌
                                    </button>
                                    <div className="w-px h-6 bg-gray-300 mx-1" />

                                    {/* Link */}
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const previousUrl = emailEditor.getAttributes('link').href;
                                            const url = window.prompt('Enter URL:', previousUrl || '');
                                            if (url !== null) {
                                                if (url === '') {
                                                    emailEditor.chain().focus().extendMarkRange('link').unsetLink().run();
                                                } else {
                                                    emailEditor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
                                                }
                                            }
                                        }}
                                        className={`p-2 rounded hover:bg-gray-200 transition-colors ${emailEditor.isActive('link') ? 'bg-gray-300' : ''}`}
                                        title="Insert/Edit Link"
                                    >
                                        🔗
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => emailEditor.chain().focus().unsetLink().run()}
                                        disabled={!emailEditor.isActive('link')}
                                        className="p-2 rounded hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        title="Remove Link"
                                    >
                                        🔗✕
                                    </button>
                                    <div className="w-px h-6 bg-gray-300 mx-1" />

                                    {/* Colors */}
                                    <div className="relative inline-block">
                                        <input
                                            type="color"
                                            onChange={(e) => emailEditor.chain().focus().setColor(e.target.value).run()}
                                            value={emailEditor.getAttributes('textStyle').color || '#000000'}
                                            className="w-8 h-8 rounded cursor-pointer border border-gray-300"
                                            title="Text Color"
                                        />
                                    </div>
                                    <div className="relative inline-block">
                                        <input
                                            type="color"
                                            onChange={(e) => emailEditor.chain().focus().toggleHighlight({ color: e.target.value }).run()}
                                            value="#ffff00"
                                            className="w-8 h-8 rounded cursor-pointer border border-gray-300"
                                            title="Highlight Color"
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => emailEditor.chain().focus().unsetHighlight().run()}
                                        disabled={!emailEditor.isActive('highlight')}
                                        className="p-2 rounded hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        title="Remove Highlight"
                                    >
                                        🎨✕
                                    </button>
                                    <div className="w-px h-6 bg-gray-300 mx-1" />

                                    {/* Image */}
                                    <div className="relative inline-block">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            ref={imageUploadRef}
                                            onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (file) {
                                                    // Validate file size (max 5MB)
                                                    if (file.size > 5 * 1024 * 1024) {
                                                        toast.error('Image size should be less than 5MB');
                                                        e.target.value = '';
                                                        return;
                                                    }
                                                    // Validate file type
                                                    if (!file.type.startsWith('image/')) {
                                                        toast.error('Please select a valid image file');
                                                        e.target.value = '';
                                                        return;
                                                    }
                                                    const reader = new FileReader();
                                                    reader.onload = (event) => {
                                                        const base64 = event.target?.result;
                                                        if (base64 && emailEditor) {
                                                            emailEditor.chain().focus().setImage({ src: base64 }).run();
                                                            toast.success('Image inserted successfully');
                                                        }
                                                    };
                                                    reader.onerror = () => {
                                                        toast.error('Failed to read image file');
                                                        e.target.value = '';
                                                    };
                                                    reader.readAsDataURL(file);
                                                }
                                                // Reset input so same file can be selected again
                                                e.target.value = '';
                                            }}
                                            className="hidden"
                                            id="image-upload-input"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => {
                                                // Show options: URL or Upload
                                                const choice = window.confirm('Click OK to upload from device, or Cancel to enter image URL');
                                                if (choice) {
                                                    // Upload from device
                                                    imageUploadRef.current?.click();
                                                } else {
                                                    // Enter URL
                                                    const url = window.prompt('Enter image URL:');
                                                    if (url && url.trim()) {
                                                        emailEditor.chain().focus().setImage({ src: url.trim() }).run();
                                                    }
                                                }
                                            }}
                                            className="p-2 rounded hover:bg-gray-200 transition-colors"
                                            title="Insert Image (Upload from device or URL)"
                                        >
                                            🖼️
                                        </button>
                                    </div>

                                    {/* Other Tools */}
                                    <button
                                        type="button"
                                        onClick={() => emailEditor.chain().focus().setHorizontalRule().run()}
                                        className="p-2 rounded hover:bg-gray-200 transition-colors"
                                        title="Horizontal Rule"
                                    >
                                        ─
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => emailEditor.chain().focus().clearNodes().unsetAllMarks().run()}
                                        className="p-2 rounded hover:bg-gray-200 transition-colors"
                                        title="Clear Formatting"
                                    >
                                        🗑
                                    </button>
                                    <div className="w-px h-6 bg-gray-300 mx-1" />

                                    {/* Undo/Redo */}
                                    <button
                                        type="button"
                                        onClick={() => emailEditor.chain().focus().undo().run()}
                                        disabled={!emailEditor.can().chain().focus().undo().run()}
                                        className="p-2 rounded hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        title="Undo"
                                    >
                                        ↶
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => emailEditor.chain().focus().redo().run()}
                                        disabled={!emailEditor.can().chain().focus().redo().run()}
                                        className="p-2 rounded hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        title="Redo"
                                    >
                                        ↷
                                    </button>
                                </div>
                            )}
                            {/* Editor Content */}
                            <div className="min-h-[300px] max-h-[500px] overflow-y-auto">
                                <style>{`
                                    .tiptap-editor {
                                        outline: none;
                                    }
                                    .tiptap-editor p {
                                        margin: 0.5rem 0;
                                    }
                                    .tiptap-editor p.is-editor-empty:first-child::before {
                                        content: attr(data-placeholder);
                                        float: left;
                                        color: #9ca3af;
                                        pointer-events: none;
                                        height: 0;
                                    }
                                    .tiptap-editor h1 {
                                        font-size: 1.5rem;
                                        font-weight: bold;
                                        margin: 1rem 0;
                                    }
                                    .tiptap-editor h2 {
                                        font-size: 1.25rem;
                                        font-weight: bold;
                                        margin: 0.75rem 0;
                                    }
                                    .tiptap-editor h3 {
                                        font-size: 1.125rem;
                                        font-weight: bold;
                                        margin: 0.75rem 0;
                                    }
                                    .tiptap-editor ul, .tiptap-editor ol {
                                        padding-left: 1.5rem;
                                        margin: 0.5rem 0;
                                    }
                                    .tiptap-editor li {
                                        margin: 0.25rem 0;
                                    }
                                    .tiptap-editor strong {
                                        font-weight: bold;
                                    }
                                    .tiptap-editor em {
                                        font-style: italic;
                                    }
                                    .tiptap-editor u {
                                        text-decoration: underline;
                                    }
                                    .tiptap-editor s {
                                        text-decoration: line-through;
                                    }
                                    .tiptap-editor code {
                                        background-color: #f3f4f6;
                                        color: #dc2626;
                                        padding: 0.125rem 0.25rem;
                                        border-radius: 0.25rem;
                                        font-family: monospace;
                                        font-size: 0.875em;
                                    }
                                    .tiptap-editor pre {
                                        background-color: #1f2937;
                                        color: #f9fafb;
                                        padding: 1rem;
                                        border-radius: 0.5rem;
                                        overflow-x: auto;
                                        margin: 0.75rem 0;
                                    }
                                    .tiptap-editor pre code {
                                        background-color: transparent;
                                        color: inherit;
                                        padding: 0;
                                        border-radius: 0;
                                    }
                                    .tiptap-editor blockquote {
                                        border-left: 4px solid #6c63ff;
                                        padding-left: 1rem;
                                        margin: 0.75rem 0;
                                        font-style: italic;
                                        color: #6b7280;
                                    }
                                    .tiptap-editor hr {
                                        border: none;
                                        border-top: 1px solid #e5e7eb;
                                        margin: 1rem 0;
                                    }
                                    .tiptap-editor a {
                                        color: #2563eb;
                                        text-decoration: underline;
                                        cursor: pointer;
                                    }
                                    .tiptap-editor mark {
                                        background-color: #fef08a;
                                        padding: 0.125rem 0;
                                    }
                                    .tiptap-editor img {
                                        max-width: 100%;
                                        height: auto;
                                        border-radius: 0.5rem;
                                        margin: 0.75rem 0;
                                        display: block;
                                    }
                                    .tiptap-editor[style*="text-align: left"] {
                                        text-align: left;
                                    }
                                    .tiptap-editor[style*="text-align: center"] {
                                        text-align: center;
                                    }
                                    .tiptap-editor[style*="text-align: right"] {
                                        text-align: right;
                                    }
                                    .tiptap-editor[style*="text-align: justify"] {
                                        text-align: justify;
                                    }
                                    .tiptap-editor:focus {
                                        outline: none;
                                    }
                                `}</style>
                                <EditorContent editor={emailEditor} />
                            </div>
                        </div>
                        <p className="mt-2 text-xs text-gray-500">
                            💡 Tip: Use the toolbar above to format your email content. The editor supports rich text formatting.
                        </p>
                    </div>
                </div>
            </div>

            {emailSendingLoading && (
                <div className="fixed inset-0 z-50 flex flex-col justify-center items-center bg-black/50 backdrop-blur-md">
                    <div className="flex justify-center mb-6 space-x-2 mt-10">
                        <span className="w-3 h-3 bg-[#2563EB] rounded-full animate-bounce"></span>
                        <span className="w-3 h-3 bg-[#2563EB] rounded-full animate-bounce delay-150"></span>
                        <span className="w-3 h-3 bg-[#2563EB] rounded-full animate-bounce delay-300"></span>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-3 text-center">Sending Email</h3>
                    <p className="text-gray-600 text-sm leading-relaxed text-center">
                        Please wait while we send the email. This may take a few moments as we send the email.
                    </p>
                </div>
            )}
        </div>
    );

    const renderSupport = () => (
        <div className='h-full'>
            {/* Support Inner Tabs */}
            <div className="mb-6">
                <nav className="flex space-x-8">
                    <button
                        onClick={() => { setSupportTab('Enterprise') }}
                        className={`py-2 px-1 border-b-2 font-medium text-[16px] transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] ${supportTab === 'Enterprise'
                            ? 'border-[#6C63FF] text-[#FFFFFF] rounded-t-lg bg-[#2563EB]'
                            : 'border-transparent text-[#4B5563]'
                            }`}
                        title="View Enterprise support tickets"
                    >
                        Enterprise Tickets
                    </button>
                    <button
                        onClick={() => { setSupportTab('active') }}
                        className={`py-2 px-1 border-b-2 font-medium text-[16px] transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] ${supportTab === 'active'
                            ? 'border-[#6C63FF] text-[#FFFFFF] rounded-t-lg bg-[#2563EB]'
                            : 'border-transparent text-[#4B5563]'
                            }`}
                        title="View active support tickets"
                    >
                        Active Tickets
                    </button>
                    <button
                        onClick={() => { setSupportTab('resolved') }}
                        className={`py-2 px-1 border-b-2 font-medium text-[16px] transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] ${supportTab === 'resolved'
                            ? 'border-[#6C63FF] text-[#FFFFFF] rounded-t-lg bg-[#2563EB]'
                            : 'border-transparent text-[#4B5563]'
                            }`}
                        title="View resolved support tickets"
                    >
                        Resolved Tickets
                    </button>
                </nav>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                {/* {console.log("kunal"+supportTicketsStats)} */}
                {(() => {
                    // Get the appropriate stats based on current tab
                    let currentStats = {};
                    if (supportTab === 'active') {
                        currentStats = supportTicketsStats;
                    } else if (supportTab === 'Enterprise') {
                        currentStats = supportTicketsStatsEnterprise;
                    } else if (supportTab === 'resolved') {
                        currentStats = supportTicketsStatsCompleted;
                    }

                    return Object.keys(currentStats).map((key, index) => (
                        <div
                            key={index}
                            className="h-[139px] rounded-2xl bg-gradient-to-b from-[#413B99] to-[#6C63FF] flex justify-between shadow-lg w-full"
                        >
                            {/* Left Section */}
                            <div>
                                <h2 className="pl-6 pt-6 text-white text-lg w-full">{key}</h2>
                                <p className="pl-6 text-white text-4xl font-bold mt-2">
                                    {safeText(currentStats[key])}
                                </p>
                            </div>

                            {/* Right Section with Dynamic Icons */}
                            <div className="flex items-center overflow-hidden relative">
                                {key === "Billing & Payments" && (
                                    <img src={revenue} className="mt-[20px] ml-[50px] w-[180px] h-[120px]" />
                                )}
                                {key === "Proposal Issues" && (
                                    <img src={proposalimg} className="mt-[20px] ml-[50px] w-[180px] h-[120px]" />
                                )}
                                {key === "Account & Access" && (
                                    <img src={user} className="mt-[20px] ml-[50px] w-[180px] h-[120px]" />
                                )}
                                {key === "Technical Errors" && (
                                    <img src={error} className="mt-[20px] ml-[50px] w-[180px] h-[120px]" />
                                )}
                                {key === "Feature Requests" && (
                                    <img src={request} className="mt-[20px] ml-[50px] w-[180px] h-[120px]" />
                                )}
                                {![
                                    "Billing & Payments",
                                    "Proposal Issues",
                                    "Account & Access",
                                    "Technical Errors",
                                    "Feature Requests",
                                ].includes(key) && (
                                        <img src={other} className="mt-[20px] ml-[50px] w-[180px] h-[120px]" />
                                    )}
                            </div>
                        </div>
                    ));
                })()
                }
            </div>


            {/* Search and Filter Bar */}
            <div className="mb-6 py-4">
                <div className="flex flex-col gap-3 xs:gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4 lg:flex-1">
                        <div className="relative">
                            <MdOutlineSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#9CA3AF] w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search support tickets..."
                                value={supportSearchTerm}
                                onChange={(e) => {
                                    setSupportSearchTerm(e.target.value);
                                    closeAllInvoiceRows();
                                }}
                                className="pl-10 pr-4 py-2 border border-[#E5E7EB] rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:border-transparent w-full sm:w-[530px] md:max-w-[480px] lg:min-w-[530px] lg:max-w-[530px] text-[#374151] placeholder-[#9CA3AF] bg-white disabled:opacity-50 disabled:cursor-not-allowed"
                                title="Search support tickets by subject, description, or category"
                            />
                        </div>
                        <div className="relative">
                            <button className="bg-white flex items-center justify-center space-x-2 px-4 py-2 border border-[#E5E7EB] rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98] w-full sm:w-auto"
                                onClick={() => setSupportFilterModal(!supportFilterModal)}
                                title="Filter support tickets by status, priority, and type"
                            >
                                <MdOutlineFilterList className="w-5 h-5" />
                                <span>Filter</span>
                            </button>

                            {supportFilterModal && (
                                <div className="absolute top-10 left-0 w-64 bg-white rounded-lg shadow-lg p-2 flex flex-col gap-2 z-1000 border border-[#E5E7EB]">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-[14px] font-medium text-[#111827]">Filters</span>
                                        <button
                                            className="text-[12px] text-[#2563EB] hover:underline"
                                            onClick={() => { handleSupportStatusChangeFilter('all'); handleSupportPriorityChangeFilter('all'); handleSupportTypeChangeFilter('all'); }}
                                        >
                                            Clear
                                        </button>
                                    </div>
                                    {/* All */}
                                    <div className="flex items-start space-x-2 hover:bg-gray-50 p-2 rounded cursor-pointer mb-2">
                                        <input type="radio" name="supportAll" id="support_all" value="all"
                                            checked={
                                                supportTab === 'resolved'
                                                    ? supportPriorityFilter === 'all' && supportTypeFilter === 'all'
                                                    : supportStatusFilter === 'all' && supportPriorityFilter === 'all' && supportTypeFilter === 'all'
                                            }
                                            onChange={() => {
                                                handleSupportStatusChangeFilter('all');
                                                handleSupportPriorityChangeFilter('all');
                                                handleSupportTypeChangeFilter('all');
                                            }}
                                            className="mt-1"
                                        />
                                        <label htmlFor="support_all" className="cursor-pointer leading-none">All</label>
                                    </div>
                                    {/* Status - Hide for resolved tickets tab */}
                                    {supportTab !== 'resolved' && (
                                        <>
                                            <span className="text-[16px] font-medium text-[#4B5563]">Status :</span>
                                            <div className="ml-4">
                                                <div className="flex items-start space-x-2 hover:bg-gray-50 p-2 rounded cursor-pointer mb-2">
                                                    <input type="radio" name="supportStatusFilter" id="pending" value="Pending"
                                                        checked={supportStatusFilter === 'Pending'}
                                                        onClick={(e) => { if (supportStatusFilter === e.target.value) handleSupportStatusChangeFilter('all'); }}
                                                        onChange={(e) => handleSupportStatusChangeFilter(e.target.value)}
                                                        className="mt-1"
                                                    />
                                                    <label htmlFor="pending" className="cursor-pointer leading-none">Pending</label>
                                                </div>
                                                <div className="flex items-start space-x-2 hover:bg-gray-50 p-2 rounded cursor-pointer mb-2">
                                                    <input type="radio" name="supportStatusFilter" id="inProgress" value="In Progress"
                                                        checked={supportStatusFilter === 'In Progress'}
                                                        onClick={(e) => { if (supportStatusFilter === e.target.value) handleSupportStatusChangeFilter('all'); }}
                                                        onChange={(e) => handleSupportStatusChangeFilter(e.target.value)}
                                                        className="mt-1"
                                                    />
                                                    <label htmlFor="inProgress" className="cursor-pointer leading-none">In Progress</label>
                                                </div>
                                                <div className="flex items-start space-x-2 hover:bg-gray-50 p-2 rounded cursor-pointer mb-2">
                                                    <input type="radio" name="supportStatusFilter" id="reopened" value="Re-Opened"
                                                        checked={supportStatusFilter === 'Re-Opened'}
                                                        onClick={(e) => { if (supportStatusFilter === e.target.value) handleSupportStatusChangeFilter('all'); }}
                                                        onChange={(e) => handleSupportStatusChangeFilter(e.target.value)}
                                                        className="mt-1"
                                                    />
                                                    <label htmlFor="reopened" className="cursor-pointer leading-none">Re-Opened</label>
                                                </div>
                                                <div className="flex items-start space-x-2 hover:bg-gray-50 p-2 rounded cursor-pointer mb-2">
                                                    <input type="radio" name="supportStatusFilter" id="withdrawn" value="Withdrawn"
                                                        checked={supportStatusFilter === 'Withdrawn'}
                                                        onClick={(e) => { if (supportStatusFilter === e.target.value) handleSupportStatusChangeFilter('all'); }}
                                                        onChange={(e) => handleSupportStatusChangeFilter(e.target.value)}
                                                        className="mt-1"
                                                    />
                                                    <label htmlFor="withdrawn" className="cursor-pointer leading-none">Withdrawn</label>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                    {/* Priority */}
                                    <span className="text-[16px] font-medium text-[#4B5563]">Priority :</span>
                                    <div className="ml-4">
                                        <div className="flex items-start space-x-2 hover:bg-gray-50 p-2 rounded cursor-pointer mb-2">
                                            <input type="radio" name="supportPriorityFilter" id="low" value="low"
                                                checked={supportPriorityFilter === 'low'}
                                                onClick={(e) => { if (supportPriorityFilter === e.target.value) handleSupportPriorityChangeFilter('all'); }}
                                                onChange={(e) => handleSupportPriorityChangeFilter(e.target.value)}
                                                className="mt-1"
                                            />
                                            <label htmlFor="low" className="cursor-pointer leading-none">Low</label>
                                        </div>
                                        <div className="flex items-start space-x-2 hover:bg-gray-50 p-2 rounded cursor-pointer mb-2">
                                            <input type="radio" name="supportPriorityFilter" id="medium" value="medium"
                                                checked={supportPriorityFilter === 'medium'}
                                                onClick={(e) => { if (supportPriorityFilter === e.target.value) handleSupportPriorityChangeFilter('all'); }}
                                                onChange={(e) => handleSupportPriorityChangeFilter(e.target.value)}
                                                className="mt-1"
                                            />
                                            <label htmlFor="medium" className="cursor-pointer leading-none">Medium</label>
                                        </div>
                                        <div className="flex items-start space-x-2 hover:bg-gray-50 p-2 rounded cursor-pointer mb-2">
                                            <input type="radio" name="supportPriorityFilter" id="high" value="high"
                                                checked={supportPriorityFilter === 'high'}
                                                onClick={(e) => { if (supportPriorityFilter === e.target.value) handleSupportPriorityChangeFilter('all'); }}
                                                onChange={(e) => handleSupportPriorityChangeFilter(e.target.value)}
                                                className="mt-1"
                                            />
                                            <label htmlFor="high" className="cursor-pointer leading-none">High</label>
                                        </div>
                                    </div>
                                    {/* Category */}
                                    <span className="text-[16px] font-medium text-[#4B5563]">Category :</span>
                                    <div className="ml-4">
                                        <div className="flex items-start space-x-2 hover:bg-gray-50 p-2 rounded cursor-pointer mb-2">
                                            <input type="radio" name="supportTypeFilter" id="billingPayments" value="billing & payments"
                                                checked={supportTypeFilter === 'billing & payments'}
                                                onClick={(e) => { if (supportTypeFilter === e.target.value) handleSupportTypeChangeFilter('all'); }}
                                                onChange={(e) => handleSupportTypeChangeFilter(e.target.value)}
                                                className="mt-1"
                                            />
                                            <label htmlFor="billingPayments" className="cursor-pointer leading-none">Billing & Payments</label>
                                        </div>
                                        <div className="flex items-start space-x-2 hover:bg-gray-50 p-2 rounded cursor-pointer mb-2">
                                            <input type="radio" name="supportTypeFilter" id="technicalErrors" value="technical errors"
                                                checked={supportTypeFilter === 'technical errors'}
                                                onClick={(e) => { if (supportTypeFilter === e.target.value) handleSupportTypeChangeFilter('all'); }}
                                                onChange={(e) => handleSupportTypeChangeFilter(e.target.value)}
                                                className="mt-1"
                                            />
                                            <label htmlFor="technicalErrors" className="cursor-pointer leading-none">Technical Errors</label>
                                        </div>
                                        <div className="flex items-start space-x-2 hover:bg-gray-50 p-2 rounded cursor-pointer mb-2">
                                            <input type="radio" name="supportTypeFilter" id="featureRequests" value="feature requests"
                                                checked={supportTypeFilter === 'feature requests'}
                                                onClick={(e) => { if (supportTypeFilter === e.target.value) handleSupportTypeChangeFilter('all'); }}
                                                onChange={(e) => handleSupportTypeChangeFilter(e.target.value)}
                                                className="mt-1"
                                            />
                                            <label htmlFor="featureRequests" className="cursor-pointer leading-none">Feature Requests</label>
                                        </div>
                                        <div className="flex items-start space-x-2 hover:bg-gray-50 p-2 rounded cursor-pointer mb-2">
                                            <input type="radio" name="supportTypeFilter" id="accountAccess" value="account & access"
                                                checked={supportTypeFilter === 'account & access'}
                                                onClick={(e) => { if (supportTypeFilter === e.target.value) handleSupportTypeChangeFilter('all'); }}
                                                onChange={(e) => handleSupportTypeChangeFilter(e.target.value)}
                                                className="mt-1"
                                            />
                                            <label htmlFor="accountAccess" className="cursor-pointer leading-none">Account & Access</label>
                                        </div>
                                        <div className="flex items-start space-x-2 hover:bg-gray-50 p-2 rounded cursor-pointer mb-2">
                                            <input type="radio" name="supportTypeFilter" id="proposalIssues" value="proposal issues"
                                                checked={supportTypeFilter === 'proposal issues'}
                                                onClick={(e) => { if (supportTypeFilter === e.target.value) handleSupportTypeChangeFilter('all'); }}
                                                onChange={(e) => handleSupportTypeChangeFilter(e.target.value)}
                                                className="mt-1"
                                            />
                                            <label htmlFor="proposalIssues" className="cursor-pointer leading-none">Proposal Issues</label>
                                        </div>
                                        <div className="flex items-start space-x-2 hover:bg-gray-50 p-2 rounded cursor-pointer mb-2">
                                            <input type="radio" name="supportTypeFilter" id="others" value="others"
                                                checked={supportTypeFilter === 'others'}
                                                onClick={(e) => { if (supportTypeFilter === e.target.value) handleSupportTypeChangeFilter('all'); }}
                                                onChange={(e) => handleSupportTypeChangeFilter(e.target.value)}
                                                className="mt-1"
                                            />
                                            <label htmlFor="others" className="cursor-pointer leading-none">Others</label>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {supportTab === 'Enterprise' ? (
                <div className="bg-white rounded-2xl shadow-sm border border-[#E5E7EB] mb-6 overflow-x-auto">
                    <table className="w-full rounded-2xl">
                        <thead className="bg-[#F8FAFC] border-b border-[#0000001A]">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-[#4B5563] uppercase tracking-wider w-1/6">
                                    Category
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-[#4B5563] uppercase tracking-wider w-1/6">
                                    Sub Category
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-[#4B5563] uppercase tracking-wider w-1/3">
                                    Description
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-[#4B5563] uppercase tracking-wider w-1/6">
                                    Date
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-[#4B5563] uppercase tracking-wider w-1/6">
                                    Priority
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-[#4B5563] uppercase tracking-wider w-1/6">
                                    Status
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-[#4B5563] uppercase tracking-wider w-1/12">
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white">
                            {(() => {
                                const paginatedEnterprise = paginateData(filteredEnterpriseSupport, currentPageEnterpriseSupport, rowsPerPage);
                                return paginatedEnterprise.length > 0 ? paginatedEnterprise.map((ticket, index) => (
                                    <React.Fragment key={index}>
                                        <tr>
                                            <td className="p-4 whitespace-nowrap text-[16px] font-medium text-[#4B5563]">
                                                {ticket.category}
                                            </td>
                                            <td className="p-4 whitespace-nowrap text-[16px] text-[#4B5563]">
                                                {ticket.subCategory}
                                            </td>
                                            <td className="p-4 text-[16px] text-[#4B5563]">
                                                <div className="max-w-[200px] line-clamp-2 truncate text-ellipsis">
                                                    <span className="text-ellipsis overflow-hidden">{ticket.description}</span>
                                                </div>
                                            </td>
                                            <td className="p-4 text-[#6C63FF] whitespace-nowrap">
                                                {formatDate(ticket.createdAt)}
                                            </td>
                                            <td className="p-4 whitespace-nowrap">
                                                <span className={`inline-flex px-2 py-1 text-[12px] font-semibold rounded-full ${getPriorityColor(ticket.priority)}`}>
                                                    {ticket.priority}
                                                </span>
                                            </td>
                                            <td className="p-4 whitespace-nowrap">
                                                <span className={`inline-flex px-2 py-1 text-[12px] font-semibold rounded-full ${getStatusColor(ticket.status)}`}>
                                                    {ticket.status}
                                                </span>
                                            </td>
                                            <td className="p-4 whitespace-nowrap text-[16px] font-medium">
                                                <button
                                                    className="p-2 rounded-lg transition-colors flex items-center justify-center hover:bg-blue-50"
                                                    onClick={() => openSupportModal(ticket)}
                                                    title="View Details"
                                                >
                                                    <MdOutlineVisibility className="w-5 h-5 text-[#6C63FF]" />
                                                </button>
                                            </td>
                                        </tr>

                                    </React.Fragment>
                                )) : (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-4 whitespace-nowrap text-[16px] font-medium text-[#4B5563] text-center">
                                            No tickets found
                                        </td>
                                    </tr>
                                );
                            })()}
                        </tbody>
                    </table>
                    {filteredEnterpriseSupport.length > 0 && (
                        <PaginationComponent
                            currentPage={currentPageEnterpriseSupport}
                            totalPages={getTotalPages(filteredEnterpriseSupport, rowsPerPage)}
                            onPageChange={(page) => {
                                setCurrentPageEnterpriseSupport(page);
                                closeAllInvoiceRows();
                            }}
                            totalItems={filteredEnterpriseSupport.length}
                            rowsPerPage={rowsPerPage}
                            onRowsPerPageChange={(newRowsPerPage) => {
                                setRowsPerPage(newRowsPerPage);
                                setCurrentPageEnterpriseSupport(1);
                                closeAllInvoiceRows();
                            }}
                        />
                    )}
                </div>
            ) : (
                <div className="bg-white rounded-2xl shadow-sm border border-[#E5E7EB] mb-6 overflow-x-auto">
                    <table className="w-full rounded-2xl">
                        <thead className="bg-[#F8FAFC] border-b border-[#0000001A]">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-[#4B5563] uppercase tracking-wider w-1/6">
                                    Category
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-[#4B5563] uppercase tracking-wider w-1/6">
                                    Sub Category
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-[#4B5563] uppercase tracking-wider w-1/3">
                                    Description
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-[#4B5563] uppercase tracking-wider w-1/6">
                                    Date
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-[#4B5563] uppercase tracking-wider w-1/6">
                                    Priority
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-[#4B5563] uppercase tracking-wider w-1/6">
                                    Status
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-[#4B5563] uppercase tracking-wider w-1/12">
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white">
                            {(() => {
                                const nonEnterprise = (filteredSupport || []).filter(t => (t.plan_name || '').toLowerCase() !== 'enterprise');
                                const paginatedSupport = paginateData(nonEnterprise, currentPageSupport, rowsPerPage);
                                return paginatedSupport.length > 0 ? paginatedSupport.map((ticket, index) => (
                                    <React.Fragment key={index}>
                                        <tr>
                                            <td className="p-4 whitespace-nowrap text-[16px] font-medium text-[#4B5563]">
                                                {ticket.category}
                                            </td>
                                            <td className="p-4 whitespace-nowrap text-[16px] text-[#4B5563]">
                                                {ticket.subCategory}
                                            </td>
                                            <td className="p-4 text-[16px] text-[#4B5563]">
                                                <div className="max-w-[200px] line-clamp-2 truncate text-ellipsis">
                                                    <span className="text-ellipsis overflow-hidden">{ticket.description}</span>
                                                </div>
                                            </td>
                                            <td className="p-4 text-[#6C63FF] whitespace-nowrap">
                                                {formatDate(ticket.createdAt)}
                                            </td>
                                            <td className="p-4 whitespace-nowrap">
                                                <span className={`inline-flex px-2 py-1 text-[12px] font-semibold rounded-full ${getPriorityColor(ticket.priority)}`}>
                                                    {ticket.priority}
                                                </span>
                                            </td>
                                            <td className="p-4 whitespace-nowrap">
                                                <span className={`inline-flex px-2 py-1 text-[12px] font-semibold rounded-full ${getStatusColor(ticket.status)}`}>
                                                    {ticket.status}
                                                </span>
                                            </td>
                                            <td className="p-4 whitespace-nowrap text-[16px] font-medium">
                                                <button
                                                    className="p-2 rounded-lg transition-colors flex items-center justify-center hover:bg-blue-50"
                                                    onClick={() => openSupportModal(ticket)}
                                                    title="View Details"
                                                >
                                                    <MdOutlineVisibility className="w-5 h-5 text-[#6C63FF]" />
                                                </button>
                                            </td>
                                        </tr>

                                    </React.Fragment>
                                )) : (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-4 whitespace-nowrap text-[16px] font-medium text-[#4B5563] text-center">
                                            No tickets found
                                        </td>
                                    </tr>
                                );
                            })()}
                        </tbody>
                    </table>
                    {(() => { const nonEnterprise = (filteredSupport || []).filter(t => (t.plan_name || '').toLowerCase() !== 'enterprise'); return nonEnterprise.length > 0; })() && (
                        <PaginationComponent
                            currentPage={currentPageSupport}
                            totalPages={getTotalPages((filteredSupport || []).filter(t => (t.plan_name || '').toLowerCase() !== 'enterprise'), rowsPerPage)}
                            onPageChange={(page) => {
                                setCurrentPageSupport(page);
                                closeAllInvoiceRows();
                            }}
                            totalItems={(filteredSupport || []).filter(t => (t.plan_name || '').toLowerCase() !== 'enterprise').length}
                            rowsPerPage={rowsPerPage}
                            onRowsPerPageChange={(newRowsPerPage) => {
                                setRowsPerPage(newRowsPerPage);
                                setCurrentPageSupport(1); // Reset to first page when changing rows per page
                                closeAllInvoiceRows();
                            }}
                        />
                    )}
                </div>
            )}
        </div>
    );

    function timeAgo(timestamp) {
        const now = new Date();
        const past = new Date(timestamp);
        const seconds = Math.floor((now - past) / 1000);

        const intervals = [
            { label: "year", seconds: 31536000 },
            { label: "month", seconds: 2592000 },
            { label: "day", seconds: 86400 },
            { label: "hour", seconds: 3600 },
            { label: "minute", seconds: 60 },
            { label: "second", seconds: 1 },
        ];

        for (const interval of intervals) {
            const count = Math.floor(seconds / interval.seconds);
            if (count > 0) {
                return count === 1 ? `${count} ${interval.label} ago` : `${count} ${interval.label}s ago`;
            }
        }
        return "just now";
    }



    const renderNotifications = () => {
        const getNotificationIcon = (icon) => {
            switch (icon) {
                case 'User':
                    return <MdOutlineAccountCircle className="w-5 h-5" />;
                case 'Payment':
                    return <MdOutlineShoppingBag className="w-5 h-5" />;
                case 'Support':
                    return <MdOutlineHeadphones className="w-5 h-5" />;
                case 'Subscription':
                    return <MdOutlineMoney className="w-5 h-5" />;
                default:
                    return <MdOutlineAccountCircle className="w-5 h-5" />;
            }
        };

        return (
            <div className="h-full">
                {/* Filters and Search */}
                <div className="pb-4 mb-6">
                    <div className="flex flex-col gap-3 xs:gap-4 lg:flex-row lg:items-center lg:justify-between">
                        <div className="flex flex-col gap-3 lg:flex-1">
                            <div className="relative w-full sm:max-w-[540px]">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <MdOutlineSearch className="h-4 w-4 text-[#4B5563]" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Search notifications..."
                                    value={notificationSearchTerm}
                                    onChange={(e) => {
                                        setNotificationSearchTerm(e.target.value);
                                    }}
                                    className="block w-full pl-10 pr-3 py-2 border border-[#4B5563] rounded-lg leading-5 bg-white placeholder-[#4B5563] focus:outline-none focus:placeholder-[#4B5563] focus:ring-1 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                    title="Search notifications by title or message"
                                />
                            </div>
                        </div>
                        <div className="flex flex-col gap-3 xs:flex-row xs:items-center xs:gap-3 sm:flex-row sm:items-center sm:gap-4 lg:justify-end">
                            <div className="relative notification-filter-modal">
                                <button className="flex items-center justify-center space-x-2 px-3 py-2 text-sm text-[#111827] bg-white border border-[#4B5563] rounded-lg hover:bg-[#4B5563] hover:text-white transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98] w-full sm:w-auto"
                                    onClick={() => setNotificationTimeFilterModal(!notificationTimeFilterModal)}
                                    title="Filter notifications by time period"
                                >
                                    <MdOutlineFilterList className="w-4 h-4" />
                                    <span>{formatFilterDisplay(notificationTimeFilter, 'time') || 'All Time'}</span>
                                    <MdOutlineKeyboardArrowDown className="w-4 h-4" />
                                </button>

                                {notificationTimeFilterModal && (
                                    <div className="notification-filter-modal absolute top-10 left-0 w-64 bg-white rounded-lg shadow-lg p-2 flex flex-col gap-2 z-[9999] border border-[#E5E7EB] sm:left-0 left-1/2 transform -translate-x-1/2 transition-all duration-200 ease-in-out">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-[14px] font-medium text-[#111827]">Time</span>
                                            <button
                                                className="text-[12px] text-[#2563EB] hover:underline transition-colors duration-200"
                                                onClick={() => {
                                                    setNotificationTimeFilter('All Time');
                                                }}
                                                title="Clear notification time filter"
                                            >
                                                Clear
                                            </button>
                                        </div>
                                        <div className="flex items-start space-x-2 hover:bg-gray-50 p-2 rounded cursor-pointer mb-2">
                                            <input type="radio" name="notificationTimeFilter" id="allTime" value="All Time"
                                                checked={notificationTimeFilter === 'All Time'}
                                                onChange={(e) => {
                                                    setNotificationTimeFilter(e.target.value);
                                                }}
                                                className="mt-1"
                                            />
                                            <label htmlFor="allTime" className="cursor-pointer leading-none">All Time</label>
                                        </div>


                                        <div className="flex items-start space-x-2 hover:bg-gray-50 p-2 rounded cursor-pointer mb-2 text-[14px]">
                                            <input type="radio" name="notificationTimeFilter" id="today" value="today"
                                                checked={notificationTimeFilter === 'today'}
                                                onChange={(e) => {
                                                    setNotificationTimeFilter(e.target.value);
                                                }}
                                                className="mt-1"
                                            />
                                            <label htmlFor="today" className="cursor-pointer leading-none">Today</label>
                                        </div>
                                        <div className="flex items-start space-x-2 hover:bg-gray-50 p-2 rounded cursor-pointer mb-2">
                                            <input type="radio" name="notificationTimeFilter" id="yesterday" value="yesterday"
                                                checked={notificationTimeFilter === 'yesterday'}
                                                onChange={(e) => {
                                                    setNotificationTimeFilter(e.target.value);
                                                }}
                                                className="mt-1"
                                            />
                                            <label htmlFor="yesterday" className="cursor-pointer leading-none">Yesterday</label>
                                        </div>
                                        <div className="flex items-start space-x-2 hover:bg-gray-50 p-2 rounded cursor-pointer mb-2">
                                            <input type="radio" name="notificationTimeFilter" id="last7Days" value="last7Days"
                                                checked={notificationTimeFilter === 'last7Days'}
                                                onChange={(e) => {
                                                    setNotificationTimeFilter(e.target.value);
                                                }}
                                                className="mt-1"
                                            />
                                            <label htmlFor="last7Days" className="cursor-pointer leading-none">Last 7 Days</label>
                                        </div>
                                        <div className="flex items-start space-x-2 hover:bg-gray-50 p-2 rounded cursor-pointer mb-2">
                                            <input type="radio" name="notificationTimeFilter" id="last14Days" value="last14Days"
                                                checked={notificationTimeFilter === 'last14Days'}
                                                onChange={(e) => {
                                                    setNotificationTimeFilter(e.target.value);
                                                }}
                                                className="mt-1"
                                            />
                                            <label htmlFor="last14Days" className="cursor-pointer leading-none">Last 14 Days</label>
                                        </div>
                                        <div className="flex items-start space-x-2 hover:bg-gray-50 p-2 rounded cursor-pointer mb-2">
                                            <input type="radio" name="notificationTimeFilter" id="last30Days" value="last30Days"
                                                checked={notificationTimeFilter === 'last30Days'}
                                                onChange={(e) => {
                                                    setNotificationTimeFilter(e.target.value);
                                                }}
                                                className="mt-1"
                                            />
                                            <label htmlFor="last30Days" className="cursor-pointer leading-none">Last 30 Days</label>
                                        </div>


                                    </div>
                                )}
                            </div>
                            <div className="relative notification-filter-modal">
                                <button className="flex items-center justify-center space-x-2 px-3 py-2 text-sm text-[#111827] bg-white border border-[#4B5563] rounded-lg hover:bg-[#4B5563] hover:text-white transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98] w-full sm:w-auto"
                                    onClick={() => setNotificationCategoryFilterModal(!notificationCategoryFilterModal)}
                                    title="Filter notifications by category"
                                >
                                    <span>{formatFilterDisplay(notificationCategoryFilter, 'category') || 'All Categories'}</span>
                                    <MdOutlineKeyboardArrowDown className="w-4 h-4" />
                                </button>

                                {notificationCategoryFilterModal && (
                                    <div className="notification-filter-modal absolute top-10 left-0 w-64 bg-white rounded-lg shadow-lg p-2 flex flex-col gap-2 z-[9999] border border-[#E5E7EB] sm:left-0 left-1/2 transform -translate-x-1/2 transition-all duration-200 ease-in-out">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-[14px] font-medium text-[#111827]">Category</span>
                                            <button
                                                className="text-[12px] text-[#2563EB] hover:underline transition-colors duration-200"
                                                onClick={() => handleNotificationCategoryFilter('All Categories')}
                                                title="Clear notification category filter"
                                            >
                                                Clear
                                            </button>
                                        </div>
                                        <div className="flex items-start space-x-2 hover:bg-gray-50 p-2 rounded cursor-pointer mb-2">
                                            <input type="radio" name="notificationCategoryFilter" id="allCategories" value="All Categories"
                                                checked={notificationCategoryFilter === 'All Categories'}
                                                onChange={(e) => handleNotificationCategoryFilter(e.target.value)}
                                                className="mt-1"
                                            />
                                            <label htmlFor="allCategories" className="cursor-pointer leading-none">All Categories</label>
                                        </div>
                                        <div className="flex items-start space-x-2 hover:bg-gray-50 p-2 rounded cursor-pointer mb-2">
                                            <input type="radio" name="notificationCategoryFilter" id="accountAccess" value="account access"
                                                checked={notificationCategoryFilter === 'account access'}
                                                onChange={(e) => handleNotificationCategoryFilter(e.target.value)}
                                                className="mt-1"
                                            />
                                            <label htmlFor="accountAccess" className="cursor-pointer leading-none">Account & Access</label>
                                        </div>
                                        <div className="flex items-start space-x-2 hover:bg-gray-50 p-2 rounded cursor-pointer mb-2">
                                            <input type="radio" name="notificationCategoryFilter" id="billingPayments" value="billing & payments"
                                                checked={notificationCategoryFilter === 'billing & payments'}
                                                onChange={(e) => handleNotificationCategoryFilter(e.target.value)}
                                                className="mt-1"
                                            />
                                            <label htmlFor="billingPayments" className="cursor-pointer leading-none">Billing & Payments</label>
                                        </div>
                                        <div className="flex items-start space-x-2 hover:bg-gray-50 p-2 rounded cursor-pointer mb-2">
                                            <input type="radio" name="notificationCategoryFilter" id="technicalErrors" value="technical errors"
                                                checked={notificationCategoryFilter === 'technical errors'}
                                                onChange={(e) => handleNotificationCategoryFilter(e.target.value)}
                                                className="mt-1"
                                            />
                                            <label htmlFor="technicalErrors" className="cursor-pointer leading-none">Technical Errors</label>
                                        </div>
                                        <div className="flex items-start space-x-2 hover:bg-gray-50 p-2 rounded cursor-pointer mb-2">
                                            <input type="radio" name="notificationCategoryFilter" id="featureRequests" value="feature requests"
                                                checked={notificationCategoryFilter === 'feature requests'}
                                                onChange={(e) => handleNotificationCategoryFilter(e.target.value)}
                                                className="mt-1"
                                            />
                                            <label htmlFor="featureRequests" className="cursor-pointer leading-none">Feature Requests</label>
                                        </div>
                                        <div className="flex items-start space-x-2 hover:bg-gray-50 p-2 rounded cursor-pointer mb-2">
                                            <input type="radio" name="notificationCategoryFilter" id="proposalIssues" value="proposal issues"
                                                checked={notificationCategoryFilter === 'proposal issues'}
                                                onChange={(e) => handleNotificationCategoryFilter(e.target.value)}
                                                className="mt-1"
                                            />
                                            <label htmlFor="proposalIssues" className="cursor-pointer leading-none">Proposal Issues</label>
                                        </div>
                                        <div className="flex items-start space-x-2 hover:bg-gray-50 p-2 rounded cursor-pointer mb-2">
                                            <input type="radio" name="notificationCategoryFilter" id="others" value="others"
                                                checked={notificationCategoryFilter === 'others'}
                                                onChange={(e) => handleNotificationCategoryFilter(e.target.value)}
                                                className="mt-1"
                                            />
                                            <label htmlFor="others" className="cursor-pointer leading-none">Others</label>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Notifications List */}
                {(() => {
                    const paginatedNotifications = paginateData(filteredNotifications, currentPageNotifications, rowsPerPage);
                    return paginatedNotifications.length > 0 ? paginatedNotifications.map((item) => (
                        <div key={item.id} className="bg-white p-4 transition-colors border border-[#E5E7EB] rounded-lg mb-4">
                            <div className="flex items-start space-x-4">
                                {/* Icon */}
                                <div className="flex-shrink-0">
                                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                        {getNotificationIcon(item.category)}
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1">
                                            <p className="text-sm text-[#4B5563] mb-1">{item.type}</p>
                                            <h3 className="text-sm font-medium text-[#000000] mb-1">{item.title}</h3>
                                            <p className="text-sm text-[#4B5563]">{item.description}</p>
                                        </div>
                                        <div className="flex-shrink-0 ml-4">
                                            <p className="text-sm text-[#4B5563]">{timeAgo(item.created_at)}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )) : (
                        <div className="px-6 py-4 whitespace-nowrap text-[16px] font-medium text-[#4B5563] text-center">
                            No notifications found
                        </div>
                    );
                })()}

                {/* Pagination for notifications */}
                {filteredNotifications.length > 0 && (
                    <div className="mt-6">
                        <PaginationComponent
                            currentPage={currentPageNotifications}
                            totalPages={getTotalPages(filteredNotifications, rowsPerPage)}
                            onPageChange={(page) => {
                                setCurrentPageNotifications(page);
                            }}
                            totalItems={filteredNotifications.length}
                            rowsPerPage={rowsPerPage}
                            onRowsPerPageChange={(newRowsPerPage) => {
                                setRowsPerPage(newRowsPerPage);
                                setCurrentPageNotifications(1); // Reset to first page when changing rows per page
                            }}
                        />
                    </div>
                )}
            </div>
        );
    };

    const handleLogout = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            Swal.fire({
                title: "Error",
                text: "Something went wrong",
                icon: "error",
                timer: 1500,
            });
            return;
        }
        try {
            const result = await axios.post(`${baseUrl}/auth/logout`, {}, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (result.status === 200) {
                Swal.fire({
                    title: "Logged out successfully",
                    text: "You will be redirected to the login page...",
                    icon: "success",
                    timer: 1500,
                });
            }
        } catch (error) {
            console.error("Error logging out:", error);
        } finally {
            localStorage.clear();
            setTimeout(() => {
                navigate("/");
            }, 1500);
        }
    };

    // Modal Components
    const UserViewModal = () => (
        <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-lg flex items-center justify-center z-50" onClick={handleModalBackdropClick}>
            <div className="bg-white rounded-lg p-6 max-w-6xl w-full mx-4 max-h-[90vh] overflow-y-auto border border-[#E5E7EB]">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-gray-900">Company Information</h2>
                    <button
                        onClick={() => setViewUserModal(false)}
                        className="text-gray-500 hover:text-gray-700 transition-colors"
                    >
                        <MdOutlineClose className="w-6 h-6" />
                    </button>
                </div>
                {selectedUser && (
                    <div className="space-y-6 bg-white rounded-lg p-6">
                        {/* Basic Information */}
                        <div className="bg-[#F7F7F7] rounded-lg shadow-sm p-4">

                            <div className="flex flex-col gap-4">
                                <div className='flex flex-row gap-2'>
                                    <div>
                                        <img src={selectedUser.logoUrl ? `${baseUrl}/profile/getProfileImage/file/${selectedUser.logoUrl}` : "https://via.placeholder.com/150"} alt="Company Logo" className="w-[124px] h-[124px] border rounded-lg border-[#E5E7EB]" />
                                    </div>

                                    <div className='flex flex-col gap-2'>
                                        <div className='flex flex-row gap-2 mt-2'>
                                            <label className="block text-[14px] font-medium text-gray-700 mb-1">ID: </label>
                                            <p className="text-gray-900 font-mono text-sm">{selectedUser._id}</p>
                                        </div>
                                        <div className='flex flex-row gap-2'>
                                            <p className="text-gray-900 font-bold text-2xl mb-1">{selectedUser.companyName}</p>
                                            <span className={`h-fit px-2 py-1 text-xs rounded-full ${getStatusColor(selectedUser.blocked ? 'Blocked' : (selectedUser.status || 'Active'))}`}>
                                                {selectedUser.blocked ? 'Blocked' : (selectedUser.status || 'Active')}
                                            </span>
                                        </div>
                                        <div className='flex flex-row gap-2'>
                                            <p className="text-gray-900 font-bold text-sm mb-1">Subscription Type</p>
                                            <span className={`h-fit px-2 py-1 text-xs rounded-full`}>
                                                {selectedUser.plan_name === null ? 'None' : selectedUser.plan_name}
                                            </span>
                                        </div>

                                        <div className="flex flex-row gap-4">
                                            <p className="flex items-center gap-2 text-[#6C63FF] font-medium">
                                                <MdOutlineEmail className="w-4 h-4" />
                                                {selectedUser.email}
                                            </p>

                                            <p className="flex items-center gap-2 text-[#6C63FF] font-medium">
                                                <MdLanguage className="w-4 h-4" />
                                                {selectedUser.website}
                                            </p>

                                            <p className="flex items-center gap-2 text-[#6C63FF] font-medium">
                                                <IoLogoLinkedin className="w-4 h-4" />
                                                {selectedUser.linkedIn}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-[#6B7280] mb-1">About</label>
                                    <p className="text-gray-900">{selectedUser.bio || 'N/A'}</p>
                                </div>

                                <div className='flex flex-row gap-[100px]'>
                                    <div className='flex flex-col gap-1'>
                                        <label className="block text-sm font-medium text-[#6B7280] ">User ID</label>
                                        <p className="text-gray-900 font-mono text-sm">{selectedUser.userId || 'N/A'}</p>
                                    </div>
                                    <div className='flex flex-col gap-1'>
                                        <label className="block text-sm font-medium text-[#6B7280] ">Admin Name</label>
                                        <p className="text-gray-900">{selectedUser.adminName || 'N/A'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>


                        {/* Services, Industries, Awards, Clients */}
                        <div className='flex flex-row gap-4'>
                            <Card title="Services" items={selectedUser.services} />
                            <Card title="Industries" items={selectedUser.preferredIndustries} />
                            <Card title="Awards" items={selectedUser.awards} />
                            <Card title="Clients" items={selectedUser.clients} />
                        </div>


                        <div className='flex flex-row gap-4'>
                            {/* Documents */}
                            {selectedUser.documents && selectedUser.documents.length > 0 && (
                                <div className="bg-[#F7F7F7] p-4 rounded-lg shadow-lg w-[573px] h-[284px]">
                                    <h3 className="text-lg font-semibold text-[#6C63FF] mb-4">Documents</h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {selectedUser.documents.map((doc, index) => (
                                            <div key={index} className="flex items-center justify-between bg-white rounded-lg shadow-sm p-3 hover:shadow-md transition">
                                                <div className="flex items-center space-x-3">
                                                    <div className=" rounded-lg">
                                                        <MdOutlineFilePresent className="w-5 h-5 text-[#6C63FF]" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-800 truncate max-w-[150px]">{doc.name}</p>
                                                        <p className="text-xs text-gray-500">{doc.type.toUpperCase()}, {(doc.size / 1024).toFixed(0)} KB</p>
                                                    </div>
                                                </div>
                                                <a href={doc.url} target="_blank" rel="noopener noreferrer" className="text-[#6C63FF] hover:text-purple-800">
                                                    <MdOutlineFileDownload className="w-5 h-5 text-[#6C63FF]" />
                                                </a>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                            )}

                            {/* Licenses & Certifications */}
                            {selectedUser.licensesAndCertifications &&
                                selectedUser.licensesAndCertifications.length > 0 && (
                                    <div className="bg-[#F7F7F7] p-4 rounded-lg shadow-lg w-[573px] h-[284px]">
                                        {/* Section Title */}
                                        <h3 className="text-lg font-semibold text-[#6C63FF] mb-4">
                                            Licenses & Certificates
                                        </h3>

                                        {/* Grid Layout */}
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            {selectedUser.licensesAndCertifications.map((license, index) => (
                                                <div
                                                    key={index}
                                                    className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition"
                                                >
                                                    {/* Title Row */}
                                                    <div className="flex items-center space-x-2 mb-1">
                                                        <img src={licenseimg} alt="License" className="w-[22px] h-[22px]" />
                                                        <p className="text-sm font-semibold text-gray-900 truncate">
                                                            {license.name}
                                                        </p>
                                                    </div>

                                                    <div className="px-4">
                                                        {/* Issuer */}

                                                        <p className="text-sm text-gray-600 font-bold">{license.issuer}</p>

                                                        {/* Validity */}
                                                        <p className="text-xs text-gray-500 mt-1">
                                                            Valid till: <span className="font-medium">{license.validTill}</span>
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                        </div>

                        {/* Employees */}
                        {selectedUser.employees && selectedUser.employees.length > 0 && (
                            <div className="bg-gradient-to-b from-[#6C63FF] to-[#3B3B98] p-4 rounded-lg shadow-sm w-full         h-[550px]">
                                {/* Header */}
                                <h3 className="text-lg font-semibold text-white mb-4">
                                    Employees
                                </h3>

                                {/* Grid of Employee Cards */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 h-[450px] overflow-y-auto">
                                    {selectedUser.employees.map((employee, index) => (
                                        <div
                                            key={index}
                                            className="bg-white p-4 w-[220px] h-[180px] rounded-lg shadow hover:shadow-md transition mb-4"
                                        >
                                            {/* Access Level Badge */}
                                            <div className="mb-4">
                                                <span
                                                    className={`text-xs font-semibold px-2 py-1 rounded-full ${employee.accessLevel === 'Admin'
                                                        ? 'bg-green-100 text-green-600'
                                                        : employee.accessLevel === 'Editor'
                                                            ? 'bg-yellow-100 text-yellow-600'
                                                            : 'bg-gray-100 text-gray-600'
                                                        }`}
                                                >
                                                    {employee.accessLevel}
                                                </span>
                                            </div>

                                            {/* Employee Avatar and Name */}
                                            <div className="flex items-center space-x-3 mb-2">
                                                <img
                                                    src={employee.logoUrl ? `${baseUrl}/profile/getProfileImage/file/${employee.logoUrl}` : "https://via.placeholder.com/150"}
                                                    alt={employee.name}
                                                    className="w-10 h-10 rounded-full object-cover"
                                                />
                                                <div>
                                                    <p className="text-sm font-semibold text-gray-900">

                                                        {employee.name}
                                                    </p>
                                                    <p className="text-xs text-gray-600">
                                                        {employee.jobTitle}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Contact Info */}
                                            <div className="space-y-1">
                                                <div className="flex items-center text-sm text-[#6C63FF]"   >
                                                    <MdOutlineEmail className="w-4 h-4 px-1" />
                                                    <span className="truncate">{employee.email}</span>
                                                </div>
                                                <div className="flex items-center text-sm text-[#6C63FF]">
                                                    <MdOutlinePhone className="w-4 h-4 px-1" />
                                                    <span>{employee.phone}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}




                        {/* Actions */}
                        <div className="flex justify-end space-x-3 pt-4 border-t">
                            <button
                                onClick={() => handleUserBlockToggle(selectedUser._id, selectedUser.blocked || false)}
                                className={`px-4 py-2 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98] ${selectedUser.blocked
                                    ? 'bg-green-600 text-white hover:bg-green-700'
                                    : 'bg-red-600 text-white hover:bg-red-700'
                                    }`}
                                title={selectedUser.blocked ? "Unblock this user" : "Block this user"}
                            >
                                {selectedUser.blocked ? 'Unblock User' : 'Block User'}
                            </button>
                            <button
                                onClick={() => setViewUserModal(false)}
                                className="px-4 py-2 border border-[#4B5563] rounded-lg text-[#111827] hover:bg-[#F8FAFC] transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98]"
                                title="Close user details modal"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );

    const SupportViewModal = () => {
        const [showConversation, setShowConversation] = useState(false);

        return (
            <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-lg flex items-center justify-center z-50" onClick={handleModalBackdropClick}>
                <div className="bg-white rounded-lg p-6 max-w-6xl w-full mx-4 max-h-[90vh] overflow-y-auto border border-[#E5E7EB]">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-semibold text-gray-900">Support Ticket Details</h2>
                        <button
                            onClick={() => setViewSupportModal(false)}
                            className="text-gray-500 hover:text-gray-700 transition-all duration-200 hover:scale-110"
                            title="Close support ticket details modal"
                        >
                            <MdOutlineClose className="w-6 h-6" />
                        </button>
                    </div>
                    {selectedSupport && (
                        <div className="space-y-6 bg-white rounded-lg">

                            {/* Basic Information */}
                            <div className="bg-[#F7F7F7] p-4 rounded-lg">


                                <div className="flex flex-row justify-between gap-2 w-full ">
                                    <div>
                                        Basic Information
                                        <div className="mt-4 flex flex-row gap-2">
                                            <img src={selectedSupport.logoUrl ? `${baseUrl}/profile/getProfileImage/file/${selectedSupport.logoUrl}` : "https://via.placeholder.com/150"} alt="User" className="w-[120px] h-[120px] rounded-lg object-cover border border-[#E5E7EB]" />
                                            <div className="flex flex-col p-2">
                                                <p className='text-2xl font-bold'>{selectedSupport.companyName}</p>
                                                <div className='flex flex-row gap-4'>
                                                    <div className='flex flex-col gap-2'>
                                                        <p className='text-[#6B7280]'>Status</p>
                                                        <span className={`inline-flex px-2 py-1 text-xs rounded-full ${getStatusColor(selectedSupport.status)}`}>
                                                            {selectedSupport.status}
                                                        </span>
                                                    </div>
                                                    <div className='flex flex-col gap-2'>
                                                        <p className='text-[#6B7280]'>Priority</p>
                                                        <span className={`inline-flex px-2 py-1 text-xs rounded-full ${getPriorityColor(selectedSupport.priority)}`}>
                                                            {selectedSupport.priority}
                                                        </span>
                                                    </div>
                                                    <div className='flex flex-col gap-2'>
                                                        <p className='text-[#6B7280]'>Plan Name</p>
                                                        <span className={`inline-flex px-2 py-1 text-xs rounded-full ${getStatusColor(selectedSupport.plan_name)}`}>
                                                            {selectedSupport.plan_name}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                    <div className="flex flex-col gap-4">
                                        <div className="flex flex-col items-end">
                                            <p className="text-[#6B7280] text-sm">Created At</p>
                                            <p className="text-gray-900 font-mono">
                                                {new Date(selectedSupport.createdAt).toLocaleString('en-US', {
                                                    month: 'short',
                                                    day: 'numeric',
                                                    year: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                    hour12: true
                                                })}
                                            </p>
                                        </div>

                                        <div className="flex flex-col items-end">
                                            <p className="text-[#6B7280] text-sm">Last Updated</p>
                                            <p className="text-gray-900 font-mono">
                                                {new Date(selectedSupport.updatedAt).toLocaleString('en-US', {
                                                    month: 'short',
                                                    day: 'numeric',
                                                    year: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                    hour12: true
                                                })}
                                            </p>
                                        </div>
                                    </div>




                                </div>


                                <div className="mt-4">
                                    <div className="flex flex-row gap-4">

                                        <div className="flex flex-col gap-2">
                                            <label className="block text-sm font-medium text-[#6B7280] mb-1">Ticket ID</label>
                                            <p className="text-gray-900 font-mono">{selectedSupport._id}</p>
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <label className="block text-sm font-medium text-[#6B7280] mb-1">User ID</label>
                                            <p className="text-gray-900 font-mono">{selectedSupport.userId}</p>
                                        </div>

                                    </div>


                                    <div className="flex flex-row gap-4 mt-4">
                                        <div className="flex flex-col gap-2">
                                            <label className="block text-sm font-medium text-[#6B7280] mb-1">Category</label>
                                            <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(selectedSupport.category)}`}>
                                                {selectedSupport.category}
                                            </span>
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <label className="block text-sm font-medium text-[#6B7280] mb-1">Sub Category</label>
                                            <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(selectedSupport.subCategory)}`}>
                                                {selectedSupport.subCategory}
                                            </span>
                                        </div>
                                    </div>
                                </div>


                                <div className="mt-4">
                                    {selectedSupport.description && (

                                        <div className="flex flex-col">
                                            <h3 className="text-sm font-medium text-[#6B7280] mb-3">Description</h3>
                                            <p className="text-gray-700 whitespace-pre-line">{selectedSupport.description || 'No description provided'}</p>
                                        </div>
                                    )}
                                </div>

                                <div className="mt-4">
                                    {selectedSupport.attachments && selectedSupport.attachments.length > 0 && (
                                        <div className="flex flex-col">
                                            <h3 className="text-sm font-medium text-[#6B7280] mb-3">Attachments</h3>
                                            <div className="flex flex-row gap-2">
                                                {selectedSupport.attachments.map((attachment, index) => (
                                                    <div
                                                        key={index}
                                                        className="border border-[#4B5563] rounded-lg p-3 bg-gradient-to-b from-[#6C63FF] to-[#3F73BD]"
                                                    >
                                                        <div className="space-y-2">
                                                            <a
                                                                href={`${baseUrl}/image/get_image_by_id/${attachment.fileUrl}`}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="text-white  hover:underline text-sm"
                                                            >
                                                                View Attachment
                                                            </a>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>


                            </div>




                            {/* Resolved Description */}
                            <div className={`${selectedSupport.status === "Completed" ? 'opacity-70' : ''} bg-gradient-to-b from-[#413B99] to-[#6C63FF] border border-emerald-100 p-4 rounded-lg shadow-sm ${selectedSupport.status === "Completed" ? 'mt-4' : ''}`}>
                                <h3 className="text-lg font-medium text-white mb-3">Resolved Description</h3>
                                <div>
                                    <label className="block text-sm text-[#B6B6B6] font-medium text-white mb-2">Resolution Details</label>
                                    <textarea
                                        ref={supportResolvedDescriptionRef}
                                        placeholder="Describe How The Issue Was Resolved..."
                                        className={`${selectedSupport.status === "Completed" ? 'bg-white' : 'bg-white'} w-full text-black p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-[#6C63FF] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200`}
                                        rows="3"
                                        disabled={selectedSupport.status === "Completed"}
                                        defaultValue={selectedSupport.resolvedDescription || ''}
                                        title={selectedSupport.status === "Completed" ? "Resolved description (read-only for completed tickets)" : "Describe how the issue was resolved"}
                                    />
                                    {selectedSupport.status === "Completed" && (
                                        <p className="text-sm text-white mt-1">This field is read-only for completed tickets.</p>
                                    )}
                                </div>
                            </div>

                            {/* Conversation Interface */}
                            <div className={`${selectedSupport.status === "Completed" ? 'opacity-70' : ''} bg-gradient-to-b from-[#413B99] to-[#6C63FF] border border-purple-100 p-4 rounded-lg shadow-sm`}>
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-medium text-white">Conversation</h3>
                                    <button
                                        onClick={() => {
                                            setShowConversation(!showConversation);
                                        }}
                                        className="text-sm text-white hover:text-white font-medium flex items-center gap-1"
                                    >
                                        {showConversation ? 'Hide Conversation' : 'View Conversation'}
                                        <svg
                                            className={`w-4 h-4 transition-transform ${showConversation ? 'rotate-180' : ''}`}
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                </div>

                                {/* Collapsible Conversation Section */}
                                {showConversation && (
                                    <>
                                        {/* Display existing conversation */}

                                        <div className="mb-4 bg-white rounded-lg p-4 max-h-64 overflow-y-auto space-y-3">
                                            {/* Combined Messages Sorted by Timestamp */}
                                            {(() => {
                                                const allMessages = [];

                                                // Add user messages with type indicator
                                                if (selectedSupport.userMessages && selectedSupport.userMessages.length > 0) {
                                                    selectedSupport.userMessages.forEach(msg => {
                                                        allMessages.push({
                                                            ...msg,
                                                            type: 'user',
                                                            timestamp: new Date(msg.createdAt || msg.created_at || Date.now()).getTime()
                                                        });
                                                    });
                                                }

                                                // Add admin messages with type indicator
                                                if (selectedSupport.adminMessages && selectedSupport.adminMessages.length > 0) {
                                                    selectedSupport.adminMessages.forEach(msg => {
                                                        allMessages.push({
                                                            ...msg,
                                                            type: 'admin',
                                                            timestamp: new Date(msg.createdAt || msg.created_at || Date.now()).getTime()
                                                        });
                                                    });
                                                }

                                                // Sort all messages by timestamp
                                                allMessages.sort((a, b) => a.timestamp - b.timestamp);

                                                return allMessages.length > 0 ? (
                                                    <div className="space-y-2">
                                                        {allMessages.map((msg, index) => (
                                                            <div key={index} className={`flex ${msg.type === 'user' ? 'justify-start' : 'justify-end'}`}>
                                                                <div className={`rounded-lg p-3 max-w-xs lg:max-w-md ${msg.type === 'user'
                                                                    ? 'bg-blue-100'
                                                                    : 'bg-green-100'
                                                                    }`}>
                                                                    <div className={`text-sm ${msg.type === 'user'
                                                                        ? 'text-blue-900'
                                                                        : 'text-green-900'
                                                                        }`}>
                                                                        {msg.message}
                                                                    </div>
                                                                    <div className={`text-xs mt-1 ${msg.type === 'user'
                                                                        ? 'text-blue-600'
                                                                        : 'text-green-600'
                                                                        }`}>
                                                                        {new Date(msg.createdAt || msg.created_at || Date.now()).toLocaleString()}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : null;
                                            })()}

                                            {(!selectedSupport.userMessages || selectedSupport.userMessages.length === 0) &&
                                                (!selectedSupport.adminMessages || selectedSupport.adminMessages.length === 0) && (
                                                    <div className="text-center text-gray-500 text-sm py-4">
                                                        No messages yet. Start the conversation below.
                                                    </div>
                                                )}
                                        </div>

                                        {/* Add Message Input Field */}
                                        <div className="bg-white rounded-lg p-4 border-t border-purple-200 pt-4">
                                            <textarea
                                                ref={adminMessageRef}
                                                placeholder="Enter Your Message..."
                                                className="w-full rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-[#6C63FF] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                                                rows="3"
                                                disabled={selectedSupport.status === 'Completed'}
                                                title={selectedSupport.status === 'Completed' ? "Cannot send message to completed ticket" : "Enter your admin message here"}
                                            />

                                            {/* Add Message Button in Conversation Area */}
                                            <div className="flex justify-end">
                                                <button
                                                    onClick={() => {
                                                        if (adminMessageRef.current && adminMessageRef.current.value.trim()) {
                                                            handleAddMessage(selectedSupport._id);
                                                        } else {
                                                            toast.warning('Please enter an admin message');
                                                        }
                                                    }}
                                                    disabled={selectedSupport.status === 'Completed'}
                                                    className="w-[#70px] px-4 py-2 bg-gradient-to-b from-[#6C63FF] to-[#3F73BD] text-white rounded-lg hover:bg-purple-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                                    title={selectedSupport.status === 'Completed' ? "Cannot send message to completed ticket" : "Send admin message to support ticket"}
                                                >
                                                    Send
                                                </button>
                                            </div>

                                        </div>


                                    </>
                                )}
                            </div>

                            {/* Action Buttons */}
                            <div className="flex justify-between items-center pt-4 gap-4">
                                <div className="flex space-x-2">

                                    <button
                                        onClick={() => {
                                            setViewSupportModal(false);
                                            // Clear admin message when closing
                                            if (adminMessageRef.current) {
                                                adminMessageRef.current.value = '';
                                            }
                                            // Clear resolved description when closing
                                            if (supportResolvedDescriptionRef.current) {
                                                supportResolvedDescriptionRef.current.value = '';
                                            }

                                        }}
                                        className="px-4 py-2 border border-[#4B5563] rounded-lg text-[#111827] hover:bg-[#F8FAFC] transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98]"
                                        title="Close support ticket details modal"
                                    >
                                        Close
                                    </button>
                                </div>
                                <button
                                    onClick={() => {
                                        if (supportResolvedDescriptionRef.current.value.trim()) {
                                            handleSupportStatusUpdate(selectedSupport._id, 'Completed');
                                        } else {
                                            toast.warning('Please enter a resolving description for the ticket');
                                        }
                                    }}
                                    disabled={selectedSupport.status === 'Completed'}
                                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {selectedSupport.status === 'Completed' ? 'Already Resolved' : 'Resolve Ticket'}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    // Invoice utility functions
    const downloadInvoiceAsPDF = async (data) => {
        try {
            // Create a temporary div for the invoice content
            const invoiceDiv = document.createElement('div');
            invoiceDiv.innerHTML = `
                <div style="font-family: Arial, sans-serif; padding: 40px; max-width: 800px; margin: 0 auto;">
                    <div style="display: flex; align-items: center; margin-bottom: 30px; border-bottom: 2px solid #2563eb; padding-bottom: 20px;">
                        <img src="/logo_1.png" alt="Company Logo" style="width: 180px; height: 72px; margin-right: 20px;">
                        <div>
                            <h1 style="color: #2563eb; margin: 0; font-size: 28px; font-weight: bold;">RFP2GRANTS</h1>
                            <p style="color: #6b7280; margin: 5px 0 0 0; font-size: 16px;">Professional Proposal Management</p>
                        </div>
                    </div>
                    
                    <h2 style="color: #111827; margin: 30px 0 20px 0; font-size: 24px; border-bottom: 1px solid #e5e7eb; padding-bottom: 10px;">
                        Payment Invoice - ${data.transaction_id}
                    </h2>
                    
                    <div style="margin: 30px 0;">
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px;">
                            <div>
                                <h3 style="color: #374151; margin: 0 0 15px 0; font-size: 18px;">Invoice Details</h3>
                                <div style="margin-bottom: 15px;">
                                    <span style="font-weight: bold; color: #111827;">Transaction ID:</span>
                                    <span style="margin-left: 10px; color: #6b7280;">${data.transaction_id}</span>
                                </div>
                                <div style="margin-bottom: 15px;">
                                
                                    <span style="font-weight: bold; color: #111827;">Subscription Type:</span>
                                    <span style="margin-left: 10px; color: #6b7280;">${data.planName || 'N/A'}</span>
                                </div>
                                <div style="margin-bottom: 15px;">
                                    <span style="font-weight: bold; color: #111827;">Amount:</span>
                                    <span style="margin-left: 10px; color: #6b7280;">$${data.price}</span>
                                </div>
                            </div>
                            <div>
                                <h3 style="color: #374151; margin: 0 0 15px 0; font-size: 18px;">Additional Information</h3>
                                <div style="margin-bottom: 15px;">
                                    <span style="font-weight: bold; color: #111827;">Status:</span>
                                    <span style="margin-left: 10px; color: #6b7280;">${data.status}</span>
                                </div>
                                <div style="margin-bottom: 15px;">
                                    <span style="font-weight: bold; color: #111827;">User ID:</span>
                                    <span style="margin-left: 10px; color: #6b7280;">${data.user_id}</span>
                                </div>
                                <div style="margin-bottom: 15px;">
                                    <span style="font-weight: bold; color: #111827;">Created Date:</span>
                                    <span style="margin-left: 10px; color: #6b7280;">${data.created_at || data.createdAt || 'N/A'}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; margin-top: 30px;">
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <div style="color: #6b7280; font-size: 14px;">
                                Invoice generated on ${new Date().toLocaleDateString()}
                            </div>
                            <div style="text-align: right;">
                                <div style="font-size: 20px; font-weight: bold; color: #111827; margin-bottom: 5px;">
                                    Total Amount: $${data.price}
                                </div>
                                <div style="color: #6b7280; font-size: 14px;">Thank you for your business!</div>
                            </div>
                        </div>
                    </div>
                </div>
            `;

            // Use html2pdf to generate PDF
            const { default: html2pdf } = await import('html2pdf.js');

            const opt = {
                margin: 10,
                filename: `invoice-${data.transaction_id}.pdf`,
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: 2 },
                jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
            };

            await html2pdf().set(opt).from(invoiceDiv).save();

            toast.success('Invoice downloaded successfully!');
        } catch (error) {
            // console.error('Error downloading invoice:', error);
            toast.error('Failed to download invoice. Please try again.');
        }
    };

    const printInvoice = (data) => {
        try {
            // Create a new window for printing
            const printWindow = window.open('', '_blank');
            printWindow.document.write(`
                <!DOCTYPE html>
                <html>
                <head>
                    <title>Invoice - ${data.transaction_id}</title>
                    <style>
                        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
                        .invoice-header { display: flex; align-items: center; margin-bottom: 30px; border-bottom: 2px solid #2563eb; padding-bottom: 20px; }
                        .logo { width: 160px; height: 44px; margin-right: 20px; }
                        .company-name { color: #2563eb; margin: 0; font-size: 28px; font-weight: bold; }
                        .company-tagline { color: #6b7280; margin: 5px 0 0 0; font-size: 16px; }
                        .invoice-title { color: #111827; margin: 30px 0 20px 0; font-size: 24px; border-bottom: 1px solid #e5e7eb; padding-bottom: 10px; }
                        .invoice-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin: 30px 0; }
                        .section-title { color: #374151; margin: 0 0 15px 0; font-size: 18px; }
                        .detail-row { margin-bottom: 15px; }
                        .label { font-weight: bold; color: #111827; }
                        .value { margin-left: 10px; color: #6b7280; }
                        .footer { border-top: 1px solid #e5e7eb; padding-top: 20px; margin-top: 30px; }
                        .footer-content { display: flex; justify-content: space-between; align-items: center; }
                        .total-amount { font-size: 20px; font-weight: bold; color: #111827; margin-bottom: 5px; }
                        .thank-you { color: #6b7280; font-size: 14px; }
                        @media print {
                            body { padding: 0; }
                            .no-print { display: none; }
                        }
                    </style>
                </head>
                <body>
                    <div class="invoice-header">
                        <img src="/logo_1.png" alt="Company Logo" class="logo">
                        <div>
                            <h1 class="company-name">RFP App</h1>
                            <p class="company-tagline">Professional Proposal Management</p>
                        </div>
                    </div>
                    
                    <h2 class="invoice-title">Payment Invoice - ${data.transaction_id}</h2>
                    
                    <div class="invoice-grid">
                        <div>
                            <h3 class="section-title">Invoice Details</h3>
                            <div class="detail-row">
                                <span class="label">Transaction ID:</span>
                                <span class="value">${data.transaction_id}</span>
                            </div>
                            <div class="detail-row">
                                <span class="label">Amount:</span>
                                <span class="value">$${data.price}</span>
                            </div>
                            <div class="detail-row">
                                <span class="label">Subscription Type:</span>
                                <span class="value">${data.planName || 'N/A'}</span>
                            </div>
                            
                        </div>
                        <div>
                            <h3 class="section-title">Additional Information</h3>
                            <div class="detail-row">
                                <span class="label">Status:</span>
                                <span class="value">${data.status}</span>
                            </div>
                            <div class="detail-row">
                                <span class="label">User ID:</span>
                                <span class="value">${data.user_id}</span>
                            </div>
                            <div class="detail-row">
                                <span class="label">Created Date:</span>
                                <span class="value">${data.created_at || data.createdAt || 'N/A'}</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="footer">
                        <div class="footer-content">
                            <div style="color: #6b7280; font-size: 14px;">
                                Invoice generated on ${new Date().toLocaleDateString()}
                            </div>
                            <div style="text-align: right;">
                                <div class="total-amount">Total Amount: $${data.price}</div>
                                <div class="thank-you">Thank you for your business!</div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="no-print" style="text-align: center; margin-top: 30px; padding: 20px;">
                        <button onclick="window.print()" style="padding: 10px 20px; background: #2563eb; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 16px;">
                            Print Invoice
                        </button>
                        <button onclick="window.close()" style="padding: 10px 20px; background: #6b7280; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 16px; margin-left: 10px;">
                            Close
                        </button>
                    </div>
                </body>
                </html>
            `);
            printWindow.document.close();

            toast.success('Invoice opened for printing!');
        } catch (error) {
            // console.error('Error printing invoice:', error);
            toast.error('Failed to open invoice for printing. Please try again.');
        }
    };

    const InlineInvoiceModal = ({ data, isOpen, onClose }) => {
        if (!isOpen || !data) return null;

        const getInvoiceTitle = () => {
            return `Payment Invoice - ${data.transaction_id}`;
        };

        const getInvoiceData = () => {
            // console.log("data", data);
            return [
                { label: 'Transaction ID', value: data.transaction_id },
                { label: 'Amount', value: `$${data.price}` },


                { label: 'Subscription Type', value: data.planName || 'None' },
                { label: 'Status', value: data.status },
                { label: 'User ID', value: data.user_id },
                { label: 'Created Date', value: data.created_at || data.createdAt || 'N/A' }
            ];
        };

        return (
            <tr className="bg-[#F8FAFC]">
                <td colSpan="100%" className="px-4 py-6">
                    <div className="bg-white rounded-lg border border-[#4B5563] p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-[#000000]">{getInvoiceTitle()}</h3>
                            <button
                                onClick={onClose}
                                className="text-[#4B5563] hover:text-[#4B5563] p-1"
                            >
                                <MdOutlineClose className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Logo and Company Header */}
                        <div className="flex items-center mb-6 p-4 bg-gray-50 rounded-lg">
                            <img src="/logo_1.png" alt="Company Logo" className="w-[180px] h-[72px] mr-4" />
                            <div>
                                <h4 className="text-xl font-bold text-[#2563eb]">RFP2GRANTS</h4>
                                <p className="text-sm text-[#6b7280]">Professional Proposal Management</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                            {getInvoiceData().map((item, index) => (
                                <div key={index}>
                                    <label className="block text-sm font-medium text-[#111827] mb-1">
                                        {item.label}
                                    </label>
                                    <p className="text-[#000000]">{item.value}</p>
                                </div>
                            ))}
                        </div>

                        <div className="border-t pt-4">
                            <div className="flex justify-between items-center">
                                <div className="text-sm text-[#4B5563]">
                                    Invoice generated on {new Date().toLocaleDateString()}
                                </div>
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => downloadInvoiceAsPDF(data)}
                                        className="px-4 py-2 bg-gradient-to-b from-[#6C63FF] to-[#3F73BD] text-white rounded-lg  transition-colors flex items-center space-x-2"
                                    >
                                        <MdOutlineFileUpload className="w-4 h-4" />
                                        <span>Download PDF</span>
                                    </button>
                                    <button
                                        onClick={() => printInvoice(data)}
                                        className="px-4 py-2 border border-[#4B5563] text-[#111827] rounded-lg hover:bg-[#F8FAFC] transition-colors flex items-center space-x-2"
                                    >
                                        <MdOutlineDocumentScanner className="w-4 h-4" />
                                        <span>Print</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </td>
            </tr>
        );
    };

    if (role && !isSuperAdmin) {
        return <Navigate to="/unauthorized" replace />;
    }

    if (loading) {
        return <div className="flex justify-center items-center h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>;
    }

    return (
        <div className="min-h-screen bg-[#F8F9FA]">
            <ToastContainer />

            {/* Modals */}
            {viewUserModal && <UserViewModal />}
            {viewSupportModal && <SupportViewModal />}
            <SubscriptionManagementModal
                isOpen={subscriptionModalOpen}
                mode={subscriptionModalMode}
                form={subscriptionForm}
                onChange={handleSubscriptionFormChange}
                onClose={closeSubscriptionModal}
                onSubmit={handleSubscriptionSubmit}
                onDeactivate={(noteValue) => handleSubscriptionDeactivate(selectedSubscriptionRecord, noteValue)}
                loading={subscriptionActionLoading}
                note={subscriptionNote}
                onNoteChange={setSubscriptionNote}
                record={selectedSubscriptionRecord}
                formatSubscriptionExpiry={formatSubscriptionExpiry}
            />



            {/* Mobile Menu Overlay - Only visible on small screens */}
            {showMobileMenu && (
                <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-50">
                    <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg flex flex-col">

                        {/* Header Section */}
                        <div className="p-4 border-b border-[#4B5563] flex items-center justify-between">
                            <div className="w-[180px] h-[72px]">
                                <img src="/logo_1.png" alt="logo" className="w-full h-full" />
                            </div>
                            <button
                                className="p-2 transition-colors"
                                onClick={() => setShowMobileMenu(false)}
                            >
                                <MdOutlineMenu className="w-6 h-6 text-[#4B5563]" />
                            </button>
                        </div>

                        {/* Navigation Section */}
                        <div className="flex-1 overflow-y-auto p-4">
                            <nav className="space-y-2">
                                {/* User Management */}
                                <button
                                    className={`w-full text-left rounded-lg p-3 flex items-center space-x-3 transition-colors ${activeTab === "user-management"
                                        ? "bg-[#2563eb] text-white"
                                        : "text-[#4B5563]"
                                        }`}
                                    onClick={() => {
                                        setActiveTab("user-management");
                                        window.location.hash = "user-management";
                                        closeAllInvoiceRows();
                                        setShowMobileMenu(false);
                                    }}
                                >
                                    <MdOutlineManageAccounts className="w-4 h-4" />
                                    <span className="text-[16px] font-medium">User Management</span>
                                </button>

                                {/* Payments */}
                                <button
                                    className={`w-full text-left rounded-lg p-3 flex items-center space-x-3 transition-colors ${activeTab === "payments"
                                        ? "bg-[#2563eb] text-white"
                                        : "text-[#4B5563]"
                                        }`}
                                    onClick={() => {
                                        setActiveTab("payments");
                                        window.location.hash = "payments";
                                        closeAllInvoiceRows();
                                        setShowMobileMenu(false);
                                    }}
                                >
                                    <MdOutlinePayments className="w-4 h-4" />
                                    <span className="text-[16px] font-medium">Payments</span>
                                </button>

                                {/* Plan Management */}
                                <button
                                    className={`w-full text-left rounded-lg p-3 flex items-center space-x-3 transition-colors ${activeTab === "plan-management"
                                        ? "bg-[#2563eb] text-white"
                                        : "text-[#4B5563]"
                                        }`}
                                    onClick={() => {
                                        setActiveTab("plan-management");
                                        window.location.hash = "plan-management";
                                        closeAllInvoiceRows();
                                        setShowMobileMenu(false);
                                    }}
                                >
                                    <LuCrown className="w-4 h-4" />
                                    <span className="text-[16px] font-medium">Plans & Subscriptions</span>
                                </button>

                                {/* Contact Request */}
                                <button
                                    className={`w-full text-left rounded-lg p-3 flex items-center space-x-3 transition-colors ${activeTab === "contact-request"
                                        ? "bg-[#2563eb] text-white"
                                        : "text-[#4B5563]"
                                        }`}
                                    onClick={() => {
                                        setActiveTab("contact-request");
                                        window.location.hash = "contact-request";
                                        closeAllInvoiceRows();
                                        setShowMobileMenu(false);
                                    }}
                                >
                                    <MdOutlinePermContactCalendar className="w-4 h-4" />
                                    <span className="text-[16px] font-medium">Contact Request</span>
                                </button>

                                {/* Support */}
                                <button
                                    className={`w-full text-left rounded-lg p-3 flex items-center space-x-3 transition-colors ${activeTab === "support"
                                        ? "bg-[#2563eb] text-white"
                                        : "text-[#4B5563]"
                                        }`}
                                    onClick={() => {
                                        setActiveTab("support");
                                        window.location.hash = "support";
                                        closeAllInvoiceRows();
                                        setShowMobileMenu(false);
                                    }}
                                >
                                    <MdOutlineHeadsetMic className="w-4 h-4" />
                                    <span className="text-[16px] font-medium">Support</span>
                                </button>

                                {/* Email Content */}
                                <button
                                    className={`w-full text-left rounded-lg p-3 flex items-center space-x-3 transition-colors ${activeTab === "email-content"
                                        ? "bg-[#2563eb] text-white"
                                        : "text-[#4B5563]"
                                        }`}
                                    onClick={() => {
                                        setActiveTab("email-content");
                                        window.location.hash = "email-content";
                                        closeAllInvoiceRows();
                                        setShowMobileMenu(false);
                                    }}
                                >
                                    <MdOutlineEmail className="w-4 h-4" />
                                    <span className="text-[16px] font-medium">Email Content</span>
                                </button>


                                {/* Website */}
                                <button
                                    className="w-full text-left rounded-lg p-3 flex items-center space-x-3 transition-colors text-[#4B5563] hover:bg-gray-100"
                                    onClick={() => window.open(`${import.meta.env.VITE_APP_BASE_URL}/`, "_blank")}
                                >
                                    <MdLanguage className="w-5 h-5 flex-shrink-0" />
                                    <span className="text-[16px] font-medium">Website</span>
                                </button>

                                {/* Change Password */}
                                <button
                                    onClick={() => navigate('/change-password')}
                                    className="w-full text-left rounded-lg p-3 flex items-center space-x-3 transition-colors text-[#4B5563] hover:bg-gray-100"
                                >
                                    <MdOutlineLock className="w-5 h-5 flex-shrink-0" />
                                    <span className="text-[16px] font-medium">Change Password</span>
                                </button>

                                {/* Logout */}
                                <button
                                    onClick={handleLogout}
                                    className="w-full text-left rounded-lg p-3 flex items-center space-x-3 transition-colors text-[#4B5563] hover:bg-gray-100"
                                >
                                    <MdOutlineLogout className="w-5 h-5 flex-shrink-0" />
                                    <span className="text-[16px] font-medium">Logout</span>
                                </button>
                            </nav>
                        </div>
                    </div>
                </div>
            )}



            <div className="flex h-screen relative ">
                {/* Left Sidebar - Half visible by default, expands on hover */}
                {/* Toggle Hover Feature Button */}

                <div
                    className={`hidden lg:flex w-20 hover:w-64
                            bg-[#2F3349] border-r border-[#0000001A] flex-shrink-0 transition-all duration-300 ease-in-out absolute left-0 top-0 h-full z-20 overflow-hidden group`}
                >
                    <div className="p-4 h-screen flex flex-col justify-between">
                        {/* Top Section */}
                        <div>
                            <div className="hidden group-hover:block w-[180px] h-[72px] mb-4">
                                <img src={"/logo_1.png"} alt="logo" className="w-full h-full" />
                            </div>

                            <nav className="space-y-2">
                                <button
                                    className={`w-full text-left text-white rounded-lg p-3 flex items-center justify-center lg:justify-start space-x-3 transition-colors ${activeTab === 'user-management' ? 'bg-[#6C63FF] text-white' : 'text-white'
                                        }`}
                                    onClick={() => {
                                        setActiveTab('user-management');
                                        window.location.hash = 'user-management';
                                        closeAllInvoiceRows();
                                    }}
                                >
                                    <MdOutlineManageAccounts className="w-5 h-5 flex-shrink-0" />
                                    <span className="text-[16px] font-medium lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300">
                                        User Management
                                    </span>
                                </button>

                                <button
                                    className={`w-full text-left text-white rounded-lg p-3 flex items-center justify-center lg:justify-start space-x-3 transition-colors ${activeTab === 'payments' ? 'bg-[#6C63FF] text-white' : 'text-white'
                                        }`}
                                    onClick={() => {
                                        setActiveTab('payments');
                                        window.location.hash = 'payments';
                                        closeAllInvoiceRows();
                                    }}
                                >
                                    <MdOutlinePayments className="w-5 h-5 flex-shrink-0" />
                                    <span className="text-[16px] font-medium lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300">
                                        Payments
                                    </span>
                                </button>

                                <button
                                    className={`w-full text-left text-white rounded-lg p-3 flex items-center justify-center lg:justify-start space-x-3 transition-colors ${activeTab === 'plan-management' ? 'bg-[#6C63FF] text-white' : 'text-white'
                                        }`}
                                    onClick={() => {
                                        setActiveTab('plan-management');
                                        window.location.hash = 'plan-management';
                                        closeAllInvoiceRows();
                                    }}
                                >
                                    <LuCrown className="w-5 h-5 flex-shrink-0" />
                                    <span className="text-[16px] font-medium lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300">
                                        Plans & Subscriptions
                                    </span>
                                </button>

                                <button
                                    className={`w-full text-left text-white rounded-lg p-3 flex items-center justify-center lg:justify-start space-x-3 transition-colors ${activeTab === 'contact-request' ? 'bg-[#6C63FF] text-white' : 'text-white'
                                        }`}
                                    onClick={() => {
                                        setActiveTab('contact-request');
                                        window.location.hash = 'contact-request';
                                        closeAllInvoiceRows();
                                    }}
                                >
                                    <MdOutlinePermContactCalendar className="w-5 h-5 flex-shrink-0" />
                                    <span className="text-[16px] font-medium lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300">
                                        Contact Request
                                    </span>
                                </button>

                                <button
                                    className={`w-full text-left text-white rounded-lg p-3 flex items-center justify-center lg:justify-start space-x-3 transition-colors ${activeTab === 'support' ? 'bg-[#6C63FF] text-white' : 'text-white'
                                        }`}
                                    onClick={() => {
                                        setActiveTab('support');
                                        window.location.hash = 'support';
                                        closeAllInvoiceRows();
                                    }}
                                >
                                    <MdOutlineHeadsetMic className="w-5 h-5 flex-shrink-0" />
                                    <span className="text-[16px] font-medium lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300">
                                        Support
                                    </span>
                                </button>

                                <button
                                    className={`w-full text-left text-white rounded-lg p-3 flex items-center justify-center lg:justify-start space-x-3 transition-colors ${activeTab === 'email-content' ? 'bg-[#6C63FF] text-white' : 'text-white'
                                        }`}
                                    onClick={() => {
                                        setActiveTab('email-content');
                                        window.location.hash = 'email-content';
                                        closeAllInvoiceRows();
                                    }}
                                >
                                    <MdOutlineEmail className="w-5 h-5 flex-shrink-0" />
                                    <span className="text-[16px] font-medium lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300">
                                        Email Content
                                    </span>
                                </button>
                            </nav>
                        </div>

                        {/* Bottom Section */}
                        <nav className="text-white py-2">
                            <div className="flex flex-col items-center justify-center">
                                <button
                                    className="w-full text-left text-white rounded-lg p-3 flex items-center justify-center lg:justify-start space-x-3 transition-colors "
                                >

                                    <MdLanguage className="w-5 h-5 flex-shrink-0" />
                                    <span className="text-[16px] font-medium lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300">
                                        <a href={`${import.meta.env.VITE_APP_BASE_URL}/`} target="_blank" rel="noopener noreferrer">Website</a>

                                    </span>
                                </button>
                                <button
                                    onClick={() => navigate('/change-password')}
                                    className="w-full text-left text-white rounded-lg p-3 flex items-center justify-center lg:justify-start space-x-3 transition-colors "
                                >
                                    <MdOutlineLock className="w-5 h-5 flex-shrink-0" />
                                    <span className="text-[16px] font-medium lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300">
                                        Change Password
                                    </span>
                                </button>
                                <button
                                    onClick={() => handleLogout()}
                                    className="w-full text-left text-white rounded-lg p-3 flex items-center justify-center lg:justify-start space-x-3 transition-colors "
                                >
                                    <MdOutlineLogout className="w-5 h-5 flex-shrink-0" />
                                    <span className="text-[16px] font-medium lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300">
                                        Logout
                                    </span>
                                </button>
                            </div>


                        </nav>
                    </div>
                </div>

                {/* Main Content */}
                <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ease-in-out lg:ml-20`}>
                    {/* Scrollable Content Area */}

                    {/* Top Header Bar */}
                    <div className="bg-gray px-2 py-2">
                        <div className="flex items-center justify-between bg-gradient-to-r from-[#2F3349] to-[#717AAF] border rounded-lg pr-2 py-2">
                            <div className="flex items-center space-x-6">
                                {/* Mobile Menu Button - Only visible on small screens */}
                                <button
                                    className="lg:hidden p-2 transition-colors"
                                    onClick={() => setShowMobileMenu(!showMobileMenu)}
                                >
                                    <MdOutlineMenu className="w-6 h-6 text-[#4B5563]" />
                                </button>

                                <div className="flex items-center">
                                    <div className="w-full h-8 rounded-lg flex items-center justify-center mr-3">
                                        <span className="text-white font-bold text-lg">{activeTab === 'user-management' ? 'User Management' : activeTab === 'payments' ? 'Payments' : activeTab === 'plan-management' ? (planManagementInnerTab === 'plan' ? 'Plan Management' : planManagementInnerTab === 'subscription' ? 'Subscription Management' : 'Add-On Management') : activeTab === 'contact-request' ? 'Contact Request' : activeTab === 'support' ? 'Support' : activeTab === 'notifications' ? 'Notifications' : activeTab === 'email-content' ? (emailContentInnerTab === 'templates' ? 'Email Templates' : 'Custom Email') : 'Contact Request'}</span>

                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center space-x-4">
                                <button className="p-2 transition-all duration-200 hover:scale-110 relative shadow-md hover:shadow-lg"
                                    onClick={() => {
                                        let newTab;
                                        if (activeTab === 'notifications') {
                                            // Restore previous tab when clicking notifications again
                                            newTab = previousTab;
                                            setActiveTab(previousTab);
                                        } else {
                                            // Save current tab before switching to notifications
                                            setPreviousTab(activeTab);
                                            newTab = 'notifications';
                                            setActiveTab('notifications');
                                        }
                                        window.location.hash = newTab;
                                        closeAllInvoiceRows();
                                    }}
                                    title={activeTab === 'notifications' ? `Switch to ${previousTab === 'user-management' ? 'User Management' : previousTab === 'payments' ? 'Payments' : previousTab === 'plan-management' ? 'Plan Management' : previousTab === 'support' ? 'Support' : previousTab === 'contact-request' ? 'Contact Request' : previousTab === 'email-content' ? 'Email Content' : 'User Management'}` : "Switch to Notifications"}
                                >
                                    <MdOutlineNotifications className="relative w-6 h-6 text-white" />
                                    {notificationsData.length > 0 && (
                                        <span className="absolute top-[1px] right-2 w-2 h-2 bg-red-500 rounded-full" title={`${notificationsData.length} unread notification(s)`}></span>
                                    )}
                                </button>
                                {/* <div className="w-8 h-8 bg-[#2563eb] rounded-full flex items-center justify-center transition-colors cursor-pointer">
                                    <MdOutlinePerson className="w-5 h-5 text-white" />
                                </div> */}
                            </div>
                        </div>
                    </div>



                    <div className="flex-1 overflow-y-auto">
                        <div className="p-6 min-h-full">
                            {/* Content based on active tab */}
                            {activeTab === 'user-management' && renderUserManagement()}
                            {activeTab === 'payments' && renderPayments()}
                            {activeTab === 'plan-management' && renderPlanManagement()}
                            {activeTab === 'support' && renderSupport()}
                            {activeTab === 'notifications' && renderNotifications()}
                            {activeTab === 'contact-request' && renderContactRequest()}
                            {activeTab === 'email-content' && renderEmailContent()}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SuperAdmin;