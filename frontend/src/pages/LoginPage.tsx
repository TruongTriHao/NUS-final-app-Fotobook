import { Link } from "react-router-dom";
import { AuthTitle } from "../components/auth/AuthTitle";
import { LoginForm } from "../components/auth/LoginForm";
import { SocialLogin } from "../components/auth/SocialLogin";

export function LoginPage() {
  return (
    <>
      <AuthTitle>Fotobook Login</AuthTitle>
      <SocialLogin />
      <LoginForm />
      <Link
        className="text-slate-500 my-2.5 md:my-5 text-xs md:text-base hover:opacity-70 active:text-slate-700"
        to="/signup"
      >
        Create an account
      </Link>
    </>
  );
}
