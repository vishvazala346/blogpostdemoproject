import { Navigate,Outlet } from "react-router-dom";
import RootLayout from '../Pages/RootLayout';

export default function AuthGuard(){
    const loginData = JSON.parse(localStorage.getItem("loginData"));

    if(!loginData){
        //using replace not add a new entry , overwrite the current one
        return <Navigate to = "/Login" replace/>;
    }
    return <RootLayout/>
}