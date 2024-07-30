import React from "react";
import Board from "./Board";
import "../css/MiniBoard.css"; // 새로운 CSS 파일을 불러옵니다

const MiniBoard = ({ type }) => {
  return (
    <div className="mini-board">
      <Board
        type={type}
        showFilters={false}
        maxItems={10}
        showPagination={false}
        showWriteButton={false}
        showTypeAndDate={false}
        tableClassName="mini-table" // 추가된 부분
      />
    </div>
  );
};

export default MiniBoard;
