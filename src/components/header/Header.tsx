import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Container from "../container/Container";
import Logo from "../Logo";
import LogoutBtn from "../buttons/LogoutBtn";
import CommonBtn from "../buttons/CommonBtn";
import {toggle} from "../../store/features/themeSlice"
import type { RootState } from "../../store/store";
import { useState } from "react";


interface NavItem {
  name: string;
  slug: string;
  active: boolean;
}

function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const authStatus = useSelector((state: RootState) => state.auth.status);
const theme = useSelector((state: RootState) => state.theme.color)
  const navigate = useNavigate();
  const dispatch=useDispatch()
  const navItems: NavItem[] = [
    {
      name: "Home",
      slug: "/",
      active: true,
    },
    {
      name: "Login",
      slug: "/login",
      active: !authStatus,
    },
    {
      name: "Signup",
      slug: "/signup",
      active: !authStatus,
    },
    {
      name: "All Posts",
      slug: "/all-posts",
      active: authStatus,
    },
    {
      name: "Add Post",
      slug: "/add-post",
      active: authStatus,
    },
  ];
  return (
    <header className="border-2  border-gray-300 dark:border-slate-800 py-4 relative">
      <Container>
        <nav className="flex justify-between items-center">
          <div className="flex justify-center items-center gap-2">
            <Logo width="50px" /> <h1 className="text-blue-600 font-bold text-xl dark:text-gray-200">Blog-app</h1>
          </div>
          <ul className="hidden lg:flex items-center gap-4 ml-auto ">
            {navItems.map((item) =>
              item.active ? (
                <li key={item.name}>
                  <CommonBtn  onClick={() => navigate(item.slug)}>
                    {item.name}
                  </CommonBtn>
                </li>
              ) : null
            )}
            {authStatus&&(
              <li>
                <LogoutBtn />
              </li>
            )} 
          <CommonBtn variant="secondary" className="rounded-4xl" onClick={()=>dispatch(toggle())}>
        {theme === "dark" ? "☀️ Light" : "🌙 Dark"}
          </CommonBtn>
          </ul>
          <button className="md:hidden text-2xl" onClick={()=>setIsOpen((prevs)=>!prevs)}>
               ☰
          </button>
        </nav>
        
         { isOpen&&(
            <div className="md:hidden mt-4 bg-white dark:bg-slate-900 rounded-lg  shadow-lg p-4">
              <ul className="flex flex-col gap-4 w-full">
                {
                  navItems.map((item)=>(
                    item.active?(
                         <li key={item.name} className="w-full">
                      <CommonBtn className="w-full" onClick={()=>{
                        navigate(item.slug)
                        setIsOpen(false)
                        }}>
                        {item.name}
                        </CommonBtn>
                    </li>
                    ):null
                 
                  ))
                
                }
                {
                    authStatus&&(
                      <li className="w-full">
                      <LogoutBtn className="w-full"/>
                      </li>
                    )
                }
                <CommonBtn className="w-full " onClick={()=>dispatch(toggle())}>
                      {theme === "dark" ? "☀️ Light" : "🌙 Dark"}

                </CommonBtn>
              </ul>

            </div>
          )
        }
      </Container>
    </header>
  );
}

export default Header;
