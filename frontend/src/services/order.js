import { getToken } from "./auth";

const API_URL = "https://nimbusgo-bck.vercel.app";
// const API_URL = "http://localhost:6600";
async function handleResponse(response) {
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
        if (data.msg) {
            throw new Error(data.msg);
        }

        if (data.message) {
            throw new Error(data.message);
        }

        if (data.errors) {
            throw new Error("Please check your input.");
        }

        throw new Error("Something went wrong.");
    }

    return data;
}

export async function placeOrder(orderData) {
    const token = getToken();

    const response = await fetch(
        `${API_URL}/user/place_order`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(orderData)
        }
    );

    return handleResponse(response);
}