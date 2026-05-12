import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { MenuRoutes } from "./MenuRoutes";
import { useAuth } from "../../Providers/AuthContext";
import logo from "../../assets/logo.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function NavbarComponent() {
    const { user, logout } = useAuth();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    if (!user) return null;

    const filteredRoutes = MenuRoutes.filter((route) => {
        if (route.private && !user) return false;

        if (user?.firstLogin) return false;

        if (route.roles) {
            const userRoleLabels = user.roles?.map((r) => r.label);

            const allowed = route.roles.some((r) =>
                userRoleLabels?.includes(r)
            );

            if (!allowed) return false;
        }

        return true;
    });

    const renderLinks = () =>
        filteredRoutes.map((route) => (
            <li key={route.to} className="nav-item">
                <NavLink
                    to={route.to}
                    className="nav-link"
                    onClick={() => setMobileMenuOpen(false)}
                    style={({ isActive }) => ({
                        color: isActive ? "#fcd920" : "white",
                        background: isActive ? "#6c757d" : "transparent",
                        borderRadius: "8px",
                    })}
                >
                    {route.title}
                </NavLink>
            </li>
        ));

    return (
        <>
            {/* TOP NAVBAR */}
            <nav className="navbar navbar-dark bg-dark px-3 d-flex justify-content-between">

                {/* Mobile hamburger */}
                <button
                    className="btn btn-outline-light d-md-none"
                    onClick={() => setMobileMenuOpen(true)}
                >
                    <FontAwesomeIcon icon="fa-solid fa-bars" />
                </button>

                {/* Desktop empty spacer */}
                <div className="d-none d-md-block"></div>

                {/* Right section */}
                <div className="d-flex align-items-center gap-3">
                    <FontAwesomeIcon
                        icon="fa-solid fa-bell"
                        className="text-white"
                    />

                    <span className="text-white d-none d-sm-inline">
                        {user.email}
                    </span>

                    <button
                        onClick={logout}
                        className="btn btn-outline-light btn-sm"
                    >
                        Logout
                    </button>
                </div>
            </nav>

            {/* DESKTOP SIDEBAR */}
            <nav
                className="sidebar d-none d-md-block"
                data-color="gray"
                data-background-color="black"
            >
                <div className="logo d-flex flex-column align-items-center text-uppercase py-3">
                    <img
                        className="img-fluid"
                        style={{ width: "120px" }}
                        src={logo}
                        alt="home_logo"
                    />
                    <p className="app-txt text-center mt-2">
                        XXIV ZONA SAN LUIS POTOSI
                    </p>
                </div>

                <div className="sidebar-wrapper">
                    <ul className="nav">{renderLinks()}</ul>
                </div>
            </nav>

            {/* MOBILE SIDEBAR DRAWER */}
            {mobileMenuOpen && (
                <>
                    {/* overlay */}
                    <div
                        className="position-fixed top-0 start-0 w-100 h-100 bg-dark"
                        style={{
                            opacity: 0.6,
                            zIndex: 1040,
                        }}
                        onClick={() => setMobileMenuOpen(false)}
                    />

                    {/* drawer */}
                    <div
                        className="position-fixed top-0 start-0 h-100 bg-black text-white"
                        style={{
                            width: "280px",
                            zIndex: 1050,
                            overflowY: "auto",
                        }}>
                        <div className="mobile-sidebar">
                            <div className="sidebar-header">
                                <img src={logo} alt="logo" className="sidebar-logo" />
                                <h6>XXIV Zona San Luis Potosí</h6>

                                <button
                                    className="close-btn"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    ✕
                                </button>
                            </div>

                            <ul className="nav flex-column px-3 mt-3">
                                {renderLinks()}
                            </ul>
                        </div>
                    </div>
                </>
            )}
        </>
    );
}

export { NavbarComponent };