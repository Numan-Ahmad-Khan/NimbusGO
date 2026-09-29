import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    MapContainer,
    TileLayer,
    Marker,
    useMap,
    useMapEvents
} from "react-leaflet";

import L from "leaflet";
import "leaflet/dist/leaflet.css";

import {
    getMe,
    getOrders,
    getOrder,
    changeOrderStatus,
    updateCheckpoint,
    getUsers,
    changeRate,
    addCheckpoint,
    getCheckpoints
} from "../../services/admin";


/*
|--------------------------------------------------------------------------
| MAP HELPERS
|--------------------------------------------------------------------------
*/

function MapClickHandler({ onLocationSelect }) {

    useMapEvents({
        click(event) {

            onLocationSelect(
                event.latlng.lat,
                event.latlng.lng
            );

        }
    });

    return null;
}


function MapCenterUpdater({
    position,
    zoom
}) {

    const map = useMap();

    useEffect(() => {

        if (!position) {
            return;
        }

        map.setView(
            position,
            zoom
        );

    }, [map, position, zoom]);

    return null;
}


const checkpointIcon = L.divIcon({
    className: "",
    html: `
        <div style="
            font-size: 30px;
            line-height: 30px;
        ">
            📍
        </div>
    `,
    iconSize: [30, 30],
    iconAnchor: [15, 30]
});


/*
|--------------------------------------------------------------------------
| ADMIN DASHBOARD
|--------------------------------------------------------------------------
*/

export default function AdminDashboard() {

    const navigate = useNavigate();

    const [admin, setAdmin] = useState(null);

    const [orders, setOrders] = useState([]);
    const [users, setUsers] = useState([]);
    const [checkpoints, setCheckpoints] = useState([]);

    const [loading, setLoading] = useState(true);

    const [activeSection, setActiveSection] =
        useState("dashboard");

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [orderSearch, setOrderSearch] = useState("");
    const [userSearch, setUserSearch] = useState("");

    const [selectedOrder, setSelectedOrder] =
        useState(null);

    const [orderLoading, setOrderLoading] =
        useState(false);

    const [statusLoading, setStatusLoading] =
        useState(false);

    const [checkpointLoading, setCheckpointLoading] =
        useState(false);

    const [newStatus, setNewStatus] =
        useState("");

    const [checkpointId, setCheckpointId] =
        useState("");

    const [rateDistance, setRateDistance] =
        useState("");

    const [rateDimensions, setRateDimensions] =
        useState("");

    const [rateWeight, setRateWeight] =
        useState("");

    const [rateLoading, setRateLoading] =
        useState(false);

    const [checkpointName, setCheckpointName] =
        useState("");

    const [checkpointDetail, setCheckpointDetail] =
        useState("");

    const [longitude, setLongitude] =
        useState("");

    const [latitude, setLatitude] =
        useState("");

    const [addCheckpointLoading, setAddCheckpointLoading] =
        useState(false);


    /*
    |--------------------------------------------------------------------------
    | INITIAL DATA
    |--------------------------------------------------------------------------
    */

    useEffect(() => {

        loadDashboard();

    }, []);


    async function loadDashboard() {

        setLoading(true);
        setError("");

        try {

            const [
                meResponse,
                ordersResponse,
                usersResponse,
                checkpointsResponse
            ] = await Promise.all([
                getMe(),
                getOrders(),
                getUsers(),
                getCheckpoints()
            ]);

            setAdmin(meResponse.user);

            setOrders(
                ordersResponse.Details || []
            );

            setUsers(
                usersResponse.user_list || []
            );

            setCheckpoints(
                checkpointsResponse.checkpoints || []
            );

        }
        catch (error) {

            console.log(error);

            setError(
                error.message ||
                "Failed to load admin dashboard."
            );

        }
        finally {

            setLoading(false);

        }
    }


    /*
    |--------------------------------------------------------------------------
    | CLEAR MESSAGES
    |--------------------------------------------------------------------------
    */

    function clearMessages() {

        setError("");
        setSuccess("");

    }


    /*
    |--------------------------------------------------------------------------
    | LOGOUT
    |--------------------------------------------------------------------------
    */

    function handleLogout() {

        localStorage.removeItem("token");
        localStorage.removeItem("userId");

        navigate(
            "/admin/login",
            {
                replace: true
            }
        );
    }


    /*
    |--------------------------------------------------------------------------
    | ORDER DETAILS
    |--------------------------------------------------------------------------
    */

    async function handleViewOrder(id) {

        clearMessages();

        setOrderLoading(true);

        try {

            const response =
                await getOrder(id);

            setSelectedOrder(
                response.Details
            );

            setNewStatus(
                response.Details?.status || ""
            );

            setCheckpointId("");

        }
        catch (error) {

            console.log(error);

            setError(
                error.message ||
                "Failed to load order."
            );

        }
        finally {

            setOrderLoading(false);

        }
    }


    /*
    |--------------------------------------------------------------------------
    | CHANGE ORDER STATUS
    |--------------------------------------------------------------------------
    */

    async function handleChangeStatus() {

        if (!selectedOrder) {
            return;
        }

        if (!newStatus) {

            setError(
                "Please select a status."
            );

            return;
        }

        clearMessages();

        setStatusLoading(true);

        try {

            const response =
                await changeOrderStatus(
                    selectedOrder.id,
                    newStatus
                );

            setSuccess(
                response.msg ||
                "Order status updated."
            );

            setSelectedOrder(
                previous => ({
                    ...previous,
                    status: newStatus
                })
            );

            setOrders(
                previous =>
                    previous.map(order =>
                        order.id === selectedOrder.id
                            ? {
                                ...order,
                                status: newStatus
                            }
                            : order
                    )
            );

        }
        catch (error) {

            console.log(error);

            setError(
                error.message ||
                "Failed to update order status."
            );

        }
        finally {

            setStatusLoading(false);

        }
    }


    /*
    |--------------------------------------------------------------------------
    | UPDATE CHECKPOINT
    |--------------------------------------------------------------------------
    */

    async function handleUpdateCheckpoint() {

        if (!selectedOrder) {
            return;
        }

        if (!checkpointId) {

            setError(
                "Please select a checkpoint."
            );

            return;
        }

        clearMessages();

        setCheckpointLoading(true);

        try {

            const response =
                await updateCheckpoint(
                    selectedOrder.id,
                    checkpointId
                );

            setSuccess(
                response.msg ||
                "Checkpoint updated."
            );

            setCheckpointId("");

        }
        catch (error) {

            console.log(error);

            setError(
                error.message ||
                "Failed to update checkpoint."
            );

        }
        finally {

            setCheckpointLoading(false);

        }
    }


    /*
    |--------------------------------------------------------------------------
    | CHANGE RATES
    |--------------------------------------------------------------------------
    */

    async function handleChangeRates(e) {

        e.preventDefault();

        if (
            rateDistance === "" ||
            rateDimensions === "" ||
            rateWeight === ""
        ) {

            setError(
                "Please enter all three rates."
            );

            return;
        }

        clearMessages();

        setRateLoading(true);

        try {

            const response =
                await changeRate(
                    Number(rateDistance),
                    Number(rateDimensions),
                    Number(rateWeight)
                );

            setSuccess(
                response.msg ||
                "Rates updated successfully."
            );

        }
        catch (error) {

            console.log(error);

            setError(
                error.message ||
                "Failed to update rates."
            );

        }
        finally {

            setRateLoading(false);

        }
    }


    /*
    |--------------------------------------------------------------------------
    | MAP LOCATION SELECT
    |--------------------------------------------------------------------------
    */

    function handleMapLocationSelect(
        lat,
        lng
    ) {

        setLatitude(
            lat.toFixed(6)
        );

        setLongitude(
            lng.toFixed(6)
        );

    }


    /*
    |--------------------------------------------------------------------------
    | ADD CHECKPOINT
    |--------------------------------------------------------------------------
    */

    async function handleAddCheckpoint(e) {

        e.preventDefault();

        if (!checkpointName.trim()) {

            setError(
                "Checkpoint name is required."
            );

            return;
        }

        if (!checkpointDetail.trim()) {

            setError(
                "Checkpoint details are required."
            );

            return;
        }

        if (
            latitude === "" ||
            longitude === ""
        ) {

            setError(
                "Please click on the map to select a location."
            );

            return;
        }

        clearMessages();

        setAddCheckpointLoading(true);

        try {

            const response =
                await addCheckpoint(
                    checkpointName.trim(),
                    checkpointDetail.trim(),
                    Number(longitude),
                    Number(latitude)
                );

            setSuccess(
                response.msg ||
                "Checkpoint created successfully."
            );

            setCheckpointName("");
            setCheckpointDetail("");
            setLongitude("");
            setLatitude("");

            const checkpointsResponse =
                await getCheckpoints();

            setCheckpoints(
                checkpointsResponse.checkpoints || []
            );

        }
        catch (error) {

            console.log(error);

            setError(
                error.message ||
                "Failed to create checkpoint."
            );

        }
        finally {

            setAddCheckpointLoading(false);

        }
    }


    /*
    |--------------------------------------------------------------------------
    | SELECTED CHECKPOINT
    |--------------------------------------------------------------------------
    */

    const selectedCheckpoint = useMemo(() => {

        return checkpoints.find(
            checkpoint =>
                String(checkpoint.id) ===
                String(checkpointId)
        );

    }, [
        checkpoints,
        checkpointId
    ]);


    const selectedCheckpointPosition =
        selectedCheckpoint
            ? [
                Number(
                    selectedCheckpoint.latitude
                ),
                Number(
                    selectedCheckpoint.longitude
                )
            ]
            : null;


    /*
    |--------------------------------------------------------------------------
    | FILTERED ORDERS
    |--------------------------------------------------------------------------
    */

    const filteredOrders = useMemo(() => {

        const search =
            orderSearch
                .trim()
                .toLowerCase();

        if (!search) {
            return orders;
        }

        return orders.filter(order =>

            String(order.id)
                .toLowerCase()
                .includes(search) ||

            String(order.orderName || "")
                .toLowerCase()
                .includes(search) ||

            String(order.status || "")
                .toLowerCase()
                .includes(search) ||

            String(order.userName || "")
                .toLowerCase()
                .includes(search) ||

            String(order.userEmail || "")
                .toLowerCase()
                .includes(search)

        );

    }, [
        orders,
        orderSearch
    ]);


    /*
    |--------------------------------------------------------------------------
    | FILTERED USERS
    |--------------------------------------------------------------------------
    */

    const filteredUsers = useMemo(() => {

        const search =
            userSearch
                .trim()
                .toLowerCase();

        if (!search) {
            return users;
        }

        return users.filter(user =>

            String(user.id)
                .toLowerCase()
                .includes(search) ||

            String(user.name || "")
                .toLowerCase()
                .includes(search) ||

            String(user.email || "")
                .toLowerCase()
                .includes(search) ||

            String(user.role || "")
                .toLowerCase()
                .includes(search)

        );

    }, [
        users,
        userSearch
    ]);


    /*
    |--------------------------------------------------------------------------
    | ORDER STATISTICS
    |--------------------------------------------------------------------------
    */

    const orderStats = useMemo(() => {

        const stats = {
            total: orders.length,
            accepted: 0,
            processing: 0,
            transit: 0,
            rejected: 0,
            failed: 0
        };

        orders.forEach(order => {

            switch (order.status) {

                case "ACCEPTED":
                    stats.accepted++;
                    break;

                case "PROCESSING":
                    stats.processing++;
                    break;

                case "IN_TRANSIT":
                    stats.transit++;
                    break;

                case "REJECTED":
                    stats.rejected++;
                    break;

                case "FAILED":
                    stats.failed++;
                    break;

                default:
                    break;

            }

        });

        return stats;

    }, [orders]);


    /*
    |--------------------------------------------------------------------------
    | LOADING SCREEN
    |--------------------------------------------------------------------------
    */

    if (loading) {

        return (
            <div className="
                min-h-screen
                bg-[#fafafa]
                flex
                items-center
                justify-center
            ">

                <p className="
                    text-sm
                    text-neutral-500
                ">
                    Loading admin dashboard...
                </p>

            </div>
        );
    }


    /*
    |--------------------------------------------------------------------------
    | DASHBOARD
    |--------------------------------------------------------------------------
    */

    return (

        <div className="
            min-h-screen
            bg-[#fafafa]
            text-neutral-900
        ">

            <div className="
                flex
                min-h-screen
            ">

                {/* SIDEBAR */}

                <aside className="
                    hidden
                    w-64
                    shrink-0
                    border-r
                    border-neutral-200
                    bg-white
                    lg:flex
                    lg:flex-col
                ">

                    <div className="
                        border-b
                        border-neutral-200
                        px-6
                        py-6
                    ">

                        <p className="
                            text-sm
                            font-medium
                            text-neutral-500
                        ">
                            NimbusGO
                        </p>

                        <h1 className="
                            mt-1
                            text-xl
                            font-bold
                        ">
                            Admin
                        </h1>

                    </div>


                    <nav className="
                        flex-1
                        space-y-1
                        p-4
                    ">

                        <SidebarButton
                            label="Dashboard"
                            active={
                                activeSection === "dashboard"
                            }
                            onClick={() => {
                                clearMessages();
                                setActiveSection("dashboard");
                            }}
                        />

                        <SidebarButton
                            label="Orders"
                            active={
                                activeSection === "orders"
                            }
                            onClick={() => {
                                clearMessages();
                                setActiveSection("orders");
                            }}
                        />

                        <SidebarButton
                            label="Users"
                            active={
                                activeSection === "users"
                            }
                            onClick={() => {
                                clearMessages();
                                setActiveSection("users");
                            }}
                        />

                        <SidebarButton
                            label="Rates"
                            active={
                                activeSection === "rates"
                            }
                            onClick={() => {
                                clearMessages();
                                setActiveSection("rates");
                            }}
                        />

                        <SidebarButton
                            label="Checkpoints"
                            active={
                                activeSection === "checkpoints"
                            }
                            onClick={() => {
                                clearMessages();
                                setActiveSection("checkpoints");
                            }}
                        />

                    </nav>


                    <div className="
                        border-t
                        border-neutral-200
                        p-4
                    ">

                        <div className="
                            mb-3
                            rounded-xl
                            bg-neutral-50
                            px-4
                            py-3
                        ">

                            <p className="
                                truncate
                                text-sm
                                font-medium
                            ">
                                {admin?.name || "Admin"}
                            </p>

                            <p className="
                                truncate
                                text-xs
                                text-neutral-500
                            ">
                                {admin?.email || ""}
                            </p>

                        </div>

                        <button
                            onClick={handleLogout}
                            className="
                                w-full
                                rounded-xl
                                px-4
                                py-3
                                text-left
                                text-sm
                                font-medium
                                text-red-600
                                transition
                                hover:bg-red-50
                            "
                        >
                            Logout
                        </button>

                    </div>

                </aside>


                {/* MAIN */}

                <main className="
                    min-w-0
                    flex-1
                ">

                    {/* TOP BAR */}

                    <header className="
                        sticky
                        top-0
                        z-10
                        border-b
                        border-neutral-200
                        bg-white/90
                        px-5
                        py-4
                        backdrop-blur
                        sm:px-8
                    ">

                        <div className="
                            flex
                            items-center
                            justify-between
                            gap-4
                        ">

                            <div>

                                <p className="
                                    text-xs
                                    font-medium
                                    uppercase
                                    tracking-wider
                                    text-neutral-400
                                ">
                                    NimbusGO
                                </p>

                                <h2 className="
                                    mt-1
                                    text-xl
                                    font-bold
                                ">
                                    {activeSection === "dashboard"
                                        ? "Dashboard"
                                        : activeSection === "orders"
                                            ? "Orders"
                                            : activeSection === "users"
                                                ? "Users"
                                                : activeSection === "rates"
                                                    ? "Rates"
                                                    : "Checkpoints"
                                    }
                                </h2>

                            </div>


                            <button
                                onClick={handleLogout}
                                className="
                                    rounded-xl
                                    border
                                    border-neutral-200
                                    bg-white
                                    px-4
                                    py-2
                                    text-sm
                                    font-medium
                                    transition
                                    hover:bg-neutral-50
                                    lg:hidden
                                "
                            >
                                Logout
                            </button>

                        </div>

                    </header>


                    <div className="
                        mx-auto
                        max-w-7xl
                        px-5
                        py-6
                        sm:px-8
                        sm:py-8
                    ">

                        {/* MESSAGES */}

                        {error && (

                            <div className="
                                mb-6
                                rounded-xl
                                border
                                border-red-200
                                bg-red-50
                                px-4
                                py-3
                                text-sm
                                text-red-700
                            ">
                                {error}
                            </div>

                        )}


                        {success && (

                            <div className="
                                mb-6
                                rounded-xl
                                border
                                border-green-200
                                bg-green-50
                                px-4
                                py-3
                                text-sm
                                text-green-700
                            ">
                                {success}
                            </div>

                        )}


                        {/* DASHBOARD */}

                        {activeSection === "dashboard" && (

                            <section>

                                <div className="
                                    mb-8
                                ">

                                    <p className="
                                        text-sm
                                        text-neutral-500
                                    ">
                                        Welcome back,
                                    </p>

                                    <h3 className="
                                        mt-1
                                        text-3xl
                                        font-bold
                                        tracking-tight
                                    ">
                                        {admin?.name || "Admin"}
                                    </h3>

                                </div>


                                <div className="
                                    grid
                                    gap-4
                                    sm:grid-cols-2
                                    xl:grid-cols-4
                                ">

                                    <StatCard
                                        label="Total Orders"
                                        value={orderStats.total}
                                    />

                                    <StatCard
                                        label="Total Users"
                                        value={users.length}
                                    />

                                    <StatCard
                                        label="In Transit"
                                        value={orderStats.transit}
                                    />

                                    <StatCard
                                        label="Processing"
                                        value={orderStats.processing}
                                    />

                                </div>


                                <div className="
                                    mt-8
                                    grid
                                    gap-6
                                    xl:grid-cols-2
                                ">

                                    <div className="
                                        rounded-2xl
                                        border
                                        border-neutral-200
                                        bg-white
                                        p-6
                                    ">

                                        <div className="
                                            mb-5
                                            flex
                                            items-center
                                            justify-between
                                        ">

                                            <div>

                                                <h3 className="
                                                    font-semibold
                                                ">
                                                    Order status
                                                </h3>

                                                <p className="
                                                    mt-1
                                                    text-sm
                                                    text-neutral-500
                                                ">
                                                    Current order breakdown
                                                </p>

                                            </div>

                                        </div>


                                        <div className="
                                            grid
                                            grid-cols-2
                                            gap-3
                                        ">

                                            <MiniStat
                                                label="Accepted"
                                                value={
                                                    orderStats.accepted
                                                }
                                            />

                                            <MiniStat
                                                label="Processing"
                                                value={
                                                    orderStats.processing
                                                }
                                            />

                                            <MiniStat
                                                label="In Transit"
                                                value={
                                                    orderStats.transit
                                                }
                                            />

                                            <MiniStat
                                                label="Rejected"
                                                value={
                                                    orderStats.rejected
                                                }
                                            />

                                            <MiniStat
                                                label="Failed"
                                                value={
                                                    orderStats.failed
                                                }
                                            />

                                        </div>

                                    </div>


                                    <div className="
                                        rounded-2xl
                                        border
                                        border-neutral-200
                                        bg-white
                                        p-6
                                    ">

                                        <div className="
                                            mb-5
                                            flex
                                            items-center
                                            justify-between
                                        ">

                                            <div>

                                                <h3 className="
                                                    font-semibold
                                                ">
                                                    Recent orders
                                                </h3>

                                                <p className="
                                                    mt-1
                                                    text-sm
                                                    text-neutral-500
                                                ">
                                                    Latest orders in the system
                                                </p>

                                            </div>


                                            <button
                                                onClick={() => {
                                                    clearMessages();
                                                    setActiveSection(
                                                        "orders"
                                                    );
                                                }}
                                                className="
                                                    text-sm
                                                    font-medium
                                                    underline
                                                "
                                            >
                                                View all
                                            </button>

                                        </div>


                                        {orders.length === 0 ? (

                                            <p className="
                                                text-sm
                                                text-neutral-500
                                            ">
                                                No orders found.
                                            </p>

                                        ) : (

                                            <div className="
                                                space-y-3
                                            ">

                                                {orders
                                                    .slice(0, 5)
                                                    .map(order => (

                                                        <button
                                                            key={order.id}
                                                            onClick={() =>
                                                                handleViewOrder(
                                                                    order.id
                                                                )
                                                            }
                                                            className="
                                                                flex
                                                                w-full
                                                                items-center
                                                                justify-between
                                                                rounded-xl
                                                                bg-neutral-50
                                                                px-4
                                                                py-3
                                                                text-left
                                                                transition
                                                                hover:bg-neutral-100
                                                            "
                                                        >

                                                            <div>

                                                                <p className="
                                                                    text-sm
                                                                    font-medium
                                                                ">
                                                                    {order.orderName ||
                                                                        `Order #${order.id}`}
                                                                </p>

                                                                <p className="
                                                                    mt-1
                                                                    text-xs
                                                                    text-neutral-500
                                                                ">
                                                                    {order.userName ||
                                                                        "Unknown User"}
                                                                </p>

                                                                <p className="
                                                                    mt-0.5
                                                                    text-xs
                                                                    text-neutral-400
                                                                ">
                                                                    {order.userEmail ||
                                                                        "Unknown Email"}
                                                                </p>

                                                            </div>


                                                            <StatusBadge
                                                                status={
                                                                    order.status
                                                                }
                                                            />

                                                        </button>

                                                    ))
                                                }

                                            </div>

                                        )}

                                    </div>

                                </div>

                            </section>

                        )}


                        {/* ORDERS */}

                        {activeSection === "orders" && (

                            <section>

                                <div className="
                                    mb-6
                                ">

                                    <input
                                        value={orderSearch}
                                        onChange={(e) =>
                                            setOrderSearch(
                                                e.target.value
                                            )
                                        }
                                        placeholder="
                                            Search by order ID, name, customer or status...
                                        "
                                        className="
                                            w-full
                                            rounded-xl
                                            border
                                            border-neutral-200
                                            bg-white
                                            px-4
                                            py-3
                                            text-sm
                                            outline-none
                                            focus:border-black
                                        "
                                    />

                                </div>


                                <div className="
                                    overflow-hidden
                                    rounded-2xl
                                    border
                                    border-neutral-200
                                    bg-white
                                ">

                                    <div className="
                                        overflow-x-auto
                                    ">

                                        <table className="
                                            w-full
                                            min-w-[800px]
                                            text-sm
                                        ">

                                            <thead className="
                                                border-b
                                                border-neutral-200
                                                bg-neutral-50
                                            ">

                                                <tr>

                                                    <th className="
                                                        px-5
                                                        py-4
                                                        text-left
                                                        font-medium
                                                        text-neutral-500
                                                    ">
                                                        ID
                                                    </th>

                                                    <th className="
                                                        px-5
                                                        py-4
                                                        text-left
                                                        font-medium
                                                        text-neutral-500
                                                    ">
                                                        Order
                                                    </th>

                                                    <th className="
                                                        px-5
                                                        py-4
                                                        text-left
                                                        font-medium
                                                        text-neutral-500
                                                    ">
                                                        Customer
                                                    </th>

                                                    <th className="
                                                        px-5
                                                        py-4
                                                        text-left
                                                        font-medium
                                                        text-neutral-500
                                                    ">
                                                        Status
                                                    </th>

                                                    <th className="
                                                        px-5
                                                        py-4
                                                        text-right
                                                        font-medium
                                                        text-neutral-500
                                                    ">
                                                        Action
                                                    </th>

                                                </tr>

                                            </thead>


                                            <tbody>

                                                {filteredOrders.map(
                                                    order => (

                                                        <tr
                                                            key={order.id}
                                                            className="
                                                                border-b
                                                                border-neutral-100
                                                                last:border-0
                                                            "
                                                        >

                                                            <td className="
                                                                px-5
                                                                py-4
                                                                font-medium
                                                            ">
                                                                {order.id}
                                                            </td>

                                                            <td className="
                                                                px-5
                                                                py-4
                                                            ">
                                                                {order.orderName ||
                                                                    "—"}
                                                            </td>

                                                            <td className="
                                                                px-5
                                                                py-4
                                                            ">

                                                                <div>

                                                                    <p className="
                                                                        font-medium
                                                                    ">
                                                                        {order.userName ||
                                                                            "—"}
                                                                    </p>

                                                                    <p className="
                                                                        mt-1
                                                                        text-xs
                                                                        text-neutral-500
                                                                    ">
                                                                        {order.userEmail ||
                                                                            "—"}
                                                                    </p>

                                                                </div>

                                                            </td>

                                                            <td className="
                                                                px-5
                                                                py-4
                                                            ">

                                                                <StatusBadge
                                                                    status={
                                                                        order.status
                                                                    }
                                                                />

                                                            </td>

                                                            <td className="
                                                                px-5
                                                                py-4
                                                                text-right
                                                            ">

                                                                <button
                                                                    onClick={() =>
                                                                        handleViewOrder(
                                                                            order.id
                                                                        )
                                                                    }
                                                                    className="
                                                                        rounded-lg
                                                                        bg-black
                                                                        px-3
                                                                        py-2
                                                                        text-xs
                                                                        font-medium
                                                                        text-white
                                                                        hover:bg-neutral-800
                                                                    "
                                                                >
                                                                    View
                                                                </button>

                                                            </td>

                                                        </tr>

                                                    )
                                                )}

                                            </tbody>

                                        </table>

                                    </div>


                                    {filteredOrders.length === 0 && (

                                        <div className="
                                            px-6
                                            py-12
                                            text-center
                                            text-sm
                                            text-neutral-500
                                        ">
                                            No orders found.
                                        </div>

                                    )}

                                </div>

                            </section>

                        )}


                        {/* USERS */}

                        {activeSection === "users" && (

                            <section>

                                <div className="
                                    mb-6
                                ">

                                    <input
                                        value={userSearch}
                                        onChange={(e) =>
                                            setUserSearch(
                                                e.target.value
                                            )
                                        }
                                        placeholder="
                                            Search by name, email, ID or role...
                                        "
                                        className="
                                            w-full
                                            rounded-xl
                                            border
                                            border-neutral-200
                                            bg-white
                                            px-4
                                            py-3
                                            text-sm
                                            outline-none
                                            focus:border-black
                                        "
                                    />

                                </div>


                                <div className="
                                    overflow-hidden
                                    rounded-2xl
                                    border
                                    border-neutral-200
                                    bg-white
                                ">

                                    <div className="
                                        overflow-x-auto
                                    ">

                                        <table className="
                                            w-full
                                            min-w-[650px]
                                            text-sm
                                        ">

                                            <thead className="
                                                border-b
                                                border-neutral-200
                                                bg-neutral-50
                                            ">

                                                <tr>

                                                    <th className="
                                                        px-5
                                                        py-4
                                                        text-left
                                                        font-medium
                                                        text-neutral-500
                                                    ">
                                                        ID
                                                    </th>

                                                    <th className="
                                                        px-5
                                                        py-4
                                                        text-left
                                                        font-medium
                                                        text-neutral-500
                                                    ">
                                                        Name
                                                    </th>

                                                    <th className="
                                                        px-5
                                                        py-4
                                                        text-left
                                                        font-medium
                                                        text-neutral-500
                                                    ">
                                                        Email
                                                    </th>

                                                    <th className="
                                                        px-5
                                                        py-4
                                                        text-left
                                                        font-medium
                                                        text-neutral-500
                                                    ">
                                                        Role
                                                    </th>

                                                </tr>

                                            </thead>


                                            <tbody>

                                                {filteredUsers.map(
                                                    user => (

                                                        <tr
                                                            key={user.id}
                                                            className="
                                                                border-b
                                                                border-neutral-100
                                                                last:border-0
                                                            "
                                                        >

                                                            <td className="
                                                                px-5
                                                                py-4
                                                            ">
                                                                {user.id}
                                                            </td>

                                                            <td className="
                                                                px-5
                                                                py-4
                                                                font-medium
                                                            ">
                                                                {user.name ||
                                                                    "—"}
                                                            </td>

                                                            <td className="
                                                                px-5
                                                                py-4
                                                            ">
                                                                {user.email ||
                                                                    "—"}
                                                            </td>

                                                            <td className="
                                                                px-5
                                                                py-4
                                                            ">

                                                                <span className="
                                                                    rounded-full
                                                                    bg-neutral-100
                                                                    px-3
                                                                    py-1
                                                                    text-xs
                                                                    font-medium
                                                                ">
                                                                    {user.role ||
                                                                        "—"}
                                                                </span>

                                                            </td>

                                                        </tr>

                                                    )
                                                )}

                                            </tbody>

                                        </table>

                                    </div>


                                    {filteredUsers.length === 0 && (

                                        <div className="
                                            px-6
                                            py-12
                                            text-center
                                            text-sm
                                            text-neutral-500
                                        ">
                                            No users found.
                                        </div>

                                    )}

                                </div>

                            </section>

                        )}


                        {/* RATES */}

                        {activeSection === "rates" && (

                            <section className="
                                max-w-2xl
                            ">

                                <div className="
                                    mb-6
                                ">

                                    <h3 className="
                                        text-lg
                                        font-semibold
                                    ">
                                        Delivery rates
                                    </h3>

                                    <p className="
                                        mt-1
                                        text-sm
                                        text-neutral-500
                                    ">
                                        Update the rates used by NimbusGO
                                        for calculating delivery charges.
                                    </p>

                                </div>


                                <form
                                    onSubmit={handleChangeRates}
                                    className="
                                        space-y-5
                                        rounded-2xl
                                        border
                                        border-neutral-200
                                        bg-white
                                        p-6
                                    "
                                >

                                    <NumberInput
                                        label="Distance rate"
                                        value={rateDistance}
                                        onChange={setRateDistance}
                                        placeholder="Rate per km"
                                    />

                                    <NumberInput
                                        label="Dimension rate"
                                        value={rateDimensions}
                                        onChange={setRateDimensions}
                                        placeholder="Rate by volume"
                                    />

                                    <NumberInput
                                        label="Weight rate"
                                        value={rateWeight}
                                        onChange={setRateWeight}
                                        placeholder="Rate per kg"
                                    />


                                    <button
                                        type="submit"
                                        disabled={rateLoading}
                                        className="
                                            w-full
                                            rounded-xl
                                            bg-black
                                            px-5
                                            py-3
                                            text-sm
                                            font-semibold
                                            text-white
                                            transition
                                            hover:bg-neutral-800
                                            disabled:cursor-not-allowed
                                            disabled:opacity-50
                                        "
                                    >
                                        {rateLoading
                                            ? "Saving..."
                                            : "Save rates"}
                                    </button>

                                </form>

                            </section>

                        )}


                        {/* CHECKPOINTS */}

                        {activeSection === "checkpoints" && (

                            <section className="
                                max-w-4xl
                            ">

                                <div className="
                                    mb-6
                                ">

                                    <h3 className="
                                        text-lg
                                        font-semibold
                                    ">
                                        Add checkpoint
                                    </h3>

                                    <p className="
                                        mt-1
                                        text-sm
                                        text-neutral-500
                                    ">
                                        Create a checkpoint by selecting
                                        its location directly on the map.
                                    </p>

                                </div>


                                <form
                                    onSubmit={
                                        handleAddCheckpoint
                                    }
                                    className="
                                        space-y-5
                                        rounded-2xl
                                        border
                                        border-neutral-200
                                        bg-white
                                        p-6
                                    "
                                >

                                    <TextInput
                                        label="Checkpoint name"
                                        value={checkpointName}
                                        onChange={
                                            setCheckpointName
                                        }
                                        placeholder="Srinagar Hub"
                                    />


                                    <TextInput
                                        label="Checkpoint details"
                                        value={checkpointDetail}
                                        onChange={
                                            setCheckpointDetail
                                        }
                                        placeholder="Main sorting facility"
                                    />


                                    {/* MAP */}

                                    <div>

                                        <label className="
                                            mb-2
                                            block
                                            text-sm
                                            font-medium
                                        ">
                                            Select checkpoint location
                                        </label>

                                        <div className="
                                            overflow-hidden
                                            rounded-xl
                                            border
                                            border-neutral-200
                                        ">

                                            <MapContainer
                                                center={[
                                                    20.5937,
                                                    78.9629
                                                ]}
                                                zoom={5}
                                                scrollWheelZoom={true}
                                                style={{
                                                    height: "400px",
                                                    width: "100%"
                                                }}
                                            >

                                                <TileLayer
                                                    attribution="&copy; OpenStreetMap contributors"
                                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                                />

                                                <MapClickHandler
                                                    onLocationSelect={
                                                        handleMapLocationSelect
                                                    }
                                                />

                                                {latitude &&
                                                    longitude && (

                                                        <Marker
                                                            position={[
                                                                Number(
                                                                    latitude
                                                                ),
                                                                Number(
                                                                    longitude
                                                                )
                                                            ]}
                                                            icon={
                                                                checkpointIcon
                                                            }
                                                        />

                                                    )}

                                            </MapContainer>

                                        </div>

                                    </div>


                                    {/* COORDINATES */}

                                    <div className="
                                        grid
                                        gap-3
                                        sm:grid-cols-2
                                    ">

                                        <div className="
                                            rounded-xl
                                            bg-neutral-50
                                            p-4
                                        ">

                                            <p className="
                                                text-xs
                                                text-neutral-500
                                            ">
                                                Latitude
                                            </p>

                                            <p className="
                                                mt-1
                                                font-medium
                                            ">
                                                {latitude ||
                                                    "Click on map"}
                                            </p>

                                        </div>


                                        <div className="
                                            rounded-xl
                                            bg-neutral-50
                                            p-4
                                        ">

                                            <p className="
                                                text-xs
                                                text-neutral-500
                                            ">
                                                Longitude
                                            </p>

                                            <p className="
                                                mt-1
                                                font-medium
                                            ">
                                                {longitude ||
                                                    "Click on map"}
                                            </p>

                                        </div>

                                    </div>


                                    <button
                                        type="submit"
                                        disabled={
                                            addCheckpointLoading
                                        }
                                        className="
                                            w-full
                                            rounded-xl
                                            bg-black
                                            px-5
                                            py-3
                                            text-sm
                                            font-semibold
                                            text-white
                                            transition
                                            hover:bg-neutral-800
                                            disabled:cursor-not-allowed
                                            disabled:opacity-50
                                        "
                                    >
                                        {addCheckpointLoading
                                            ? "Creating..."
                                            : "Create checkpoint"}
                                    </button>

                                </form>


                                {/* EXISTING CHECKPOINTS */}

                                <div className="
                                    mt-6
                                    rounded-2xl
                                    border
                                    border-neutral-200
                                    bg-white
                                    p-6
                                ">

                                    <div className="
                                        mb-5
                                    ">

                                        <h3 className="
                                            font-semibold
                                        ">
                                            Existing checkpoints
                                        </h3>

                                        <p className="
                                            mt-1
                                            text-sm
                                            text-neutral-500
                                        ">
                                            {checkpoints.length} checkpoint
                                            {checkpoints.length === 1
                                                ? ""
                                                : "s"}{" "}
                                            available.
                                        </p>

                                    </div>


                                    {checkpoints.length === 0 ? (

                                        <p className="
                                            text-sm
                                            text-neutral-500
                                        ">
                                            No checkpoints created yet.
                                        </p>

                                    ) : (

                                        <div className="
                                            space-y-3
                                        ">

                                            {checkpoints.map(
                                                checkpoint => (

                                                    <div
                                                        key={
                                                            checkpoint.id
                                                        }
                                                        className="
                                                            rounded-xl
                                                            bg-neutral-50
                                                            p-4
                                                        "
                                                    >

                                                        <div className="
                                                            flex
                                                            flex-col
                                                            gap-2
                                                            sm:flex-row
                                                            sm:items-center
                                                            sm:justify-between
                                                        ">

                                                            <div>

                                                                <p className="
                                                                    font-medium
                                                                ">
                                                                    {
                                                                        checkpoint.checkpointName
                                                                    }
                                                                </p>

                                                                <p className="
                                                                    mt-1
                                                                    text-sm
                                                                    text-neutral-500
                                                                ">
                                                                    {
                                                                        checkpoint.checkpointDetail
                                                                    }
                                                                </p>

                                                            </div>


                                                            <div className="
                                                                text-xs
                                                                text-neutral-500
                                                            ">

                                                                <p>
                                                                    Lat:{" "}
                                                                    {
                                                                        checkpoint.latitude
                                                                    }
                                                                </p>

                                                                <p>
                                                                    Lng:{" "}
                                                                    {
                                                                        checkpoint.longitude
                                                                    }
                                                                </p>

                                                            </div>

                                                        </div>

                                                    </div>

                                                )
                                            )}

                                        </div>

                                    )}

                                </div>

                            </section>

                        )}

                    </div>

                </main>

            </div>


            {/* ORDER MODAL */}

            {selectedOrder && (

                <div className="
                    fixed
                    inset-0
                    z-50
                    flex
                    items-center
                    justify-center
                    bg-black/40
                    px-5
                    py-5
                ">

                    <div className="
                        max-h-[92vh]
                        w-full
                        max-w-2xl
                        overflow-y-auto
                        rounded-2xl
                        bg-white
                        p-6
                        shadow-xl
                    ">

                        <div className="
                            flex
                            items-start
                            justify-between
                            gap-4
                        ">

                            <div>

                                <p className="
                                    text-xs
                                    uppercase
                                    tracking-wider
                                    text-neutral-400
                                ">
                                    Order
                                </p>

                                <h3 className="
                                    mt-1
                                    text-xl
                                    font-bold
                                ">
                                    {selectedOrder.orderName ||
                                        `#${selectedOrder.id}`}
                                </h3>

                            </div>


                            <button
                                onClick={() => {

                                    setSelectedOrder(null);
                                    setCheckpointId("");

                                }}
                                className="
                                    rounded-lg
                                    px-2
                                    py-1
                                    text-neutral-500
                                    hover:bg-neutral-100
                                "
                            >
                                ✕
                            </button>

                        </div>


                        {/* ORDER INFORMATION */}

                        <div className="
                            mt-6
                            grid
                            gap-3
                            sm:grid-cols-2
                        ">

                            <div className="
                                rounded-xl
                                bg-neutral-50
                                p-4
                            ">

                                <p className="
                                    text-xs
                                    font-medium
                                    uppercase
                                    tracking-wide
                                    text-neutral-500
                                ">
                                    Customer
                                </p>

                                <p className="
                                    mt-2
                                    font-semibold
                                ">
                                    {selectedOrder.userName ||
                                        "Unknown User"}
                                </p>

                                <p className="
                                    mt-1
                                    text-sm
                                    text-neutral-500
                                ">
                                    {selectedOrder.userEmail ||
                                        "Unknown Email"}
                                </p>

                            </div>


                            <div className="
                                rounded-xl
                                bg-neutral-50
                                p-4
                            ">

                                <p className="
                                    text-xs
                                    font-medium
                                    uppercase
                                    tracking-wide
                                    text-neutral-500
                                ">
                                    Order ID
                                </p>

                                <p className="
                                    mt-2
                                    break-all
                                    font-mono
                                    text-sm
                                ">
                                    {selectedOrder.id}
                                </p>

                            </div>

                        </div>


                        {/* STATUS */}

                        <div className="
                            mt-3
                            rounded-xl
                            bg-neutral-50
                            p-4
                        ">

                            <div className="
                                flex
                                items-center
                                justify-between
                            ">

                                <span className="
                                    text-sm
                                    text-neutral-500
                                ">
                                    Current status
                                </span>

                                <StatusBadge
                                    status={
                                        selectedOrder.status
                                    }
                                />

                            </div>

                        </div>


                        {/* CHANGE STATUS */}

                        <div className="
                            mt-6
                        ">

                            <label className="
                                mb-2
                                block
                                text-sm
                                font-medium
                            ">
                                Change status
                            </label>

                            <div className="
                                flex
                                flex-col
                                gap-2
                                sm:flex-row
                            ">

                                <select
                                    value={newStatus}
                                    onChange={(e) =>
                                        setNewStatus(
                                            e.target.value
                                        )
                                    }
                                    className="
                                        min-w-0
                                        flex-1
                                        rounded-xl
                                        border
                                        border-neutral-200
                                        bg-white
                                        px-4
                                        py-3
                                        text-sm
                                        outline-none
                                        focus:border-black
                                    "
                                >

                                    <option value="">
                                        Select status
                                    </option>

                                    <option value="ACCEPTED">
                                        ACCEPTED
                                    </option>

                                    <option value="PROCESSING">
                                        PROCESSING
                                    </option>

                                    <option value="IN_TRANSIT">
                                        IN_TRANSIT
                                    </option>

                                    <option value="REJECTED">
                                        REJECTED
                                    </option>

                                    <option value="FAILED">
                                        FAILED
                                    </option>

                                </select>


                                <button
                                    onClick={
                                        handleChangeStatus
                                    }
                                    disabled={
                                        statusLoading
                                    }
                                    className="
                                        rounded-xl
                                        bg-black
                                        px-4
                                        py-3
                                        text-sm
                                        font-semibold
                                        text-white
                                        disabled:opacity-50
                                    "
                                >
                                    {statusLoading
                                        ? "Updating..."
                                        : "Update"}
                                </button>

                            </div>

                        </div>


                        {/* UPDATE CHECKPOINT */}

                        <div className="
                            mt-6
                            rounded-2xl
                            border
                            border-neutral-200
                            p-5
                        ">

                            <div className="
                                mb-4
                            ">

                                <label className="
                                    block
                                    text-sm
                                    font-medium
                                ">
                                    Update checkpoint
                                </label>

                                <p className="
                                    mt-1
                                    text-xs
                                    text-neutral-500
                                ">
                                    Select an existing checkpoint
                                    and view its location on the map.
                                </p>

                            </div>


                            {/* CHECKPOINT SELECT */}

                            <select
                                value={checkpointId}
                                onChange={(e) =>
                                    setCheckpointId(
                                        e.target.value
                                    )
                                }
                                className="
                                    w-full
                                    rounded-xl
                                    border
                                    border-neutral-200
                                    bg-white
                                    px-4
                                    py-3
                                    text-sm
                                    outline-none
                                    focus:border-black
                                "
                            >

                                <option value="">
                                    Select checkpoint
                                </option>

                                {checkpoints.map(
                                    checkpoint => (

                                        <option
                                            key={
                                                checkpoint.id
                                            }
                                            value={
                                                checkpoint.id
                                            }
                                        >
                                            {
                                                checkpoint.checkpointName
                                            }
                                        </option>

                                    )
                                )}

                            </select>


                            {/* CHECKPOINT MAP */}

                            {selectedCheckpoint ? (

                                <div className="
                                    mt-4
                                ">

                                    <div className="
                                        overflow-hidden
                                        rounded-xl
                                        border
                                        border-neutral-200
                                    ">

                                        <MapContainer
                                            center={
                                                selectedCheckpointPosition
                                            }
                                            zoom={14}
                                            scrollWheelZoom={true}
                                            style={{
                                                height: "350px",
                                                width: "100%"
                                            }}
                                        >

                                            <TileLayer
                                                attribution="&copy; OpenStreetMap contributors"
                                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                            />

                                            <MapCenterUpdater
                                                position={
                                                    selectedCheckpointPosition
                                                }
                                                zoom={14}
                                            />

                                            <Marker
                                                position={
                                                    selectedCheckpointPosition
                                                }
                                                icon={
                                                    checkpointIcon
                                                }
                                            />

                                        </MapContainer>

                                    </div>


                                    {/* CHECKPOINT DETAILS */}

                                    <div className="
                                        mt-3
                                        rounded-xl
                                        bg-neutral-50
                                        p-4
                                    ">

                                        <p className="
                                            font-semibold
                                        ">
                                            {
                                                selectedCheckpoint.checkpointName
                                            }
                                        </p>

                                        <p className="
                                            mt-1
                                            text-sm
                                            text-neutral-500
                                        ">
                                            {
                                                selectedCheckpoint.checkpointDetail
                                            }
                                        </p>

                                        <div className="
                                            mt-3
                                            grid
                                            grid-cols-2
                                            gap-3
                                        ">

                                            <div>

                                                <p className="
                                                    text-xs
                                                    text-neutral-500
                                                ">
                                                    Latitude
                                                </p>

                                                <p className="
                                                    mt-1
                                                    text-sm
                                                    font-medium
                                                ">
                                                    {
                                                        selectedCheckpoint.latitude
                                                    }
                                                </p>

                                            </div>


                                            <div>

                                                <p className="
                                                    text-xs
                                                    text-neutral-500
                                                ">
                                                    Longitude
                                                </p>

                                                <p className="
                                                    mt-1
                                                    text-sm
                                                    font-medium
                                                ">
                                                    {
                                                        selectedCheckpoint.longitude
                                                    }
                                                </p>

                                            </div>

                                        </div>

                                    </div>


                                    <button
                                        onClick={
                                            handleUpdateCheckpoint
                                        }
                                        disabled={
                                            checkpointLoading
                                        }
                                        className="
                                            mt-4
                                            w-full
                                            rounded-xl
                                            bg-black
                                            px-4
                                            py-3
                                            text-sm
                                            font-semibold
                                            text-white
                                            disabled:cursor-not-allowed
                                            disabled:opacity-50
                                        "
                                    >
                                        {checkpointLoading
                                            ? "Updating checkpoint..."
                                            : "Assign checkpoint to order"}
                                    </button>

                                </div>

                            ) : (

                                <div className="
                                    mt-4
                                    rounded-xl
                                    bg-neutral-50
                                    p-6
                                    text-center
                                ">

                                    <p className="
                                        text-sm
                                        text-neutral-500
                                    ">
                                        Select a checkpoint to
                                        view its location on the map.
                                    </p>

                                </div>

                            )}

                        </div>

                    </div>

                </div>

            )}

        </div>
    );
}


/*
|--------------------------------------------------------------------------
| SIDEBAR BUTTON
|--------------------------------------------------------------------------
*/

function SidebarButton({
    label,
    active,
    onClick
}) {

    return (

        <button
            onClick={onClick}
            className={`
                w-full
                rounded-xl
                px-4
                py-3
                text-left
                text-sm
                font-medium
                transition
                ${
                    active
                        ? "bg-black text-white"
                        : "text-neutral-600 hover:bg-neutral-100"
                }
            `}
        >
            {label}
        </button>

    );
}


/*
|--------------------------------------------------------------------------
| STAT CARD
|--------------------------------------------------------------------------
*/

function StatCard({
    label,
    value
}) {

    return (

        <div className="
            rounded-2xl
            border
            border-neutral-200
            bg-white
            p-5
        ">

            <p className="
                text-sm
                text-neutral-500
            ">
                {label}
            </p>

            <p className="
                mt-2
                text-3xl
                font-bold
                tracking-tight
            ">
                {value}
            </p>

        </div>

    );
}


/*
|--------------------------------------------------------------------------
| MINI STAT
|--------------------------------------------------------------------------
*/

function MiniStat({
    label,
    value
}) {

    return (

        <div className="
            rounded-xl
            border
            border-neutral-200
            p-4
        ">

            <p className="
                text-xs
                text-neutral-500
            ">
                {label}
            </p>

            <p className="
                mt-1
                text-xl
                font-bold
            ">
                {value}
            </p>

        </div>

    );
}


/*
|--------------------------------------------------------------------------
| STATUS BADGE
|--------------------------------------------------------------------------
*/

function StatusBadge({
    status
}) {

    return (

        <span className="
            inline-flex
            rounded-full
            bg-neutral-100
            px-3
            py-1
            text-xs
            font-medium
        ">
            {status || "UNKNOWN"}
        </span>

    );
}


/*
|--------------------------------------------------------------------------
| TEXT INPUT
|--------------------------------------------------------------------------
*/

function TextInput({
    label,
    value,
    onChange,
    placeholder
}) {

    return (

        <div>

            <label className="
                mb-2
                block
                text-sm
                font-medium
            ">
                {label}
            </label>

            <input
                value={value}
                onChange={(e) =>
                    onChange(e.target.value)
                }
                placeholder={placeholder}
                className="
                    w-full
                    rounded-xl
                    border
                    border-neutral-200
                    bg-white
                    px-4
                    py-3
                    text-sm
                    outline-none
                    focus:border-black
                "
            />

        </div>

    );
}


/*
|--------------------------------------------------------------------------
| NUMBER INPUT
|--------------------------------------------------------------------------
*/

function NumberInput({
    label,
    value,
    onChange,
    placeholder
}) {

    return (

        <div>

            <label className="
                mb-2
                block
                text-sm
                font-medium
            ">
                {label}
            </label>

            <input
                type="number"
                value={value}
                onChange={(e) =>
                    onChange(e.target.value)
                }
                placeholder={placeholder}
                className="
                    w-full
                    rounded-xl
                    border
                    border-neutral-200
                    bg-white
                    px-4
                    py-3
                    text-sm
                    outline-none
                    focus:border-black
                "
            />

        </div>

    );
}