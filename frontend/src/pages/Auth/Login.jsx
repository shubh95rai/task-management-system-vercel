import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../../components/layouts/AuthLayout";
import { useContext, useState } from "react";
import Input from "../../components/inputs/Input";
import { validateEmail } from "../../utils/helper.js";
import axiosInstance from "../../utils/axiosInstance.js";
import { API_PATHS } from "../../utils/apiPaths.js";
import { UserContext } from "../../context/userContext.jsx";
import LoadingButton from "../../components/LoadingButton.jsx";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const { updateUser, loading, setLoading } = useContext(UserContext);
  const navigate = useNavigate();

  // handle login
  async function handleLogin(e) {
    e.preventDefault();

    if (!validateEmail(email)) {
      setError("Please enter a valid email");
      return;
    }

    if (!password) {
      setError("Please enter your password");
      return;
    }

    // if (password.length < 8) {
    //   setError("Password must be at least 8 characters");
    //   return;
    // }

    setError(null);

    // login api call
    setLoading(true);
    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
        email,
        password,
      });

      const { token, user } = response.data;

      if (token) {
        localStorage.setItem("token", token);
        updateUser(response.data);

        // redirect based on user role
        if (user.role === "admin") {
          navigate("/admin/dashboard");
        } else {
          navigate("/user/dashboard");
        }
      }
    } catch (error) {
      if (error.response && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError("An error occurred. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout>
      <div className="lg:w-[70%] lg:mx-auto h-full flex flex-col justify-center">
        <h3 className="text-xl font-semibold text-black">Welcome Back</h3>
        <p className="text-sm text-slate-700 mt-1 mb-6">
          Please enter your details to log in
        </p>

        <form onSubmit={handleLogin}>
          <Input
            type="text"
            label="Email"
            placeholder="john@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Input
            type="password"
            label="Password"
            placeholder="min 8 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && <p className="text-red-500 text-xs pb-2.5">{error}</p>}

          {/* <button type="submit" className="btn-primary">
            LOGIN
          </button> */}

          <LoadingButton pending={loading} className="btn-primary">
            LOGIN
          </LoadingButton>

          <p className="text-sm text-slate-800 mt-3">
            Don't have an account?{" "}
            <Link to="/register" className="font-medium text-primary underline">
              Register
            </Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  );
}
