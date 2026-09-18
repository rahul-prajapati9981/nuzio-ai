import { useState } from "react";
import { AxiosError } from "axios";
import {
  Activity,
  Cpu,
  FlaskConical,
  Landmark,
  Rocket,
  Trophy,
  type LucideIcon,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import BrandLogo from "../components/BrandLogo";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import type { InterestsResponse } from "../types";

interface Interest {
  name: string;
  description: string;
  icon: LucideIcon;
}

interface ApiError {
  message?: string;
}

const availableInterests: Interest[] = [
  {
    name: "Technology",
    description: "AI, gadgets and innovation",
    icon: Cpu,
  },
  {
    name: "Finance",
    description: "Markets, business and money",
    icon: Landmark,
  },
  {
    name: "Startups",
    description: "Founders and emerging products",
    icon: Rocket,
  },
  {
    name: "Health",
    description: "Wellness and medical updates",
    icon: Activity,
  },
  {
    name: "Science",
    description: "Research, space and discovery",
    icon: FlaskConical,
  },
  {
    name: "Sports",
    description: "Matches, teams and athletes",
    icon: Trophy,
  },
];

export default function InterestsPage() {
  const navigate = useNavigate();
  const { user, updateInterests } = useAuth();

  const [selectedInterests, setSelectedInterests] = useState<string[]>(
    user?.interests || [],
  );

  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const toggleInterest = (interest: string) => {
    setError("");

    setSelectedInterests((current) =>
      current.includes(interest)
        ? current.filter((item) => item !== interest)
        : [...current, interest],
    );
  };

  const handleContinue = async () => {
    if (selectedInterests.length === 0) {
      setError("Select at least one interest");
      return;
    }

    setError("");
    setIsSaving(true);

    try {
      const response = await api.put<InterestsResponse>("/news/interests", {
        interests: selectedInterests,
      });

      updateInterests(response.data.interests);
      navigate("/news");
    } catch (requestError) {
      const axiosError = requestError as AxiosError<ApiError>;

      setError(
        axiosError.response?.data?.message || "Unable to save your interests",
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <main className="onboarding-page">
      <div className="onboarding-container">
        <header className="onboarding-header">
          <BrandLogo compact />

          <button
            type="button"
            className="text-button"
            onClick={() => navigate("/news")}
          >
            Skip
          </button>
        </header>

        <div className="progress-bar">
          <span className="progress-bar__active" />
          <span />
          <span />
        </div>

        <section className="interest-content">
          <p className="step-label">STEP 1 OF 3</p>

          <h1>
            What moves
            <span> your world?</span>
          </h1>

          <p className="page-description">
            Pick the topics you care about. Your daily briefing will be created
            around your choices.
          </p>

          <div className="interest-grid">
            {availableInterests.map(({ name, description, icon: Icon }) => {
              const isSelected = selectedInterests.includes(name);

              return (
                <button
                  key={name}
                  type="button"
                  className={`interest-card ${
                    isSelected ? "interest-card--selected" : ""
                  }`}
                  onClick={() => toggleInterest(name)}
                  aria-pressed={isSelected}
                >
                  <span className="interest-card__icon">
                    <Icon size={22} />
                  </span>

                  <span className="interest-card__text">
                    <strong>{name}</strong>
                    <small>{description}</small>
                  </span>

                  <span className="interest-card__check">
                    {isSelected ? "✓" : "+"}
                  </span>
                </button>
              );
            })}
          </div>

          <p className="selection-count">{selectedInterests.length} selected</p>

          {error && (
            <p className="form-error" role="alert">
              {error}
            </p>
          )}

          <button
            type="button"
            className="primary-button"
            onClick={handleContinue}
            disabled={isSaving}
          >
            {isSaving ? "Saving..." : "Continue to your briefing →"}
          </button>
        </section>
      </div>
    </main>
  );
}
