import { useState, type FormEvent } from "react";
import { AxiosError } from "axios";
import { Eye, EyeOff, LockKeyhole, Mail, UserRound } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import BrandLogo from "../components/BrandLogo";
import { useAuth } from "../context/AuthContext";

interface AuthPageProps {
  mode: "login" | "register";
}

interface ApiError {
  message?: string;
}

export default function AuthPage({ mode }: AuthPageProps) {
  const navigate = useNavigate();
  const { login, register } = useAuth();

  const isRegister = mode === "register";

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const user = isRegister
        ? await register({
            name: formData.name,
            email: formData.email,
            password: formData.password,
          })
        : await login({
            email: formData.email,
            password: formData.password,
          });

      if (user.interests.length > 0) {
        navigate("/news");
      } else {
        navigate("/interests");
      }
    } catch (requestError) {
      const axiosError = requestError as AxiosError<ApiError>;

      setError(
        axiosError.response?.data?.message ||
          "Something went wrong. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-visual">
        <BrandLogo />

        <div className="auth-visual__content">
          <p className="eyebrow">PERSONALIZED AUDIO NEWS</p>

          <h1>
            Your world,
            <span> in your ears.</span>
          </h1>

          <p>
            Select the topics that matter to you and listen to a personalized
            daily news briefing.
          </p>

          <div className="audio-wave" aria-hidden="true">
            {[28, 52, 38, 70, 46, 82, 54, 64, 34, 58, 30].map(
              (height, index) => (
                <span key={index} style={{ height: `${height}px` }} />
              ),
            )}
          </div>
        </div>

        <p className="auth-visual__footer">News on go. Made for you.</p>
      </section>

      <section className="auth-form-section">
        <div className="auth-form-card">
          <div className="auth-form-card__mobile-logo">
            <BrandLogo />
          </div>

          <p className="step-label">
            {isRegister ? "CREATE ACCOUNT" : "WELCOME BACK"}
          </p>

          <h2>{isRegister ? "Start listening." : "Good to see you."}</h2>

          <p className="auth-form-card__subtitle">
            {isRegister
              ? "Create your account to build your personal news briefing."
              : "Sign in to continue listening to your personalized news."}
          </p>

          <form onSubmit={handleSubmit}>
            {isRegister && (
              <label className="form-field">
                <span>Your name</span>

                <div className="input-wrapper">
                  <UserRound size={18} />

                  <input
                    type="text"
                    placeholder="Rahul Prajapati"
                    value={formData.name}
                    onChange={(event) =>
                      setFormData({
                        ...formData,
                        name: event.target.value,
                      })
                    }
                    minLength={2}
                    required
                  />
                </div>
              </label>
            )}

            <label className="form-field">
              <span>Email address</span>

              <div className="input-wrapper">
                <Mail size={18} />

                <input
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(event) =>
                    setFormData({
                      ...formData,
                      email: event.target.value,
                    })
                  }
                  required
                />
              </div>
            </label>

            <label className="form-field">
              <span>Password</span>

              <div className="input-wrapper">
                <LockKeyhole size={18} />

                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Minimum 6 characters"
                  value={formData.password}
                  onChange={(event) =>
                    setFormData({
                      ...formData,
                      password: event.target.value,
                    })
                  }
                  minLength={6}
                  required
                />

                <button
                  type="button"
                  className="password-button"
                  onClick={() => setShowPassword((current) => !current)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </label>

            {error && (
              <p className="form-error" role="alert">
                {error}
              </p>
            )}

            <button
              className="primary-button"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? "Please wait..."
                : isRegister
                  ? "Create account"
                  : "Sign in"}
            </button>
          </form>

          <p className="auth-switch">
            {isRegister ? "Already have an account?" : "New to Nuzio AI?"}{" "}
            <Link to={isRegister ? "/login" : "/register"}>
              {isRegister ? "Sign in" : "Create account"}
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
