import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { InputField } from "../components/ui/InputField";
import { Loading } from "../components/ui/Loading";
import { SubmitButton } from "../components/ui/SubmitButton";
import { TextInput } from "../components/ui/TextInput";
import { Title } from "../components/ui/Title";
import { authService } from "../services/authService";
import type { ApiErrorResponse } from "../types/api";

export function PasswordResetPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const token = useParams().token as string;

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setLoading(true);
      const formData = new FormData(e.currentTarget);
      const password = formData.get("password") as string;
      const confirmPassword = formData.get("confirmPassword") as string;
      if (password !== confirmPassword) {
        toast.error("Passwords do not match");
        return;
      }
      const { message } = await authService.resetPassword(token, password);
      void navigate("/login", { replace: true });
      toast.success(message);
    } catch (error) {
      toast.error(
        (error as ApiErrorResponse).message ||
          "Failed to reset password. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <form
      className="flex flex-col bg-stone-50 shadow-lg border-2 border-zinc-100 rounded-lg"
      onSubmit={(e) => void handleSubmit(e)}
    >
      <div className="flex flex-col mx-4 md:mx-8 my-6">
        <Title>Reset Password</Title>
        <InputField
          labelClassName="mt-4.5 md:mt-9 mx-2 md:mx-4"
          label="New Password"
          htmlFor="password"
        >
          <TextInput
            id="password"
            name="password"
            autoFocus
            type="password"
            placeholder="New Password"
            required
          />
        </InputField>
        <InputField label="Confirm Password" htmlFor="confirmPassword">
          <TextInput
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            placeholder="Confirm Password"
            required
          />
        </InputField>
        <SubmitButton text="Reset Password" />
      </div>
    </form>
  );
}
