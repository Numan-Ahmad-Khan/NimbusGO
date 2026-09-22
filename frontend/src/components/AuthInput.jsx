import { useState } from "react";

export default function AuthInput({
    label,
    type = "text",
    value,
    onChange,
    placeholder
}) {
    const [showPassword, setShowPassword] = useState(false);

    const isPassword = type === "password";

    return (
        <div className="space-y-2">

            <label className="text-sm font-medium text-neutral-800">
                {label}
            </label>

            <div className="relative">

                <input
                    type={
                        isPassword && showPassword
                            ? "text"
                            : type
                    }
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
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
                        placeholder:text-neutral-400
                        focus:border-black
                        focus:ring-1
                        focus:ring-black
                    "
                />

                {isPassword && (
                    <button
                        type="button"
                        onClick={() =>
                            setShowPassword(!showPassword)
                        }
                        className="
                            absolute
                            right-3
                            top-1/2
                            -translate-y-1/2
                            text-xs
                            font-medium
                            text-neutral-500
                            hover:text-black
                        "
                    >
                        {showPassword ? "Hide" : "Show"}
                    </button>
                )}

            </div>

        </div>
    );
}