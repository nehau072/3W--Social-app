
import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      setLoading(true);

      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        {
          email: form.email.trim(),
          password: form.password,
        }
      );

      // Save authentication data
      localStorage.setItem("token", response.data.token);
      localStorage.setItem(
        "user",
        JSON.stringify(response.data.user)
      );

      setMessage("Login successful! Redirecting...");

      // Redirect to Homepage
      setTimeout(() => {
        navigate("/home");
      }, 700);

    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Login failed. Please check your email and password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">

      {/* LEFT SECTION */}
      <div className="auth-brand-section">
        <div className="auth-brand">
          <div className="auth-brand-icon">W</div>

          <div>
            <h1>3W Social</h1>
            <p>Connect • Share • Grow</p>
          </div>
        </div>

        <div className="auth-message">
          <h2>Welcome back.</h2>

          <p>
            Reconnect with your community, share your thoughts,
            discover new conversations and keep growing together.
          </p>

          <div className="auth-features">
            <div>
              <span>✓</span>
              Connect with people
            </div>

            <div>
              <span>✓</span>
              Share your thoughts
            </div>

            <div>
              <span>✓</span>
              Discover new interests
            </div>
          </div>
        </div>

        <div className="auth-decoration">
          Better
          <br />
          Together ♡
        </div>
      </div>

      {/* RIGHT SECTION */}
      <div className="auth-form-section">
        <div className="signup-card">

          {/* Mobile Logo */}
          <div className="mobile-brand">
            <div className="mobile-brand-icon">W</div>

            <div>
              <h1>3W Social</h1>
              <p>Connect • Share • Grow</p>
            </div>
          </div>

          {/* Header */}
          <div className="form-header">
            <h2>Welcome Back</h2>

            <p>
              Login to your account and continue connecting.
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit}>

            <div className="form-group">
              <label>Email</label>

              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={form.email}
                onChange={handleChange}
                disabled={loading}
                required
              />
            </div>

            <div className="form-group">
              <label>Password</label>

              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                value={form.password}
                onChange={handleChange}
                disabled={loading}
                required
              />
            </div>

            <button
              className="auth-submit"
              type="submit"
              disabled={loading}
            >
              {loading ? "Logging In..." : "Login →"}
            </button>

          </form>

          {/* Message */}
          {message && (
            <div className="auth-message-box">
              {message}
            </div>
          )}

          {/* Signup */}
          <div className="auth-divider">
            <span>Don't have an account?</span>
          </div>

          <Link
            to="/signup"
            className="login-link-button"
          >
            Create a new account
          </Link>

          <p className="auth-footer">
            By continuing, you agree to our community
            guidelines.
          </p>

        </div>
      </div>
    </div>
  );
}

export default Login;


