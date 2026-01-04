// client/src/components/Navbar.jsx

import { useNavigate } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();
    const role = localStorage.getItem('role');

    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
    };

    return (
        <nav className="bg-white shadow-md p-4 flex justify-between items-center">
            <h1 className="text-xl font-bold text-blue-600">Mon École App 🎓</h1>
            <div className="flex items-center gap-4">
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                    Session : {role}
                </span>
                <button 
                    onClick={handleLogout}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
                >
                    Déconnexion
                </button>
            </div>
        </nav>
    );
};

export default Navbar;