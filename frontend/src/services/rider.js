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

        throw new Error("Something went wrong.");
    }

    return data;
}

export async function riderLogin(email, password) {
    const response = await fetch(
        `${API_URL}/auth/rider/login`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email,
                password
            })
        }
    );

    return handleResponse(response);
}

export async function riderSignup(
    name,
    email,
    password,
    latitude,
    longitude
) {
    const response = await fetch(
        `${API_URL}/auth/rider/signup`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name,
                email,
                password,
                latitude,
                longitude
            })
        }
    );

    return handleResponse(response);
}

export async function getRiderMe() {
    const token = getToken();

    const response = await fetch(
        `${API_URL}/rider/me`,
        {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    return handleResponse(response);
}

export async function updateRiderLocation(
    latitude,
    longitude
) {
    const token = getToken();

    const response = await fetch(
        `${API_URL}/rider/location`,
        {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                latitude,
                longitude
            })
        }
    );

    return handleResponse(response);
}

export async function getNearbyOrders() {
    const token = getToken();

    const response = await fetch(
        `${API_URL}/rider/nearby-orders`,
        {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    return handleResponse(response);
}