import SwipeButton from "../SwipeButton";

export default function RiderOrderCard({
    order,
    onAccept
}) {
    return (
        <div className="
            rounded-3xl
            border border-neutral-200
            bg-white p-5
            shadow-sm
        ">

            <div className="
                flex items-start
                justify-between gap-4
            ">

                <div>

                    <p className="
                        text-xs font-medium
                        uppercase tracking-wide
                        text-neutral-400
                    ">
                        Delivery request
                    </p>

                    <h3 className="
                        mt-1 text-lg
                        font-bold text-black
                    ">
                        {order.orderName}
                    </h3>

                </div>

                <div className="
                    rounded-full
                    bg-neutral-100
                    px-3 py-1
                    text-xs font-medium
                    text-neutral-600
                ">
                    {order.distance} km
                </div>

            </div>

            <div className="
                mt-5 space-y-4
            ">

                <div>

                    <p className="
                        text-xs font-medium
                        text-neutral-400
                    ">
                        PICKUP
                    </p>

                    <p className="
                        mt-1 text-sm
                        text-neutral-700
                    ">
                        {order.pickup}
                    </p>

                </div>

                <div className="
                    ml-1 h-5 border-l
                    border-dashed border-neutral-300
                " />

                <div>

                    <p className="
                        text-xs font-medium
                        text-neutral-400
                    ">
                        DROP
                    </p>

                    <p className="
                        mt-1 text-sm
                        text-neutral-700
                    ">
                        {order.drop}
                    </p>

                </div>

            </div>

            <div className="
                mt-5 grid grid-cols-2
                gap-3
            ">

                <div className="
                    rounded-xl bg-neutral-50
                    px-4 py-3
                ">

                    <p className="
                        text-xs text-neutral-400
                    ">
                        Weight
                    </p>

                    <p className="
                        mt-1 text-sm
                        font-semibold
                    ">
                        {order.weight} kg
                    </p>

                </div>

                <div className="
                    rounded-xl bg-neutral-50
                    px-4 py-3
                ">

                    <p className="
                        text-xs text-neutral-400
                    ">
                        Earnings
                    </p>

                    <p className="
                        mt-1 text-sm
                        font-semibold
                    ">
                        ₹{order.earnings}
                    </p>

                </div>

            </div>

            <div className="mt-5">

                <SwipeButton
                    onAccept={() => onAccept(order)}
                />

            </div>

        </div>
    );
}