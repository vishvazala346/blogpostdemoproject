import "./Pagination.css";

const Pagination = ({
  currentPage,
  totalPages,
  onPrev,
  onNext,
  postsPerPage,
  setPostsPerPage,
}) => {
  return (
    <div className="pagination">
      <select
        value={postsPerPage}
        onChange={(e) => setPostsPerPage(Number(e.target.value))}
      >
        <option value="10">10</option>
        <option value="25">25</option>
        <option value="50">50</option>
        <option value="100">100</option>
      </select>

      <button
        className="page-btn"
        onClick={onPrev}
        disabled={currentPage === 1}
      >
        PREV
      </button>

      <span className="page-info">
        {currentPage} of {totalPages}
      </span>

      <button
        className="page-btn"
        onClick={onNext}
        disabled={currentPage === totalPages}
      >
        NEXT
      </button>
    </div>
  );
};

export default Pagination;
