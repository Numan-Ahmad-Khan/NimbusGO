import { useState } from "react";
import { useNavigate } from "react-router-dom";

import AuthInput from "../components/AuthInput";
import Button from "../components/Button";
import { signup } from "../services/auth";

export default function Signup() {
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    async function handleSubmit(event) {
        event.preventDefault();

        setError("");
        setSuccess("");
        setLoading(true);

        try {
            const data = await signup(
                name,
                email,
                password
            );

            console.log("Signup successful:", data);

            setSuccess(
                "Account created successfully. Redirecting to login..."
            );

            setTimeout(() => {
                navigate("/login");
            }, 1500);

        } catch (error) {
            setError(error.message);

        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="
            min-h-screen
            bg-[#fafafa]
            text-neutral-900
            transition-colors
            duration-300
            dark:bg-slate-950
            dark:text-white
        ">

            {/* Back */}

            <div className="
                mx-auto
                max-w-6xl
                px-6
                py-6
            ">

                <button
                    onClick={() => navigate("/choose-account")}
                    className="
                        text-sm
                        font-medium
                        text-neutral-500
                        transition
                        hover:text-black
                        dark:text-slate-400
                        dark:hover:text-white
                    "
                >
                    ← Back
                </button>

            </div>


            {/* Form */}

            <main className="
                flex
                min-h-[calc(100vh-100px)]
                items-center
                justify-center
                px-6
                pb-16
            ">

                <div className="
                    w-full
                    max-w-md
                ">

                    {/* Heading */}

                    <div className="
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
                            bg-black
                            text-lg
                            font-bold
                            text-white
                            dark:bg-white
                            dark:text-black
                        ">
                            N
                        </div>


                        <h1 className="
                            mt-6
                            text-3xl
                            font-bold
                            tracking-tight
                            text-black
                            dark:text-white
                        ">
                            Create your account
                        </h1>


                        <p className="
                            mt-2
                            text-sm
                            text-neutral-500
                            dark:text-slate-400
                        ">
                            Start sending with NimbusGO.
                        </p>

                    </div>


                    {/* Form card */}

                    <div className="
                        mt-8
                        rounded-3xl
                        border
                        border-neutral-200
                        bg-white
                        p-7
                        shadow-sm
                        transition-colors
                        duration-300
                        dark:border-slate-800
                        dark:bg-slate-900
                    ">

                        <form
                            onSubmit={handleSubmit}
                            className="space-y-5"
                        >

                            <AuthInput
                                label="Full name"
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
                                placeholder="you@example.com"
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


                            {/* Error */}

                            {error && (
                                <div className="
                                    rounded-xl
                                    border
                                    border-red-200
                                    bg-red-50
                                    px-4
                                    py-3
                                    text-sm
                                    text-red-600
                                    dark:border-red-900/60
                                    dark:bg-red-950/40
                                    dark:text-red-400
                                ">
                                    {error}
                                </div>
                            )}


                            {/* Success */}

                            {success && (
                                <div className="
                                    rounded-xl
                                    border
                                    border-green-200
                                    bg-green-50
                                    px-4
                                    py-3
                                    text-sm
                                    text-green-700
                                    dark:border-green-900/60
                                    dark:bg-green-950/40
                                    dark:text-green-400
                                ">
                                    {success}
                                </div>
                            )}


                            <Button
                                type="submit"
                                loading={loading}
                                loadingText="Creating account..."
                            >
                                Create account
                            </Button>

                        </form>


                        {/* Login */}

                        <div className="
                            mt-6
                            border-t
                            border-neutral-100
                            pt-6
                            text-center
                            dark:border-slate-800
                        ">

                            <p className="
                                text-sm
                                text-neutral-500
                                dark:text-slate-400
                            ">
                                Already have an account?
                            </p>


                            <button
                                onClick={() => navigate("/login")}
                                className="
                                    mt-2
                                    text-sm
                                    font-semibold
                                    text-black
                                    hover:underline
                                    dark:text-white
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