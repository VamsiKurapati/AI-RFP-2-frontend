import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaDashcube } from 'react-icons/fa';


export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();

    const handleRefClick = (id) => {
        navigate("/");
        setTimeout(() => {
            const element = document.getElementById(id);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        }, 100);
    }

    return (
        <>
            {/* Navbar */}
            <nav className="fixed top-0 left-0 z-50 w-full flex items-center justify-between bg-white p-4 shadow-md px-8 md:px-16">
                <div 
                    className="w-[180px] h-[72px] hover:cursor-pointer transition-opacity hover:opacity-80" 
                    onClick={() => navigate("/")}
                    title="Go to homepage"
                >
                    <img src={"/logo_1.png"} alt="logo" className="w-full h-full" />
                </div>

                <div className="hidden md:flex space-x-8">
                    <a href="#about" className="text-[#111827] hover:text-[#2563EB] transition-colors" onClick={() => handleRefClick("about")} title="Navigate to about section">About Us</a>
                    <a href="#solutions" className="text-[#111827] hover:text-[#2563EB] transition-colors" onClick={() => handleRefClick("solutions")} title="Navigate to solutions section">Solutions</a>
                    <a href="#plans" className="text-[#111827] hover:text-[#2563EB] transition-colors" onClick={() => handleRefClick("plans")} title="Navigate to pricing plans section">Plans</a>
                </div>

                <div className="hidden md:flex items-center space-x-4">
                    <button 
                        className="text-[#6B7280] text-[16px] px-4 py-2 transition-colors hover:text-[#2563EB]"
                        onClick={() => navigate("/login")}
                        title="Log in to your account"
                    >
                        Login
                    </button>
                    <button 
                        className="bg-[#2563EB] text-white px-4 py-2 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98] hover:bg-[#1D4ED8]"
                        onClick={() => navigate("/contact")}
                        title="Request a demo of the platform"
                    >
                        Request Demo
                    </button>
                </div>

                <div className="md:hidden">
                    <button 
                        className="text-gray-700 focus:outline-none transition-colors hover:text-[#2563EB]"
                        onClick={() => setIsOpen(!isOpen)}
                        title={isOpen ? "Close mobile menu" : "Open mobile menu"}
                    >
                        <FaDashcube className="w-6 h-6" />
                    </button>
                </div>

                {isOpen && (
                    <div className="absolute top-16 right-0 backdrop-blur bg-white/60 shadow-lg w-full md:hidden transition-all duration-300 ease-in-out z-100">
                        <div className="flex flex-col items-center space-y-4 p-4">
                            <a href="#about" className="text-[#111827] hover:text-[#2563EB] transition-colors" onClick={() => handleRefClick("about")} title="Navigate to about section">About Us</a>
                            <a href="#solutions" className="text-[#111827] hover:text-[#2563EB] transition-colors" onClick={() => handleRefClick("solutions")} title="Navigate to solutions section">Solutions</a>
                            <a href="#plans" className="text-[#111827] hover:text-[#2563EB] transition-colors" onClick={() => handleRefClick("plans")} title="Navigate to pricing plans section">Plans</a>
                            <button 
                                className="text-[#6B7280] text-[16px] px-4 py-2 transition-colors hover:text-[#2563EB]"
                                onClick={() => navigate("/login")}
                                title="Log in to your account"
                            >
                                Login
                            </button>
                            <button 
                                className="bg-[#2563EB] text-white px-4 py-2 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98] hover:bg-[#1D4ED8]"
                                onClick={() => navigate("/contact")}
                                title="Request a demo of the platform"
                            >
                                Request Demo
                            </button>
                        </div>
                    </div>
                )}
            </nav>
        </>
    )
}