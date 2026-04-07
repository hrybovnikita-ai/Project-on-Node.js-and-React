import "./Main.css";

const features = [
  "Animated dashboard sections with responsive cards",
  "Dedicated backend routes for login, users, and projects",
  "SQLite-powered data shown directly in the interface",
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
  projectsState,
}) {
  const highlightedProjects = projectsState.projects.slice(0, 3);

  return (
    <main className="main-content">
      <section className="hero-panel">
        <div className="hero-panel__copy">
          <p className="hero-panel__label">Green Motion Dashboard</p>
          <h2>Dark lime frontend with animated cards and a real backend database.</h2>
          <p className="hero-panel__description">
            Your project now feels more like a product dashboard: darker visual style,
            glowing green accents, smoother motion, and live SQLite data for users and projects.
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

          <div className="hero-panel__data-grid">
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

            <div className="hero-panel__projects-card">
              <div className="hero-panel__users-header">
                <span>Active projects</span>
                <strong>{projectsState.loading ? "Loading..." : `${projectsState.projects.length} items`}</strong>
              </div>

              {projectsState.error ? <p className="hero-panel__users-error">{projectsState.error}</p> : null}

              {!projectsState.error ? (
                <ul className="hero-panel__projects-list">
                  {highlightedProjects.map((project) => (
                    <li key={project.id}>
                      <div>
                        <strong>{project.name}</strong>
                        <span>{project.owner}</span>
                      </div>
                      <b>{project.progress}%</b>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          </div>
        </div>

        <div className="login-card">
          <p className="login-card__eyebrow">Welcome</p>
          <h3>Log in and open the animated portal</h3>

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
