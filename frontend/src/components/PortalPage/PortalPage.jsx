import { useEffect, useState } from "react";
import heroImage from "../../assets/hero.png";
import "./PortalPage.css";

const navItems = ["Overview", "Projects", "Reports", "Support"];

const quickStats = [
  { value: "24", label: "Live tasks" },
  { value: "87%", label: "Team progress" },
  { value: "12", label: "Open messages" },
];

const featureCards = [
  {
    title: "Creative Workspace",
    text: "Manage design tasks, launches, and team communication from one visual dashboard.",
  },
  {
    title: "Fast Team Updates",
    text: "Track new SQL users, backend health, and your current session in one screen.",
  },
  {
    title: "Flexible Layout",
    text: "Header, nav, cards, sections, image blocks, and footer are ready for more pages.",
  },
];

const sectionContent = {
  Overview: {
    eyebrow: "Main Section",
    title: "Build more pages, sections, and modules from this new screen.",
    text: "This page includes header, nav, action buttons, data cards, images, info sections, spans, and footer content so your site feels like a real multi-page project.",
  },
  Projects: {
    eyebrow: "Projects Page",
    title: "Project tracking opens like another page inside your portal.",
    text: "Use this section to show launches, active tasks, delivery dates, milestones, and the current work pipeline for your team.",
  },
  Reports: {
    eyebrow: "Reports Page",
    title: "Reports and analytics can open without leaving the portal.",
    text: "Show charts, performance notes, SQL summaries, user growth, and backend numbers in a structured dashboard view.",
  },
  Support: {
    eyebrow: "Support Page",
    title: "Support tools can appear instantly when a user clicks a button.",
    text: "Use this section for help center links, FAQ cards, tickets, chat shortcuts, and backend troubleshooting actions.",
  },
};

export default function PortalPage({
  currentUser,
  onSignOut,
  provider,
  serverStatus,
  usersState,
}) {
  const [activeSection, setActiveSection] = useState("Overview");
  const [flashMessage, setFlashMessage] = useState("");
  const userName = currentUser?.name || "Guest User";
  const providerName = provider || "Direct";
  const currentSection = sectionContent[activeSection];

  useEffect(() => {
    if (!flashMessage) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      setFlashMessage("");
    }, 2600);

    return () => window.clearTimeout(timeoutId);
  }, [flashMessage]);

  function showMessage(message) {
    setFlashMessage(message);
  }

  function openSection(sectionName) {
    setActiveSection(sectionName);
    showMessage(`Teleported to ${sectionName} page.`);
  }

  return (
    <main className="portal-page">
      {flashMessage ? (
        <div className="portal-toast" role="status" aria-live="polite">
          {flashMessage}
        </div>
      ) : null}

      <header className="portal-header">
        <div className="portal-header__brand">
          <span className="portal-header__badge">New Page</span>
          <h1>Welcome to your next-level workspace.</h1>
          <p>
            You teleported from the login card into a full page with navigation,
            cards, image sections, content blocks, and account actions.
          </p>
        </div>

        <div className="portal-header__actions">
          <div className="portal-header__account">
            <span className="portal-header__label">Signed in as</span>
            <strong>{userName}</strong>
            <span className="portal-header__provider">{providerName} access</span>
          </div>

          <button className="portal-header__logout" type="button" onClick={onSignOut}>
            Sign Out / Log Out
          </button>
        </div>
      </header>

      <nav className="portal-nav" aria-label="Primary">
        {navItems.map((item) => (
          <button
            key={item}
            className={`portal-nav__item ${activeSection === item ? "is-active" : ""}`}
            type="button"
            onClick={() => openSection(item)}
          >
            {item}
          </button>
        ))}
      </nav>

      <section className="portal-hero">
        <div className="portal-hero__content">
          <span className="portal-section__eyebrow">{currentSection.eyebrow}</span>
          <h2>{currentSection.title}</h2>
          <p>{currentSection.text}</p>

          <div className="portal-hero__stats">
            {quickStats.map((item) => (
              <div key={item.label} className="portal-stat">
                <strong>{item.value}</strong>
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="portal-hero__visual">
          <img src={heroImage} alt="Creative workspace preview" />
          <div className="portal-hero__floating-card">
            <span>Backend status</span>
            <strong>{serverStatus.message}</strong>
            <p>{serverStatus.detail}</p>
          </div>
        </div>
      </section>

      <section className="portal-grid">
        <div className="portal-panel portal-panel--wide">
          <span className="portal-section__eyebrow">Feature Cards</span>
          <div className="portal-cards">
            {featureCards.map((card) => (
              <article key={card.title} className="portal-card">
                <span className="portal-card__icon" aria-hidden="true">
                  +
                </span>
                <h3>{card.title}</h3>
                <p>{card.text}</p>
                <button
                  className="portal-card__button"
                  type="button"
                  onClick={() => showMessage(`${card.title} opened successfully.`)}
                >
                  Open Module
                </button>
              </article>
            ))}
          </div>
        </div>

        <aside className="portal-panel">
          <span className="portal-section__eyebrow">Session Box</span>
          <div className="portal-session">
            <div>
              <span className="portal-session__label">Current user</span>
              <strong>{userName}</strong>
            </div>
            <div>
              <span className="portal-session__label">Provider</span>
              <strong>{providerName}</strong>
            </div>
            <div>
              <span className="portal-session__label">SQL users</span>
              <strong>{usersState.users.length}</strong>
            </div>
          </div>
        </aside>
      </section>

      <section className="portal-sections">
        <article className="portal-panel">
          <span className="portal-section__eyebrow">Users</span>
          <h3>Database user preview</h3>
          <div className="portal-users">
            {usersState.users.slice(0, 4).map((user) => (
              <div key={user.id} className="portal-user">
                <span className="portal-user__avatar">{user.name.charAt(0)}</span>
                <div>
                  <strong>{user.name}</strong>
                  <p>{user.email}</p>
                </div>
                <span className="portal-user__role">{user.role}</span>
              </div>
            ))}
          </div>
        </article>

        <article className="portal-panel">
          <span className="portal-section__eyebrow">Media</span>
          <h3>Image and content section</h3>
          <div className="portal-media">
            <img src={heroImage} alt="Decorative team visual" />
            <div className="portal-media__content">
              <p>
                Use this section for product photos, blog previews, team stories,
                or service blocks on your next pages.
              </p>
              <button
                className="portal-media__button"
                type="button"
                onClick={() => showMessage("Gallery preview message opened.")}
              >
                Explore Gallery
              </button>
            </div>
          </div>
        </article>
      </section>

      <footer className="portal-footer">
        <div>
          <span className="portal-footer__label">Project footer</span>
          <p>Multi-section layout ready for more pages and components.</p>
        </div>
        <div className="portal-footer__links">
          <button type="button" onClick={() => showMessage("Privacy page message opened.")}>
            Privacy
          </button>
          <button type="button" onClick={() => showMessage("Contact page message opened.")}>
            Contact
          </button>
          <button type="button" onClick={() => openSection("Support")}>
            Help Center
          </button>
        </div>
      </footer>
    </main>
  );
}
