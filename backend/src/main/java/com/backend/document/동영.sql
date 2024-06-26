-- 기존 테이블 생성문
CREATE TABLE RESERVATION
(
    RESERVATION_ID INT PRIMARY KEY AUTO_INCREMENT,
    SPACE_ID       INT NOT NULL,
    MEMBER_ID      INT NOT NULL,
    START_DATE     DATE,
    END_DATE       DATE,
    START_TIME     TIME,
    END_TIME       TIME,
    STATUS         ENUM ('APPLY', 'ACCEPT', 'COMPLETE_PAYMENT'),
    INPUT_DT       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UPDATE_DT      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (SPACE_ID) REFERENCES SPACE (SPACE_ID),
    FOREIGN KEY (MEMBER_ID) REFERENCES MEMBER (MEMBER_ID)
);


-- STATUS 컬럼을 ENUM 타입으로 변경
ALTER TABLE RESERVATION
    MODIFY COLUMN STATUS ENUM ('APPLY', 'ACCEPT', 'COMPLETE_PAYMENT');


ALTER TABLE RESERVATION
    CHANGE COLUMN DATE START_DATE DATE,
    ADD COLUMN END_DATE DATE;

drop table RESERVATION;

use spaceHub;
SELECT *
FROM SPACE;

SELECT *
FROM Member;

SELECT *
FROM RESERVATION;



SELECT  *
FROM    PAID ;


SELECT * FROM SPACE
WHERE   HOST_ID = 1;


SELECT  R.*
,       S.TITLE
,       M.NICKNAME
FROM    RESERVATION R
JOIN    MEMBER M ON M.MEMBER_ID = R.MEMBER_ID
JOIN    SPACE S ON S.SPACE_ID = R.SPACE_ID
WHERE   R.SPACE_ID = 4

SELECT  R.*
     ,       M.NICKNAME
FROM RESERVATION R
         LEFT JOIN MEMBER M ON M.MEMBER_ID = R.MEMBER_ID
WHERE SPACE_ID = 4

WHERE RESERVATION_ID = 25;

SELECT * FROM SPACE;
SELECT * FROM TYPE_LIST;

SELECT s.*, h.*, t.*
FROM SPACE s
         JOIN HOST h ON s.HOST_ID = h.HOST_ID
         JOIN TYPE_LIST t ON s.TYPE_LIST_ID = t.TYPE_LIST_ID
WHERE s.SPACE_ID = 3


SELECT  R.*
,       S.TITLE
,       S.ADDRESS
FROM    RESERVATION R
LEFT JOIN SPACE S ON R.SPACE_ID = S.SPACE_ID
WHERE MEMBER_ID = 1

SELECT * FROM BOARD;
USE spaceHub;

INSERT INTO CATEGORY (CATEGORY_NAME) VALUES ('NOTICE');
INSERT INTO CATEGORY (CATEGORY_NAME) VALUES ('FAQ');

