
INSERT INTO basilium.category (category_id, category_name) VALUES (1, '티셔츠');
INSERT INTO basilium.category (category_id, category_name) VALUES (2, '셔츠');
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

INSERT INTO brand_user (user_number, id, password, email_address, phone_number, user_grade, login_type, user_image_url, firm_name, firm_address, business_registration, firm_web_url)
VALUES (1,'brand01', '1q2w3e4r!R', 'example@naver.com', '010-1234-5678', 0, 1, '/Users/hansol/Desktop/VirtualFitting_System/basilium-server/src/main/java/basilium/basiliumserver/userImageStorage/brand01_1713958965868_mysql.png', '박한솔컴퍼니', '대구광역시 달서구 저승길 6길', '20-17777777', 'http://phs-컴퍼니');
commit;
INSERT INTO brand_user (user_number, id, password, email_address, phone_number, user_grade, login_type, user_image_url, firm_name, firm_address, business_registration, firm_web_url)
VALUES (2,'brand02', '1q2w3e4r!R', 'example2@naver.com', '010-1234-5678', 0, 1, '/Users/hansol/user2번스케줄링_테스트_날라가야_정상.png', '박한솔컴퍼니', '대구광역시 달서구 저승길 6길', '20-17777777', 'http://phs-컴퍼니');
commit;
INSERT INTO normal_user (user_number, id, password, email_address, phone_number, user_grade, login_type, user_image_url, name, birth_date, address)
VALUES (1, 'example', '1q2w3e4r!R', 'example@naver.com', '010-1234-5678', 0, 0,'/Users/hansol/Desktop/VirtualFitting_System/basilium-server/src/main/java/basilium/basiliumserver/userImageStorage/example_1713958965868_mysql.png', '우정잉', '2000-12-20', '서울특별시 강남구');
commit;

INSERT INTO product (product_id, category_id, product_name, product_price, product_desc, brand_user_number)
VALUES (1, 5, '바실리움 로고 후드티', 53000, '후드티 모찌모찌함', 1);

INSERT INTO product_photo_urls (product_id, product_photo_url)
VALUES (1, 'https://s3.ap-northeast-2.amazonaws.com/basilium-product-bucket/brand01_1714827354089_ad.png');

INSERT INTO product_sub_photo_urls (product_id, product_sub_photo_url)
VALUES (1, 'https://s3.ap-northeast-2.amazonaws.com/basilium-product-bucket/brand01_1714827365449_ad.png');

commit;


/*
INSERT INTO basilium.normal_user (user_number, id, password, email_address, phone_number, user_grade, user_image_url, name, birth_date, address)
VALUES (1, 'test', 'test', 'user01@example.com', '010-1234-5678', 0, 'https://yt3.googleusercontent.com/2ATPERKZIno-VMcNnzO_-SYM8fZqgkhFQ7LtUPlUTcFpUkOFdrcP1KFX4NNm8r4gQIqkPKRe=s176-c-k-c0x00ffffff-no-rj', '우정잉', null, '서울특별시 강남구');
commit;
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




INSERT INTO shopping_cart (user_number, product_id, amount)
values (1, 1, 1);

commit;

INSERT INTO like_history (user_number, product_id)
values (1, 1);

commit;


INSERT INTO purchase_transaction(transaction_id, user_number, product_id, total_cnt, payment_type, transaction_creation_time)
VALUES (1, 1, 1, 1, 0, CURRENT_TIMESTAMP);



commit;