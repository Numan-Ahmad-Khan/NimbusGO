import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

import { getToken } from "../services/auth";
import { getMe } from "../services/admin";

export default function AdminProtectedRoute({
    children
}) {

    const token = getToken();

    const [loading, setLoading] =
        useState(true);

    const [isAdmin, setIsAdmin] =
        useState(false);

    useEffect(() => {

        async function verifyAdmin() {

            if (!token) {
                setLoading(false);
                return;
            }

            try {

                await getMe();

                setIsAdmin(true);

            } catch (error) {

                console.log(
                    "Admin verification failed:",
                    error
                );

                setIsAdmin(false);

            } finally {

                setLoading(false);
            }
        }

        verifyAdmin();

    }, [token]);


    if (loading) {

        return (
            <div className="
                min-h-screen
                flex
                items-center
                justify-center
                bg-[#fafafa]
            ">
                <p className="
                    text-sm
                    text-neutral-500
                ">
                    Checking access...
                </p>
            </div>
        );
    }


    if (!token || !isAdmin) {

        return (
            <Navigate
                to="/admin/login"
                replace
            />
        );
    }


    return children;
}