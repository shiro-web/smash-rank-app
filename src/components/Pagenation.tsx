import React from "react";
import ReactPaginate from "react-paginate";

type HandlePageClickProps = {
  handlePageClick: (event: { selected: number }) => void;
  pageCount: number;
};

const Pagenation = ({ handlePageClick, pageCount }: HandlePageClickProps) => {
  return (
    <div className="flex justify-center mt-6">
      <ReactPaginate
        nextLabel="次 >"
        onPageChange={handlePageClick}
        pageRangeDisplayed={3}
        marginPagesDisplayed={2}
        pageCount={pageCount}
        previousLabel="< 前"
        pageClassName="page-item"
        pageLinkClassName="page-link px-4 py-2 rounded-md border border-gray-300 hover:bg-[#333] hover:text-white transition"
        previousClassName="page-item"
        previousLinkClassName="page-link px-4 py-2 rounded-md border border-gray-300 hover:bg-[#333] hover:text-white transition"
        nextClassName="page-item"
        nextLinkClassName="page-link px-4 py-2 rounded-md border border-gray-300 hover:bg-[#333] hover:text-white transition"
        breakLabel="..."
        breakClassName="page-item"
        breakLinkClassName="page-link px-4 py-2 rounded-md"
        containerClassName="pagination flex gap-1 items-center"
        activeClassName="active bg-[#333] py-2 text-white rounded-md"
      />
    </div>
  );
};

export default Pagenation;
