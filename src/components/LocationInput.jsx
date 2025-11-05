import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useLoadScript } from '@react-google-maps/api';

// Define libraries array as a constant outside component to prevent reloading
// Object.freeze ensures the array reference remains stable
const libraries = Object.freeze(['places']);

// Get API key from environment variable - extract outside component for stability
const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

const LocationInput = ({
    id,
    label,
    value,
    onChange,
    error,
    required = false,
    disabled = false,
    placeholder = "E.g., San Francisco, CA",
    className = ""
}) => {
    const [inputValue, setInputValue] = useState(value || '');
    const [isDetectingLocation, setIsDetectingLocation] = useState(false);
    const [locationError, setLocationError] = useState('');
    const autocompleteElementRef = useRef(null);
    const inputRef = useRef(null);
    const geocoderRef = useRef(null);

    // Memoize LoadScript options to prevent unnecessary reloads
    // Since apiKey and libraries are constants outside component, this will be stable
    const loadScriptOptions = useMemo(() => ({
        googleMapsApiKey: apiKey || '',
        libraries,
    }), []);

    const { isLoaded, loadError } = useLoadScript(loadScriptOptions);

    // Load web components library if needed for PlaceAutocompleteElement
    useEffect(() => {
        if (!apiKey || !isLoaded) return;

        // Check if web component is already defined
        if (customElements.get('gmp-place-autocomplete')) {
            return;
        }

        // Load the web components loader
        const loaderScript = document.createElement('script');
        loaderScript.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&loading=async`;
        loaderScript.async = true;
        loaderScript.defer = true;
    }, [apiKey, isLoaded]);

    useEffect(() => {
        setInputValue(value || '');
    }, [value]);

    // Sync inputValue to web component whenever it changes
    useEffect(() => {
        if (!isLoaded || !inputValue) return;

        const syncValue = () => {
            if (!autocompleteElementRef.current) return;

            try {
                const element = autocompleteElementRef.current;

                // Strategy 1: Try setting value property
                if ('value' in element) {
                    element.value = inputValue;
                }

                // Strategy 2: Try setting attribute
                element.setAttribute('value', inputValue);

                // Strategy 3: Access inputElement property directly (it's a property of the web component)
                let inputElement = null;

                // The web component has an inputElement property
                if (element.inputElement) {
                    inputElement = element.inputElement;
                } else {
                    // Fallback: Try shadow DOM
                    try {
                        const shadowRoot = element.shadowRoot;
                        if (shadowRoot) {
                            inputElement = shadowRoot.querySelector('input');
                        }
                    } catch (e) {
                        // Shadow root not accessible
                    }

                    // If still not found, try finding input as child
                    if (!inputElement) {
                        inputElement = element.querySelector('input');
                    }
                }

                if (inputElement && inputElement.value !== inputValue) {
                    inputElement.value = inputValue;
                    const inputEvent = new InputEvent('input', {
                        bubbles: true,
                        cancelable: true,
                        data: inputValue
                    });
                    inputElement.dispatchEvent(inputEvent);
                }

                // Strategy 4: Dispatch events on the web component itself
                const componentInputEvent = new InputEvent('input', {
                    bubbles: true,
                    cancelable: true,
                    data: inputValue
                });
                element.dispatchEvent(componentInputEvent);
            } catch (e) {
                // Silently fail if web component isn't ready
            }
        };

        // Wait for web component to be defined if needed
        if (customElements.get('gmp-place-autocomplete')) {
            // Use requestAnimationFrame for better timing
            requestAnimationFrame(() => {
                setTimeout(syncValue, 50);
            });
        } else {
            customElements.whenDefined('gmp-place-autocomplete').then(() => {
                requestAnimationFrame(() => {
                    setTimeout(syncValue, 50);
                });
            });
        }
    }, [inputValue, isLoaded]);

    // Initialize Geocoder for reverse geocoding
    useEffect(() => {
        if (isLoaded && window.google?.maps && apiKey) {
            geocoderRef.current = new window.google.maps.Geocoder();
        }
    }, [isLoaded, apiKey]);

    // Auto-detect location function using browser geolocation API
    const detectLocation = () => {
        if (!navigator.geolocation) {
            setLocationError('Geolocation is not supported by your browser.');
            return;
        }

        if (!apiKey) {
            setLocationError('Google Maps API key is required for location detection.');
            return;
        }

        setIsDetectingLocation(true);
        setLocationError('');

        // Use browser geolocation API
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                try {
                    const { latitude, longitude } = position.coords;

                    // Use Google Geocoding REST API for reverse geocoding
                    const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`;

                    try {
                        // Add timeout to fetch request
                        const controller = new AbortController();
                        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

                        const response = await fetch(geocodeUrl, { signal: controller.signal });
                        clearTimeout(timeoutId);

                        if (!response.ok) {
                            throw new Error(`HTTP error! status: ${response.status}`);
                        }

                        const data = await response.json();

                        setIsDetectingLocation(false);

                        if (data.status === 'OK' && data.results && data.results.length > 0) {
                            // Get the formatted address
                            const formattedAddress = data.results[0].formatted_address;

                            // Update state first
                            setInputValue(formattedAddress);
                            onChange({ target: { value: formattedAddress } });

                            // Function to update web component value with multiple strategies
                            const updateWebComponentValue = () => {
                                if (!autocompleteElementRef.current) {
                                    return;
                                }

                                try {
                                    const element = autocompleteElementRef.current;

                                    // Strategy 1: Try setting value property
                                    if ('value' in element) {
                                        element.value = formattedAddress;
                                    }

                                    // Strategy 2: Try setting attribute
                                    element.setAttribute('value', formattedAddress);

                                    // Strategy 3: Access inputElement property directly (it's a property of the web component)
                                    let inputElement = null;

                                    // Try multiple ways to access inputElement
                                    // Method 1: Direct property access
                                    if (element.inputElement) {
                                        inputElement = element.inputElement;
                                    }

                                    // Method 2: Try accessing via bracket notation (in case it's a private property)
                                    if (!inputElement && element['inputElement']) {
                                        inputElement = element['inputElement'];
                                    }

                                    // Method 3: Check if it's defined but needs time to initialize
                                    if (!inputElement) {
                                        const allProps = Object.keys(element);

                                        // Try to find inputElement in the properties
                                        for (const prop of allProps) {
                                            try {
                                                const value = element[prop];
                                                if (value && (value.tagName === 'INPUT' || value.nodeName === 'INPUT')) {
                                                    inputElement = value;
                                                    break;
                                                }
                                            } catch (e) {
                                                // Ignore errors when accessing properties
                                            }
                                        }
                                    }

                                    // Fallback: Try shadow DOM
                                    if (!inputElement) {
                                        try {
                                            const shadowRoot = element.shadowRoot;
                                            if (shadowRoot) {
                                                inputElement = shadowRoot.querySelector('input');
                                                if (!inputElement) {
                                                    inputElement = shadowRoot.querySelector('[role="combobox"]');
                                                    inputElement = inputElement || shadowRoot.querySelector('input[type="text"]');
                                                }
                                            }
                                        } catch (e) {
                                            // Shadow root not accessible
                                        }
                                    }

                                    // If still not found, try finding input as child
                                    if (!inputElement) {
                                        inputElement = element.querySelector('input');
                                    }

                                    if (inputElement) {
                                        inputElement.value = formattedAddress;

                                        // Focus and blur to trigger any focus-related handlers
                                        inputElement.focus();

                                        // Create and dispatch input event
                                        const inputEvent = new InputEvent('input', {
                                            bubbles: true,
                                            cancelable: true,
                                            data: formattedAddress
                                        });
                                        inputElement.dispatchEvent(inputEvent);

                                        // Create and dispatch change event
                                        const changeEvent = new Event('change', {
                                            bubbles: true,
                                            cancelable: true
                                        });
                                        inputElement.dispatchEvent(changeEvent);

                                        // Blur after a short delay to ensure all handlers run
                                        setTimeout(() => {
                                            inputElement.blur();
                                        }, 100);
                                    }

                                    // Strategy 4: Try using setAttribute on the element itself
                                    element.setAttribute('value', formattedAddress);

                                    // Strategy 5: Dispatch events on the web component itself
                                    const componentInputEvent = new InputEvent('input', {
                                        bubbles: true,
                                        cancelable: true,
                                        data: formattedAddress
                                    });
                                    element.dispatchEvent(componentInputEvent);

                                    const componentChangeEvent = new Event('change', {
                                        bubbles: true,
                                        cancelable: true
                                    });
                                    element.dispatchEvent(componentChangeEvent);
                                } catch (e) {
                                    // Silently fail if web component update fails
                                }
                            };

                            // Try multiple times with delays to ensure component is ready
                            updateWebComponentValue();

                            // Use requestAnimationFrame for better timing
                            requestAnimationFrame(() => {
                                setTimeout(() => {
                                    updateWebComponentValue();
                                    // One more try after a slightly longer delay
                                    setTimeout(updateWebComponentValue, 200);
                                }, 50);
                            });

                            setLocationError('');
                        } else {
                            let errorMsg = 'Unable to get address from location.';
                            if (data.status === 'ZERO_RESULTS') {
                                errorMsg = 'No address found for this location.';
                            } else if (data.status === 'OVER_QUERY_LIMIT') {
                                errorMsg = 'Geocoding service quota exceeded. Please try again later.';
                            } else if (data.status === 'REQUEST_DENIED') {
                                errorMsg = 'Geocoding API is not enabled for your API key.';
                            } else if (data.status === 'INVALID_REQUEST') {
                                errorMsg = 'Invalid geocoding request.';
                            }
                            setLocationError(errorMsg);
                        }
                    } catch (fetchError) {
                        setIsDetectingLocation(false);
                        if (fetchError.name === 'AbortError') {
                            setLocationError('Location detection timed out. Please try again.');
                        } else {
                            setLocationError('Error fetching address from location service. Please try again.');
                        }
                    }
                } catch (error) {
                    setIsDetectingLocation(false);
                    setLocationError('Error processing location. Please try again.');
                }
            },
            (error) => {
                setIsDetectingLocation(false);
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        setLocationError('Location permission denied. Please allow location access or enter manually.');
                        break;
                    case error.POSITION_UNAVAILABLE:
                        setLocationError('Location information unavailable. Please enter location manually.');
                        break;
                    case error.TIMEOUT:
                        setLocationError('Location request timed out. Please try again.');
                        break;
                    default:
                        setLocationError('An error occurred while detecting location. Please enter manually.');
                        break;
                }
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0
            }
        );
    };

    // Initialize PlaceAutocompleteElement web component
    useEffect(() => {
        if (!isLoaded || !autocompleteElementRef.current || loadError || !apiKey) {
            return;
        }

        const autocompleteElement = autocompleteElementRef.current;

        // Wait for web component to be defined if it's not already
        const setupEventListeners = () => {
            // Set up event listener for place selection
            const handlePlaceSelect = async (event) => {
                const place = event.detail.place;
                if (place) {
                    try {
                        // Fetch place details to get formatted address
                        await place.fetchFields({ fields: ['formattedAddress', 'displayName', 'name'] });

                        // Get formatted address from the place
                        let selectedLocation = '';
                        if (place.formattedAddress) {
                            selectedLocation = place.formattedAddress;
                        } else if (place.displayName) {
                            selectedLocation = place.displayName;
                        } else if (place.name) {
                            selectedLocation = place.name;
                        }

                        if (selectedLocation) {
                            setInputValue(selectedLocation);
                            onChange({ target: { value: selectedLocation } });
                        }
                    } catch (error) {
                        // Silently handle place details fetch error
                    }
                }
            };

            autocompleteElement.addEventListener('gmp-placeselect', handlePlaceSelect);

            return () => {
                autocompleteElement.removeEventListener('gmp-placeselect', handlePlaceSelect);
            };
        };

        // Check if custom element is defined
        if (customElements.get('gmp-place-autocomplete')) {
            return setupEventListeners();
        } else {
            // Wait for the web component to be defined
            customElements.whenDefined('gmp-place-autocomplete').then(() => {
                return setupEventListeners();
            });
        }
    }, [isLoaded, loadError, apiKey, onChange]);

    const handleInputChange = (e) => {
        const newValue = e.target.value;
        setInputValue(newValue);
        onChange(e);
    };

    // If API key is not available, show regular input
    if (!apiKey || loadError) {
        return (
            <div className={`mb-4 ${className}`}>
                <label htmlFor={id} className="text-[18px] md:text-[24px] font-medium text-[#111827]">
                    {label} {required && "*"}
                </label>
                <div className="relative">
                    <input
                        id={id}
                        ref={inputRef}
                        type="text"
                        value={inputValue}
                        onChange={handleInputChange}
                        required={required}
                        disabled={disabled}
                        placeholder={placeholder}
                        className={`w-full border rounded-md mt-1 p-2 bg-[#F0F0F0] ${error ? "border-red-500" : ""} ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
                    />
                    {!disabled && (
                        <button
                            type="button"
                            onClick={detectLocation}
                            disabled={isDetectingLocation}
                            className="absolute right-2 top-3 flex items-center gap-1 text-sm text-[#2563EB] hover:text-[#1d4ed8] disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
                            title={isDetectingLocation ? "Detecting location..." : "Auto-detect your current location"}
                        >
                            {isDetectingLocation ? (
                                <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            ) : (
                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            )}
                        </button>
                    )}
                </div>
                {error && <div className="text-red-500 text-sm mt-1">{error}</div>}
                {locationError && !isDetectingLocation && (
                    <div className="text-amber-600 text-sm mt-1 flex items-center gap-1">
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        {locationError}
                    </div>
                )}
                {!apiKey && (
                    <div className="text-yellow-600 text-xs mt-1">
                        ℹ️ Google Maps API key not configured. Location autocomplete is disabled.
                    </div>
                )}
            </div>
        );
    }

    if (!isLoaded) {
        return (
            <div className={`mb-4 ${className}`}>
                <label htmlFor={id} className="text-[18px] md:text-[24px] font-medium text-[#111827]">
                    {label} {required && "*"}
                </label>
                <div className="relative">
                    <input
                        id={id}
                        type="text"
                        value={inputValue}
                        onChange={handleInputChange}
                        required={required}
                        disabled={true}
                        placeholder="Loading Google Maps..."
                        className="w-full border rounded-md mt-1 p-2 bg-[#F0F0F0] opacity-50 cursor-not-allowed"
                    />
                </div>
            </div>
        );
    }

    return (
        <div className={`mb-4 ${className}`}>
            <div className="flex items-center justify-between mb-1">
                <label htmlFor={id} className="text-[18px] md:text-[24px] font-medium text-[#111827]">
                    {label} {required && "*"}
                </label>
                {!disabled && (
                    <button
                        type="button"
                        onClick={detectLocation}
                        disabled={isDetectingLocation || !isLoaded}
                        className="flex items-center gap-1 text-sm text-[#2563EB] hover:text-[#1d4ed8] disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
                        title={isDetectingLocation ? "Detecting location..." : "Auto-detect your current location"}
                    >
                        {isDetectingLocation ? (
                            <>
                                <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                <span>Detecting...</span>
                            </>
                        ) : (
                            <>
                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <span>Auto-detect</span>
                            </>
                        )}
                    </button>
                )}
            </div>
            {/* Use the new PlaceAutocompleteElement web component */}
            <gmp-place-autocomplete
                ref={autocompleteElementRef}
                id={id}
                placeholder={placeholder}
                value={inputValue}
                request-fields="[formatted_address, name, geometry, address_components]"
                style={{
                    width: '100%',
                    border: error ? '1px solid rgb(239 68 68)' : '1px solid #e5e7eb',
                    borderRadius: '0.375rem',
                    fontSize: '16px',
                    marginTop: '0.25rem',
                    opacity: disabled ? 0.5 : 1,
                    cursor: disabled ? 'not-allowed' : 'auto',
                    pointerEvents: disabled ? 'none' : 'auto'
                }}
            />
            {error && <div className="text-red-500 text-sm mt-1">{error}</div>}
            {locationError && !isDetectingLocation && (
                <div className="text-amber-600 text-sm mt-1">
                    <div className="flex items-start gap-1">
                        <svg className="h-4 w-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <div className="flex-1">
                            <div>{locationError}</div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LocationInput;

