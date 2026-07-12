import { useState } from "react";
import { AlbumContent } from "../main/AlbumContent";
import { PhotoContent } from "../main/PhotoContent";
import { TabButton } from "./TabButton";

type ActiveTab = "photo" | "album";

export function Tabs({ type }: { type: "feeds" | "discover" }) {
  const [activeTab, setActiveTab] = useState<ActiveTab>("photo");

  return (
    <>
      <div className="flex justify-center m-3.5">
        <TabButton
          label="PHOTO"
          active={activeTab === "photo"}
          onClick={() => {
            setActiveTab("photo");
          }}
        />
        <TabButton
          label="ALBUM"
          active={activeTab === "album"}
          onClick={() => {
            setActiveTab("album");
          }}
        />
      </div>
      {activeTab === "photo" ? (
        <PhotoContent type={type} />
      ) : (
        <AlbumContent type={type} />
      )}
    </>
  );
}
