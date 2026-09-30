import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { logout } from "../services/auth";
import { getOrders } from "../services/order";

import { LogoOnly } from "../components/Logo";

export default function CustomerDashboard() {

    const navigate = useNavigate();

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    async function loadOrders() {

        setError("");
        setLoading(true);

        try {

            const data = await getOrders();

            console.log(
                "Customer orders response:",
                data
            );

            setOrders(
                data?.orders || []
            );

        } catch (error) {

            console.log(
                "Failed to load orders:",
                error
            );

            setError(
                error.message ||
                "Failed to load orders."
            );

        } finally {

            setLoading(false);

        }
    }


    useEffect(() => {

        loadOrders();

    }, []);


    function handleLogout() {

        logout();

        navigate(
            "/",
            {
                replace: true
            }
        );
    }


    function formatDate(date) {

        if (!date) {
            return "";
        }

        return new Date(
            date
        ).toLocaleDateString(
            "en-IN",
            {
                day: "numeric",
                month: "short",
                year: "numeric"
            }
        );
    }


    function getStatusStyle(status) {

        if (status === "DELIVERED") {

            return `
                bg-green-50
                text-green-700
                border-green-200
                dark:bg-green-950
                dark:text-green-300
                dark:border-green-900
            `;

        }


        if (
            status === "FAILED" ||
            status === "REJECTED"
        ) {

            return `
                bg-red-50
                text-red-700
                border-red-200
                dark:bg-red-950
                dark:text-red-300
                dark:border-red-900
            `;

        }


        if (status === "IN_TRANSIT") {

            return `
                bg-blue-50
                text-blue-700
                border-blue-200
                dark:bg-blue-950
                dark:text-blue-300
                dark:border-blue-900
            `;

        }


        return `
            bg-neutral-100
            text-neutral-700
            border-neutral-200
            dark:bg-slate-800
            dark:text-slate-300
            dark:border-slate-700
        `;
    }


    return (

        <div className="
            min-h-screen
            bg-[#fafafa]
            text-neutral-900
            transition-colors
            duration-300
            dark:bg-slate-950
            dark:text-white
        ">

            {/* NAVBAR */}

            <nav className="
                border-b
                border-neutral-200
                bg-white
                transition-colors
                duration-300
                dark:border-slate-800
                dark:bg-slate-900
            ">

                <div className="
                    mx-auto
                    flex
                    max-w-6xl
                    items-center
                    justify-between
                    px-6
                    py-5
                ">

                    <LogoOnly />


                    <div className="
                        flex
                        items-center
                        gap-3
                    ">

                        <span className="
                            hidden
                            text-sm
                            text-neutral-500
                            sm:block
                            dark:text-slate-400
                        ">
                            Customer
                        </span>


                        {/* SETTINGS */}

                        <button
                            onClick={() =>
                                navigate(
                                    "/customer/settings"
                                )
                            }
                            title="Settings"
                            aria-label="Settings"
                            className="
                                flex
                                h-10
                                w-10
                                items-center
                                justify-center
                                rounded-xl
                                border
                                border-neutral-200
                                bg-white
                                text-lg
                                transition
                                hover:bg-neutral-50
                                dark:border-slate-700
                                dark:bg-slate-900
                                dark:hover:bg-slate-800
                            "
                        >
                            ⚙️
                        </button>


                        {/* LOGOUT */}

                        <button
                            onClick={handleLogout}
                            title="Logout"
                            aria-label="Logout"
                            className="
                                flex
                                h-10
                                w-10
                                items-center
                                justify-center
                                rounded-xl
                                border
                                border-neutral-200
                                bg-white
                                text-lg
                                transition
                                hover:bg-neutral-50
                                dark:border-slate-700
                                dark:bg-slate-900
                                dark:hover:bg-slate-800
                            "
                        >
                            ↪
                        </button>

                    </div>

                </div>

            </nav>


            {/* MAIN */}

            <main className="
                mx-auto
                max-w-6xl
                px-6
                pb-20
                pt-12
            ">


                {/* WELCOME */}

                <div>

                    <p className="
                        text-sm
                        font-medium
                        text-neutral-500
                        dark:text-slate-400
                    ">
                        Customer Dashboard
                    </p>


                    <h1 className="
                        mt-2
                        text-4xl
                        font-bold
                        tracking-tight
                        text-black
                        sm:text-5xl
                        dark:text-white
                    ">
                        What would you like to do?
                    </h1>


                    <p className="
                        mt-4
                        max-w-xl
                        text-base
                        leading-7
                        text-neutral-500
                        dark:text-slate-400
                    ">
                        Send packages quickly and keep
                        track of your deliveries from
                        one place.
                    </p>

                </div>


                {/* MAIN ACTIONS */}

                <div className="
                    mt-10
                    grid
                    gap-6
                    md:grid-cols-2
                ">


                    {/* SEND PACKAGE */}

                    <button
                        onClick={() =>
                            navigate(
                                "/place-order"
                            )
                        }
                        className="
                            group
                            rounded-3xl
                            border
                            border-neutral-200
                            bg-black
                            p-8
                            text-left
                            text-white
                            transition
                            hover:bg-neutral-800
                            dark:border-slate-700
                            dark:bg-white
                            dark:text-black
                            dark:hover:bg-slate-200
                        "
                    >

                        <div className="
                            flex
                            h-12
                            w-12
                            items-center
                            justify-center
                            rounded-2xl
                            bg-white
                            text-lg
                            font-bold
                            text-black
                            dark:bg-black
                            dark:text-white
                        ">
                            →
                        </div>


                        <h2 className="
                            mt-7
                            text-2xl
                            font-bold
                            tracking-tight
                        ">
                            Send a package
                        </h2>


                        <p className="
                            mt-3
                            max-w-sm
                            text-sm
                            leading-6
                            text-neutral-300
                            dark:text-neutral-600
                        ">
                            Create a new delivery, add
                            pickup and drop locations,
                            and get your delivery price.
                        </p>


                        <div className="
                            mt-8
                            text-sm
                            font-semibold
                        ">
                            Create delivery →
                        </div>

                    </button>


                    {/* MY ORDERS */}

                    <button
                        onClick={() =>
                            document
                                .getElementById("orders")
                                ?.scrollIntoView({
                                    behavior: "smooth"
                                })
                        }
                        className="
                            group
                            rounded-3xl
                            border
                            border-neutral-200
                            bg-white
                            p-8
                            text-left
                            transition
                            hover:border-neutral-300
                            dark:border-slate-800
                            dark:bg-slate-900
                            dark:hover:border-slate-700
                        "
                    >

                        <div className="
                            flex
                            h-12
                            w-12
                            items-center
                            justify-center
                            rounded-2xl
                            bg-black
                            text-lg
                            font-bold
                            text-white
                            dark:bg-white
                            dark:text-black
                        ">
                            ≡
                        </div>


                        <h2 className="
                            mt-7
                            text-2xl
                            font-bold
                            tracking-tight
                        ">
                            My orders
                        </h2>


                        <p className="
                            mt-3
                            max-w-sm
                            text-sm
                            leading-6
                            text-neutral-500
                            dark:text-slate-400
                        ">
                            View your previous deliveries,
                            payment status, and current
                            delivery progress.
                        </p>


                        <div className="
                            mt-8
                            text-sm
                            font-semibold
                            text-black
                            dark:text-white
                        ">
                            View orders →
                        </div>

                    </button>

                </div>


                {/* ORDERS */}

                <section
                    id="orders"
                    className="mt-12"
                >

                    <div className="
                        flex
                        items-center
                        justify-between
                    ">

                        <div>

                            <h2 className="
                                text-xl
                                font-bold
                                tracking-tight
                            ">
                                Recent orders
                            </h2>


                            <p className="
                                mt-1
                                text-sm
                                text-neutral-500
                                dark:text-slate-400
                            ">
                                Your latest deliveries.
                            </p>

                        </div>


                        <button
                            onClick={loadOrders}
                            disabled={loading}
                            className="
                                text-sm
                                font-semibold
                                text-black
                                hover:underline
                                disabled:opacity-50
                                dark:text-white
                            "
                        >
                            {loading
                                ? "Loading..."
                                : "Refresh"}
                        </button>

                    </div>


                    {/* ERROR */}

                    {error && (

                        <div className="
                            mt-6
                            rounded-2xl
                            border
                            border-red-200
                            bg-red-50
                            px-5
                            py-4
                            text-sm
                            text-red-600
                            dark:border-red-900
                            dark:bg-red-950
                            dark:text-red-300
                        ">
                            {error}
                        </div>

                    )}


                    {/* LOADING */}

                    {loading && (

                        <div className="
                            mt-6
                            rounded-3xl
                            border
                            border-neutral-200
                            bg-white
                            px-6
                            py-14
                            text-center
                            dark:border-slate-800
                            dark:bg-slate-900
                        ">

                            <p className="
                                text-sm
                                text-neutral-500
                                dark:text-slate-400
                            ">
                                Loading your orders...
                            </p>

                        </div>

                    )}


                    {/* EMPTY */}

                    {!loading &&
                        !error &&
                        orders.length === 0 && (

                            <div className="
                                mt-6
                                rounded-3xl
                                border
                                border-dashed
                                border-neutral-300
                                bg-white
                                px-6
                                py-14
                                text-center
                                dark:border-slate-700
                                dark:bg-slate-900
                            ">

                                <div className="
                                    mx-auto
                                    flex
                                    h-12
                                    w-12
                                    items-center
                                    justify-center
                                    rounded-2xl
                                    bg-neutral-100
                                    text-lg
                                    font-bold
                                    dark:bg-slate-800
                                ">
                                    —
                                </div>


                                <h3 className="
                                    mt-5
                                    text-base
                                    font-semibold
                                ">
                                    No orders yet
                                </h3>


                                <p className="
                                    mx-auto
                                    mt-2
                                    max-w-sm
                                    text-sm
                                    leading-6
                                    text-neutral-500
                                    dark:text-slate-400
                                ">
                                    Once you create a delivery,
                                    your recent orders will
                                    appear here.
                                </p>


                                <button
                                    onClick={() =>
                                        navigate(
                                            "/place-order"
                                        )
                                    }
                                    className="
                                        mt-6
                                        rounded-xl
                                        bg-black
                                        px-5
                                        py-3
                                        text-sm
                                        font-semibold
                                        text-white
                                        transition
                                        hover:bg-neutral-800
                                        dark:bg-white
                                        dark:text-black
                                        dark:hover:bg-slate-200
                                    "
                                >
                                    Create your first order
                                </button>

                            </div>

                        )}


                    {/* ORDERS LIST */}

                    {!loading &&
                        !error &&
                        orders.length > 0 && (

                            <div className="
                                mt-6
                                space-y-4
                            ">

                                {orders.map(
                                    (order) => (

                                        <div
                                            key={order.id}
                                            className="
                                                rounded-3xl
                                                border
                                                border-neutral-200
                                                bg-white
                                                p-6
                                                shadow-sm
                                                dark:border-slate-800
                                                dark:bg-slate-900
                                            "
                                        >

                                            {/* ORDER HEADER */}

                                            <div className="
                                                flex
                                                flex-col
                                                gap-5
                                                sm:flex-row
                                                sm:items-center
                                                sm:justify-between
                                            ">

                                                <div>

                                                    <p className="
                                                        text-xs
                                                        text-neutral-400
                                                        dark:text-slate-500
                                                    ">
                                                        Order
                                                    </p>


                                                    <h3 className="
                                                        mt-1
                                                        text-lg
                                                        font-bold
                                                    ">
                                                        {order.orderName}
                                                    </h3>


                                                    <p className="
                                                        mt-1
                                                        break-all
                                                        text-xs
                                                        text-neutral-400
                                                        dark:text-slate-500
                                                    ">
                                                        #{order.id}
                                                    </p>

                                                </div>


                                                <div className="
                                                    flex
                                                    items-center
                                                    gap-3
                                                ">

                                                    <span className={`
                                                        rounded-full
                                                        border
                                                        px-3
                                                        py-1.5
                                                        text-xs
                                                        font-semibold
                                                        ${getStatusStyle(
                                                            order.status
                                                        )}
                                                    `}>
                                                        {order.status}
                                                    </span>


                                                    <span className="
                                                        text-lg
                                                        font-bold
                                                    ">
                                                        ₹
                                                        {Number(
                                                            order.finalAmount
                                                        ).toFixed(2)}
                                                    </span>

                                                </div>

                                            </div>


                                            {/* CURRENT LOCATION */}

                                            <div className="
                                                mt-5
                                                rounded-2xl
                                                border
                                                border-neutral-200
                                                bg-neutral-50
                                                p-5
                                                dark:border-slate-700
                                                dark:bg-slate-800
                                            ">

                                                <div className="
                                                    flex
                                                    items-start
                                                    gap-4
                                                ">

                                                    <div className="
                                                        flex
                                                        h-10
                                                        w-10
                                                        shrink-0
                                                        items-center
                                                        justify-center
                                                        rounded-xl
                                                        bg-black
                                                        text-white
                                                        text-sm
                                                        font-bold
                                                        dark:bg-white
                                                        dark:text-black
                                                    ">
                                                        📍
                                                    </div>


                                                    <div className="
                                                        min-w-0
                                                        flex-1
                                                    ">

                                                        <p className="
                                                            text-xs
                                                            font-medium
                                                            text-neutral-400
                                                            dark:text-slate-500
                                                        ">
                                                            Current location
                                                        </p>


                                                        {order.currentCheckpoint ? (

                                                            <>

                                                                <p className="
                                                                    mt-1
                                                                    text-sm
                                                                    font-bold
                                                                    text-black
                                                                    dark:text-white
                                                                ">
                                                                    {
                                                                        order
                                                                            .currentCheckpoint
                                                                            .checkpointName
                                                                    }
                                                                </p>


                                                                <p className="
                                                                    mt-1
                                                                    text-sm
                                                                    leading-6
                                                                    text-neutral-500
                                                                    dark:text-slate-400
                                                                ">
                                                                    {
                                                                        order
                                                                            .currentCheckpoint
                                                                            .checkpointDetail
                                                                    }
                                                                </p>

                                                            </>

                                                        ) : (

                                                            <p className="
                                                                mt-1
                                                                text-sm
                                                                text-neutral-500
                                                                dark:text-slate-400
                                                            ">
                                                                Not dispatched yet
                                                            </p>

                                                        )}

                                                    </div>

                                                </div>

                                            </div>


                                            {/* ORDER DETAILS */}

                                            <div className="
                                                mt-5
                                                grid
                                                gap-4
                                                border-t
                                                border-neutral-100
                                                pt-5
                                                sm:grid-cols-3
                                                dark:border-slate-800
                                            ">

                                                <div>

                                                    <p className="
                                                        text-xs
                                                        text-neutral-400
                                                        dark:text-slate-500
                                                    ">
                                                        Payment
                                                    </p>


                                                    <p className="
                                                        mt-1
                                                        text-sm
                                                        font-medium
                                                    ">
                                                        {order.paymentMethod}
                                                    </p>

                                                </div>


                                                <div>

                                                    <p className="
                                                        text-xs
                                                        text-neutral-400
                                                        dark:text-slate-500
                                                    ">
                                                        Payment status
                                                    </p>


                                                    <p className="
                                                        mt-1
                                                        text-sm
                                                        font-medium
                                                    ">
                                                        {order.paymentStatus}
                                                    </p>

                                                </div>


                                                <div>

                                                    <p className="
                                                        text-xs
                                                        text-neutral-400
                                                        dark:text-slate-500
                                                    ">
                                                        Ordered
                                                    </p>


                                                    <p className="
                                                        mt-1
                                                        text-sm
                                                        font-medium
                                                    ">
                                                        {formatDate(
                                                            order.createdAt
                                                        )}
                                                    </p>

                                                </div>

                                            </div>

                                        </div>

                                    )
                                )}

                            </div>

                        )}

                </section>

            </main>

        </div>
    );
}