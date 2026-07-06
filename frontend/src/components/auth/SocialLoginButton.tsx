export function SocialLoginButton({ src, alt }: { src: string; alt: string }) {
  return (
    <a className="mx-3 md:mx-6 my-2 md:my-4" href="#">
      <img className="w-5 md:w-10 h-5 md:h-10" src={src} alt={alt} />
    </a>
  );
}
