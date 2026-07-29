import { LogIn } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "../../hooks/useAuth";
import { authService } from "../../services/authService";
import type { ApiErrorResponse } from "../../types/api";
import { Loading } from "../ui/Loading";
import { SubmitButton } from "../ui/SubmitButton";
import { TextInput } from "../ui/TextInput";
import { Title } from "../ui/Title";
import { SocialLogin } from "./SocialLogin";

export function LoginForm() {
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      setLoading(true);
      const formData = new FormData(event.currentTarget);
      const email = formData.get("email") as string;
      const password = formData.get("password") as string;
      const {
        data: { user },
        message,
      } = await authService.login(email, password);
      login(user);
      toast.success(message);
    } catch (error) {
      toast.error(
        (error as ApiErrorResponse).message ||
          "Failed to login. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <Title>Fotobook Login</Title>
      <SocialLogin />
      <form
        className="flex flex-col items-center bg-stone-50 shadow-lg border-2 border-zinc-100 rounded-lg"
        onSubmit={(e) => {
          void handleSubmit(e);
        }}
      >
        <LogIn className="my-3 md:my-6 size-9 md:size-18" color="#a8a29e" />
        <TextInput
          name="email"
          autoFocus
          type="email"
          placeholder="Email"
          required
        />
        <TextInput
          name="password"
          type="password"
          placeholder="Password"
          required
        />
        <SubmitButton text="Login" />
        <Link
          className="text-slate-500 my-2.5 md:my-4 text-xs md:text-base hover:opacity-70 active:text-slate-700"
          to="/forgot-password"
        >
          Forgot password?
        </Link>
      </form>
      <Link
        className="text-slate-500 my-2.5 md:my-5 text-xs md:text-base hover:opacity-70 active:text-slate-700"
        to="/signup"
      >
        Create an account
      </Link>
    </>
  );
}
