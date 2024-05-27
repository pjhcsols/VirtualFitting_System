import React from "react";
import HeaderBottom from "../components/Header_Bottom";
import './ProductRegisterationPage.css';
import CustomSelect from "../components/CustomSelect";

const ProductRegisterationPage = () => {
    const materialOptions = [
        { key: "1", value: "COTTON" },
        { key: "2", value: "POLYESTER" },
        { key: "3", value: "WOOL" },
        { key: "4", value: "FABRIC" },
        { key: "5", value: "SILK" },
    ];

    const colorOptions = [
        { key: "1", value: "Black" },
        { key: "2", value: "White" },
        { key: "3", value: "GRAY" },
        { key: "4", value: "BLUE" },
        { key: "5", value: "RED" },
        { key: "6", value: "YELLOW" },
        { key: "7", value: "GREEN" },
        { key: "8", value: "ORANGE" },
    ];

    const sizeOptions = [
        { key: "1", value: "XX" },
        { key: "2", value: "S" },
        { key: "3", value: "M" },
        { key: "4", value: "L" },
        { key: "5", value: "XL" },
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
                    <input style={{marginBottom: '20px', width: '160px'}}
                        name="productName" 
                        type="text" 
                    />
                </div>
                <div>
                    <label className="label-form">가격</label>
                    <input style={{marginBottom: '20px'}}
                        name="price" 
                        type="text" 
                    />
                </div>
                <div className="form-group">
                    <label className="label-form">소재</label>
                    <CustomSelect optionData={materialOptions} />
                </div>
                <div className="form-group">
                    <label className="label-form">크기</label>
                    <CustomSelect optionData={sizeOptions} />
                </div>
                <div className="form-group">
                    <label className="label-form">색깔</label>
                    <CustomSelect optionData={colorOptions} />
                </div>
                <div style={{marginBottom: '-20px'}}>
                    <label className="label-form">총장</label>
                    <input style={{width: "40px", marginRight: '10px'}}
                        name="totalLength"
                        type="text"
                        placeholder="cm"
                    />
                    <label className="label-form">가슴둘레</label>
                    <input style={{width: "40px"}}
                        name="chestCircumference"
                        type="text"
                        placeholder="cm"
                    />
                </div>
                <div>
                <label className="label-form">어깨길이</label>
                    <input style={{width: "40px",  marginRight: '10px'}}
                        name="shoulderLength"
                        type="text"
                        placeholder="cm"
                    />
                    <label className="label-form">팔길이</label>
                    <input style={{width: "40px"}}
                        name="sleeveLength"
                        type="text"
                        placeholder="cm"
                    />
                </div>
                <div style={{marginTop: '-15px'}}>
                    <label className="label-form">상세설명</label>
                    <input style={{width: "320px"}}
                        name="detailedDescription"
                        type="text"
                    />
                </div>
                <div style={{marginTop: '-15px'}}>
                    <label className="label-form">이미지</label>
                    <input style={{width: '200px'}}
                        name="imageUrl"
                        type="text"
                    />
                    <button className="image-button">파일 선택</button>
                </div>
                <button className="registerButton">등록하기</button>
            </div>
            <div className="divider" style={{marginTop: '30px'}}></div>
        </div>
    );
};

export default ProductRegisterationPage;







{/* <div style={{marginTop: '7px', display: 'flex', flexDirection: 'column', gap: '5px'}}>
                    <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '10px'}}>
                        <label className="label-form">총장</label>
                        <label className="label-form">가슴둘레</label>
                        <label className="label-form">어깨길이</label>
                        <label className="label-form">팔길이</label>
                    </div>
                    <div style={{display: 'flex', justifyContent: 'space-between'}}>
                        <input style={{width: '50px'}} 
                            name="totalLength" 
                            type="text" 
                        />
                        <input style={{width: '50px'}} 
                            name="chestCircumference" 
                            type="text" 
                        />
                        <input style={{width: '50px'}}
                            name="shoulderLength" 
                            type="text" 
                        />
                        <input style={{width: '50px'}}
                            name="sleeveLength" 
                            type="text" 
                        />
                    </div>
                </div> */}