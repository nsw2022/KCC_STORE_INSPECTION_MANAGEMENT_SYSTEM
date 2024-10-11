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

    <link rel="stylesheet" href="/resources/css/qsc/store_inspection/popup_lastCheck.css">
    <script src='https://cdnjs.cloudflare.com/ajax/libs/gsap/3.11.5/gsap.min.js'></script>
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/signature_pad@4.0.0/dist/signature_pad.umd.min.js"></script>
</head>
<body>

<div class="progress-container">
    <div class="step active">
        <div class="circle complete">
            <i class="fa-solid fa-check"></i>
        </div>
        <p>점검</p>
    </div>
    <div class="line active"></div>
    <div class="step active">
        <div class="circle complete">
            <i class="fa-solid fa-check"></i>
        </div>
        <p>결과확인</p>
    </div>
    <div class="line active"></div>
    <div class="step active">
        <div class="circle complete">
            <i class="fa-solid fa-check"></i>
        </div>
        <p>서명</p>
    </div>
    <div class="line active"></div>
    <div class="step">
        <div class="circle active">
            <div class="inner-circle active"></div>
        </div>
        <p>확인</p>
    </div>
</div>

<section class="inspection-detail">
    <div class="inspection-info">
        <table class="inspection-table">
            <tr>
                <td class="info-title">
                    <p>KCC 크라상 점포 위생점검표_2024</p>
                </td>
                <td class="info-details">
                    <span class="store-name">KCC 크라상</span>
                    <span class="store-subtitle">가맹점 (이름예시 아무거나 추가하기)</span>
                    <span class="inspection-date">점검일 : 2024.09.24</span>
                    <span class="inspector-name">점검자 : 노승우</span>
                </td>
            </tr>
        </table>
    </div>
</section>

<section class="inspection-section">
    <div class="inspection-tabs">
        <button class="inspection-tab active" data-tab="report-summary">보고서 간략</button>
        <button class="inspection-tab" data-tab="detailed-result">세부결과</button>
    </div>

    <%--  ----------------탭에 따라서 변하는 구역----------------  --%>
    <div class="tab-content report-summary">
        <div class="score-section">
            <table class="score-table">
                <thead>
                <tr>
                    <th>배점</th>
                    <th>적합</th>
                    <th>부적합</th>
                    <th>해당없음</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td>70</td>
                    <td>70</td>
                    <td>30</td>
                    <td>0</td>
                </tr>
                </tbody>
            </table>

            <div class="grade-section">
                <div class="grade-box">
                    <p>등급</p>
                    <p class="grade-text"><span>S</span> 등급</p>
                </div>
                <div class="total-score-box">
                    <p>백점환산</p>
                    <p class="total-score-text"><span>100</span> 점</p>
                </div>
            </div>
        </div>

        <div class="admin-action-section">
            <p class="admin-title">행정처분</p>
            <div class="admin-box">
                <div class="fine-box-wrapper">
                    <p>과태료</p>
                    <div class="fine-box">
                        <p class="fine-amount"><span>0</span> 만원</p>
                    </div>
                </div>
                <div class="closure-box-wrapper">
                    <p>영업정지</p>
                    <div class="closure-box">
                        <p class="closure-days"><span>0</span> 일</p>
                    </div>
                </div>

            </div>
        </div>
    </div>

    <!-- 세부결과 구역 -->
    <div class="tab-content detailed-result">
        <div class="detailed-section">
            <!-- 중대법규 -->
            <div class="detailed-item">
                <div class="item-header">
                    <h3>중대법규</h3>
                    <button class="detail-btn">상세보기</button>
                </div>
                <table class="detailed-table">
                    <thead>
                    <tr>
                        <th>배점</th>
                        <th>적합</th>
                        <th>부적합</th>
                        <th>해당없음</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td>40</td>
                        <td>30</td>
                        <td>10</td>
                        <td>0</td>
                    </tr>
                    </tbody>
                </table>
            </div>

            <!-- 기타법규 -->
            <div class="detailed-item">
                <div class="item-header">
                    <h3>기타법규</h3>
                    <button class="detail-btn">상세보기</button>
                </div>
                <table class="detailed-table">
                    <thead>
                    <tr>
                        <th>배점</th>
                        <th>적합</th>
                        <th>부적합</th>
                        <th>해당없음</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td>10</td>
                        <td>10</td>
                        <td>0</td>
                        <td>0</td>
                    </tr>
                    </tbody>
                </table>
            </div>

            <!-- 위생관리 -->
            <div class="detailed-item">
                <div class="item-header">
                    <h3>위생관리</h3>
                    <button class="detail-btn">상세보기</button>
                </div>
                <table class="detailed-table">
                    <thead>
                    <tr>
                        <th>배점</th>
                        <th>적합</th>
                        <th>부적합</th>
                        <th>해당없음</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td>30</td>
                        <td>20</td>
                        <td>10</td>
                        <td>0</td>
                    </tr>
                    </tbody>
                </table>
            </div>

            <!-- 위생지도상황 -->
            <div class="detailed-item">
                <div class="item-header">
                    <h3>위생지도상황</h3>
                    <button class="detail-btn">상세보기</button>
                </div>
                <table class="detailed-table">
                    <thead>
                    <tr>
                        <th>배점</th>
                        <th>적합</th>
                        <th>부적합</th>
                        <th>해당없음</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td>20</td>
                        <td>10</td>
                        <td>10</td>
                        <td>0</td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>





    <%--  ----------------탭에 따라서 변하는 구역----------------  --%>


    <div class="inspection-total-score">
        <p>총 <span>100</span> 점</p>
    </div>
</section>

<div id="go-inspection-wrap">
    <button class="go-inspection" onclick="lastCheckInspection()">점검완료</button>
</div>

<%--  ----------------하단 세부결과 보기----------------  --%>

<section id="inspection-lastCheck-list">
    <h2 class="item-title"></h2>
    <div class="check-item">


    </div>
</section>



</body>
<script src="/resources/js/qsc/store_inspection/popup_lastCheck.js"></script>
</html>
