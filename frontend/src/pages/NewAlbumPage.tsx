import { NewForm } from "../components/new/NewForm";
import { AlbumInput } from "../components/ui/AlbumInput";
import { NewTitle } from "../components/ui/NewTitle";

export function NewAlbumPage() {
  return (
    <>
      <NewTitle>New Album</NewTitle>
      <NewForm type="album">
        <AlbumInput name="album" />
      </NewForm>
    </>
  );
}
