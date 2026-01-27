import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { API_URL } from "../../config"; 

const Login = ({token}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [passwordBorder, setPasswordBorder] = useState("#e0e0e0");

 
  const [signupMsg, setSignupMsg] = useState("");

  useEffect(() => {
    const msg = location?.state?.signupSuccess;
    if (msg) {
      setSignupMsg(msg);
      
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setLoginError("");
    setPasswordBorder("#e0e0e0");
  };
const handleSubmit = async (e) => {
  e.preventDefault();

  if (!formData.email || !formData.password) {
    setLoginError("Email and password are required");
    return;
  }

  try {
    const response = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        email: formData.email,
        password: formData.password,
      }),
    });

    const data = await response.json();
    console.log("LOGIN RESPONSE:", data); 

    if (!response.ok) {
      setLoginError(data.error || data.message || "Login failed");
      setPasswordBorder("red");
      return;
    }

    // ✅ save login
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));

    setLoginError("");
    setLoginSuccess(true);
    setSignupMsg(""); // ✅ hide signup msg after login

    const role = (data?.user?.role || "").trim().toLowerCase();
    console.log("ROLE:", role); // ✅ debug

if (role === "superadmin") {
  navigate("/admin/dashboard", { replace: true });
  return;
}

if (role === "instructor") {
  navigate("/instructor/dashboard", { replace: true });
  return;
}

if (role === "student") {
  navigate("/student/dashboard", { replace: true });
  return;
}

setLoginError("Unauthorized role");

  } catch (error) {
    setLoginError("Network error: " + error.message);
    setPasswordBorder("red");
  }
};


  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <h2 style={styles.title}>Login</h2>

        {/* ✅ new: signup success message */}
        {signupMsg && <p style={styles.successText}>{signupMsg} ✅ Please login.</p>}

        <input
          style={styles.input}
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
        />

        <input
          style={{ ...styles.input, border: `1px solid ${passwordBorder}` }}
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Password"
        />

        <button style={styles.button} type="submit">Login</button>

        {loginError && <p style={styles.errorText}>{loginError}</p>}
        {loginSuccess && <p style={styles.successText}>Successfully logged in</p>}

        <h3 style={{ textAlign: "center", fontSize: "14px" }}>
          Don’t have an account? <Link to="/signup">Sign Up</Link>
        </h3>
      </form>
    </div>
  );
};

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#f0f2f5",
    padding: "20px",
  },
  form: {
    width: "380px",
    background: "#ffffff",
    borderRadius: "16px",
    padding: "32px",
    boxShadow: "0 20px 40px rgba(0,0,0,0.08)",
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  title: { textAlign: "center", fontSize: "22px", fontWeight: "600", color: "#344767" },
  input: {
    padding: "12px 14px",
    borderRadius: "8px",
    border: "1px solid #e0e0e0",
    fontSize: "14px",
    outline: "none",
    color: "#344767",
  },
  button: {
    marginTop: "10px",
    padding: "12px",
    borderRadius: "10px",
    border: "none",
    background: "linear-gradient(135deg, #2152ff, #21d4fd)",
    color: "#fff",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    boxShadow: "0 8px 20px rgba(33,82,255,0.3)",
  },
  errorText: { color: "#f44335", fontSize: "13px", fontWeight: "500", textAlign: "center" },
  successText: { color: "#2e7d32", fontSize: "14px", fontWeight: "600", textAlign: "center" },
};

export default Login;
