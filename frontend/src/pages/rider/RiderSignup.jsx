import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { LogoOnly } from "../../components/Logo";
import AuthInput from "../../components/AuthInput";
import Button from "../../components/Button";

import { riderSignup } from "../../services/rider";

export default function RiderSignup() {
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function handleSubmit(event) {
        event.preventDefault();

        setError("");
        setLoading(true);

        try {
            let latitude = 34.0837;
            let longitude = 74.7973;

            if (navigator.geolocation) {
                try {
                    const position =
                        await new Promise((resolve, reject) => {
                            navigator.geolocation.getCurrentPosition(
                                resolve,
                                reject,
                                {
                                    enableHighAccuracy: true,
                                    timeout: 10000
                                }
                            );
                        });

                    latitude =
                        position.coords.latitude;

                    longitude =
                        position.coords.longitude;

                } catch (error) {
                    console.log(
                        "Could not get location. Using default location."
                    );
                }
            }

            await riderSignup(
                name,
                email,
                password,
                latitude,
                longitude
            );

            navigate("/rider/login", {
                replace: true
            });

        } catch (error) {
            setError(error.message);

        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-[#fafafa]">

            <div className="mx-auto max-w-6xl px-6 py-6">
                <button
                    onClick={() => navigate("/")}
                    className="
                        text-sm font-medium
                        text-neutral-500
                        transition hover:text-black
                    "
                >
                    ← Back
                </button>
            </div>

            <main className="
                flex min-h-[calc(100vh-100px)]
                items-center justify-center
                px-6 pb-16
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
                            Become a rider
                        </h1>

                        <p className="
                            mt-2 text-sm
                            text-neutral-500
                        ">
                            Create your NimbusGO rider account.
                        </p>

                    </div>

                    <div className="
                        mt-8 rounded-3xl
                        border border-neutral-200
                        bg-white p-7 shadow-sm
                    ">

                        <form
                            onSubmit={handleSubmit}
                            className="space-y-5"
                        >

                            <AuthInput
                                label="Name"
                                type="text"
                                value={name}
                                onChange={(event) =>
                                    setName(event.target.value)
                                }
                                placeholder="Your name"
                            />

                            <AuthInput
                                label="Email"
                                type="email"
                                value={email}
                                onChange={(event) =>
                                    setEmail(event.target.value)
                                }
                                placeholder="rider@example.com"
                            />

                            <AuthInput
                                label="Password"
                                type="password"
                                value={password}
                                onChange={(event) =>
                                    setPassword(event.target.value)
                                }
                                placeholder="Create a password"
                            />

                            {error && (
                                <div className="
                                    rounded-xl
                                    border border-red-200
                                    bg-red-50
                                    px-4 py-3
                                    text-sm text-red-600
                                ">
                                    {error}
                                </div>
                            )}

                            <Button
                                type="submit"
                                loading={loading}
                                loadingText="Creating account..."
                            >
                                Create Rider Account
                            </Button>

                        </form>

                        <div className="
                            mt-6 text-center
                            text-sm text-neutral-500
                        ">
                            Already a rider?{" "}
                            <button
                                type="button"
                                onClick={() =>
                                    navigate("/rider/login")
                                }
                                className="
                                    font-semibold
                                    text-black
                                    hover:underline
                                "
                            >
                                Login
                            </button>
                        </div>

                    </div>

                </div>
            </main>

        </div>
    );
}