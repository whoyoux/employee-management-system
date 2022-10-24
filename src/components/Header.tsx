import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";

const Header: React.FC = () => {
  const { data: sessionData } = useSession();
  return (
    <header className="mx-auto flex w-full max-w-4xl justify-between py-10 px-10 text-2xl font-medium">
      <Link href="/">Employee Management System</Link>
      {sessionData ? (
        <div className="flex gap-5">
          {sessionData?.user?.name}
          <button
            onClick={() => signOut()}
            className="underline underline-offset-2 hover:text-blue-500"
          >
            Sign out
          </button>
        </div>
      ) : (
        <button
          onClick={() => signIn("google")}
          className=" underline underline-offset-2 hover:text-blue-500"
        >
          Sign in
        </button>
      )}
    </header>
  );
};

export default Header;
