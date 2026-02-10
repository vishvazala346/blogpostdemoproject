import React, { useContext } from "react"; // useContext ઉમેર્યું
import "./Card.css";
import { useNavigate } from "react-router-dom";
import { ModeContext } from "../Contexts/ModeContext"; // Context import કરો

const Card = (props) => {
  const ctx = useContext(ModeContext); // Context વાપરો
  const loggedInUserData = JSON.parse(localStorage.getItem("loginData")) || {};
  const desc = props.desc || "";

  return (
    /* અહીં ctx.mode મુજબ ડાયનેમિક ક્લાસ આપો */
    <div className={`card ${ctx.mode}`}>
      <div className="card-content" onClick={props.onRedirect}>
        <div className="img-box">
          <img src={props.image || "https://via.placeholder.com/150"} alt="post" />
        </div>
        <h2>{props.title || "No Title"}</h2>
        <p>{desc.length > 90 ? desc.substring(0, 90) + "..." : desc}</p>
      </div>

      {loggedInUserData?.role === "admin" && (
        <div className="button">
          <button className="btn" onClick={props.onDelete}>Delete</button>
          <button className="btn edt" onClick={props.onEdit}>Edit</button>
        </div>
      )}
    </div>
  );
};

export default Card;