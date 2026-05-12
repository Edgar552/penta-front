import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register as apiRegister } from "../services/authServices";
import { useAuth } from "../Providers/AuthContext";
import {setAccessToken} from "../API/api";

export default function Register() {
    const navigate = useNavigate();
    const { setUser } = useAuth();

    const [form, setForm] = useState({
        name:"",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = e => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async e => {
        e.preventDefault();
        setError("");

        if (form.password !== form.confirmPassword) {
            return setError("Passwords do not match");
        }

        setLoading(true);

        try {
            const { data } = await apiRegister({
                name: form.name,
                email: form.email,
                password: form.password,
            });

            setAccessToken(data.token);
            setUser(data.user);

            navigate("/");
        } catch (err) {
            setError(
                err.response?.data?.error ||
                "Registration failed"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container d-flex align-items-center justify-content-center vh-100">
            <div className="card shadow-sm p-4" style={{ maxWidth: 420, width: "100%" }}>
                <h4 className="mb-3 text-center">Create account</h4>

                {error && (
                    <div className="alert alert-danger py-2">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">Name</label>
                        <input
                            type="name"
                            className="form-control"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            required
                        />
                    </div>

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
                            minLength={6}
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">
                            Confirm password
                        </label>
                        <input
                            type="password"
                            className="form-control"
                            name="confirmPassword"
                            value={form.confirmPassword}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <button
                        className="btn btn-primary w-100"
                        disabled={loading}
                    >
                        {loading ? "Creating..." : "Register"}
                    </button>
                </form>

                <p className="text-center small mt-3">
                    Already have an account?{" "}
                    <a href="#/login">Sign in</a>
                </p>
            </div>
        </div>
    );
}
