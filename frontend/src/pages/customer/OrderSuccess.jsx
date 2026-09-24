import { useLocation, useNavigate } from "react-router-dom";
import { LogoWithName } from "../../components/Logo";

export default function OrderSuccess() {
    const navigate = useNavigate();
    const location = useLocation();

    const order = location.state?.order;


    if (!order) {
        return (
            <div className="
                min-h-screen
                bg-[#fafafa]
                flex
                items-center
                justify-center
                px-6
            ">

                <div className="
                    w-full
                    max-w-md
                    rounded-3xl
                    border
                    border-neutral-200
                    bg-white
                    p-8
                    text-center
                    shadow-sm
                ">

                    <LogoWithName />

                    <h1 className="
                        mt-10
                        text-2xl
                        font-bold
                        text-black
                    ">
                        Order information unavailable
                    </h1>

                    <p className="
                        mt-3
                        text-sm
                        leading-6
                        text-neutral-500
                    ">
                        Your order may still have been
                        created. You can check your
                        orders from the dashboard.
                    </p>

                    <button
                        onClick={() =>
                            navigate(
                                "/customer/dashboard",
                                {
                                    replace: true
                                }
                            )
                        }
                        className="
                            mt-8
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
                        "
                    >
                        Back to Dashboard
                    </button>

                </div>

            </div>
        );
    }


    return (
        <div className="
            min-h-screen
            bg-[#fafafa]
            px-6
            py-8
        ">

            <main className="
                mx-auto
                flex
                min-h-[calc(100vh-64px)]
                max-w-2xl
                items-center
                justify-center
            ">

                <div className="
                    w-full
                    rounded-3xl
                    border
                    border-neutral-200
                    bg-white
                    p-8
                    text-center
                    shadow-sm
                    sm:p-10
                ">

                    <LogoWithName />


                    {/* SUCCESS ICON */}

                    <div className="
                        mx-auto
                        mt-10
                        flex
                        h-16
                        w-16
                        items-center
                        justify-center
                        rounded-full
                        bg-black
                        text-2xl
                        font-bold
                        text-white
                    ">
                        ✓
                    </div>


                    <p className="
                        mt-6
                        text-sm
                        font-medium
                        text-neutral-500
                    ">
                        Order placed successfully
                    </p>


                    <h1 className="
                        mt-2
                        text-3xl
                        font-bold
                        tracking-tight
                        text-black
                    ">
                        Your delivery is being processed
                    </h1>


                    <p className="
                        mx-auto
                        mt-4
                        max-w-md
                        text-sm
                        leading-6
                        text-neutral-500
                    ">
                        Your order has been created and
                        is currently being processed.
                    </p>


                    {/* ORDER INFORMATION */}

                    <div className="
                        mt-8
                        rounded-2xl
                        bg-neutral-50
                        p-5
                        text-left
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
                                    text-neutral-400
                                ">
                                    Order
                                </p>

                                <p className="
                                    mt-1
                                    break-all
                                    text-sm
                                    font-semibold
                                    text-black
                                ">
                                    #{order.orderId}
                                </p>

                            </div>


                            <div className="
                                rounded-full
                                bg-black
                                px-3
                                py-1.5
                                text-xs
                                font-semibold
                                text-white
                            ">
                                {order.status || "PROCESSING"}
                            </div>

                        </div>


                        <div className="
                            mt-5
                            border-t
                            border-neutral-200
                            pt-5
                        ">

                            <div className="
                                flex
                                justify-between
                                text-sm
                            ">

                                <span className="
                                    text-neutral-500
                                ">
                                    Amount
                                </span>

                                <span className="
                                    font-semibold
                                    text-black
                                ">
                                    ₹
                                    {Number(
                                        order.finalAmount
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
                                    Payment method
                                </span>

                                <span className="
                                    font-semibold
                                    text-black
                                ">
                                    {order.paymentMethod}
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
                                    Payment status
                                </span>

                                <span className="
                                    font-semibold
                                    text-black
                                ">
                                    {order.paymentStatus}
                                </span>

                            </div>

                        </div>

                    </div>


                    {/* ONLINE PAYMENT */}

                    {order.paymentMethod === "ONLINE" &&
                        order.paymentLink && (

                        <div className="
                            mt-5
                            rounded-2xl
                            border
                            border-neutral-200
                            p-5
                            text-left
                        ">

                            <p className="
                                text-sm
                                font-semibold
                                text-black
                            ">
                                Complete your payment
                            </p>

                            <p className="
                                mt-2
                                text-xs
                                leading-5
                                text-neutral-500
                            ">
                                Your order has been created.
                                Continue to Razorpay to
                                complete your payment.
                            </p>

                            <button
                                onClick={() =>
                                    window.location.href =
                                        order.paymentLink
                                }
                                className="
                                    mt-4
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
                                "
                            >
                                Continue to Payment →
                            </button>

                        </div>
                    )}


                    {/* DASHBOARD BUTTON */}

                    <button
                        onClick={() =>
                            navigate(
                                "/customer/dashboard",
                                {
                                    replace: true
                                }
                            )
                        }
                        className="
                            mt-5
                            w-full
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
                        Back to Dashboard
                    </button>

                </div>

            </main>

        </div>
    );
}