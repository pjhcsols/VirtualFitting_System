import React, { useState } from "react";
import { TNormalUser } from "../../types/auth";
import { GlassBox } from "@/shared/components/glass-box";
import styled from "styled-components";
import { BREAKPOINTS } from "@/shared";
import { Starfield } from "@/shared/components/star";
import { Footer } from "@/widgets/footer";
import { signUpNormal } from "../../api/normal.action";
import { useNavigate } from "react-router-dom";

function UserInfoForm() {
  const router = useNavigate();
  const [showSizes, setShowSizes] = useState<boolean>(false);
  const [formData, setFormData] = useState<TNormalUser>({
    id: "",
    password: "",
    emailAddress: "",
    phoneNumber: "",
    name: "",
    nickname: "",
    gender: "MALE",
    birthDate: "",
    address: "",
    totalLength: 0,
    chest: 0,
    shoulder: 0,
    arm: 0,
    pantsTotalLength: 0,
    waistWidth: 0,
    hipWidth: 0,
    thighWidth: 0,
    rise: 0,
    hemWidth: 0,
    height: 0,
    weight: 0,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: [
        "totalLength",
        "chest",
        "shoulder",
        "arm",
        "pantsTotalLength",
        "waistWidth",
        "hipWidth",
        "thighWidth",
        "rise",
        "hemWidth",
        "height",
        "weight",
      ].includes(name)
        ? parseFloat(value) || 0
        : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(formData);
    await signUpNormal({ user: formData });
    router("/login");
  };

  return (
    <div className="relative box-border py-20 px-80 mb-20 w-full flex flex-col justify-start items-center max-xl:px-30 max-lg:px-20 max-md:px-12 max-sm:px-6">
      <Starfield theme="light" />
      <GlassBoxStyled>
        <div className="max-w-4xl mx-auto p-6 rounded-lg shadow-md">
          <TitleText>일반 유저 회원가입</TitleText>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="pb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white mb-1">
                    아이디
                  </label>
                  <input
                    type="text"
                    name="id"
                    value={formData.id}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-1">
                    비밀번호
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-1">
                    이메일
                  </label>
                  <input
                    type="email"
                    name="emailAddress"
                    value={formData.emailAddress}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-1">
                    전화번호
                  </label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-1">
                    이름
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-1">
                    닉네임
                  </label>
                  <input
                    type="text"
                    name="nickname"
                    value={formData.nickname}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-1">
                    성별
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="MALE">남성</option>
                    <option value="FEMALE">여성</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-1">
                    생년월일
                  </label>
                  <input
                    type="date"
                    name="birthDate"
                    value={formData.birthDate}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-white mb-1">
                    주소
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
            </div>
            <div className="w-full flex justify-start items-start group">
              <h3
                className="text-lg font-semibold mb-4 text-white group-hover:translate-x-2 duration-200"
                onClick={() => setShowSizes((prev) => !prev)}
              >
                {showSizes
                  ? "▼ 사이즈 정보 ( Optional )"
                  : "▶ 사이즈 정보 ( Optional )"}
              </h3>
            </div>
            {showSizes && (
              <>
                <div className="border-b pb-6">
                  <h3 className="text-lg font-semibold mb-4 text-white">
                    신체 정보
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-white mb-1">
                        키 (cm)
                      </label>
                      <input
                        type="number"
                        name="height"
                        value={formData.height}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        step="0.1"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-white mb-1">
                        몸무게 (kg)
                      </label>
                      <input
                        type="number"
                        name="weight"
                        value={formData.weight}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        step="0.1"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="border-b pb-6">
                  <h3 className="text-lg font-semibold mb-4 text-white">
                    상의 치수 (cm)
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-white mb-1">
                        총장
                      </label>
                      <input
                        type="number"
                        name="totalLength"
                        value={formData.totalLength}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        step="0.1"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-white mb-1">
                        가슴둘레
                      </label>
                      <input
                        type="number"
                        name="chest"
                        value={formData.chest}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        step="0.1"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-white mb-1">
                        어깨너비
                      </label>
                      <input
                        type="number"
                        name="shoulder"
                        value={formData.shoulder}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        step="0.1"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-white mb-1">
                        팔길이
                      </label>
                      <input
                        type="number"
                        name="arm"
                        value={formData.arm}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        step="0.1"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="pb-6">
                  <h3 className="text-lg font-semibold mb-4 text-white">
                    하의 치수 (cm)
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-white mb-1">
                        바지 총장
                      </label>
                      <input
                        type="number"
                        name="pantsTotalLength"
                        value={formData.pantsTotalLength}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        step="0.1"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-white mb-1">
                        허리둘레
                      </label>
                      <input
                        type="number"
                        name="waistWidth"
                        value={formData.waistWidth}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        step="0.1"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-white mb-1">
                        엉덩이둘레
                      </label>
                      <input
                        type="number"
                        name="hipWidth"
                        value={formData.hipWidth}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        step="0.1"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-white mb-1">
                        허벅지둘레
                      </label>
                      <input
                        type="number"
                        name="thighWidth"
                        value={formData.thighWidth}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        step="0.1"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-white mb-1">
                        밑위
                      </label>
                      <input
                        type="number"
                        name="rise"
                        value={formData.rise}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        step="0.1"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-white mb-1">
                        밑단너비
                      </label>
                      <input
                        type="number"
                        name="hemWidth"
                        value={formData.hemWidth}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        step="0.1"
                        required
                      />
                    </div>
                  </div>
                </div>
              </>
            )}
            <button
              type="submit"
              className="w-full border text-white py-3 rounded-2xl font-medium duration-200 hover:-translate-y-2 cursor-pointer"
            >
              등록하기
            </button>
          </form>
        </div>
      </GlassBoxStyled>
      <Footer />
    </div>
  );
}

const GlassBoxStyled = styled(GlassBox)`
  flex: 1;
  padding: 2rem;
  width: 100%;

  @media (max-width: 1200px) {
    width: 100%;
    max-width: 500px;
  }
  cursor: pointer;
`;

const TitleText = styled.div`
  font-family: "Prata-Regular";
  font-size: 48px;
  font-weight: 600;
  letter-spacing: -4px;
  margin: 0;
  background-image: linear-gradient(to right, #e9faff, #b8d2ff);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;

  @media (max-width: ${BREAKPOINTS.md}px) {
    font-size: 38px;
    padding-right: 0;
    text-align: left;
    letter-spacing: -2px;
  }
`;

export { UserInfoForm };
