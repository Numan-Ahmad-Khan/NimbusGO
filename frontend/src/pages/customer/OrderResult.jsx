import { useSearchParams, useNavigate } from "react-router-dom";
import { LogoWithName } from "../../components/Logo";

export default function OrderResult() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const status = searchParams.get("status");
    const orderId = searchParams.get("orderId");

    const isSuccess = status === "success";

    return (
        <div className="min-h-screen bg-[#fafafa] px-4 py-8 sm:px-6">

            {/* HEADER */}

            <header className="mx-auto max-w-5xl">
                <LogoWithName />
            </header>


            {/* RESULT */}

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

                    {/* ICON */}

                    <div className={`
                        mx-auto flex h-16 w-16
                        items-center justify-center
                        rounded-full
                        ${
                            isSuccess
                                ? "bg-green-100"
                                : "bg-red-100"
                        }
                    `}>

                        {isSuccess ? (
                            <svg
                                className="h-8 w-8 text-green-600"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M20 6 9 17l-5-5" />
                            </svg>
                        ) : (
                            <svg
                                className="h-8 w-8 text-red-600"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M18 6 6 18" />
                                <path d="m6 6 12 12" />
                            </svg>
                        )}

                    </div>


                    {/* TITLE */}

                    <h1 className="
                        mt-6 text-3xl
                        font-bold tracking-tight
                        text-black
                    ">
                        {isSuccess
                            ? "Order Placed"
                            : "Order Failed"}
                    </h1>


                    {/* MESSAGE */}

                    <p className="
                        mx-auto mt-3
                        max-w-sm
                        text-sm leading-6
                        text-neutral-500
                    ">
                        {isSuccess
                            ? "Your order has been placed successfully. You can track your delivery from your dashboard."
                            : "We couldn't complete your order. Your payment may have failed or the order could not be processed."}
                    </p>


                    {/* ORDER ID */}

                    {orderId && (
                        <div className="
                            mt-6 rounded-2xl
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


                    {/* BUTTON */}

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
                            bg-black
                            px-6 py-3
                            text-sm
                            font-semibold
                            text-white
                            transition
                            hover:bg-neutral-800
                        "
                    >
                        Back to Dashboard
                    </button>

                </div>

            </main>

        </div>
    );
}