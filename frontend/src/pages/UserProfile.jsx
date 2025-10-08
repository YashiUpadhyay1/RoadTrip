/**
 * @fileoverview A component to display the authenticated user's profile information.
 * @module components/UserProfile
 */

import React from "react";
import { User, Mail, Calendar } from "lucide-react";

/**
 * Represents the authenticated user object.
 * @typedef {object} UserProfileData
 * @property {string} _id - The user's unique MongoDB ID.
 * @property {string} username - The user's display name.
 * @property {string} email - The user's email address.
 */

/**
 * Renders a user profile card with the user's name, email, and ID.
 * If no user is provided, it displays a message prompting the user to log in.
 *
 * @param {object} props - The component's props.
 * @param {UserProfileData | null} props.user - The authenticated user object, or null if the user is not logged in.
 */
const UserProfile = ({ user }) => {
    if (!user) {
        return (
            <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-xl shadow-lg border border-gray-200">
                <p className="text-center text-xl text-red-600">
                    Please log in to view your profile.
                </p>
            </div>
        );
    }

    return (
        <div className="max-w-xl mx-auto mt-10 p-8 bg-white rounded-2xl shadow-2xl border border-indigo-100">
            <div className="flex flex-col items-center">
                <div className="bg-indigo-100 p-5 rounded-full mb-4">
                    <User className="w-12 h-12 text-indigo-600" />
                </div>
                <h2 className="text-3xl font-extrabold text-gray-900 mb-1">
                    {user.username}
                </h2>
                <p className="text-lg text-indigo-600 font-medium">Trip Planner Member</p>
            </div>

            <div className="mt-8 space-y-4">
                <div className="flex items-center p-4 bg-gray-50 rounded-lg border border-gray-100">
                    <Mail className="w-5 h-5 text-gray-500 mr-3" />
                    <span className="font-semibold text-gray-700">Email:</span>
                    <span className="ml-auto text-gray-600">{user.email}</span>
                </div>

                <div className="flex items-center p-4 bg-gray-50 rounded-lg border border-gray-100">
                    <Calendar className="w-5 h-5 text-gray-500 mr-3" />
                    <span className="font-semibold text-gray-700">User ID:</span>
                    <span className="ml-auto text-gray-600 truncate">{user._id}</span>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;