import React, { useState } from "react";
import './Login.css';
import img from '../assets/log.png';
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function Login() {

    const [mobileNo, setMobileNo] = useState("");
    const [otp, setOtp] = useState("");
    const [generateOtp, setGenerateOtp] = useState("");
    const navigate = useNavigate();

    const [role, setRole] = useState("");
    const [submittedData, setSubmittesData] = useState("");

    const random = Math.floor(1000 + Math.random() * 9000);

    const [mobileNoValidation, setMobileNoValidation] = useState("");
    const [roleValidation, setRoleValidation] = useState("");
    const [otpValidation, setOtpValidation] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    const handleMobilenoChange = (event) => {
        setMobileNo(event.target.value);
    }

    const handleRoleChange = (event) => {
        setRole(event.target.value);
    };

    const handleOtpChange = () => {
        setOtp(random.toString());
        setGenerateOtp(random.toString());
        alert("One Time Password: " + random);
    }

    const handleSubmit = async (event) => {
        event.preventDefault();

        // Validate inputs first
        if (!mobileNo) setMobileNoValidation("mobileNo is required");
        if (!role) setRoleValidation("Role is required");
        if (!otp) setOtpValidation("otp is required");
        if (!mobileNo || !role || !otp) return;

        // OTP check
        if (generateOtp !== otp) {
            toast.error("Invalid OTP");
            return;
        }

        const formData = { mobileNo, role, otp };

        try {
            const res = await fetch(`https://697dc68d97386252a269074b.mockapi.io/Users`);
            const users = await res.json();

            const existingUser = users?.find(
                (user) => user.mobileNo == mobileNo && 
                          user.role == role
            );

            if (existingUser) {
                toast.success("Login Successfully");
                setTimeout(() => {
                    localStorage.setItem("loginData", JSON.stringify(existingUser));
                    navigate("/");
                }, 2000);
            } else {
                // POST new user
                const url = `https://697dc68d97386252a269074b.mockapi.io/Users`;
                const response = await fetch(url, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(formData),
                });

                if (!response.ok) {
                    toast.error("Invalid Request");
                    return;
                }

                const data = await response.json();
                toast.success("Login Successfully");
                setTimeout(() => {
                    localStorage.setItem("loginData", JSON.stringify(data));
                    navigate("/");
                }, 1500);
            }
        } catch (error) {
            toast.error("Error");
            console.error(error);
        }
    };

    return (
        <>
            <ToastContainer />
            <div className="login-page">

                <div className="login-left">
                    <img src={img} alt="Login Illustration" />
                </div>

                <div className="login-right">
                    <h2>Hello again</h2>
                    <p>Welcome Back! Let's Get Started!!</p>

                    <form className="form" onSubmit={handleSubmit}>

                        <input
                            type="text"
                            placeholder="Mobile Number"
                            className="area"
                            onChange={handleMobilenoChange}
                            value={mobileNo}
                            minLength={10}
                            maxLength={10}
                        />
                        {mobileNoValidation && (<p className="error">{mobileNoValidation}</p>)}

                        <select className="input-field" value={role} onChange={handleRoleChange}>
                            <option value="">Select a Role</option>
                            <option value="admin">Admin</option>
                            <option value="user">User</option>
                        </select>
                        {roleValidation && (<p className="error">{roleValidation}</p>)}

                        <button className="btn1" type="button" onClick={handleOtpChange}>Generate OTP</button>

                        <input
                            type="text"
                            placeholder="Enter OTP"
                            className="area"
                            maxLength={4}
                            onChange={(event) => setOtp(event.target.value)}
                            value={otp}
                        />
                        {otpValidation && (<p className="error">{otpValidation}</p>)}

                        <button className="btn1" type="submit">Login</button>
                    </form>

                </div>
            </div>
        </>
    );
}

export default Login;
