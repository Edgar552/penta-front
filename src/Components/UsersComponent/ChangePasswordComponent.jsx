import React, { useState } from "react";
import api from "../../API/api";
import {useNavigate} from "react-router-dom";
import { showSuccess, showError } from "../../utils/alert";
import {TitlesLayoutComponent} from "../LayoutsComponent/TitlesLayoutComponent";

export default function ChangePasswordComponent() {
    const navigate = useNavigate();

    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async e => {
        e.preventDefault();

        if (password !== confirm) {
            return showError.fire("Error", "Passwords do not match", "error");
        }

        try {
            setLoading(true);

            await api.post("/auth/change-password", {
                password,
            });

            showSuccess(
                "Success",
                "Password updated successfully",
                "success"
            );

            navigate("/");
        } catch (err) {
            showError(
                "Error",
                err.response?.data?.error || "Failed to change password",
                "error"
            );
        } finally {
            setLoading(false);
        }
    };

    return (

        <div className="main-panel ps-container ps-theme-default">
            <div className="content">
                <div className="container-fluid">
                    <div className="row justify-content-center pb-2">
                        <div className="card">
                            <TitlesLayoutComponent name={"Change Password"} />
                            <div className="card-body">
                                <div className="row justify-content-center ">
                                        <div className="col-6">

                                            <form onSubmit={handleSubmit}>

                                                <div className="mb-3">
                                                    <label>New Password</label>
                                                    <input
                                                        type="password"
                                                        className="form-control"
                                                        value={password}
                                                        onChange={e => setPassword(e.target.value)}
                                                        required
                                                    />
                                                </div>

                                                <div className="mb-4">
                                                    <label>Confirm Password</label>
                                                    <input
                                                        type="password"
                                                        className="form-control"
                                                        value={confirm}
                                                        onChange={e => setConfirm(e.target.value)}
                                                        required
                                                    />
                                                </div>

                                                <button
                                                    className="btn btn-primary w-100"
                                                    disabled={loading}
                                                >
                                                    {loading ? "Saving..." : "Update Password"}
                                                </button>

                                            </form>

                                        </div>

                                </div>

                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>



    );
}
