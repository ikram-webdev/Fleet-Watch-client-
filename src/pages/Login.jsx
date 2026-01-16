import React, { useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "../App.css";

const Login = () => {
  const [isSignup, setIsSignup] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "Driver",
  });
  const navigate = useNavigate();

  // --- Fixed Dynamic Alert ---
  const showAlert = (title, icon, text = "") => {
    Swal.fire({
      title: title, // Ab ye wahi title dikhayega jo aap pass karenge
      text: text,
      icon: icon, // success ya error dynamic hoga
      timer: 3000,
      showConfirmButton: icon === "error", // Error par button dikhayega taake user parh sakay
      background: "#1d2e45ff",
      color: "#fff",
      confirmButtonColor: "#00e5ff",
    });
  };

  const handleAuth = async (e) => {
    e.preventDefault();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      return showAlert(
        "Invalid Format",
        "error",
        "Please enter a valid email address."
      );
    }

    try {
      if (isSignup) {
        await API.post("/auth/register", formData);
        showAlert("Account Created!", "success", "Please login to continue.");
        setIsSignup(false);
      } else {
        const res = await API.post("/auth/login", {
          email: formData.email,
          password: formData.password,
        });

        localStorage.setItem("token", res.data.token);
        localStorage.setItem("role", res.data.user.role);
        localStorage.setItem("userId", res.data.user.id);
        localStorage.setItem("userName", res.data.user.name);

        showAlert(`Welcome ${res.data.user.name}!`, "success");

        setTimeout(() => {
          if (res.data.user.role === "Admin") {
            navigate("/admin-dashboard");
          } else {
            navigate("/driver-dashboard");
          }
        }, 1500);
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Something went wrong!";
      // Ab ye "Login Failed" dikhayega "Welcome Auth Error" ki jagah
      showAlert("Login Failed", "error", errorMessage);
    }
  };

  // --- Forgot Password Integrated with Backend ---
  const handleForgotPassword = () => {
    Swal.fire({
      title: "Reset Password",
      input: "email",
      inputPlaceholder: "Enter your registered email",
      showCancelButton: true,
      confirmButtonText: "Send Link",
      confirmButtonColor: "#00e5ff",
      background: "#1a1a1a",
      color: "#fff",
    }).then(async (result) => {
      if (result.isConfirmed && result.value) {
        try {
          // Backend call for forgot password
          await API.post("/auth/forgot-password", { email: result.value });
          showAlert(
            "Email Sent!",
            "success",
            "Please check your inbox for the reset link."
          );
        } catch (err) {
          const errMsg = err.response?.data?.message || "Email not found!";
          showAlert("Error", "error", errMsg);
        }
      }
    });
  };

  return (
    <div className="main-bg">
      <div className="glass-container animate__animated animate__fadeInUp">
        <h1 className="brand-logo mb-1">FLEET WATCH</h1>
        <p
          className="text-center mb-4 text-light-50 small"
          style={{ letterSpacing: "3px" }}
        >
          {isSignup ? "CREATE ACCOUNT" : "LOGIN TO ACCOUNT"}
        </p>

        <form onSubmit={handleAuth}>
          {isSignup && (
            <div className="mb-3 animate__animated animate__fadeIn">
              <input
                type="text"
                className="form-control glass-input"
                placeholder="Full Name"
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
            </div>
          )}

          <div className="mb-3">
            <input
              type="email"
              className="form-control glass-input"
              placeholder="Email Address"
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
            />
          </div>

          <div className="mb-3 position-relative">
            <input
              type={showPassword ? "text" : "password"}
              className="form-control glass-input"
              placeholder="Password"
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              required
            />
            <span
              className="position-absolute top-50 end-0 translate-middle-y me-3 cursor-pointer text-white-50"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
            </span>
          </div>

          {!isSignup && (
            <div className="text-end mb-3">
              <span
                onClick={handleForgotPassword}
                className="text-info small cursor-pointer"
              >
                Forgot Password?
              </span>
            </div>
          )}

          <button type="submit" className="btn glass-btn w-100 mb-3">
            {isSignup ? "REGISTER NOW" : "SIGN IN"}
          </button>
        </form>

        <p className="text-center text-white small">
          {isSignup ? "Already have an account?" : "Don't have an account?"}
          <span
            className="text-info ms-2 fw-bold"
            style={{ cursor: "pointer" }}
            onClick={() => setIsSignup(!isSignup)}
          >
            {isSignup ? "Login" : "Sign Up"}
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
