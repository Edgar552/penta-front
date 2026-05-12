import React from 'react';
import {TitlesLayoutComponent} from "../LayoutsComponent/TitlesLayoutComponent";
import {Outlet, useLocation, useNavigate} from "react-router-dom";

function UsersComponent(){
    const navigate = useNavigate();

    const { pathname } = useLocation();

    let title = "Users";

    if (pathname === "/users/newUser") {
        title = "New User Registration";
    } else if (pathname.startsWith("/users/")) {
        title = "User Details";
    }
    return(
        <div className="main-panel ps-container ps-theme-default">
            <div className="content">
                <div className="container-fluid">
                    <div className="row justify-content-center pb-2">
                        <div className="card">
                            <TitlesLayoutComponent name={title}/>
                            <div className="card-body">
                                <div className="row py-1">
                                    <div className="col-12 text-left">
                                        <button className="btn btn-outline-secondary mb-4"
                                                onClick={() => navigate("/users")}>Return</button>
                                    </div>
                                </div>

                                <div className="row justify-content-center ">
                                    <Outlet />
                                </div>

                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export { UsersComponent };