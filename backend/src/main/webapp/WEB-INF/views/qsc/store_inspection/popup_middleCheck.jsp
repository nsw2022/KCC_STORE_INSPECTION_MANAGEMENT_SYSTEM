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

    <link rel="stylesheet" href="/resources/css/qsc/store_inspection/popup_middleCheck.css">
    <link rel="stylesheet" href="/resources/css/qsc/store_inspection/popup_inspection.css">
    <script src='https://cdnjs.cloudflare.com/ajax/libs/gsap/3.11.5/gsap.min.js'></script>
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
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
    <button class="go-inspection" onclick="middleCheckInspection()">점검확인 완료</button>
    <button class="go-inspection" onclick="tenpoirySave()">임시저장</button>
</div>

<%--  ----------------하단 세부결과 보기----------------  --%>

<section id="inspection-middleCheck-list">
    <h2 class="item-title">01 중대법규</h2>
    <div class="check-item">


        <div class="check-subitem">
            <p class="subitem-title">영업취소</p>
            <div class="subitem-info-wrapper">
                <p>1. 소비기한 변조 및 삭제</p>
                <ul class="subitem-info">
                    <li class="info-box">
                        <p>배점/결과</p>
                        <span class="score">5 / 5</span>
                    </li>
                    <li class="info-box">
                        <p>과태료</p>
                        <span>-</span>
                    </li>
                    <li class="info-box">
                        <p>영업정지</p>
                        <span>-</span>
                    </li>
                </ul>
                <button class="edit-btn">수정하기</button>

                <%--        ----해당부분은 동적으로 변동이 될부분----        --%>
                <div class="inspection-content-wrapper">
                    <!-- 사진 업로드 구역 -->
                    <div class="answer-section">
                        <button class="answer-btn">예</button>
                        <button class="answer-btn">아니오</button>
                    </div>

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


                </div>

                <%--        ----해당부분은 동적으로 변동이 될부분----        --%>
            </div>

        </div>

        <div class="check-subitem">
            <p class="subitem-title">영업정지 1개월 이상</p>
            <div class="subitem-info-wrapper">
                <p>2. 표시사항 전부를 표시하지 않은 식품을 영업에 사용</p>
                <ul class="subitem-info">
                    <li class="info-box">
                        <p>배점/결과</p>
                        <span class="score">5 / 5</span>
                    </li>
                    <li class="info-box">
                        <p>과태료</p>
                        <span>-</span>
                    </li>
                    <li class="info-box">
                        <p>영업정지</p>
                        <span>-</span>
                    </li>
                </ul>
                <button class="edit-btn">수정하기</button>
            </div>
        </div>
    </div>
</section>



</body>
<script src="/resources/js/qsc/store_inspection/popup_middleCheck.js"></script>
<script src="/resources/js/qsc/store_inspection/popup_inspection.js"></script>
</html>
