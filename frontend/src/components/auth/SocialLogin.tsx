import facebookLogo from "../../assets/facebook.png";
import googleLogo from "../../assets/google.png";
import xLogo from "../../assets/x.png";
import { SocialLoginButton } from "./SocialLoginButton";

export function SocialLogin() {
  return (
    <div className="flex justify-evenly items-center border-2 border-neutral-200 rounded-lg shadow-lg m-2 md:m-4">
      <SocialLoginButton src={googleLogo} />
      <SocialLoginButton src={facebookLogo} />
      <SocialLoginButton src={xLogo} />
    </div>
  );
}
