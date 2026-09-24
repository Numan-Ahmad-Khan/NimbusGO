import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { logout } from "../../services/auth";
import {
    previewOrder,
    placeOrder
} from "../../services/order";

import { LogoOnly } from "../../components/Logo";


export default function PlaceOrder() {

    const navigate = useNavigate();


    const [step, setStep] =
        useState(1);

    const [loading, setLoading] =
        useState(false);

    const [previewLoading, setPreviewLoading] =
        useState(false);

    const [error, setError] =
        useState("");


    const [form, setForm] = useState({

        orderName: "",
        orderDetails: "",

        orderWeight: "",
        orderLength: "",
        orderBreadth: "",
        orderHeight: "",

        pickupStreet: "",
        pickupLandmark: "",
        pickupPincode: "",
        pickupLatitude: "",
        pickupLongitude: "",

        dropStreet: "",
        dropLandmark: "",
        dropPincode: "",
        dropLatitude: "",
        dropLongitude: "",

        paymentMethod: "COD",

        couponCode: ""

    });


    const [priceData, setPriceData] =
        useState(null);


    function updateField(
        field,
        value
    ) {

        setForm(
            (previous) => ({
                ...previous,
                [field]: value
            })
        );

        setError("");
    }


    function handleLogout() {

        logout();

        navigate(
            "/",
            {
                replace: true
            }
        );
    }


    function validateStep() {

        setError("");


        if (step === 1) {

            if (
                !form.pickupStreet ||
                !form.pickupPincode
            ) {
                setError(
                    "Please enter the pickup address and pincode."
                );

                return false;
            }

            return true;
        }


        if (step === 2) {

            if (
                !form.dropStreet ||
                !form.dropPincode
            ) {
                setError(
                    "Please enter the drop address and pincode."
                );

                return false;
            }

            return true;
        }


        if (step === 3) {

            if (!form.orderName) {

                setError(
                    "Please enter a package name."
                );

                return false;
            }


            if (!form.orderWeight) {

                setError(
                    "Please enter the package weight."
                );

                return false;
            }


            if (
                !form.orderLength ||
                !form.orderBreadth ||
                !form.orderHeight
            ) {

                setError(
                    "Please enter the package dimensions."
                );

                return false;
            }

            return true;
        }


        return true;
    }


    function buildOrderData() {

        return {

            orderName:
                form.orderName,

            orderDetails:
                form.orderDetails,

            orderWeight:
                Number(form.orderWeight),

            orderLength:
                Number(form.orderLength),

            orderBreadth:
                Number(form.orderBreadth),

            orderHeight:
                Number(form.orderHeight),


            pickup: {

                street:
                    form.pickupStreet,

                landmark:
                    form.pickupLandmark,

                pincode:
                    form.pickupPincode,

                latitude:
                    form.pickupLatitude
                        ? Number(form.pickupLatitude)
                        : null,

                longitude:
                    form.pickupLongitude
                        ? Number(form.pickupLongitude)
                        : null
            },


            drop: {

                street:
                    form.dropStreet,

                landmark:
                    form.dropLandmark,

                pincode:
                    form.dropPincode,

                latitude:
                    form.dropLatitude
                        ? Number(form.dropLatitude)
                        : null,

                longitude:
                    form.dropLongitude
                        ? Number(form.dropLongitude)
                        : null
            },


            paymentMethod:
                form.paymentMethod,


            ...(form.couponCode
                ? {
                    couponCode:
                        form.couponCode
                }
                : {})
        };
    }


    async function handlePreview() {

        if (!validateStep()) {
            return;
        }


        setPreviewLoading(true);
        setError("");


        try {

            const data =
                await previewOrder(
                    buildOrderData()
                );


            setPriceData(data);

            setStep(4);

        } catch (error) {

            console.log(
                "Preview order failed:",
                error
            );

            setError(
                error.message
            );

        } finally {

            setPreviewLoading(false);
        }
    }


    async function handlePlaceOrder() {

        setLoading(true);
        setError("");


        try {

            const data =
                await placeOrder(
                    buildOrderData()
                );


            sessionStorage.setItem(
                "nimbusgo_order_success",
                JSON.stringify(data)
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

            console.log(
                "Place order failed:",
                error
            );

            setError(
                error.message
            );

        } finally {

            setLoading(false);
        }
    }


    function goNext() {

        if (!validateStep()) {
            return;
        }


        if (step === 3) {

            handlePreview();

            return;
        }


        setStep(
            (previous) =>
                previous + 1
        );
    }


    function goBack() {

        setError("");


        if (step === 1) {

            navigate(
                "/customer/dashboard"
            );

            return;
        }


        setStep(
            (previous) =>
                previous - 1
        );
    }


    return (
        <div className="
            min-h-screen
            bg-[#fafafa]
        ">


            {/* NAVBAR */}

            <nav className="
                border-b
                border-neutral-200
                bg-white
            ">

                <div className="
                    mx-auto
                    flex
                    max-w-5xl
                    items-center
                    justify-between
                    px-6
                    py-5
                ">

                    <LogoOnly />


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
                            text-black
                            transition
                            hover:bg-neutral-50
                        "
                    >
                        Logout
                    </button>

                </div>

            </nav>


            {/* MAIN */}

            <main className="
                mx-auto
                max-w-3xl
                px-6
                pb-20
                pt-10
            ">


                {/* HEADER */}

                <div>

                    <button
                        onClick={goBack}
                        className="
                            text-sm
                            font-medium
                            text-neutral-500
                            hover:text-black
                        "
                    >
                        ← Back
                    </button>


                    <p className="
                        mt-8
                        text-sm
                        font-medium
                        text-neutral-500
                    ">
                        New delivery
                    </p>


                    <h1 className="
                        mt-2
                        text-4xl
                        font-bold
                        tracking-tight
                        text-black
                    ">
                        Send a package
                    </h1>


                    <p className="
                        mt-3
                        text-sm
                        leading-6
                        text-neutral-500
                    ">
                        Enter your delivery details
                        and we'll calculate the price.
                    </p>

                </div>


                {/* STEPS */}

                <div className="
                    mt-8
                    flex
                    items-center
                    gap-2
                ">

                    {[1, 2, 3, 4].map(
                        (number) => (

                        <div
                            key={number}
                            className={`
                                h-1.5
                                flex-1
                                rounded-full
                                ${
                                    number <= step
                                        ? "bg-black"
                                        : "bg-neutral-200"
                                }
                            `}
                        />

                    ))}

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
                    ">
                        {error}
                    </div>

                )}


                {/* FORM CARD */}

                <div className="
                    mt-8
                    rounded-3xl
                    border
                    border-neutral-200
                    bg-white
                    p-6
                    shadow-sm
                    sm:p-8
                ">


                    {/* STEP 1 */}

                    {step === 1 && (

                        <div>

                            <p className="
                                text-sm
                                font-medium
                                text-neutral-500
                            ">
                                Step 1
                            </p>


                            <h2 className="
                                mt-1
                                text-2xl
                                font-bold
                            ">
                                Pickup location
                            </h2>


                            <p className="
                                mt-2
                                text-sm
                                text-neutral-500
                            ">
                                Where should we collect
                                the package?
                            </p>


                            <div className="
                                mt-8
                                space-y-5
                            ">

                                <Field
                                    label="Street address"
                                    value={
                                        form.pickupStreet
                                    }
                                    onChange={
                                        (value) =>
                                            updateField(
                                                "pickupStreet",
                                                value
                                            )
                                    }
                                    placeholder="Enter pickup address"
                                />


                                <Field
                                    label="Landmark"
                                    value={
                                        form.pickupLandmark
                                    }
                                    onChange={
                                        (value) =>
                                            updateField(
                                                "pickupLandmark",
                                                value
                                            )
                                    }
                                    placeholder="Optional"
                                />


                                <Field
                                    label="Pincode"
                                    value={
                                        form.pickupPincode
                                    }
                                    onChange={
                                        (value) =>
                                            updateField(
                                                "pickupPincode",
                                                value
                                            )
                                    }
                                    placeholder="Enter pincode"
                                    type="number"
                                />


                                <div className="
                                    grid
                                    gap-5
                                    sm:grid-cols-2
                                ">

                                    <Field
                                        label="Latitude"
                                        value={
                                            form.pickupLatitude
                                        }
                                        onChange={
                                            (value) =>
                                                updateField(
                                                    "pickupLatitude",
                                                    value
                                                )
                                        }
                                        placeholder="Optional"
                                    />


                                    <Field
                                        label="Longitude"
                                        value={
                                            form.pickupLongitude
                                        }
                                        onChange={
                                            (value) =>
                                                updateField(
                                                    "pickupLongitude",
                                                    value
                                                )
                                        }
                                        placeholder="Optional"
                                    />

                                </div>

                            </div>

                        </div>

                    )}


                    {/* STEP 2 */}

                    {step === 2 && (

                        <div>

                            <p className="
                                text-sm
                                font-medium
                                text-neutral-500
                            ">
                                Step 2
                            </p>


                            <h2 className="
                                mt-1
                                text-2xl
                                font-bold
                            ">
                                Drop location
                            </h2>


                            <p className="
                                mt-2
                                text-sm
                                text-neutral-500
                            ">
                                Where should we deliver
                                the package?
                            </p>


                            <div className="
                                mt-8
                                space-y-5
                            ">

                                <Field
                                    label="Street address"
                                    value={
                                        form.dropStreet
                                    }
                                    onChange={
                                        (value) =>
                                            updateField(
                                                "dropStreet",
                                                value
                                            )
                                    }
                                    placeholder="Enter drop address"
                                />


                                <Field
                                    label="Landmark"
                                    value={
                                        form.dropLandmark
                                    }
                                    onChange={
                                        (value) =>
                                            updateField(
                                                "dropLandmark",
                                                value
                                            )
                                    }
                                    placeholder="Optional"
                                />


                                <Field
                                    label="Pincode"
                                    value={
                                        form.dropPincode
                                    }
                                    onChange={
                                        (value) =>
                                            updateField(
                                                "dropPincode",
                                                value
                                            )
                                    }
                                    placeholder="Enter pincode"
                                    type="number"
                                />


                                <div className="
                                    grid
                                    gap-5
                                    sm:grid-cols-2
                                ">

                                    <Field
                                        label="Latitude"
                                        value={
                                            form.dropLatitude
                                        }
                                        onChange={
                                            (value) =>
                                                updateField(
                                                    "dropLatitude",
                                                    value
                                                )
                                        }
                                        placeholder="Optional"
                                    />


                                    <Field
                                        label="Longitude"
                                        value={
                                            form.dropLongitude
                                        }
                                        onChange={
                                            (value) =>
                                                updateField(
                                                    "dropLongitude",
                                                    value
                                                )
                                        }
                                        placeholder="Optional"
                                    />

                                </div>

                            </div>

                        </div>

                    )}


                    {/* STEP 3 */}

                    {step === 3 && (

                        <div>

                            <p className="
                                text-sm
                                font-medium
                                text-neutral-500
                            ">
                                Step 3
                            </p>


                            <h2 className="
                                mt-1
                                text-2xl
                                font-bold
                            ">
                                Package details
                            </h2>


                            <p className="
                                mt-2
                                text-sm
                                text-neutral-500
                            ">
                                Tell us about the package.
                            </p>


                            <div className="
                                mt-8
                                space-y-5
                            ">

                                <Field
                                    label="Package name"
                                    value={
                                        form.orderName
                                    }
                                    onChange={
                                        (value) =>
                                            updateField(
                                                "orderName",
                                                value
                                            )
                                    }
                                    placeholder="e.g. Documents"
                                />


                                <div>

                                    <label className="
                                        text-sm
                                        font-medium
                                        text-neutral-700
                                    ">
                                        Package details
                                    </label>


                                    <textarea
                                        value={
                                            form.orderDetails
                                        }
                                        onChange={
                                            (event) =>
                                                updateField(
                                                    "orderDetails",
                                                    event.target.value
                                                )
                                        }
                                        placeholder="Describe the package"
                                        rows="4"
                                        className="
                                            mt-2
                                            w-full
                                            resize-none
                                            rounded-xl
                                            border
                                            border-neutral-200
                                            px-4
                                            py-3
                                            text-sm
                                            outline-none
                                            transition
                                            focus:border-black
                                        "
                                    />

                                </div>


                                <Field
                                    label="Weight (kg)"
                                    value={
                                        form.orderWeight
                                    }
                                    onChange={
                                        (value) =>
                                            updateField(
                                                "orderWeight",
                                                value
                                            )
                                    }
                                    placeholder="e.g. 2"
                                    type="number"
                                />


                                <div className="
                                    grid
                                    gap-5
                                    sm:grid-cols-3
                                ">

                                    <Field
                                        label="Length (cm)"
                                        value={
                                            form.orderLength
                                        }
                                        onChange={
                                            (value) =>
                                                updateField(
                                                    "orderLength",
                                                    value
                                                )
                                        }
                                        placeholder="Length"
                                        type="number"
                                    />


                                    <Field
                                        label="Breadth (cm)"
                                        value={
                                            form.orderBreadth
                                        }
                                        onChange={
                                            (value) =>
                                                updateField(
                                                    "orderBreadth",
                                                    value
                                                )
                                        }
                                        placeholder="Breadth"
                                        type="number"
                                    />


                                    <Field
                                        label="Height (cm)"
                                        value={
                                            form.orderHeight
                                        }
                                        onChange={
                                            (value) =>
                                                updateField(
                                                    "orderHeight",
                                                    value
                                                )
                                        }
                                        placeholder="Height"
                                        type="number"
                                    />

                                </div>

                            </div>

                        </div>

                    )}


                    {/* STEP 4 */}

                    {step === 4 && (

                        <div>

                            <p className="
                                text-sm
                                font-medium
                                text-neutral-500
                            ">
                                Step 4
                            </p>


                            <h2 className="
                                mt-1
                                text-2xl
                                font-bold
                            ">
                                Review & payment
                            </h2>


                            <p className="
                                mt-2
                                text-sm
                                text-neutral-500
                            ">
                                Review your delivery before
                                placing the order.
                            </p>


                            <div className="
                                mt-8
                                space-y-4
                            ">

                                <SummaryRow
                                    label="Package"
                                    value={
                                        form.orderName
                                    }
                                />


                                <SummaryRow
                                    label="Weight"
                                    value={`
                                        ${form.orderWeight} kg
                                    `}
                                />


                                <SummaryRow
                                    label="Dimensions"
                                    value={`
                                        ${form.orderLength} ×
                                        ${form.orderBreadth} ×
                                        ${form.orderHeight} cm
                                    `}
                                />


                                <SummaryRow
                                    label="Payment"
                                    value={
                                        form.paymentMethod
                                    }
                                />

                            </div>


                            {/* COUPON */}

                            <div className="
                                mt-8
                            ">

                                <label className="
                                    text-sm
                                    font-medium
                                    text-neutral-700
                                ">
                                    Coupon code
                                </label>


                                <input
                                    value={
                                        form.couponCode
                                    }
                                    onChange={
                                        (event) =>
                                            updateField(
                                                "couponCode",
                                                event.target.value
                                            )
                                    }
                                    placeholder="Optional"
                                    className="
                                        mt-2
                                        w-full
                                        rounded-xl
                                        border
                                        border-neutral-200
                                        px-4
                                        py-3
                                        text-sm
                                        uppercase
                                        outline-none
                                        focus:border-black
                                    "
                                />

                            </div>


                            {/* PAYMENT METHOD */}

                            <div className="
                                mt-8
                            ">

                                <p className="
                                    text-sm
                                    font-medium
                                    text-neutral-700
                                ">
                                    Payment method
                                </p>


                                <div className="
                                    mt-3
                                    grid
                                    gap-3
                                    sm:grid-cols-2
                                ">

                                    <button
                                        type="button"
                                        onClick={() =>
                                            updateField(
                                                "paymentMethod",
                                                "COD"
                                            )
                                        }
                                        className={`
                                            rounded-2xl
                                            border
                                            p-4
                                            text-left
                                            transition
                                            ${
                                                form.paymentMethod === "COD"
                                                    ? "border-black bg-black text-white"
                                                    : "border-neutral-200 bg-white"
                                            }
                                        `}
                                    >

                                        <p className="
                                            text-sm
                                            font-semibold
                                        ">
                                            Cash on delivery
                                        </p>


                                        <p className={`
                                            mt-1
                                            text-xs
                                            ${
                                                form.paymentMethod === "COD"
                                                    ? "text-neutral-300"
                                                    : "text-neutral-500"
                                            }
                                        `}>
                                            Pay when the package
                                            is delivered.
                                        </p>

                                    </button>


                                    <button
                                        type="button"
                                        onClick={() =>
                                            updateField(
                                                "paymentMethod",
                                                "ONLINE"
                                            )
                                        }
                                        className={`
                                            rounded-2xl
                                            border
                                            p-4
                                            text-left
                                            transition
                                            ${
                                                form.paymentMethod === "ONLINE"
                                                    ? "border-black bg-black text-white"
                                                    : "border-neutral-200 bg-white"
                                            }
                                        `}
                                    >

                                        <p className="
                                            text-sm
                                            font-semibold
                                        ">
                                            Online payment
                                        </p>


                                        <p className={`
                                            mt-1
                                            text-xs
                                            ${
                                                form.paymentMethod === "ONLINE"
                                                    ? "text-neutral-300"
                                                    : "text-neutral-500"
                                            }
                                        `}>
                                            Pay securely online.
                                        </p>

                                    </button>

                                </div>

                            </div>


                            {/* PRICE */}

                            {priceData && (

                                <div className="
                                    mt-8
                                    rounded-2xl
                                    bg-neutral-50
                                    p-5
                                ">

                                    <div className="
                                        flex
                                        justify-between
                                        text-sm
                                    ">

                                        <span className="
                                            text-neutral-500
                                        ">
                                            Original amount
                                        </span>


                                        <span className="
                                            font-medium
                                        ">
                                            ₹
                                            {Number(
                                                priceData.originalAmount ??
                                                priceData.price ??
                                                0
                                            ).toFixed(2)}
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
                                        ">
                                            Discount
                                        </span>


                                        <span className="
                                            font-medium
                                        ">
                                            - ₹
                                            {Number(
                                                priceData.discountAmount ??
                                                0
                                            ).toFixed(2)}
                                        </span>

                                    </div>


                                    <div className="
                                        mt-4
                                        flex
                                        justify-between
                                        border-t
                                        border-neutral-200
                                        pt-4
                                    ">

                                        <span className="
                                            font-semibold
                                        ">
                                            Total
                                        </span>


                                        <span className="
                                            text-xl
                                            font-bold
                                        ">
                                            ₹
                                            {Number(
                                                priceData.finalAmount ??
                                                priceData.price ??
                                                0
                                            ).toFixed(2)}
                                        </span>

                                    </div>

                                </div>

                            )}

                        </div>

                    )}


                    {/* ACTIONS */}

                    <div className="
                        mt-10
                        flex
                        gap-3
                    ">

                        {step > 1 && (

                            <button
                                type="button"
                                onClick={() => {
                                    setError("");
                                    setStep(
                                        (previous) =>
                                            previous - 1
                                    );
                                }}
                                className="
                                    rounded-xl
                                    border
                                    border-neutral-200
                                    bg-white
                                    px-5
                                    py-3
                                    text-sm
                                    font-semibold
                                    text-black
                                    transition
                                    hover:bg-neutral-50
                                "
                            >
                                Back
                            </button>

                        )}


                        <button
                            type="button"
                            onClick={
                                step === 4
                                    ? handlePlaceOrder
                                    : goNext
                            }
                            disabled={
                                loading ||
                                previewLoading
                            }
                            className="
                                flex-1
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

                            {loading
                                ? "Placing order..."
                                : previewLoading
                                    ? "Calculating price..."
                                    : step === 4
                                        ? "Place order"
                                        : "Continue"
                            }

                        </button>

                    </div>

                </div>

            </main>

        </div>
    );
}


/* FIELD */

function Field({
    label,
    value,
    onChange,
    placeholder,
    type = "text"
}) {

    return (

        <div>

            <label className="
                text-sm
                font-medium
                text-neutral-700
            ">
                {label}
            </label>


            <input
                type={type}
                value={value}
                onChange={
                    (event) =>
                        onChange(
                            event.target.value
                        )
                }
                placeholder={placeholder}
                className="
                    mt-2
                    w-full
                    rounded-xl
                    border
                    border-neutral-200
                    px-4
                    py-3
                    text-sm
                    outline-none
                    transition
                    focus:border-black
                "
            />

        </div>

    );
}


/* SUMMARY ROW */

function SummaryRow({
    label,
    value
}) {

    return (

        <div className="
            flex
            items-center
            justify-between
            gap-5
            rounded-xl
            bg-neutral-50
            px-4
            py-3
        ">

            <span className="
                text-sm
                text-neutral-500
            ">
                {label}
            </span>


            <span className="
                text-right
                text-sm
                font-semibold
            ">
                {value}
            </span>

        </div>

    );
}