import React, { useEffect, useState, useContext } from "react"; // useContext ઉમેર્યું
import "./CreatePostForm.css";
import { useLocation, useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from 'uuid';
import loader from '../assets/loading circle.gif';
import { ModeContext } from "../Contexts/ModeContext"; // Context import કર્યું

function CreatePostForm() {
  const ctx = useContext(ModeContext); // Context નો ઉપયોગ
  const [createPostFormData, setCreatePostFormData] = useState({
    title: "",
    body: "",
    image: ""
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const location = useLocation();
  const editPostId = location.state?.id || null;
  const [loading, setLoading] = useState(false);

  const handleChange = (field, value) => {
    setErrors((e) => ({ ...e, [field]: "" }));
    setCreatePostFormData({ ...createPostFormData, [field]: value });
  };

  useEffect(() => {
    if (!editPostId) return;
    const posts = JSON.parse(localStorage.getItem("postData")) || [];
    const postToEdit = posts.find((p) => p.id === editPostId);
    if (postToEdit) {
      setCreatePostFormData({
        title: postToEdit.title,
        body: postToEdit.body,
        image: postToEdit.image,
      });
    }
  }, [editPostId]);

  const handleImageChange = (file) => {
    if (!file) return;
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp", "image/avif"];
    if (!allowedTypes.includes(file.type)) {
      setErrors((e) => ({ ...e, image: "Only JPG, JPEG, PNG images are allowed" }));
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setCreatePostFormData({ ...createPostFormData, image: reader.result });
      setErrors((e) => ({ ...e, image: "" }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!createPostFormData.title.trim()) newErrors.title = "Title is required";
    if (!createPostFormData.body.trim()) newErrors.body = "Description is required";
    if (!createPostFormData.image) newErrors.image = "Image is required";
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setLoading(true);
    const existingPosts = JSON.parse(localStorage.getItem("postData")) || [];

    if (editPostId) {
      const updatedPosts = existingPosts.map((p) =>
        p.id === editPostId ? { ...p, ...createPostFormData } : p
      );
      localStorage.setItem("postData", JSON.stringify(updatedPosts));
      navigate("/");
      return;
    }

    const updatedPosts = [...existingPosts, { id: uuidv4(), ...createPostFormData }];
    localStorage.setItem("postData", JSON.stringify(updatedPosts));

    setTimeout(() => {
      navigate("/");
    }, 1200);
  }

  return (
    /* મુખ્ય div માં ctx.mode ક્લાસ ઉમેર્યો */
    <div className={`page ${ctx.mode}`}>
      {loading && (
        <div className="loader">
          <img src={loader} alt="Loading..." className="loader-img" />
        </div>
      )}
      
   
      <form className={`box ${ctx.mode}`} onSubmit={handleSubmit}>
        <h2>{editPostId ? "Edit Post" : "Let's Create New Post"}</h2>

        <input 
          type="text" 
          placeholder="Enter Title" 
          value={createPostFormData.title} 
          onChange={(e) => handleChange("title", e.target.value)} 
        />
        {errors.title && <span className="error">{errors.title}</span>}

        <textarea 
          placeholder="Enter Description" 
          value={createPostFormData.body} 
          onChange={(e) => handleChange("body", e.target.value)}>
        </textarea>
        {errors.body && <span className="error">{errors.body}</span>}

        <input 
          type="file" 
          accept="image/jpeg,image/png,image/jpg" 
          onChange={(e) => handleImageChange(e.target.files[0])} 
        />
        {errors.image && <span className="error">{errors.image}</span>}

        {createPostFormData.image && (
          <img src={createPostFormData.image} alt="preview" style={{ width: 200, borderRadius: 10, marginTop: '10px' }} />
        )}

        <div className="post-btn">
          {editPostId && (
            <button className="csl-btn" type="button" onClick={() => navigate("/")}>Cancel</button>
          )}
          <button className="up-btn">{editPostId ? "Update Post" : "Add Post"}</button>
        </div>
      </form>
    </div>
  );
}

export default CreatePostForm;