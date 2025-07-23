import React, { useState, useEffect } from "react";
import { fetchUserDataApi, updateUserProfileApi, uploadProfilePictureApi } from "../../apis/Api"; // Adjust the path as needed
import './ProfileEdit.css';
import { toast, Toaster } from 'react-hot-toast';
import Navbar from '../../components/NavBar';

const ProfileEdit = () => {
  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    phone: "",
    profilePicture: null,
  });
  const [previewImage, setPreviewImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const result = await fetchUserDataApi();
        if (result.success) {
          const { userName, email, phone, profilePicture } = result.user;
          setFormData({ userName, email, phone, profilePicture });
          if (profilePicture) {
            setPreviewImage(`https://localhost:5000/profile_pictures/${profilePicture}`);
          }
        } else {
          throw new Error(result.message || "Failed to fetch user data");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast.error("Failed to load user data. Please try again later.");
      }
    };

    fetchUserData();
  }, []);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle file input changes with validation
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type: Only allow .png, .jpg, and .jpeg
      const fileExtension = file.name.split('.').pop().toLowerCase();
      if (fileExtension !== 'png' && fileExtension !== 'jpg' && fileExtension !== 'jpeg') {
        toast.error("Only PNG and JPG files are allowed!");
        e.target.value = ""; // Reset the file input
        return;
      }

      // Reject .js files explicitly
      if (fileExtension === 'js') {
        toast.error("JavaScript files are not allowed!");
        e.target.value = ""; // Reset the file input
        return;
      }

      setFormData((prev) => ({ ...prev, profilePicture: file }));

      // Preview the selected image
      const reader = new FileReader();
      reader.onloadend = () => setPreviewImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  // Submit the form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("User is not authenticated.");
      setIsLoading(false);
      return;
    }

    try {
      let profilePictureName = formData.profilePicture;
      if (formData.profilePicture instanceof File) {
        const pictureFormData = new FormData();
        pictureFormData.append("profilePicture", formData.profilePicture);

        const uploadResult = await uploadProfilePictureApi(pictureFormData);
        profilePictureName = uploadResult.profilePicture;
      }

      const updateData = {
        userName: formData.userName,
        email: formData.email,
        phone: formData.phone,
        profilePicture: profilePictureName,
      };

      const updateResult = await updateUserProfileApi(updateData);

      if (updateResult.success) {
        toast.success("Profile updated successfully!");
      } else {
        throw new Error(updateResult.message || "Failed to update profile.");
      }
    } catch (updateError) {
      toast.error(updateError.message || "Error updating profile.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="profile-edit-page">
      <Navbar className="navbar" />
      <Toaster position="top-center" reverseOrder={false} />
      <div className="profile-edit-container">
        <div className="profile-edit-header">
          <h1>Edit Profile</h1>
        </div>
        <div className="profile-edit-content">
          <div className="profile-edit-form-container">
            <form onSubmit={handleSubmit} className="profile-edit-form">
              {previewImage && (
                <div className="mb-4 flex justify-center">
                  <img
                    src={previewImage}
                    alt="Profile Preview"
                    className="profile-picture-preview"
                  />
                </div>
              )}
              <div className="mb-4">
                <label className="block mb-2">Profile Picture</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="profile-edit-input"
                />
              </div>

              <div className="mb-4">
                <label className="block mb-2">Username</label>
                <input
                  type="text"
                  name="userName"
                  value={formData.userName}
                  onChange={handleInputChange}
                  className="profile-edit-input"
                  placeholder="Enter username"
                />
              </div>

              <div className="mb-4">
                <label className="block mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="profile-edit-input"
                  placeholder="Enter email"
                />
              </div>

              <div className="mb-4">
                <label className="block mb-2">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="profile-edit-input"
                  placeholder="Enter phone number"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`profile-edit-button ${
                  isLoading ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"
                }`}
              >
                {isLoading ? "Updating..." : "Update Profile"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileEdit;
