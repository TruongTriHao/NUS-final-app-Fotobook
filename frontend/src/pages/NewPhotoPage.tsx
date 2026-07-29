import { NewForm } from "../components/new/NewForm";
import { NewTitle } from "../components/ui/NewTitle";

export function NewPhotoPage() {
  return (
    <>
      <NewTitle>New Photo</NewTitle>
      <NewForm type="photos" />
    </>
  );
}
