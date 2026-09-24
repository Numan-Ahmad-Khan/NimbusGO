export default function Button({
    children,
    type = "button",
    onClick,
    loading = false,
    loadingText = "Loading...",
    disabled = false
}) {
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled || loading}
            className="
                flex
                w-full
                items-center
                justify-center
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
            {loading ? loadingText : children}
        </button>
    );
}