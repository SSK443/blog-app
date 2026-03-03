import React from "react";
import { Logo, CommonBtn, CommonInput } from "../index";
import { useForm } from "react-hook-form";
import authService from "../../appwrite/auth";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../store/features/authSlice";
import { Link, useNavigate } from "react-router-dom";
import type { RootState } from "../../store/store";

interface SignUpFormData {
  name: string;
  email: string;
  password: string;
}

export default function SignUp() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<SignUpFormData>();

  const [error, setError] = React.useState<string | null>(null);
  const [showPassword, setShowPassword] = React.useState(false);

  const handleSignUp = async (data: SignUpFormData) => {
    setError(null);

    try {
      const user = await authService.createAccount(data);

      if (user) {
        const currentUser = await authService.currentUser();
        if (currentUser) {
          dispatch(login(currentUser));
          navigate("/");
        }
      }
    } catch (error: any) {
      setError(error?.message || "Failed to create account.");
    }
  };
  const theme=useSelector((state:RootState)=>state.theme.color)

  return (
   <div className={theme===`dark`?`dark`:undefined}>
     <div className="min-h-screen flex items-center justify-center 
    bg-white dark:bg-slate-900 transition-colors duration-300">

      <div className="w-full max-w-md 
      bg-gray-50 dark:bg-slate-950 
      border border-gray-200 dark:border-slate-800 
      rounded-2xl shadow-lg px-8 py-10">

        <div className="flex flex-col items-center gap-3 mb-8">
          <Logo width="80px" />
          <h1 className="text-2xl font-semibold 
          text-gray-900 dark:text-gray-200">
            Create Account
          </h1>
          <p className="text-sm text-gray-500 dark:text-slate-400">
            Start your journey with us
          </p>
        </div>

        {error && (
          <div className="mb-4 rounded-lg 
          bg-red-50 dark:bg-red-900/30 
          border border-red-200 dark:border-red-800 
          text-red-600 dark:text-red-400 
          px-4 py-2 text-sm text-center">
            {error}
          </div>
        )}

      
        <form onSubmit={handleSubmit(handleSignUp)} className="space-y-5">

          <CommonInput
            label="Name"
            placeholder="Enter your name"
            {...register("name", { required: "Name is required" })}
          />

          <CommonInput
            label="Email"
            type="email"
            placeholder="Enter your email"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^\S+@\S+\.\S+$/,
                message: "Invalid email address",
              },
            })}
          />

          <div className="relative">
            <CommonInput
              label="Password"
              type={showPassword ? "text" : "password"}
              placeholder="Create a password"
              className="pr-12"
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
            {isSubmitting ? "Creating..." : "Create Account"}
          </CommonBtn>

        </form>

        {/* Footer */}
        <div className="mt-6 text-center text-sm 
        text-gray-500 dark:text-slate-400">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-blue-600 dark:text-blue-500 
            font-medium hover:underline"
          >
            Sign in
          </Link>
        </div>
      </div>
    </div>
   </div>
  );
}
