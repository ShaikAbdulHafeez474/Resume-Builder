
import { Link, useNavigate } from "react-router-dom";
import useStore from "../store/useStore";

const Navbar = () => {
  const { user, clearUser } = useStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    clearUser();
    navigate("/login");
  };

  return (
    <nav className="flex justify-between items-center bg-gray-800 text-white p-4">
      <h1 className="text-xl font-bold">Resume Builder</h1>
      <div className="flex gap-4">
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/editor">Editor</Link>
        <Link to="/templates">Templates</Link>
        <Link to="/analytics">Analytics</Link>
        {user && (
          <button
            onClick={handleLogout}
            className="bg-red-500 px-3 py-1 rounded"
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
