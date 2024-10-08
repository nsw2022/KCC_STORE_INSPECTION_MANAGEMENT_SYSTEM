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

    <link rel="stylesheet" href="/resources/css/qsc/store_inspection/store_inspection_popup.css">
    <script src='https://cdnjs.cloudflare.com/ajax/libs/gsap/3.11.5/gsap.min.js'></script>
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
</head>
<body>
<%--    <p>가맹점명: <%= inspectionData.getStoreName() %></p>--%>
<%--    <p>점검 일자: <%= inspectionData.getInspectionDate() %></p>--%>
<%--    <p>점검 분류: <%= inspectionData.getInspectionType() %></p>--%>
<section class="inspection-detail">
    <div class="inspection-header">
        <h2>점검 가맹점 상세조회</h2>
    </div>
    <div class="inspection-info">
        <table class="inspection-table">
            <thead>
            <tr>
                <th colspan="2">
                    <span class="inspection-status">KCC 크라상</span>
                    <span class="inspection-subtitle">가맹점 (이름예시 아무거나 추가하기)</span>
                </th>
            </tr>
            </thead>
            <tbody>
            <tr>
                <td>
                    <i class="fas fa-calendar-alt"></i> 점검일 : 2024 - 09 - 24
                </td>
                <td>
                    <i class="fas fa-calendar-check"></i> 최근 점검일 : 2024 - 09 - 17
                </td>
            </tr>
            <tr>
                <td>
                    <i class="fas fa-clock"></i> 개점시간 : 11:30
                </td>
                <td>
                    <i class="fas fa-user"></i> 점검자 : 노승우
                </td>
            </tr>
            </tbody>
        </table>
    </div>
</section>

<section class="inspection-results-section">
    <table class="inspection-results-table">
        <thead>
        <tr>
            <th>유형</th>
            <th>점검일자</th>
            <th>점검자</th>
            <th>점수</th>
            <th>이력</th>
        </tr>
        </thead>
        <tbody>
        <tr>
            <td>위생점검</td>
            <td>2024 - 09 - 10</td>
            <td>노승우</td>
            <td>75</td>
            <td><button class="history-btn">이력조회</button></td>
        </tr>
        <tr>
            <td>위생점검</td>
            <td>2024 - 08 - 12</td>
            <td>유재원</td>
            <td>70</td>
            <td><button class="history-btn">이력조회</button></td>
        </tr>
        <tr>
            <td>위생점검</td>
            <td>2024 - 07 - 25</td>
            <td>원승언</td>
            <td>55</td>
            <td><button class="history-btn">이력조회</button></td>
        </tr>
        <tr>
            <td>위생점검</td>
            <td>2024 - 06 - 25</td>
            <td>이지훈</td>
            <td>65</td>
            <td><button class="history-btn">이력조회</button></td>
        </tr>
        </tbody>
    </table>
</section>
<div id="go-inspection-wrap">
    <button id="go-inspection" onclick="startInspection()">점검시작</button>
</div>


</body>
<script src="/resources/js/qsc/store_inspection/store_inspection_popup.js"></script>
</html>
