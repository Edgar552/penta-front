import './App.css';
import './assets/css/material.css'
import './assets/css/showcase.css'
import "react-datepicker/dist/react-datepicker.css";
import React from 'react';
import {Routes, Route, HashRouter} from "react-router-dom";
import {NavbarComponent} from "./Components/NavbarComponent/NavbarComponent";
import {HomeTicketsComponent} from "./Components/HomeTicketsComponent";
import {MembershipComponent} from "./Components/MembershipsComponent/MembershipComponent";
import {TicketDetails} from "./Components/MembershipsComponent/TicketDetailsComponent";
import {MembershipFormComponent} from "./Components/MembershipsComponent/MembershipFormComponent";
import ProtectedRoute from "./routes/ProtectedRoute";
import Login from "./Components/Login";
import {HomeUsersComponent} from "./Components/UsersComponent/HomeUsersComponent";
import UsersFormComponent from "./Components/UsersComponent/UsersFormComponent";
import {UsersComponent} from "./Components/UsersComponent/UsersComponent";
import ChangePasswordComponent from "./Components/UsersComponent/ChangePasswordComponent";
import {MembershipEditPage} from "./Components/MembershipsComponent/MembershipEditComponent";

function App() {
  return (
  <React.Fragment className="wrapper">
    <HashRouter>
    {/*  heres the space for the auth provider component that is going to have all the components and navigation inside*/}
      {/*  heres the space for the data provider component the one that contains part of the logic for add delete or edit component*/}
      <NavbarComponent/>
        <Routes>
          {/*public*/}
          <Route path="/login" element={<Login/>} />

          {/*Protected routes*/}
          <Route element={<ProtectedRoute />}>

            <Route index path="/membresias" element={<HomeTicketsComponent/>}/>
            <Route path="/membresias" element={<MembershipComponent/>} >
                <Route
                    path="nueva"
                    element={<MembershipFormComponent mode="create" />}
                />

              <Route
                  path="edit/:id"
                  element={<MembershipEditPage />}
              />

              <Route
                  path=":id"
                  element={<TicketDetails />}
                  handle={{ title: "Ticket Details" }}/>
              </Route>

            <Route path="/users" element={<HomeUsersComponent/>}/>
            <Route path="/users" element={<UsersComponent/>} >
              <Route
                  path="newUser"
                  element={<UsersFormComponent />}
                  handle={{ title: "Register New User" }}/>

            </Route>

            <Route path="/change-password" element={<ChangePasswordComponent />} />

            {/*For all routes that are not defined on the app*/}
            <Route path="*" element={<p>Not Found</p>}/>
          </Route>
        </Routes>

    </HashRouter>
  </React.Fragment>
  );
}

export default App;
