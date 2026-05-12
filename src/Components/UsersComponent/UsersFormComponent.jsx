import React, {useContext, useState} from "react";
import {useNavigate} from "react-router-dom";
import {register as apiRegister} from "../../services/authServices";
import api from "../../API/api";
import {useCatalogsContext} from "../../Providers/CatalogContext";
import Select from "react-select";
import {showSmallSuccess} from "../../utils/alert";
import {useQuery} from "@tanstack/react-query";

export default function UsersFormComponent() {
    const navigate = useNavigate();
    //const { setUser } = useAuth();

    const [form, setForm] = useState({
        name:"",
        email: "",
        locationId:"",
        password: "",
        confirmPassword: "",
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [selectedLocations, setSelectedLocations] = useState([]);
    const [selectedRoles, setSelectedRoles] = useState([]);

    const handleChange = e => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const { data } = useQuery({
        queryKey: ["role"],
        queryFn: async () => {
            const res = await api.get('auth/getRoles');
            return res.data;

        },

    });

    const { catalogs } = useCatalogsContext();
    if (loading) return <p>Loading...</p>;
    // const locationList = catalogs.location;
    // const roleList = data?.data;
    // const optionsRole = roleList?.map(l => ({
    //     value: l._id,
    //     label: l.label,
    // }));
    //
    // const options = locationList?.map(l => ({
    //     value: l._id,
    //     label: l.label,
    // }));
    const handleSubmit = async e => {
        e.preventDefault();
        setError("");

        if (form.password !== form.confirmPassword) {
            return setError("Passwords do not match");
        }

        setLoading(true);

        try {
            await apiRegister({
                name: form.name,
                email: form.email,
               // password: form.password,
                locations: selectedLocations,
                roles: selectedRoles,
            });

            //setAccessToken(data.token);
            //setUser(data.user);
            showSmallSuccess(
                `User Created Successfully!`
            );
            navigate("/users");
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
        <div className="col-lg-10 d-flex flex-column justify-content-center">
        {error && (
                    <div className="alert alert-danger py-2">
                        {error}
                    </div>
                )}

                <form autoComplete="off" onSubmit={handleSubmit}>
                    <div className="row mb-3">

                        <div className="form-group col-md-4">
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
                        </div>

                        <div className="form-group col-md-4">
                            <div className="mb-3">
                                <label className="form-label">Email</label>
                                <input autoComplete="off"
                                    type="email"
                                    className="form-control"
                                    name="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    required/>
                            </div>
                        </div>

                        {/*<div className="form-group col-md-4">*/}
                        {/*    <div className="mb-3">*/}
                        {/*        <label className="form-label">Location</label>*/}
                        {/*        <Select*/}
                        {/*            isMulti*/}
                        {/*            options={options}*/}
                        {/*            onChange={vals =>*/}
                        {/*                setSelectedLocations(vals?.map(v => v.value))*/}
                        {/*            } required*/}
                        {/*        />*/}
                        {/*    </div>*/}
                        {/*</div>*/}

                    </div>

                    <div className="row mb-3">

                        {/*<div className="form-group col-md-4">*/}
                        {/*    <div className="mb-3">*/}
                        {/*        <label className="form-label">Role(s)</label>*/}
                        {/*        <Select*/}
                        {/*            isMulti*/}
                        {/*            options={optionsRole}*/}
                        {/*            onChange={vals =>*/}
                        {/*                setSelectedRoles(vals?.map(v => v.value))*/}
                        {/*            } required*/}
                        {/*        />*/}
                        {/*    </div>*/}
                        {/*</div>*/}

                    </div>

                    {/*<div className="mb-3">*/}
                    {/*    <label className="form-label">Password</label>*/}
                    {/*    <input*/}
                    {/*        type="password"*/}
                    {/*        className="form-control"*/}
                    {/*        name="password"*/}
                    {/*        value={form.password}*/}
                    {/*        onChange={handleChange}*/}
                    {/*        required*/}
                    {/*        minLength={6} autoComplete="off"*/}
                    {/*    />*/}
                    {/*</div>*/}

                    {/*<div className="mb-3">*/}
                    {/*    <label className="form-label">*/}
                    {/*        Confirm password*/}
                    {/*    </label>*/}
                    {/*    <input*/}
                    {/*        type="password"*/}
                    {/*        className="form-control"*/}
                    {/*        name="confirmPassword"*/}
                    {/*        value={form.confirmPassword}*/}
                    {/*        onChange={handleChange}*/}
                    {/*        required*/}
                    {/*    />*/}
                    {/*</div>*/}

                    <button
                        className="btn btn-primary w-100"
                        disabled={loading}
                    >
                        {loading ? "Creating..." : "Register"}
                    </button>
                </form>


        </div>
    );
}
