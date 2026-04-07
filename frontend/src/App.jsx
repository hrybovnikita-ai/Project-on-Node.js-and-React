import { useEffect, useState } from "react";
import Header from "./components/Header/Header";
import Main from "./components/Main/Main";
import Footer from "./components/Footer/Footer";
import PortalPage from "./components/PortalPage/PortalPage";
import { fetchProjects, fetchServerStatus, fetchUsers, loginUser } from "./services/api";
import "./App.css";

const initialForm = {
  name: "",
  email: "",
  password: "",
};

export default function App() {
  const [form, setForm] = useState(initialForm);
  const [showPassword, setShowPassword] = useState(false);
  const [currentPage, setCurrentPage] = useState("landing");
  const [selectedProvider, setSelectedProvider] = useState("");
  const [theme, setTheme] = useState("dark");
  const [serverStatus, setServerStatus] = useState({
    loading: true,
    message: "Connecting to server...",
    detail: "",
  });
  const [loginState, setLoginState] = useState({
    loading: false,
    error: "",
    success: "",
    user: null,
  });
  const [usersState, setUsersState] = useState({
    loading: true,
    error: "",
    users: [],
  });
  const [projectsState, setProjectsState] = useState({
    loading: true,
    error: "",
    projects: [],
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  useEffect(() => {
    let active = true;

    async function loadData() {
      const [statusResult, usersResult, projectsResult] = await Promise.allSettled([
        fetchServerStatus(),
        fetchUsers(),
        fetchProjects(),
      ]);

      if (!active) {
        return;
      }

      if (statusResult.status === "fulfilled") {
        const data = statusResult.value;

        setServerStatus({
          loading: false,
          message: data.message,
          detail: `Server time: ${new Date(data.timestamp).toLocaleString()} | Database: ${data.database.type} | Users: ${data.database.users} | Projects: ${data.database.projects}`,
        });
      } else {
        setServerStatus({
          loading: false,
          message: "Backend connection failed",
          detail: statusResult.reason.message,
        });
      }

      if (usersResult.status === "fulfilled") {
        setUsersState({
          loading: false,
          error: "",
          users: usersResult.value.users,
        });
      } else {
        setUsersState({
          loading: false,
          error: usersResult.reason.message,
          users: [],
        });
      }

      if (projectsResult.status === "fulfilled") {
        setProjectsState({
          loading: false,
          error: "",
          projects: projectsResult.value.projects,
        });
      } else {
        setProjectsState({
          loading: false,
          error: projectsResult.reason.message,
          projects: [],
        });
      }
    }

    loadData();

    return () => {
      active = false;
    };
  }, []);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  function handleSocialEnter(provider) {
    setSelectedProvider(provider);
    setCurrentPage("portal");
  }

  function handleSignOut() {
    setCurrentPage("landing");
    setSelectedProvider("");
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setLoginState({
      loading: true,
      error: "",
      success: "",
      user: null,
    });

    try {
      const data = await loginUser(form);

      setLoginState({
        loading: false,
        error: "",
        success: data.message,
        user: data.user,
      });
      setForm(initialForm);
      setShowPassword(false);
      const usersData = await fetchUsers();
      const projectsData = await fetchProjects();
      const statusData = await fetchServerStatus();

      setUsersState({
        loading: false,
        error: "",
        users: usersData.users,
      });

      setProjectsState({
        loading: false,
        error: "",
        projects: projectsData.projects,
      });

      setServerStatus({
        loading: false,
        message: statusData.message,
        detail: `Server time: ${new Date(statusData.timestamp).toLocaleString()} | Database: ${statusData.database.type} | Users: ${statusData.database.users} | Projects: ${statusData.database.projects}`,
      });
    } catch (error) {
      setLoginState({
        loading: false,
        error: error.message,
        success: "",
        user: null,
      });
    }
  }

  if (currentPage === "portal") {
    return (
      <div className={`app-shell app-shell--portal app-shell--${theme}`}>
        <PortalPage
          currentUser={loginState.user}
          provider={selectedProvider}
          onSignOut={handleSignOut}
          serverStatus={serverStatus}
          usersState={usersState}
          projectsState={projectsState}
          theme={theme}
          onToggleTheme={() => setTheme((current) => (current === "dark" ? "light" : "dark"))}
        />
      </div>
    );
  }

  return (
    <div className={`app-shell app-shell--${theme}`}>
      <Header
        serverStatus={serverStatus}
        theme={theme}
        onToggleTheme={() => setTheme((current) => (current === "dark" ? "light" : "dark"))}
      />
      <Main
        form={form}
        onChange={handleChange}
        onSubmit={handleSubmit}
        loginState={loginState}
        serverStatus={serverStatus}
        usersState={usersState}
        projectsState={projectsState}
        showPassword={showPassword}
        onTogglePassword={() => setShowPassword((current) => !current)}
        onSocialEnter={handleSocialEnter}
      />
      <Footer />
    </div>
  );
}
