import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { LogoWithName } from "../../components/Logo";

const API_URL = "https://nimbusgo-bck.vercel.app";

export default function PaymentWaiting() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const orderId = searchParams.get("orderId");

    const [error, setError] = useState("");

    useEffect(() => {
        if (!orderId) {
            setError("Order ID is missing.");
            return;
        }

        let interval;

        const checkPaymentStatus = async () => {
            try {
                const token = localStorage.getItem("token");

                const response = await fetch(
                    `${API_URL}/user/order/${orderId}/payment-status`,
                    {
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(
                        data.msg || "Unable to check payment status."
                    );
                }

                if (data.paymentStatus === "PAID") {
                    clearInterval(interval);

                    navigate(
                        `/order-result?status=success&orderId=${orderId}`,
                        { replace: true }
                    );

                    return;
                }

                if (data.paymentStatus === "FAILED") {
                    clearInterval(interval);

                    navigate(
                        `/order-result?status=failed&orderId=${orderId}`,
                        { replace: true }
                    );
                }

            } catch (error) {
                console.error(
                    "Payment status error:",
                    error
                );

                setError(error.message);
            }
        };

        checkPaymentStatus();

        interval = setInterval(
            checkPaymentStatus,
            3000
        );

        return () => {
            clearInterval(interval);
        };

    }, [orderId, navigate]);

    return (
        <div className="min-h-screen bg-[#fafafa] px-4 py-8 sm:px-6">

            {/* HEADER */}

            <header className="mx-auto max-w-5xl">
                <LogoWithName />
            </header>


            {/* WAITING CARD */}

            <main className="
                flex min-h-[80vh]
                items-center justify-center
            ">

                <div className="
                    w-full max-w-lg
                    rounded-3xl
                    border border-neutral-200
                    bg-white
                    p-8
                    text-center
                    shadow-sm
                    sm:p-10
                ">

                    {/* LOADING ICON */}

                    <div className="
                        mx-auto flex h-16 w-16
                        items-center justify-center
                        rounded-full
                        bg-neutral-100
                    ">

                        <div className="
                            h-8 w-8
                            animate-spin
                            rounded-full
                            border-4
                            border-neutral-200
                            border-t-black
                        " />

                    </div>


                    {/* TITLE */}

                    <h1 className="
                        mt-6
                        text-3xl
                        font-bold
                        tracking-tight
                        text-black
                    ">
                        Waiting for Payment
                    </h1>


                    {/* MESSAGE */}

                    <p className="
                        mx-auto mt-3
                        max-w-sm
                        text-sm
                        leading-6
                        text-neutral-500
                    ">
                        Complete your payment in the Razorpay window.
                        We are waiting for confirmation.
                    </p>


                    {/* ORDER ID */}

                    {orderId && (
                        <div className="
                            mt-6
                            rounded-2xl
                            bg-neutral-50
                            px-5 py-4
                        ">

                            <p className="
                                text-xs
                                text-neutral-400
                            ">
                                Order ID
                            </p>

                            <p className="
                                mt-1
                                break-all
                                text-sm
                                font-semibold
                                text-black
                            ">
                                {orderId}
                            </p>

                        </div>
                    )}


                    {/* ERROR */}

                    {error && (
                        <div className="
                            mt-5
                            rounded-xl
                            border border-red-200
                            bg-red-50
                            px-4 py-3
                            text-sm
                            text-red-600
                        ">
                            {error}
                        </div>
                    )}


                    {/* INFO */}

                    <p className="
                        mt-6
                        text-xs
                        leading-5
                        text-neutral-400
                    ">
                        Please do not close this page while your
                        payment is being processed.
                    </p>


                    {/* DASHBOARD */}

                    <button
                        type="button"
                        onClick={() =>
                            navigate(
                                "/customer/dashboard"
                            )
                        }
                        className="
                            mt-8 w-full
                            rounded-xl
                            border border-neutral-200
                            bg-white
                            px-6 py-3
                            text-sm
                            font-semibold
                            text-black
                            transition
                            hover:bg-neutral-50
                        "
                    >
                        Back to Dashboard
                    </button>

                </div>

            </main>

        </div>
    );
}