import { useEffect, useState } from "react";
import { API_URL } from "../../config";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const SignUp =() => {
    const navigate=useNavigate();
const [messageSuccessful,setMessageSuccessful]=useState(false);
const[wrongPassword,setWrongPassword]=useState(false);
const[databaseError,setDatabaseError]=useState("");
const[wrongPasswordBorder,setWrongPasswordBorder]=useState("#e0e0e0");
  const [formData, setFormData] = useState({
    name: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "Student", // capital S mesh small s
  });
const handleChange = (e) => {
  const { name, value } = e.target;
  
  setFormData((prev) => ({
    ...prev,
    [name]: value,
  }));

  if (name === "password" || name === "confirmPassword") {
    if (name === "confirmPassword" && value !== formData.password) {
      setWrongPassword(true);
      setWrongPasswordBorder("red");
    } else if (name === "password" && formData.confirmPassword && value !== formData.confirmPassword) {
      setWrongPassword(true);
      setWrongPasswordBorder("red");
    } else {
      setWrongPassword(false);
      setWrongPasswordBorder("#e0e0e0");
    }
  }
};



const handleSubmit = async (e) => {
  e.preventDefault();

  if (formData.password !== formData.confirmPassword) {
    setWrongPassword(true);
    setWrongPasswordBorder("red");
    return;
  }

  try {
    const response = await fetch(`${API_URL}/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        fullName: `${formData.name} ${formData.lastName}`,
        email: formData.email,
        password: formData.password,
        password_confirmation: formData.confirmPassword, 
        role: formData.role,
      }),
    });

    const data = await response.json();



      if (!response.ok) {
  const msg =
    data?.message ||
    (data?.errors ? Object.values(data.errors).flat().join("\n") : "Signup failed");
  setDatabaseError(msg);
  return; 
}



setDatabaseError("");
    setWrongPassword(false);
    setWrongPasswordBorder("#e0e0e0");
    setMessageSuccessful(true);
    setTimeout(() => setMessageSuccessful(false), 3000);

    // ✅ redirect to login with success message
    navigate("/Login", {
      replace: true,
      state: { signupSuccess: `Successfully registered as a ${formData.role}` },
    });

  } catch (error) {
    console.error("Signup error:", error);
    setDatabaseError("Network error: " + error.message);
  }
};
  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <h2 style={styles.title}>Create Account</h2>

        <input
          style={styles.input}
          name="name"
          value={formData.name}
          onChange={handleChange}
          type="text"
          placeholder="First Name"
        />

        <input
          style={styles.input}
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          type="text"
          placeholder="Last Name"
        />

        <input
          style={styles.input}
          name="email"
          value={formData.email}
          onChange={handleChange}
          type="email"
          placeholder="Email"
        />

        <input
       style={{
    ...styles.input,border: `1px solid ${wrongPasswordBorder}`, 
  }}
          name="password"
          value={formData.password}
          onChange={handleChange}
          type="password"
          placeholder="Password"
        />

        <input
           style={{
    ...styles.input,border: `1px solid ${wrongPasswordBorder}`, 
  }}
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          type="password"
          placeholder="Confirm Password"
        />

        <select
          style={styles.select}
          name="role"
          value={formData.role}
          onChange={handleChange}
        >
<option value="Student">Student</option>
<option value="Instructor">Instructor</option>


        </select>

        <button style={styles.button} type="submit">
          Sign Up
        </button>
    {wrongPassword && <p style={styles.errorText}>Passwords do not match</p>}

{messageSuccessful &&  <p style={styles.successText}>  Successfully registered as a {formData.role}</p>}
<p style={styles.errorText}>{databaseError}</p>
 <h3 style={{ textAlign: "center", fontSize: "14px" }}>
          Already have an account? <Link to="/Login">Login</Link>
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

  title: {
    textAlign: "center",
    fontSize: "22px",
    fontWeight: "600",
    color: "#344767",
    marginBottom: "8px",
  },

  input: {
    padding: "12px 14px",
    borderRadius: "8px",
    border: "1px solid #e0e0e0",
    fontSize: "14px",
    outline: "none",
    color: "#344767",
  },

  select: {
    padding: "12px 14px",
    borderRadius: "8px",
    border: "1px solid #e0e0e0",
    fontSize: "14px",
    background: "#fff",
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

  footerText: {
    textAlign: "center",
    fontSize: "12px",
    color: "#7b809a",
    marginTop: "10px",
  },errorInput: {
  border: "1px solid #f44335",
},

errorText: {
  color: "#f44335",
  fontSize: "13px",
  fontWeight: "500",
  textAlign: "center",
},

successText: {
  color: "#2e7d32",
  fontSize: "14px",
  fontWeight: "600",
  textAlign: "center",
},

};

export default SignUp;
