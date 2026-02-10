import "./Footer.css";
export default function Footer ()  {
    const currentYear= new Date().getFullYear();
return(
    <>
        <footer> <p>&copy; {currentYear}. All Rights Are reserved<b>  BlogPost</b></p></footer>
       
    </>
)
}