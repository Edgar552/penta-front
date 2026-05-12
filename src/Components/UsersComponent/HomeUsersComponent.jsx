import React from 'react';
import {TitlesLayoutComponent} from "../LayoutsComponent/TitlesLayoutComponent";
import { useNavigate } from "react-router-dom";
import UsersTableComponent from "./UsersTableComponent";

function HomeUsersComponent(){
    const navigate = useNavigate();


    return (
        <div className="main-panel ps-container ps-theme-default">
            <div className='content'>
                <div className='container-fluid'>
                    <div className='row justify-content-center pb-2'>
                        <div className='card'>
                            <TitlesLayoutComponent name="Users Management"/>
                            <div className='card-body'>
                                <div className="row py-1">
                                    <div className="col-12 text-left">
                                        <button className="btn btn-md btn-primary btn-dark"
                                                onClick={() => navigate("/users/newUser")}>New User</button>
                                    </div>
                                </div>

                                <div className='row justify-content-center'>
                                    <UsersTableComponent/>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export {HomeUsersComponent};