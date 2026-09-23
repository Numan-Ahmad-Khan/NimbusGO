import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogoOnly } from "../../components/Logo";
import Button from "../../components/Button";
import { generateOTP, verifyOTP } from "../../services/otp";

export default function VerifyOTP() {
    const navigate = useNavigate();

    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);
    const [sending, setSending] = useState(false);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const otpRequested = useRef(false);

    useEffect(() => {
        if (otpRequested.current) {
            return;
        }

        otpRequested.current = true;
        handleGenerateOTP();
    }, []);

    async function handleGenerateOTP() {
        setError("");
        setMessage("");
        setSending(true);

        try {
            const data = await generateOTP();

            setMessage(data.message);

        } catch (error) {
            if (error.message === "User is already verified") {
                navigate("/customer/dashboard", {
                    replace: true
                });

                return;
            }

            setError(error.message);

        } finally {
            setSending(false);
        }
    }

    async function handleSubmit(event) {
        event.preventDefault();

        if (otp.length !== 6) {
            setError("Please enter the 6-digit OTP.");
            return;
        }

        setError("");
        setLoading(true);

        try {
            await verifyOTP(otp);

            navigate("/customer/dashboard", {
                replace: true
            });

        } catch (error) {
            setError(error.message);

        } finally {
            setLoading(false);
        }
    }

    function handleOTPChange(event) {
        const value = event.target.value.replace(/\D/g, "");

        if (value.length <= 6) {
            setOtp(value);
        }
    }

    return (
        <div className="min-h-screen bg-[#fafafa]">

            <div className="mx-auto max-w-6xl px-6 py-6">
                <button
                    onClick={() => navigate("/")}
                    className="
                        text-sm font-medium text-neutral-500
                        transition hover:text-black
                    "
                >
                    ← Back
                </button>
            </div>

            <main className="
                flex min-h-[calc(100vh-100px)] items-center
                justify-center px-6 pb-16
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
                            mt-6 text-3xl font-bold tracking-tight
                        ">
                            Verify your email
                        </h1>

                        <p className="
                            mt-2 text-sm leading-6 text-neutral-500
                        ">
                            We sent a 6-digit verification code
                            to your email.
                        </p>

                    </div>

                    <div className="
                        mt-8 rounded-3xl border border-neutral-200
                        bg-white p-7 shadow-sm
                    ">

                        <form
                            onSubmit={handleSubmit}
                            className="space-y-5"
                        >

                            <div>
                                <label className="
                                    mb-2 block text-sm font-medium
                                    text-neutral-700
                                ">
                                    Verification code
                                </label>

                                <input
                                    type="text"
                                    inputMode="numeric"
                                    autoComplete="one-time-code"
                                    value={otp}
                                    onChange={handleOTPChange}
                                    placeholder="000000"
                                    maxLength={6}
                                    className="
                                        w-full rounded-xl border
                                        border-neutral-200 bg-white
                                        px-4 py-3 text-center
                                        text-xl font-semibold
                                        tracking-[0.5em]
                                        outline-none transition
                                        focus:border-black
                                    "
                                />
                            </div>

                            {error && (
                                <div className="
                                    rounded-xl border border-red-200
                                    bg-red-50 px-4 py-3
                                    text-sm text-red-600
                                ">
                                    {error}
                                </div>
                            )}

                            {message && !error && (
                                <div className="
                                    rounded-xl border border-green-200
                                    bg-green-50 px-4 py-3
                                    text-sm text-green-700
                                ">
                                    {message}
                                </div>
                            )}

                            <Button
                                type="submit"
                                loading={loading}
                                loadingText="Verifying..."
                            >
                                Verify OTP
                            </Button>

                        </form>

                        <div className="
                            mt-6 border-t border-neutral-100
                            pt-6 text-center
                        ">
                            <p className="
                                text-sm text-neutral-500
                            ">
                                Didn't receive the code?
                            </p>

                            <button
                                type="button"
                                onClick={handleGenerateOTP}
                                disabled={sending}
                                className="
                                    mt-2 text-sm font-semibold
                                    text-black hover:underline
                                    disabled:cursor-not-allowed
                                    disabled:opacity-50
                                "
                            >
                                {sending ? "Sending..." : "Send again"}
                            </button>
                        </div>

                    </div>
                </div>
            </main>
        </div>
    );
}