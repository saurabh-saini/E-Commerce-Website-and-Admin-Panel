import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

import type { RootState } from "../store";
import { useLogout } from "../hooks/useLogout";
import { selectCartCount } from "../store/selectors/cartSelectors";

export default function Navbar() {
  const { user } = useSelector((state: RootState) => state.auth);
  const cartCount = useSelector(selectCartCount);

  const logout = useLogout();

  return (
    <nav className="bg-white border-b shadow-sm px-6 py-3 flex items-center justify-between">
      {/* LEFT SIDE */}
      <div className="flex items-center gap-4">
        {/* Brand */}
        <Link
          to="/home"
          className="text-xl font-bold text-blue-600 cursor-pointer"
        >
          MyShop
        </Link>

        {/* User Greeting */}
        {user && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            {/* Avatar */}
            <div
              className="w-8 h-8 rounded-full bg-blue-100 
                            flex items-center justify-center 
                            text-blue-600 font-semibold"
            >
              {user.name.charAt(0).toUpperCase()}
            </div>

            <span>
              Hi, <span className="font-medium text-gray-800">{user.name}</span>
            </span>
          </div>
        )}
      </div>

      {/* RIGHT SIDE */}
      <div className="flex items-center gap-6">
        <Link to="/home" className="hover:text-blue-600 cursor-pointer">
          Home
        </Link>

        {/* 🛒 CART WITH BADGE */}
        <Link to="/cart" className="relative hover:text-blue-600">
          Cart
          {cartCount > 0 && (
            <span
              className="
                absolute -top-2 -right-3
                bg-red-500 text-white
                text-xs font-bold
                w-5 h-5 rounded-full
                flex items-center justify-center
              "
            >
              {cartCount}
            </span>
          )}
        </Link>

        <button
          onClick={logout}
          className="text-red-500 hover:text-red-600 cursor-pointer"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
