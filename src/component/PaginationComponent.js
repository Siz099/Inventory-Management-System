import React from "react";
import { Pagination } from "antd"; // Import Ant Design Pagination

const PaginationComponent = ({ currentPage, totalPages, onPageChange }) => {
  return (
    <div className="pagination-container">
      <Pagination
        current={currentPage} // Current page number
        total={totalPages * 10} // Total number of items, assuming 10 items per page
        pageSize={10} // Number of items per page
        onChange={onPageChange} // Function to call when page is changed
        showSizeChanger={false} // Hide page size changer if you don't want to let users change it
        showQuickJumper // Allow jumping to specific page
        size="default" // Pagination size, can be 'small', 'default', or 'large'
      />
    </div>
  );
};

export default PaginationComponent;
