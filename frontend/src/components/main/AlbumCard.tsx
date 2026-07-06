import { useEffect, useState } from "react";
import { userService } from "../../services/userService";
import type { User } from "../../types/User";
import { UserInfo } from "../main/UserInfo";
import { Album } from "../ui/Album";
import { CardFooter } from "./CardFooter";
import { CardText } from "./CardText";

export function AlbumCard({
  src,
  userId,
  title,
  description,
  likeCount,
  createdAt,
}: {
  src: [string, string | null, string | null];
  userId: string;
  title: string;
  description: string;
  likeCount: number;
  createdAt: string;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const fetchUser = async () => {
      try {
        setError(null);
        const data = await userService.getUserById(userId);
        if (isMounted) {
          setUser(data);
        }
      } catch (e) {
        if (isMounted) {
          setError(e instanceof Error ? e.message : "Error fetching user");
        }
      }
    };

    void fetchUser();

    return () => {
      isMounted = false;
    };
  }, [userId]);

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="flex m-2.5 bg-stone-50 rounded-sm shadow-lg h-34.25 md:h-68.5 overflow-hidden">
      <Album
        src={src}
        className="w-25 md:w-60"
        imageClassName="translate-x-3 translate-y-3"
        alt={title}
      />
      <div className="flex flex-col justify-between mx-5 my-2">
        <UserInfo
          user={user}
          avatarClassName="text-white text-xs md:text-sm bg-indigo-800"
          nameClassName="text-indigo-800 text-xs md:text-sm"
          to={`/profile/${user?.id ?? ""}`}
        />
        <CardText title={title} description={description} />
        <CardFooter likeCount={likeCount} createdAt={createdAt} />
      </div>
    </div>
  );
}
