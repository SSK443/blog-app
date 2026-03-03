import React from "react";
import { CommonBtn, CommonInput, Logo } from "../index";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { login as authLogin } from "../../store/features/authSlice";
import authService from "../../appwrite/auth";
import { Link, useNavigate } from "react-router-dom";
import type { RootState } from "../../store/store";

interface LoginFormData {
  email: string;
  password: string;
}

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<LoginFormData>();

  const [error, setError] = React.useState<string | null>(null);
  const [showPassword, setShowPassword] = React.useState(false);

  const handleLogin = async (data: LoginFormData) => {
    setError(null);

    try {
      const session = await authService.userLogin(data);

      if (session) {
        const userData = await authService.currentUser();
        if (userData) {
          dispatch(authLogin(userData));
          navigate("/");
        }
      }
    } catch (error: string | any) {
      setError(error?.message || "Invalid email or password");
    }
  };
  const theme=useSelector((state:RootState)=>state.theme.color)

  return (
  <div className={theme===`dark`?`dark`:undefined}>
      <div  className="min-h-screen flex items-center justify-center 
    bg-white dark:bg-slate-900 transition-colors duration-300">

      <div className="w-full max-w-md 
      bg-gray-50 dark:bg-slate-950 
      border border-gray-200 dark:border-slate-800 
      rounded-2xl shadow-lg px-8 py-10">

       
        <div className="flex flex-col items-center gap-3 mb-8">
          <Logo width="80px" />
          <h1 className="text-2xl font-semibold 
          text-gray-900 dark:text-gray-200">
            Welcome Back
          </h1>
          <p className="text-sm text-gray-500 dark:text-slate-400">
            Sign in to continue
          </p>
        </div>

       
        {error && (
          <div className="mb-4 rounded-lg bg-red-50 dark:bg-red-900/30 
          text-red-600 dark:text-red-400 
          border border-red-200 dark:border-red-800 
          px-4 py-2 text-sm text-center">
            {error}
          </div>
        )}

   
        <form onSubmit={handleSubmit(handleLogin)} className="space-y-5">

          <CommonInput
            label="Email"
            type="email"
            autoComplete="email"
            placeholder="Enter your email"
            className="focus:ring-2 focus:ring-blue-600 dark:focus:ring-blue-500"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                message: "Invalid email address",
              },
            })}
          />

          <div className="relative">
            <CommonInput
              label="Password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="Enter your password"
              className="pr-12 focus:ring-2 focus:ring-blue-600 dark:focus:ring-blue-500"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Minimum 6 characters",
                },
              })}
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-10 text-sm 
              text-blue-600 dark:text-blue-500 
              hover:underline"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          <CommonBtn
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 rounded-xl 
            bg-blue-600 dark:bg-blue-500 
            hover:bg-blue-700 dark:hover:bg-blue-600 
            text-white font-medium 
            transition-all duration-200 
            disabled:opacity-60"
          >
            {isSubmitting ? "Signing In..." : "Sign In"}
          </CommonBtn>

        </form>

     
        <div className="mt-6 text-center text-sm 
        text-gray-500 dark:text-slate-400">
          Don’t have an account?{" "}
          <Link
            to="/signup"
            className="text-blue-600 dark:text-blue-500 
            font-medium hover:underline"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  </div>
  );
}
