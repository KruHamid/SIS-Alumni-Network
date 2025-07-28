// This service now acts as a client to our own backend API proxy.
// It does not interact with the Gemini API directly, ensuring API keys are kept secret.

const callApi = async (type: string, payload: any) => {
    try {
        const response = await fetch('/api/gemini', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ type, payload }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ error: 'An unknown error occurred on the server.' }));
            // Use the specific error from the server if available
            throw new Error(errorData.error || `Server responded with status ${response.status}`);
        }
        
        // Return the JSON body from the successful response
        return await response.json();
    } catch (error: any) {
        console.error(`Error calling our API proxy for type "${type}":`, error);
        // Propagate a user-friendly error message
        throw new Error(`ไม่สามารถเชื่อมต่อกับบริการ AI ได้: ${error.message}`);
    }
};

export const generateDescription = async (businessName: string, category: string): Promise<string> => {
    const data = await callApi('generateDescription', { businessName, category });
    if (typeof data.text !== 'string') {
        throw new Error('Received invalid response from AI service.');
    }
    return data.text;
};

export const geocodeAddress = async (address: string): Promise<{ lat: number; lng: number } | null> => {
    try {
        const data = await callApi('geocodeAddress', { address });
        // The API can return null, which is a valid and expected response for un-geocodeable addresses.
        if (data === null) {
            return null;
        }
        // Validate the structure of the returned object
        if (data && typeof data.lat === 'number' && typeof data.lng === 'number') {
            return data;
        }
        console.warn(`Received invalid geocode data for address "${address}":`, data);
        return null;
    } catch(error) {
        // Log the error but return null to prevent the whole map from failing
        console.error(`Error geocoding address "${address}" via proxy:`, error);
        return null;
    }
};
