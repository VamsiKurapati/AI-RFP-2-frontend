import React, { useEffect, useState } from "react";
import NavbarComponent from "./NavbarComponent";
import { IoIosArrowBack, IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { MdOutlineArrowBack, MdTrendingUp, MdBarChart, MdCheckCircle } from "react-icons/md";
import { FaTrophy, FaDollarSign } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";

const CompetitorAnalysis = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [competitorData, setCompetitorData] = useState(null);
    const [rfpTitle, setRfpTitle] = useState("");
    const [openSections, setOpenSections] = useState({
        competitors: true,
        pricingBenchmarks: true,
        winFrequencySummary: true,
        trends: true,
    });

    const toggleSection = (section) => {
        setOpenSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    useEffect(() => {
        // const incoming = location.state && location.state.data;
        const report = {
            "status": "success",
            "competitors": [
                {
                    "name": "Oracle (Primavera Unifier Native Services)",
                    "win_frequency": "35-40%",
                    "strengths": [
                        "Native platform provider with direct Primavera Unifier expertise",
                        "Integrated cost and schedule management capabilities",
                        "Real-time data entry and quality control automation",
                        "Advanced earned value management and forecasting",
                        "Enterprise-level reporting and multi-project visibility",
                        "Document management and workflow automation",
                        "Direct integration with Primavera P6 Enterprise Project Portfolio Management"
                    ],
                    "typical_pricing": "$150,000-$400,000 annually for project delivery partner services (based on project complexity, data volume, and reporting requirements)"
                },
                {
                    "name": "Deloitte Consulting LLP",
                    "win_frequency": "25-30%",
                    "strengths": [
                        "Extensive government and public sector project delivery experience",
                        "Strong data management and quality assurance capabilities",
                        "Comprehensive reporting and decision support services",
                        "Multi-disciplinary team expertise in infrastructure projects",
                        "Risk management and forecasting capabilities",
                        "Change management and stakeholder coordination expertise"
                    ],
                    "typical_pricing": "$200,000-$500,000 annually for project delivery partner services (premium positioning due to consulting brand and government sector expertise)"
                },
                {
                    "name": "Jacobs Engineering Group",
                    "win_frequency": "20-25%",
                    "strengths": [
                        "Deep infrastructure and capital project delivery experience",
                        "Specialized expertise in airport and transportation projects",
                        "Advanced project controls and cost management",
                        "Real-time progress tracking and digital documentation",
                        "Subcontractor and trade package management expertise",
                        "Schedule optimization and forecasting capabilities"
                    ],
                    "typical_pricing": "$180,000-$450,000 annually for project delivery partner services (competitive mid-to-premium range)"
                },
                {
                    "name": "AECOM",
                    "win_frequency": "18-22%",
                    "strengths": [
                        "Global infrastructure and project delivery expertise",
                        "Strong data management and reporting systems",
                        "Airport and transportation sector specialization",
                        "Digital progress documentation and photo management",
                        "RFI and submittal tracking capabilities",
                        "Integrated cost and schedule forecasting"
                    ],
                    "typical_pricing": "$160,000-$420,000 annually for project delivery partner services"
                },
                {
                    "name": "Turner Construction Company",
                    "win_frequency": "15-20%",
                    "strengths": [
                        "Extensive construction project delivery experience",
                        "Proven expertise in cost control and budget management",
                        "Strong subcontractor coordination and management",
                        "Real-time project data entry and quality control",
                        "Comprehensive progress reporting and forecasting",
                        "Digital documentation and photo logging systems"
                    ],
                    "typical_pricing": "$140,000-$380,000 annually for project delivery partner services"
                }
            ],
            "pricing_benchmarks": {
                "low": "$140,000",
                "average": "$270,000",
                "high": "$500,000"
            },
            "trends": [
                "Increased demand for real-time project data management and visibility in government infrastructure projects",
                "Growing emphasis on quality control and data accuracy in project reporting",
                "Integration of digital documentation and progress photography in project delivery",
                "Adoption of earned value management and advanced forecasting methodologies",
                "Expansion of Primavera Unifier adoption across public sector agencies",
                "Rising focus on subcontractor and trade package management transparency",
                "Demand for integrated cost and schedule management solutions"
            ],
            "win_frequency_summary": {
                "leader": "Oracle at 35-40% (native platform advantage and integrated capabilities)",
                "average": "21.6% (across all five competitors)",
                "challenger": "Turner Construction at 15-20% (strong execution but less software integration advantage)"
            }
        }
        // if (incoming && incoming.report) {
        //     setCompetitorData(incoming.report);
        //     setRfpTitle(location.state.rfpTitle || "");
        // } else {
        //     // If no data, navigate back
        //     navigate('/advanced-compliance-check');
        // }
        setCompetitorData(report);
        setRfpTitle("RFP Title" || "");
    }, [location.state, navigate]);

    if (!competitorData) {
        return (
            <div className="min-h-screen overflow-y-auto">
                <NavbarComponent />
                <div className="w-full mx-auto p-8 mt-20">
                    <div className="text-center py-8">
                        <p className="text-[#6B7280] text-[16px]">Loading competitor analysis...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen overflow-y-auto">
            <NavbarComponent />
            <div className="w-full mx-auto p-8 mt-20 max-w-7xl">
                {/* Page Title */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-3 bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] text-white px-6 py-3 rounded-full mb-4">
                        <MdBarChart className="w-6 h-6" />
                        <h1 className="text-[24px] font-bold">AI Competitor Analysis</h1>
                    </div>
                </div>

                {/* RFP Title */}
                <div className="w-full flex items-center mb-8 bg-gradient-to-r from-white to-gray-50 rounded-xl p-4 border border-[#E5E7EB] shadow-sm">
                    <button
                        className="bg-white rounded-lg p-2 mr-4 text-[#2563EB] hover:bg-gray-100 transition-colors shadow-md"
                        onClick={() => navigate(-1)}
                        title="Go back to previous page"
                    >
                        <MdOutlineArrowBack className="w-5 h-5 shrink-0" />
                    </button>
                    <div className="flex items-center gap-3">
                        <h1 className="text-[28px] font-bold text-[#111827]">{rfpTitle}</h1>
                    </div>
                </div>

                {/* Competitors Section */}
                <div className="mb-10">
                    {openSections.competitors ? (
                        <div className="border-2 border-[#2563EB] rounded-xl p-6">
                            <button
                                onClick={() => toggleSection('competitors')}
                                className="flex items-center justify-between w-full mb-6 transition-all duration-200 cursor-pointer"
                            >
                                <h2 className="text-[24px] font-bold text-[#111827]">Competitors</h2>
                                <IoIosArrowUp className="w-6 h-6 text-[#2563EB] shrink-0" />
                            </button>
                            <div className="space-y-6">
                                {competitorData.competitors && competitorData.competitors.map((competitor, idx) => {
                                    const rankColors = [
                                        "from-[#FFD700] to-[#FFA500]", // Gold for 1st
                                        "from-[#C0C0C0] to-[#808080]", // Silver for 2nd
                                        "from-[#CD7F32] to-[#A0522D]", // Bronze for 3rd
                                        "from-[#E5E7EB] to-[#D1D5DB]", // Gray for others
                                        "from-[#E5E7EB] to-[#D1D5DB]"
                                    ];
                                    return (
                                        <div key={idx} className="bg-white border-2 border-[#E5E7EB] rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300 relative overflow-hidden">
                                            {/* Rank indicator */}
                                            <div className={`absolute top-0 left-0 w-2 h-full bg-gradient-to-b ${rankColors[idx] || rankColors[3]}`}></div>

                                            <div className="ml-4">
                                                <div className="flex items-start justify-between mb-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${rankColors[idx] || rankColors[3]} flex items-center justify-center text-white font-bold text-[18px] shadow-md`}>
                                                            {idx + 1}
                                                        </div>
                                                        <h3 className="text-[20px] font-bold text-[#111827]">{competitor.name}</h3>
                                                    </div>
                                                    <span className="bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] text-white px-4 py-2 rounded-lg text-[14px] font-semibold shadow-md flex items-center gap-2">
                                                        <MdTrendingUp className="w-4 h-4" />
                                                        {competitor.win_frequency}
                                                    </span>
                                                </div>

                                                <div className="mb-5">
                                                    <div className="flex items-center gap-2 mb-3">
                                                        <MdCheckCircle className="w-5 h-5 text-[#10B981]" />
                                                        <h4 className="text-[18px] font-bold text-[#111827]">Strengths</h4>
                                                    </div>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 ml-7">
                                                        {competitor.strengths && competitor.strengths.map((strength, strengthIdx) => (
                                                            <div key={strengthIdx} className="flex items-start gap-2 bg-[#F0F9FF] rounded-lg p-3 border-l-4 border-[#2563EB]">
                                                                <span className="text-[#2563EB] mt-1 font-bold">✓</span>
                                                                <span className="text-[14px] text-[#374151] leading-relaxed">{strength}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>

                                                <div className="bg-gradient-to-r from-[#FEF3C7] to-[#FDE68A] border-2 border-[#FBBF24] rounded-xl p-5 shadow-sm">
                                                    <div className="flex items-start gap-3">
                                                        <FaDollarSign className="w-6 h-6 text-[#D97706] mt-1" />
                                                        <div>
                                                            <p className="text-[14px] font-semibold text-[#92400E] mb-1">Typical Pricing</p>
                                                            <p className="text-[15px] text-[#78350F] font-medium leading-relaxed">{competitor.typical_pricing}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ) : (
                        <button
                            onClick={() => toggleSection('competitors')}
                            className={`flex items-center justify-between w-full mb-6 transition-all duration-200 cursor-pointer rounded-lg px-4 py-2 bg-[#2563EB] text-white hover:bg-[#1D4ED8]`}
                        >
                            <h2 className="text-[24px] font-bold">Competitors</h2>
                            <IoIosArrowDown className="w-6 h-6 shrink-0" />
                        </button>
                    )}
                </div>

                {/* Pricing Benchmarks */}
                {competitorData.pricing_benchmarks && (
                    <div className="mb-10">
                        {openSections.pricingBenchmarks ? (
                            <div className="border-2 border-[#2563EB] rounded-xl p-6">
                                <button
                                    onClick={() => toggleSection('pricingBenchmarks')}
                                    className="flex items-center justify-between w-full mb-6 transition-all duration-200 cursor-pointer"
                                >
                                    <h2 className="text-[24px] font-bold text-[#111827]">Pricing Benchmarks</h2>
                                    <IoIosArrowUp className="w-6 h-6 text-[#2563EB] shrink-0" />
                                </button>
                                <div className="bg-gradient-to-br from-white to-gray-50 border-2 border-[#E5E7EB] rounded-xl p-8 shadow-lg">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div className="text-center bg-gradient-to-br from-[#FEE2E2] to-[#FECACA] rounded-xl p-6 border-2 border-[#EF4444] shadow-md transform hover:scale-105 transition-transform">
                                            <div className="inline-flex items-center justify-center w-12 h-12 bg-[#EF4444] rounded-full mb-3">
                                                <span className="text-white font-bold text-[18px]">↓</span>
                                            </div>
                                            <p className="text-[14px] font-semibold text-[#991B1B] mb-2 uppercase tracking-wide">Low</p>
                                            <p className="text-[32px] font-bold text-[#DC2626]">{competitorData.pricing_benchmarks.low}</p>
                                        </div>
                                        <div className="text-center bg-gradient-to-br from-[#FEF3C7] to-[#FDE68A] rounded-xl p-6 border-2 border-[#FBBF24] shadow-md transform hover:scale-105 transition-transform">
                                            <div className="inline-flex items-center justify-center w-12 h-12 bg-[#FBBF24] rounded-full mb-3">
                                                <span className="text-white font-bold text-[18px]">→</span>
                                            </div>
                                            <p className="text-[14px] font-semibold text-[#92400E] mb-2 uppercase tracking-wide">Average</p>
                                            <p className="text-[32px] font-bold text-[#D97706]">{competitorData.pricing_benchmarks.average}</p>
                                        </div>
                                        <div className="text-center bg-gradient-to-br from-[#D1FAE5] to-[#A7F3D0] rounded-xl p-6 border-2 border-[#10B981] shadow-md transform hover:scale-105 transition-transform">
                                            <div className="inline-flex items-center justify-center w-12 h-12 bg-[#10B981] rounded-full mb-3">
                                                <span className="text-white font-bold text-[18px]">↑</span>
                                            </div>
                                            <p className="text-[14px] font-semibold text-[#065F46] mb-2 uppercase tracking-wide">High</p>
                                            <p className="text-[32px] font-bold text-[#059669]">{competitorData.pricing_benchmarks.high}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <button
                                onClick={() => toggleSection('pricingBenchmarks')}
                                className={`flex items-center justify-between w-full mb-6 transition-all duration-200 cursor-pointer rounded-lg px-4 py-2 bg-[#2563EB] text-white hover:bg-[#1D4ED8]`}
                            >
                                <h2 className="text-[24px] font-bold">Pricing Benchmarks</h2>
                                <IoIosArrowDown className="w-6 h-6 shrink-0" />
                            </button>
                        )}
                    </div>
                )}

                {/* Win Frequency Summary */}
                {competitorData.win_frequency_summary && (
                    <div className="mb-10">
                        {openSections.winFrequencySummary ? (
                            <div className="border-2 border-[#2563EB] rounded-xl p-6">
                                <button
                                    onClick={() => toggleSection('winFrequencySummary')}
                                    className="flex items-center justify-between w-full mb-6 transition-all duration-200 cursor-pointer"
                                >
                                    <h2 className="text-[24px] font-bold text-[#111827]">Win Frequency Summary</h2>
                                    <IoIosArrowUp className="w-6 h-6 text-[#2563EB] shrink-0" />
                                </button>
                                <div className="bg-gradient-to-br from-white to-gray-50 border-2 border-[#E5E7EB] rounded-xl p-6 shadow-lg">
                                    <div className="space-y-4">
                                        <div className="bg-gradient-to-r from-[#FEF3C7] to-[#FDE68A] border-l-4 border-[#FBBF24] rounded-lg p-4 shadow-sm">
                                            <div className="flex items-center gap-2 mb-2">
                                                <FaTrophy className="w-5 h-5 text-[#D97706]" />
                                                <p className="text-[14px] font-bold text-[#92400E] uppercase tracking-wide">Leader</p>
                                            </div>
                                            <p className="text-[16px] font-semibold text-[#78350F] ml-7">{competitorData.win_frequency_summary.leader}</p>
                                        </div>
                                        <div className="bg-gradient-to-r from-[#DBEAFE] to-[#BFDBFE] border-l-4 border-[#3B82F6] rounded-lg p-4 shadow-sm">
                                            <div className="flex items-center gap-2 mb-2">
                                                <MdBarChart className="w-5 h-5 text-[#2563EB]" />
                                                <p className="text-[14px] font-bold text-[#1E40AF] uppercase tracking-wide">Average</p>
                                            </div>
                                            <p className="text-[16px] font-semibold text-[#1E3A8A] ml-7">{competitorData.win_frequency_summary.average}</p>
                                        </div>
                                        <div className="bg-gradient-to-r from-[#F3F4F6] to-[#E5E7EB] border-l-4 border-[#6B7280] rounded-lg p-4 shadow-sm">
                                            <div className="flex items-center gap-2 mb-2">
                                                <MdTrendingUp className="w-5 h-5 text-[#4B5563]" />
                                                <p className="text-[14px] font-bold text-[#374151] uppercase tracking-wide">Challenger</p>
                                            </div>
                                            <p className="text-[16px] font-semibold text-[#1F2937] ml-7">{competitorData.win_frequency_summary.challenger}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <button
                                onClick={() => toggleSection('winFrequencySummary')}
                                className={`flex items-center justify-between w-full mb-6 transition-all duration-200 cursor-pointer rounded-lg px-4 py-2 bg-[#2563EB] text-white hover:bg-[#1D4ED8]`}
                            >
                                <h2 className="text-[24px] font-bold">Win Frequency Summary</h2>
                                <IoIosArrowDown className="w-6 h-6 shrink-0" />
                            </button>
                        )}
                    </div>
                )}

                {/* Trends */}
                {competitorData.trends && competitorData.trends.length > 0 && (
                    <div className="mb-10">
                        {openSections.trends ? (
                            <div className="border-2 border-[#2563EB] rounded-xl p-6">
                                <button
                                    onClick={() => toggleSection('trends')}
                                    className="flex items-center justify-between w-full mb-6 transition-all duration-200 cursor-pointer"
                                >
                                    <h2 className="text-[24px] font-bold text-[#111827]">Market Trends</h2>
                                    <IoIosArrowUp className="w-6 h-6 text-[#2563EB] shrink-0" />
                                </button>
                                <div className="bg-gradient-to-br from-white to-gray-50 border-2 border-[#E5E7EB] rounded-xl p-6 shadow-lg">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {competitorData.trends.map((trend, idx) => (
                                            <div key={idx} className="flex items-start gap-3 bg-gradient-to-r from-[#F0F9FF] to-[#E0F2FE] rounded-lg p-4 border-l-4 border-[#2563EB] shadow-sm hover:shadow-md transition-shadow">
                                                <div className="bg-[#2563EB] rounded-full p-1.5 mt-0.5">
                                                    <MdTrendingUp className="w-4 h-4 text-white" />
                                                </div>
                                                <span className="text-[14px] text-[#374151] leading-relaxed font-medium flex-1">{trend}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <button
                                onClick={() => toggleSection('trends')}
                                className={`flex items-center justify-between w-full mb-6 transition-all duration-200 cursor-pointer rounded-lg px-4 py-2 bg-[#2563EB] text-white hover:bg-[#1D4ED8]`}
                            >
                                <h2 className="text-[24px] font-bold">Market Trends</h2>
                                <IoIosArrowDown className="w-6 h-6 shrink-0" />
                            </button>
                        )}
                    </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-between mt-8 gap-4">
                    <button
                        className="border border-[#4B5563] text-[#4B5563] px-6 py-2 rounded transition-all duration-200 hover:bg-gray-100 text-[16px] flex items-center gap-2"
                        onClick={() => navigate(-1)}
                        title="Go back to previous page"
                    >
                        <IoIosArrowBack className="text-[20px] text-[#4B5563] shrink-0" />
                        Back
                    </button>
                    <button
                        className="bg-[#2563EB] text-white px-8 py-2 rounded transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98] hover:bg-[#1D4ED8] text-[16px]"
                        onClick={() => navigate('/dashboard')}
                        title="Continue to dashboard"
                    >
                        Continue to Dashboard
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CompetitorAnalysis;

