import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import {
  AuthProvider,
} from "./contexts/AuthContext";

import ProtectedRoute from "./components/common/ProtectedRoute";

import MainLayout from "./layouts/MainLayout";

/* AUTH PAGES */

import Login from "./pages/Login";
import Register from "./pages/Register";

/* EXISTING PAGES */

import Dashboard from "./pages/Dashboard";
import Chat from "./pages/Chat";
import Documents from "./pages/Documents";
import Graph from "./pages/Graph";
import Contradictions from "./pages/Contradictions";
import Study from "./pages/Study";
import Agents from "./pages/Agents";
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";
import Memory from "./pages/Memory";
import Profile from "./pages/Profile";

/* OPTIONAL PLACEHOLDER PAGES */

import PlaceholderPage from "./components/common/PlaceholderPage";

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>

          {/* PUBLIC ROUTES */}

          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/register"
            element={<Register />}
          />

          {/* PROTECTED ROUTES */}

          <Route
            path="/"
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          >
            {/* DEFAULT */}

            <Route
              index
              element={
                <Navigate
                  to="/dashboard"
                  replace
                />
              }
            />

            {/* EXISTING ROUTES */}

            <Route
              path="/dashboard"
              element={<Dashboard />}
            />

            <Route
              path="/chat"
              element={<Chat />}
            />

            <Route
              path="/documents"
              element={<Documents />}
            />

            <Route
              path="/graph"
              element={<Graph />}
            />

            <Route
              path="/contradictions"
              element={
                <Contradictions />
              }
            />

            <Route
              path="/study"
              element={<Study />}
            />

            <Route
              path="/agents"
              element={<Agents />}
            />

            <Route
              path="/analytics"
              element={<Analytics />}
            />

            <Route
              path="/settings"
              element={<Settings />}
            />

            <Route
              path="/memory"
              element={<Memory />}
            />

            <Route
              path="/profile"
              element={<Profile />}
            />

            {/* OPTIONAL */}

            <Route
              path="/research"
              element={
                <PlaceholderPage
                  title="Research"
                  emoji="🔎"
                />
              }
            />

            <Route
              path="/team"
              element={
                <PlaceholderPage
                  title="Team Workspace"
                  emoji="👥"
                />
              }
            />
          </Route>

          {/* FALLBACK */}

          <Route
            path="*"
            element={
              <Navigate
                to="/dashboard"
                replace
              />
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;