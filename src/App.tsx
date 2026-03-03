import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch ,RootState} from "./store/store";
import { login, logout } from "./store/features/authSlice";
import authService from "./appwrite/auth";
import {  Footer, Header } from "./components";
import { Outlet } from "react-router-dom";

function App() {
  const [loading, setLoading] = useState<boolean>(true);
  const dispatch = useDispatch<AppDispatch>();
  const theme=useSelector((state:RootState)=>state.theme.color)

  useEffect(() => {
    authService
      .currentUser()
      .then((userData) => {
        if (userData) {
          dispatch(login(userData));
        } else {
          dispatch(logout());
        }
      })
      .catch((error) => {
        console.log("Error in currentUser in login :", error);
      })
      .finally(() => setLoading(false));
  }, [dispatch]);

  

  return (
    <div className={theme===`dark`?`dark`:undefined}>
      <div
      className="
      min-h-screen
       w-full
       bg-white
       dark:bg-slate-900
       dark:text-gray-200
       text-gray-900
       ">
        <Header/>
        <main className="min-h-[60vh] max-w-7xl max-h-fit mx-auto px-4 py-8">
         {loading?(
           <div className="h-screen flex items-center justify-center">
              <svg
                className="h-10 w-10 animate-spin text-blue-600 dark:text-blue-400"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
            </div>
          
          

         ):(
            <Outlet/>
         )}

        </main>
        <Footer/>

      </div>

    </div>
  )
  
}

export default App;
