import React from "react";
import "./MyPageDetail.css";

const MypageDetail: React.FC = () => {
  // const { userData } = useUserData();
  // const [selectedFile, setSelectedFile] = useState<File | null>(null);
  // const [userImg, setUserImg] = useState<string>(initialUserImg);
  // const [isUploaded, setIsUploaded] = useState<boolean>(true);

  // const storedUserInfo = localStorage.getItem("user_info");
  // const userInfo = storedUserInfo ? JSON.parse(storedUserInfo) : null;
  // const userId = userInfo?.userId;

  // useEffect(() => {
  //   const fetchProfileImage = async () => {
  //     if (!userId) return;
  //     try {
  //       const response = await API_BASILIUM.get(
  //         `/User/getProfileImage?userId=${userId}`,
  //         { responseType: "blob" },
  //       );
  //       if (response.data.size > 0) {
  //         const imageUrl = URL.createObjectURL(response.data);
  //         setUserImg(imageUrl);
  //         setIsUploaded(false);
  //       }
  //     } catch (error) {
  //       console.error("Error fetching profile image:", error);
  //     }
  //   };
  //   fetchProfileImage();
  // }, [userId]);

  // const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
  //   const file = event.target.files?.[0];
  //   if (file) {
  //     setSelectedFile(file);
  //     setUserImg(URL.createObjectURL(file));
  //     await handleImgSubmit(file);
  //   }
  // };

  // const handleImgSubmit = async (file: File) => {
  //   if (!userId) return;
  //   const formData = new FormData();
  //   formData.append("userId", userId);
  //   formData.append("file", file);

  //   try {
  //     await API_BASILIUM.post("/User/uploadProfileImage", formData);
  //     alert("이미지 업로드를 성공하였습니다.");
  //   } catch (error) {
  //     console.error("Error:", error);
  //     alert("이미지 업로드를 실패하였습니다.");
  //   }
  // };

  // return (
  //   <div className="mypage_detail_container">
  //     <div className="mypagedetail">
  //       <div className="mypage_detail_profile">
  //         <img
  //           className={isUploaded ? "initialProfileImg" : "uploadedProfileImg"}
  //           src={userImg}
  //           alt="User Image"
  //         />
  //       </div>
  //       <div className="mypage_detail_button_div">
  //         <button onClick={() => document.getElementById("fileInput")?.click()}>
  //           사진 변경
  //         </button>
  //         <input
  //           type="file"
  //           id="fileInput"
  //           style={{ display: "none" }}
  //           onChange={handleFileChange}
  //         />
  //       </div>
  //     </div>
  //     <div className="mypage_detail_info">
  //       <table className="mypage_detail_info_table">
  //         <tbody></tbody>
  //       </table>
  //     </div>
  //   </div>
  // );
  return <div></div>;
};

export { MypageDetail };
