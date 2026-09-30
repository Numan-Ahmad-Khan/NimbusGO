import { useState } from "react";
import LocationPicker from "../../components/LocationPicker";
import { LogoWithName } from "../../components/Logo";
import {
    placeOrder,
    previewOrder
} from "../../services/order";

export default function PlaceOrder() {
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

    const [paymentMethod, setPaymentMethod] =
        useState("ONLINE");

    const [price, setPrice] = useState(null);

    const [loading, setLoading] = useState(false);
    const [priceLoading, setPriceLoading] =
        useState(false);

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
            setError(
                "Please select a pickup location on the map."
            );

            return false;
        }

        if (!pickup.street.trim()) {
            setError(
                "Please enter the pickup street address."
            );

            return false;
        }

        if (!pickup.pincode.trim()) {
            setError(
                "Please enter the pickup pincode."
            );

            return false;
        }

        return true;
    }

    function validateDrop() {
        if (
            drop.latitude === null ||
            drop.longitude === null
        ) {
            setError(
                "Please select a drop location on the map."
            );

            return false;
        }

        if (!drop.street.trim()) {
            setError(
                "Please enter the drop street address."
            );

            return false;
        }

        if (!drop.pincode.trim()) {
            setError(
                "Please enter the drop pincode."
            );

            return false;
        }

        return true;
    }

    function validatePackage() {
        if (!order.orderName.trim()) {
            setError(
                "Please enter what you are sending."
            );

            return false;
        }

        if (!order.orderDetails.trim()) {
            setError(
                "Please describe your package."
            );

            return false;
        }

        if (
            !order.orderWeight ||
            Number(order.orderWeight) <= 0
        ) {
            setError(
                "Please enter a valid package weight."
            );

            return false;
        }

        if (
            !order.orderLength ||
            Number(order.orderLength) <= 0
        ) {
            setError(
                "Please enter a valid package length."
            );

            return false;
        }

        if (
            !order.orderBreadth ||
            Number(order.orderBreadth) <= 0
        ) {
            setError(
                "Please enter a valid package breadth."
            );

            return false;
        }

        if (
            !order.orderHeight ||
            Number(order.orderHeight) <= 0
        ) {
            setError(
                "Please enter a valid package height."
            );

            return false;
        }

        return true;
    }

    function createOrderData() {
        const orderData = {
            orderName:
                order.orderName.trim(),

            orderDetails:
                order.orderDetails.trim(),

            orderWeight:
                Number(order.orderWeight),

            orderLength:
                Number(order.orderLength),

            orderBreadth:
                Number(order.orderBreadth),

            orderHeight:
                Number(order.orderHeight),

            pickup: {
                latitude:
                    pickup.latitude,

                longitude:
                    pickup.longitude,

                street:
                    pickup.street.trim(),

                landmark:
                    pickup.landmark.trim(),

                pincode:
                    pickup.pincode.trim(),

                addresstype:
                    "PICKUP"
            },

            drop: {
                latitude:
                    drop.latitude,

                longitude:
                    drop.longitude,

                street:
                    drop.street.trim(),

                landmark:
                    drop.landmark.trim(),

                pincode:
                    drop.pincode.trim(),

                addresstype:
                    "DROP"
            }
        };

        if (order.couponCode.trim()) {
            orderData.couponCode =
                order.couponCode.trim();
        }

        return orderData;
    }

    async function loadPricePreview() {
        setError("");
        setPriceLoading(true);

        try {
            const orderData =
                createOrderData();

            const data =
                await previewOrder(orderData);

            setPrice(data);

            setStep(4);
        } catch (error) {
            setError(error.message);
        } finally {
            setPriceLoading(false);
        }
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

            return;
        }

        if (step === 3) {
            if (!validatePackage()) {
                return;
            }

            loadPricePreview();
        }
    }

    function handleBack() {
        setError("");

        if (step === 4) {
            setPrice(null);
        }

        if (step > 1) {
            setStep(
                (previous) =>
                    previous - 1
            );
        }
    }

    async function handleSubmit() {
        setError("");
        setLoading(true);

        try {
            const orderData =
                createOrderData();

            /*
             * Payment method is added ONLY
             * when actually creating the order.
             *
             * It is NOT sent to previewOrder().
             */
            orderData.paymentMethod =
                paymentMethod;

            const data =
                await placeOrder(orderData);

            console.log(
                "Order created successfully:",
                data
            );

            /*
             * COD
             *
             * Order is already created,
             * so show the final success page.
             */

            if (
                paymentMethod === "COD"
            ) {
                if (!data.OrderId) {
                    throw new Error(
                        "Order ID was not returned."
                    );
                }

                window.location.href =
                    `/order-result?status=success&orderId=${data.OrderId}`;

                return;
            }

            /*
             * ONLINE PAYMENT
             */

            if (!data.paymentLink) {
                throw new Error(
                    "Payment link was not generated."
                );
            }

            if (!data.OrderId) {
                throw new Error(
                    "Order ID was not returned."
                );
            }

            /*
             * Open Razorpay in a new tab.
             *
             * NimbusGO remains open in the
             * current tab.
             */

            const paymentWindow =
                window.open(
                    data.paymentLink,
                    "_blank"
                );

            /*
             * Browser blocked the popup.
             */

            if (!paymentWindow) {
                throw new Error(
                    "Please allow pop-ups to continue with payment."
                );
            }

            /*
             * Move the current NimbusGO tab
             * to the payment waiting page.
             */

            window.location.href =
                `/payment-waiting?orderId=${data.OrderId}`;

        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="
            min-h-screen
            bg-[#fafafa]
            px-4
            py-8
            text-neutral-900
            transition-colors
            duration-300
            sm:px-6
            dark:bg-slate-950
            dark:text-white
        ">

            {/* HEADER */}

            <header className="
                mx-auto
                max-w-5xl
            ">

                <LogoWithName />

                <div className="mt-10">

                    <p className="
                        text-sm
                        font-medium
                        text-neutral-500
                        dark:text-slate-400
                    ">
                        Create a delivery
                    </p>

                    <h1 className="
                        mt-2
                        text-3xl
                        font-bold
                        tracking-tight
                        text-black
                        dark:text-white
                        sm:text-4xl
                    ">
                        Send your package
                    </h1>

                    <p className="
                        mt-3
                        max-w-xl
                        text-sm
                        leading-6
                        text-neutral-500
                        dark:text-slate-400
                    ">
                        Enter your pickup, drop
                        and package details to
                        create your delivery.
                    </p>

                </div>

            </header>


            {/* PROGRESS */}

            <div className="
                mx-auto
                mt-8
                max-w-5xl
            ">

                <div className="
                    flex
                    items-center
                ">

                    {[
                        ["1", "Pickup"],
                        ["2", "Drop"],
                        ["3", "Package"],
                        ["4", "Payment"]
                    ].map(
                        ([number, label], index) => {

                            const itemStep =
                                index + 1;

                            return (
                                <div
                                    key={number}
                                    className="
                                        flex
                                        flex-1
                                        items-center
                                    "
                                >

                                    <div className={`
                                        flex
                                        items-center
                                        gap-2
                                        text-sm
                                        font-medium
                                        ${
                                            step >= itemStep
                                                ? "text-black dark:text-white"
                                                : "text-neutral-400 dark:text-slate-600"
                                        }
                                    `}>

                                        <span className={`
                                            flex
                                            h-7
                                            w-7
                                            shrink-0
                                            items-center
                                            justify-center
                                            rounded-full
                                            text-xs
                                            font-semibold
                                            ${
                                                step >= itemStep
                                                    ? "bg-black text-white dark:bg-white dark:text-black"
                                                    : "bg-neutral-200 text-neutral-500 dark:bg-slate-800 dark:text-slate-400"
                                            }
                                        `}>
                                            {number}
                                        </span>

                                        <span className="
                                            hidden
                                            sm:block
                                        ">
                                            {label}
                                        </span>

                                    </div>

                                    {index < 3 && (
                                        <div className={`
                                            mx-3
                                            h-px
                                            flex-1
                                            ${
                                                step > itemStep
                                                    ? "bg-black dark:bg-white"
                                                    : "bg-neutral-200 dark:bg-slate-800"
                                            }
                                        `} />
                                    )}

                                </div>
                            );
                        }
                    )}

                </div>

            </div>


            {/* MAIN */}

            <main className="
                mx-auto
                mt-6
                max-w-5xl
            ">

                <div className="
                    rounded-3xl
                    border
                    border-neutral-200
                    bg-white
                    p-5
                    shadow-sm
                    transition-colors
                    duration-300
                    sm:p-8
                    dark:border-slate-800
                    dark:bg-slate-900
                ">


                    {/* STEP 1 */}

                    {step === 1 && (
                        <>
                            <div className="mb-8">

                                <p className="
                                    text-sm
                                    font-medium
                                    text-neutral-500
                                    dark:text-slate-400
                                ">
                                    Step 1
                                </p>

                                <h2 className="
                                    mt-1
                                    text-2xl
                                    font-bold
                                    tracking-tight
                                    text-black
                                    dark:text-white
                                ">
                                    Pickup Address
                                </h2>

                                <p className="
                                    mt-2
                                    text-sm
                                    text-neutral-500
                                    dark:text-slate-400
                                ">
                                    Where should we
                                    collect your package?
                                </p>

                            </div>

                            <div className="
                                grid
                                gap-8
                                lg:grid-cols-[360px_1fr]
                            ">

                                <div className="
                                    space-y-5
                                ">

                                    <div>
                                        <label className="
                                            mb-2
                                            block
                                            text-sm
                                            font-medium
                                            text-neutral-700
                                            dark:text-slate-300
                                        ">
                                            Street address
                                        </label>

                                        <input
                                            type="text"
                                            placeholder="Enter street address"
                                            value={
                                                pickup.street
                                            }
                                            onChange={(event) =>
                                                setPickup(
                                                    (previous) => ({
                                                        ...previous,
                                                        street:
                                                            event.target.value
                                                    })
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
                                                text-black
                                                outline-none
                                                transition
                                                placeholder:text-neutral-400
                                                focus:border-black
                                                dark:border-slate-700
                                                dark:bg-slate-950
                                                dark:text-white
                                                dark:placeholder:text-slate-600
                                                dark:focus:border-white
                                            "
                                        />
                                    </div>

                                    <div>
                                        <label className="
                                            mb-2
                                            block
                                            text-sm
                                            font-medium
                                            text-neutral-700
                                            dark:text-slate-300
                                        ">
                                            Landmark
                                        </label>

                                        <input
                                            type="text"
                                            placeholder="Nearby landmark (optional)"
                                            value={
                                                pickup.landmark
                                            }
                                            onChange={(event) =>
                                                setPickup(
                                                    (previous) => ({
                                                        ...previous,
                                                        landmark:
                                                            event.target.value
                                                    })
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
                                                text-black
                                                outline-none
                                                transition
                                                placeholder:text-neutral-400
                                                focus:border-black
                                                dark:border-slate-700
                                                dark:bg-slate-950
                                                dark:text-white
                                                dark:placeholder:text-slate-600
                                                dark:focus:border-white
                                            "
                                        />
                                    </div>

                                    <div>
                                        <label className="
                                            mb-2
                                            block
                                            text-sm
                                            font-medium
                                            text-neutral-700
                                            dark:text-slate-300
                                        ">
                                            Pincode
                                        </label>

                                        <input
                                            type="text"
                                            placeholder="Enter pincode"
                                            value={
                                                pickup.pincode
                                            }
                                            onChange={(event) =>
                                                setPickup(
                                                    (previous) => ({
                                                        ...previous,
                                                        pincode:
                                                            event.target.value
                                                    })
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
                                                text-black
                                                outline-none
                                                transition
                                                placeholder:text-neutral-400
                                                focus:border-black
                                                dark:border-slate-700
                                                dark:bg-slate-950
                                                dark:text-white
                                                dark:placeholder:text-slate-600
                                                dark:focus:border-white
                                            "
                                        />
                                    </div>

                                </div>

                                <div>

                                    <p className="
                                        mb-2
                                        text-sm
                                        font-medium
                                        text-neutral-700
                                        dark:text-slate-300
                                    ">
                                        Select pickup location
                                    </p>

                                    <LocationPicker
                                        onLocationSelect={
                                            handleLocationSelect
                                        }
                                    />

                                    {pickup.latitude !== null &&
                                        pickup.longitude !== null && (
                                            <div className="
                                                mt-3
                                                rounded-xl
                                                bg-neutral-50
                                                px-4
                                                py-3
                                                dark:bg-slate-800
                                            ">

                                                <p className="
                                                    text-xs
                                                    font-medium
                                                    text-neutral-700
                                                    dark:text-slate-300
                                                ">
                                                    Location selected
                                                </p>

                                                <p className="
                                                    mt-1
                                                    text-xs
                                                    text-neutral-500
                                                    dark:text-slate-400
                                                ">
                                                    {pickup.latitude.toFixed(6)},{" "}
                                                    {pickup.longitude.toFixed(6)}
                                                </p>

                                            </div>
                                        )}

                                </div>

                            </div>
                        </>
                    )}


                    {/* STEP 2 */}

                    {step === 2 && (
                        <>
                            <div className="mb-8">

                                <p className="
                                    text-sm
                                    font-medium
                                    text-neutral-500
                                    dark:text-slate-400
                                ">
                                    Step 2
                                </p>

                                <h2 className="
                                    mt-1
                                    text-2xl
                                    font-bold
                                    tracking-tight
                                    text-black
                                    dark:text-white
                                ">
                                    Drop Address
                                </h2>

                                <p className="
                                    mt-2
                                    text-sm
                                    text-neutral-500
                                    dark:text-slate-400
                                ">
                                    Where should we
                                    deliver your package?
                                </p>

                            </div>

                            <div className="
                                grid
                                gap-8
                                lg:grid-cols-[360px_1fr]
                            ">

                                <div className="
                                    space-y-5
                                ">

                                    <div>
                                        <label className="
                                            mb-2
                                            block
                                            text-sm
                                            font-medium
                                            text-neutral-700
                                            dark:text-slate-300
                                        ">
                                            Street address
                                        </label>

                                        <input
                                            type="text"
                                            placeholder="Enter street address"
                                            value={
                                                drop.street
                                            }
                                            onChange={(event) =>
                                                setDrop(
                                                    (previous) => ({
                                                        ...previous,
                                                        street:
                                                            event.target.value
                                                    })
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
                                                text-black
                                                outline-none
                                                transition
                                                placeholder:text-neutral-400
                                                focus:border-black
                                                dark:border-slate-700
                                                dark:bg-slate-950
                                                dark:text-white
                                                dark:placeholder:text-slate-600
                                                dark:focus:border-white
                                            "
                                        />
                                    </div>

                                    <div>
                                        <label className="
                                            mb-2
                                            block
                                            text-sm
                                            font-medium
                                            text-neutral-700
                                            dark:text-slate-300
                                        ">
                                            Landmark
                                        </label>

                                        <input
                                            type="text"
                                            placeholder="Nearby landmark (optional)"
                                            value={
                                                drop.landmark
                                            }
                                            onChange={(event) =>
                                                setDrop(
                                                    (previous) => ({
                                                        ...previous,
                                                        landmark:
                                                            event.target.value
                                                    })
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
                                                text-black
                                                outline-none
                                                transition
                                                placeholder:text-neutral-400
                                                focus:border-black
                                                dark:border-slate-700
                                                dark:bg-slate-950
                                                dark:text-white
                                                dark:placeholder:text-slate-600
                                                dark:focus:border-white
                                            "
                                        />
                                    </div>

                                    <div>
                                        <label className="
                                            mb-2
                                            block
                                            text-sm
                                            font-medium
                                            text-neutral-700
                                            dark:text-slate-300
                                        ">
                                            Pincode
                                        </label>

                                        <input
                                            type="text"
                                            placeholder="Enter pincode"
                                            value={
                                                drop.pincode
                                            }
                                            onChange={(event) =>
                                                setDrop(
                                                    (previous) => ({
                                                        ...previous,
                                                        pincode:
                                                            event.target.value
                                                    })
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
                                                text-black
                                                outline-none
                                                transition
                                                placeholder:text-neutral-400
                                                focus:border-black
                                                dark:border-slate-700
                                                dark:bg-slate-950
                                                dark:text-white
                                                dark:placeholder:text-slate-600
                                                dark:focus:border-white
                                            "
                                        />
                                    </div>

                                </div>

                                <div>

                                    <p className="
                                        mb-2
                                        text-sm
                                        font-medium
                                        text-neutral-700
                                        dark:text-slate-300
                                    ">
                                        Select drop location
                                    </p>

                                    <LocationPicker
                                        onLocationSelect={
                                            handleDropLocationSelect
                                        }
                                    />

                                    {drop.latitude !== null &&
                                        drop.longitude !== null && (
                                            <div className="
                                                mt-3
                                                rounded-xl
                                                bg-neutral-50
                                                px-4
                                                py-3
                                                dark:bg-slate-800
                                            ">

                                                <p className="
                                                    text-xs
                                                    font-medium
                                                    text-neutral-700
                                                    dark:text-slate-300
                                                ">
                                                    Location selected
                                                </p>

                                                <p className="
                                                    mt-1
                                                    text-xs
                                                    text-neutral-500
                                                    dark:text-slate-400
                                                ">
                                                    {drop.latitude.toFixed(6)},{" "}
                                                    {drop.longitude.toFixed(6)}
                                                </p>

                                            </div>
                                        )}

                                </div>

                            </div>
                        </>
                    )}


                    {/* STEP 3 */}

                    {step === 3 && (
                        <>
                            <div className="mb-8">

                                <p className="
                                    text-sm
                                    font-medium
                                    text-neutral-500
                                    dark:text-slate-400
                                ">
                                    Step 3
                                </p>

                                <h2 className="
                                    mt-1
                                    text-2xl
                                    font-bold
                                    tracking-tight
                                    text-black
                                    dark:text-white
                                ">
                                    Package Details
                                </h2>

                                <p className="
                                    mt-2
                                    text-sm
                                    text-neutral-500
                                    dark:text-slate-400
                                ">
                                    Tell us a little about
                                    what you're sending.
                                </p>

                            </div>

                            <div className="
                                mx-auto
                                max-w-3xl
                                space-y-5
                            ">

                                <div>

                                    <label className="
                                        mb-2
                                        block
                                        text-sm
                                        font-medium
                                        text-neutral-700
                                        dark:text-slate-300
                                    ">
                                        What are you sending?
                                    </label>

                                    <input
                                        type="text"
                                        placeholder="e.g. Laptop, documents, clothes"
                                        value={
                                            order.orderName
                                        }
                                        onChange={(event) =>
                                            setOrder(
                                                (previous) => ({
                                                    ...previous,
                                                    orderName:
                                                        event.target.value
                                                })
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
                                            text-black
                                            outline-none
                                            transition
                                            placeholder:text-neutral-400
                                            focus:border-black
                                            dark:border-slate-700
                                            dark:bg-slate-950
                                            dark:text-white
                                            dark:placeholder:text-slate-600
                                            dark:focus:border-white
                                        "
                                    />

                                </div>


                                <div>

                                    <label className="
                                        mb-2
                                        block
                                        text-sm
                                        font-medium
                                        text-neutral-700
                                        dark:text-slate-300
                                    ">
                                        Package description
                                    </label>

                                    <textarea
                                        placeholder="Describe your package"
                                        value={
                                            order.orderDetails
                                        }
                                        onChange={(event) =>
                                            setOrder(
                                                (previous) => ({
                                                    ...previous,
                                                    orderDetails:
                                                        event.target.value
                                                })
                                            )
                                        }
                                        rows={4}
                                        className="
                                            w-full
                                            resize-none
                                            rounded-xl
                                            border
                                            border-neutral-200
                                            bg-white
                                            px-4
                                            py-3
                                            text-sm
                                            text-black
                                            outline-none
                                            transition
                                            placeholder:text-neutral-400
                                            focus:border-black
                                            dark:border-slate-700
                                            dark:bg-slate-950
                                            dark:text-white
                                            dark:placeholder:text-slate-600
                                            dark:focus:border-white
                                        "
                                    />

                                </div>


                                <div>

                                    <label className="
                                        mb-3
                                        block
                                        text-sm
                                        font-medium
                                        text-neutral-700
                                        dark:text-slate-300
                                    ">
                                        Package dimensions
                                    </label>

                                    <div className="
                                        grid
                                        grid-cols-2
                                        gap-4
                                        sm:grid-cols-4
                                    ">

                                        {[
                                            [
                                                "orderWeight",
                                                "Weight",
                                                "kg"
                                            ],
                                            [
                                                "orderLength",
                                                "Length",
                                                "cm"
                                            ],
                                            [
                                                "orderBreadth",
                                                "Breadth",
                                                "cm"
                                            ],
                                            [
                                                "orderHeight",
                                                "Height",
                                                "cm"
                                            ]
                                        ].map(
                                            ([
                                                field,
                                                placeholder,
                                                unit
                                            ]) => (
                                                <div
                                                    key={field}
                                                >

                                                    <input
                                                        type="number"
                                                        placeholder={
                                                            placeholder
                                                        }
                                                        value={
                                                            order[
                                                                field
                                                            ]
                                                        }
                                                        onChange={(
                                                            event
                                                        ) =>
                                                            setOrder(
                                                                (
                                                                    previous
                                                                ) => ({
                                                                    ...previous,
                                                                    [field]:
                                                                        event
                                                                            .target
                                                                            .value
                                                                })
                                                            )
                                                        }
                                                        min="0"
                                                        step="0.1"
                                                        className="
                                                            w-full
                                                            rounded-xl
                                                            border
                                                            border-neutral-200
                                                            bg-white
                                                            px-4
                                                            py-3
                                                            text-sm
                                                            text-black
                                                            outline-none
                                                            transition
                                                            placeholder:text-neutral-400
                                                            focus:border-black
                                                            dark:border-slate-700
                                                            dark:bg-slate-950
                                                            dark:text-white
                                                            dark:placeholder:text-slate-600
                                                            dark:focus:border-white
                                                        "
                                                    />

                                                    <p className="
                                                        mt-1
                                                        text-xs
                                                        text-neutral-400
                                                        dark:text-slate-500
                                                    ">
                                                        {unit}
                                                    </p>

                                                </div>
                                            )
                                        )}

                                    </div>

                                </div>


                                <div>

                                    <label className="
                                        mb-2
                                        block
                                        text-sm
                                        font-medium
                                        text-neutral-700
                                        dark:text-slate-300
                                    ">
                                        Coupon
                                        <span className="
                                            ml-1
                                            font-normal
                                            text-neutral-400
                                            dark:text-slate-500
                                        ">
                                            (optional)
                                        </span>
                                    </label>

                                    <input
                                        type="text"
                                        placeholder="Enter coupon code"
                                        value={
                                            order.couponCode
                                        }
                                        onChange={(event) =>
                                            setOrder(
                                                (previous) => ({
                                                    ...previous,
                                                    couponCode:
                                                        event.target.value
                                                })
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
                                            text-black
                                            outline-none
                                            transition
                                            placeholder:text-neutral-400
                                            focus:border-black
                                            dark:border-slate-700
                                            dark:bg-slate-950
                                            dark:text-white
                                            dark:placeholder:text-slate-600
                                            dark:focus:border-white
                                        "
                                    />

                                </div>

                            </div>
                        </>
                    )}


                    {/* STEP 4 */}

                    {step === 4 && price && (
                        <>
                            <div className="mb-8">

                                <p className="
                                    text-sm
                                    font-medium
                                    text-neutral-500
                                    dark:text-slate-400
                                ">
                                    Step 4
                                </p>

                                <h2 className="
                                    mt-1
                                    text-2xl
                                    font-bold
                                    tracking-tight
                                    text-black
                                    dark:text-white
                                ">
                                    Review & Payment
                                </h2>

                                <p className="
                                    mt-2
                                    text-sm
                                    text-neutral-500
                                    dark:text-slate-400
                                ">
                                    Review your delivery
                                    charges and choose
                                    how you want to pay.
                                </p>

                            </div>


                            <div className="
                                grid
                                gap-8
                                lg:grid-cols-2
                            ">

                                {/* ORDER SUMMARY */}

                                <div>

                                    <div className="
                                        rounded-2xl
                                        border
                                        border-neutral-200
                                        p-5
                                        dark:border-slate-700
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
                                                    text-neutral-400
                                                    dark:text-slate-500
                                                ">
                                                    Package
                                                </p>

                                                <h3 className="
                                                    mt-1
                                                    text-lg
                                                    font-bold
                                                    text-black
                                                    dark:text-white
                                                ">
                                                    {
                                                        order.orderName
                                                    }
                                                </h3>

                                            </div>

                                            <div className="
                                                rounded-xl
                                                bg-neutral-100
                                                px-3
                                                py-2
                                                text-right
                                                dark:bg-slate-800
                                            ">

                                                <p className="
                                                    text-[10px]
                                                    text-neutral-400
                                                    dark:text-slate-500
                                                ">
                                                    Distance
                                                </p>

                                                <p className="
                                                    text-sm
                                                    font-semibold
                                                    text-black
                                                    dark:text-white
                                                ">
                                                    {
                                                        price.distance
                                                    }{" "}
                                                    km
                                                </p>

                                            </div>

                                        </div>


                                        <div className="
                                            mt-5
                                            space-y-3
                                        ">

                                            <div className="
                                                flex
                                                justify-between
                                                text-sm
                                            ">
                                                <span className="
                                                    text-neutral-500
                                                    dark:text-slate-400
                                                ">
                                                    Distance charge
                                                </span>

                                                <span className="
                                                    font-medium
                                                    text-black
                                                    dark:text-white
                                                ">
                                                    ₹
                                                    {
                                                        Number(
                                                            price.distanceCharge
                                                        ).toFixed(2)
                                                    }
                                                </span>
                                            </div>


                                            <div className="
                                                flex
                                                justify-between
                                                text-sm
                                            ">
                                                <span className="
                                                    text-neutral-500
                                                    dark:text-slate-400
                                                ">
                                                    Weight charge
                                                </span>

                                                <span className="
                                                    font-medium
                                                    text-black
                                                    dark:text-white
                                                ">
                                                    ₹
                                                    {
                                                        Number(
                                                            price.weightCharge
                                                        ).toFixed(2)
                                                    }
                                                </span>
                                            </div>


                                            <div className="
                                                flex
                                                justify-between
                                                text-sm
                                            ">
                                                <span className="
                                                    text-neutral-500
                                                    dark:text-slate-400
                                                ">
                                                    Dimension charge
                                                </span>

                                                <span className="
                                                    font-medium
                                                    text-black
                                                    dark:text-white
                                                ">
                                                    ₹
                                                    {
                                                        Number(
                                                            price.dimensionsCharge
                                                        ).toFixed(2)
                                                    }
                                                </span>
                                            </div>

                                        </div>


                                        <div className="
                                            my-5
                                            border-t
                                            border-neutral-100
                                            dark:border-slate-800
                                        " />


                                        <div className="
                                            flex
                                            justify-between
                                            text-sm
                                        ">
                                            <span className="
                                                text-neutral-500
                                                dark:text-slate-400
                                            ">
                                                Subtotal
                                            </span>

                                            <span className="
                                                font-medium
                                                text-black
                                                dark:text-white
                                            ">
                                                ₹
                                                {
                                                    Number(
                                                        price.originalAmount
                                                    ).toFixed(2)
                                                }
                                            </span>
                                        </div>


                                        <div className="
                                            mt-3
                                            flex
                                            justify-between
                                            text-sm
                                        ">
                                            <span className="
                                                text-neutral-500
                                                dark:text-slate-400
                                            ">
                                                Coupon discount
                                            </span>

                                            <span className="
                                                font-medium
                                                text-green-600
                                                dark:text-green-400
                                            ">
                                                - ₹
                                                {
                                                    Number(
                                                        price.discountAmount
                                                    ).toFixed(2)
                                                }
                                            </span>
                                        </div>


                                        {price.couponCode && (
                                            <p className="
                                                mt-2
                                                text-xs
                                                text-neutral-400
                                                dark:text-slate-500
                                            ">
                                                Coupon applied:{" "}
                                                {
                                                    price.couponCode
                                                }
                                            </p>
                                        )}


                                        <div className="
                                            my-5
                                            border-t
                                            border-neutral-200
                                            dark:border-slate-700
                                        " />


                                        <div className="
                                            flex
                                            items-center
                                            justify-between
                                        ">

                                            <span className="
                                                text-base
                                                font-semibold
                                                text-black
                                                dark:text-white
                                            ">
                                                Total
                                            </span>

                                            <span className="
                                                text-2xl
                                                font-bold
                                                text-black
                                                dark:text-white
                                            ">
                                                ₹
                                                {
                                                    Number(
                                                        price.finalAmount
                                                    ).toFixed(2)
                                                }
                                            </span>

                                        </div>

                                    </div>

                                </div>


                                {/* PAYMENT */}

                                <div>

                                    <p className="
                                        mb-3
                                        text-sm
                                        font-semibold
                                        text-black
                                        dark:text-white
                                    ">
                                        Payment method
                                    </p>


                                    <div className="
                                        space-y-3
                                    ">

                                        {/* ONLINE */}

                                        <button
                                            type="button"
                                            onClick={() =>
                                                setPaymentMethod(
                                                    "ONLINE"
                                                )
                                            }
                                            className={`
                                                w-full
                                                rounded-2xl
                                                border
                                                p-5
                                                text-left
                                                transition
                                                ${
                                                    paymentMethod ===
                                                    "ONLINE"
                                                        ? "border-black bg-black text-white dark:border-white dark:bg-white dark:text-black"
                                                        : "border-neutral-200 bg-white text-black hover:border-black dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:hover:border-white"
                                                }
                                            `}
                                        >

                                            <div className="
                                                flex
                                                items-center
                                                gap-4
                                            ">

                                                <div className={`
                                                    flex
                                                    h-5
                                                    w-5
                                                    shrink-0
                                                    items-center
                                                    justify-center
                                                    rounded-full
                                                    border
                                                    ${
                                                        paymentMethod ===
                                                        "ONLINE"
                                                            ? "border-white dark:border-black"
                                                            : "border-neutral-300 dark:border-slate-600"
                                                    }
                                                `}>

                                                    {paymentMethod ===
                                                        "ONLINE" && (
                                                        <div className="
                                                            h-2.5
                                                            w-2.5
                                                            rounded-full
                                                            bg-white
                                                            dark:bg-black
                                                        " />
                                                    )}

                                                </div>


                                                <div>

                                                    <p className="
                                                        text-sm
                                                        font-semibold
                                                    ">
                                                        Online Payment
                                                    </p>

                                                    <p className={`
                                                        mt-1
                                                        text-xs
                                                        ${
                                                            paymentMethod ===
                                                            "ONLINE"
                                                                ? "text-white/60 dark:text-black/60"
                                                                : "text-neutral-500 dark:text-slate-400"
                                                        }
                                                    `}>
                                                        Pay securely
                                                        using Razorpay
                                                    </p>

                                                </div>

                                            </div>

                                        </button>


                                        {/* COD */}

                                        <button
                                            type="button"
                                            onClick={() =>
                                                setPaymentMethod(
                                                    "COD"
                                                )
                                            }
                                            className={`
                                                w-full
                                                rounded-2xl
                                                border
                                                p-5
                                                text-left
                                                transition
                                                ${
                                                    paymentMethod ===
                                                    "COD"
                                                        ? "border-black bg-black text-white dark:border-white dark:bg-white dark:text-black"
                                                        : "border-neutral-200 bg-white text-black hover:border-black dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:hover:border-white"
                                                }
                                            `}
                                        >

                                            <div className="
                                                flex
                                                items-center
                                                gap-4
                                            ">

                                                <div className={`
                                                    flex
                                                    h-5
                                                    w-5
                                                    shrink-0
                                                    items-center
                                                    justify-center
                                                    rounded-full
                                                    border
                                                    ${
                                                        paymentMethod ===
                                                        "COD"
                                                            ? "border-white dark:border-black"
                                                            : "border-neutral-300 dark:border-slate-600"
                                                    }
                                                `}>

                                                    {paymentMethod ===
                                                        "COD" && (
                                                        <div className="
                                                            h-2.5
                                                            w-2.5
                                                            rounded-full
                                                            bg-white
                                                            dark:bg-black
                                                        " />
                                                    )}

                                                </div>


                                                <div>

                                                    <p className="
                                                        text-sm
                                                        font-semibold
                                                    ">
                                                        Cash on Delivery
                                                    </p>

                                                    <p className={`
                                                        mt-1
                                                        text-xs
                                                        ${
                                                            paymentMethod ===
                                                            "COD"
                                                                ? "text-white/60 dark:text-black/60"
                                                                : "text-neutral-500 dark:text-slate-400"
                                                        }
                                                    `}>
                                                        Pay when the
                                                        package is
                                                        delivered
                                                    </p>

                                                </div>

                                            </div>

                                        </button>

                                    </div>


                                    <div className="
                                        mt-5
                                        rounded-2xl
                                        bg-neutral-50
                                        p-5
                                        dark:bg-slate-800
                                    ">

                                        <div className="
                                            flex
                                            justify-between
                                            text-sm
                                        ">

                                            <span className="
                                                text-neutral-500
                                                dark:text-slate-400
                                            ">
                                                Amount to pay
                                            </span>

                                            <span className="
                                                font-bold
                                                text-black
                                                dark:text-white
                                            ">
                                                ₹
                                                {
                                                    Number(
                                                        price.finalAmount
                                                    ).toFixed(2)
                                                }
                                            </span>

                                        </div>

                                        <p className="
                                            mt-2
                                            text-xs
                                            text-neutral-400
                                            dark:text-slate-500
                                        ">
                                            {paymentMethod ===
                                            "ONLINE"
                                                ? "A Razorpay payment window will open after you place the order."
                                                : "You will pay this amount when the package is delivered."}
                                        </p>

                                    </div>

                                </div>

                            </div>
                        </>
                    )}


                    {/* ERROR */}

                    {error && (
                        <div className="
                            mt-8
                            rounded-xl
                            border
                            border-red-200
                            bg-red-50
                            px-4
                            py-3
                            text-sm
                            text-red-600
                            dark:border-red-900
                            dark:bg-red-950
                            dark:text-red-400
                        ">
                            {error}
                        </div>
                    )}


                    {/* NAVIGATION */}

                    <div className="
                        mt-10
                        flex
                        items-center
                        justify-between
                        border-t
                        border-neutral-100
                        pt-6
                        dark:border-slate-800
                    ">

                        {step > 1 ? (
                            <button
                                type="button"
                                onClick={handleBack}
                                disabled={
                                    loading ||
                                    priceLoading
                                }
                                className="
                                    rounded-xl
                                    border
                                    border-neutral-200
                                    bg-white
                                    px-5
                                    py-3
                                    text-sm
                                    font-medium
                                    text-black
                                    transition
                                    hover:bg-neutral-50
                                    disabled:opacity-50
                                    dark:border-slate-700
                                    dark:bg-slate-900
                                    dark:text-white
                                    dark:hover:bg-slate-800
                                "
                            >
                                ← Back
                            </button>
                        ) : (
                            <div />
                        )}


                        {step < 3 && (
                            <button
                                type="button"
                                onClick={handleNext}
                                disabled={loading}
                                className="
                                    rounded-xl
                                    bg-black
                                    px-6
                                    py-3
                                    text-sm
                                    font-semibold
                                    text-white
                                    transition
                                    hover:bg-neutral-800
                                    disabled:cursor-not-allowed
                                    disabled:opacity-50
                                    dark:bg-white
                                    dark:text-black
                                    dark:hover:bg-slate-200
                                "
                            >
                                Continue →
                            </button>
                        )}


                        {step === 3 && (
                            <button
                                type="button"
                                onClick={handleNext}
                                disabled={priceLoading}
                                className="
                                    rounded-xl
                                    bg-black
                                    px-6
                                    py-3
                                    text-sm
                                    font-semibold
                                    text-white
                                    transition
                                    hover:bg-neutral-800
                                    disabled:cursor-not-allowed
                                    disabled:opacity-50
                                    dark:bg-white
                                    dark:text-black
                                    dark:hover:bg-slate-200
                                "
                            >
                                {priceLoading
                                    ? "Calculating..."
                                    : "Review & Payment →"}
                            </button>
                        )}


                        {step === 4 && (
                            <button
                                type="button"
                                onClick={handleSubmit}
                                disabled={loading}
                                className="
                                    rounded-xl
                                    bg-black
                                    px-6
                                    py-3
                                    text-sm
                                    font-semibold
                                    text-white
                                    transition
                                    hover:bg-neutral-800
                                    disabled:cursor-not-allowed
                                    disabled:opacity-50
                                    dark:bg-white
                                    dark:text-black
                                    dark:hover:bg-slate-200
                                "
                            >
                                {loading
                                    ? paymentMethod ===
                                      "ONLINE"
                                        ? "Opening Razorpay..."
                                        : "Placing order..."
                                    : paymentMethod ===
                                      "ONLINE"
                                    ? "Continue to Payment →"
                                    : "Place COD Order"}
                            </button>
                        )}

                    </div>

                </div>

            </main>

        </div>
    );
}