import { DocumentEditor } from "@onlyoffice/document-editor-react";
import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { MdClose } from "react-icons/md";

// --- Helpers ---
function onDocumentReady(event) {
    // console.log("[OnlyOffice] ===== Document Ready =====");
}

function onLoadComponentError(errorCode, errorDescription) {
    // console.error(`[OnlyOffice] Load Error ${errorCode}: ${errorDescription}`);
}

const Editor = () => {
    const { type, id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const proposalData = location.state?.proposal || location.state?.grant || null;

    const [user, setUser] = useState(null);
    const [config, setConfig] = useState(null);

    // Session State
    const [sessionKey, setSessionKey] = useState(0);
    const [showEditor, setShowEditor] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // UI Flags
    const [sessionError, setSessionError] = useState(null);
    const [forceNewSession, setForceNewSession] = useState(false);

    // Env vars
    const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}`
    const DOCUMENT_SERVER_URL = `${import.meta.env.VITE_DOCUMENT_SERVER_URL}`

    // --- Effects ---

    useEffect(() => {
        const savedUser = localStorage.getItem("user") || null;
        if (savedUser) {
            const parsedUser = JSON.parse(savedUser);
            setUser(parsedUser.fullName || parsedUser.email || "User");
        }
    }, []);

    // --- Handlers ---

    const handleOpenDocument = useCallback(async (overrideForce = false) => {
        if (!proposalData || !type || !id) {
            setError("Missing proposal or grant data");
            setIsLoading(false);
            return;
        }

        // 1. Reset UI & Cleanup
        setIsLoading(true);
        setError(null);
        setSessionError(null);
        setShowEditor(false); // Hide first to trigger unmount

        // Aggressive cleanup of ANY stray instances before opening
        if (window.DocEditor && window.DocEditor.instances) {
            Object.keys(window.DocEditor.instances).forEach(instanceId => {
                try {
                    window.DocEditor.instances[instanceId].destroyEditor();
                    delete window.DocEditor.instances[instanceId];
                } catch (e) { }
            });
        }

        // [FIX] Wait 500ms to ensure the Async Cleanup (setTimeout above) has finished
        await new Promise(r => setTimeout(r, 500));

        try {
            let requestBody = {
                proposalId: id,
                type: type // 'rfp' or 'grant'
            };

            // If proposal has docx_base64, we can use it, otherwise backend will handle it
            if (proposalData.docx_base64) {
                // Backend should handle existing documents
            }

            // console.log("[App] Fetching config...");
            const response = await axios.post(`${API_BASE_URL}/editor/generate-doc`, requestBody, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });

            // Check for errors in response data first
            if (response.data?.error) {
                throw new Error(response.data.error);
            }

            // Check if response data exists
            if (!response.data) {
                throw new Error("Failed to load document: No data received from server");
            }

            setConfig(response.data);

            // 2. Increment session Key to force fresh component
            setSessionKey(prev => prev + 1);

            // 3. Show Editor
            setShowEditor(true);

            if (forceNewSession) setForceNewSession(false);

        } catch (err) {
            setError(err.response?.data?.message || err.message || "Failed to load document");
            setIsLoading(false);
        } finally {
            setIsLoading(false);
        }
    }, [proposalData, type, id, user, forceNewSession, API_BASE_URL]);

    // Auto-load document when component mounts with valid data
    useEffect(() => {
        if (user && proposalData && type && id) {
            handleOpenDocument(false);
        } else if (!proposalData) {
            setError("No proposal or grant data found. Please navigate from the Proposals page.");
            setIsLoading(false);
        }
    }, [user, proposalData, type, id, handleOpenDocument]);

    // GLOBAL CLEANUP: React Lifecycle Safety
    useEffect(() => {
        const currentId = `docxEditor_${sessionKey}`;
        return () => {
            // [CRITICAL FIX] Wrap destruction in setTimeout
            // We let React finish unmounting the DOM nodes FIRST.
            // Then we tell OnlyOffice to clean up its memory.
            // This prevents the "NotFoundError" crash in React.
            setTimeout(() => {
                if (window.DocEditor && window.DocEditor.instances && window.DocEditor.instances[currentId]) {
                    // console.log(`[App] Async Cleanup: Destroying ${currentId}`);
                    try {
                        window.DocEditor.instances[currentId].destroyEditor();
                        delete window.DocEditor.instances[currentId];
                    } catch (e) {
                        // console.warn("[App] Destruction warning:", e); 
                    }
                }
            }, 0);
        };
    }, [sessionKey]);

    function handleCloseEditor() {
        // 1. Hide UI
        setShowEditor(false);
        setConfig(null);
        setSessionError(null);

        // 2. Schedule cleanup
        const currentId = `docxEditor_${sessionKey}`;
        setTimeout(() => {
            if (window.DocEditor && window.DocEditor.instances && window.DocEditor.instances[currentId]) {
                try {
                    window.DocEditor.instances[currentId].destroyEditor();
                    delete window.DocEditor.instances[currentId];
                } catch (e) { }
            }
        }, 0);

        // Navigate back to proposals page
        navigate('/proposals');
    }

    // --- Render ---

    if (isLoading && !showEditor) {
        return (
            <div style={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f5f5f5", flexDirection: "column", gap: "20px" }}>
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#2563EB]"></div>
                <div>Loading editor...</div>
            </div>
        );
    }

    if (error && !showEditor) {
        return (
            <div style={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f5f5f5" }}>
                <div style={{ padding: "32px", background: "white", borderRadius: "8px", boxShadow: "0 2px 10px rgba(0,0,0,0.1)", maxWidth: "500px" }}>
                    <h2 style={{ marginTop: 0, color: "#721c24" }}>Error</h2>
                    <p style={{ color: "#721c24", marginBottom: "20px" }}>{error}</p>
                    <button
                        onClick={() => navigate('/proposals')}
                        style={{ width: "100%", padding: "10px", background: "#007bff", color: "white", border: "none", borderRadius: "4px" }}
                    >
                        Go Back to Proposals
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>

            {showEditor && config && (
                <div style={{ flex: 1, display: "flex", flexDirection: "column", position: "relative" }}>
                    <div style={{ padding: "4px", background: "#eee", borderBottom: "1px solid #ccc", display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
                        <button
                            onClick={handleCloseEditor}
                            style={{
                                padding: "8px",
                                background: "#9ca3af",
                                color: "#dc2626",
                                border: "none",
                                borderRadius: "4px",
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                width: "32px",
                                height: "32px"
                            }}
                            title="Close editor"
                        >
                            <MdClose size={20} />
                        </button>
                    </div>

                    <div style={{ flex: 1, position: "relative" }}>
                        {sessionError ? (
                            <div style={{
                                position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
                                background: "rgba(0,0,0,0.9)", zIndex: 9999,
                                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "white"
                            }}>
                                <h3>⚠️ {sessionError}</h3>
                                <div style={{ display: "flex", gap: "20px", marginTop: "20px" }}>
                                    <button
                                        onClick={() => handleOpenDocument(true)}
                                        style={{ padding: "15px 30px", background: "#28a745", color: "white", border: "none", borderRadius: "8px", fontSize: "18px", cursor: "pointer" }}
                                    >
                                        Fix & Reload (New Session)
                                    </button>
                                    <button onClick={handleCloseEditor} style={{ padding: "15px 30px", background: "#6c757d", color: "white", border: "none", borderRadius: "8px" }}>Close</button>
                                </div>
                            </div>
                        ) : (
                            /* Only render DocumentEditor if no error. This prevents the loop. */
                            <div key={sessionKey} style={{ width: '100%', height: '100%' }}>
                                <DocumentEditor
                                    id={`docxEditor_${sessionKey}`}
                                    height="100%"
                                    documentServerUrl={DOCUMENT_SERVER_URL}
                                    config={config}
                                    events_onDocumentReady={onDocumentReady}
                                    onLoadComponentError={onLoadComponentError}
                                />
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Editor;