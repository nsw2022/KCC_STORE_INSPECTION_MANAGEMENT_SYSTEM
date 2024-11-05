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
    <link
            href="https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.min.css"
            rel="stylesheet"
    />
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css" />
    <link rel='stylesheet' href='https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css' integrity='sha512-iecdLmaskl7CVkqkXNQ/ZH/XLlvWZOJyj7Yy7tcenmpD1ypASozpmT/E0iPtmFIB46ZmdtAc9eNBvH0H/ZpiBw==' crossorigin='anonymous'/>

    <link rel="stylesheet" href="/resources/css/qsc/store_inspection/popup_inspection.css">
    <script src='https://cdnjs.cloudflare.com/ajax/libs/gsap/3.11.5/gsap.min.js'></script>
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
</head>
<body>
<div class="progress-container">
    <div class="step active">
        <div class="circle active">
            <div class="inner-circle active"></div>
        </div>
        <p>점검</p>
    </div>
    <div class="line"></div>
    <div class="step">
        <div class="circle">
            <div class="inner-circle"></div>
        </div>
        <p>결과확인</p>
    </div>
    <div class="line"></div>
    <div class="step">
        <div class="circle">
            <div class="inner-circle"></div>
        </div>
        <p>서명</p>
    </div>
    <div class="line"></div>
    <div class="step">
        <div class="circle">
            <div class="inner-circle"></div>
        </div>
        <p>확인</p>
    </div>
</div>

<section class="inspection-detail" id="inspection-detail">
    <!-- JavaScript를 통해 동적으로 내용이 채워집니다. -->
</section>


<section class="inspection-section">
    <!-- 탭 버튼들을 동적으로 생성할 컨테이너 -->
    <div class="inspection-tabs">
        <!-- JavaScript를 통해 동적으로 생성됩니다. -->
    </div>

    <!-- 콘텐츠 섹션들을 동적으로 생성할 컨테이너 -->
    <!-- JavaScript가 이 위치에 콘텐츠를 삽입합니다. -->
<%--    <div class="inspection-total-score">--%>
<%--        <p>총 <span>100</span> 점</p>--%>
<%--    </div>--%>


</section>


<div id="go-inspection-wrap">
    <button class="go-inspection" onclick="checkInspection()">점검확인</button>
    <button class="go-inspection" onclick="temporarySave()">임시저장</button>
</div>


</body>
<%--<script src="/resources/js/qsc/store_inspection/store_inspection_popup.js"></script>--%>
<script src="/resources/js/qsc/store_inspection/popup_inspection.js"></script>
</html>
