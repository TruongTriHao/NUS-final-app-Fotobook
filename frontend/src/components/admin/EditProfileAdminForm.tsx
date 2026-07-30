import { useState } from "react";
import { toast } from "sonner";
import { userService } from "../../services/userService";
import type { ApiErrorResponse } from "../../types/api";
import type { AdminUserData } from "../../types/User";
import { InputField } from "../ui/InputField";
import { PhotoInput } from "../ui/PhotoInput";
import { SaveButton } from "../ui/SaveButton";
import { TextInput } from "../ui/TextInput";
import { Title } from "../ui/Title";

export function EditProfileAdminForm({ initial }: { initial: AdminUserData }) {
  const [loading, setLoading] = useState(false);
  const [isAvatarDeleted, setIsAvatarDeleted] = useState(false);

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setLoading(true);
      const formData = new FormData(e.currentTarget);
      const fileInput = formData.get("avatars") as File | null;
      if (fileInput && fileInput.size > 0) {
        formData.append("deleteAvatar", "true");
      } else if (isAvatarDeleted) {
        formData.append("deleteAvatar", "true");
      } else {
        formData.append("deleteAvatar", "false");
      }
      formData.append("isActive", String(formData.has("active")));
      const { message } = await userService.updateAdminUser(
        initial.id,
        formData,
      );
      toast.success(message);
    } catch (error) {
      toast.error(
        (error as ApiErrorResponse).message || "Failed to update user profile.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      className="flex flex-col items-center my-5 md:my-10"
      onSubmit={(e) => void handleSubmit(e)}
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
        <InputField
          label="Password"
          htmlFor="password"
          outerClassName="grid grid-cols-[80px_1fr] md:grid-cols-[120px_1fr] items-center"
          labelClassName="mx-0.75 md:mx-1.5 text-right"
        >
          <TextInput
            id="password"
            name="password"
            type="password"
            className="mx-0.75 md:mx-1.5 p-1.25 md:p-2.5"
          />
        </InputField>
        <InputField
          label="Active?"
          htmlFor="active"
          outerClassName="grid grid-cols-[80px_1fr] md:grid-cols-[120px_1fr] items-center"
          labelClassName="mx-0.75 md:mx-1.5 text-right"
        >
          <div className="flex items-center mx-0.75 md:mx-1.5 min-w-37.5 md:min-w-54.5">
            <input
              id="active"
              name="active"
              type="checkbox"
              defaultChecked={initial.isActive}
              className="w-3 md:w-4 h-3 md:h-4"
            />
          </div>
        </InputField>
        <SaveButton disabled={loading} />
      </div>
    </form>
  );
}
