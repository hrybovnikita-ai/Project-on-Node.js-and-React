import "./Header.css";

export default function Header({ serverStatus, theme, onToggleTheme }) {
  return (
    <header className="site-header">
      <div className="site-header__brand">
        <p className="site-header__eyebrow">Full Stack Control Center</p>
        <h1>Modern frontend, backend, database, and motion in one flow.</h1>
      </div>

      <div className="site-header__controls">
        <button className="site-header__theme" type="button" onClick={onToggleTheme}>
          {theme === "dark" ? "Light Theme" : "Dark Theme"}
        </button>

        <div className="site-header__status">
          <span
            className={`site-header__dot ${serverStatus.loading ? "is-loading" : "is-ready"}`}
            aria-hidden="true"
          />
          <div>
            <p className="site-header__status-label">API status</p>
            <strong>{serverStatus.message}</strong>
          </div>
        </div>
      </div>
    </header>
  );
}
