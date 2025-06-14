import uiImage from "../../assets/images/ui-image.svg";

export default function AuthLayout({ children }) {
  return (
    <div className="flex">
      <div className="relative hidden md:flex items-center justify-center w-[40vw] h-screen bg-primary">
        {/* <img
          src={bgImage}
          alt="background"
          className="object-cover size-full"
        /> */}

        <div className="absolute">
          <h2 className="lg:text-3xl text-2xl text-white font-medium text-center px-6 mb-10">
            Task Management System
          </h2>

          <img src={uiImage} alt="ui" className="w-[90%] lg:w-[80%] mx-auto" />
        </div>
      </div>

      <div className="w-screen h-screen md:w-[60vw] px-12 pt-8 pb-12">
        <h2 className="text-lg font-medium text-black md:hidden">
          Task Management System
        </h2>
        {children}
      </div>
    </div>
  );
}
