
import Navbar from "../components/Navbar";
import useStore from "../store/useStore";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const { user } = useStore();

  return (
    <div>
      <Navbar />
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">
          Welcome, {user?.name || "User"} 👋
        </h2>
        <p className="mb-6 text-gray-700">
          This is your dashboard. From here, you can manage your resumes,
          explore templates, and check analytics.
        </p>
        <div className="flex gap-4">
          <Link
            to="/editor"
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Create/Edit Resume
          </Link>
          <Link
            to="/templates"
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Choose Templates
          </Link>
          <Link
            to="/analytics"
            className="bg-purple-500 text-white px-4 py-2 rounded"
          >
            View Analytics
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
