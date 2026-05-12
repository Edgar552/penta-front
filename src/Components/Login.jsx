import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Providers/AuthContext";

import { login as apiLogin } from "../services/authServices";
import {setAccessToken} from "../API/api";
import '../assets/css/customUI.css'
import logo from "../assets/logo.png";
export default function Login() {
    const navigate = useNavigate();
    const { setUser } = useAuth();

    const [form, setForm] = useState({
        email: "",
        password: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = e => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async e => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const { data } = await apiLogin(form);
            setAccessToken(data.accessToken);
            setUser(data.user);

            // if (data.user?.firstLogin) {
            //     navigate("/change-password");
            //     return;
            // }

            navigate("/membresias");
        } catch (err) {
            setError(
                err.response?.data?.error || "Invalid credentials"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div   className="login-background">

                <div className="login-container">

                    {/* LEFT IMAGE */}
                    <div className="login-left">
                        <div className="login-left-content">
                            <h1>XXIV ZONA <br/>SAN LUIS POTOSI</h1>
                            <img src={logo} alt={"logo"} />
                            <p>SISTEMA ESTATAL DE MEMBRESIAS NACIONALES</p>
                        </div>
                    </div>

                    {/* RIGHT FORM */}
                    <div className="login-right">
                        <h2>INGRESAR</h2>
                        {error && (
                            <div className="alert alert-danger py-2">
                                {error}
                            </div>
                        )}
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label className="form-label">Email</label>
                                <input
                                    type="email"
                                    className="form-control"
                                    name="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Password</label>
                                <input
                                    type="password"
                                    className="form-control"
                                    name="password"
                                    value={form.password}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <button
                                className="btn btn-primary w-100"
                                disabled={loading}>
                                {loading ? "Enviando..." : "Acceder"}
                            </button>
                        </form>


                    </div>

                </div>
        </div>
    );
}
