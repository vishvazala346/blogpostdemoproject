import { useState, useEffect, useContext } from "react"; // useContext ઉમેર્યું
import "./PostDetail.css";
import img from "../assets/im1.jpg";
import { useNavigate, useParams } from "react-router-dom";
import ConfirmationModel from "./ConfirmationModel";
import { toast } from "react-toastify";
import { ModeContext } from "../Contexts/ModeContext"; // Context import કરો

function PostDetail() {
    const ctx = useContext(ModeContext); // ModeContext નો ઉપયોગ
    const [showModel, setShowModel] = useState(false);
    const postData = JSON.parse(localStorage.getItem("postData")) || [];
    const { postId } = useParams();
    const [currentPost, setCurrentPost] = useState({});
    const loggedInUserData = JSON.parse(localStorage.getItem("loginData")) || {};

    const navigate = useNavigate();

    useEffect(() => {
        const filtered = postData.find(card => String(card.id) === String(postId));
        if (filtered) setCurrentPost(filtered);
    }, [postId]);

    const showModelHandler = () => { setShowModel(true); };
    const hideModelHandler = () => { setShowModel(false); };

    const handleDelete = () => {
        const updatedPostData = postData.filter(post => String(post.id) !== String(postId));
        localStorage.setItem("postData", JSON.stringify(updatedPostData));
        toast.success("Post Deleted Successfully");
        setShowModel(false);
        navigate("/");
    };

    const handleEdit = () => {
        navigate("/CreatePostForm", { state: { id: currentPost.id } });
    }

    return (
        <>
            {/* અહીં ctx.mode ક્લાસ ઉમેર્યો છે */}
            <div className={`post-detail ${ctx.mode}`}>
                <div className="post-card">
                    <img src={currentPost.image || img} className="post-image" alt="post" />
                    <div className="post-content">
                        <h2>{currentPost.title}</h2>
                        <p>{currentPost.body}</p>

                        {loggedInUserData?.role === "admin" && (
                            <div className="post-actions">
                                <button className="btn edit" onClick={handleEdit}>Edit</button>
                                <button className="btn delete" onClick={showModelHandler}>Delete</button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {showModel && (
                <ConfirmationModel
                    titlemodel="Delete?"
                    descmodel="Are You Sure??"
                    onClose={hideModelHandler}
                    onConfirm={handleDelete}
                    confirmBtnText="Delete" />
            )}
        </>
    );
}

export default PostDetail;