import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/api";
import { setToken, setUser } from "../utils/auth";
import Button from "../components/Button";
import Input from "../components/Input";
import Card, { CardContent } from "../components/Card";
import Alert from "../components/Alert";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await authService.login(email, password);
      const { access_token, user } = response.data;

      setToken(access_token);
      setUser(user);

      if (user.role === "HR_ADMIN") {
        navigate("/hr-dashboard");
      } else {
        navigate("/employee-dashboard");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  const fillDemoCredentials = (role) => {
    if (role === "admin") {
      setEmail("admin@company.com");
      setPassword("password123");
    } else {
      setEmail("employee@company.com");
      setPassword("password123");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md" elevation={3}>
        <CardContent className="space-y-6">
          {/* Header */}
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              WFH Attendance System
            </h1>
            <p className="text-gray-600">Sign in to continue</p>
          </div>

          {/* Error Alert */}
          {error && (
            <Alert severity="error" onClose={() => setError("")}>
              {error}
            </Alert>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              fullWidth
              required
            />

            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              fullWidth
              required
            />

            <Button type="submit" fullWidth disabled={loading} className="mt-6">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="animate-spin h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Signing in...
                </span>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          {/* Demo Credentials */}
          <div className="pt-6 border-t border-gray-200">
            <p className="text-sm font-medium text-gray-700 mb-3 text-center">
              Quick Access Demo Accounts
            </p>
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outlined"
                size="small"
                onClick={() => fillDemoCredentials("admin")}
                fullWidth
              >
                <span className="flex flex-col items-center">
                  <span className="text-xs">👔</span>
                  <span>HR Admin</span>
                </span>
              </Button>
              <Button
                variant="outlined"
                size="small"
                onClick={() => fillDemoCredentials("employee")}
                fullWidth
              >
                <span className="flex flex-col items-center">
                  <span className="text-xs">👤</span>
                  <span>Employee</span>
                </span>
              </Button>
            </div>
            <div className="mt-4 text-xs text-center text-gray-500 space-y-1">
              <p>
                <strong>HR Admin:</strong> admin@company.com / password123
              </p>
              <p>
                <strong>Employee:</strong> employee@company.com / password123
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default LoginPage;
