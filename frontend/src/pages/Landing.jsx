import { LogoWithName } from "../components/Logo";
import { useNavigate } from "react-router-dom";

export default function Landing() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-[#fafafa]">

            {/* Navbar */}
            <nav className="
                mx-auto
                flex
                max-w-6xl
                items-center
                justify-between
                px-6
                py-6
            ">

                {/* Admin access */}
                <button
                    onClick={() =>
                        navigate("/admin/login")
                    }
                    className="
                        rounded-xl
                        transition
                        hover:opacity-70
                    "
                    aria-label="Admin login"
                    title="Admin login"
                >
                    <LogoWithName />
                </button>


                {/* Customer login */}
                <button
                    onClick={() =>
                        navigate("/login")
                    }
                    className="
                        rounded-xl
                        px-4
                        py-2
                        text-sm
                        font-medium
                        text-neutral-600
                        transition
                        hover:bg-neutral-100
                        hover:text-black
                    "
                >
                    Login
                </button>

            </nav>


            {/* Hero */}
            <main className="
                mx-auto
                grid
                max-w-6xl
                items-center
                gap-16
                px-6
                pb-20
                pt-16
                lg:grid-cols-2
                lg:pt-24
            ">

                {/* Left side */}
                <div>

                    <div className="
                        mb-6
                        inline-flex
                        rounded-full
                        border
                        border-neutral-200
                        bg-white
                        px-4
                        py-2
                        text-xs
                        font-medium
                        text-neutral-600
                    ">
                        From point A to point B at racing broom speeds.
                    </div>


                    <h1 className="
                        max-w-xl
                        text-5xl
                        font-bold
                        leading-tight
                        tracking-tight
                        text-black
                        sm:text-6xl
                    ">
                        Delivered faster
                        <br />
                        than a Nimbus
                        <br />
                        2000.
                    </h1>


                    <p className="
                        mt-6
                        max-w-lg
                        text-base
                        leading-7
                        text-neutral-500
                    ">
                        NimbusGO makes delivery simple,
                        fast and hassle-free.
                    </p>


                    <div className="
                        mt-8
                        flex
                        flex-col
                        gap-3
                        sm:flex-row
                    ">

                        <button
                            onClick={() =>
                                navigate("/choose-account")
                            }
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
                            "
                        >
                            Get Started
                        </button>


                        <button
                            onClick={() =>
                                navigate("/login")
                            }
                            className="
                                rounded-xl
                                border
                                border-neutral-200
                                bg-white
                                px-6
                                py-3
                                text-sm
                                font-semibold
                                text-black
                                transition
                                hover:bg-neutral-50
                            "
                        >
                            Login
                        </button>

                    </div>

                </div>


                {/* Right side */}
                <div className="
                    hidden
                    lg:flex
                    lg:justify-end
                ">

                    <div className="
                        flex
                        h-[420px]
                        w-[420px]
                        items-center
                        justify-center
                        rounded-[40px]
                        bg-black
                    ">

                        <img
                            src="/pictures/NimbusGO_Full.png"
                            alt="NimbusGO"
                            className="
                                w-64
                                object-contain
                            "
                        />

                    </div>

                </div>

            </main>

        </div>
    );
}
