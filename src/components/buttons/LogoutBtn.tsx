import { logout } from "../../store/features/authSlice";
import authService from "../../appwrite/auth";
import { useDispatch } from "react-redux";
import CommonBtn from "./CommonBtn";

function LogoutBtn({className=""}) {
  const dispatch = useDispatch();

  const handleLogout= async():Promise<void>=>{
    try{
await authService.userLogout()
dispatch(logout())
    }
    catch(error){
      console.log("Error in logout :",error)
    }

  }

  return (
    <CommonBtn variant="tertiary" className={`${className}`}
      onClick={handleLogout}
     
    >
      logout
    </CommonBtn>
  );
}

export default LogoutBtn;
