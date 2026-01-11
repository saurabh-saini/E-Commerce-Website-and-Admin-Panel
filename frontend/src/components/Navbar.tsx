import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../store";
import { logout } from "../store/slices/authSlice";

export default function Navbar() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { user } = useSelector((state: RootState) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

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

        <Link to="/cart" className="hover:text-blue-600 cursor-pointer">
          Cart
        </Link>

        <button
          onClick={handleLogout}
          className="text-red-500 hover:text-red-600 cursor-pointer"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
