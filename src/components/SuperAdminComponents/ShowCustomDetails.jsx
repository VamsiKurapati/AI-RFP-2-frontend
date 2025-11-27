import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  MdOutlineSearch,
  MdOutlineFilterList,
  MdOutlineFileUpload,
  MdOutlineVisibility,
} from "react-icons/md";
import Swal from "sweetalert2";
import { validateNumberInput } from "../../utils/sanitization";

const baseUrl = `${import.meta.env.VITE_API_BASE_URL}`;

const ShowCustomDetails = () => {
  const [customPlans, setCustomPlans] = useState([]);
  const [filteredPlans, setFilteredPlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterModal, setFilterModal] = useState(false);
  const [openDetails, setOpenDetails] = useState(null);
  const [customToggle, setCustomToggle] = useState(false);
  const [selectedPlanType, setSelectedPlanType] = useState("");
  const [transaction_id, setTransaction_id] = useState(null);
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editablePayment, setEditablePayment] = useState(null);


  const [editFormData, setEditFormData] = useState(
    {
      email: "",
      price: "",
      planType: "",
      maxEditors: "",
      maxViewers: "",
      maxRFPProposalGenerations: "",
      maxGrantProposalGenerations: "",
    }
  );
  const [isFormDataEditing, setIsFormDataEditing] = useState(false);

  const editFormDataPlan = async (id, editFormData) => {
    try {
      const response = await axios.put(`${baseUrl}/admin/editCustomPlan/${id}`, editFormData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      Swal.fire({
        title: "Custom plan updated successfully",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
        showCancelButton: false,
      });
      setCustomPlans(customPlans.map((plan) => plan._id === id ? response.data : plan));
      setFilteredPlans(filteredPlans.map((plan) => plan._id === id ? response.data : plan));
      setIsFormDataEditing(false);
      setEditFormData(null);
    } catch (error) {
      // console.error("Error editing custom plan:", error);
      Swal.fire({
        title: "Failed to edit custom plan",
        icon: "error",
        timer: 1500,
        showConfirmButton: false,
        showCancelButton: false,
      });
      throw error;
    }
  };

  const handleCancelEditFormData = () => {
    setIsFormDataEditing(false);
    setEditFormData(null);
  };






  const handleCustomDelete = (id) => {
    axios.delete(`${baseUrl}/admin/deleteCustomPlan/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }).then(() => {
      Swal.fire({
        title: "Custom plan deleted successfully",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
        showCancelButton: false,
      });
      setCustomPlans(customPlans.filter((plan) => plan._id !== id));
      setFilteredPlans(filteredPlans.filter((plan) => plan._id !== id));
    }).catch((error) => {
      Swal.fire({
        title: "Failed to delete custom plan",
        icon: "error",
        timer: 1500,
        showConfirmButton: false,
        showCancelButton: false,
      });
      // console.error(error);
      Swal.fire({
        title: "Failed to delete custom plan",
        icon: "error",
        timer: 1500,
        showConfirmButton: false,
        showCancelButton: false,
      });
    });
  }

  const [formData, setFormData] = useState({
    email: "",
    price: "",
    planType: "",
    maxEditors: "",
    maxViewers: "",
    maxRFPProposalGenerations: "",
    maxGrantProposalGenerations: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Validate number inputs to prevent negatives and null
    const isNumberField = ['maxEditors', 'maxViewers', 'maxRFPProposalGenerations', 'maxGrantProposalGenerations', 'price'].includes(name);
    const validatedValue = isNumberField ? validateNumberInput(value, name !== 'price') : value;
    
    setFormData((prev) => ({
      ...prev,
      [name]: validatedValue,
    }));
  };

  const handleCustomSubmit = (e) => {
    e.preventDefault();
    // Check if any form details are missing
    const requiredFields = [
      "email",
      "price",
      "planType",
      "maxEditors",
      "maxViewers",
      "maxRFPProposalGenerations",
      "maxGrantProposalGenerations",
    ];
    for (let field of requiredFields) {
      if (!formData[field] || formData[field].toString().trim() === "") {
        Swal.fire({
          title: "Please fill in all the fields before submitting.",
          icon: "error",
          timer: 1500,
          showConfirmButton: false,
          showCancelButton: false,
        });
        return;
      }
    }
    setLoading(true);
    axios
      .post(`${baseUrl}/admin/updateSubscriptionPlanCustom`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then(() => {
        Swal.fire({
          title: "Your request has been sent successfully!",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
          showCancelButton: false,
        });
        setFormData({
          email: "",
          price: "",
          planType: "",
          maxEditors: "",
          maxViewers: "",
          maxRFPProposalGenerations: "",
          maxGrantProposalGenerations: "",
        });
        setCustomToggle(false);
      })
      .catch((error) => {
        Swal.fire({
          title: "Failed to send request. Please try again.",
          icon: "error",
          timer: 1500,
          showConfirmButton: false,
          showCancelButton: false,
        });
        // console.error(error);
        Swal.fire({
          title: "Failed to send request. Please try again.",
          icon: "error",
          timer: 1500,
          showConfirmButton: false,
          showCancelButton: false,
        });
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    const fetchCustomPlans = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${baseUrl}/admin/getCustomPlanData`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        // console.log(response.data);
        setCustomPlans(response.data);
        setFilteredPlans(response.data);
      } catch (err) {
        setError(err);
        Swal.fire({
          title: "Failed to fetch custom plans",
          icon: "error",
          timer: 1500,
          showConfirmButton: false,
          showCancelButton: false,
        });
      } finally {
        setLoading(false);
      }
    };

    const fetchPaymentdetails = async () => {
      const response = await axios.get(`${baseUrl}/admin/getPaymentDetails`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setPaymentDetails(response.data[0]);
      // console.log("Payment Details", response.data);
    };

    fetchPaymentdetails();

    fetchCustomPlans();
  }, []);

  // Combine search term and plan type filter
  const applyFilters = (plans, term, planType) => {
    const t = term.trim().toLowerCase();
    return plans.filter((plan) => {
      const matchesSearch =
        !t ||
        plan.companyName?.toLowerCase().includes(t) ||
        plan.email?.toLowerCase().includes(t);
      const matchesType = !planType || plan.planType === planType;
      return matchesSearch && matchesType;
    });
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    setFilteredPlans(applyFilters(customPlans, term, selectedPlanType));
  };

  const handlePlanTypeChange = (type) => {
    setSelectedPlanType(type);
    setFilteredPlans(applyFilters(customPlans, searchTerm, type));
  };

  const handleExport = () => {
    const csvContent = [
      ["Company", "Email", "Plan Type", "Amount", "Max Editors", "Max Viewers", "Max RFP Proposal Generations", "Max Grant Proposal Generations"].join(","),
      ...filteredPlans.map((plan) =>
        [plan.companyName, plan.email, plan.planType, plan.price, plan.maxEditors, plan.maxViewers, plan.maxRFPProposalGenerations, plan.maxGrantProposalGenerations].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "custom-plans.csv";
    link.click();
  };


  const handleCustomSubmitfinal = (
    id,
    email,
    price,
    planType,
    maxEditors,
    maxViewers,
    maxRFPProposalGenerations,
    maxGrantProposalGenerations,
    transaction_id,  //transaction_id
    companyName
  ) => {
    const payload = {
      email,
      price,
      planType,
      maxEditors,
      maxViewers,
      maxRFPProposalGenerations,
      maxGrantProposalGenerations,
      transaction_id,
      companyName,
    };

    setLoading(true);
    axios
      .post(`${baseUrl}/admin/createCustomPlan`, payload, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then(() => {
        Swal.fire({
          title: "Custom plan submitted successfully!",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
          showCancelButton: false,
        });
        setCustomToggle(false);
      })
      .catch((error) => {
        Swal.fire({
          title: "Failed to submit custom plan",
          icon: "error",
          timer: 1500,
          showConfirmButton: false,
          showCancelButton: false,
        });
        // console.error(error);
        Swal.fire({
          title: "Failed to submit custom plan",
          icon: "error",
          timer: 1500,
          showConfirmButton: false,
          showCancelButton: false,
        });
      })
      .finally(() => setLoading(false));
  };

  // Enable edit mode
  const handleStartEdit = () => {
    setEditablePayment({ ...paymentDetails }); // make a copy
    setIsEditing(true);
  };

  // Cancel edit mode
  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditablePayment(null);
  };

  // Handle input change
  const handlePaymentChange = (e) => {
    const { name, value } = e.target;
    setEditablePayment((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Submit edit
  const handleSubmitEdit = (id) => {
    axios
      .put(
        `${baseUrl}/admin/editPaymentDetails/${id}`,
        editablePayment,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      )
      .then((response) => {
        setPaymentDetails(response.data);
        setIsEditing(false);
        Swal.fire({
          title: "Payment details updated successfully!",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
          showCancelButton: false,
        });
      })
      .catch((error) => {
        Swal.fire({
          title: "Failed to update payment details",
          icon: "error",
          timer: 1500,
          showConfirmButton: false,
          showCancelButton: false,
        });
        // console.error(error);
        Swal.fire({
          title: "Failed to update payment details",
          icon: "error",
          timer: 1500,
          showConfirmButton: false,
          showCancelButton: false,
        });
      });
  };


  return (
    <div className="p-6">
      {/* Search and Filter Bar */}
      <div className="mb-6 py-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            {/* Search */}
            <div className="relative">
              <MdOutlineSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#9CA3AF] w-5 h-5" />
              <input
                type="text"
                placeholder="Search By Company Or Email"
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10 pr-4 py-2 border border-[#E5E7EB] rounded-lg focus:ring-2 focus:ring-[#6C63FF] focus:border-transparent w-[530px] text-[#374151] placeholder-[#9CA3AF] bg-white"
              />
            </div>

            {/* Filter */}
            <div className="relative">
              <button
                className="bg-white flex items-center justify-center space-x-2 px-4 py-2 border border-[#E5E7EB] rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98] w-full sm:w-auto"
                onClick={() => setFilterModal(!filterModal)}
                title="Filter custom plans by plan type"
              >
                <MdOutlineFilterList className="w-5 h-5" />
                <span className="text-[16px] text-[#9CA3AF]">Filter</span>
              </button>
              {filterModal && (
                <div className="absolute top-10 left-0 w-64 bg-white rounded-lg shadow-lg p-2 flex flex-col gap-2 z-50 border border-[#E5E7EB]">
                  <select
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value === "") {
                        setFilteredPlans(customPlans); // reset
                      } else {
                        setFilteredPlans(
                          customPlans.filter((plan) => plan.planType === value)
                        );
                      }
                    }}
                    className="w-full border rounded-lg px-3 py-2 mt-1 text-gray-700 focus:ring-2 focus:ring-blue-400 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Select plan type to filter"
                  >
                    <option value="">Select Plan Type</option>
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                  <button
                    onClick={() => {
                      setFilteredPlans(customPlans);
                      setFilterModal(false);
                    }}
                    className="text-left px-4 py-2 hover:bg-gray-100 rounded transition-colors duration-200"
                    title="Clear all filters"
                  >
                    Clear Filters
                  </button>
                </div>
              )}
            </div>

          </div>

          {/* Add Custom Plan Button */}
          <div className="flex justify-end">
            <button
              onClick={() => setCustomToggle(true)}
              className="px-4 py-2 bg-gradient-to-b from-[#6C63FF] to-[#3F73BD] text-white rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98] hover:bg-green-600"
              title="Add a new custom plan"
            >
              + Add
            </button>
          </div>

          {/* Export Button */}
          <div className="flex items-center justify-center sm:justify-end">
            <button
              onClick={handleExport}
              className="flex items-center justify-center space-x-2 px-4 py-2 bg-gradient-to-b from-[#6C63FF] to-[#3F73BD] text-white rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98] w-full sm:w-auto"
              title="Export custom plans data to CSV"
            >
              <MdOutlineFileUpload className="w-5 h-5" />
              <span className="text-[16px] text-white">Export</span>
            </button>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white border border-[#E5E7EB] mb-6 overflow-x-auto rounded-2xl">
        <table className="w-full rounded-2xl">
          <thead className="bg-[#F8F8FF] border-b border-[#0000001A]">
            <tr>
              <th className="p-4 text-left text-[16px] font-medium text-[#4B5563]">
                CompanyName
              </th>
              <th className="p-4 text-left text-[16px] font-medium text-[#4B5563]">
                Email
              </th>
              <th className="p-4 text-left text-[16px] font-medium text-[#4B5563]">
                Plan Type
              </th>
              <th className="p-4 text-left text-[16px] font-medium text-[#4B5563]">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} className="p-4 text-center text-gray-500">
                  Loading...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={4} className="p-4 text-center text-red-500">
                  Error: {error.message}
                </td>
              </tr>
            ) : filteredPlans.length > 0 ? (
              filteredPlans.map((plan) => (
                <React.Fragment key={plan._id}>
                  <tr className="hover:bg-[#F8FAFC] transition-colors">
                    <td className="p-4 text-[16px] text-[#4B5563]">
                      {plan.companyName}
                    </td>
                    <td className="p-4 text-[16px] text-[#4B5563]">
                      {plan.email}
                    </td>
                    <td className="p-4 text-[16px] text-[#6C63FF]">
                      {plan.planType}
                    </td>
                    <td className="p-4">
                      <button
                        className="p-2 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center hover:bg-blue-50"
                        onClick={() =>
                          setOpenDetails(
                            openDetails === plan._id ? null : plan._id
                          )
                        }
                        title={openDetails === plan._id ? "Hide details" : "View plan details"}
                      >
                        <MdOutlineVisibility className="w-5 h-5 text-[#6C63FF]" />
                      </button>
                    </td>
                  </tr>
                  {openDetails === plan._id && (
                    <tr>
                      <td colSpan={4} className="bg-white p-6 shadow rounded-lg">
                        {/* Header */}
                        <div className="mb-4">
                          <h2 className="text-lg font-semibold text-gray-900">
                            Enterprise Plan - {plan.planType ? plan.planType : "null"}
                          </h2>
                        </div>

                        {/* Company Logo & Name */}
                        <div className="flex items-center gap-3 mb-6 bg-gray-50 p-4 rounded-lg">
                          <img src="/vite.svg" alt="Company Logo" className="w-12 h-12 mr-4" />
                          <div>
                            <h3 className="text-blue-600 font-bold text-lg">RFP2GRANTS</h3>
                            <p className="text-gray-500 text-sm">Enteprise Plan</p>
                          </div>
                        </div>

                        {/* Details */}
                        <div className="grid grid-cols-2 gap-8 text-sm text-gray-800">
                          <div className="space-y-2">
                            <p><strong>Transaction ID:</strong></p>
                            <input
                              type="text"
                              name="transaction_id"
                              // value={plan.transaction_id}
                              disabled={isFormDataEditing}
                              onChange={(e) => setTransaction_id(e.target.value)}
                              className="w-full border rounded-lg px-3 py-2 mt-1 text-gray-700 focus:ring-2 focus:ring-blue-400 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                              placeholder="Enter Transaction ID"
                              title={isFormDataEditing ? "Cannot edit transaction ID while editing plan" : "Enter the transaction ID for this payment"}
                            />

                            {isFormDataEditing == true ? (
                              <>
                                <p><strong>Payment Type:</strong>
                                  <select
                                    name="planType"
                                    value={editFormData.planType}
                                    onChange={(e) => setEditFormData((prev) => ({ ...prev, planType: e.target.value }))}
                                    className="w-full border rounded-lg px-3 py-2 mt-1 text-gray-700 focus:ring-2 focus:ring-blue-400 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                                    title="Select whether this is a monthly or yearly plan"
                                  >
                                    <option value="">Select Plan Type</option>
                                    <option value="monthly">Monthly</option>
                                    <option value="yearly">Yearly</option>
                                  </select>

                                </p>
                                <p><strong>User email:</strong>
                                  <input
                                    type="text"
                                    name="email"
                                    value={editFormData.email}
                                    onChange={(e) => setEditFormData((prev) => ({ ...prev, email: e.target.value }))}
                                    className="w-full border rounded-lg px-3 py-2 mt-1 text-gray-700 focus:ring-2 focus:ring-blue-400 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                                    placeholder={plan.email}
                                    title="Enter the email address for this custom plan"
                                  />
                                </p>
                              </>
                            ) : (
                              <>
                                <p><strong>Payment Type:</strong> {plan.planType}</p>
                                <p><strong>User email:</strong> {plan.email}</p>
                              </>
                            )}

                          </div>

                          <div className="space-y-2">
                            {isFormDataEditing == true ? (
                              <>

                                <p><strong>Max Editors:</strong>
                                  <input
                                    type="number"
                                    name="maxEditors"
                                    value={editFormData.maxEditors}
                                    placeholder={plan.maxEditors}
                                    className="w-full border rounded-lg px-3 py-2 mt-1 text-gray-700 focus:ring-2 focus:ring-blue-400 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                                    onChange={(e) => {
                                      const validated = validateNumberInput(e.target.value, true);
                                      setEditFormData((prev) => ({ ...prev, maxEditors: validated }));
                                    }}
                                    onKeyDown={(e) => {
                                      if (e.key === '-' || e.key === 'e' || e.key === 'E' || e.key === '+') {
                                        e.preventDefault();
                                      }
                                    }}
                                    title="Enter the maximum number of editors allowed"
                                  />
                                </p>
                                <p><strong>Max Viewers:</strong>
                                  <input
                                    type="number"
                                    name="maxViewers"
                                    value={editFormData.maxViewers}
                                    placeholder={plan.maxViewers}
                                    className="w-full border rounded-lg px-3 py-2 mt-1 text-gray-700 focus:ring-2 focus:ring-blue-400 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                                    onChange={(e) => {
                                      const validated = validateNumberInput(e.target.value, true);
                                      setEditFormData((prev) => ({ ...prev, maxViewers: validated }));
                                    }}
                                    onKeyDown={(e) => {
                                      if (e.key === '-' || e.key === 'e' || e.key === 'E' || e.key === '+') {
                                        e.preventDefault();
                                      }
                                    }}
                                    title="Enter the maximum number of viewers allowed"
                                  />
                                </p>
                                <p><strong>Max RFP:</strong>
                                  <input
                                    type="number"
                                    name="maxRFPProposalGenerations"
                                    value={editFormData.maxRFPProposalGenerations}
                                    placeholder={plan.maxRFPProposalGenerations}
                                    className="w-full border rounded-lg px-3 py-2 mt-1 text-gray-700 focus:ring-2 focus:ring-blue-400 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                                    onChange={(e) => {
                                      const validated = validateNumberInput(e.target.value, true);
                                      setEditFormData((prev) => ({ ...prev, maxRFPProposalGenerations: validated }));
                                    }}
                                    onKeyDown={(e) => {
                                      if (e.key === '-' || e.key === 'e' || e.key === 'E' || e.key === '+') {
                                        e.preventDefault();
                                      }
                                    }}
                                    title="Enter the maximum number of RFP proposal generations allowed"
                                  />
                                </p>
                                <p><strong>Max Grant:</strong>
                                  <input
                                    type="number"
                                    name="maxGrantProposalGenerations"
                                    value={editFormData.maxGrantProposalGenerations}
                                    placeholder={plan.maxGrantProposalGenerations}
                                    className="w-full border rounded-lg px-3 py-2 mt-1 text-gray-700 focus:ring-2 focus:ring-blue-400 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                                    onChange={(e) => {
                                      const validated = validateNumberInput(e.target.value, true);
                                      setEditFormData((prev) => ({ ...prev, maxGrantProposalGenerations: validated }));
                                    }}
                                    onKeyDown={(e) => {
                                      if (e.key === '-' || e.key === 'e' || e.key === 'E' || e.key === '+') {
                                        e.preventDefault();
                                      }
                                    }}
                                    title="Enter the maximum number of grant proposal generations allowed"
                                  />
                                </p>
                              </>
                            ) : (
                              <>
                                <p><strong>Amount:</strong> ${plan.price}</p>
                                <p><strong>Max Editors:</strong> {plan.maxEditors}</p>
                                <p><strong>Max Viewers:</strong> {plan.maxViewers}</p>
                                <p><strong>Max RFP:</strong> {plan.maxRFPProposalGenerations}</p>
                                <p><strong>Max Grant:</strong> {plan.maxGrantProposalGenerations}</p>

                              </>
                            )}
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex justify-end gap-3 mt-6">
                          <button
                            onClick={() => handleCustomDelete(plan._id)}
                            className="px-4 py-2 bg-red-500 text-white rounded-lg transition-all duration-200 hover:bg-red-700 shadow-sm hover:shadow-md transform hover:scale-[1.02] active:scale-[0.98] text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Delete this custom plan"
                          >
                            Delete
                          </button>
                          <button
                            onClick={() => {
                              if (isFormDataEditing) {
                                editFormDataPlan(plan._id, editFormData); // ✅ pass payload too
                              } else {
                                setIsFormDataEditing(true);
                                setEditFormData({
                                  email: plan.email,
                                  price: plan.price,
                                  planType: plan.planType,
                                  maxEditors: plan.maxEditors,
                                  maxViewers: plan.maxViewers,
                                  maxRFPProposalGenerations: plan.maxRFPProposalGenerations,
                                  maxGrantProposalGenerations: plan.maxGrantProposalGenerations,
                                });
                              }
                            }}
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg transition-all duration-200 hover:bg-blue-700 shadow-sm hover:shadow-md transform hover:scale-[1.02] active:scale-[0.98] text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                            title={isFormDataEditing ? "Save changes to this custom plan" : "Edit this custom plan"}
                          >
                            {isFormDataEditing ? "Update" : "Edit"}
                          </button>
                          {isFormDataEditing ? (
                            <button
                              onClick={() => handleCancelEditFormData()}
                              className="px-4 py-2 bg-gray-400 text-white rounded-lg transition-all duration-200 hover:bg-gray-500 shadow-sm hover:shadow-md transform hover:scale-[1.02] active:scale-[0.98] text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                              title="Cancel editing this custom plan"
                            >
                              Cancel
                            </button>
                          ) : null}
                          <button
                            onClick={() =>
                              handleCustomSubmitfinal(
                                plan._id,
                                plan.email,
                                plan.price,
                                plan.planType,
                                plan.maxEditors,
                                plan.maxViewers,
                                plan.maxRFPProposalGenerations,
                                plan.maxGrantProposalGenerations,
                                transaction_id,
                                plan.companyName
                              )
                            }
                            className="px-4 py-2 bg-gradient-to-b from-[#6C63FF] to-[#3F73BD] text-white rounded-lg transition-all duration-200 hover:from-[#3F73BD] hover:to-[#6C63FF] shadow-sm hover:shadow-md transform hover:scale-[1.02] active:scale-[0.98] text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Submit transaction ID for this custom plan"
                          >
                            Submit
                          </button>
                        </div>

                      </td>
                    </tr>
                  )}


                </React.Fragment>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="p-4 text-center text-gray-500">
                  No custom plans found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Popup Modal */}
      {customToggle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white w-full max-w-6xl h-[550px] rounded-2xl shadow-2xl p-8 relative overflow-y-auto">
            <button
              onClick={() => setCustomToggle(false)}
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 text-2xl font-bold transition-all duration-200 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
              title="Close modal"
              disabled={loading}
            >
              ×
            </button>

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {/* --- Custom Plan Details --- */}
              <div>
                <h2 className="text-2xl font-bold text-gray-800 border-b pb-3 mb-6">
                  Enterprise Plan Details
                </h2>

                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-14 w-14 border-t-2 border-b-2 border-indigo-500"></div>
                  </div>
                ) : (
                  <div className="space-y-5">
                    {/* Email */}
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                        placeholder="Enter Your Email"
                        title="Enter the email address for the custom plan"
                      />
                    </div>

                    {/* Price */}
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        Price
                      </label>
                      <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        onKeyDown={(e) => {
                          if (e.key === '-' || e.key === 'e' || e.key === 'E' || e.key === '+') {
                            e.preventDefault();
                          }
                        }}
                        step="0.01"
                        min="0"
                        className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                        placeholder="Enter Price"
                        title="Enter the subscription price for this plan"
                      />
                    </div>

                    {/* Plan Type */}
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        Plan Type
                      </label>
                      <select
                        name="planType"
                        value={formData.planType}
                        onChange={handleChange}
                        className="w-full border rounded-lg px-3 py-2 text-gray-600 focus:ring-2 focus:ring-indigo-500 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Select whether this is a monthly or yearly plan"
                      >
                        <option value="">Select plan type</option>
                        <option value="monthly">Monthly</option>
                        <option value="yearly">Yearly</option>
                      </select>
                    </div>

                    {/* Max Editors */}
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        Max Editors
                      </label>
                      <input
                        type="number"
                        name="maxEditors"
                        value={formData.maxEditors}
                        onChange={handleChange}
                        onKeyDown={(e) => {
                          if (e.key === '-' || e.key === 'e' || e.key === 'E' || e.key === '+') {
                            e.preventDefault();
                          }
                        }}
                        className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                        placeholder="Enter Number Of Editors"
                        title="Enter the maximum number of editors allowed for this plan"
                      />
                    </div>

                    {/* Max Viewers */}
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        Max Viewers
                      </label>
                      <input
                        type="number"
                        name="maxViewers"
                        value={formData.maxViewers}
                        onChange={handleChange}
                        onKeyDown={(e) => {
                          if (e.key === '-' || e.key === 'e' || e.key === 'E' || e.key === '+') {
                            e.preventDefault();
                          }
                        }}
                        className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                        placeholder="Enter Number Of Viewers"
                        title="Enter the maximum number of viewers allowed for this plan"
                      />
                    </div>

                    {/* Max RFP */}
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        Max RFP
                      </label>
                      <input
                        type="number"
                        name="maxRFPProposalGenerations"
                        value={formData.maxRFPProposalGenerations}
                        onChange={handleChange}
                        onKeyDown={(e) => {
                          if (e.key === '-' || e.key === 'e' || e.key === 'E' || e.key === '+') {
                            e.preventDefault();
                          }
                        }}
                        className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                        placeholder="Enter Max RFP Generations"
                        title="Enter the maximum number of RFP proposal generations allowed"
                      />
                    </div>

                    {/* Max Grant */}
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        Max Grant
                      </label>
                      <input
                        type="number"
                        name="maxGrantProposalGenerations"
                        value={formData.maxGrantProposalGenerations}
                        onChange={handleChange}
                        onKeyDown={(e) => {
                          if (e.key === '-' || e.key === 'e' || e.key === 'E' || e.key === '+') {
                            e.preventDefault();
                          }
                        }}
                        className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                        placeholder="Enter Max Grant Generations"
                        title="Enter the maximum number of grant proposal generations allowed"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* --- Payment Details --- */}
              <div>
                <h3 className="text-2xl font-bold text-gray-800 border-b pb-3 mb-6">
                  Payment Details
                </h3>

                {isEditing ? (
                  <div className="space-y-4">
                    {[
                      { label: "UPI ID", name: "upi_id" },
                      { label: "Account Holder", name: "account_holder_name" },
                      { label: "Account Number", name: "account_number" },
                      { label: "IFSC Code", name: "ifsc_code" },
                      { label: "Bank Name", name: "bank_name" },
                      { label: "Branch", name: "branch_name" },
                      { label: "Address", name: "bank_address" },
                    ].map((field, idx) => (
                      <div key={idx}>
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                          {field.label}
                        </label>
                        <input
                          type="text"
                          name={field.name}
                          value={editablePayment?.[field.name] || ""}
                          onChange={handlePaymentChange}
                          className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                          placeholder={`Enter ${field.label}`}
                          title={`Enter ${field.label.toLowerCase()}`}
                        />
                      </div>
                    ))}

                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        Primary
                      </label>
                      <select
                        name="is_primary"
                        value={editablePayment?.is_primary ? "true" : "false"}
                        onChange={(e) =>
                          setEditablePayment((prev) => ({
                            ...prev,
                            is_primary: e.target.value === "true",
                          }))
                        }
                        className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Select whether this is the primary payment method"
                      >
                        <option value="true">Yes</option>
                        <option value="false">No</option>
                      </select>
                    </div>

                    <div className="flex gap-3 mt-6">
                      <button
                        onClick={() => handleSubmitEdit(paymentDetails._id)}
                        className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Update payment details"
                      >
                        Update
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="flex-1 px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Cancel editing payment details"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <p><strong>UPI ID:</strong> {paymentDetails?.upi_id || "—"}</p>
                    <p><strong>Account Holder:</strong> {paymentDetails?.account_holder_name || "—"}</p>
                    <p><strong>Account Number:</strong> {paymentDetails?.account_number || "—"}</p>
                    <p><strong>IFSC Code:</strong> {paymentDetails?.ifsc_code || "—"}</p>
                    <p><strong>Bank Name:</strong> {paymentDetails?.bank_name || "—"}</p>
                    <p><strong>Branch:</strong> {paymentDetails?.branch_name || "—"}</p>
                    <p><strong>Address:</strong> {paymentDetails?.bank_address || "—"}</p>
                    <p><strong>Primary:</strong> {paymentDetails?.is_primary ? "Yes" : "No"}</p>

                    <button
                      onClick={handleStartEdit}
                      className="w-full mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98]"
                      title="Edit payment details"
                    >
                      Edit
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Final Submit Button */}
            <div className="mt-10">
              <button
                onClick={handleCustomSubmit}
                className="w-full px-6 py-3 bg-gradient-to-b from-[#6C63FF] to-[#3F73BD] text-white font-semibold rounded-lg shadow hover:from-[#3F73BD] hover:to-[#6C63FF] transition-all duration-200 hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                title="Submit custom plan details"
              >
                Final Submit
              </button>
            </div>
          </div>
        </div>


      )}
    </div>
  );
};

export default ShowCustomDetails;
