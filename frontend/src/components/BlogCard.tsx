import { Link } from "react-router-dom";
import { useState } from "react";
import { Logout } from "./Logout";
interface BlogCardProps {
    authorName: string;
    title: string;
    content: string;
    publishedDate: string;
    id: number;
    image?: string; // New prop for image URL
}

export const BlogCard = ({
    id,
    authorName,
    title,
    content,
    publishedDate,
    image, // Image prop
}: BlogCardProps) => {
    return (
        <Link to={`/blog/${id}`}>
            <div className="p-6 max-w-screen-sm mx-auto bg-white rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300 ease-in-out cursor-pointer mt-2">
                {/* Image section */}
                {image && (
                    <img
                        src={image}
                        alt={title}
                        className="w-full h-56 object-cover rounded-lg mb-4 transition-transform duration-300 ease-in-out transform hover:scale-105"
                    />
                )}

                {/* Blog Details */}
                <div className="flex items-center space-x-4 mb-4">
                    <Avatar name={authorName} size="small" />
                    <div className="flex flex-col">
                        <span className="text-lg font-semibold text-gray-800">{authorName}</span>
                        <span className="text-sm text-gray-500">{publishedDate}</span>
                    </div>
                </div>

                {/* Title */}
                <div className="text-2xl font-bold text-gray-900 mb-2 hover:text-indigo-600 transition-colors duration-200 ease-in-out">
                    {title}
                </div>

                {/* Content Preview */}
                <div className="text-md text-gray-700 mb-4">
                    {content.slice(0, 150)}...
                </div>

                {/* Reading Time */}
                <div className="text-sm text-gray-500 font-light">
                    {`${Math.ceil(content.length / 700)} minute(s) read`}
                </div>
            </div>
        </Link>
    );
};

export function Circle() {
    return <div className="h-1 w-1 rounded-full bg-slate-500">

    </div>
}

export function Avatar({ name, size = "small" }: { name: string; size?: "small" | "big" }) {
    const [showLogout, setShowLogout] = useState(false);

    const toggleLogout = () => {
        setShowLogout(!showLogout);
    };

    return (
        <div className="relative">
            {/* Avatar */}
            <div
                className={`relative inline-flex items-center justify-center overflow-hidden bg-purple-600 rounded-full ${
                    size === "small" ? "w-8 h-8" : "w-12 h-12"
                } cursor-pointer`}
                onClick={toggleLogout}
            >
                <span
                    className={`${
                        size === "small" ? "text-sm" : "text-lg"
                    } font-bold text-white`}
                >
                    {name[0].toUpperCase()}
                </span>
            </div>

            {/* Logout Button */}
            {showLogout && (
                <div className="absolute bg-white shadow-md p-2 rounded z-10">
                    <Logout />
                </div>
            )}
        </div>
    );
}
