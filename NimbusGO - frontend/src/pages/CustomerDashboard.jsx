import { useNavigate } from "react-router-dom";
import { logout } from "../services/auth";
import Logo from "../components/Logo";

export default function CustomerDashboard() {
    const navigate = useNavigate();

    function handleLogout() {
        logout();
        navigate("/", { replace: true });
    }

    return (
        <div className="min-h-screen bg-[#fafafa]">

            {/* Navbar */}
            <nav className="
                border-b
                border-neutral-200
                bg-white
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

                    <Logo />

                    <div className="flex items-center gap-4">

                        <span className="
                            hidden
                            text-sm
                            text-neutral-500
                            sm:block
                        ">
                            Customer
                        </span>

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

                </div>
            </nav>


            {/* Main */}
            <main className="
                mx-auto
                max-w-6xl
                px-6
                pb-20
                pt-12
            ">

                {/* Welcome */}
                <div>

                    <p className="
                        text-sm
                        font-medium
                        text-neutral-500
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
                    ">
                        What would you like to do?
                    </h1>

                    <p className="
                        mt-4
                        max-w-xl
                        text-base
                        leading-7
                        text-neutral-500
                    ">
                        Send packages quickly and keep track of
                        your deliveries from one place.
                    </p>

                </div>


                {/* Main actions */}
                <div className="
                    mt-10
                    grid
                    gap-6
                    md:grid-cols-2
                ">

                    {/* Send package */}
                    <button
                        onClick={() => {
                            console.log("Send package clicked");
                        }}
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
                        ">
                            Create a new delivery, add pickup
                            and drop locations, and get your
                            delivery price.
                        </p>

                        <div className="
                            mt-8
                            text-sm
                            font-semibold
                        ">
                            Create delivery →
                        </div>

                    </button>


                    {/* My orders */}
                    <button
                        onClick={() => {
                            console.log("My orders clicked");
                        }}
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
                        ">
                            View orders →
                        </div>

                    </button>

                </div>


                {/* Recent orders */}
                <section className="mt-12">

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
                            ">
                                Your latest deliveries will appear here.
                            </p>
                        </div>

                        <button
                            onClick={() => {
                                console.log("View all orders clicked");
                            }}
                            className="
                                text-sm
                                font-semibold
                                text-black
                                hover:underline
                            "
                        >
                            View all
                        </button>

                    </div>


                    {/* Empty state */}
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
                        ">
                            Once you create a delivery,
                            your recent orders will appear here.
                        </p>

                    </div>

                </section>

            </main>

        </div>
    );
}