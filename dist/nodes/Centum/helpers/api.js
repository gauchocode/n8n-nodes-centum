"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiRequest = apiRequest;
async function apiRequest(url, options = {}, context) {
    const { method = 'GET', headers = {}, body, queryParams, responseType = 'json' } = options;
    let finalUrl = url;
    if (queryParams) {
        const params = new URLSearchParams();
        Object.entries(queryParams).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                params.append(key, value.toString());
            }
        });
        finalUrl += finalUrl.includes('?') ? `&${params.toString()}` : `?${params.toString()}`;
    }
    const fetchOptions = {
        method,
        headers: {
            'Content-Type': 'application/json',
            ...headers,
        },
    };
    if (body) {
        fetchOptions.body = JSON.stringify(body);
    }
    try {
        const response = await fetch(finalUrl, fetchOptions);
        if (!response.ok) {
            const errorText = await response.text();
            const error = new Error(`Request failed with status ${response.status}: ${errorText}`);
            if (context) {
                console.log("status:", response.status, errorText);
            }
            throw error;
        }
        if (responseType === 'arraybuffer') {
            return await response.arrayBuffer();
        }
        return await response.json();
    }
    catch (error) {
        if (context) {
            console.log('API request failed', error);
        }
        throw error;
    }
}
//# sourceMappingURL=api.js.map