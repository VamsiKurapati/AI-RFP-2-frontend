import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LuInstagram, LuLinkedin, LuTwitter } from "react-icons/lu";

export default function Footer() {
    const navigate = useNavigate();

    const handleRefClick = (id) => {
        if (location.pathname !== "/") {
            navigate("/");
        }
        setTimeout(() => {
            const element = document.getElementById(id);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        }, 100);
    }

    return (
        <>
            {/* Footer */}
            <footer className="white text-black py-10 px-8 md:px-16">
                <div className="grid xs:grid-cols-1 sm:grid-cols-3 gap-2 lg:gap-4 text-sm">
                    <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
                        <img src={"./logo_1.png"} alt="logo" className="w-[180px] h-[72px] mb-4" />
                        <p className="text-[16px] text-[#1E293B] font-regular mb-4">Transforming RFP management with AI-powered solutions</p>
                    </div>
                    <div className="flex flex-row justify-center items-start text-left gap-8 sm:gap-24 mx-auto">
                        <div className="flex flex-col items-start text-left">
                            <h4 className="text-[18px] text-[#000000] font-semibold mb-4">Company</h4>
                            <ul className="text-[16px] text-[#1E293B] font-regular space-y-2">
                                <li><a href="#about" onClick={() => handleRefClick("about")} className="hover:text-[#2563EB] transition-colors" title="Learn more about us">About</a></li>
                                <li>Blog</li>
                                <li><a href="/contact" onClick={() => handleRefClick("contact")} className="hover:text-[#2563EB] transition-colors" title="Contact us">Contact</a></li>
                            </ul>
                        </div>
                        <div className="flex flex-col items-start text-left">
                            <h4 className="text-[18px] text-[#000000] font-semibold mb-4">Connect</h4>
                            <ul className="text-[16px] text-[#1E293B] font-regular space-y-2">
                                <li className="flex items-center">
                                    <span className="text-[16px] text-[#1E293B] font-regular -mr-2">
                                        <LuLinkedin className="w-6 h-6 text-[#1E293B] mr-4 inline-block" title="Visit our LinkedIn" />
                                    </span>
                                    <a href="/" className="hover:text-[#2563EB] transition-colors" title="Visit our LinkedIn profile">Linkedin</a>
                                </li>
                                <li className="flex items-center">
                                    <span className="text-[16px] text-[#1E293B] font-regular -mr-2">
                                        <LuTwitter className="w-6 h-6 text-[#1E293B] mr-4 inline-block" title="Visit our Twitter" />
                                    </span>
                                    <a href="/" className="hover:text-[#2563EB] transition-colors" title="Visit our Twitter profile">Twitter</a>
                                </li>
                                <li className="flex items-center">
                                    <span className="text-[16px] text-[#1E293B] font-regular -mr-2">
                                        <LuInstagram className="w-6 h-6 text-[#1E293B] mr-4 inline-block" title="Visit our Instagram" />
                                    </span>
                                    <a href="/" className="hover:text-[#2563EB] transition-colors" title="Visit our Instagram profile">Instagram</a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <hr className="my-6 border-1 border-[#1E293B]" />
                <p className="text-left mt-8 text-xs text-black">© 2025. All Rights Reserved.</p>
            </footer>
        </>
    )
}