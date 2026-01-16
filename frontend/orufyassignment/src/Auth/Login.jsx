import React, { useState, useEffect } from "react";
import "./Login.css";
import bgimg from "../assets/images/bgimage.png";
import cardImg from "../assets/images/image.jpg";
import axios from "axios";
import { toast } from "react-toastify";
import {useNavigate} from 'react-router-dom'
import imgicon from "../assets/images/realicon.png"

const Login = () => {
  const [loginform, setloginform] = useState(true);
  const [signupForm, setSignupForm] = useState(false);
  const [otpForm, setOtpForm] = useState(false);
  const [loading ,setloading]=useState(false)
  
  const token=localStorage.getItem('token')
  const navigate=useNavigate()

  
  const [loginData, setLoginData] = useState({
    email: ""
  });
  
  const [otpData, setOtpData] = useState({
    otp: ""
  });
  const [timer, setTimer] = useState(20);
  const [canResend, setCanResend] = useState(false);
  
  const [signupData, setSignupData] = useState({
    name: "",
    age: "",
    gender: "",
    phone: "",
    email: ""
  });


  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      navigate("/", { replace: true });
    }
  }, []);


  useEffect(() => {
    if (otpForm && timer > 0) {
      const interval = setInterval(() => {
        setTimer(prev => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [otpForm, timer]);

  const handleLoginChange = (e) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value
    });
  };

  const handleOtpChange = (e) => {
    setOtpData({
      ...otpData,
      [e.target.name]: e.target.value
    });
  };

  const handleSignupChange = (e) => {
    setSignupData({
      ...signupData,
      [e.target.name]: e.target.value
    });
  };

 const handleLoginSubmit = async (e) => {
  e.preventDefault();

  try {
    console.log("Login data:", loginData.email);

    const res = await axios.post(
      " https://orufy-tech-backend-e4zy.onrender.com/user/login",
      loginData
    );

    toast.success(res.data.message);
    console.log(res.data);
    localStorage.setItem('token',res.data.token)
    setloginform(false);
    setOtpForm(true);

  } catch (error) {
    console.error(error);

    toast.error(
      error?.response?.data?.message || "Failed to send OTP"
    );
  }
};
;

const handleOtpSubmit = async (e) => {
  e.preventDefault();

  try {
    const res = await axios.post(
      ' https://orufy-tech-backend-e4zy.onrender.com/user/verifyotp',
      { otp: otpData },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    console.log("OTP response:", res.data);
    toast.success("Login successful!");
    navigate('/')
    //main token
    localStorage.setItem("authToken", res.data.token);

  } catch (error) {
    console.error(error);
    toast.error(
      error?.response?.data?.message || "Failed to verify OTP"
    );
  }
};


  const handleSignupSubmit = async (e) => {
    setloading(true)
    e.preventDefault();
    try {
      const res = await axios.post(" https://orufy-tech-backend-e4zy.onrender.com/user/signup", signupData);
      toast.success(res.data.message);
      setSignupForm(false);
      setloginform(true);
      // setOtpForm(true);
      setloading(false)
    } catch (error) {
      setloading(false);
      toast.error(error.response?.data?.message || "Signup failed");
    }
  };

  const handleResendOtp = async () => {
  if (!canResend) return;
  setloading(true)

  try {
    const res = await axios.post(
      ' https://orufy-tech-backend-e4zy.onrender.com/user/resendOtp',
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log(res.data.message);
    toast.success("OTP resent successfully!");
    setloading(false)

    setTimer(20);
    setCanResend(false);

  } catch (error) {
      setloading(false)
    toast.error(
      error?.response?.data?.message || "Failed to resend OTP"
    );
  }
};


  const showLogin = () => {
    setloginform(true);
    setSignupForm(false);
    setOtpForm(false);
  };

  const showSignup = () => {
    setloginform(false);
    setSignupForm(true);
    setOtpForm(false);
  };

  return (
    <div className="login-container">
      <div className="left-section">
        
        <div className="gradient-bg">
          <div className="iconimg">
            <h4>Product</h4> <img src={imgicon} alt="" className="realicon" />
          </div>
          </div>
        <img src={bgimg} alt="Background" className="bg-image" />
        <div className="overlay"></div>
        <div className="left-content">
          <div className="card-wrapper">
            <div className="preview-card">
              <img src={cardImg} alt="Product Preview" />
              <div className="imagetext">
                <p>Uplist your <br /> product to market</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {loginform && (
        <div className="right-section">
          <div className="login-box">
            <h2>Login to your Productr Account</h2>
            
            <form onSubmit={handleLoginSubmit}>
              <div className="form-group">
                <label>Email or Phone number</label>
                <input 
                  type="text" 
                  name="email"
                  placeholder="Enter email or phone number" 
                  value={loginData.email}
                  onChange={handleLoginChange}
                  required
                />
              </div>

              <button type="submit" className="login-btn">{loading?"Processing...":"Login"}</button>
            </form>

            <div className="signup-box">
              <p>Don't have a Productr Account</p>
              <button type="button" onClick={showSignup}>SignUp Here</button>
            </div>
          </div>
        </div>
      )}

      {otpForm && (
        <div className="right-section">
          <div className="login-box">
            <h2>Enter your OTP</h2>
            
            <form onSubmit={handleOtpSubmit}>
              <div className="form-group">
                <label>Enter OTP</label>
                <input 
                  type="text" 
                  name="otp"
                  placeholder="Enter 6-digit OTP" 
                  value={otpData.otp}
                  onChange={handleOtpChange}
                  maxLength="6"
                  required
                />
              </div>

              <div className="otp-resend">
                <p>
                  Didn't receive OTP?{" "}
                  {canResend ? (
                    <button type="button" className="resend-btn" onClick={handleResendOtp}>
                      {loading?"Sending...":"Resend Otp"}
                    </button>
                  ) : (
                    <span>Resend in {timer}s</span>
                  )}
                </p>
              </div>

              <button type="submit" className="login-btn">{loading?"Processing...":"Verify_Otp"}</button>
            </form>

            <div className="signup-box">
              <p>Back to login?</p>
              <button type="button" onClick={showLogin}>Login Here</button>
            </div>
          </div>
        </div>
      )}

      {signupForm && (
        <div className="right-section">
          <div className="login-box">
            <h2>Create your Productr Account</h2>
            
            <form onSubmit={handleSignupSubmit}>
              <div className="form-group">
                <label>Full Name</label>
                <input 
                  type="text" 
                  name="name"
                  placeholder="Enter your full name" 
                  value={signupData.name}
                  onChange={handleSignupChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Age</label>
                <input 
                  type="number" 
                  name="age"
                  placeholder="Enter your age" 
                  value={signupData.age}
                  onChange={handleSignupChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Gender</label>
                <select 
                  name="gender" 
                  value={signupData.gender}
                  onChange={handleSignupChange}
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label>Phone Number</label>
                <input 
                  type="tel" 
                  name="phone"
                  placeholder="Enter your phone number" 
                  value={signupData.phone}
                  onChange={handleSignupChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Email Address</label>
                <input 
                  type="email" 
                  name="email"
                  placeholder="Enter your email address" 
                  value={signupData.email}
                  onChange={handleSignupChange}
                  required
                />
              </div>

              <button type="submit" className="login-btn">Create Account</button>
            </form>

            <div className="signup-box">
              <p>Already have a Productr Account?</p>
              <button type="button" onClick={showLogin}>Login Here</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;