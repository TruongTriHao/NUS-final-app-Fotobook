import { useState } from "react";
import { toast } from "sonner";
import { useAuth } from "../../hooks/useAuth";
import { userService } from "../../services/userService";
import type { ApiErrorResponse } from "../../types/api";
import type { User } from "../../types/User";
import { InputField } from "../ui/InputField";
import { PhotoInput } from "../ui/PhotoInput";
import { SaveButton } from "../ui/SaveButton";
import { TextInput } from "../ui/TextInput";
import { Title } from "../ui/Title";

export function ProfileForm({ initial }: { initial: User }) {
  const { login, logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [isAvatarDeleted, setIsAvatarDeleted] = useState(false);

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setLoading(true);
      const formData = new FormData(e.currentTarget);
      const newPassword = formData.get("newPassword") as string;
      if (newPassword) {
        if (
          formData.get("newPassword") !== formData.get("passwordConfirmation")
        ) {
          toast.error("New password and confirmation do not match.");
          return;
        }
      } else {
        const fileInput = formData.get("avatars") as File | null;
        if (fileInput && fileInput.size > 0) {
          formData.append("deleteAvatar", "true");
        } else if (isAvatarDeleted) {
          formData.append("deleteAvatar", "true");
        } else {
          formData.append("deleteAvatar", "false");
        }
      }
      const {
        data: { user, requiresRelogin },
        message,
      } = await userService.updateProfile(formData);
      if (requiresRelogin) {
        toast.success(
          "Email updated. Check your email to verify and log in again.",
        );
        logout();
        return;
      }
      toast.success(message);
      login(user);
    } catch (error) {
      toast.error(
        (error as ApiErrorResponse).message || "Failed to update profile.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form
        className="flex flex-col items-center my-5 md:my-10"
        onSubmit={(e) => {
          void handleSubmit(e);
        }}
      >
        <PhotoInput
          initial={initial.avatarUrl}
          name="avatars"
          onDelete={() => {
            setIsAvatarDeleted(true);
          }}
          required={false}
        />
        <div className="flex flex-col items-center my-2.5 md:my-5">
          <Title className="text-xs md:text-base">Basic Information</Title>
          <InputField
            label="First Name"
            htmlFor="firstName"
            outerClassName="grid grid-cols-[80px_1fr] md:grid-cols-[120px_1fr] items-center"
            labelClassName="mx-0.75 md:mx-1.5 text-right"
          >
            <TextInput
              id="firstName"
              name="firstName"
              type="text"
              placeholder="First Name"
              autoFocus
              required
              defaultValue={initial.firstName}
              className="mx-0.75 md:mx-1.5 p-1.25 md:p-2.5"
            />
          </InputField>
          <InputField
            label="Last Name"
            htmlFor="lastName"
            outerClassName="grid grid-cols-[80px_1fr] md:grid-cols-[120px_1fr] items-center"
            labelClassName="mx-0.75 md:mx-1.5 text-right"
          >
            <TextInput
              id="lastName"
              name="lastName"
              type="text"
              placeholder="Last Name"
              required
              defaultValue={initial.lastName}
              className="mx-0.75 md:mx-1.5 p-1.25 md:p-2.5"
            />
          </InputField>
          <InputField
            label="Email"
            htmlFor="email"
            outerClassName="grid grid-cols-[80px_1fr] md:grid-cols-[120px_1fr] items-center"
            labelClassName="mx-0.75 md:mx-1.5 text-right"
          >
            <TextInput
              id="email"
              name="email"
              type="email"
              placeholder="someone@example.com"
              required
              defaultValue={initial.email}
              className="mx-0.75 md:mx-1.5 p-1.25 md:p-2.5"
            />
          </InputField>
          <SaveButton disabled={loading} />
        </div>
      </form>
      <form
        className="flex flex-col items-center"
        onSubmit={(e) => void handleSubmit(e)}
      >
        <div className="flex flex-col items-center my-2.5 md:my-5">
          <Title className="text-xs md:text-base">Password</Title>
          <InputField
            label="Current Password"
            htmlFor="currentPassword"
            outerClassName="grid grid-cols-[80px_1fr] md:grid-cols-[120px_1fr] items-center"
            labelClassName="mx-0.75 md:mx-1.5 text-right"
          >
            <TextInput
              id="currentPassword"
              name="currentPassword"
              type="password"
              required
              className="mx-0.75 md:mx-1.5 p-1.25 md:p-2.5"
            />
          </InputField>
          <InputField
            label="New Password"
            htmlFor="newPassword"
            outerClassName="grid grid-cols-[80px_1fr] md:grid-cols-[120px_1fr] items-center"
            labelClassName="mx-0.75 md:mx-1.5 text-right"
          >
            <TextInput
              id="newPassword"
              name="newPassword"
              type="password"
              required
              className="mx-0.75 md:mx-1.5 p-1.25 md:p-2.5"
            />
          </InputField>
          <InputField
            label="Password Confirmation"
            htmlFor="passwordConfirmation"
            outerClassName="grid grid-cols-[80px_1fr] md:grid-cols-[120px_1fr] items-center"
            labelClassName="mx-0.75 md:mx-1.5 text-right"
          >
            <TextInput
              id="passwordConfirmation"
              name="passwordConfirmation"
              type="password"
              required
              className="mx-0.75 md:mx-1.5 p-1.25 md:p-2.5"
            />
          </InputField>
          <SaveButton disabled={loading} />
        </div>
      </form>
    </>
  );
}
