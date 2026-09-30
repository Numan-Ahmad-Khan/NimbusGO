const THEME_KEY = "nimbusgo-theme";

export function getTheme() {
    return localStorage.getItem(THEME_KEY) || "light";
}

export function applyTheme(theme) {
    if (theme === "dark") {
        document.documentElement.classList.add("dark");
    } else {
        document.documentElement.classList.remove("dark");
    }

    localStorage.setItem(THEME_KEY, theme);
}

export function initializeTheme() {
    const theme = getTheme();

    if (theme === "dark") {
        document.documentElement.classList.add("dark");
    } else {
        document.documentElement.classList.remove("dark");
    }
}