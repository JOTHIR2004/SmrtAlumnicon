import { useState } from "react";
import axios from "axios";

const AddBanner = () => {
  const [image, setImage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("image", image);

    await axios.post(
      "https://smrtalumnicon.onrender.com/api/admin-banners/add",
      formData
    );

    alert("Banner uploaded");
  };

  return (
    <form onSubmit={handleSubmit} className="p-6">
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setImage(e.target.files[0])}
        required
      />

      <button className="mt-4 bg-green-500 text-black px-6 py-2 rounded-xl">
        Upload
      </button>
    </form>
  );
};

export default AddBanner;
