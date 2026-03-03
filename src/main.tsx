import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { Provider } from "react-redux";
import store from "./store/store.ts";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Protected from "./components/auth/Protected.tsx";
import Home from "./pages/Home.tsx";
import LoginPage from "./pages/LoginPage.tsx";
import AllPostPage from "./pages/AllPostPage.tsx";
import AddPostPage from "./pages/AddPostPage.tsx";
import EditPostPage from "./pages/EditPostPage.tsx";
import PostPage from "./pages/PostPage.tsx";
import NotFoundPage from "./pages/NotFoundPage.tsx";
import SignupPage from "./pages/SignupPage.tsx";

createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<Home />} />


          <Route
            path="all-posts"
            element={
              <Protected>
                <AllPostPage />
              </Protected>
            }
          />

          <Route
            path="add-post"
            element={
              <Protected>
                <AddPostPage />
              </Protected>
            }
          />

          <Route
            path="edit-post/:slug"
            element={
              <Protected>
                <EditPostPage />
              </Protected>
            }
          />

          {/* Public */}
          <Route path="post/:slug" element={<Protected>
            <PostPage />
          </Protected>} />
        </Route>

          <Route
            path="login"
            element={
              <Protected authentication={false}>
                <LoginPage />
              </Protected>
            }
          />

          <Route
            path="signup"
            element={
              <Protected authentication={false}>
                <SignupPage />
              </Protected>
            }
          />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  </Provider>,
);
