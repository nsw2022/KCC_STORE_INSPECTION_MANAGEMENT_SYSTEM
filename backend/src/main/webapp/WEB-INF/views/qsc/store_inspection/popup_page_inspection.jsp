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

    <link rel="stylesheet" href="/resources/css/qsc/store_inspection/popup_inspection.css">
    <script src='https://cdnjs.cloudflare.com/ajax/libs/gsap/3.11.5/gsap.min.js'></script>
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
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
        <button class="inspection-tab active" data-tab="중대법규">중대법규</button>
        <button class="inspection-tab" data-tab="기타법규">기타법규</button>
        <button class="inspection-tab" data-tab="위생관리">위생관리</button>
        <button class="inspection-tab" data-tab="위생지도상황">위생지도상황</button>
    </div>

    <section class="inspection-list" id="중대법규">
        <div class="inspection-box">
            <div class="inspection-header">
                영업취소
                <span class="toggle-icon">▼</span>
            </div>
            <div class="inspection-content">
                <div class="inspection-content-detail">
                    <p>1. 소비기한 변조 및 삭제</p>
                    <button class="add-btn">+</button>
                </div>

                <%--        ----해당부분은 동적으로 변동이 될부분----        --%>
                <jsp:include page="checkList_choice.jsp" />
                <%--        ----해당부분은 동적으로 변동이 될부분----        --%>
            </div>
        </div>

        <div class="inspection-box">
            <div class="inspection-header">
                영업정지 1개월 이상
                <span class="toggle-icon">▼</span>
            </div>
            <div class="inspection-content">
                <div class="inspection-content-detail">
                    <p>2. 표시사항 전부를 표시하지 않은 식품을 영업에 사용</p>
                    <button class="add-btn">+</button>
                </div>

                <%--        ----해당부분은 동적으로 변동이 될부분----        --%>
                <div class="inspection-content-wrapper">
                    <!-- 사진 업로드 구역 -->
                    <div class="answer-section2">
                        <label class="radio-label2">
                            <input type="radio" name="rating" value="매우좋음" checked>
                            매우좋음
                        </label>
                        <label class="radio-label2">
                            <input type="radio" name="rating" value="좋음">
                            좋음
                        </label>
                        <label class="radio-label2">
                            <input type="radio" name="rating" value="보통">
                            보통
                        </label>
                        <label class="radio-label2">
                            <input type="radio" name="rating" value="나쁨">
                            나쁨
                        </label>
                        <label class="radio-label2">
                            <input type="radio" name="rating" value="매우나쁨">
                            매우나쁨
                        </label>
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
                                <textarea class="etc-input" placeholder="기타사항을 입력해주세요"></textarea>
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

        <div class="inspection-box">
            <div class="inspection-header">
                영업정지 15일 이상
                <span class="toggle-icon">▼</span>
            </div>
            <div class="inspection-content">
                <div class="inspection-content-detail">
                    <p>3. 소비기한 경과</p>
                    <button class="add-btn">+</button>
                </div>
            </div>
        </div>

        <div class="inspection-box">
            <div class="inspection-header">
                시정 명령
                <span class="toggle-icon">▼</span>
            </div>
            <div class="inspection-content">
                <div class="inspection-content-detail">
                    <p>4. 영업신고 관련 위반</p>
                    <button class="add-btn">+</button>
                </div>
            </div>
        </div>

        <div class="inspection-box">
            <div class="inspection-header">
                과태료
                <span class="toggle-icon">▼</span>
            </div>
            <div class="inspection-content">
                <div class="inspection-content-detail">
                    <p>5. 무신고 소분판매</p>
                    <button class="add-btn">+</button>
                </div>
                <div class="inspection-content-detail">
                    <p>6. 건강검진 위반</p>
                    <button class="add-btn">+</button>
                </div>
            </div>
        </div>
    </section>

    <section class="inspection-list" id="기타법규">
        <!-- 기타법규 관련 내용 -->
        <div class="inspection-box">
            <div class="inspection-header">기타법규 관련 내용 1</div>
        </div>
    </section>

    <section class="inspection-list" id="위생관리">
        <!-- 위생관리 관련 내용 -->
        <div class="inspection-box">
            <div class="inspection-header">위생관리 관련 내용 1</div>
        </div>
    </section>

    <section class="inspection-list" id="위생지도상황">
        <!-- 위생지도상황 관련 내용 -->
        <div class="inspection-box">
            <div class="inspection-header">위생지도상황 관련 내용 1</div>
        </div>
    </section>

    <div class="inspection-total-score">
        <p>총 <span>100</span> 점</p>
    </div>
</section>
<div id="go-inspection-wrap">
    <button class="go-inspection" onclick="checkInspection()">점검확인</button>
    <button class="go-inspection" onclick="tenpoirySave()">임시저장</button>
</div>





</body>
<script src="/resources/js/qsc/store_inspection/store_inspection_popup.js"></script>
<script src="/resources/js/qsc/store_inspection/popup_inspection.js"></script>
</html>
