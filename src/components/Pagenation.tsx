"use client";

import React from 'react'
import ReactPaginate from 'react-paginate';
import classes from "./Pagenation.module.scss";

type HandlePageClickProps = {
    handlePageClick: (event: { selected: number }) => void;
    pageCount:number;
}

const Pagenation = ({handlePageClick,pageCount}:HandlePageClickProps) => {
  return (
    <div>
    <ReactPaginate 
    className={classes.pagenate}
    nextLabel="次 >"
    onPageChange={handlePageClick}
    pageRangeDisplayed={3}
    marginPagesDisplayed={2}
    pageCount={pageCount}
    previousLabel="< 前"
    pageClassName="page-item"
    pageLinkClassName="page-link"
    previousClassName="page-item"
    previousLinkClassName="page-link"
    nextClassName="page-item"
    nextLinkClassName="page-link"
    breakLabel="..."
    breakClassName="page-item"
    breakLinkClassName="page-link"
    containerClassName="pagination"
    activeClassName="active"/>
    </div>
  )
}

export default Pagenation