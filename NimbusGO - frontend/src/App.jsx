import { BrowserRouter, Routes, Route } from "react-router-dom";
import CustomerDashboard from "./pages/CustomerDashboard";
import Landing from "./pages/Landing";
import ChooseAccount from "./pages/ChooseAccount";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";

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
                    path="/customer/dashboard"
                    element={
                        <ProtectedRoute>
                            <CustomerDashboard />
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </BrowserRouter>
    );
}

export default App;