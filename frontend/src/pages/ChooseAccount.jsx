import { useNavigate } from "react-router-dom";

export default function ChooseAccount() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-[#fafafa]">

            {/* Navbar */}
            <nav className="mx-auto flex max-w-6xl items-center px-6 py-6">
                <button
                    onClick={() => navigate("/")}
                    className="
                        text-sm
                        font-medium
                        text-neutral-500
                        transition
                        hover:text-black
                    "
                >
                    ← Back
                </button>
            </nav>

            {/* Main */}
            <main className="
                mx-auto
                flex
                min-h-[calc(100vh-100px)]
                max-w-5xl
                flex-col
                justify-center
                px-6
                pb-16
            ">

                {/* Heading */}
                <div className="mx-auto max-w-xl text-center">

                    <p className="
                        text-sm
                        font-medium
                        text-neutral-500
                    ">
                        Welcome to NimbusGO
                    </p>

                    <h1 className="
                        mt-3
                        text-4xl
                        font-bold
                        tracking-tight
                        text-black
                        sm:text-5xl
                    ">
                        What brings you here?
                    </h1>

                    <p className="
                        mt-4
                        text-base
                        leading-7
                        text-neutral-500
                    ">
                        Choose how you want to use NimbusGO.
                    </p>

                </div>

                {/* Account cards */}
                <div className="
                    mx-auto
                    mt-12
                    grid
                    w-full
                    max-w-3xl
                    gap-6
                    md:grid-cols-2
                ">

                    {/* Customer */}
                    <div className="
                        rounded-3xl
                        border
                        border-neutral-200
                        bg-white
                        p-7
                        transition
                        hover:border-neutral-300
                    ">

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
                            C
                        </div>

                        <h2 className="
                            mt-6
                            text-2xl
                            font-bold
                            tracking-tight
                        ">
                            Customer
                        </h2>

                        <p className="
                            mt-3
                            min-h-[72px]
                            text-sm
                            leading-6
                            text-neutral-500
                        ">
                            Send packages from one location
                            to another quickly and easily.
                        </p>

                        <div className="mt-7 space-y-3">

                            <button
                                onClick={() => navigate("/signup")}
                                className="
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
                                Create Customer Account
                            </button>

                            <button
                                onClick={() => navigate("/login")}
                                className="
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
                                Customer Login
                            </button>

                        </div>

                    </div>


                    {/* Rider */}
                    <div className="
                        rounded-3xl
                        border
                        border-neutral-200
                        bg-white
                        p-7
                        transition
                        hover:border-neutral-300
                    ">

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
                            R
                        </div>

                        <h2 className="
                            mt-6
                            text-2xl
                            font-bold
                            tracking-tight
                        ">
                            Rider
                        </h2>

                        <p className="
                            mt-3
                            min-h-[72px]
                            text-sm
                            leading-6
                            text-neutral-500
                        ">
                            Deliver packages, complete orders,
                            and earn with NimbusGO.
                        </p>

                        <div className="mt-7 space-y-3">

                            <button
                                onClick={() => navigate("/rider/signup")}
                                className="
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
                                Create Rider Account
                            </button>

                            <button
                                onClick={() => navigate("/rider/login")}
                                className="
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
                                Rider Login
                            </button>

                        </div>

                    </div>

                </div>

            </main>

        </div>
    );
}