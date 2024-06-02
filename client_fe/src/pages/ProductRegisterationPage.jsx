    import React, { useState, useRef } from "react";
    import HeaderBottom from "../components/Header_Bottom";
    import './ProductRegisterationPage.css';
    import CustomSelect from "../components/CustomSelect";
    import CheckBox from "../components/CheckBox";
    import CloseImg from "../assets/img/close.png";
    import { useNavigate } from "react-router-dom";
    import ServerAPI from "../API/ServerAPI.js";
    import Swal from "sweetalert2";

    const ProductRegisterationPage = () => {
        const navigate = useNavigate();
        const [imageUrl, setImageUrl] = useState("");
        const [detailedImageUrl, setDetailedImageUrl] = useState("");
        const imageInputRef = useRef(null);
        const detailedImageInputRef = useRef(null);
        const [inputValue, setInputValue] = useState({
            productName: "",
            productPrice: "",
            productTotalLength: "",
            productChest: "",
            productShoulder: "",
            productArm: "",
            productDesc: "",
            productCategory: "",
            categoryId: "",
            productMaterial: [],
            productSize: [],
            productColor: [],
            productPhotoUrl: [],
            productSubPhotoUrl: [],
        });

        const inputChangeHandler = (e, name) => {
            const {value} = e.target;
            let newValue = value;

            if (['productPrice', 'productTotalLength', 'productChest', 'productShoulder', 'productArm'].includes(name)) {
                newValue = parseInt(value, 10);
                // 변환 실패 시, NaN을 처리하여 기본값으로 설정
                if (isNaN(newValue)) {
                    newValue = "";
                }
            }

            setInputValue((prevInputValue) => ({
                ...prevInputValue,
                [name]:newValue,
            }));
        };

        const handleCategoryChange = ({key, value}) => {
            setInputValue((prevInputValue) => ({
                ...prevInputValue,
                productCategory: value,
                categoryId: key
            }));
        };

        const handleImageChange = (event) => {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setImageUrl(reader.result);
                    setInputValue(prevInputValue => ({
                        ...prevInputValue,
                        productPhotoUrl: [...prevInputValue.productPhotoUrl, file.name]
                    }));
                };
                reader.readAsDataURL(file); 
            }
        };

        const handleDetailedImageChange = (event) => {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setDetailedImageUrl(reader.result);
                    setInputValue(prevInputValue => ({
                        ...prevInputValue,
                        productSubPhotoUrl: [...prevInputValue.productSubPhotoUrl, file.name]
                    }));
                };
                reader.readAsDataURL(file);     
            }
        };

        const handleDeleteImage = () => {
            setImageUrl("");
            if (imageInputRef.current) {
                imageInputRef.current.value = "";
            }

            setInputValue(prevInputValue => ({
                ...prevInputValue,
                productPhotoUrl: []
            }));

            // setInputValue(prevInputValue => ({
            //     ...prevInputValue,
            //     productPhotoUrl: prevInputValue.productPhotoUrl.filter(url => url !== detailedImageUrl)
            // }));
        };

        const handleDeleteDetailedImage = () => {
            setDetailedImageUrl("");
            if (detailedImageInputRef.current) {
                detailedImageInputRef.current.value = "";
            }

            setInputValue(prevInputValue => ({
                ...prevInputValue,
                productSubPhotoUrl: []
            }));
        };

        const handleMaterialsChange = (selectedMaterials) => {
            setInputValue((prevInputValue) => ({
                ...prevInputValue,
                productMaterial: selectedMaterials,
            }));
        };

        const handleSizesChange = (selectedSizes) => {
            setInputValue((prevInputValue) => ({
                ...prevInputValue,
                productSize: selectedSizes,
            }));
        };

        const handleColorsChange = (selectedColors) => {
            setInputValue((prevInputValue) => ({
                ...prevInputValue,
                productColor: selectedColors,
            }));
        };

        const handleSubmit = async (e) => {
            e.preventDefault();
            
            const data = {
                productId: null,
                productCategory: {
                    categoryId: inputValue.categoryId
                },
                productName: inputValue.productName,
                productPrice: inputValue.productPrice,
                productMaterial: inputValue.productMaterial,
                productSize: inputValue.productSize,
                productColor: inputValue.productColor,
                productTotalLength: inputValue.productTotalLength,
                productChest: inputValue.productChest,
                productShoulder: inputValue.productShoulder,
                productArm: inputValue.productArm,
                productDesc: inputValue.productDesc,
                productPhotoUrl: inputValue.productPhotoUrl,
                productSubPhotoUrl: inputValue.productSubPhotoUrl,
                brandUser: {
                    userNumber: 1
                }
            };

            try {
                console.log("서버응답*******************8");
                const response = await ServerAPI.post('/normalUser', data);

                Swal.fire({
                    title: '상품등록 성공!',
                    icon: 'success',
                    confirmButtonColor: '#000',
                    confirmButtonText: '확인',
                }).then((result) => {
                    if (result.isConfirmed) {
                        navigate("/");
                    }
                });
            }
            catch (error) {
                Swal.fire({
                    title: '등록 실패!',
                    icon: 'error',
                    confirmButtonColor: '#000',
                    confirmButtonText: '확인',
                }).then((result) => {
                    if (result.isConfirmed) {
                        navigate('/productRegisteration');
                    }
                });
                console.error("서버와의 통신 중 오류 발생", error);
                console.log(data);
            }
        };
 
        const materialsOptions = ["COTTON", "POLYESTER", "WOOL", "FABRIC", "SILK"];
        const sizeOptions = ["XX", "S", "M", "L", "XL"];
        const colorOptions = ["BLACK", "WHITE", "GRAY", "BLUE", "RED", "YELLOW", "GREEN", "ORANGE"];
        const categoryOptions = [
            { key: 1, value: "티셔츠" },
            { key: 2, value: "긴팔" },
            { key: 3, value: "블라우스" },
            { key: 4, value: "니트" },
            { key: 5, value: "후드티" },
            { key: 6, value: "청바지" },
            { key: 7, value: "슬랙스" },
            { key: 8, value: "반바지" },
            { key: 9, value: "스커트" },
            { key: 10, value: "자켓" },
            { key: 11, value: "가디건" },
            { key: 12, value: "패딩" },
            { key: 13, value: "베스트" },
            { key: 14, value: "드레스" },
            { key: 15, value: "정장" },
            { key: 16, value: "한복" },
            { key: 17, value: "속옷" },
            { key: 18, value: "수영복" },
            { key: 19, value: "액세서리" },
        ];

        return (
            <div>
                <HeaderBottom />
                <div className="product-registration-page">
                    <h1 className="title">상품 등록</h1>
                </div>
                <div className="divider"></div>
                <div className="registration-form">
                    <div>
                        <label className="label-form">상품명</label>
                        <input style={{ marginBottom: '20px', width: '160px' }}
                            name="productName"
                            type="text"
                            value={inputValue.productName}
                            onChange={(e) => inputChangeHandler(e, 'productName')}
                        />
                    </div>
                    <div>
                        <label className="label-form">가격</label>
                        <input style={{ marginBottom: '20px' }}
                            name="productPrice"
                            type="text"
                            value={inputValue.price}
                            onChange={(e) => inputChangeHandler(e, 'productPrice')}
                        />
                    </div>
                    <div className="form-group">
                        <label className="label-form">카테고리</label>
                        <CustomSelect optionData={categoryOptions} onChange={handleCategoryChange} />
                    </div>
                    <div>
                        <label className="label-form">소재</label>
                        <CheckBox items={materialsOptions.map((material, index) => ({ key: index, value: material }))} onChange={handleMaterialsChange}/>
                    </div>
                    <div>
                        <label className="label-form">크기</label>
                        <CheckBox items={sizeOptions.map((size, index) => ({ key: index, value: size }))} onChange={handleSizesChange}/>
                    </div>
                    <div>
                        <label className="label-form">색깔</label>
                        <CheckBox items={colorOptions.map((color, index) => ({ key: index, value: color }))} onChange={handleColorsChange}/>
                    </div>
                    <div style={{ marginBottom: '-20px', marginTop: '-6px' }}>
                        <label className="label-form">총장</label>
                        <input style={{ width: "40px", marginRight: '10px' }}
                            name="productTotalLength"
                            type="text"
                            placeholder="cm"
                            value={inputValue.productTotalLength}
                            onChange={(e) => inputChangeHandler(e, 'productTotalLength')}
                        />
                        <label className="label-form">가슴둘레</label>
                        <input style={{ width: "40px" }}
                            name="productChest"
                            type="text"
                            placeholder="cm"
                            value={inputValue.productChest}
                            onChange={(e) => inputChangeHandler(e, 'productChest')}
                        />
                    </div>
                    <div>
                        <label className="label-form">어깨길이</label>
                        <input style={{ width: "40px", marginRight: '10px' }}
                            name="productShoulder"
                            type="text"
                            placeholder="cm"
                            value={inputValue.productShoulder}
                            onChange={(e) => inputChangeHandler(e, 'productShoulder')}
                        />
                        <label className="label-form">팔길이</label>
                        <input style={{ width: "40px" }}
                            name="productArm"
                            type="text"
                            placeholder="cm"
                            value={inputValue.productArm}
                            onChange={(e) => inputChangeHandler(e, 'productArm')}
                        />
                    </div>
                    <div style={{ marginTop: '-15px' }}>
                        <label className="label-form">상세설명</label>
                        <input style={{ width: "320px" }}
                            name="productDesc"
                            type="text"
                            value={inputValue.productDesc}
                            onChange={(e) => inputChangeHandler(e, 'productDesc')}
                        />
                    </div>
                    <div style={{ marginTop: '-15px' }}>
                        <label className="label-form">이미지</label>
                        <div className="file-input-container">
                            <input
                                className="file-input"
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                ref={imageInputRef}
                            />
                            {imageUrl && (
                                <img src={CloseImg} alt="close" className="closeImg" onClick={handleDeleteImage} />
                            )}
                        </div>
                    </div>
                    <div style={{ marginTop: '-15px' }}>
                        <label className="label-form">상세이미지</label>
                        <div className="file-input-container">
                            <input
                                className="file-input"
                                type="file"
                                accept="image/*"
                                onChange={handleDetailedImageChange}
                                ref={detailedImageInputRef}
                            />
                            {detailedImageUrl && (
                                <img src={CloseImg} alt="close" className="closeImg" onClick={handleDeleteDetailedImage} />
                            )}
                        </div>
                    </div>
                    <button className="registerButton" onClick={handleSubmit}>등록하기</button>
                </div>
                <div className="divider" style={{ marginTop: '30px' }}></div>
            </div>
        );
    };

    export default ProductRegisterationPage;
