import { useState } from "react";
import { toast } from "sonner";
import { InputField } from "../components/ui/InputField";
import { Loading } from "../components/ui/Loading";
import { SubmitButton } from "../components/ui/SubmitButton";
import { TextInput } from "../components/ui/TextInput";
import { Title } from "../components/ui/Title";
import { authService } from "../services/authService";
import type { ApiErrorResponse } from "../types/api";

export function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setLoading(true);
      const formData = new FormData(e.currentTarget);
      const email = formData.get("email") as string;
      const { message } = await authService.forgotPassword(email);
      toast.success(message);
    } catch (error) {
      toast.error(
        (error as ApiErrorResponse).message ||
          "Failed to send reset link. Please try again.",
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
        <Title>Forgot Password</Title>
        <div className="text-sm text-zinc-500 mt-2">
          Enter your email address and you will receive a link to reset your
          password.
        </div>
        <InputField
          labelClassName="mt-4.5 md:mt-9 mx-2 md:mx-4"
          label="Email"
          htmlFor="email"
        >
          <TextInput
            id="email"
            name="email"
            autoFocus
            type="email"
            placeholder="Email"
            required
          />
        </InputField>
        <SubmitButton text="Send Reset Link" />
      </div>
    </form>
  );
}
