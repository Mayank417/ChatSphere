import { useState } from "react";
import axios from "axios"; // Ensure axios installed hai

function Profile() {
  const user = JSON.parse(localStorage.getItem("user"));
  
  // States
  const [name, setName] = useState(user?.name || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [image, setImage] = useState(null); // File object ke liye
  const [preview, setPreview] = useState(user?.profilePic || "");

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("bio", bio);
    if (image) formData.append("profilePic", image); // Backend mein 'profilePic' key expect kar raha hai

    try {
      const res = await axios.put("/api/users/profile", formData, {
        headers: { 
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${user.token}` // Agar token needed hai
        },
      });
      
      // Update local storage
      localStorage.setItem("user", JSON.stringify(res.data));
      alert("Profile Updated Successfully!");
    } catch (err) {
      console.log(err);
      alert("Failed to update profile");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl bg-slate-900 rounded-3xl border border-slate-800 p-10">
        <h1 className="text-4xl font-bold text-white mb-10">My Profile</h1>

        <div className="flex flex-col items-center">
          <img
            src={preview || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
            className="w-40 h-40 rounded-full object-cover border-4 border-green-500"
            alt="Profile"
          />
          <label className="mt-6 bg-green-600 hover:bg-green-700 px-5 py-3 rounded-xl cursor-pointer text-white">
            Change Photo
            <input type="file" hidden accept="image/*" onChange={handleImage} />
          </label>
        </div>

        <div className="mt-10 space-y-5">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
            className="w-full bg-slate-800 rounded-xl p-4 text-white outline-none"
          />
          <input
            defaultValue={user?.email}
            disabled
            className="w-full bg-slate-800 rounded-xl p-4 text-slate-400"
          />
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows="4"
            placeholder="Write your bio..."
            className="w-full bg-slate-800 rounded-xl p-4 text-white outline-none resize-none"
          />
          <button
            onClick={handleSave}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 py-4 rounded-xl font-semibold text-white"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

export default Profile;