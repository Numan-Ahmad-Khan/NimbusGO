import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    changePassword,
    deactivateAccount,
    deleteAccount
} from "../../services/settings";

import { logout } from "../../services/auth";
import { getTheme, applyTheme } from "../../services/theme";

export default function CustomerSettings() {

    const navigate = useNavigate();

    // =========================
    // THEME
    // =========================

    const [theme, setTheme] = useState("light");

    useEffect(() => {
        setTheme(getTheme());
    }, []);

    function handleThemeChange(newTheme) {
        applyTheme(newTheme);
        setTheme(newTheme);
    }


    // =========================
    // CHANGE PASSWORD STATE
    // =========================

    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");

    const [passwordLoading, setPasswordLoading] = useState(false);
    const [passwordMessage, setPasswordMessage] = useState("");
    const [passwordError, setPasswordError] = useState("");


    // =========================
    // DELETE ACCOUNT STATE
    // =========================

    const [deletePassword, setDeletePassword] = useState("");

    const [deleteLoading, setDeleteLoading] = useState(false);
    const [deleteMessage, setDeleteMessage] = useState("");
    const [deleteError, setDeleteError] = useState("");


    // =========================
    // DEACTIVATE STATE
    // =========================

    const [deactivateLoading, setDeactivateLoading] = useState(false);
    const [deactivateError, setDeactivateError] = useState("");


    // =========================
    // CHANGE PASSWORD
    // =========================

    const handleChangePassword = async (e) => {
        e.preventDefault();

        setPasswordMessage("");
        setPasswordError("");

        if (!oldPassword || !newPassword || !confirmNewPassword) {
            setPasswordError("Please fill all password fields.");
            return;
        }

        if (newPassword !== confirmNewPassword) {
            setPasswordError("New passwords do not match.");
            return;
        }

        if (oldPassword === newPassword) {
            setPasswordError(
                "Old and new password cannot be same."
            );
            return;
        }

        try {
            setPasswordLoading(true);

            const data = await changePassword(
                oldPassword,
                newPassword
            );

            setPasswordMessage(
                data.Success ||
                data.message ||
                data.msg ||
                "Password updated successfully."
            );

            setOldPassword("");
            setNewPassword("");
            setConfirmNewPassword("");

        } catch (error) {
            setPasswordError(
                error.message ||
                "Failed to change password."
            );
        } finally {
            setPasswordLoading(false);
        }
    };


    // =========================
    // DEACTIVATE ACCOUNT
    // =========================

    const handleDeactivate = async () => {

        setDeactivateError("");

        const confirmed = window.confirm(
            "Are you sure you want to deactivate your account?"
        );

        if (!confirmed) {
            return;
        }

        try {
            setDeactivateLoading(true);

            await deactivateAccount();

            logout();

            navigate("/login", {
                replace: true
            });

        } catch (error) {
            setDeactivateError(
                error.message ||
                "Failed to deactivate account."
            );
        } finally {
            setDeactivateLoading(false);
        }
    };


    // =========================
    // DELETE ACCOUNT
    // =========================

    const handleDeleteAccount = async (e) => {
        e.preventDefault();

        setDeleteMessage("");
        setDeleteError("");

        if (!deletePassword) {
            setDeleteError(
                "Please enter your password."
            );
            return;
        }

        const confirmed = window.confirm(
            "This will permanently delete your account. This action cannot be undone. Continue?"
        );

        if (!confirmed) {
            return;
        }

        try {
            setDeleteLoading(true);

            const data = await deleteAccount(
                deletePassword
            );

            setDeleteMessage(
                data.Success ||
                data.message ||
                data.msg ||
                "Account deleted successfully."
            );

            logout();

            navigate("/", {
                replace: true
            });

        } catch (error) {
            setDeleteError(
                error.message ||
                "Failed to delete account."
            );
        } finally {
            setDeleteLoading(false);
        }
    };


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

            {/* =========================
                HEADER
            ========================= */}

            <header className="
                border-b
                border-neutral-200
                bg-white
                transition-colors
                duration-300
                dark:border-slate-800
                dark:bg-slate-950
            ">

                <div className="
                    mx-auto
                    flex
                    max-w-5xl
                    items-center
                    justify-between
                    px-6
                    py-5
                ">

                    <div>

                        <h1 className="
                            text-2xl
                            font-bold
                            text-black
                            dark:text-white
                        ">
                            Settings
                        </h1>

                        <p className="
                            mt-1
                            text-sm
                            text-neutral-500
                            dark:text-slate-400
                        ">
                            Manage your NimbusGO account
                        </p>

                    </div>


                    <button
                        onClick={() => navigate("/customer/dashboard")}
                        className="
                            rounded-lg
                            border
                            border-neutral-200
                            bg-white
                            px-4
                            py-2
                            text-sm
                            font-medium
                            text-neutral-700
                            transition
                            hover:bg-neutral-50
                            dark:border-slate-700
                            dark:bg-slate-900
                            dark:text-slate-200
                            dark:hover:bg-slate-800
                        "
                    >
                        Back
                    </button>

                </div>

            </header>


            {/* =========================
                CONTENT
            ========================= */}

            <main className="
                mx-auto
                max-w-5xl
                px-6
                py-8
            ">

                <div className="space-y-6">


                    {/* =========================
                        THEME
                    ========================= */}

                    <section className="
                        rounded-2xl
                        border
                        border-neutral-200
                        bg-white
                        p-6
                        shadow-sm
                        transition-colors
                        duration-300
                        dark:border-slate-800
                        dark:bg-slate-900
                    ">

                        <div className="mb-5">

                            <h2 className="
                                text-xl
                                font-semibold
                                text-black
                                dark:text-white
                            ">
                                Appearance
                            </h2>

                            <p className="
                                mt-1
                                text-sm
                                text-neutral-500
                                dark:text-slate-400
                            ">
                                Choose how NimbusGO looks for you.
                            </p>

                        </div>


                        <div className="
                            grid
                            grid-cols-2
                            gap-3
                            max-w-md
                        ">

                            {/* Light */}

                            <button
                                type="button"
                                onClick={() =>
                                    handleThemeChange("light")
                                }
                                className={`
                                    rounded-xl
                                    border
                                    px-4
                                    py-3
                                    text-sm
                                    font-semibold
                                    transition
                                    ${
                                        theme === "light"
                                            ? "border-black bg-black text-white dark:border-white dark:bg-white dark:text-black"
                                            : "border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
                                    }
                                `}
                            >
                                ☀️ Light
                            </button>


                            {/* Dark */}

                            <button
                                type="button"
                                onClick={() =>
                                    handleThemeChange("dark")
                                }
                                className={`
                                    rounded-xl
                                    border
                                    px-4
                                    py-3
                                    text-sm
                                    font-semibold
                                    transition
                                    ${
                                        theme === "dark"
                                            ? "border-black bg-black text-white dark:border-white dark:bg-white dark:text-black"
                                            : "border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
                                    }
                                `}
                            >
                                🌙 Dark
                            </button>

                        </div>

                    </section>


                    {/* =========================
                        CHANGE PASSWORD
                    ========================= */}

                    <section className="
                        rounded-2xl
                        border
                        border-neutral-200
                        bg-white
                        p-6
                        shadow-sm
                        transition-colors
                        duration-300
                        dark:border-slate-800
                        dark:bg-slate-900
                    ">

                        <div className="mb-6">

                            <h2 className="
                                text-xl
                                font-semibold
                                text-black
                                dark:text-white
                            ">
                                Change Password
                            </h2>

                            <p className="
                                mt-1
                                text-sm
                                text-neutral-500
                                dark:text-slate-400
                            ">
                                Update your account password.
                            </p>

                        </div>


                        <form
                            onSubmit={handleChangePassword}
                            className="
                                max-w-xl
                                space-y-4
                            "
                        >

                            {/* Current Password */}

                            <div>

                                <label className="
                                    mb-2
                                    block
                                    text-sm
                                    text-neutral-700
                                    dark:text-slate-300
                                ">
                                    Current Password
                                </label>

                                <input
                                    type="password"
                                    value={oldPassword}
                                    onChange={(e) =>
                                        setOldPassword(e.target.value)
                                    }
                                    placeholder="Enter current password"
                                    className="
                                        w-full
                                        rounded-lg
                                        border
                                        border-neutral-200
                                        bg-white
                                        px-4
                                        py-3
                                        text-black
                                        outline-none
                                        transition
                                        placeholder:text-neutral-400
                                        focus:border-black
                                        dark:border-slate-700
                                        dark:bg-slate-950
                                        dark:text-white
                                        dark:placeholder:text-slate-500
                                        dark:focus:border-white
                                    "
                                />

                            </div>


                            {/* New Password */}

                            <div>

                                <label className="
                                    mb-2
                                    block
                                    text-sm
                                    text-neutral-700
                                    dark:text-slate-300
                                ">
                                    New Password
                                </label>

                                <input
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) =>
                                        setNewPassword(e.target.value)
                                    }
                                    placeholder="Enter new password"
                                    className="
                                        w-full
                                        rounded-lg
                                        border
                                        border-neutral-200
                                        bg-white
                                        px-4
                                        py-3
                                        text-black
                                        outline-none
                                        transition
                                        placeholder:text-neutral-400
                                        focus:border-black
                                        dark:border-slate-700
                                        dark:bg-slate-950
                                        dark:text-white
                                        dark:placeholder:text-slate-500
                                        dark:focus:border-white
                                    "
                                />

                            </div>


                            {/* Confirm Password */}

                            <div>

                                <label className="
                                    mb-2
                                    block
                                    text-sm
                                    text-neutral-700
                                    dark:text-slate-300
                                ">
                                    Confirm New Password
                                </label>

                                <input
                                    type="password"
                                    value={confirmNewPassword}
                                    onChange={(e) =>
                                        setConfirmNewPassword(e.target.value)
                                    }
                                    placeholder="Confirm new password"
                                    className="
                                        w-full
                                        rounded-lg
                                        border
                                        border-neutral-200
                                        bg-white
                                        px-4
                                        py-3
                                        text-black
                                        outline-none
                                        transition
                                        placeholder:text-neutral-400
                                        focus:border-black
                                        dark:border-slate-700
                                        dark:bg-slate-950
                                        dark:text-white
                                        dark:placeholder:text-slate-500
                                        dark:focus:border-white
                                    "
                                />

                            </div>


                            {passwordError && (
                                <p className="
                                    text-sm
                                    text-red-600
                                    dark:text-red-400
                                ">
                                    {passwordError}
                                </p>
                            )}


                            {passwordMessage && (
                                <p className="
                                    text-sm
                                    text-green-600
                                    dark:text-green-400
                                ">
                                    {passwordMessage}
                                </p>
                            )}


                            <button
                                type="submit"
                                disabled={passwordLoading}
                                className="
                                    rounded-lg
                                    bg-black
                                    px-5
                                    py-3
                                    font-medium
                                    text-white
                                    transition
                                    hover:bg-neutral-800
                                    disabled:cursor-not-allowed
                                    disabled:opacity-50
                                    dark:bg-white
                                    dark:text-black
                                    dark:hover:bg-slate-200
                                "
                            >
                                {passwordLoading
                                    ? "Updating..."
                                    : "Change Password"}
                            </button>

                        </form>

                    </section>


                    {/* =========================
                        CONTACT US
                    ========================= */}

                    <section className="
                        rounded-2xl
                        border
                        border-neutral-200
                        bg-white
                        p-6
                        shadow-sm
                        transition-colors
                        duration-300
                        dark:border-slate-800
                        dark:bg-slate-900
                    ">

                        <h2 className="
                            text-xl
                            font-semibold
                            text-black
                            dark:text-white
                        ">
                            Contact Us
                        </h2>

                        <p className="
                            mt-2
                            text-sm
                            text-neutral-500
                            dark:text-slate-400
                        ">
                            Need help with your account or an order?
                            Contact the NimbusGO support team.
                        </p>

                        <a
                            href="mailto:support@nimbusgo.com"
                            className="
                                mt-4
                                inline-block
                                text-blue-600
                                transition
                                hover:text-blue-500
                                hover:underline
                                dark:text-blue-400
                                dark:hover:text-blue-300
                            "
                        >
                            support@nimbusgo.com
                        </a>

                    </section>


                    {/* =========================
                        DEACTIVATE ACCOUNT
                    ========================= */}

                    <section className="
                        rounded-2xl
                        border
                        border-yellow-300
                        bg-white
                        p-6
                        shadow-sm
                        transition-colors
                        duration-300
                        dark:border-yellow-900/50
                        dark:bg-slate-900
                    ">

                        <h2 className="
                            text-xl
                            font-semibold
                            text-black
                            dark:text-white
                        ">
                            Deactivate Account
                        </h2>

                        <p className="
                            mt-2
                            max-w-2xl
                            text-sm
                            text-neutral-500
                            dark:text-slate-400
                        ">
                            Deactivating your account will prevent you
                            from logging in until your account is
                            activated again.
                        </p>


                        {deactivateError && (
                            <p className="
                                mt-4
                                text-sm
                                text-red-600
                                dark:text-red-400
                            ">
                                {deactivateError}
                            </p>
                        )}


                        <button
                            type="button"
                            onClick={handleDeactivate}
                            disabled={deactivateLoading}
                            className="
                                mt-5
                                rounded-lg
                                border
                                border-yellow-600
                                px-5
                                py-3
                                font-medium
                                text-yellow-700
                                transition
                                hover:bg-yellow-50
                                disabled:cursor-not-allowed
                                disabled:opacity-50
                                dark:text-yellow-400
                                dark:hover:bg-yellow-600/10
                            "
                        >
                            {deactivateLoading
                                ? "Deactivating..."
                                : "Deactivate Account"}
                        </button>

                    </section>


                    {/* =========================
                        DELETE ACCOUNT
                    ========================= */}

                    <section className="
                        rounded-2xl
                        border
                        border-red-200
                        bg-white
                        p-6
                        shadow-sm
                        transition-colors
                        duration-300
                        dark:border-red-900/60
                        dark:bg-slate-900
                    ">

                        <h2 className="
                            text-xl
                            font-semibold
                            text-red-600
                            dark:text-red-400
                        ">
                            Delete Account
                        </h2>

                        <p className="
                            mt-2
                            max-w-2xl
                            text-sm
                            text-neutral-500
                            dark:text-slate-400
                        ">
                            Permanently delete your NimbusGO account.
                            This action cannot be undone.
                        </p>


                        <form
                            onSubmit={handleDeleteAccount}
                            className="
                                mt-6
                                max-w-xl
                                space-y-4
                            "
                        >

                            <div>

                                <label className="
                                    mb-2
                                    block
                                    text-sm
                                    text-neutral-700
                                    dark:text-slate-300
                                ">
                                    Enter your password
                                </label>

                                <input
                                    type="password"
                                    value={deletePassword}
                                    onChange={(e) =>
                                        setDeletePassword(e.target.value)
                                    }
                                    placeholder="Enter password to confirm"
                                    className="
                                        w-full
                                        rounded-lg
                                        border
                                        border-neutral-200
                                        bg-white
                                        px-4
                                        py-3
                                        text-black
                                        outline-none
                                        transition
                                        placeholder:text-neutral-400
                                        focus:border-red-500
                                        dark:border-slate-700
                                        dark:bg-slate-950
                                        dark:text-white
                                        dark:placeholder:text-slate-500
                                        dark:focus:border-red-500
                                    "
                                />

                            </div>


                            {deleteError && (
                                <p className="
                                    text-sm
                                    text-red-600
                                    dark:text-red-400
                                ">
                                    {deleteError}
                                </p>
                            )}


                            {deleteMessage && (
                                <p className="
                                    text-sm
                                    text-green-600
                                    dark:text-green-400
                                ">
                                    {deleteMessage}
                                </p>
                            )}


                            <button
                                type="submit"
                                disabled={deleteLoading}
                                className="
                                    rounded-lg
                                    bg-red-600
                                    px-5
                                    py-3
                                    font-medium
                                    text-white
                                    transition
                                    hover:bg-red-500
                                    disabled:cursor-not-allowed
                                    disabled:opacity-50
                                "
                            >
                                {deleteLoading
                                    ? "Deleting..."
                                    : "Delete Account"}
                            </button>

                        </form>

                    </section>

                </div>

            </main>

        </div>
    );
}