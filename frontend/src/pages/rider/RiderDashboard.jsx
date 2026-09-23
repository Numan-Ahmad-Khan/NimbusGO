import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    getRiderMe,
    updateRiderLocation,
    getNearbyOrders
} from "../../services/rider";

import { LogoOnly } from "../../components/Logo";
import SwipeButton from "../../components/SwipeButton";

export default function RiderDashboard() {
    const navigate = useNavigate();

    const [rider, setRider] = useState(null);

    const [orders, setOrders] = useState([]);
    const [ordersLoading, setOrdersLoading] = useState(true);
    const [ordersError, setOrdersError] = useState("");

    const [online, setOnline] = useState(true);
    const [locationLoading, setLocationLoading] = useState(false);

    const [activeOrder, setActiveOrder] = useState(null);
    const [acceptedOrders, setAcceptedOrders] = useState([]);

    useEffect(() => {
        loadDashboard();
    }, []);

    async function loadDashboard() {
        await Promise.all([
            loadRider(),
            loadNearbyOrders()
        ]);
    }

    async function loadRider() {
        try {
            const data = await getRiderMe();

            setRider(data.rider);

        } catch (error) {
            console.error(error);

            if (
                error.message.toLowerCase().includes("token")
            ) {
                handleLogout();
            }
        }
    }

    async function loadNearbyOrders() {
        try {
            setOrdersLoading(true);
            setOrdersError("");

            const data = await getNearbyOrders();

            setOrders(data.orders || []);

        } catch (error) {
            console.error(error);

            setOrdersError(
                error.message || "Failed to load orders."
            );

        } finally {
            setOrdersLoading(false);
        }
    }

    function handleLogout() {
        localStorage.removeItem("token");
        localStorage.removeItem("riderId");

        navigate("/rider/login", {
            replace: true
        });
    }

    function updateLocation() {
        if (!navigator.geolocation) {
            alert(
                "Geolocation is not supported by this browser."
            );

            return;
        }

        setLocationLoading(true);

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                try {
                    const latitude =
                        position.coords.latitude;

                    const longitude =
                        position.coords.longitude;

                    await updateRiderLocation(
                        latitude,
                        longitude
                    );

                    setRider((previous) => ({
                        ...previous,
                        latitude,
                        longitude
                    }));

                    await loadNearbyOrders();

                } catch (error) {
                    alert(error.message);

                } finally {
                    setLocationLoading(false);
                }
            },
            () => {
                alert(
                    "Unable to get your current location."
                );

                setLocationLoading(false);
            }
        );
    }

    function handleAccept(order) {
        setActiveOrder(order);

        setAcceptedOrders((previous) => [
            ...previous,
            order.id
        ]);
    }

    function isAccepted(orderId) {
        return acceptedOrders.includes(orderId);
    }

    return (
        <div className="min-h-screen bg-[#fafafa] text-black">

            {/* HEADER */}

            <header className="border-b border-black/10 bg-white">
                <div className="
                    mx-auto flex max-w-6xl
                    items-center justify-between
                    px-5 py-4
                ">

                    <LogoOnly />

                    <div className="flex items-center gap-3">

                        <div className="
                            hidden text-right
                            sm:block
                        ">
                            <p className="text-sm font-semibold">
                                {rider?.name || "Rider"}
                            </p>

                            <p className="
                                text-xs text-black/50
                            ">
                                {rider?.email || ""}
                            </p>
                        </div>

                        <button
                            onClick={handleLogout}
                            className="
                                rounded-xl
                                border border-black/10
                                bg-white
                                px-4 py-2
                                text-sm font-medium
                                transition
                                hover:bg-black hover:text-white
                            "
                        >
                            Logout
                        </button>

                    </div>
                </div>
            </header>


            {/* MAIN */}

            <main className="
                mx-auto max-w-6xl
                px-5 py-8
            ">

                {/* TOP SECTION */}

                <div className="
                    mb-8 flex
                    flex-col gap-5
                    sm:flex-row
                    sm:items-center
                    sm:justify-between
                ">

                    <div>
                        <p className="
                            mb-1 text-sm
                            text-black/50
                        ">
                            Rider Dashboard
                        </p>

                        <h1 className="
                            text-3xl
                            font-bold
                            tracking-tight
                        ">
                            Hello, {rider?.name || "Rider"}
                        </h1>

                        <p className="
                            mt-2 text-sm
                            text-black/50
                        ">
                            Find nearby deliveries and
                            manage your active orders.
                        </p>
                    </div>


                    {/* ONLINE STATUS */}

                    <div className="
                        flex items-center
                        gap-3
                        rounded-2xl
                        border border-black/10
                        bg-white
                        px-4 py-3
                    ">

                        <div
                            className={`
                                h-3 w-3 rounded-full
                                ${
                                    online
                                        ? "bg-green-500"
                                        : "bg-black/20"
                                }
                            `}
                        />

                        <div>
                            <p className="
                                text-sm font-semibold
                            ">
                                {online
                                    ? "Online"
                                    : "Offline"}
                            </p>

                            <p className="
                                text-xs text-black/50
                            ">
                                {online
                                    ? "Available for orders"
                                    : "Not accepting orders"}
                            </p>
                        </div>

                        <button
                            onClick={() =>
                                setOnline(!online)
                            }
                            className="
                                ml-2 rounded-xl
                                border border-black/10
                                px-3 py-1.5
                                text-xs font-medium
                                transition
                                hover:bg-black
                                hover:text-white
                            "
                        >
                            {online
                                ? "Go offline"
                                : "Go online"}
                        </button>

                    </div>

                </div>


                {/* STATS */}

                <div className="
                    mb-8 grid
                    grid-cols-2
                    gap-4
                    md:grid-cols-4
                ">

                    <div className="
                        rounded-2xl
                        border border-black/10
                        bg-white
                        p-5
                    ">
                        <p className="
                            text-xs
                            text-black/50
                        ">
                            Today's Orders
                        </p>

                        <p className="
                            mt-2 text-2xl
                            font-bold
                        ">
                            0
                        </p>
                    </div>


                    <div className="
                        rounded-2xl
                        border border-black/10
                        bg-white
                        p-5
                    ">
                        <p className="
                            text-xs
                            text-black/50
                        ">
                            Today's Earnings
                        </p>

                        <p className="
                            mt-2 text-2xl
                            font-bold
                        ">
                            ₹0
                        </p>
                    </div>


                    <div className="
                        rounded-2xl
                        border border-black/10
                        bg-white
                        p-5
                    ">
                        <p className="
                            text-xs
                            text-black/50
                        ">
                            Nearby Orders
                        </p>

                        <p className="
                            mt-2 text-2xl
                            font-bold
                        ">
                            {orders.length}
                        </p>
                    </div>


                    <div className="
                        rounded-2xl
                        border border-black/10
                        bg-white
                        p-5
                    ">
                        <p className="
                            text-xs
                            text-black/50
                        ">
                            Rider Status
                        </p>

                        <p className="
                            mt-2 text-2xl
                            font-bold
                        ">
                            {rider?.status || "FREE"}
                        </p>
                    </div>

                </div>


                {/* LOCATION */}

                <div className="
                    mb-8 flex
                    flex-col gap-4
                    rounded-2xl
                    border border-black/10
                    bg-white
                    p-5
                    sm:flex-row
                    sm:items-center
                    sm:justify-between
                ">

                    <div>

                        <p className="
                            text-sm
                            font-semibold
                        ">
                            Current Location
                        </p>

                        <p className="
                            mt-1 text-xs
                            text-black/50
                        ">
                            {rider?.latitude &&
                            rider?.longitude
                                ? `${rider.latitude}, ${rider.longitude}`
                                : "Location unavailable"}
                        </p>

                    </div>


                    <button
                        onClick={updateLocation}
                        disabled={locationLoading}
                        className="
                            rounded-xl
                            bg-black
                            px-5 py-3
                            text-sm font-medium
                            text-white
                            transition
                            hover:bg-black/80
                            disabled:cursor-not-allowed
                            disabled:opacity-50
                        "
                    >
                        {locationLoading
                            ? "Updating..."
                            : "Update Location"}
                    </button>

                </div>


                {/* ACTIVE ORDER */}

                {activeOrder && (
                    <section className="mb-8">

                        <div className="mb-4">
                            <p className="
                                text-xs
                                font-medium
                                uppercase
                                tracking-wider
                                text-black/40
                            ">
                                Active Order
                            </p>

                            <h2 className="
                                mt-1 text-xl
                                font-bold
                            ">
                                {activeOrder.orderName}
                            </h2>
                        </div>


                        <div className="
                            rounded-2xl
                            border border-black/10
                            bg-white
                            p-5
                        ">

                            <div className="
                                grid gap-5
                                sm:grid-cols-2
                            ">

                                <div>
                                    <p className="
                                        text-xs
                                        text-black/40
                                    ">
                                        Pickup
                                    </p>

                                    <p className="
                                        mt-1 text-sm
                                        font-medium
                                    ">
                                        {activeOrder.pickup?.street ||
                                            "Pickup address"}
                                    </p>
                                </div>


                                <div>
                                    <p className="
                                        text-xs
                                        text-black/40
                                    ">
                                        Drop
                                    </p>

                                    <p className="
                                        mt-1 text-sm
                                        font-medium
                                    ">
                                        {activeOrder.drop ||
                                            "Drop address"}
                                    </p>
                                </div>

                            </div>


                            <div className="
                                mt-5 flex
                                flex-wrap gap-2
                            ">

                                <span className="
                                    rounded-lg
                                    bg-black/5
                                    px-3 py-2
                                    text-xs
                                ">
                                    Accepted
                                </span>

                                <span className="
                                    rounded-lg
                                    bg-black/5
                                    px-3 py-2
                                    text-xs
                                ">
                                    Pickup
                                </span>

                                <span className="
                                    rounded-lg
                                    bg-black/5
                                    px-3 py-2
                                    text-xs
                                ">
                                    In Transit
                                </span>

                                <span className="
                                    rounded-lg
                                    bg-black/5
                                    px-3 py-2
                                    text-xs
                                ">
                                    Delivered
                                </span>

                            </div>

                        </div>

                    </section>
                )}


                {/* NEARBY ORDERS */}

                <section>

                    <div className="
                        mb-5 flex
                        items-end
                        justify-between
                    ">

                        <div>

                            <p className="
                                text-xs
                                font-medium
                                uppercase
                                tracking-wider
                                text-black/40
                            ">
                                Available Deliveries
                            </p>

                            <h2 className="
                                mt-1 text-2xl
                                font-bold
                                tracking-tight
                            ">
                                Nearby Orders
                            </h2>

                        </div>


                        <button
                            onClick={loadNearbyOrders}
                            disabled={ordersLoading}
                            className="
                                rounded-xl
                                border border-black/10
                                bg-white
                                px-4 py-2
                                text-sm font-medium
                                transition
                                hover:bg-black
                                hover:text-white
                                disabled:opacity-50
                            "
                        >
                            Refresh
                        </button>

                    </div>


                    {/* LOADING */}

                    {ordersLoading && (
                        <div className="
                            rounded-2xl
                            border border-black/10
                            bg-white
                            p-10
                            text-center
                        ">
                            <p className="
                                text-sm
                                text-black/50
                            ">
                                Loading nearby orders...
                            </p>
                        </div>
                    )}


                    {/* ERROR */}

                    {!ordersLoading &&
                        ordersError && (
                            <div className="
                                rounded-2xl
                                border border-red-200
                                bg-red-50
                                p-5
                            ">
                                <p className="
                                    text-sm
                                    font-medium
                                    text-red-600
                                ">
                                    {ordersError}
                                </p>

                                <button
                                    onClick={loadNearbyOrders}
                                    className="
                                        mt-3
                                        rounded-xl
                                        bg-black
                                        px-4 py-2
                                        text-sm
                                        text-white
                                    "
                                >
                                    Try Again
                                </button>
                            </div>
                        )}


                    {/* EMPTY */}

                    {!ordersLoading &&
                        !ordersError &&
                        orders.length === 0 && (
                            <div className="
                                rounded-2xl
                                border border-black/10
                                bg-white
                                p-10
                                text-center
                            ">

                                <p className="
                                    text-lg
                                    font-semibold
                                ">
                                    No nearby orders
                                </p>

                                <p className="
                                    mt-2 text-sm
                                    text-black/50
                                ">
                                    New paid deliveries will
                                    appear here.
                                </p>

                            </div>
                        )}


                    {/* ORDERS */}

                    {!ordersLoading &&
                        !ordersError &&
                        orders.length > 0 && (

                            <div className="
                                grid gap-5
                                lg:grid-cols-2
                            ">

                                {orders.map((order) => {

                                    const accepted =
                                        isAccepted(order.id);

                                    return (
                                        <div
                                            key={order.id}
                                            className="
                                                rounded-2xl
                                                border
                                                border-black/10
                                                bg-white
                                                p-5
                                            "
                                        >

                                            {/* ORDER HEADER */}

                                            <div className="
                                                flex
                                                items-start
                                                justify-between
                                                gap-4
                                            ">

                                                <div>

                                                    <p className="
                                                        text-xs
                                                        text-black/40
                                                    ">
                                                        Delivery
                                                    </p>

                                                    <h3 className="
                                                        mt-1
                                                        text-lg
                                                        font-bold
                                                    ">
                                                        {order.orderName}
                                                    </h3>

                                                </div>


                                                <div className="
                                                    rounded-xl
                                                    bg-black
                                                    px-3 py-2
                                                    text-right
                                                    text-white
                                                ">

                                                    <p className="
                                                        text-[10px]
                                                        opacity-60
                                                    ">
                                                        Distance
                                                    </p>

                                                    <p className="
                                                        text-sm
                                                        font-semibold
                                                    ">
                                                        {order.distance} km
                                                    </p>

                                                </div>

                                            </div>


                                            {/* ROUTE */}

                                            <div className="
                                                mt-5
                                                space-y-4
                                            ">

                                                <div className="
                                                    flex gap-3
                                                ">

                                                    <div className="
                                                        mt-1
                                                        h-2.5 w-2.5
                                                        shrink-0
                                                        rounded-full
                                                        bg-black
                                                    " />

                                                    <div>

                                                        <p className="
                                                            text-xs
                                                            text-black/40
                                                        ">
                                                            Pickup
                                                        </p>

                                                        <p className="
                                                            mt-1
                                                            text-sm
                                                            font-medium
                                                        ">
                                                            {order.pickup?.street ||
                                                                "Pickup address"}
                                                        </p>

                                                        {order.pickup?.landmark && (
                                                            <p className="
                                                                mt-1
                                                                text-xs
                                                                text-black/50
                                                            ">
                                                                {order.pickup.landmark}
                                                            </p>
                                                        )}

                                                    </div>

                                                </div>


                                                <div className="
                                                    ml-1
                                                    h-5
                                                    border-l
                                                    border-dashed
                                                    border-black/20
                                                " />


                                                <div className="
                                                    flex gap-3
                                                ">

                                                    <div className="
                                                        mt-1
                                                        h-2.5 w-2.5
                                                        shrink-0
                                                        rounded-full
                                                        border-2
                                                        border-black
                                                    " />

                                                    <div>

                                                        <p className="
                                                            text-xs
                                                            text-black/40
                                                        ">
                                                            Drop
                                                        </p>

                                                        <p className="
                                                            mt-1
                                                            text-sm
                                                            font-medium
                                                            break-all
                                                        ">
                                                            {order.drop.street}
                                                        </p>

                                                    </div>

                                                </div>

                                            </div>


                                            {/* ORDER DETAILS */}

                                            <div className="
                                                mt-5
                                                grid grid-cols-3
                                                gap-2
                                            ">

                                                <div className="
                                                    rounded-xl
                                                    bg-black/[0.03]
                                                    p-3
                                                ">
                                                    <p className="
                                                        text-[10px]
                                                        text-black/40
                                                    ">
                                                        Weight
                                                    </p>

                                                    <p className="
                                                        mt-1 text-sm
                                                        font-semibold
                                                    ">
                                                        {order.orderWeight} kg
                                                    </p>
                                                </div>


                                                <div className="
                                                    rounded-xl
                                                    bg-black/[0.03]
                                                    p-3
                                                ">
                                                    <p className="
                                                        text-[10px]
                                                        text-black/40
                                                    ">
                                                        Size
                                                    </p>

                                                    <p className="
                                                        mt-1 text-sm
                                                        font-semibold
                                                    ">
                                                        {order.orderLength} ×{" "}
                                                        {order.orderBreadth} ×{" "}
                                                        {order.orderHeight}
                                                    </p>
                                                </div>


                                                <div className="
                                                    rounded-xl
                                                    bg-black/[0.03]
                                                    p-3
                                                ">
                                                    <p className="
                                                        text-[10px]
                                                        text-black/40
                                                    ">
                                                        Amount
                                                    </p>

                                                    <p className="
                                                        mt-1 text-sm
                                                        font-semibold
                                                    ">
                                                        ₹{order.finalAmount}
                                                    </p>
                                                </div>

                                            </div>


                                            {/* ORDER DETAILS TEXT */}

                                            {order.orderDetails && (
                                                <div className="
                                                    mt-4
                                                    rounded-xl
                                                    bg-black/[0.03]
                                                    p-3
                                                ">
                                                    <p className="
                                                        text-[10px]
                                                        text-black/40
                                                    ">
                                                        Details
                                                    </p>

                                                    <p className="
                                                        mt-1 text-sm
                                                        text-black/70
                                                    ">
                                                        {order.orderDetails}
                                                    </p>
                                                </div>
                                            )}


                                            {/* ACCEPT */}

                                            <div className="mt-5">

                                                {accepted ? (

                                                    <div className="
                                                        flex h-14
                                                        items-center
                                                        justify-center
                                                        rounded-2xl
                                                        bg-black
                                                        text-sm
                                                        font-medium
                                                        text-white
                                                    ">
                                                        Order accepted
                                                    </div>

                                                ) : (

                                                    <SwipeButton
                                                        onAccept={() =>
                                                            handleAccept(order)
                                                        }
                                                    />

                                                )}

                                            </div>

                                        </div>
                                    );
                                })}

                            </div>
                        )}

                </section>

            </main>

        </div>
    );
}