import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

function Signup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
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

    if (form.password.length < 6) {
      setMessage("Password must be at least 6 characters.");
      return;
    }

    try {
      setLoading(true);

      await axios.post(
        "https://threew-social-app-backend-9f4v.onrender.com/api/auth/signup",
        {
          username: form.username.trim(),
          email: form.email.trim(),
          password: form.password,
        }
      );

      setMessage(
        "Account created successfully! Redirecting..."
      );

      setForm({
        username: "",
        email: "",
        password: "",
      });

      setTimeout(() => {
        navigate("/login");
      }, 1200);
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Signup failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {/* LEFT BRAND SECTION */}
      <div className="auth-brand-section">
        <div className="auth-brand">
          <div className="auth-brand-icon">W</div>

          <div>
            <h1>3W Social</h1>
            <p>Connect • Share • Grow</p>
          </div>
        </div>

        <div className="auth-message">
          <h2>Join the conversation.</h2>

          <p>
            Connect with people, share your thoughts,
            discover new interests and grow together.
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

      {/* SIGNUP SECTION */}
      <div className="auth-form-section">
        <div className="signup-card">
          <div className="mobile-brand">
            <div className="mobile-brand-icon">W</div>

            <div>
              <h1>3W Social</h1>
              <p>Connect • Share • Grow</p>
            </div>
          </div>

          <div className="form-header">
            <h2>Create Account</h2>

            <p>
              Join our community and start connecting
              today.
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Username</label>

              <input
                type="text"
                name="username"
                placeholder="Enter your username"
                value={form.username}
                onChange={handleChange}
                disabled={loading}
                required
              />
            </div>

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
                placeholder="Create a password"
                value={form.password}
                onChange={handleChange}
                disabled={loading}
                required
              />

              <small>
                Password must contain at least 6 characters.
              </small>
            </div>

            <button
              className="auth-submit"
              type="submit"
              disabled={loading}
            >
              {loading
                ? "Creating Account..."
                : "Create Account →"}
            </button>
          </form>

          {message && (
            <div className="auth-message-box">
              {message}
            </div>
          )}

          <div className="auth-divider">
            <span>Already a member?</span>
          </div>

          <Link
            to="/login"
            className="login-link-button"
          >
            Login to your account
          </Link>

          <p className="auth-footer">
            By creating an account, you agree to our
            community guidelines.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signup;