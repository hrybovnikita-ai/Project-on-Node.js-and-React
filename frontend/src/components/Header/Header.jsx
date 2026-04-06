import "./Header.css";

export default function Header({ serverStatus }) {
  return (
    <header className="site-header">
      <div className="site-header__brand">
        <p className="site-header__eyebrow">Full Stack Starter</p>
        <h1>Modern client and backend, connected in one flow.</h1>
      </div>

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
    </header>
  );
}
