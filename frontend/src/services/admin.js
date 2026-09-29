const API_URL = "https://nimbusgo-bck.vercel.app";
// const API_URL = "http://localhost:6600"

async function handleResponse(response) {
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
        if (data.message) throw new Error(data.message);
        if (data.msg) throw new Error(data.msg);
        if (data.Error) throw new Error(data.Error);

        throw new Error("Something went wrong.");
    }

    return data;
}

async function request(endpoint, options = {}) {
    const token = localStorage.getItem("token");

    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            ...options.headers
        }
    });

    return handleResponse(response);
}

export async function getMe() {
    return request("/admin/me");
}

export async function getOrders() {
    return request("/admin/order_list");
}

export async function getOrder(id) {
    return request(`/admin/order/${id}`);
}

export async function changeOrderStatus(id, status) {
    return request(`/admin/order/change_status/${id}`, {
        method: "PATCH",
        body: JSON.stringify({
            status
        })
    });
}

export async function updateCheckpoint(id, checkpointId) {
    return request(`/admin/order/checkpoint_update/${id}`, {
        method: "PATCH",
        body: JSON.stringify({
            checkpointId
        })
    });
}

export async function getUsers() {
    return request("/admin/user_list");
}

export async function changeRate(
    rateDistance,
    rateDimensions,
    rateWeight
) {
    return request("/admin/change_rate", {
        method: "PATCH",
        body: JSON.stringify({
            rateDistance,
            rateDimensions,
            rateWeight
        })
    });
}

export async function addCheckpoint(
    checkpointName,
    checkpointDetail,
    longitude,
    latitude
) {
    return request("/admin/add_checkpoint", {
        method: "PATCH",
        body: JSON.stringify({
            checkpointName,
            checkpointDetail,
            longitude,
            latitude
        })
    });
}

export async function getCheckpoints() {
    return request("/admin/checkpoint_list");
}