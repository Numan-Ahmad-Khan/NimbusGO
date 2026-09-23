import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { LogoOnly } from "../../components/Logo";
import Button from "../../components/Button";

import { getRiderMe } from "../../services/rider";


export default function RiderVerification() {
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [rider, setRider] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        async function loadRider() {
            try {
                const data = await getRiderMe();

                setRider(data.rider);

            } catch (error) {
                setError(error.message);

            } finally {
                setLoading(false);
            }
        }

        loadRider();
    }, []);

    function continueToDashboard() {
        navigate("/rider/dashboard", {
            replace: true
        });
    }

    if (loading) {
        return (
            <div className="
                flex min-h-screen
                items-center justify-center
                bg-[#fafafa]
            ">
                <p className="text-sm text-neutral-500">
                    Checking your rider account...
                </p>
            </div>
        );
    }

    return (
    <div className="min-h-screen bg-[#fafafa]">

        <main className="
            flex min-h-screen
            items-center justify-center
            px-6
        ">

            <div className="w-full max-w-md">

                <div className="text-center">

                    <div className="
                        mx-auto flex h-12 w-12
                        items-center justify-center
                    ">
                        <LogoOnly />
                    </div>

                    <h1 className="
                        mt-6 text-3xl
                        font-bold tracking-tight
                    ">
                        Rider account
                    </h1>

                    <p className="
                        mt-2 text-sm
                        text-neutral-500
                    ">
                        Your rider account is ready.
                    </p>

                </div>

                <div className="
                    mt-8 rounded-3xl
                    border border-neutral-200
                    bg-white p-7 shadow-sm
                ">

                    {error ? (
                        <div className="
                            rounded-xl
                            border border-red-200
                            bg-red-50
                            px-4 py-3
                            text-sm text-red-600
                        ">
                            {error}
                        </div>
                    ) : (
                        <>
                            <div className="
                                rounded-2xl
                                bg-neutral-50
                                p-5
                            ">

                                <p className="
                                    text-xs font-medium
                                    uppercase tracking-wide
                                    text-neutral-400
                                ">
                                    Rider
                                </p>

                                <p className="
                                    mt-2 text-lg
                                    font-semibold text-black
                                ">
                                    {rider?.name}
                                </p>

                                <p className="
                                    mt-1 text-sm
                                    text-neutral-500
                                ">
                                    {rider?.email}
                                </p>

                                <div className="
                                    mt-4 flex items-center
                                    gap-2 text-sm
                                ">

                                    <span className="
                                        h-2 w-2 rounded-full
                                        bg-green-500
                                    " />

                                    <span className="
                                        text-neutral-600
                                    ">
                                        Account active
                                    </span>

                                </div>

                            </div>

                            <div className="mt-6">

                                <Button
                                    type="button"
                                    onClick={continueToDashboard}
                                >
                                    Continue to dashboard
                                </Button>

                            </div>
                        </>
                    )}

                </div>

            </div>

        </main>

    </div>
);
}