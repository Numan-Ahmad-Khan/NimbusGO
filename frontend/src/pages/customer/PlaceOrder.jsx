import { useState } from "react";
import { useNavigate } from "react-router-dom";
import LocationPicker from "../../components/LocationPicker";
import { LogoWithName } from "../../components/Logo";
import { placeOrder } from "../../services/order";

export default function PlaceOrder() {
    const navigate = useNavigate();

    const [step, setStep] = useState(1);

    const [pickup, setPickup] = useState({
        latitude: null,
        longitude: null,
        street: "",
        landmark: "",
        pincode: ""
    });

    const [drop, setDrop] = useState({
        latitude: null,
        longitude: null,
        street: "",
        landmark: "",
        pincode: ""
    });

    const [order, setOrder] = useState({
        orderName: "",
        orderDetails: "",
        orderWeight: "",
        orderLength: "",
        orderBreadth: "",
        orderHeight: "",
        couponCode: ""
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    function handleLocationSelect(location) {
        setPickup((previous) => ({
            ...previous,
            latitude: location.latitude,
            longitude: location.longitude
        }));
    }

    function handleDropLocationSelect(location) {
        setDrop((previous) => ({
            ...previous,
            latitude: location.latitude,
            longitude: location.longitude
        }));
    }

    function validatePickup() {
        if (
            pickup.latitude === null ||
            pickup.longitude === null
        ) {
            setError("Please select a pickup location on the map.");
            return false;
        }

        if (!pickup.street.trim()) {
            setError("Please enter the pickup street address.");
            return false;
        }

        if (!pickup.pincode.trim()) {
            setError("Please enter the pickup pincode.");
            return false;
        }

        return true;
    }

    function validateDrop() {
        if (
            drop.latitude === null ||
            drop.longitude === null
        ) {
            setError("Please select a drop location on the map.");
            return false;
        }

        if (!drop.street.trim()) {
            setError("Please enter the drop street address.");
            return false;
        }

        if (!drop.pincode.trim()) {
            setError("Please enter the drop pincode.");
            return false;
        }

        return true;
    }

    function validatePackage() {
        if (!order.orderName.trim()) {
            setError("Please enter what you are sending.");
            return false;
        }

        if (!order.orderDetails.trim()) {
            setError("Please describe your package.");
            return false;
        }

        if (
            !order.orderWeight ||
            Number(order.orderWeight) <= 0
        ) {
            setError("Please enter a valid package weight.");
            return false;
        }

        if (
            !order.orderLength ||
            Number(order.orderLength) <= 0
        ) {
            setError("Please enter a valid package length.");
            return false;
        }

        if (
            !order.orderBreadth ||
            Number(order.orderBreadth) <= 0
        ) {
            setError("Please enter a valid package breadth.");
            return false;
        }

        if (
            !order.orderHeight ||
            Number(order.orderHeight) <= 0
        ) {
            setError("Please enter a valid package height.");
            return false;
        }

        return true;
    }

    function handleNext() {
        setError("");

        if (step === 1) {
            if (!validatePickup()) {
                return;
            }

            setStep(2);
            return;
        }

        if (step === 2) {
            if (!validateDrop()) {
                return;
            }

            setStep(3);
        }
    }

    function handleBack() {
        setError("");

        if (step > 1) {
            setStep((previous) => previous - 1);
        }
    }

    async function handleSubmit(event) {
        event.preventDefault();

        setError("");

        if (!validatePackage()) {
            return;
        }

        setLoading(true);

        try {
            const orderData = {
                orderName: order.orderName.trim(),
                orderDetails: order.orderDetails.trim(),

                orderWeight: Number(order.orderWeight),
                orderLength: Number(order.orderLength),
                orderBreadth: Number(order.orderBreadth),
                orderHeight: Number(order.orderHeight),

                pickup: {
                    latitude: pickup.latitude,
                    longitude: pickup.longitude,
                    street: pickup.street.trim(),
                    landmark: pickup.landmark.trim(),
                    pincode: pickup.pincode.trim(),
                    addresstype: "PICKUP"
                },

                drop: {
                    latitude: drop.latitude,
                    longitude: drop.longitude,
                    street: drop.street.trim(),
                    landmark: drop.landmark.trim(),
                    pincode: drop.pincode.trim(),
                    addresstype: "DROP"
                }
            };

            if (order.couponCode.trim()) {
                orderData.couponCode =
                    order.couponCode.trim();
            }

            const data = await placeOrder(orderData);

            console.log(
                "Order created successfully:",
                data
            );

            navigate(
                "/order-success",
                {
                    state: {
                        order: data
                    },
                    replace: true
                }
            );

        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-[#fafafa] px-4 py-8 sm:px-6">

            {/* Header */}
            <header className="mx-auto max-w-5xl">

                <LogoWithName />

                <div className="mt-10">

                    <p className="text-sm font-medium text-neutral-500">
                        Create a delivery
                    </p>

                    <h1 className="mt-2 text-3xl font-bold tracking-tight text-black sm:text-4xl">
                        Send your package
                    </h1>

                    <p className="mt-3 max-w-xl text-sm leading-6 text-neutral-500">
                        Enter your pickup, drop and package details to
                        create your delivery.
                    </p>

                </div>

            </header>


            {/* Progress */}
            <div className="mx-auto mt-8 max-w-5xl">

                <div className="flex items-center">

                    <div
                        className={`flex items-center gap-2 text-sm font-medium ${
                            step >= 1
                                ? "text-black"
                                : "text-neutral-400"
                        }`}
                    >

                        <span
                            className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold ${
                                step >= 1
                                    ? "bg-black text-white"
                                    : "bg-neutral-200 text-neutral-500"
                            }`}
                        >
                            1
                        </span>

                        <span className="hidden sm:block">
                            Pickup
                        </span>

                    </div>


                    <div
                        className={`mx-3 h-px flex-1 ${
                            step >= 2
                                ? "bg-black"
                                : "bg-neutral-200"
                        }`}
                    />


                    <div
                        className={`flex items-center gap-2 text-sm font-medium ${
                            step >= 2
                                ? "text-black"
                                : "text-neutral-400"
                        }`}
                    >

                        <span
                            className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold ${
                                step >= 2
                                    ? "bg-black text-white"
                                    : "bg-neutral-200 text-neutral-500"
                            }`}
                        >
                            2
                        </span>

                        <span className="hidden sm:block">
                            Drop
                        </span>

                    </div>


                    <div
                        className={`mx-3 h-px flex-1 ${
                            step >= 3
                                ? "bg-black"
                                : "bg-neutral-200"
                        }`}
                    />


                    <div
                        className={`flex items-center gap-2 text-sm font-medium ${
                            step >= 3
                                ? "text-black"
                                : "text-neutral-400"
                        }`}
                    >

                        <span
                            className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold ${
                                step >= 3
                                    ? "bg-black text-white"
                                    : "bg-neutral-200 text-neutral-500"
                            }`}
                        >
                            3
                        </span>

                        <span className="hidden sm:block">
                            Package
                        </span>

                    </div>

                </div>

            </div>


            {/* Main card */}
            <main className="mx-auto mt-6 max-w-5xl">

                <div className="rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm sm:p-8">


                    {/* STEP 1 — PICKUP */}
                    {step === 1 && (
                        <>

                            <div className="mb-8">

                                <p className="text-sm font-medium text-neutral-500">
                                    Step 1
                                </p>

                                <h2 className="mt-1 text-2xl font-bold tracking-tight text-black">
                                    Pickup Address
                                </h2>

                                <p className="mt-2 text-sm text-neutral-500">
                                    Where should we collect your package?
                                </p>

                            </div>


                            <div className="grid gap-8 lg:grid-cols-[360px_1fr]">

                                {/* Form */}
                                <div className="space-y-5">

                                    <div>

                                        <label className="mb-2 block text-sm font-medium text-neutral-700">
                                            Street address
                                        </label>

                                        <input
                                            type="text"
                                            placeholder="Enter street address"
                                            value={pickup.street}
                                            onChange={(event) =>
                                                setPickup((previous) => ({
                                                    ...previous,
                                                    street: event.target.value
                                                }))
                                            }
                                            className="w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm outline-none transition focus:border-black"
                                        />

                                    </div>


                                    <div>

                                        <label className="mb-2 block text-sm font-medium text-neutral-700">
                                            Landmark
                                        </label>

                                        <input
                                            type="text"
                                            placeholder="Nearby landmark (optional)"
                                            value={pickup.landmark}
                                            onChange={(event) =>
                                                setPickup((previous) => ({
                                                    ...previous,
                                                    landmark: event.target.value
                                                }))
                                            }
                                            className="w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm outline-none transition focus:border-black"
                                        />

                                    </div>


                                    <div>

                                        <label className="mb-2 block text-sm font-medium text-neutral-700">
                                            Pincode
                                        </label>

                                        <input
                                            type="text"
                                            placeholder="Enter pincode"
                                            value={pickup.pincode}
                                            onChange={(event) =>
                                                setPickup((previous) => ({
                                                    ...previous,
                                                    pincode: event.target.value
                                                }))
                                            }
                                            className="w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm outline-none transition focus:border-black"
                                        />

                                    </div>

                                </div>


                                {/* Pickup Map */}
                                <div>

                                    <p className="mb-2 text-sm font-medium text-neutral-700">
                                        Select pickup location
                                    </p>

                                    <LocationPicker
                                        onLocationSelect={
                                            handleLocationSelect
                                        }
                                    />

                                    {pickup.latitude !== null &&
                                        pickup.longitude !== null && (

                                            <div className="mt-3 rounded-xl bg-neutral-50 px-4 py-3">

                                                <p className="text-xs font-medium text-neutral-700">
                                                    Location selected
                                                </p>

                                                <p className="mt-1 text-xs text-neutral-500">
                                                    {pickup.latitude.toFixed(6)},{" "}
                                                    {pickup.longitude.toFixed(6)}
                                                </p>

                                            </div>

                                        )}

                                </div>

                            </div>

                        </>
                    )}


                    {/* STEP 2 — DROP */}
                    {step === 2 && (
                        <>

                            <div className="mb-8">

                                <p className="text-sm font-medium text-neutral-500">
                                    Step 2
                                </p>

                                <h2 className="mt-1 text-2xl font-bold tracking-tight text-black">
                                    Drop Address
                                </h2>

                                <p className="mt-2 text-sm text-neutral-500">
                                    Where should we deliver your package?
                                </p>

                            </div>


                            <div className="grid gap-8 lg:grid-cols-[360px_1fr]">

                                {/* Form */}
                                <div className="space-y-5">

                                    <div>

                                        <label className="mb-2 block text-sm font-medium text-neutral-700">
                                            Street address
                                        </label>

                                        <input
                                            type="text"
                                            placeholder="Enter street address"
                                            value={drop.street}
                                            onChange={(event) =>
                                                setDrop((previous) => ({
                                                    ...previous,
                                                    street: event.target.value
                                                }))
                                            }
                                            className="w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm outline-none transition focus:border-black"
                                        />

                                    </div>


                                    <div>

                                        <label className="mb-2 block text-sm font-medium text-neutral-700">
                                            Landmark
                                        </label>

                                        <input
                                            type="text"
                                            placeholder="Nearby landmark (optional)"
                                            value={drop.landmark}
                                            onChange={(event) =>
                                                setDrop((previous) => ({
                                                    ...previous,
                                                    landmark: event.target.value
                                                }))
                                            }
                                            className="w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm outline-none transition focus:border-black"
                                        />

                                    </div>


                                    <div>

                                        <label className="mb-2 block text-sm font-medium text-neutral-700">
                                            Pincode
                                        </label>

                                        <input
                                            type="text"
                                            placeholder="Enter pincode"
                                            value={drop.pincode}
                                            onChange={(event) =>
                                                setDrop((previous) => ({
                                                    ...previous,
                                                    pincode: event.target.value
                                                }))
                                            }
                                            className="w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm outline-none transition focus:border-black"
                                        />

                                    </div>

                                </div>


                                {/* Drop Map */}
                                <div>

                                    <p className="mb-2 text-sm font-medium text-neutral-700">
                                        Select drop location
                                    </p>

                                    <LocationPicker
                                        onLocationSelect={
                                            handleDropLocationSelect
                                        }
                                    />

                                    {drop.latitude !== null &&
                                        drop.longitude !== null && (

                                            <div className="mt-3 rounded-xl bg-neutral-50 px-4 py-3">

                                                <p className="text-xs font-medium text-neutral-700">
                                                    Location selected
                                                </p>

                                                <p className="mt-1 text-xs text-neutral-500">
                                                    {drop.latitude.toFixed(6)},{" "}
                                                    {drop.longitude.toFixed(6)}
                                                </p>

                                            </div>

                                        )}

                                </div>

                            </div>

                        </>
                    )}


                    {/* STEP 3 — PACKAGE */}
                    {step === 3 && (
                        <>

                            <div className="mb-8">

                                <p className="text-sm font-medium text-neutral-500">
                                    Step 3
                                </p>

                                <h2 className="mt-1 text-2xl font-bold tracking-tight text-black">
                                    Package Details
                                </h2>

                                <p className="mt-2 text-sm text-neutral-500">
                                    Tell us a little about what you're sending.
                                </p>

                            </div>


                            <div className="mx-auto max-w-3xl space-y-5">

                                <div>

                                    <label className="mb-2 block text-sm font-medium text-neutral-700">
                                        What are you sending?
                                    </label>

                                    <input
                                        type="text"
                                        placeholder="e.g. Laptop, documents, clothes"
                                        value={order.orderName}
                                        onChange={(event) =>
                                            setOrder((previous) => ({
                                                ...previous,
                                                orderName: event.target.value
                                            }))
                                        }
                                        className="w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm outline-none transition focus:border-black"
                                    />

                                </div>


                                <div>

                                    <label className="mb-2 block text-sm font-medium text-neutral-700">
                                        Package description
                                    </label>

                                    <textarea
                                        placeholder="Describe your package"
                                        value={order.orderDetails}
                                        onChange={(event) =>
                                            setOrder((previous) => ({
                                                ...previous,
                                                orderDetails: event.target.value
                                            }))
                                        }
                                        rows={4}
                                        className="w-full resize-none rounded-xl border border-neutral-200 px-4 py-3 text-sm outline-none transition focus:border-black"
                                    />

                                </div>


                                {/* Dimensions */}
                                <div>

                                    <label className="mb-3 block text-sm font-medium text-neutral-700">
                                        Package dimensions
                                    </label>

                                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">

                                        <div>

                                            <input
                                                type="number"
                                                placeholder="Weight"
                                                value={order.orderWeight}
                                                onChange={(event) =>
                                                    setOrder((previous) => ({
                                                        ...previous,
                                                        orderWeight: event.target.value
                                                    }))
                                                }
                                                min="0"
                                                step="0.1"
                                                className="w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm outline-none transition focus:border-black"
                                            />

                                            <p className="mt-1 text-xs text-neutral-400">
                                                kg
                                            </p>

                                        </div>


                                        <div>

                                            <input
                                                type="number"
                                                placeholder="Length"
                                                value={order.orderLength}
                                                onChange={(event) =>
                                                    setOrder((previous) => ({
                                                        ...previous,
                                                        orderLength: event.target.value
                                                    }))
                                                }
                                                min="0"
                                                step="0.1"
                                                className="w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm outline-none transition focus:border-black"
                                            />

                                            <p className="mt-1 text-xs text-neutral-400">
                                                cm
                                            </p>

                                        </div>


                                        <div>

                                            <input
                                                type="number"
                                                placeholder="Breadth"
                                                value={order.orderBreadth}
                                                onChange={(event) =>
                                                    setOrder((previous) => ({
                                                        ...previous,
                                                        orderBreadth: event.target.value
                                                    }))
                                                }
                                                min="0"
                                                step="0.1"
                                                className="w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm outline-none transition focus:border-black"
                                            />

                                            <p className="mt-1 text-xs text-neutral-400">
                                                cm
                                            </p>

                                        </div>


                                        <div>

                                            <input
                                                type="number"
                                                placeholder="Height"
                                                value={order.orderHeight}
                                                onChange={(event) =>
                                                    setOrder((previous) => ({
                                                        ...previous,
                                                        orderHeight: event.target.value
                                                    }))
                                                }
                                                min="0"
                                                step="0.1"
                                                className="w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm outline-none transition focus:border-black"
                                            />

                                            <p className="mt-1 text-xs text-neutral-400">
                                                cm
                                            </p>

                                        </div>

                                    </div>

                                </div>


                                {/* Coupon */}
                                <div>

                                    <label className="mb-2 block text-sm font-medium text-neutral-700">

                                        Coupon

                                        <span className="ml-1 font-normal text-neutral-400">
                                            (optional)
                                        </span>

                                    </label>

                                    <input
                                        type="text"
                                        placeholder="Enter coupon code"
                                        value={order.couponCode}
                                        onChange={(event) =>
                                            setOrder((previous) => ({
                                                ...previous,
                                                couponCode: event.target.value
                                            }))
                                        }
                                        className="w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm outline-none transition focus:border-black"
                                    />

                                </div>

                            </div>

                        </>
                    )}


                    {/* Error */}
                    {error && (
                        <div className="mt-8 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                            {error}
                        </div>
                    )}


                    {/* Navigation */}
                    <div className="mt-10 flex items-center justify-between border-t border-neutral-100 pt-6">

                        {step > 1 ? (
                            <button
                                type="button"
                                onClick={handleBack}
                                disabled={loading}
                                className="rounded-xl border border-neutral-200 bg-white px-5 py-3 text-sm font-medium text-black transition hover:bg-neutral-50 disabled:opacity-50"
                            >
                                ← Back
                            </button>
                        ) : (
                            <div />
                        )}


                        {step < 3 ? (
                            <button
                                type="button"
                                onClick={handleNext}
                                className="rounded-xl bg-black px-6 py-3 text-sm font-semibold text-white transition hover:bg-neutral-800"
                            >
                                Continue →
                            </button>
                        ) : (
                            <button
                                type="button"
                                onClick={handleSubmit}
                                disabled={loading}
                                className="rounded-xl bg-black px-6 py-3 text-sm font-semibold text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {loading
                                    ? "Placing order..."
                                    : "Place Order"}
                            </button>
                        )}

                    </div>

                </div>

            </main>

        </div>
    );
}