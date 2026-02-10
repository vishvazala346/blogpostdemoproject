import { useState, useEffect, useContext } from "react"; // useContext ઉમેર્યું
import "./Explore.css";
import { IoSearchSharp } from "react-icons/io5";
import Card from "./Card";
import Pagination from "./Pagination";
import { toast } from "react-toastify";
import ConfirmationModel from "./ConfirmationModel";
import { ModeContext } from "../Contexts/ModeContext"; // Context ઇમ્પોર્ટ કરો

const Explore = () => {
  const ctx = useContext(ModeContext); // ModeContext નો ઉપયોગ
  const [postdata, setPostdata] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterPost, setFilterPost] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage, setPostsPerPage] = useState(10);
  const [showForm, setShowForm] = useState(false);
  const [postId, setPostId] = useState();
  const [showModal, setShowModal] = useState(false);

  const loggedInUserData = JSON.parse(localStorage.getItem("loginData")) || {};

  const [explorePostFormData, setExlorePostFormData] = useState({
    title: "",
    body: ""
  });
  const [errors, setErrors] = useState({});

  const getCreatePostData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        "https://697dc68d97386252a269074b.mockapi.io/Blogpostdata/",
        { method: "GET" } 
      );
      if (!response.ok) throw new Error("Invalid Request");
      const data = await response.json();
      const reversedData = [...data].reverse();
      setPostdata(reversedData);
      setFilterPost(reversedData); 
      setIsLoading(false);
    } catch (error) {
      console.error("Get API Error:", error.message);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getCreatePostData();
  }, []);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearch(value);
    setCurrentPage(1);
    const result = postdata.filter(
      (item) =>
        item.title.toLowerCase().includes(value.toLowerCase()) ||
        item.body.toLowerCase().includes(value.toLowerCase())
    );
    setFilterPost(result);
  };

  const handleChange = (field, value) => {
    setErrors((prev) => ({ ...prev, [field]: "" }));
    setExlorePostFormData({ ...explorePostFormData, [field]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!explorePostFormData.title.trim()) newErrors.title = "Title is required";
    if (!explorePostFormData.body.trim()) newErrors.body = "Body is required";
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    try {
      setIsLoading(true);
      const url = postId
        ? `https://697dc68d97386252a269074b.mockapi.io/Blogpostdata/${postId}`
        : `https://697dc68d97386252a269074b.mockapi.io/Blogpostdata/`;

      const response = await fetch(url, {
        method: postId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: explorePostFormData.title,
          body: explorePostFormData.body,
          image: postId ? undefined : `https://picsum.photos/seed/${Date.now()}/600/400`,
        }),
      });

      if (!response.ok) throw new Error("Request failed");
      toast.success(postId ? "Post Updated Successfully" : "Post Created Successfully");
      getCreatePostData();
      setShowForm(false);
      setPostId(null);
      setExlorePostFormData({ title: "", body: "" });
    } catch (error) {
      console.error("Submit Error:", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const postDataGetById = async (id) => {
    try {
      setIsLoading(true);
      setPostId(id);
      const response = await fetch(`https://697dc68d97386252a269074b.mockapi.io/Blogpostdata/${id}`);
      const data = await response.json();
      setExlorePostFormData({ title: data.title || "", body: data.body || "" });
      setShowForm(true);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const openDeleteModal = (id) => {
    setPostId(id);
    setShowModal(true);
  };

  const handleDelete = async () => {
    try {
      setIsLoading(true);
      await fetch(`https://697dc68d97386252a269074b.mockapi.io/Blogpostdata/${postId}`, { method: "DELETE" });
      toast.success("Post Deleted Successfully");
      getCreatePostData();
    } finally {
      setShowModal(false);
      setPostId(null);
      setIsLoading(false);
    }
  };

  const startIndex = (currentPage - 1) * postsPerPage;
  const totalPage = Math.ceil(filterPost.length / postsPerPage);

  return (
    <div className={`explore-page ${ctx.mode}`}>
      <div className="explore-header">
        <h1>Explore Posts</h1>
        <div className="search-box">
          <IoSearchSharp className="search-icon" />
          <input
            type="text"
            placeholder="Search Post..."
            value={search}
            onChange={handleSearch}
          />
        </div>
      </div>

      {!showForm && loggedInUserData?.role === "admin" && (
        <button type="button" className="createform" onClick={() => setShowForm(true)}>
          Create Form
        </button>
      )}

      {showForm && (
        <form className="explore-add" onSubmit={handleSubmit}>
          <div className="explore-adddata">
            <input
              type="text"
              placeholder="Enter Title"
              className="explore-input"
              value={explorePostFormData.title}
              onChange={(e) => handleChange("title", e.target.value)}
            />
            {errors.title && <span className="error-text">{errors.title}</span>}
            <textarea
              placeholder="Enter Body"
              className="explore-input"
              value={explorePostFormData.body}
              onChange={(e) => handleChange("body", e.target.value)}
            />
            {errors.body && <span className="error-text">{errors.body}</span>}
          </div>
          <div className="btn-explore">
            <button type="submit" className="btn btn1-explore">{postId ? "Update" : "Submit"}</button>
            <button type="button" className="btn btn2-explore" onClick={() => setShowForm(false)}>Cancel</button>
          </div>
        </form>
      )}

      <div className="explore-container">
        {isLoading ? (
          <div className="loading-state"><h1>Loading....</h1></div>
        ) : filterPost.length > 0 ? (
          filterPost.slice(startIndex, startIndex + postsPerPage).map((item) => (
            <Card
              key={item.id}
              title={item.title}
              desc={item.body}
              image={item.image}
              id={item.id}
              from="explore"
              onDelete={() => openDeleteModal(item?.id)}
              onEdit={() => postDataGetById(item.id)}
            />
          ))
        ) : (
          <div className="no-post"><p>Post Not Found</p></div>
        )}
      </div>

      {filterPost.length > 0 && !isLoading && (
        <Pagination
          currentPage={currentPage}
          totalPage={totalPage}
          onPrev={() => setCurrentPage(currentPage - 1)}
          onNext={() => setCurrentPage(currentPage + 1)}
          postsPerPage={postsPerPage}
          setPostsPerPage={setPostsPerPage}
        />
      )}
      {showModal && (
        <ConfirmationModel
          titlemodel="Delete Post?"
          descmodel="Are you sure you want to delete this post?"
          onClose={() => setShowModal(false)}
          onConfirm={handleDelete}
          confirmBtnText="Delete"
        />
      )}
    </div>
  );
};

export default Explore;