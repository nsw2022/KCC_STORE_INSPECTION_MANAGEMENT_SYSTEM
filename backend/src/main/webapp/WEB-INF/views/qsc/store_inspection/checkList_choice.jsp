<%@ page language="java" contentType="text/html; charset=UTF-8"
         pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>가맹점 점검 팝업</title>
    <!-- Bootstrap CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <!-- Font Awesome -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css">
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
            href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@100..900&display=swap"
            rel="stylesheet"
    />
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css" />
    <link rel='stylesheet' href='https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css' integrity='sha512-iecdLmaskl7CVkqkXNQ/ZH/XLlvWZOJyj7Yy7tcenmpD1ypASozpmT/E0iPtmFIB46ZmdtAc9eNBvH0H/ZpiBw==' crossorigin='anonymous'/>

    <link rel="stylesheet" href="/resources/css/qsc/store_inspection/checkList_choice.css">
    <script src='https://cdnjs.cloudflare.com/ajax/libs/gsap/3.11.5/gsap.min.js'></script>
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
</head>
<body>

<%--        ----해당부분은 동적으로 변동이 될부분----        --%>
<div class="inspection-content-wrapper">
<%--    <form method="POST" id="inspectionForm">--%>
    <!-- 사진 업로드 구역 -->
    <div class="answer-section">
        <button class="answer-btn">예</button>
        <button class="answer-btn">아니오</button>
    </div>
<%--        <div id="dynamic-answer-section"></div>--%>

    <div class="photo-section">
        <div class="photo-buttons">
            <button class="photo-btn camera-btn">
                <i class="fa-solid fa-camera"></i>사진촬영
            </button>
            <button class="photo-btn gallery-btn">
                <i class="fa-regular fa-image"></i>갤러리
            </button>
        </div>
        <div class="photo-boxes">
            <div class="photo-box">사진 미등록</div>
            <div class="photo-box">최대 2개</div>
        </div>
    </div>

    <!-- 매장 정보 라디오 버튼 리스트 -->
    <div class="store-info">
        <div class="tab-section">
            <button class="tab-btn active">위치정보</button>
            <button class="tab-btn">상세입력</button>
        </div>

        <!-- 위치정보 -->
        <div class="content location-content">
            <div class = "content location-content-list">
                <label class="radio-label">
                    매장
                    <input type="radio" name="location">
                </label>
                <label class="radio-label">
                    카페
                    <input type="radio" name="location">
                </label>
                <label class="radio-label">
                    주방
                    <input type="radio" name="location">
                </label>
                <label class="radio-label">
                    기타
                    <input type="radio" name="location">
                </label>

            </div>

            <!-- 기타사항 입력 -->
            <div class="other-info">
                <label>기타사항</label>
                <textarea class="etc-input" name="responsibility" placeholder="기타사항을 입력해주세요"></textarea>
            </div>
        </div>

        <!-- 상세입력 정보 (숨김 상태) -->
        <div class="content detail-content">
            <div class="input-group-cover">
                <div class="input-group">
                    <label>제품명 (또는 상세위치)</label>
                    <input type="text" class="product-name" placeholder="제품명 입력">
                </div>
                <div class="input-group">
                    <label>위반수량</label>
                    <input type="text" class="violation-quantity" placeholder="위반수량 입력">
                </div>
            </div>

            <div class="input-group">
                <label>원인</label>
                <textarea class="reason" placeholder="원인을 작성해주세요"></textarea>
            </div>
            <div class="input-group">
                <label>개선조치사항</label>
                <textarea class="action" placeholder="개선조치사항을 입력해주세요"></textarea>
            </div>
            <div class="input-group">
                <label>위반사항</label>
                <textarea class="violation" placeholder="위반사항을 입력해주세요"></textarea>
            </div>
            <div class="input-group">
                <label>귀책사유</label>
                <div class="radio-group">
                    <label>
                        SV <input type="radio" name="responsibility" value="SV">
                    </label>
                    <label>
                        점주 <input type="radio" name="responsibility" value="Owner">
                    </label>
                    <label>
                        직원 <input type="radio" name="responsibility" value="Employee">
                    </label>
                    <label>
                        기타 <input type="radio" name="responsibility" value="Other">
                    </label>
                </div>
                <textarea class="caupvd" placeholder="귀책사유를 입력해주세요"></textarea>
            </div>
        </div>
    </div>
<%--    </form>--%>

</div>

<%--        ----해당부분은 동적으로 변동이 될부분----        --%>

</body>
<script src="/resources/js/qsc/store_inspection/checkList_choice.js"></script>
</html>