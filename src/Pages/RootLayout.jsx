import { Navbar } from "../Components/Navbar";
import { Outlet,useLocation } from "react-router-dom";
import Footer from "../Components/Footer";

export default function RootLayout(){
    return(
        <>
        <Navbar/>
        {/*define nested routes*/}
        <Outlet/>
        <Footer/>
        </>
    );
}