
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


INSERT INTO brand_user (user_number, id, password, email_address, phone_number, user_grade, login_type, user_image_url, user_profile_image_url, firm_name, firm_address, business_registration, firm_web_url)
VALUES (1,'brand01', '1q2w3e4r!R', 'example@naver.com', '010-1234-5678', 0, 1, '/Users/hansol/Desktop/VirtualFitting_System/basilium-server/src/main/resources/userImageStorage/brand01_1713958965868_mysql.png','프로필지워짐1', '박한솔컴퍼니', '대구광역시 달서구 저승길 6길', '20-17777777', 'http://phs-컴퍼니');
commit;
INSERT INTO brand_user (user_number, id, password, email_address, phone_number, user_grade, login_type, user_image_url, user_profile_image_url,firm_name, firm_address, business_registration, firm_web_url)
VALUES (2,'brand02', '1q2w3e4r!R', 'example2@naver.com', '010-1234-5678', 0, 1, '/Users/hansol/user2번스케줄링_테스트_날라가야_정상.png','프로필지워짐2', '박한솔컴퍼니', '대구광역시 달서구 저승길 6길', '20-17777777', 'http://phs-컴퍼니');
commit;
INSERT INTO basilium.normal_user (user_number, id, password, email_address, phone_number, user_grade, user_image_url, user_profile_image_url, name, birth_date, address)
VALUES (1, 'test', 'test', 'user01@example.com', '010-1234-5678', 0, 'https://yt3.googleusercontent.com/2ATPERKZIno-VMcNnzO_-SYM8fZqgkhFQ7LtUPlUTcFpUkOFdrcP1KFX4NNm8r4gQIqkPKRe=s176-c-k-c0x00ffffff-no-rj','프로필지워짐3', '우정잉', null, '서울특별시 강남구');
commit;
INSERT INTO normal_user (user_number, id, password, email_address, phone_number, user_grade, login_type, user_image_url, user_profile_image_url, name, birth_date, address)
VALUES (2, 'example', '1q2w3e4r!R', 'example@naver.com', '010-1234-5678', 0, 0,'/Users/hansol/Desktop/VirtualFitting_System/basilium-server/src/main/resources/userImageStorage/example_1713958965868_mysql.png','L1VzZXJzL2hhbnNvbC9EZXNrdG9wL1ZpcnR1YWxGaXR0aW5nX1N5c3RlbS9iYXNpbGl1bS1zZXJ2ZXIvc3JjL21haW4vcmVzb3VyY2VzL3VzZXJQcm9maWxlSW1hZ2VTdG9yYWdlL2V4YW1wbGVfMTcxODEyMjY0NzAxM19hLnBuZw==', '우정잉', '2000-12-20', '서울특별시 강남구');
commit;


/*1*/
INSERT INTO product (product_id, category_id, product_name, product_price, product_total_length, product_chest, product_shoulder, product_arm, product_desc, brand_user_number, total_quantity)
VALUES (1, 1, '바실리움 로고 반팔티(블랙)', 53000, 70, 52, 48, 21, '반팔 모찌모찌함', 1, 100);

INSERT INTO product_photo_urls (product_id, product_photo_url)
VALUES
    (1, 'https://s3.ap-northeast-2.amazonaws.com/basilium-product-bucket/main1_1.png'),
    (1, 'https://s3.ap-northeast-2.amazonaws.com/basilium-product-bucket/sub2.png');

INSERT INTO product_sub_photo_urls (product_id, product_sub_photo_url)
VALUES
    (1, 'https://s3.ap-northeast-2.amazonaws.com/basilium-product-bucket/sub_1.png'),
    (1, 'https://s3.ap-northeast-2.amazonaws.com/basilium-product-bucket/sub2.png'),
    (1, 'https://s3.ap-northeast-2.amazonaws.com/basilium-product-bucket/sub_7.png');

-- Product 색상 삽입
INSERT INTO product_colors (product_id, product_color)
VALUES
    (1, 0);

-- Product 재질 삽입
INSERT INTO product_materials (product_id, product_material)
VALUES
    (1, 0),
    (1, 1);

-- Product 사이즈 삽입
INSERT INTO product_sizes (product_id, product_size)
VALUES
    (1, 2),
    (1, 3);

commit;


/*2*/
INSERT INTO product (product_id, category_id, product_name, product_price, product_total_length, product_chest, product_shoulder, product_arm, product_desc, brand_user_number, total_quantity)
VALUES (2, 1, '바실리움 로고 반팔티(화이트)', 53000, 70, 52, 48, 21, '반팔 모찌모찌함', 1, 100);

INSERT INTO product_photo_urls (product_id, product_photo_url)
VALUES
    (2, 'https://s3.ap-northeast-2.amazonaws.com/basilium-product-bucket/main1_2.png'),
    (2, 'https://s3.ap-northeast-2.amazonaws.com/basilium-product-bucket/sub2.png');

INSERT INTO product_sub_photo_urls (product_id, product_sub_photo_url)
VALUES
    (2, 'https://s3.ap-northeast-2.amazonaws.com/basilium-product-bucket/sub_1.png'),
    (2, 'https://s3.ap-northeast-2.amazonaws.com/basilium-product-bucket/sub2.png'),
    (2, 'https://s3.ap-northeast-2.amazonaws.com/basilium-product-bucket/sub_7.png');

-- Product 색상 삽입
INSERT INTO product_colors (product_id, product_color)
VALUES
    (2, 1);

-- Product 재질 삽입
INSERT INTO product_materials (product_id, product_material)
VALUES
    (2, 0),
    (2, 1);

-- Product 사이즈 삽입
INSERT INTO product_sizes (product_id, product_size)
VALUES
    (2, 2),
    (2, 3);

commit;

/*3*/
INSERT INTO product (product_id, category_id, product_name, product_price, product_total_length, product_chest, product_shoulder, product_arm, product_desc, brand_user_number, total_quantity)
VALUES (3, 2, '바실리움 백로고 맨투맨(블랙)', 53000, 70, 52, 48, 21, '맨투맨 모찌모찌함', 1, 100);

INSERT INTO product_photo_urls (product_id, product_photo_url)
VALUES
    (3, 'https://s3.ap-northeast-2.amazonaws.com/basilium-product-bucket/main1.png'),
    (3, 'https://s3.ap-northeast-2.amazonaws.com/basilium-product-bucket/sub_4_1.png'),
    (3, 'https://s3.ap-northeast-2.amazonaws.com/basilium-product-bucket/sub2.png');

INSERT INTO product_sub_photo_urls (product_id, product_sub_photo_url)
VALUES (3, 'https://s3.ap-northeast-2.amazonaws.com/basilium-product-bucket/sub_1.png'),
       (3, 'https://s3.ap-northeast-2.amazonaws.com/basilium-product-bucket/sub2.png'),
       (3, 'https://s3.ap-northeast-2.amazonaws.com/basilium-product-bucket/sub_3_1.png'),
       (3, 'https://s3.ap-northeast-2.amazonaws.com/basilium-product-bucket/sub_7.png');

-- Product 색상 삽입
INSERT INTO product_colors (product_id, product_color)
VALUES
    (3, 0);

-- Product 재질 삽입
INSERT INTO product_materials (product_id, product_material)
VALUES
    (3, 0),
    (3, 1);

-- Product 사이즈 삽입
INSERT INTO product_sizes (product_id, product_size)
VALUES
    (3, 2),
    (3, 3);

commit;

/*AI용1*/
INSERT INTO product (product_id, category_id, product_name, product_price, product_total_length, product_chest, product_shoulder, product_arm, product_desc, brand_user_number, total_quantity)
VALUES (4, 1, '프린팅 반팔', 35000, 70, 52, 48, 21, '여름 프린팅 반팔 모찌모찌함', 2, 100);

INSERT INTO product_photo_urls (product_id, product_photo_url)
VALUES
    (4, 'https://s3.ap-northeast-2.amazonaws.com/basilium-product-bucket/top01.png'),
    (4, 'https://s3.ap-northeast-2.amazonaws.com/basilium-product-bucket/sub2.png');

INSERT INTO product_sub_photo_urls (product_id, product_sub_photo_url)
VALUES (4, 'https://s3.ap-northeast-2.amazonaws.com/basilium-product-bucket/sub_1.png'),
       (4, 'https://s3.ap-northeast-2.amazonaws.com/basilium-product-bucket/sub_7.png');

-- Product 색상 삽입
INSERT INTO product_colors (product_id, product_color)
VALUES
    (4, 1);

-- Product 재질 삽입
INSERT INTO product_materials (product_id, product_material)
VALUES
    (4, 0),
    (4, 1);

-- Product 사이즈 삽입
INSERT INTO product_sizes (product_id, product_size)
VALUES
    (4, 2),
    (4, 3);
commit;

/*AI용2*/
INSERT INTO product (product_id, category_id, product_name, product_price, product_total_length, product_chest, product_shoulder, product_arm, product_desc, brand_user_number, total_quantity)
VALUES (5, 1, '줄무늬 반팔', 33000, 70, 52, 48, 21, '여름 얼룩말 반팔 모찌모찌함', 2, 100);

INSERT INTO product_photo_urls (product_id, product_photo_url)
VALUES
    (5, 'https://s3.ap-northeast-2.amazonaws.com/basilium-product-bucket/top02.png'),
    (5, 'https://s3.ap-northeast-2.amazonaws.com/basilium-product-bucket/sub2.png');

INSERT INTO product_sub_photo_urls (product_id, product_sub_photo_url)
VALUES (5, 'https://s3.ap-northeast-2.amazonaws.com/basilium-product-bucket/sub_1.png'),
       (5, 'https://s3.ap-northeast-2.amazonaws.com/basilium-product-bucket/sub_7.png');
-- Product 색상 삽입
INSERT INTO product_colors (product_id, product_color)
VALUES
    (5, 1);

-- Product 재질 삽입
INSERT INTO product_materials (product_id, product_material)
VALUES
    (5, 0),
    (5, 1);

-- Product 사이즈 삽입
INSERT INTO product_sizes (product_id, product_size)
VALUES
    (5, 2),
    (5, 3);
commit;

/*AI용3*/
INSERT INTO product (product_id, category_id, product_name, product_price, product_total_length, product_chest, product_shoulder, product_arm, product_desc, brand_user_number, total_quantity)
VALUES (6, 2, '줄무늬 모찌 긴팔', 68000, 70, 52, 48, 21, '여름 얼룩말 긴팔 모찌모찌함', 2, 100);

INSERT INTO product_photo_urls (product_id, product_photo_url)
VALUES
    (6, 'https://s3.ap-northeast-2.amazonaws.com/basilium-product-bucket/top03.png'),
    (6, 'https://s3.ap-northeast-2.amazonaws.com/basilium-product-bucket/sub2.png');

INSERT INTO product_sub_photo_urls (product_id, product_sub_photo_url)
VALUES (6, 'https://s3.ap-northeast-2.amazonaws.com/basilium-product-bucket/sub_1.png'),
       (6, 'https://s3.ap-northeast-2.amazonaws.com/basilium-product-bucket/sub_7.png');
-- Product 색상 삽입
INSERT INTO product_colors (product_id, product_color)
VALUES
    (6, 1);

-- Product 재질 삽입
INSERT INTO product_materials (product_id, product_material)
VALUES
    (6, 0),
    (6, 1);

-- Product 사이즈 삽입
INSERT INTO product_sizes (product_id, product_size)
VALUES
    (6, 2),
    (6, 3);
commit;

/*정렬용1*/
INSERT INTO product (product_id, category_id, product_name, product_price, product_total_length, product_chest, product_shoulder, product_arm, product_desc, brand_user_number, total_quantity)
VALUES (7, 8, '모찌 팬츠', 65000, 70, 52, 48, 21, '여름 팬츠 모찌모찌함', 2, 100);

INSERT INTO product_photo_urls (product_id, product_photo_url)
VALUES
    (7, 'https://s3.ap-northeast-2.amazonaws.com/basilium-product-bucket/pants01.png'),
    (7, 'https://s3.ap-northeast-2.amazonaws.com/basilium-product-bucket/sub2.png');

INSERT INTO product_sub_photo_urls (product_id, product_sub_photo_url)
VALUES (7, 'https://s3.ap-northeast-2.amazonaws.com/basilium-product-bucket/sub_1.png'),
       (7, 'https://s3.ap-northeast-2.amazonaws.com/basilium-product-bucket/sub_7.png');
-- Product 색상 삽입
INSERT INTO product_colors (product_id, product_color)
VALUES
    (7, 1);

-- Product 재질 삽입
INSERT INTO product_materials (product_id, product_material)
VALUES
    (7, 0),
    (7, 1);

-- Product 사이즈 삽입
INSERT INTO product_sizes (product_id, product_size)
VALUES
    (7, 2),
    (7, 3);
commit;

/*정렬용2*/
INSERT INTO product (product_id, category_id, product_name, product_price, product_total_length, product_chest, product_shoulder, product_arm, product_desc, brand_user_number, total_quantity)
VALUES (8, 9, '모찌 스커트 치마', 84000, 70, 52, 48, 21, '여름 치마 모찌모찌함', 2, 100);

INSERT INTO product_photo_urls (product_id, product_photo_url)
VALUES
    (8, 'https://s3.ap-northeast-2.amazonaws.com/basilium-product-bucket/skirt01.png'),
    (8, 'https://s3.ap-northeast-2.amazonaws.com/basilium-product-bucket/sub2.png');

INSERT INTO product_sub_photo_urls (product_id, product_sub_photo_url)
VALUES (8, 'https://s3.ap-northeast-2.amazonaws.com/basilium-product-bucket/sub_1.png'),
       (8, 'https://s3.ap-northeast-2.amazonaws.com/basilium-product-bucket/sub_7.png');
-- Product 색상 삽입
INSERT INTO product_colors (product_id, product_color)
VALUES
    (8, 1);

-- Product 재질 삽입
INSERT INTO product_materials (product_id, product_material)
VALUES
    (8, 0),
    (8, 1);

-- Product 사이즈 삽입
INSERT INTO product_sizes (product_id, product_size)
VALUES
    (8, 2),
    (8, 3);
commit;





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

/*
INSERT INTO Product (category_id, product_name, product_price, product_desc, product_photo_url)
VALUES (1, '문비글 / 깔끔단정 어게인 레터링 스판 라운드 반팔 티셔츠', 18900, '베스트셀러 아이템: 남녀공용 오버사이즈 티셔츠. 로켓배송 가능.', 'https://thumbnail7.coupangcdn.com/thumbnails/remote/230x230ex/image/vendor_inventory/4991/23276e00825eddb77e5c55619ac6637fd991c5efbd43ad7eee136adf282d.png');

INSERT INTO Product (category_id, product_name, product_price, product_desc, product_photo_url)
VALUES (2, '제작티01탄 1+1 데일리필수 소프트텐션 기본핏 라운드반팔티', 9900, '로켓배송, 내일(금) 도착 보장. 평점 4.0 (1144)', 'https://thumbnail7.coupangcdn.com/thumbnails/remote/230x230ex/image/vendor_inventory/3d85/d4eee945d43f389f33989893285eea7f13f73977a6d3dc8ddcf4e99e1360.jpg');

INSERT INTO Product (category_id, product_name, product_price, product_desc, product_photo_url)
VALUES (3, '1+1 자체제작 촉감왕 여름 데일리 소프트 모달 스판 라운드 반팔티', 26960, '순면 소재의 캐주얼 스타일. 4/23 도착 예정.', 'https://thumbnail8.coupangcdn.com/thumbnails/remote/230x230ex/image/vendor_inventory/3560/2fe7a770fa24a586a912cd4b6149ded88dccb469eee1de9ebf775afab993.jpg');

INSERT INTO Product (category_id, product_name, product_price, product_desc, product_photo_url)
VALUES (4, '이브컴퍼니 4장묶음 (1+3) 남녀공용 오버핏 라운드 무지 긴팔티셔츠 (1611-4)', 25500, '캐주얼 슬림핏 스타일, 36% 할인율. 4/23 도착 예정, 평점 3.5', 'https://thumbnail10.coupangcdn.com/thumbnails/remote/230x230ex/image/vendor_inventory/bd36/722efd676290f18b692f4066eb292c4a271ae40874f01c39fecd49958430.png');
commit;

 */




INSERT INTO shopping_cart (user_number, product_id, size, color, amount)
values (1, 1, "L","black",1);
INSERT INTO shopping_cart (user_number, product_id, size, color, amount)
values (1, 2, "M","white",1);
commit;

INSERT INTO like_history (user_number, product_id)
values (1, 1);

commit;


INSERT INTO payment(transaction_id, user_number, product_id, size, color, total_cnt, payment_type, transaction_creation_time)
VALUES (1, 1, 1, "L","black",1, 0, CURRENT_TIMESTAMP);



commit;