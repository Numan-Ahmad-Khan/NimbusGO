
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

        if (data.errors) {
            throw new Error("Please check your input.");
        }

        throw new Error("Something went wrong.");
    }

    return data;
}

function getToken() {
    return localStorage.getItem("token");
}


// =========================
// CHANGE PASSWORD
// =========================

export async function changePassword(oldPassword, newPassword) {
    const response = await fetch(
        `${API_URL}/user/change_password`,
        {
            method: "PATCH",

            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${getToken()}`
            },

            body: JSON.stringify({
                oldPassword,
                newPassword
            })
        }
    );

    return handleResponse(response);
}


// =========================
// DEACTIVATE ACCOUNT
// =========================

export async function deactivateAccount() {
    const response = await fetch(
        `${API_URL}/user/change_account_status`,
        {
            method: "PATCH",

            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${getToken()}`
            },

            body: JSON.stringify({
                isActive: false
            })
        }
    );

    return handleResponse(response);
}


// =========================
// DELETE ACCOUNT
// =========================

export async function deleteAccount(confirmPassword) {
    const response = await fetch(
        `${API_URL}/user/delete_account`,
        {
            method: "DELETE",

            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${getToken()}`
            },

            body: JSON.stringify({
                confirmPassword
            })
        }
    );

    return handleResponse(response);
}