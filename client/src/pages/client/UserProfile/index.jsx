import React, { useState, useRef, useEffect } from "react";
import {
  Camera,
  Edit2,
  Trash2,
  User,
  Phone,
  MapPin,
  Save,
  X,
  Upload,
  Check,
  AlertCircle,
} from "lucide-react";
import axios from "axios";

const ProfileCard = () => {
  const initialFormState = {
    firstName: "",
    lastName: "",
    mobileNumber: "",
    address: "",
  };

  const [form, setForm] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [phone, setPhone] = useState("");
  const [image, setImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(true);
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [toast, setToast] = useState(null);

  const fileInputRef = useRef(null);
  const dragCounter = useRef(0);
  const API_BASE_URL = "http://localhost:5000/api";

  // Toast notification system
  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Fetch profile data from API
  useEffect(() => {
    let isMounted = true;

    const fetchProfile = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/profile`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        if (isMounted) {
          const profile = response.data.profile;
          setProfileData(profile);
          setIsFormVisible(!profile?.firstName);
          setPhone(profile?.mobileNumber || "");
          if (profile) {
            setForm({
              firstName: profile.firstName || "",
              lastName: profile.lastName || "",
              mobileNumber: profile.mobileNumber || "",
              address: profile.address || "",
            });
          }
        }
      } catch (error) {
        if (isMounted) {
          console.error("Error fetching profile:", error.message);
          showToast(
            error.response?.data?.message || "Failed to fetch profile",
            "error"
          );
        }
      }
    };

    fetchProfile();

    return () => {
      isMounted = false;
    };
  }, []);

  // Form validation
  const validateForm = () => {
    const newErrors = {};
    if (!form.firstName.trim()) newErrors.firstName = "First name is required";
    if (!form.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!phone || phone.length < 10)
      newErrors.mobileNumber = "Valid mobile number is required";
    if (!form.address.trim()) newErrors.address = "Address is required";
    if (!imageFile && !profileData?.profileImage && !isEditing) {
      newErrors.image = "Profile image is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle input changes
  const handleInputChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handlePhoneChange = (value) => {
    setPhone(value);
    if (errors.mobileNumber) {
      setErrors((prev) => ({ ...prev, mobileNumber: "" }));
    }
  };

  // Image upload handling
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragIn = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current++;
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setDragActive(true);
    }
  };

  const handleDragOut = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current--;
    if (dragCounter.current === 0) {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    dragCounter.current = 0;
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageFile(e.dataTransfer.files[0]);
    }
  };

  const handleImageFile = (file) => {
    if (!file.type.startsWith("image/")) {
      showToast("Please upload a valid image file", "error");
      return;
    }
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = () => setImage(reader.result);
    reader.onerror = () => showToast("Error reading image file", "error");
    reader.readAsDataURL(file);
    if (errors.image) {
      setErrors((prev) => ({ ...prev, image: "" }));
    }
  };

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      handleImageFile(e.target.files[0]);
    }
  };

  // Form submission
  const onSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("firstName", form.firstName);
      formData.append("lastName", form.lastName);
      formData.append("mobileNumber", phone);
      formData.append("address", form.address);
      if (imageFile) {
        formData.append("profileImage", imageFile);
      }

      const response = await axios.put(`${API_BASE_URL}/profile`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setProfileData(response.data.profile);
      setIsFormVisible(false);
      setIsEditing(false);
      showToast(
        response.data.message ||
          (isEditing
            ? "Profile updated successfully!"
            : "Profile created successfully!")
      );

      handleCancel();
    } catch (error) {
      console.error("Error saving profile:", error.message);
      showToast(
        error.response?.data?.message || "Failed to save profile",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  // Edit profile
  const handleEdit = () => {
    setIsEditing(true);
    setIsFormVisible(true);
    if (profileData) {
      setForm({
        firstName: profileData.firstName || "",
        lastName: profileData.lastName || "",
        mobileNumber: profileData.mobileNumber || "",
        address: profileData.address || "",
      });
      setPhone(profileData.mobileNumber || "");
      setImage(
        profileData.profileImage ? `${API_BASE_URL}/${profileData.profileImage}` : null
      );
      setImageFile(null);
    }
  };

  // Delete profile
  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete your profile?"))
      return;

    setLoading(true);
    try {
      await axios.delete(`${API_BASE_URL}/profile`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setProfileData(null);
      setIsFormVisible(true);
      setIsEditing(false);
      handleCancel();
      showToast("Profile deleted successfully!");
    } catch (error) {
      console.error("Error deleting profile:", error.message);
      showToast(
        error.response?.data?.message || "Failed to delete profile",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  // Cancel editing
  const handleCancel = () => {
    setIsFormVisible(false);
    setIsEditing(false);
    setForm(initialFormState);
    setPhone("");
    setImage(null);
    setImageFile(null);
    setErrors({});
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 p-4 flex items-center justify-center">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl backdrop-blur-sm transition-all duration-500 transform ${
            toast.type === "success"
              ? "bg-emerald-500/90 text-white border border-emerald-400/50"
              : "bg-red-500/90 text-white border border-red-400/50"
          } animate-in slide-in-from-right-full`}
        >
          {toast.type === "success" ? (
            <Check size={20} />
          ) : (
            <AlertCircle size={20} />
          )}
          <span className="font-medium">{toast.message}</span>
        </div>
      )}

      <div className="w-full max-w-2xl">
        {isFormVisible ? (
          <div className="bg-white/80 backdrop-blur-xl border border-white/50 rounded-3xl shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-8 text-center">
              <h2 className="text-3xl font-bold text-white mb-2">
                {isEditing ? "Edit Your Profile" : "Create Your Profile"}
              </h2>
              <p className="text-indigo-100">
                {isEditing
                  ? "Update your information below"
                  : "Fill in your details to get started"}
              </p>
            </div>

            <div className="p-8">
              {/* Image Upload Section */}
              <div className="flex justify-center mb-8">
                <div
                  className={`relative group ${
                    dragActive ? "scale-105" : ""
                  } transition-all duration-300`}
                  onDragEnter={handleDragIn}
                  onDragLeave={handleDragOut}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <div
                    className={`w-32 h-32 rounded-full overflow-hidden border-4 transition-all duration-300 ${
                      dragActive
                        ? "border-indigo-400 shadow-lg shadow-indigo-400/50"
                        : "border-gray-200 group-hover:border-indigo-300"
                    }`}
                  >
                    <img
                      src={
                        image ||
                        (isEditing && profileData?.profileImage
                          ? `${API_BASE_URL}/${profileData.profileImage}`
                          : "https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg?auto=compress&cs=tinysrgb&w=400")
                      }
                      alt="Profile"
                      className="w-full h-full object-cover transition-all duration-300 group-hover:scale-110"
                      onError={(e) => {
                        e.target.src =
                          "https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg?auto=compress&cs=tinysrgb&w=400";
                      }}
                    />
                  </div>
                  <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
                    <div className="text-white text-center">
                      <Upload className="mx-auto mb-1" size={20} />
                      <p className="text-xs font-medium">Upload</p>
                    </div>
                  </div>
                  <label
                    htmlFor="image-upload"
                    className="absolute -bottom-1 -right-1 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-full p-2 cursor-pointer shadow-lg hover:scale-110 transition-transform duration-200"
                  >
                    <Camera size={16} />
                  </label>
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                    ref={fileInputRef}
                  />
                </div>
              </div>
              {errors.image && (
                <p className="text-red-500 text-sm text-center mb-6">
                  {errors.image}
                </p>
              )}

              <form onSubmit={onSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      First Name
                    </label>
                    <div className="relative">
                      <User
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                        size={18}
                      />
                      <input
                        type="text"
                        value={form.firstName}
                        onChange={(e) =>
                          handleInputChange("firstName", e.target.value)
                        }
                        className={`w-full pl-12 pr-4 py-3 bg-gray-50 border rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:bg-white transition-all duration-300 ${
                          errors.firstName
                            ? "border-red-300 focus:ring-red-200"
                            : "border-gray-200 focus:border-indigo-300 focus:ring-indigo-200"
                        }`}
                        placeholder="Enter first name"
                      />
                    </div>
                    {errors.firstName && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.firstName}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      Last Name
                    </label>
                    <div className="relative">
                      <User
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                        size={18}
                      />
                      <input
                        type="text"
                        value={form.lastName}
                        onChange={(e) =>
                          handleInputChange("lastName", e.target.value)
                        }
                        className={`w-full pl-12 pr-4 py-3 bg-gray-50 border rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:bg-white transition-all duration-300 ${
                          errors.lastName
                            ? "border-red-300 focus:ring-red-200"
                            : "border-gray-200 focus:border-indigo-300 focus:ring-indigo-200"
                        }`}
                        placeholder="Enter last name"
                      />
                    </div>
                    {errors.lastName && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.lastName}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Mobile Number
                  </label>
                  <div className="relative">
                    <Phone
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                      size={18}
                    />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => handlePhoneChange(e.target.value)}
                      className={`w-full pl-12 pr-4 py-3 bg-gray-50 border rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:bg-white transition-all duration-300 ${
                        errors.mobileNumber
                          ? "border-red-300 focus:ring-red-200"
                          : "border-gray-200 focus:border-indigo-300 focus:ring-indigo-200"
                      }`}
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                  {errors.mobileNumber && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.mobileNumber}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Address
                  </label>
                  <div className="relative">
                    <MapPin
                      className="absolute left-4 top-4 text-gray-400"
                      size={18}
                    />
                    <textarea
                      value={form.address}
                      onChange={(e) =>
                        handleInputChange("address", e.target.value)
                      }
                      rows={4}
                      className={`w-full pl-12 pr-4 py-3 bg-gray-50 border rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:bg-white transition-all duration-300 resize-none ${
                        errors.address
                          ? "border-red-300 focus:ring-red-200"
                          : "border-gray-200 focus:border-indigo-300 focus:ring-indigo-200"
                      }`}
                      placeholder="Enter your address"
                    />
                  </div>
                  {errors.address && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.address}
                    </p>
                  )}
                </div>

                <div className="flex xs:flex-col gap-4 pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold py-3 px-6 rounded-xl hover:from-indigo-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-400/50 transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <Save size={18} />
                    )}
                    {loading
                      ? "Saving..."
                      : isEditing
                      ? "Update Profile"
                      : "Save Profile"}
                  </button>

                  {isEditing && (
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="flex-1 bg-gray-100 text-gray-700 font-semibold py-3 px-6 rounded-xl border border-gray-200 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-all duration-300 transform hover:scale-[1.02] flex items-center justify-center gap-2"
                    >
                      <X size={18} />
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        ) : (
          <div className="bg-white/80 backdrop-blur-xl border border-white/50 rounded-3xl shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">
                  Profile Details
                </h2>
                <div className="flex gap-3">
                  <button
                    onClick={handleEdit}
                    className="p-2 bg-white/20 text-white rounded-xl hover:bg-white/30 transition-all duration-200 transform hover:scale-110"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={handleDelete}
                    disabled={loading}
                    className="p-2 bg-white/20 text-white rounded-xl hover:bg-white/30 transition-all duration-200 transform hover:scale-110 disabled:opacity-50"
                  >
                    {loading ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <Trash2 size={18} />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="p-8">
              <div className="text-center mb-8">
                <div className="w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-gray-200 shadow-xl">
                  <img
                    src={
                      profileData?.profileImage
                        ? `${API_BASE_URL}/${profileData.profileImage}`
                        : "https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg?auto=compress&cs=tinysrgb&w=400"
                    }
                    alt="Profile"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src =
                        "https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg?auto=compress&cs=tinysrgb&w=400";
                    }}
                  />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mt-4">
                  {profileData?.firstName} {profileData?.lastName}
                </h3>
              </div>

              <div className="space-y-4">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
                  <div className="flex items-center gap-3 mb-2">
                    <Phone className="text-blue-600" size={18} />
                    <span className="text-gray-600 font-medium">
                      Mobile Number
                    </span>
                  </div>
                  <p className="text-gray-800 text-lg pl-7">
                    {profileData?.mobileNumber}
                  </p>
                </div>

                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-100">
                  <div className="flex items-center gap-3 mb-2">
                    <MapPin className="text-green-600" size={18} />
                    <span className="text-gray-600 font-medium">Address</span>
                  </div>
                  <p className="text-gray-800 text-lg pl-7">
                    {profileData?.address}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileCard;