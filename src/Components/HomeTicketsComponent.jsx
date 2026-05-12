import React from 'react';
import {TitlesLayoutComponent} from "./LayoutsComponent/TitlesLayoutComponent";
import { useNavigate } from "react-router-dom";
import MembershipsMainTableComponent from "./MembershipsComponent/MembershipsMainTableComponent";

function HomeTicketsComponent(){
    const navigate = useNavigate();


    return (
        <div className="main-panel ps-container ps-theme-default">
            <div className='content'>
                <div className='container-fluid'>
                    <div className='row justify-content-center pb-2'>
                        <div className='card'>
                            <TitlesLayoutComponent name="Personal XXIV Zona San Luis Potosi"/>
                            <div className='card-body'>
                                <div className="row py-1">
                                    <div className="col-12 text-left">
                                        <button className="btn btn-md btn-primary btn-dark"
                                                onClick={() => navigate("/membresias/nueva")}>Nueva Solicitud</button>
                                    </div>
                                </div>

                                <div className='row justify-content-center'>
                                    <MembershipsMainTableComponent/>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export {HomeTicketsComponent};