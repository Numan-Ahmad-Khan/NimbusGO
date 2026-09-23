import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { LogoOnly } from "../../components/Logo";
import AuthInput from "../../components/AuthInput";
import Button from "../../components/Button";

import { riderLogin } from "../../services/rider";

export default function RiderLogin() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function handleSubmit(event) {
        event.preventDefault();

        setError("");
        setLoading(true);

        try {
            const data = await riderLogin(
                email,
                password
            );

            localStorage.setItem(
                "token",
                data.token
            );

            localStorage.setItem(
                "riderId",
                data.rider
            );

            navigate("/rider/dashboard", {
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
                            Rider login
                        </h1>

                        <p className="
                            mt-2 text-sm
                            text-neutral-500
                        ">
                            Login to your NimbusGO rider account.
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
                                placeholder="Your password"
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
                                loadingText="Logging in..."
                            >
                                Login as Rider
                            </Button>

                        </form>

                    </div>

                    <div className="
                        mt-6 text-center
                        text-sm text-neutral-500
                    ">
                        Don't have a rider account?{" "}

                        <button
                            type="button"
                            onClick={() =>
                                navigate("/rider/signup")
                            }
                            className="
                                font-semibold
                                text-black
                                hover:underline
                            "
                        >
                            Sign up
                        </button>
                    </div>

                </div>

            </main>

        </div>
    );
}