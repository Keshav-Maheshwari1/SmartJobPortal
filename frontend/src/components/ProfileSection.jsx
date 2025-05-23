import { profile } from "../assets";

const ProfileSection = ({ userEmail }) => (
  <div className="bg-gradient-to-br from-gray-800 via-gray-900 to-black p-6 rounded-2xl shadow-2xl max-w-lg mx-auto text-center">
    <img
      src={profile || "https://via.placeholder.com/150"}
      alt="Profile"
      className="w-28 h-28 rounded-full mx-auto mb-4 border-4 border-purple-500 shadow-lg"
    />
    <h2 className="text-2xl text-white font-bold mb-1">HR User</h2>
    <p className="text-gray-400">Email: {userEmail}</p>
    <span className="mt-2 inline-block bg-purple-700 text-white text-sm px-4 py-1 rounded-full shadow">
      Role: Applicant
    </span>
  </div>
);

export default ProfileSection;
