
INSERT INTO basilium.category (category_id, category_name) VALUES (1, '티셔츠');
INSERT INTO basilium.category (category_id, category_name) VALUES (2, '긴팔');
INSERT INTO basilium.category (category_id, category_name) VALUES (3, '블라우스');
INSERT INTO basilium.category (category_id, category_name) VALUES (4, '니트');
INSERT INTO basilium.category (category_id, category_name) VALUES (5, '후드티');
INSERT INTO basilium.category (category_id, category_name) VALUES (6, '청바지');
INSERT INTO basilium.category (category_id, category_name) VALUES (7, '슬랙스');
INSERT INTO basilium.category (category_id, category_name) VALUES (8, '반바지');
INSERT INTO basilium.category (category_id, category_name) VALUES (9, '스커트');
INSERT INTO basilium.category (category_id, category_name) VALUES (10, '자켓');
INSERT INTO basilium.category (category_id, category_name) VALUES (11, '가디건');
INSERT INTO basilium.category (category_id, category_name) VALUES (12, '패딩');
INSERT INTO basilium.category (category_id, category_name) VALUES (13, '베스트');
INSERT INTO basilium.category (category_id, category_name) VALUES (14, '드레스');
INSERT INTO basilium.category (category_id, category_name) VALUES (15, '정장');
INSERT INTO basilium.category (category_id, category_name) VALUES (16, '한복');
INSERT INTO basilium.category (category_id, category_name) VALUES (17, '속옷');
INSERT INTO basilium.category (category_id, category_name) VALUES (18, '수영복');
INSERT INTO basilium.category (category_id, category_name) VALUES (19, '액세서리');
commit;


-- NormalUser: 필수 정보만 포함 (URL은 정확히 입력)
INSERT INTO normal_user (
    user_number, id, password, email_address, phone_number,
    user_grade, login_type,
    user_image_url, user_profile_image_url,
    name, nickname, gender, birth_date, address
) VALUES (
             1, 'test', '{bcrypt}$2a$10$25p01uFhzsK3nXWPE5FUaOX2l6jZJvS/P.xREttIjZn8FhLZaYX2m', 'mandatory@example.com', '+821012345671',
             0, 0,
             'example_1713958965868_mysql.png',
             'normal1_날라감1_2hhbnNvbC9EZXNrdG9wL1ZpcnS9iYXNpbGl1bS1zZXJ2ZXIvc3JjL21haW4vcmVzb3VyY2VzL3VzZXJQcm9maWx==',
             '홍길순', 'hongsun', 'FEMALE', '1992-02-02T10:00:00', '서울특별시 서초구'
         );
COMMIT;

-- NormalUser: 모든 옵션 포함 (URL은 정확히 입력)
INSERT INTO normal_user (
    user_number, id, password, email_address, phone_number,
    user_grade, login_type,
    user_image_url, user_profile_image_url,
    name, nickname, gender, birth_date, address,
    total_length, chest, shoulder, arm,
    pants_total_length, waist_width, hip_width, thigh_width, rise, hem_width,
    height, weight
) VALUES (
             2, 'example', '{bcrypt}$2a$10$25p01uFhzsK3nXWPE5FUaOX2l6jZJvS/P.xREttIjZn8FhLZaYX2m', 'full@example.com', '+821012345672',
             0, 0,
             'brand01_1713958965868_mysql.png',
             'example_1718122647013_a.png',
             '김철수', 'chulsu', 'MALE', '1988-08-08T08:00:00', '서울특별시 마포구',
             70, 90, 45, 60,
             100, 28, 95, 55, 25, 20,
             175, 68
         );
COMMIT;

-- BrandUser (기본 Grade.BRAND=5, Provider.BRAND=1)
INSERT INTO brand_user (
    user_number,
    id,
    password,
    email_address,
    phone_number,
    user_grade,
    login_type,
    user_image_url,
    user_profile_image_url,
    firm_name,
    firm_address,
    business_registration,
    firm_web_url,
    firm_email,
    firm_phone,
    business_registration_certificate_image_url,
    sale_allowed
) VALUES (
             1,
             'brand01',
             '{bcrypt}$2a$10$25p01uFhzsK3nXWPE5FUaOX2l6jZJvS/P.xREttIjZn8FhLZaYX2m',
             'example@naver.com',
             '+821012345677',
             5,
             1,
             'brand1_날라감1_/Users/hansol/Desktop/VirtualFitting_System/basilium-server/src/main/resources/userImageStorage/super_20250801123000.png',
             'brand1_날라감1_프로필지워짐1',
             '박한솔컴퍼니',
             '대구광역시 달서구 저승길 6길',
             '20-17777777',
             'http://phs-컴퍼니',
             'example@naver.com',
             '+82212345677',
             'brand01_20250801153000.png',
             TRUE
         );

-- BrandUser 2 (스케줄러 테스트: 이미지 URL 비워진 정상 상태, 신규 사업자 등록증 추가)
INSERT INTO brand_user (
    user_number,
    id,
    password,
    email_address,
    phone_number,
    user_grade,
    login_type,
    user_image_url,
    user_profile_image_url,
    firm_name,
    firm_address,
    business_registration,
    firm_web_url,
    firm_email,
    firm_phone,
    business_registration_certificate_image_url,
    sale_allowed
) VALUES (
             2,
             'brand02',
             '{bcrypt}$2a$10$25p01uFhzsK3nXWPE5FUaOX2l6jZJvS/P.xREttIjZn8FhLZaYX2m',
             'example2@naver.com',
             '+821012345678',
             5,
             1,
             'brand2_날라감2_/Users/hansol/user2번스케줄링_테스트_날라가야_정상.png',
             'brand2_날라감2_프로필지워짐2',
             '박한솔컴퍼니',
             '대구광역시 달서구 저승길 6길',
             '20-17777777',
             'http://phs-컴퍼니',
             'example2@naver.com',
             '+82212345677',
             'brand02_20250801153100.png',
             FALSE
         );

-- BrandUser 3 (스케줄러 테스트: 이미지 URL 비워진 정상 상태, 신규 사업자 등록증 추가)
INSERT INTO brand_user (
    user_number,
    id,
    password,
    email_address,
    phone_number,
    user_grade,
    login_type,
    user_image_url,
    user_profile_image_url,
    firm_name,
    firm_address,
    business_registration,
    firm_web_url,
    firm_email,
    firm_phone,
    business_registration_certificate_image_url,
    sale_allowed
) VALUES (
             3,
             'brand003',
             -- bcrypt('password') 예시 해시 (필요 시 교체)
             '{bcrypt}$2a$10$25p01uFhzsK3nXWPE5FUaOX2l6jZJvS/P.xREttIjZn8FhLZaYX2m',
             'brand003@basilium.co.kr',
             '+821012345679',
             5,
             1,
             NULL,   -- user_image_url (비워둠)
             NULL,   -- user_profile_image_url (비워둠)
             '바실리움 스튜디오 3',
             '서울특별시 강남구 테헤란로 123, 3층',
             '333-33-33333',
             'https://brand003.basilium.co.kr',
             'biz3@basilium.co.kr',
             '+82212345677',
             '/businessRegistrationCertificateImageStorage/BRAND_3_20250813040530.png',
             FALSE
         );


COMMIT;


-- SuperUser (기본 Grade.SUPER=6, Provider.SUPER=2)
INSERT INTO super_user (
    user_number,
    id,
    password,
    email_address,
    phone_number,
    user_grade,
    login_type,
    user_image_url,
    user_profile_image_url,
    name,
    position,
    department,
    job_role
) VALUES (
             1,
             'phs',
             '{bcrypt}$2a$10$25p01uFhzsK3nXWPE5FUaOX2l6jZJvS/P.xREttIjZn8FhLZaYX2m',
             'phs@naver.com',
             '+821012345674',
             6,    -- Grade.SUPER
             2,    -- Provider.SUPER
             'super1_날라감1_/Users/hansol/Desktop/VirtualFitting_System/basilium-server/src/main/resources/userImageStorage/super_날라감_mysql.png',
             'super1_날라감1_GaXR0aW5nX1N5c3RlbSL3VzZXJQcm9maWxlSW1hZ2VTdG9yYWdlL2V4YW1wbGVfMTcxODEyMjY0NzAxM19hLnBuZw==날라감1',
             '박한솔',   -- 예시 이름
             'CEO',   -- 예시 직책
             '개발 사업부',   -- 예시 부서
             'Backend Developer' -- 예시 담당직무
         );

INSERT INTO superuser_banners (user_number, banner_image_file_urls)
VALUES (1, 'super_20250801123000.png');

COMMIT;

INSERT INTO super_user (
    user_number,
    id,
    password,
    email_address,
    phone_number,
    user_grade,
    login_type,
    user_image_url,
    user_profile_image_url,
    name,
    position,
    department,
    job_role
) VALUES (
             2,
             'super_ad',
             '{bcrypt}$2a$10$25p01uFhzsK3nXWPE5FUaOX2l6jZJvS/P.xREttIjZn8FhLZaYX2m',
             'ad@naver.com',
             '+821012345675',
             6,    -- Grade.SUPER
             2,    -- Provider.SUPER
             'super2_날라감2_20250801123000.png',
             'super2_날라감2_20250801123000.png',
             'AD',   -- 예시 이름
             'AD관리자',   -- 예시 직책
             'AD운영부',   -- 예시 부서
             'AD 시스템 총괄' -- 예시 담당직무
         );

INSERT INTO superuser_banners (user_number, banner_image_file_urls)
VALUES (2, 'admin1.jpeg');
INSERT INTO superuser_banners (user_number, banner_image_file_urls)
VALUES (2, 'admin2.png');
INSERT INTO superuser_banners (user_number, banner_image_file_urls)
VALUES (2, 'admin3.jpeg');
INSERT INTO superuser_banners (user_number, banner_image_file_urls)
VALUES (2, 'admin4.png');

COMMIT;

-- 포인트 테이블에 데이터 추가
INSERT INTO points (id, user_number, amount)
VALUES (1, 1, 10000);


/*1*/

-- Product 1: 바실리움 로고 반팔티(블랙)
INSERT INTO product
(product_id, status, category_id, product_name, product_price, product_desc, brand_user_number, total_quantity)
VALUES
    (1, 'EXHIBITION_STOPPED', 1, '바실리움 로고 반팔티(블랙)', 53000, '반팔 모찌모찌함', 1, 100);

-- 사이즈 옵션 (ProductSizeOption) for product 1, sizes M and L
INSERT INTO product_size_option
(product_id, product_size, total_length, chest, shoulder, arm)
VALUES
    (1, 'M', 70, 52, 48, 21),
    (1, 'L', 70, 52, 48, 21);

-- 상품 색상 옵션 (ProductColorOption) for product 1, color BLACK
INSERT INTO product_color_option
(product_id, product_color)
VALUES
    (1, 'BLACK');

-- 상품 사진 URL 삽입 (List)
INSERT INTO product_photo_urls (product_id, product_color, product_photo_url)
VALUES
    (1, 'BLACK', 'https://s3.ap-northeast-2.amazonaws.com/basilium-product-bucket/main1_1.png'),
    (1, 'BLACK', 'https://s3.ap-northeast-2.amazonaws.com/basilium-product-bucket/sub2.png');

-- 상품 서브 사진 URL 삽입 (List)
INSERT INTO product_sub_photo_urls (product_id, product_color, product_sub_photo_url)
VALUES
    (1, 'BLACK', 'https://s3.ap-northeast-2.amazonaws.com/basilium-product-bucket/sub_1.png'),
    (1, 'BLACK', 'https://s3.ap-northeast-2.amazonaws.com/basilium-product-bucket/sub2.png'),
    (1, 'BLACK', 'https://s3.ap-northeast-2.amazonaws.com/basilium-product-bucket/sub_7.png');

-- 상품 재질(Material) 삽입 (숫자로 – 0: COTTON, 1: POLYESTER)
INSERT INTO product_materials (product_id, product_material)
VALUES
    (1, 'COTTON'),
    (1, 'POLYESTER');

-- 상품 옵션 삽입 (옵션별 재고: option_quantity)
INSERT INTO product_option (product_id, product_size, product_color, option_quantity)
VALUES
    (1, 'M', 'BLACK', 50),
    (1, 'L', 'BLACK', 50);

COMMIT;

-- ----------------------------------------------------------

-- Product 2: 바실리움 로고 반팔티(화이트)
INSERT INTO product
(product_id, category_id, product_name, product_price, product_desc, brand_user_number, total_quantity)
VALUES
    (2, 1, '바실리움 로고 반팔티(화이트)', 53000, '반팔 모찌모찌함', 1, 100);

-- 사이즈 옵션 for product 2, sizes M and L
INSERT INTO product_size_option
(product_id, product_size, total_length, chest, shoulder, arm)
VALUES
    (2, 'M', 70, 52, 48, 21),
    (2, 'L', 70, 52, 48, 21);

-- 상품 색상 옵션 for product 2, color WHITE
INSERT INTO product_color_option
(product_id, product_color)
VALUES
    (2, 'WHITE');

-- 상품 사진 URL 삽입 (List)
INSERT INTO product_photo_urls (product_id, product_color, product_photo_url)
VALUES
    (2, 'WHITE', 'https://s3.ap-northeast-2.amazonaws.com/basilium-product-bucket/main1_2.png'),
    (2, 'WHITE', 'https://s3.ap-northeast-2.amazonaws.com/basilium-product-bucket/sub2.png');

-- 상품 서브 사진 URL 삽입 (List)
INSERT INTO product_sub_photo_urls (product_id, product_color, product_sub_photo_url)
VALUES
    (2, 'WHITE', 'https://s3.ap-northeast-2.amazonaws.com/basilium-product-bucket/sub_1.png'),
    (2, 'WHITE', 'https://s3.ap-northeast-2.amazonaws.com/basilium-product-bucket/sub2.png'),
    (2, 'WHITE', 'https://s3.ap-northeast-2.amazonaws.com/basilium-product-bucket/sub_7.png');

-- 상품 재질(Material) 삽입 (숫자로 – 0: COTTON, 1: POLYESTER)
INSERT INTO product_materials (product_id, product_material)
VALUES
    (2, 'COTTON'),
    (2, 'POLYESTER');

-- 옵션: 사이즈 'M'와 'L', 색상 'WHITE'
INSERT INTO product_option (product_id, product_size, product_color, option_quantity)
VALUES
    (2, 'M', 'WHITE', 50),
    (2, 'L', 'WHITE', 50);

COMMIT;

-- ----------------------------------------------------------

-- Product 3: 바실리움 백로고 맨투맨(블랙)
INSERT INTO product
(product_id, category_id, product_name, product_price, product_desc, brand_user_number, total_quantity)
VALUES
    (3, 2, '바실리움 백로고 맨투맨(블랙)', 53000, '맨투맨 모찌모찌함', 1, 100);

-- 사이즈 옵션 for product 3, sizes M and L
INSERT INTO product_size_option
(product_id, product_size, total_length, chest, shoulder, arm)
VALUES
    (3, 'M', 70, 52, 48, 21),
    (3, 'L', 70, 52, 48, 21);

-- 상품 색상 옵션 for product 3, color BLACK
INSERT INTO product_color_option
(product_id, product_color)
VALUES
    (3, 'BLACK');

-- 상품 사진 URL 삽입 (List)
INSERT INTO product_photo_urls (product_id, product_color, product_photo_url)
VALUES
    (3, 'BLACK', 'https://s3.ap-northeast-2.amazonaws.com/basilium-product-bucket/main1.png'),
    (3, 'BLACK', 'https://s3.ap-northeast-2.amazonaws.com/basilium-product-bucket/sub_4_1.png'),
    (3, 'BLACK', 'https://s3.ap-northeast-2.amazonaws.com/basilium-product-bucket/sub2.png');

-- 상품 서브 사진 URL 삽입 (List)
INSERT INTO product_sub_photo_urls (product_id, product_color, product_sub_photo_url)
VALUES
    (3, 'BLACK', 'https://s3.ap-northeast-2.amazonaws.com/basilium-product-bucket/sub_1.png'),
    (3, 'BLACK', 'https://s3.ap-northeast-2.amazonaws.com/basilium-product-bucket/sub2.png'),
    (3, 'BLACK', 'https://s3.ap-northeast-2.amazonaws.com/basilium-product-bucket/sub_3_1.png'),
    (3, 'BLACK', 'https://s3.ap-northeast-2.amazonaws.com/basilium-product-bucket/sub_7.png');

-- 상품 재질(Material) 삽입 (숫자로 – 0: COTTON, 1: POLYESTER)
INSERT INTO product_materials (product_id, product_material)
VALUES
    (3, 'COTTON'),
    (3, 'POLYESTER');

-- 옵션: 사이즈 'M'와 'L', 색상 'BLACK'
INSERT INTO product_option (product_id, product_size, product_color, option_quantity)
VALUES
    (3, 'M', 'BLACK', 50),
    (3, 'L', 'BLACK', 50);

COMMIT;

-- ----------------------------------------------------------

-- Product 4 (AI용1): 프린팅 반팔
INSERT INTO product
(product_id, category_id, product_name, product_price, product_desc, brand_user_number, total_quantity)
VALUES
    (4, 1, '프린팅 반팔', 35000, '여름 프린팅 반팔 모찌모찌함', 2, 100);

-- 사이즈 옵션 for product 4, sizes M and L
INSERT INTO product_size_option
(product_id, product_size, total_length, chest, shoulder, arm)
VALUES
    (4, 'M', 70, 52, 48, 21),
    (4, 'L', 70, 52, 48, 21);

-- 상품 색상 옵션 for product 4, color WHITE
INSERT INTO product_color_option
(product_id, product_color)
VALUES
    (4, 'WHITE');

-- 상품 사진 URL 삽입 (List)
INSERT INTO product_photo_urls (product_id, product_color, product_photo_url)
VALUES
    (4, 'WHITE', 'https://s3.ap-northeast-2.amazonaws.com/basilium-product-bucket/top01.png'),
    (4, 'WHITE', 'https://s3.ap-northeast-2.amazonaws.com/basilium-product-bucket/sub2.png');

-- 상품 서브 사진 URL 삽입 (List)
INSERT INTO product_sub_photo_urls (product_id, product_color, product_sub_photo_url)
VALUES
    (4, 'WHITE', 'https://s3.ap-northeast-2.amazonaws.com/basilium-product-bucket/sub_1.png'),
    (4, 'WHITE', 'https://s3.ap-northeast-2.amazonaws.com/basilium-product-bucket/sub_7.png');

-- 상품 재질(Material) 삽입 (숫자로 – 0: COTTON, 1: POLYESTER)
INSERT INTO product_materials (product_id, product_material)
VALUES
    (4, 'COTTON'),
    (4, 'POLYESTER');

-- 옵션: 사이즈 'M'와 'L', 색상 'WHITE'
INSERT INTO product_option (product_id, product_size, product_color, option_quantity)
VALUES
    (4, 'M', 'WHITE', 50),
    (4, 'L', 'WHITE', 50);

COMMIT;

-- ----------------------------------------------------------

-- Product 5 (AI용2): 줄무늬 반팔
INSERT INTO product
(product_id, category_id, product_name, product_price, product_desc, brand_user_number, total_quantity)
VALUES
    (5, 1, '줄무늬 반팔', 33000, '여름 얼룩말 반팔 모찌모찌함', 2, 100);

-- 사이즈 옵션 for product 5, sizes M and L
INSERT INTO product_size_option
(product_id, product_size, total_length, chest, shoulder, arm)
VALUES
    (5, 'M', 70, 52, 48, 21),
    (5, 'L', 70, 52, 48, 21);

-- 상품 색상 옵션 for product 5, color WHITE
INSERT INTO product_color_option
(product_id, product_color)
VALUES
    (5, 'WHITE');

-- 상품 사진 URL 삽입 (List)
INSERT INTO product_photo_urls (product_id, product_color, product_photo_url)
VALUES
    (5, 'WHITE', 'https://s3.ap-northeast-2.amazonaws.com/basilium-product-bucket/top02.png'),
    (5, 'WHITE', 'https://s3.ap-northeast-2.amazonaws.com/basilium-product-bucket/sub2.png');

-- 상품 서브 사진 URL 삽입 (List)
INSERT INTO product_sub_photo_urls (product_id, product_color, product_sub_photo_url)
VALUES
    (5, 'WHITE', 'https://s3.ap-northeast-2.amazonaws.com/basilium-product-bucket/sub_1.png'),
    (5, 'WHITE', 'https://s3.ap-northeast-2.amazonaws.com/basilium-product-bucket/sub_7.png');

-- 상품 재질(Material) 삽입 (숫자로 – 0: COTTON, 1: POLYESTER)
INSERT INTO product_materials (product_id, product_material)
VALUES
    (5, 'COTTON'),
    (5, 'POLYESTER');

-- 옵션: 사이즈 'M'와 'L', 색상 'WHITE'
INSERT INTO product_option (product_id, product_size, product_color, option_quantity)
VALUES
    (5, 'M', 'WHITE', 50),
    (5, 'L', 'WHITE', 50);

COMMIT;

-- ----------------------------------------------------------

-- Product 6 (AI용3): 줄무늬 모찌 긴팔
INSERT INTO product
(product_id, category_id, product_name, product_price, product_desc, brand_user_number, total_quantity)
VALUES
    (6, 2, '줄무늬 모찌 긴팔', 68000, '여름 얼룩말 긴팔 모찌모찌함', 2, 100);

-- 사이즈 옵션 for product 6, sizes M and L
INSERT INTO product_size_option
(product_id, product_size, total_length, chest, shoulder, arm)
VALUES
    (6, 'M', 70, 52, 48, 21),
    (6, 'L', 70, 52, 48, 21);

-- 상품 색상 옵션 for product 6, color WHITE
INSERT INTO product_color_option
(product_id, product_color)
VALUES
    (6, 'WHITE');

-- 상품 사진 URL 삽입 (List)
INSERT INTO product_photo_urls (product_id, product_color, product_photo_url)
VALUES
    (6, 'WHITE', 'https://s3.ap-northeast-2.amazonaws.com/basilium-product-bucket/top03.png'),
    (6, 'WHITE', 'https://s3.ap-northeast-2.amazonaws.com/basilium-product-bucket/sub2.png');

-- 상품 서브 사진 URL 삽입 (List)
INSERT INTO product_sub_photo_urls (product_id, product_color, product_sub_photo_url)
VALUES
    (6, 'WHITE', 'https://s3.ap-northeast-2.amazonaws.com/basilium-product-bucket/sub_1.png'),
    (6, 'WHITE', 'https://s3.ap-northeast-2.amazonaws.com/basilium-product-bucket/sub_7.png');

-- 상품 재질(Material) 삽입 (숫자로 – 0: COTTON, 1: POLYESTER)
INSERT INTO product_materials (product_id, product_material)
VALUES
    (6, 'COTTON'),
    (6, 'POLYESTER');

-- 옵션: 사이즈 'M'와 'L', 색상 'WHITE'
INSERT INTO product_option (product_id, product_size, product_color, option_quantity)
VALUES
    (6, 'M', 'WHITE', 50),
    (6, 'L', 'WHITE', 50);

COMMIT;

-- ----------------------------------------------------------

-- Product 7 (정렬용1): 모찌 팬츠
INSERT INTO product
(product_id, category_id, product_name, product_price, product_desc, brand_user_number, total_quantity)
VALUES
    (7, 8, '모찌 팬츠', 65000, '여름 팬츠 모찌모찌함', 2, 100);

-- 사이즈 옵션 for product 7, sizes M and L
INSERT INTO product_size_option
(product_id, product_size, total_length, chest, shoulder, arm)
VALUES
    (7, 'M', 70, 52, 48, 21),
    (7, 'L', 70, 52, 48, 21);

-- 상품 색상 옵션 for product 7, color WHITE
INSERT INTO product_color_option
(product_id, product_color)
VALUES
    (7, 'WHITE');

-- 상품 사진 URL 삽입 (List)
INSERT INTO product_photo_urls (product_id, product_color, product_photo_url)
VALUES
    (7, 'WHITE', 'https://s3.ap-northeast-2.amazonaws.com/basilium-product-bucket/pants01.png'),
    (7, 'WHITE', 'https://s3.ap-northeast-2.amazonaws.com/basilium-product-bucket/sub2.png');

-- 상품 서브 사진 URL 삽입 (List)
INSERT INTO product_sub_photo_urls (product_id, product_color, product_sub_photo_url)
VALUES
    (7, 'WHITE', 'https://s3.ap-northeast-2.amazonaws.com/basilium-product-bucket/sub_1.png'),
    (7, 'WHITE', 'https://s3.ap-northeast-2.amazonaws.com/basilium-product-bucket/sub_7.png');

-- 상품 재질(Material) 삽입 (숫자로 – 0: COTTON, 1: POLYESTER)
INSERT INTO product_materials (product_id, product_material)
VALUES
    (7, 'COTTON'),
    (7, 'POLYESTER');

-- 옵션: 사이즈 'M'와 'L', 색상 'WHITE'
INSERT INTO product_option (product_id, product_size, product_color, option_quantity)
VALUES
    (7, 'M', 'WHITE', 50),
    (7, 'L', 'WHITE', 50);

COMMIT;

-- ----------------------------------------------------------

-- Product 8 (정렬용2): 모찌 스커트 치마
INSERT INTO product
(product_id, category_id, product_name, product_price, product_desc, brand_user_number, total_quantity)
VALUES
    (8, 9, '모찌 스커트 치마', 84000, '여름 치마 모찌모찌함', 2, 100);

-- 사이즈 옵션 for product 8, sizes M and L
INSERT INTO product_size_option
(product_id, product_size, total_length, chest, shoulder, arm)
VALUES
    (8, 'M', 70, 52, 48, 21),
    (8, 'L', 70, 52, 48, 21);

-- 상품 색상 옵션 for product 8, color WHITE
INSERT INTO product_color_option
(product_id, product_color)
VALUES
    (8, 'WHITE');

-- 상품 사진 URL 삽입 (List)
INSERT INTO product_photo_urls (product_id, product_color, product_photo_url)
VALUES
    (8, 'WHITE', 'https://s3.ap-northeast-2.amazonaws.com/basilium-product-bucket/skirt01.png'),
    (8, 'WHITE', 'https://s3.ap-northeast-2.amazonaws.com/basilium-product-bucket/sub2.png');

-- 상품 서브 사진 URL 삽입 (List)
INSERT INTO product_sub_photo_urls (product_id, product_color, product_sub_photo_url)
VALUES
    (8, 'WHITE', 'https://s3.ap-northeast-2.amazonaws.com/basilium-product-bucket/sub_1.png'),
    (8, 'WHITE', 'https://s3.ap-northeast-2.amazonaws.com/basilium-product-bucket/sub_7.png');

-- 상품 재질(Material) 삽입 (숫자로 – 0: COTTON, 1: POLYESTER)
INSERT INTO product_materials (product_id, product_material)
VALUES
    (8, 'COTTON'),
    (8, 'POLYESTER');

-- 옵션: 사이즈 'M'와 'L', 색상 'WHITE'
INSERT INTO product_option (product_id, product_size, product_color, option_quantity)
VALUES
    (8, 'M', 'WHITE', 50),
    (8, 'L', 'WHITE', 50);

COMMIT;

-- Product 9: Product 1과 Product 2를 합쳐서 생성 (가격은 합산하지 않음)
INSERT INTO product
(product_id, category_id, product_name, product_price, product_desc, brand_user_number, total_quantity)
VALUES
    (9, 1, '바실리움 로고 반팔티(블랙,화이트 택1)', 53000, '반팔 모찌모찌함', 1, 200);

-- 사이즈 옵션 (ProductSizeOption) for product 9, sizes M and L
INSERT INTO product_size_option
(product_id, product_size, total_length, chest, shoulder, arm)
VALUES
    (9, 'M', 70, 52, 48, 21),
    (9, 'L', 70, 52, 48, 21);

-- 상품 색상 옵션 (ProductColorOption) for product 9, colors BLACK and WHITE
INSERT INTO product_color_option
(product_id, product_color)
VALUES
    (9, 'BLACK'),
    (9, 'WHITE');

-- 상품 사진 URL 삽입 (List) for product 9, BLACK color (Product 1)
INSERT INTO product_photo_urls (product_id, product_color, product_photo_url)
VALUES
    (9, 'BLACK', 'https://s3.ap-northeast-2.amazonaws.com/basilium-product-bucket/main1_1.png'),
    (9, 'BLACK', 'https://s3.ap-northeast-2.amazonaws.com/basilium-product-bucket/sub2.png');

-- 상품 사진 URL 삽입 (List) for product 9, WHITE color (Product 2)
INSERT INTO product_photo_urls (product_id, product_color, product_photo_url)
VALUES
    (9, 'WHITE', 'https://s3.ap-northeast-2.amazonaws.com/basilium-product-bucket/main1_2.png'),
    (9, 'WHITE', 'https://s3.ap-northeast-2.amazonaws.com/basilium-product-bucket/sub2.png');

-- 상품 서브 사진 URL 삽입 (List) for product 9, BLACK color (Product 1)
INSERT INTO product_sub_photo_urls (product_id, product_color, product_sub_photo_url)
VALUES
    (9, 'BLACK', 'https://s3.ap-northeast-2.amazonaws.com/basilium-product-bucket/sub_1.png'),
    (9, 'BLACK', 'https://s3.ap-northeast-2.amazonaws.com/basilium-product-bucket/sub2.png'),
    (9, 'BLACK', 'https://s3.ap-northeast-2.amazonaws.com/basilium-product-bucket/sub_7.png');

-- 상품 서브 사진 URL 삽입 (List) for product 9, WHITE color (Product 2)
INSERT INTO product_sub_photo_urls (product_id, product_color, product_sub_photo_url)
VALUES
    (9, 'WHITE', 'https://s3.ap-northeast-2.amazonaws.com/basilium-product-bucket/sub_1_2.png'),
    (9, 'WHITE', 'https://s3.ap-northeast-2.amazonaws.com/basilium-product-bucket/sub2_2.png'),
    (9, 'WHITE', 'https://s3.ap-northeast-2.amazonaws.com/basilium-product-bucket/sub_7_2.png');

-- 상품 재질(Material) 삽입 (Product 1,2의 재질 그대로)
INSERT INTO product_materials (product_id, product_material)
VALUES
    (9, 'COTTON'),
    (9, 'POLYESTER');

-- 상품 옵션 삽입 (옵션별 재고) for product 9
-- BLACK: 사이즈 M: 50, 사이즈 L: 50; WHITE: 사이즈 M: 50, 사이즈 L: 50
INSERT INTO product_option (product_id, product_size, product_color, option_quantity)
VALUES
    (9, 'M', 'BLACK', 50),
    (9, 'L', 'BLACK', 50),
    (9, 'M', 'WHITE', 50),
    (9, 'L', 'WHITE', 50);

COMMIT;



-- ----------------------------------------------------------

-- Review 테이블에 데이터 삽입
INSERT INTO review
(review_id, product_id, normal_user_number, purchase_size, purchase_color, rating, title, comment, created_at, updated_at)
VALUES
    (1, 1, 1, 'M', 'RED', 5, '정말 좋아요!', '제품 색상도 마음에 들고 퀄리티가 최고예요.', '2025-06-08T03:23:18', null);

-- review_images 테이블에 이미지 URL 2건 삽입
INSERT INTO review_images
(review_id, image_file_name)
VALUES
    (1, 'brand01_1713958965868_mysql.png'),
    (1, 'super_20250801123000.png'),
    (1, '지워짐1brand01_1713958965868_mysql1.png');

-- 예시 2: review_id = 2 (이미지 3장)
INSERT INTO review
(review_id, product_id, normal_user_number, purchase_size, purchase_color, rating, title, comment, created_at, updated_at)
VALUES
    (2, 1, 2, 'S', 'GREEN', 3, '평범해요', '생각보다 얇아서 봄에만 입을 것 같아요.', '2025-06-07T14:12:05', NULL);

INSERT INTO review_images (review_id, image_file_name) VALUES
                                                           (2, '지워짐2super_20250801123000.png'),
                                                           (2, '지워짐2super_20250801123000.png'),
                                                           (2, 'brand01_1713958965868_mysql1.png'),
                                                           (2, '지워짐2super_20250801123000.png'),
                                                           (2, '지워짐2/Users/hansol/Desktop/VirtualFitting_System/basilium-server/src/main/resources/userReviewImageStorage/super_20250801123000.png');

-- 예시 3: review_id = 3 (이미지 1장)
INSERT INTO review
(review_id, product_id, normal_user_number, purchase_size, purchase_color, rating, title, comment, created_at, updated_at)
VALUES
    (3, 3, 2, 'XL', 'BLACK', 4, '디자인 굿', '블랙 색상이 정말 멋집니다.', '2025-06-06T09:45:30', NULL);

INSERT INTO review_images (review_id, image_file_name) VALUES
    (3, '지워짐3super_20250801123000.png');

COMMIT;

/* ===============================
 * 1) ProductDiscount (브랜드 1 소유 상품 1~3 금액 고정 할인)
 *    - product_price = 53,000 기준
 *    - percent는 금액 기준으로 자동 역산(반올림), 90% 상한 준수
 * =============================== */

-- 브랜드 유저 1 상품 1: 할인액 2,000원  => percent ≈ 4%
INSERT INTO product_discount
(brand_user_number, product_id, percent, discount_amount, discounted_unit_price,
 active, start_at, end_at, created_at)
SELECT
    1,
    p.product_id,
    LEAST(90, COALESCE(ROUND((2000 * 100) / NULLIF(p.product_price, 0)), 0)),
    LEAST(ROUND(p.product_price * 0.9), 2000),
    GREATEST(0, p.product_price - LEAST(ROUND(p.product_price * 0.9), 2000)),
    TRUE,
    NOW(),
    DATE_ADD(NOW(), INTERVAL 30 DAY),
    NOW()
FROM product p
WHERE p.product_id = 1
  AND p.brand_user_number = 1;

-- 브랜드 유저 1 상품 2: 할인액 3,000원  => percent ≈ 6%
INSERT INTO product_discount
(brand_user_number, product_id, percent, discount_amount, discounted_unit_price,
 active, start_at, end_at, created_at)
SELECT
    1,
    p.product_id,
    LEAST(90, COALESCE(ROUND((3000 * 100) / NULLIF(p.product_price, 0)), 0)),
    LEAST(ROUND(p.product_price * 0.9), 3000),
    GREATEST(0, p.product_price - LEAST(ROUND(p.product_price * 0.9), 3000)),
    TRUE,
    NOW(),
    DATE_ADD(NOW(), INTERVAL 30 DAY),
    NOW()
FROM product p
WHERE p.product_id = 2
  AND p.brand_user_number = 1;

-- 브랜드 유저 1 상품 3: 할인액 5,000원  => percent ≈ 9%
INSERT INTO product_discount
(brand_user_number, product_id, percent, discount_amount, discounted_unit_price,
 active, start_at, end_at, created_at)
SELECT
    1,
    p.product_id,
    LEAST(90, COALESCE(ROUND((5000 * 100) / NULLIF(p.product_price, 0)), 0)),
    LEAST(ROUND(p.product_price * 0.9), 5000),
    GREATEST(0, p.product_price - LEAST(ROUND(p.product_price * 0.9), 5000)),
    TRUE,
    NOW(),
    DATE_ADD(NOW(), INTERVAL 30 DAY),
    NOW()
FROM product p
WHERE p.product_id = 3
  AND p.brand_user_number = 1;

COMMIT;

/* ===============================
 * 2) UserDiscount (특정 일반유저 1 대상)
 *    - A: 브랜드 1 전체 5% (뷰/표시용 추가 혜택)
 *    - B: 상품 1 전용 10% (뷰/표시용 추가 혜택)
 * =============================== */

-- A) 일반 유저 1 <- 브랜드 1 전체 추가 5%
INSERT INTO user_discount
(user_number, brand_user_number, product_id, extra_percent, active, start_at, end_at, created_at)
VALUES
    (1, 1, NULL, 5, TRUE, NOW(), DATE_ADD(NOW(), INTERVAL 30 DAY), NOW());

-- B) 일반 유저 1 <- (브랜드 자동세팅) 상품 1 전용 추가 10%
INSERT INTO user_discount
(user_number, brand_user_number, product_id, extra_percent, active, start_at, end_at, created_at)
SELECT
    1                          AS user_number,
    p.brand_user_number        AS brand_user_number,  -- 상품 소유 브랜드로 자동 세팅
    p.product_id               AS product_id,
    10                         AS extra_percent,
    TRUE                       AS active,
    NOW()                      AS start_at,
    DATE_ADD(NOW(), INTERVAL 30 DAY) AS end_at,
    NOW()                      AS created_at
FROM product p
WHERE p.product_id = 1;  -- 브랜드 1 소유 상품

COMMIT;

/* ===============================
 * 3) (옵션) 상품할인 12% 예시
 *    - 실제 존재값으로 파라미터 치환: 브랜드 1, 유저 1, 상품 9(브랜드 1 소유)
 *    - 결제 기준가(공개 할인)로 적용
 * =============================== */

-- 실제 값으로 파라미터 세팅
SET @brand_user_number = 1;   -- BrandUser #1 (승인됨)
SET @user_number       = 1;   -- NormalUser #1
SET @product_id        = 9;   -- Brand 1 소유 상품
SET @start_at          = NOW();
SET @end_at            = DATE_ADD(NOW(), INTERVAL 30 DAY);

-- (모든 유저 대상) 상품할인 12% - product 9
INSERT INTO product_discount
(brand_user_number, product_id, percent, discount_amount, discounted_unit_price, active, start_at, end_at, created_at)
SELECT
    p.brand_user_number                            AS brand_user_number,
    p.product_id                                   AS product_id,
    12                                             AS percent,
    ROUND(p.product_price * 12 / 100)              AS discount_amount,
    GREATEST(0, p.product_price - ROUND(p.product_price * 12 / 100)) AS discounted_unit_price,
    TRUE                                           AS active,
    @start_at                                      AS start_at,
    @end_at                                        AS end_at,
    NOW()                                          AS created_at
FROM product p
WHERE p.product_id = @product_id
  AND p.brand_user_number = @brand_user_number;

-- (이미 위에서 A/B로 삽입했으면 아래 두 문은 생략 가능)
-- 특정 유저 1 <- 브랜드 1 전체 5%
INSERT INTO user_discount
(user_number, brand_user_number, product_id, extra_percent, active, start_at, end_at, created_at)
VALUES
    (@user_number, @brand_user_number, NULL, 5, TRUE, @start_at, @end_at, NOW());

-- 특정 유저 1 <- (브랜드 자동세팅) 상품 9 전용 10%
INSERT INTO user_discount
(user_number, brand_user_number, product_id, extra_percent, active, start_at, end_at, created_at)
SELECT
    @user_number              AS user_number,
    p.brand_user_number       AS brand_user_number,
    p.product_id              AS product_id,
    10                        AS extra_percent,
    TRUE                      AS active,
    @start_at                 AS start_at,
    @end_at                   AS end_at,
    NOW()                     AS created_at
FROM product p
WHERE p.product_id = @product_id
  AND p.brand_user_number = @brand_user_number;

COMMIT;

/* ===============================
 * 4) (옵션) 브랜드 1 전상품 5% 공개 할인 일괄
 *    - 네가 준 원문 유지: ON_SALE 필터 그대로 둠
 *    - Brand 1 소유 & ON_SALE 인 상품에만 생성됨
 *      (현재 데이터에서 status가 NULL/다르면 삽입 안될 수 있음)
 * =============================== */

-- 실제 값으로 재설정(필요 시)
SET @brand_user_number = 1;
SET @start_at          = NOW();
SET @end_at            = DATE_ADD(NOW(), INTERVAL 30 DAY);

INSERT INTO product_discount
(brand_user_number, product_id, percent, discount_amount, discounted_unit_price, active, start_at, end_at, created_at)
SELECT
    p.brand_user_number,
    p.product_id,
    5,
    ROUND(p.product_price * 5 / 100),
    GREATEST(0, p.product_price - ROUND(p.product_price * 5 / 100)),
    TRUE,
    @start_at,
    @end_at,
    NOW()
FROM product p
WHERE p.brand_user_number = @brand_user_number
  AND p.status = 'ON_SALE';   -- 전시중 상품만(원문 유지)

COMMIT;

/* ===============================
 * 5) 빠른 검증
 * =============================== */
-- 상품별 공개 할인 확인
SELECT * FROM product_discount
WHERE product_id IN (1,2,3,9)
ORDER BY created_at DESC;

-- 유저별 추가 할인 확인
SELECT * FROM user_discount
WHERE user_number = 1
ORDER BY created_at DESC;

/* ===============================
 * BrandCouponCampaign INSERT
 * =============================== */

-- 1.브랜드 전체 대상 캠페인 (scope=BRAND, product_id=NULL)
-- 예시: 브랜드 유저번호 1의 브랜드, 전체 15% 할인, 최소주문 100000, 최대할인 50000
INSERT INTO brand_coupon_campaign
(
    brand_user_number, scope, product_id,
    percent, min_order, max_discount,
    start_at, end_at,
    per_user_limit, total_issuable, issued_count,
    status, created_at, version
)
VALUES
    (
        1, 'BRAND', NULL,
        15, 100000, 50000,
        NOW() - INTERVAL 1 DAY, '2025-09-30 23:59:59',
        1, 10000, 0,
        'ACTIVE', NOW(), 0
    );

-- 새로 생성된 캠페인 ID 보관
SET @campaign_brand := LAST_INSERT_ID();

-- 2) 특정 상품 한정 쿠폰 캠페인 생성 (scope=PRODUCT)
--    - 브랜드 소유자: brand_user_number = 1
--    - 대상 상품   : product_id = 1
--    - 할인율      : 20% (1~90 허용 가정)
--    - 최소주문    : 없음 (min_order = 0)
--    - 최대할인    : 30,000 (max_discount)
--    - 기간        : 시작 = NOW() - 1 DAY (즉시 노출 목적), 종료 = '2025-10-10 23:59:59'
--    - 발급 한도   : 1인당 1장 (per_user_limit = 1), 전체 5,000장 (total_issuable = 5000), 초기 발급수 0
--    - 상태        : ACTIVE (기간과 함께 노출 조건 충족)
--    - 생성시각    : created_at = NOW()
--    - 낙관잠금    : version = 0
INSERT INTO brand_coupon_campaign
(
    brand_user_number, scope, product_id,
    percent, min_order, max_discount,
    start_at, end_at,
    per_user_limit, total_issuable, issued_count,
    status, created_at, version
)
VALUES
    (
        1, 'PRODUCT', 1,
        20, 0, 30000,
        NOW() - INTERVAL 1 DAY, '2025-10-10 23:59:59',
        1, 5000, 0,
        'ACTIVE', NOW(), 0
    );

SET @campaign_product := LAST_INSERT_ID();

/* ===============================
 * NormalCouponWallet INSERT
 * (user_number = 1)
 * =============================== */

-- 유저 변수 고정
SET @user_number := 1;

-- 1) 브랜드 전체 대상 캠페인(@campaign_brand) 지갑 발급
INSERT INTO normal_coupon_wallet
(
    user_number, campaign_id, status,
    claimed_at, used_at, used_order_id, created_at
)
VALUES
    (
        @user_number, @campaign_brand, 'AVAILABLE',
        NOW(), NULL, NULL, NOW()
    );

-- 2) 특정 상품 한정 캠페인(@campaign_product) 지갑 발급
INSERT INTO normal_coupon_wallet
(
    user_number, campaign_id, status,
    claimed_at, used_at, used_order_id, created_at
)
VALUES
    (
        @user_number, @campaign_product, 'AVAILABLE',
        NOW(), NULL, NULL, NOW()
    );

-- (선택) 방금 생성된 지갑 id 확인
SELECT * FROM normal_coupon_wallet
WHERE user_number = @user_number
  AND campaign_id IN (@campaign_brand, @campaign_product)
ORDER BY claimed_at DESC;

-- ===============================================
-- 브랜드 쿠폰 (추가)
-- 같은 브랜드(brand_user_number=1)에서 추가 캠페인 2개 더 생성
INSERT INTO brand_coupon_campaign
(brand_user_number, scope, product_id, percent, min_order, max_discount,
 start_at, end_at, per_user_limit, total_issuable, issued_count, status, created_at, version)
VALUES
-- 브랜드 전체 18%
(1, 'BRAND', NULL, 18, 0, 40000,
 NOW() - INTERVAL 1 DAY, '2025-12-31 23:59:59',
 2, 10000, 0, 'ACTIVE', NOW(), 0),
-- 특정 상품(상품ID=1) 35%
(1, 'PRODUCT', 1, 35, 50000, 70000,
 NOW() - INTERVAL 1 DAY, '2025-12-31 23:59:59',
 2, 3000, 0, 'ACTIVE', NOW(), 0);






-- wallet
/* 1) wallet: id='test' 유저가 있을 때만 생성, 이미 있으면 skip */
INSERT INTO wallet(user_number, balance, version, updated_at)
SELECT nu.user_number, 0, 0, NOW()
FROM normal_user nu
WHERE nu.id = 'test'
  AND NOT EXISTS (
    SELECT 1 FROM wallet w WHERE w.user_number = nu.user_number
);

/* 2) 리뷰 적립(CREDIT) ledger 멱등 + 잔액 반영 */
-- ledger: unique_key 중복이면 skip
INSERT INTO wallet_ledger(user_number, type, ref_type, ref_id, amount, balance_after, unique_key, created_at)
SELECT nu.user_number, 'CREDIT', 'REVIEW', '12345', 1500,
       (SELECT COALESCE(w.balance,0) + 1500 FROM wallet w WHERE w.user_number = nu.user_number),
       'REVIEW:12345', NOW()
FROM normal_user nu
WHERE nu.id = 'test'
  AND EXISTS (SELECT 1 FROM wallet w WHERE w.user_number = nu.user_number)
  AND NOT EXISTS (SELECT 1 FROM wallet_ledger wl WHERE wl.unique_key = 'REVIEW:12345');

-- wallet 잔액 실제 반영 (존재할 때만)
UPDATE wallet w
    JOIN normal_user nu ON nu.id = 'test' AND nu.user_number = w.user_number
SET w.balance = w.balance + 1500,
    w.version = w.version + 1,
    w.updated_at = NOW()
WHERE EXISTS (SELECT 1 FROM wallet_ledger wl WHERE wl.unique_key = 'REVIEW:12345');

/* 3) 결제 차감(DEBIT) ledger 멱등 + 잔액 반영 */
INSERT INTO wallet_ledger(user_number, type, ref_type, ref_id, amount, balance_after, unique_key, created_at)
SELECT nu.user_number, 'DEBIT', 'PAYMENT', '20250901093000001', 1000,
       (SELECT COALESCE(w.balance,0) - 1000 FROM wallet w WHERE w.user_number = nu.user_number),
       'PAYMENT:20250901093000001', NOW()
FROM normal_user nu
WHERE nu.id = 'test'
  AND EXISTS (SELECT 1 FROM wallet w WHERE w.user_number = nu.user_number)
  AND NOT EXISTS (SELECT 1 FROM wallet_ledger wl WHERE wl.unique_key = 'PAYMENT:20250901093000001');

UPDATE wallet w
    JOIN normal_user nu ON nu.id = 'test' AND nu.user_number = w.user_number
SET w.balance = w.balance - 1000,
    w.version = w.version + 1,
    w.updated_at = NOW()
WHERE EXISTS (SELECT 1 FROM wallet_ledger wl WHERE wl.unique_key = 'PAYMENT:20250901093000001');






/* payment */
-- === Payment #1: 유저(example, user_number=2)가 상품 1(BLACK, M) 1개를 카드로 승인 ===
INSERT INTO payment (
    id, order_id, normal_user_number, status, currency, intent_expires_at,
    points_to_use, amount, refunded_total,
    payment_key, payment_type,
    pg_error_code, pg_error_message,
    created_at, approved_at, callback_received_at, imp_u_id
) VALUES (
             1, '20250903-200000-UUID-EXAMPLE-2', 2, 'APPROVED', 'KRW', NULL,
             0, 19000, 0,
             'paykey-example-0001', 'CARD',
             NULL, NULL,
             '2025-09-03 20:00:00', '2025-09-03 20:01:00', '2025-09-03 20:01:00', NULL
         );

INSERT INTO payment_intent_line (
    id, payment_id, product_id, size, color, qty,
    unit_after_brand, line_base,
    coupon_wallet_id, coupon_discount, line_after_coupon,
    alloc_point, final_line_payable,
     status, created_at, approved_at
) VALUES (
             1, 1, 1, 'M', 'BLACK', 1,
             19000, 19000,
             NULL, 0, 19000,
             0, 19000,
            'APPROVED', '2025-09-03 20:00:30', '2025-09-03 20:01:00'
         );

COMMIT;

-- === Payment #2: 유저(test, user_number=1)가 상품 2(WHITE, L) 1개를 카드로 승인 ===
INSERT INTO payment (
    id, order_id, normal_user_number, status, currency, intent_expires_at,
    points_to_use, amount, refunded_total,
    payment_key, payment_type,
    pg_error_code, pg_error_message,
    created_at, approved_at, callback_received_at, imp_u_id
) VALUES (
             2, '20250903-200500-UUID-TEST-1', 1, 'APPROVED', 'KRW', NULL,
             0, 53000, 0,
             'paykey-test-0001', 'CARD',
             NULL, NULL,
             '2025-09-03 20:05:00', '2025-09-03 20:05:40', '2025-09-03 20:05:40', NULL
         );

INSERT INTO payment_intent_line (
    id, payment_id, product_id, size, color, qty,
    unit_after_brand, line_base,
    coupon_wallet_id, coupon_discount, line_after_coupon,
    alloc_point, final_line_payable,
    status, created_at, approved_at
) VALUES (
             2, 2, 2, 'L', 'WHITE', 1,
             53000, 53000,
             NULL, 0, 53000,
             0, 53000,
             'APPROVED', '2025-09-03 20:05:10', '2025-09-03 20:05:40'
         );

COMMIT;





INSERT INTO delivery_info(delivery_info_id, user_number, default_delivery_address, first_delivery_address, second_delivery_address)
VALUES (1, 1, "경기도 성남시 분당구 서현동 현대아파트 428동 1202호", "대구광역시 동구 아양로 애일린의 뜰", "대구광역시 동구 신암동 신암뜨란채 104동 1906호");


/*주문목록*/
/*
-- 주문 테이블에 데이터 삽입
INSERT INTO orders (price, order_uid, user_number)
VALUES (160000, '20240515091315', 1);

-- 상품-주문 연결 테이블에 데이터 삽입
INSERT INTO orders_products (order_id, products_product_id)
VALUES (1, 1),
       (1, 2);

 */



INSERT INTO shopping_cart (user_number, product_id, size, color, amount)
values (1, 1, "L","black",1);
INSERT INTO shopping_cart (user_number, product_id, size, color, amount)
values (1, 2, "M","white",1);
commit;

INSERT INTO like_history (user_number, product_id)
values (1, 1);

commit;




