  import React, { useState, useEffect, useContext } from "react"; 
  import Card from "../Components/Card";
  import ConfirmationModel from "../Components/ConfirmationModel";
  import { useNavigate } from "react-router-dom";
  import { toast } from "react-toastify";
  import icon from '../assets/top-scroll.jpg';
  import { ModeContext } from "../Contexts/ModeContext"; 

  export function HomePage() {
    const ctx = useContext(ModeContext); 
    const [allPostData, setAllPostData] = useState([]);
    const [showModel, setShowModel] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
      const storedData = JSON.parse(localStorage.getItem("postData")) || [];
      setAllPostData(storedData);
    }, []);

    const scrollToSelection = (id) => {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    };

    const openDeleteModel = (index) => {
      setSelectedIndex(index);
      setShowModel(true);
    };

    const hideModelHandler = () => {
      setShowModel(false);
      setSelectedIndex(null);
    };

    const confirmDelete = () => {
      const updatedPostData = allPostData.filter((_, i) => i !== selectedIndex);
      setAllPostData(updatedPostData);
      localStorage.setItem("postData", JSON.stringify(updatedPostData));
      toast.success("Post Deleted Successfully");
      hideModelHandler();
    };

    const clickHandler = (id) => navigate(`/posts/${id}`);

    const handleEdit = (id) => {
      navigate("/CreatePostForm", { state: { id } });
    };

    return (
      
      <div className={`page-container ${ctx.mode}`}>
        <span id="top"></span>
        <h1 className="page-title">Created Posts</h1>

        <div className="created-posts">
          {allPostData.length === 0 ? (
            <p style={{ textAlign: "center" }}>No Data Found</p>
          ) : (
            allPostData.map((card, index) => (
              <Card
                key={card.id}
                image={card.image}
                title={card.title}
                desc={card.body}
                onDelete={() => openDeleteModel(index)}
                onRedirect={() => clickHandler(card.id)}
                onEdit={() => handleEdit(card.id)}
              />
            ))
          )}

          <img src={icon} onClick={() => scrollToSelection('top')} className="btn-scroll" alt="scroll" />
        </div>

        {showModel && (
          <ConfirmationModel
            titlemodel="Delete?"
            descmodel="Are you sure you want to delete this post?"
            onClose={hideModelHandler}
            onConfirm={confirmDelete}
            confirmBtnText="Delete"
          />
        )}
      </div>
    );
  }