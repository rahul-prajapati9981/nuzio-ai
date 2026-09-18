import { useCallback, useEffect, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Headphones,
  LogOut,
  Pause,
  Play,
  RotateCcw,
  Volume2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import BrandLogo from "../components/BrandLogo";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import type { NewsArticle, PersonalizedNewsResponse } from "../types";

export default function NewsPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [error, setError] = useState("");

  const currentArticle = articles[currentIndex];

  const stopSpeaking = useCallback(() => {
    window.speechSynthesis.cancel();
    setIsPlaying(false);
    setIsPaused(false);
  }, []);

  useEffect(() => {
    const loadNews = async () => {
      try {
        const response =
          await api.get<PersonalizedNewsResponse>("/news/personalized");

        setArticles(response.data.articles);
      } catch {
        setError("We could not load your personalized briefing.");
      } finally {
        setIsLoading(false);
      }
    };

    loadNews();

    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  useEffect(() => {
    stopSpeaking();
  }, [currentIndex, stopSpeaking]);

  const startSpeaking = () => {
    if (!currentArticle) {
      return;
    }

    if (isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
      setIsPlaying(true);
      return;
    }

    window.speechSynthesis.cancel();

    const spokenText = `${currentArticle.title}. ${currentArticle.summary}. ${currentArticle.content}`;

    const speech = new SpeechSynthesisUtterance(spokenText);

    speech.rate = 0.95;
    speech.pitch = 1;
    speech.volume = 1;

    const voices = window.speechSynthesis.getVoices();
    const englishVoice = voices.find((voice) =>
      voice.lang.toLowerCase().startsWith("en"),
    );

    if (englishVoice) {
      speech.voice = englishVoice;
    }

    speech.onstart = () => {
      setIsPlaying(true);
      setIsPaused(false);
    };

    speech.onend = () => {
      setIsPlaying(false);
      setIsPaused(false);
    };

    speech.onerror = () => {
      setIsPlaying(false);
      setIsPaused(false);
    };

    window.speechSynthesis.speak(speech);
  };

  const pauseSpeaking = () => {
    window.speechSynthesis.pause();
    setIsPlaying(false);
    setIsPaused(true);
  };

  const togglePlayback = () => {
    if (isPlaying) {
      pauseSpeaking();
    } else {
      startSpeaking();
    }
  };

  const playPrevious = () => {
    setCurrentIndex((current) =>
      current === 0 ? articles.length - 1 : current - 1,
    );
  };

  const playNext = () => {
    setCurrentIndex((current) =>
      current === articles.length - 1 ? 0 : current + 1,
    );
  };

  const handleLogout = () => {
    stopSpeaking();
    logout();
    navigate("/login");
  };

  if (isLoading) {
    return (
      <main className="loading-screen">
        <BrandLogo />
        <div className="loading-spinner" />
        <p>Preparing your daily briefing...</p>
      </main>
    );
  }

  if (error || !currentArticle) {
    return (
      <main className="loading-screen">
        <BrandLogo />
        <p className="form-error">
          {error || "No news articles are available."}
        </p>

        <button
          className="primary-button small-button"
          onClick={() => navigate("/interests")}
        >
          Select interests
        </button>
      </main>
    );
  }

  return (
    <main className="news-page">
      <header className="news-header">
        <BrandLogo compact />

        <div className="news-header__actions">
          <button
            type="button"
            className="icon-button"
            onClick={() => navigate("/interests")}
            aria-label="Change interests"
            title="Change interests"
          >
            <RotateCcw size={18} />
          </button>

          <button type="button" className="profile-button" title={user?.name}>
            {user?.name?.charAt(0).toUpperCase() || "U"}
          </button>

          <button
            type="button"
            className="icon-button"
            onClick={handleLogout}
            aria-label="Log out"
            title="Log out"
          >
            <LogOut size={18} />
          </button>
        </div>
      </header>

      <div className="news-layout">
        <section className="briefing-panel">
          <div className="briefing-greeting">
            <p className="eyebrow">YOUR PERSONALIZED BRIEFING</p>

            <h1>
              Good morning,
              <span> {user?.name?.split(" ")[0]}.</span>
            </h1>

            <p>{articles.length} stories selected from your interests.</p>
          </div>

          <article className="player-card">
            <div className="player-card__image-wrapper">
              <img
                src={currentArticle.image}
                alt=""
                className="player-card__image"
              />

              <span className="category-badge">{currentArticle.category}</span>
            </div>

            <div className="player-card__content">
              <div className="article-meta">
                <span>{currentArticle.source}</span>
                <span>•</span>
                <span>{currentArticle.publishedAt}</span>
                <span>•</span>
                <span>{currentArticle.duration}</span>
              </div>

              <h2>{currentArticle.title}</h2>
              <p>{currentArticle.summary}</p>

              <div className="fake-waveform">
                {[
                  18, 32, 22, 44, 28, 54, 36, 48, 26, 58, 34, 42, 20, 50, 30,
                  46, 24, 38, 18, 30,
                ].map((height, index) => (
                  <span key={index} style={{ height: `${height}px` }} />
                ))}
              </div>

              <div className="player-controls">
                <button
                  type="button"
                  className="player-secondary-button"
                  onClick={playPrevious}
                  aria-label="Previous story"
                >
                  <ChevronLeft size={22} />
                </button>

                <button
                  type="button"
                  className="play-button"
                  onClick={togglePlayback}
                  aria-label={isPlaying ? "Pause news" : "Play news"}
                >
                  {isPlaying ? (
                    <Pause size={28} fill="currentColor" />
                  ) : (
                    <Play size={28} fill="currentColor" />
                  )}
                </button>

                <button
                  type="button"
                  className="player-secondary-button"
                  onClick={playNext}
                  aria-label="Next story"
                >
                  <ChevronRight size={22} />
                </button>
              </div>

              <div className="listening-status">
                <Volume2 size={15} />

                <span>
                  {isPlaying
                    ? "Now playing"
                    : isPaused
                      ? "Playback paused"
                      : "Ready to listen"}
                </span>

                <span>
                  {currentIndex + 1} / {articles.length}
                </span>
              </div>
            </div>
          </article>
        </section>

        <aside className="story-list-panel">
          <div className="story-list-panel__header">
            <div>
              <p className="step-label">UP NEXT</p>
              <h2>Your briefing</h2>
            </div>

            <Headphones size={24} />
          </div>

          <div className="story-list">
            {articles.map((article, index) => (
              <button
                key={article.id}
                type="button"
                className={`story-item ${
                  index === currentIndex ? "story-item--active" : ""
                }`}
                onClick={() => setCurrentIndex(index)}
              >
                <img src={article.image} alt="" />

                <span className="story-item__content">
                  <small>{article.category}</small>
                  <strong>{article.title}</strong>

                  <span>
                    {article.source} · {article.duration}
                  </span>
                </span>

                <span className="story-item__number">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </button>
            ))}
          </div>
        </aside>
      </div>
    </main>
  );
}
