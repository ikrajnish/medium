import { Avatar } from "./BlogCard";
import { Link } from "react-router-dom";
import { FaBell } from "react-icons/fa";
import { SiTildapublishing } from "react-icons/si";

export const Appbar = () => {
    return (
        <div className="border-b flex justify-between px-10 py-4 items-center">
            <div className="flex items-center gap-4">
                <Link to={'/blogs'} className="cursor-pointer text-3xl font-bold">
                    BlogSpace
                </Link>
                <input
                    type="text"
                    placeholder="Search..."
                    className="border rounded-full px-4 py-2 text-sm focus:outline-none focus:ring focus:ring-blue-300"
                />
            </div>

            <div className="flex items-center gap-8">
                <Link to={`/publish`} className="flex items-center gap-2 text-gray-600 hover:text-gray-800 focus:outline-none">
                    <SiTildapublishing size={24} />
                    <span className="text-sm font-medium">Write</span>
                </Link>

                <button
                    type="button"
                    className="text-gray-600 hover:text-gray-800 focus:outline-none"
                >
                    <FaBell size={24} />
                </button>

                <Avatar size={"big"} name="Anonymous" />
            </div>
        </div>
    );
};
