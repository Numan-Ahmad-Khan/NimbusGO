export function LogoWithName() {
    return (
        <div className="flex items-center gap-2">
            <img
                src="/pictures/NimbusGO-favicon.png"
                alt="NimbusGO"
                className="h-9 w-9 rounded-xl object-contain"
            />

            <span className="text-lg font-bold tracking-tight">
                NimbusGO
            </span>
        </div>
    );
}

export function LogoOnly() {
    return (
        <img
            src="/pictures/NimbusGO-favicon.png"
            alt="NimbusGO"
            className="h-10 w-10 rounded-xl object-contain"
        />
    );
}