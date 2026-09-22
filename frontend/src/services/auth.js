const API_URL = "https://nimbusgo-bck.vercel.app";

async function handleResponse(response) {
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
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


export async function signup(name, email, password) {
    const response = await fetch(
        `${API_URL}/auth/signup`,
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                name,
                email,
                password
            })
        }
    );

    return handleResponse(response);
}


export async function login(email, password) {
    const response = await fetch(
        `${API_URL}/auth/login`,
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

    const data = await handleResponse(response);

    localStorage.setItem("token", data.token);
    localStorage.setItem("userId", data.user);

    return data;
}


export function getToken() {
    return localStorage.getItem("token");
}


export function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
}