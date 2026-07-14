import AccessDenied from "../../../pages/AccessDenied";
import { useAppSelector } from "../../../redux/hooks";
import TokenForm from "./TokenForm";

const MainSetting = () => {
  const { user } = useAppSelector((state) => state.auth);
  return user?.isAdmin && user?.roles === "MHQO" ? (
    <div className="!p-4 w-full h-full">
      <TokenForm />
    </div>
  ) : (
    <AccessDenied />
  );
};

export default MainSetting;
