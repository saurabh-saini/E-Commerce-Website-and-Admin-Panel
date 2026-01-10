import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-white shadow px-6 py-4 flex justify-between items-center">
      <Link to="/" className="text-xl font-bold text-blue-600">
        MyStore
      </Link>

      <div className="flex gap-4 text-sm">
        <Link to="/" className="hover:text-blue-600">
          Home
        </Link>
        <Link to="/cart" className="hover:text-blue-600">
          Cart
        </Link>
      </div>
    </nav>
  );
}
