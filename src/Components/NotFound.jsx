import img from '../assets/Error 404.gif'
export default function NotFound(){
    return(
        <>
       
        <div style={{textAlign:"center", padding: "40px"}}>
            <img src={img} style={{height:"200px",width:"200px"}}></img>
            <h1>404 - Page Not Found</h1>
        </div>
        </>
    )
}