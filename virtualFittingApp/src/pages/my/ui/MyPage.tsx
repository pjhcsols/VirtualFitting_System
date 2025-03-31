import React from "react";
import { useNavigate } from "react-router-dom";

function MyPage() {
  const navigate = useNavigate();
  const userName = "user1";

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-96 bg-white shadow-lg p-6 rounded-lg">
        <h2 className="text-xl font-semibold text-center mb-4">마이페이지</h2>
        <div className="flex flex-col items-center">
          <button
            onClick={() => navigate("/myPage/detail")}
            className="text-lg font-medium text-blue-500 hover:underline"
          >
            {userName}
          </button>
          <div className="mt-4 flex w-full justify-around border-t pt-4">
            <span className="text-gray-700">포인트</span>
            <span className="text-gray-700">쿠폰</span>
            <span className="text-gray-700">후기 작성</span>
          </div>
        </div>
        <div className="mt-6 space-y-4">
          <button className="w-full p-3 bg-gray-100 rounded-lg text-center">주문내역</button>
          <button className="w-full p-3 bg-gray-100 rounded-lg text-center">취소/반품/교환 내역</button>
          <button className="w-full p-3 bg-gray-100 rounded-lg text-center">좋아요</button>
        </div>
      </div>
    </div>
  );
};

export { MyPage };