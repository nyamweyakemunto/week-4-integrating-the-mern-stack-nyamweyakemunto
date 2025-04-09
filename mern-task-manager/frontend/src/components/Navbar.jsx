import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold text-blue-600">
          Task Manager
        </Link>
        <div className="flex space-x-4">
          <Link
            to="/"
            className="px-3 py-2 text-gray-700 hover:text-blue-600"
          >
            Home
          </Link>
          <Link
            to="/about"
            className="px-3 py-2 text-gray-700 hover:text-blue-600"
          >
            About
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;