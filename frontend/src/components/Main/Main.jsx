import "./Main.css";

const features = [
  "Reusable React component structure",
  "Dedicated backend login route",
  "Simple client-to-server integration",
];

export default function Main({
  form,
  onChange,
  onSubmit,
  onTogglePassword,
  onSocialEnter,
  loginState,
  serverStatus,
  showPassword,
  usersState,
}) {
  return (
    <main className="main-content">
      <section className="hero-panel">
        <div className="hero-panel__copy">
          <p className="hero-panel__label">Frontend + Backend</p>
          <h2>One landing page with a working login request to your Node server.</h2>
          <p className="hero-panel__description">
            The frontend now has separate Header, Main, and Footer components with
            their own styles, and the backend responds to real API requests.
          </p>

          <ul className="hero-panel__list">
            {features.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>

          <div className="hero-panel__server-card">
            <span>Backend detail</span>
            <strong>{serverStatus.detail || "Waiting for server response..."}</strong>
          </div>

          <div className="hero-panel__users-card">
            <div className="hero-panel__users-header">
              <span>SQL users</span>
              <strong>{usersState.loading ? "Loading..." : `${usersState.users.length} records`}</strong>
            </div>

            {usersState.error ? <p className="hero-panel__users-error">{usersState.error}</p> : null}

            {!usersState.error ? (
              <ul className="hero-panel__users-list">
                {usersState.users.map((user) => (
                  <li key={user.id}>
                    <strong>{user.name}</strong>
                    <span>{user.email}</span>
                    <span>{user.role}</span>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </div>

        <div className="login-card">
          <p className="login-card__eyebrow">Welcome</p>
          <h3>Log in with your own data</h3>

          <form className="login-form" onSubmit={onSubmit}>
            <label className="login-form__field">
              <span>Name</span>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={onChange}
                required
              />
            </label>

            <label className="login-form__field">
              <span>Email</span>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={onChange}
                required
              />
            </label>

            <label className="login-form__field">
              <span>Password</span>
              <div className="login-form__password-row">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={onChange}
                  required
                />
                <button
                  className="login-form__toggle"
                  type="button"
                  onClick={onTogglePassword}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </label>

            <button className="login-form__button" type="submit" disabled={loginState.loading}>
              {loginState.loading ? "Signing in..." : "Log In"}
            </button>
          </form>

          {loginState.error ? <p className="login-card__message is-error">{loginState.error}</p> : null}
          {loginState.success ? (
            <p className="login-card__message is-success">
              {loginState.success}
              {loginState.user ? ` Welcome, ${loginState.user.name}.` : ""}
            </p>
          ) : null}

          <div className="login-card__social">
            <button
              className="login-card__social-button"
              type="button"
              aria-label="Continue with Google"
              onClick={() => onSocialEnter("Google")}
            >
              <span className="login-card__social-icon">G</span>
              <span>Google</span>
            </button>
            <button
              className="login-card__social-button"
              type="button"
              aria-label="Continue with Apple"
              onClick={() => onSocialEnter("Apple")}
            >
              <span className="login-card__social-icon">A</span>
              <span>Apple</span>
            </button>
            <button
              className="login-card__social-button"
              type="button"
              aria-label="Continue with Facebook"
              onClick={() => onSocialEnter("Facebook")}
            >
              <span className="login-card__social-icon">F</span>
              <span>Facebook</span>
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
