import { useEffect, useMemo, useState } from "react";
import "./App.css";

const categories = [
  { name: "Vehicles", icon: "🚗" },
  { name: "Property", icon: "🏠" },
  { name: "Electronics", icon: "📱" },
  { name: "Home & living", icon: "🛋️" },
  { name: "Fashion", icon: "👗" },
  { name: "Books & sports", icon: "⚽" },
  { name: "Kids", icon: "🧸" },
  { name: "Jobs", icon: "💼" },
];

const sampleListings = [
  {
    _id: "1",
    title: "Honda Civic Oriel 2021 — immaculate condition",
    price: 6850000,
    city: "Lahore",
    category: "Vehicles",
    image:
      "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=900&q=80",
    createdAt: "Today",
  },
  {
    _id: "2",
    title: "Minimal two-bedroom apartment in DHA",
    price: 18500000,
    city: "Karachi",
    category: "Property",
    image:
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=900&q=80",
    createdAt: "Today",
  },
  {
    _id: "3",
    title: "iPhone 15 Pro · 256GB · Natural titanium",
    price: 285000,
    city: "Islamabad",
    category: "Electronics",
    image:
      "https://images.unsplash.com/photo-1696446701796-da61225697cc?auto=format&fit=crop&w=900&q=80",
    createdAt: "Yesterday",
  },
  {
    _id: "4",
    title: "Handcrafted solid walnut lounge chair",
    price: 79500,
    city: "Lahore",
    category: "Home & living",
    image:
      "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=900&q=80",
    createdAt: "Today",
  },
  {
    _id: "5",
    title: "MacBook Air M2 · 8GB RAM · 256GB SSD",
    price: 235000,
    city: "Rawalpindi",
    category: "Electronics",
    image:
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=900&q=80",
    createdAt: "2 days ago",
  },
  {
    _id: "6",
    title: "Sunny upper portion with a private terrace",
    price: 92000,
    city: "Islamabad",
    category: "Property",
    image:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=900&q=80",
    createdAt: "Today",
  },
  {
    _id: "7",
    title: "Vintage film camera · fully serviced",
    price: 42000,
    city: "Karachi",
    category: "Electronics",
    image:
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=900&q=80",
    createdAt: "Yesterday",
  },
  {
    _id: "8",
    title: "Classic leather weekend travel bag",
    price: 12800,
    city: "Lahore",
    category: "Fashion",
    image:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=80",
    createdAt: "3 days ago",
  },
];

const money = (amount) => `Rs ${Number(amount).toLocaleString("en-PK")}`;
const listingDate = (value) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value || "Today";
  const days = Math.floor((Date.now() - date.getTime()) / 86_400_000);
  if (days < 1) return "Today";
  if (days < 2) return "Yesterday";
  return `${days} days ago`;
};

function Icon({ name, size = 20, className = "" }) {
  const paths = {
    search: (
      <>
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-4-4" />
      </>
    ),
    pin: (
      <>
        <path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" />
        <circle cx="12" cy="10" r="2.5" />
      </>
    ),
    heart: (
      <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z" />
    ),
    chat: (
      <>
        <path d="M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.4 8.4 0 0 1 3.8-.9h.5a8.5 8.5 0 0 1 8 8Z" />
      </>
    ),
    user: (
      <>
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </>
    ),
    arrow: (
      <>
        <path d="M7 17 17 7" />
        <path d="M7 7h10v10" />
      </>
    ),
    close: (
      <>
        <path d="m18 6-12 12M6 6l12 12" />
      </>
    ),
    camera: (
      <>
        <path d="M14 5h-4L8 8H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-9a2 2 0 0 0-2-2h-3z" />
        <circle cx="12" cy="14" r="3" />
      </>
    ),
    chevron: <path d="m9 18 6-6-6-6" />,
    menu: (
      <>
        <path d="M4 6h16M4 12h16M4 18h16" />
      </>
    ),
    sparkle: (
      <>
        <path d="m12 3 1.9 5.8L20 11l-6.1 2.2L12 19l-2-5.8L4 11l6-2.2L12 3Z" />
        <path d="m19 14 1.2 2.8L23 18l-2.8 1.2L19 22l-1.2-2.8L15 18l2.8-1.2L19 14Z" />
      </>
    ),
  };

  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  );
}

function ListingCard({ item, favorite, onFavorite }) {
  return (
    <article className="listing-card">
      <div className="listing-photo">
        {item.image ? (
          <img
            src={
              item.image.startsWith("/uploads/")
                ? `${import.meta.env.VITE_API_URL || "http://localhost:5000"}${item.image}`
                : item.image
            }
            alt={item.title}
            loading="lazy"
          />
        ) : (
          <div className="listing-placeholder">
            <Icon name="camera" size={30} />
          </div>
        )}
        <span className="photo-tag">JUST LISTED</span>
        <button
          className={`favorite-button ${favorite ? "is-favorite" : ""}`}
          type="button"
          aria-label={favorite ? "Remove from saved items" : "Save this item"}
          onClick={() => onFavorite(item._id)}
        >
          <Icon name="heart" size={19} />
        </button>
      </div>
      <div className="listing-copy">
        <p className="listing-price">{money(item.price)}</p>
        <h3>{item.title}</h3>
        <div className="listing-meta">
          <span>{item.city}</span>
          <span>{listingDate(item.createdAt)}</span>
        </div>
      </div>
    </article>
  );
}

function Dialog({ title, onClose, children, wide = false }) {
  useEffect(() => {
    const closeOnEscape = (event) => event.key === "Escape" && onClose();
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [onClose]);

  return (
    <div
      className="dialog-backdrop"
      role="presentation"
      onMouseDown={(event) => event.target === event.currentTarget && onClose()}
    >
      <section
        className={`dialog ${wide ? "dialog-wide" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <div className="dialog-heading">
          <div>
            <span className="eyebrow">GOOD THINGS FIND NEW HOMES</span>
            <h2>{title}</h2>
          </div>
          <button
            className="icon-button"
            type="button"
            aria-label="Close dialog"
            onClick={onClose}
          >
            <Icon name="close" />
          </button>
        </div>
        {children}
      </section>
    </div>
  );
}

function App() {
  const [listings, setListings] = useState(sampleListings);
  const [apiAvailable, setApiAvailable] = useState(false);
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [favorites, setFavorites] = useState([]);
  const [dialog, setDialog] = useState("");
  const [authMode, setAuthMode] = useState("register");
  const [token, setToken] = useState(
    () => localStorage.getItem("bazaar-token") || "",
  );
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("bazaar-user") || "null");
    } catch {
      return null;
    }
  });
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState("");
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

  useEffect(
    () => () => {
      if (photoPreview) URL.revokeObjectURL(photoPreview);
    },
    [photoPreview],
  );

  const choosePhoto = (event) => {
    const selectedPhoto = event.target.files?.[0] || null;
    setPhoto(selectedPhoto);
    setPhotoPreview(selectedPhoto ? URL.createObjectURL(selectedPhoto) : "");
  };

  useEffect(() => {
    const loadListings = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/listings`);
        if (!response.ok)
          throw new Error("Could not load listings from the marketplace API.");
        const data = await response.json();
        if (Array.isArray(data.listings)) setListings(data.listings);
        setApiAvailable(true);
      } catch (error) {
        setApiAvailable(false);
        console.info(
          "Showing sample listings because the marketplace API is not connected.",
          error,
        );
      }
    };
    loadListings();
  }, [apiUrl]);

  const visibleListings = useMemo(
    () =>
      listings.filter((item) => {
        const matchesCategory =
          activeCategory === "All" || item.category === activeCategory;
        const words =
          `${item.title} ${item.city} ${item.category}`.toLowerCase();
        const matchesSearch = words.includes(query.trim().toLowerCase());
        const matchesLocation =
          !location.trim() ||
          item.city.toLowerCase().includes(location.trim().toLowerCase());
        return matchesCategory && matchesSearch && matchesLocation;
      }),
    [activeCategory, listings, location, query],
  );

  const toggleFavorite = (id) =>
    setFavorites((saved) =>
      saved.includes(id)
        ? saved.filter((value) => value !== id)
        : [...saved, id],
    );

  const search = (event) => {
    event.preventDefault();
    document.querySelector("#discover")?.scrollIntoView({ behavior: "smooth" });
  };

  const authenticate = async (event) => {
    event.preventDefault();
    setBusy(true);
    setNotice("");
    const form = new FormData(event.currentTarget);
    const payload = Object.fromEntries(form.entries());
    try {
      const response = await fetch(`${apiUrl}/api/auth/${authMode}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok)
        throw new Error(
          data.message || "We could not sign you in. Please try again.",
        );
      localStorage.setItem("bazaar-token", data.token);
      localStorage.setItem("bazaar-user", JSON.stringify(data.user));
      setToken(data.token);
      setUser(data.user);
      setNotice("");
      setDialog("");
    } catch (error) {
      setNotice(
        error instanceof TypeError
          ? "The marketplace API is unavailable. Start the API and try again."
          : error.message || "We could not sign you in. Please try again.",
      );
    } finally {
      setBusy(false);
    }
  };

  const publishListing = async (event) => {
    event.preventDefault();
    setBusy(true);
    setNotice("");
    const formData = new FormData(event.currentTarget);
    if (photo) formData.set("photo", photo);
    try {
      const response = await fetch(`${apiUrl}/api/listings`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.message || "Your listing could not be published.");
      setListings((current) => [data.listing, ...current]);
      setActiveCategory("All");
      setDialog("");
      setPhoto(null);
      setPhotoPreview("");
      setNotice("Your listing is live. Good luck finding it a new home!");
      document
        .querySelector("#discover")
        ?.scrollIntoView({ behavior: "smooth" });
    } catch (error) {
      setNotice(
        error instanceof TypeError
          ? "The marketplace API is unavailable. Start the API and try again."
          : error.message || "Your listing could not be published.",
      );
    } finally {
      setBusy(false);
    }
  };

  const beginSelling = () => {
    if (!token) {
      setAuthMode("register");
      setDialog("auth");
      setNotice(
        "Create an account or sign in before posting your first listing.",
      );
      return;
    }
    setNotice("");
    setDialog("listing");
  };

  const signOut = () => {
    localStorage.removeItem("bazaar-token");
    localStorage.removeItem("bazaar-user");
    setToken("");
    setUser(null);
    setNotice("You are signed out.");
  };

  return (
    <div className="app-shell min-h-screen">
      <header className="site-header">
        <div className="topbar">
          <a className="brand" href="#" aria-label="Bazaar home">
            <span className="brand-mark">
              <span />
              <span />
              <span />
              <span />
            </span>
            <span>
              bazaar<span className="brand-dot">.</span>
            </span>
          </a>
          <span className="header-note">A little closer to what you love.</span>
          <div className="header-actions">
            <button
              className="header-action saved-link"
              type="button"
              onClick={() => {
                setActiveCategory("All");
                document
                  .querySelector("#discover")
                  ?.scrollIntoView({ behavior: "smooth" });
                setNotice(
                  favorites.length
                    ? `You have ${favorites.length} saved ${favorites.length === 1 ? "item" : "items"} — look for the filled hearts.`
                    : "Tap a heart on any listing to save it for later.",
                );
              }}
            >
              <Icon name="heart" size={18} />{" "}
              <span>
                Saved{favorites.length ? ` (${favorites.length})` : ""}
              </span>
            </button>
            <button
              className="header-action"
              type="button"
              onClick={() => {
                setAuthMode("login");
                setNotice("");
                setDialog("auth");
              }}
            >
              <Icon name="user" size={18} />{" "}
              <span>{user?.name || "Log in"}</span>
            </button>
            {user && (
              <button
                className="signout-button"
                type="button"
                onClick={signOut}
              >
                Sign out
              </button>
            )}
            <button
              className="sell-button"
              type="button"
              onClick={beginSelling}
            >
              <span>＋</span> Sell an item
            </button>
          </div>
        </div>
        <form className="searchbar" onSubmit={search}>
          <label className="location-field">
            <Icon name="pin" />
            <input
              aria-label="Location"
              placeholder="All of Pakistan"
              value={location}
              onChange={(event) => setLocation(event.target.value)}
            />
            <Icon name="chevron" size={17} />
          </label>
          <label className="query-field">
            <Icon name="search" />
            <input
              aria-label="Search listings"
              placeholder="Find your next favourite thing..."
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
            <button type="submit">Search</button>
          </label>
        </form>
        <nav className="category-nav" aria-label="Marketplace categories">
          <button
            className={activeCategory === "All" ? "nav-active" : ""}
            type="button"
            onClick={() => setActiveCategory("All")}
          >
            Explore all
          </button>
          {categories.map((category) => (
            <button
              className={activeCategory === category.name ? "nav-active" : ""}
              type="button"
              key={category.name}
              onClick={() => {
                setActiveCategory(category.name);
                document
                  .querySelector("#discover")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              {category.name}
            </button>
          ))}
        </nav>
      </header>

      <main>
        <section className="hero">
          <div className="hero-content">
            <span className="hero-kicker">
              <Icon name="sparkle" size={15} /> MAKE ROOM FOR SOMETHING GOOD
            </span>
            <h1>
              One person’s <span>not anymore</span> is your new{" "}
              <em>can’t live without.</em>
            </h1>
            <p>
              From your neighbourhood to the whole country — find lovely things
              looking for a new home.
            </p>
            <button className="hero-cta" type="button" onClick={beginSelling}>
              Find a new home for your things <Icon name="arrow" size={17} />
            </button>
            <div className="hero-social-proof">
              <div className="avatar-stack">
                <span>A</span>
                <span>F</span>
                <span>S</span>
              </div>
              <span>Good finds. Good people. All across Pakistan.</span>
            </div>
          </div>
          <div className="hero-visual" aria-label="A sunlit, cozy living room">
            <img
              src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1300&q=85"
              alt="Sunlit living room with modern furniture"
            />
            <div className="hero-photo-note">
              <span className="note-heart">♥</span>
              <span>
                Found a new favourite<small>Sometimes it just clicks.</small>
              </span>
              <span className="note-arrow">
                <Icon name="arrow" size={16} />
              </span>
            </div>
            <div className="floating-stamp">
              GOOD
              <br />
              THINGS
              <br />
              <span>
                LIVE
                <br />
                HERE
              </span>
            </div>
          </div>
        </section>

        <section className="category-section" aria-labelledby="category-title">
          <div className="section-heading category-heading">
            <div>
              <span className="eyebrow">A WORLD OF GOOD FINDS</span>
              <h2 id="category-title">What are you in the mood for?</h2>
            </div>
            <span className="category-caption">
              A little something for every something.
            </span>
          </div>
          <div className="category-grid">
            {categories.map((category, index) => (
              <button
                className={`category-tile category-tone-${index}`}
                type="button"
                key={category.name}
                onClick={() => {
                  setActiveCategory(category.name);
                  document
                    .querySelector("#discover")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                <span className="category-icon">{category.icon}</span>
                <span>{category.name}</span>
                <Icon name="arrow" size={15} className="category-arrow" />
              </button>
            ))}
          </div>
        </section>

        <section className="discover-section" id="discover">
          <div className="section-heading discover-heading">
            <div>
              <span className="eyebrow">PICKED JUST FOR YOU</span>
              <h2>
                {activeCategory === "All"
                  ? "A few lovely finds"
                  : `Lovely finds in ${activeCategory}`}
              </h2>
              <p className="section-subtitle">
                The best things don’t stay available for long.
              </p>
            </div>
            <button
              className="text-link"
              type="button"
              onClick={() => {
                setActiveCategory("All");
                setQuery("");
                setLocation("");
              }}
            >
              See everything <Icon name="arrow" size={16} />
            </button>
          </div>
          {notice && !dialog && (
            <div className="inline-notice" role="status">
              {notice}
              <button
                type="button"
                aria-label="Dismiss notice"
                onClick={() => setNotice("")}
              >
                <Icon name="close" size={16} />
              </button>
            </div>
          )}
          {!apiAvailable && (
            <div className="preview-message">
              <Icon name="sparkle" size={17} />
              <span>
                Showing a preview of local finds.{" "}
                <button type="button" onClick={beginSelling}>
                  Connect your account and database to list an item.
                </button>
              </span>
            </div>
          )}
          <div className="listing-grid">
            {visibleListings.map((item) => (
              <ListingCard
                item={item}
                key={item._id}
                favorite={favorites.includes(item._id)}
                onFavorite={toggleFavorite}
              />
            ))}
          </div>
          {visibleListings.length === 0 && (
            <div className="empty-state">
              <span>✳</span>
              <h3>No finds just yet.</h3>
              <p>Try another search or explore all the lovely things.</p>
              <button
                className="outline-button"
                type="button"
                onClick={() => {
                  setQuery("");
                  setLocation("");
                  setActiveCategory("All");
                }}
              >
                Show me everything
              </button>
            </div>
          )}
          {visibleListings.length > 0 && (
            <button
              className="load-more"
              type="button"
              onClick={() => {
                setQuery("");
                setLocation("");
                setActiveCategory("All");
                setNotice("You’re all caught up on today’s preview finds!");
              }}
            >
              That’s all for now <span>✳</span>
            </button>
          )}
        </section>

        <section className="sell-banner">
          <div className="sell-banner-icon">✳</div>
          <div>
            <span className="eyebrow">YOUR NEXT CHAPTER STARTS HERE</span>
            <h2>Good things deserve a second life.</h2>
            <p>That chair you’ve outgrown? Someone else’s new favourite.</p>
          </div>
          <button type="button" onClick={beginSelling}>
            List something lovely <Icon name="arrow" size={17} />
          </button>
          <span className="banner-decoration">✳</span>
        </section>
      </main>

      <footer className="site-footer">
        <a className="brand footer-brand" href="#">
          <span className="brand-mark">
            <span />
            <span />
            <span />
            <span />
          </span>
          <span>
            bazaar<span className="brand-dot">.</span>
          </span>
        </a>
        <span>
          A little closer to what you love.{" "}
          <span className="footer-dot">✳</span> Made for Pakistan.
        </span>
        <span className="footer-links">
          <a href="#discover">Explore</a>
          <button type="button" onClick={beginSelling}>
            Sell with us
          </button>
          <a href="mailto:hello@bazaar.example">Say hello</a>
        </span>
        <span className="copyright">
          © 2025 Bazaar. Good things, passed on.
        </span>
      </footer>

      {dialog === "auth" && (
        <Dialog
          title={
            authMode === "register" ? "Come on in." : "Lovely to see you again."
          }
          onClose={() => {
            setDialog("");
            setNotice("");
          }}
        >
          <p className="dialog-intro">
            {authMode === "register"
              ? "Create an account to find your next favourite — or pass something wonderful along."
              : "Sign in to pick up where you left off."}
          </p>
          <form className="dialog-form" onSubmit={authenticate}>
            {authMode === "register" && (
              <label>
                Your name
                <input
                  name="name"
                  type="text"
                  autoComplete="name"
                  placeholder="What should we call you?"
                  minLength="2"
                  maxLength="60"
                  required
                />
              </label>
            )}
            <label>
              Email address
              <input
                name="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                maxLength="254"
                required
              />
            </label>
            <label>
              Password
              <input
                name="password"
                type="password"
                autoComplete={
                  authMode === "register" ? "new-password" : "current-password"
                }
                placeholder="At least 8 characters"
                minLength="8"
                required
              />
            </label>
            {notice && (
              <p className="form-notice" role="alert">
                {notice}
              </p>
            )}
            <button className="form-submit" type="submit" disabled={busy}>
              {busy
                ? "One moment…"
                : authMode === "register"
                  ? "Create my account"
                  : "Sign in"}
            </button>
          </form>
          <p className="switch-auth">
            {authMode === "register"
              ? "Already part of the neighbourhood?"
              : "New around here?"}{" "}
            <button
              type="button"
              onClick={() => {
                setAuthMode(authMode === "register" ? "login" : "register");
                setNotice("");
              }}
            >
              {authMode === "register" ? "Sign in" : "Create an account"}
            </button>
          </p>
        </Dialog>
      )}

      {dialog === "listing" && (
        <Dialog
          title="Give it a new home."
          onClose={() => {
            setDialog("");
            setNotice("");
            setPhoto(null);
            setPhotoPreview("");
          }}
          wide
        >
          <p className="dialog-intro">
            A few details are all it takes to find your thing a lovely new
            owner.
          </p>
          <form className="dialog-form listing-form" onSubmit={publishListing}>
            <label>
              What are you passing along?
              <input
                name="title"
                type="text"
                placeholder="e.g. A very loved, very comfy reading chair"
                minLength="5"
                maxLength="100"
                required
              />
            </label>
            <div className="form-row">
              <label>
                Category
                <select name="category" required defaultValue="">
                  <option value="" disabled>
                    Choose a category
                  </option>
                  {categories.map((category) => (
                    <option key={category.name} value={category.name}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Price (PKR)
                <input
                  name="price"
                  type="number"
                  placeholder="0"
                  min="1"
                  max="1000000000"
                  required
                />
              </label>
            </div>
            <div className="form-row">
              <label>
                Your city
                <select name="city" required defaultValue="">
                  <option value="" disabled>
                    Choose your city
                  </option>
                  {[
                    "Karachi",
                    "Lahore",
                    "Islamabad",
                    "Rawalpindi",
                    "Faisalabad",
                    "Peshawar",
                    "Quetta",
                    "Multan",
                    "Other",
                  ].map((city) => (
                    <option key={city}>{city}</option>
                  ))}
                </select>
              </label>
              <label>
                Short description
                <input
                  name="description"
                  type="text"
                  placeholder="What makes it special?"
                  maxLength="500"
                  required
                />
              </label>
            </div>
            <label className="photo-upload">
              <Icon name="camera" size={24} />
              <span>{photo ? photo.name : "Add a photo of your item"}</span>
              <small>
                {photo
                  ? "Click to choose another photo"
                  : "A bright photo helps the right person find you · up to 5 MB"}
              </small>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={choosePhoto}
              />
            </label>
            {photoPreview && (
              <img
                className="upload-preview"
                src={photoPreview}
                alt="Selected listing preview"
              />
            )}
            {notice && (
              <p className="form-notice" role="alert">
                {notice}
              </p>
            )}
            <button className="form-submit" type="submit" disabled={busy}>
              {busy ? "Finding its new home…" : "Publish my listing"}
            </button>
          </form>
        </Dialog>
      )}
    </div>
  );
}

export default App;
