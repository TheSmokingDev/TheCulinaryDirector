import { App as AntApp, ConfigProvider } from "antd";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./auth/AuthProvider";
import ProtectedRoute from "./auth/ProtectedRoute";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ToolResolverPage from "./pages/ToolResolverPage";
import ToolsHomePage from "./pages/ToolsHomePage";
import { theme } from "./theme/theme";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, refetchOnWindowFocus: false },
  },
});

export default function App() {
  return (
    <ConfigProvider theme={theme}>
      <AntApp>
        <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<ToolsHomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route element={<ProtectedRoute />}>
                <Route path="/tools/:slug" element={<ToolResolverPage />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </AuthProvider>
        </QueryClientProvider>
      </AntApp>
    </ConfigProvider>
  );
}
