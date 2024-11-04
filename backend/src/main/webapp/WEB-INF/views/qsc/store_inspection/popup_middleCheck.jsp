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

    <link rel="stylesheet" href="/resources/css/qsc/store_inspection/popup_middleCheck.css">
    <link rel="stylesheet" href="/resources/css/qsc/store_inspection/popup_inspection.css">
    <script src='https://cdnjs.cloudflare.com/ajax/libs/gsap/3.11.5/gsap.min.js'></script>
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
</head>
<body>
<%--<p>입력된 기타사항: ${textareaData}</p>--%>
<div class="progress-container">
    <div class="step active">
        <div class="circle complete">
            <i class="fa-solid fa-check"></i>
        </div>
        <p>점검</p>
    </div>
    <div class="line active"></div>
    <div class="step">
        <div class="circle active">
            <div class="inner-circle active"></div>
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
<%--  동적으로 생성되는 구역  --%>
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
                    <th>총점</th>
                    <th>적합 수</th>
                    <th>부적합 수</th>
                    <th>문항 수</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td>0</td>
                    <td>0</td>
                    <td>0</td>
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
    <div class="tab-content detailed-result" style="display: none;">
        <div class="detailed-section">
            <!-- JavaScript로 동적으로 상세 항목들이 생성됩니다 -->
        </div>
    </div>





<%--  ----------------탭에 따라서 변하는 구역----------------  --%>


    <div class="inspection-total-score">
        <p>총 <span></span> 점</p>
    </div>
</section>

<div id="go-inspection-wrap">
    <button class="go-inspection" onclick="middleCheckInspection()">점검확인 완료</button>
    <button class="go-inspection" onclick="temporarySave()">임시저장</button>
</div>

<%--  ----------------하단 세부결과 보기----------------  --%>

<section id="inspection-middleCheck-list" style="display: none;">
    <h2 class="item-title"></h2>
    <div class="check-item">
        <!-- 동적으로 생성되는 내용 -->
    </div>
</section>




</body>
<script src="/resources/js/qsc/store_inspection/popup_middleCheck.js"></script>
</html>
