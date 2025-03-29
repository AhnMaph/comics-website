import LogoWeb from "@/assets/logo.png";
import MobileLogo from "@/assets/mobilelogo.png";

const Logo = () => {
  return (
    <div className="flex items-center space-x-4">
      <img src={LogoWeb} alt="Logo" className="h-10 w-auto hidden sm:block" />
      <img src={MobileLogo} alt="Mobile Logo" className="h-10 w-auto sm:hidden" />
    </div>
  );
};

export default Logo;
