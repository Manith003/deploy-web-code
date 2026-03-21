import SignInFormClient from "@/features/auth/components/SignInFormClient";

const SignInPage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className=" text-center mb-5">
        <h1 className="text-white font-sans text-2xl">WELCOME TO WEB.CODE IDE</h1>
        <p className="text-white font-sans">Your Coding Workspace Awaits.</p>
      </div>
      <SignInFormClient />
    </div>
  );
};

export default SignInPage;
