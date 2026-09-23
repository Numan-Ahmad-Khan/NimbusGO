import { BrowserRouter, Routes, Route } from "react-router-dom";
import CustomerDashboard from "./pages/CustomerDashboard";
import Landing from "./pages/Landing";
import ChooseAccount from "./pages/ChooseAccount";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import VerifyOTP from "./pages/customer/VerifyOTP";
import ProtectedRoute from "./components/ProtectedRoute";
import PlaceOrder from "./pages/customer/PlaceOrder";
function App() {
    return (
        <BrowserRouter>
            <Routes>

                <Route
                    path="/"
                    element={
                        <Landing />
                    }
                />

                <Route
                    path="/choose-account"
                    element={
                        <ChooseAccount />
                    }
                />

                <Route
                    path="/signup"
                    element={
                        <Signup />
                    }
                />

                <Route
                    path="/login"
                    element={
                        <Login />
                    }
                />
                <Route
                    path="/verify-otp"
                    element={
                        <ProtectedRoute>
                            <VerifyOTP />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/customer/dashboard"
                    element={
                        <ProtectedRoute>
                            <CustomerDashboard />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/place-order"
                    element={
                        <ProtectedRoute>
                            <PlaceOrder />
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </BrowserRouter>
    );
}

export default App;