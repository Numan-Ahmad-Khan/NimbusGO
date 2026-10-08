
import { getToken } from "./auth";

const API_URL = import.meta.env.VITE_BACKEND_URL_MAIN
// const API_URL = import.meta.env.VITE_BACKEND_URL_DEV;
async function handleResponse(response) {
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
        if (data.message) {
            throw new Error(data.message);
        }

        if (data.msg) {
            throw new Error(data.msg);
        }

        throw new Error("Something went wrong.");
    }

    return data;
}

export async function generateOTP() {
    const token = getToken();

    const response = await fetch(
        `${API_URL}/user/generate-otp`,
        {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    return handleResponse(response);
}

export async function verifyOTP(otp) {
    const token = getToken();

    const response = await fetch(
        `${API_URL}/user/verify-otp`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                otp
            })
        }
    );

    return handleResponse(response);
}