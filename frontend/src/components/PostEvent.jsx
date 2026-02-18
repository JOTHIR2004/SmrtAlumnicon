import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function PostEvent() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const [form, setForm] = useState({
    title: "",
    date: "",
    description: ""
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);

    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("date", form.date);
      formData.append("description", form.description);
      formData.append("postedBy", user._id?user._id :"By Dept");
      formData.append("image", image);

      await axios.post(
        "http://localhost:5000/api/events/add",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" }
        }
      );

      alert("Event posted successfully!");
      // navigate("/alumni/home");
    } catch (err) {
      console.error(err);
      alert("Failed to post event");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md p-8 rounded-2xl shadow-xl">
        <h2 className="text-2xl font-bold text-emerald-700 text-center mb-6">
          Post Events
        </h2>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <input
            type="text"
            name="title"
            placeholder="Event Title"
            value={form.title}
            onChange={handleChange}
            required
            className="p-3 border border-gray-300 rounded-lg focus:border-emerald-500 outline-none"
          />

          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            required
            className="p-3 border border-gray-300 rounded-lg focus:border-emerald-500 outline-none"
          />

          <textarea
            name="description"
            placeholder="Event Description"
            value={form.description}
            onChange={handleChange}
            required
            className="p-3 border border-gray-300 rounded-lg focus:border-emerald-500 outline-none resize-none h-28"
          />

          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            required
            className="border border-gray-300 rounded-lg p-2 cursor-pointer"
          />

          {preview && (
            <img
              src={preview}
              alt="Preview"
              className="w-full h-44 object-cover rounded-lg border border-gray-300 mt-2"
            />
          )}

          <button
            type="submit"
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-lg transition"
          >
            Post Event
          </button>
        </form>
      </div>
    </div>
  );
}

export default PostEvent;
