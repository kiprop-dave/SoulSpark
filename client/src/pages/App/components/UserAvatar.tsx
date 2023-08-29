import { useState } from "react";
import clsx from "clsx";
import logo from "@/assets/logo.svg";

type UserAvatarProps = {
  imageSrc?: string;
  isBlurred: boolean;
}

export default function UserAvatar({ imageSrc, isBlurred }: UserAvatarProps): JSX.Element {
  const [loading, setLoading] = useState<boolean>(true);

  return (
    <div className="w-full h-full flex items-center justify-center rounded-full">
      <div
        className={clsx("w-[30%] h-[30%] border-2 border-t-red-500 border-l-red-500 border-b-red-500 border-r-white rounded-full animate-spin", {
          hidden: !loading,
        })} />
      <div className={clsx("w-full h-full relative rounded-full", {
        hidden: loading,
      })}>
        <img
          src={imageSrc || logo}
          alt="profile image"
          className={clsx("w-full h-full object-cover rounded-full transition-opacity duration-300", {
            "opacity-0": loading,
            "opacity-100": !loading,
          })}
          onLoad={() => setLoading(false)}
        />
        <div className={clsx("absolute w-full h-full rounded-full z-50 top-0", {
          "backdrop-filter backdrop-blur-sm": isBlurred,
        })} />
      </div>
    </div>
  )
}
