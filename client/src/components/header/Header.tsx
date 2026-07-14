import { useAppSelector } from "../../redux/hooks";
import AuthButton from "./auth-button/AuthButton";
import NavBar from "./navbar/NavBar";
import NavBarMobile from "./navbar/NavBarMobile";

const Header = () => {
  const { loadingUser } = useAppSelector((state) => state.auth);

  return (
    <header className="bg-secondary w-full !p-1.5 !px-4 h-[8vh] flex justify-between items-center">
      <NavBar />
      <NavBarMobile />
      {loadingUser ? (
        <div className="w-24 h-8 bg-light rounded-md animate-pulse"></div>
      ) : (
        <AuthButton />
      )}
    </header>
  );
};

export default Header;
