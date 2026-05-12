import React from 'react';
import {TitlesLayoutComponent} from "../LayoutsComponent/TitlesLayoutComponent";
import {Outlet, useLocation, useNavigate} from "react-router-dom";

function MembershipComponent(){
  const navigate = useNavigate();

  const { pathname } = useLocation();

  let title = "";

  if (pathname === "/membresias/nueva") {
    title = "Nuevo Registro de Solicitud de Membresia";
  } else if (pathname.startsWith("/membresias/edit")) {
    title = "Actualizar Datos de Solicitud de Membresia";
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
                      <button className="btn btn-outline-secondary"
                              onClick={() => navigate("/membresias/")}>← Regresar</button>
                    </div>
                  </div>

                  <div className="row justify-content-center">
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

export { MembershipComponent };