import { useEffect, useState } from "react";
import "./EditProfileModal.css";

function EditProfileModal({ onClose, userId, onSave }) {
  const [formData, setFormData] = useState({
    fullname: "",
    mobileNo: "",
    role: "",
    otp: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (userId) {
      fetchUserById();
    }
  }, [userId]);

  const fetchUserById = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://697dc68d97386252a269074b.mockapi.io/Users/${userId}`
      );
      const data = await response.json();

      console.log("Fetched user data:", data); // DEBUG

      setFormData({
        // Notice: using the exact key from your API response
        fullname: data?.fullname || "",
        mobileNo: data?.mobileNo || "",
        role: data?.role || "",
        otp: data?.otp || "",
      });
    } catch (error) {
      console.error("Fetch user error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "mobileNo" && !/^\d*$/.test(value)) return;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      setLoading(true);

      const payload = {
        Fullname: formData.fullname, // Use the same API key as your backend
        mobileNo: formData.mobileNo,
      };

      await fetch(
        `https://697dc68d97386252a269074b.mockapi.io/Users/${userId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const storedUser = JSON.parse(localStorage.getItem("loginData")) || {};
      const updatedUser = { ...storedUser, ...payload };
      localStorage.setItem("loginData", JSON.stringify(updatedUser));

      onSave(updatedUser);
    } catch (error) {
      console.error("Save error:", error);
    } finally {
      setLoading(false);
      onClose();
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Edit Profile</h2>

        <input
          type="text"
          name="fullname"
          placeholder="Full Name"
          value={formData.fullname}
          onChange={handleChange}
        />

        <input
          type="tel"
          name="mobileNo"
          placeholder="Mobile Number"
          minLength={10}
          maxLength={10}
          value={formData.mobileNo}
          onChange={handleChange}
        />

        <select name="role" disabled value={formData.role}>
          <option value="admin">Admin</option>
          <option value="user">User</option>
        </select>

        <input
          type="text"
          name="otp"
          disabled
          placeholder="Enter OTP"
          value={formData.otp}
        />

        <div className="modal-buttons">
          <button className="cancel" onClick={onClose} disabled={loading}>
            Cancel
          </button>

          <button className="save" onClick={handleSave} disabled={loading}>
            save
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditProfileModal;
