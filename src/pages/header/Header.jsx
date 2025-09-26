import { NavLink, useNavigate } from "react-router-dom";
import { Search, ShoppingCart } from "lucide-react"; // example, adjust import
import Avatar from "../../assets/avatar.png"; // adjust path

const Header = () => {

    const navigate=useNavigate()

    const handleHome=()=>{
        navigate("/home")
    }

    const handleProfile=()=>{
        navigate("/profile")
    }

    const handleCart=()=>{
        navigate("/cart")
    }
    return (
        <div className="flex justify-between items-center px-6 py-4 bg-white shadow-sm">
            {/* Logo */}
            <div className="flex items-center gap-2 hover:cursor-pointer" onClick={handleHome}>
                <div className="w-8 h-8 text-green-600">
                    <svg
                        fill="none"
                        viewBox="0 0 48 48"
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-full h-full"
                    >
                        <path
                            d="M36.7273 44C33.9891 44 31.6043 39.8386 30.3636 33.69C29.123 39.8386 26.7382 44 24 44C21.2618 44 18.877 39.8386 17.6364 33.69C16.3957 39.8386 14.0109 44 11.2727 44C7.25611 44 4 35.0457 4 24C4 12.9543 7.25611 4 11.2727 4C14.0109 4 16.3957 8.16144 17.6364 14.31C18.877 8.16144 21.2618 4 24 4C26.7382 4 29.123 8.16144 30.3636 14.31C31.6043 8.16144 33.9891 4 36.7273 4C40.7439 4 44 12.9543 44 24C44 35.0457 40.7439 44 36.7273 44Z"
                            fill="currentColor"
                        ></path>
                    </svg>
                </div>
                <span className="text-xl font-bold text-gray-800">SwiftMart</span>
            </div>

            {/* Nav Links */}
            <nav className="hidden md:flex gap-6 text-gray-600 font-medium">
                <NavLink
                    to="/home"
                    className={({ isActive }) =>
                        isActive ? "text-green-600 font-semibold" : "hover:text-green-600"
                    }
                >
                    Home
                </NavLink>
                <NavLink
                    to="/product"
                    className={({ isActive }) =>
                        isActive ? "text-green-600 font-semibold" : "hover:text-green-600"
                    }
                >
                 Products
                </NavLink>
                <NavLink
                    to="/helpAndSupport"
                    className={({ isActive }) =>
                        isActive ? "text-green-600 font-semibold" : "hover:text-green-600"
                    }
                >
                    Help and Support
                </NavLink>
                <NavLink
                    to="/aboutUs"
                    className={({ isActive }) =>
                        isActive ? "text-green-600 font-semibold" : "hover:text-green-600"
                    }
                >
                    About Us
                </NavLink>
            </nav>

            {/* Right Icons */}
            <div className="flex items-center gap-4">
                <ShoppingCart onClick={handleCart} className="w-5 h-5 text-gray-500 cursor-pointer" />
                <img
                    src={Avatar}
                    alt="Avatar"
                    onClick={handleProfile}
                    className="w-7 h-7 rounded-full hover:cursor-pointer"
                />
            </div>
        </div>
    );
};

export default Header;
