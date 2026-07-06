import { LogIn } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { authService } from "../../services/authService";
import { SubmitButton } from "../ui/SubmitButton";
import { TextInput } from "../ui/TextInput";

export function LoginForm() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const user = await authService.login(email, password);
    if (!user) {
      alert("Invalid email or password");
      return;
    }
    login(user);
    void navigate(user.role === "admin" ? "/admin/photos" : "/feeds", {
      replace: true,
    });
  };

  return (
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
        to="#"
      >
        Forgot password?
      </Link>
    </form>
  );
}
