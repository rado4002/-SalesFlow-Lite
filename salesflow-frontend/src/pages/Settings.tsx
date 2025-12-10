import { useEffect, useState } from "react";
import { getMe, updateUser, changePassword } from "../services/userAPI";

const Settings = () => {
  const [profile, setProfile] = useState({
    id: 0,                // FIX: backend returns a number
    username: "",
    email: "",
    phoneNumber: "",
    role: "",
  });

  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error">(
    "success"
  );

  // ----------------------------------------------------------
  // LOAD PROFILE FROM BACKEND
  // ----------------------------------------------------------
  useEffect(() => {
    const load = async () => {
      try {
        const data = await getMe();

        // FIX: enforce safe structured profile
        setProfile({
          id: data.id ?? 0,
          username: data.username ?? "",
          email: data.email ?? "",
          phoneNumber: data.phoneNumber ?? "",
          role: data.role ?? "",
        });
      } catch (err) {
        console.error("Failed to load profile:", err);
        setMessageType("error");
        setMessage("Unable to load user profile.");
      }
    };

    load();
  }, []);

  // ----------------------------------------------------------
  // UPDATE PROFILE
  // ----------------------------------------------------------
  const handleUpdateProfile = async () => {
    try {
      await updateUser({
        username: profile.username,
        email: profile.email,
      });

      setMessageType("success");
      setMessage("Profile updated successfully.");
    } catch (err) {
      console.error(err);
      setMessageType("error");
      setMessage("Failed to update profile.");
    }
  };

  // ----------------------------------------------------------
  // UPDATE PASSWORD
  // ----------------------------------------------------------
  const handlePasswordChange = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setMessageType("error");
      setMessage("New passwords do not match.");
      return;
    }

    try {
      await changePassword({
        oldPassword: passwordForm.oldPassword,
        newPassword: passwordForm.newPassword,
      });

      setPasswordForm({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      setMessageType("success");
      setMessage("Password changed successfully.");
    } catch (err) {
      console.error(err);
      setMessageType("error");
      setMessage("Failed to change password.");
    }
  };

  return (
    <div className="space-y-10 max-w-3xl">
      <h1 className="text-3xl font-bold">User Settings</h1>

      {/* MESSAGE BANNER */}
      {message && (
        <p
          className={`px-4 py-2 rounded-lg font-medium ${
            messageType === "success"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {message}
        </p>
      )}

      {/* -------------------------------- PROFILE -------------------------------- */}
      <div className="bg-white p-6 rounded-xl shadow space-y-4">
        <h2 className="text-xl font-semibold mb-2">Profile</h2>

        <div className="space-y-1">
          <label className="text-sm font-medium">Username</label>
          <input
            className="w-full border px-3 py-2 rounded-lg"
            value={profile.username}
            onChange={(e) =>
              setProfile({ ...profile, username: e.target.value })
            }
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium">Email</label>
          <input
            className="w-full border px-3 py-2 rounded-lg"
            value={profile.email}
            onChange={(e) =>
              setProfile({ ...profile, email: e.target.value })
            }
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium">Phone Number</label>
          <input
            className="w-full border px-3 py-2 rounded-lg bg-gray-100"
            value={profile.phoneNumber}
            disabled
          />
        </div>

        <button
          onClick={handleUpdateProfile}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg mt-4"
        >
          Save Changes
        </button>
      </div>

      {/* ------------------------------ CHANGE PASSWORD ------------------------------ */}
      <div className="bg-white p-6 rounded-xl shadow space-y-4">
        <h2 className="text-xl font-semibold mb-2">Change Password</h2>

        <div className="space-y-1">
          <label className="text-sm font-medium">Old Password</label>
          <input
            type="password"
            className="w-full border px-3 py-2 rounded-lg"
            value={passwordForm.oldPassword}
            onChange={(e) =>
              setPasswordForm({
                ...passwordForm,
                oldPassword: e.target.value,
              })
            }
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium">New Password</label>
          <input
            type="password"
            className="w-full border px-3 py-2 rounded-lg"
            value={passwordForm.newPassword}
            onChange={(e) =>
              setPasswordForm({
                ...passwordForm,
                newPassword: e.target.value,
              })
            }
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium">Confirm Password</label>
          <input
            type="password"
            className="w-full border px-3 py-2 rounded-lg"
            value={passwordForm.confirmPassword}
            onChange={(e) =>
              setPasswordForm({
                ...passwordForm,
                confirmPassword: e.target.value,
              })
            }
          />
        </div>

        <button
          onClick={handlePasswordChange}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg mt-4"
        >
          Update Password
        </button>
      </div>
    </div>
  );
};

export default Settings;
