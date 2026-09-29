import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { login } from "../../services/auth";
import { getMe } from "../../services/admin";

export default function AdminLogin() {

    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function handleSubmit(e) {

        e.preventDefault();

        setError("");
        setLoading(true);

        try {

            await login(email, password);

            // Verify that this account is actually an ADMIN
            await await getMe();

            navigate("/admin/dashboard", {
                replace: true
            });

        } catch (error) {

            console.log(error);

            setError(
                error.message ||
                "Invalid admin credentials."
            );

        } finally {

            setLoading(false);
        }
    }

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
            ">

                <div className="
                    rounded-3xl
                    border
                    border-neutral-200
                    bg-white
                    p-8
                    shadow-sm
                ">

                    <div className="mb-8">

                        <p className="
                            text-sm
                            font-medium
                            text-neutral-500
                        ">
                            NimbusGO
                        </p>

                        <h1 className="
                            mt-2
                            text-3xl
                            font-bold
                            tracking-tight
                        ">
                            Admin login
                        </h1>

                        <p className="
                            mt-2
                            text-sm
                            leading-6
                            text-neutral-500
                        ">
                            Sign in to manage NimbusGO.
                        </p>

                    </div>

                    {error && (
                        <div className="
                            mb-5
                            rounded-xl
                            border
                            border-red-200
                            bg-red-50
                            px-4
                            py-3
                            text-sm
                            text-red-600
                        ">
                            {error}
                        </div>
                    )}

                    <form
                        onSubmit={handleSubmit}
                        className="space-y-5"
                    >

                        <div>

                            <label className="
                                mb-2
                                block
                                text-sm
                                font-medium
                            ">
                                Email
                            </label>

                            <input
                                type="email"
                                value={email}
                                onChange={(e) =>
                                    setEmail(e.target.value)
                                }
                                required
                                className="
                                    w-full
                                    rounded-xl
                                    border
                                    border-neutral-200
                                    bg-white
                                    px-4
                                    py-3
                                    text-sm
                                    outline-none
                                    transition
                                    focus:border-black
                                "
                                placeholder="admin@example.com"
                            />

                        </div>

                        <div>

                            <label className="
                                mb-2
                                block
                                text-sm
                                font-medium
                            ">
                                Password
                            </label>

                            <input
                                type="password"
                                value={password}
                                onChange={(e) =>
                                    setPassword(e.target.value)
                                }
                                required
                                className="
                                    w-full
                                    rounded-xl
                                    border
                                    border-neutral-200
                                    bg-white
                                    px-4
                                    py-3
                                    text-sm
                                    outline-none
                                    transition
                                    focus:border-black
                                "
                                placeholder="••••••••"
                            />

                        </div>

                        <button
                            type="submit"
                            disabled={loading}
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
                                disabled:cursor-not-allowed
                                disabled:opacity-50
                            "
                        >
                            {loading
                                ? "Signing in..."
                                : "Sign in"}
                        </button>

                    </form>

                </div>

            </div>

        </div>
    );
}