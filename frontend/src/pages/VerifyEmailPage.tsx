import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { Loading } from "../components/ui/Loading";
import { SubmitButton } from "../components/ui/SubmitButton";
import { Title } from "../components/ui/Title";
import { authService } from "../services/authService";
import type { ApiErrorResponse } from "../types/api";

export function VerifyEmailPage() {
  const [loading, setLoading] = useState(true);
  const [verified, setVerified] = useState(false);
  const [resending, setResending] = useState(false);
  const navigate = useNavigate();
  const token = useParams().token as string;

  const handleResend = async () => {
    try {
      setResending(true);
      const { message } = await authService.resendVerifyEmail(token);
      toast.success(message);
    } catch (error) {
      toast.error(
        (error as ApiErrorResponse).message ||
          "Failed to resend verification email. Please try again.",
      );
    } finally {
      setResending(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    const verifyEmail = async () => {
      try {
        setLoading(true);
        const { message } = await authService.verifyEmail(token);
        if (isMounted) {
          setVerified(true);
          toast.success(message);
        }
      } catch (error) {
        if (isMounted) {
          toast.error(
            (error as ApiErrorResponse).message ||
              "Failed to verify email. Please try again.",
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    void verifyEmail();

    return () => {
      isMounted = false;
    };
  }, [token]);

  useEffect(() => {
    if (!verified) return;
    void navigate("/login", { replace: true });
  }, [navigate, verified]);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="flex flex-col items-center justify-center bg-stone-50 shadow-lg border-2 border-zinc-100 rounded-lg">
      <Title className="m-2 md:m-4">Email Verification</Title>
      {!verified && (
        <>
          <div className="text-red-600 m-2 md:m-4">
            Email verification failed. Please try resending the verification
            email.
          </div>
          <SubmitButton
            text={resending ? "Resending..." : "Resend verification email"}
            onClick={() => void handleResend()}
            disabled={resending}
          ></SubmitButton>
        </>
      )}
    </div>
  );
}
