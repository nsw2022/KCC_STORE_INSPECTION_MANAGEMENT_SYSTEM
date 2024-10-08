<%@ page language="java" contentType="text/html; charset=UTF-8"
         pageEncoding="UTF-8" %>
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>가맹점 점검페이지</title>
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

    <link rel="stylesheet" href="/resources/css/qsc/store_inspection/store_inspection.css">
    <script src='https://cdnjs.cloudflare.com/ajax/libs/gsap/3.11.5/gsap.min.js'></script>
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script type="text/javascript"
            src="https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${naverClientId}&submodules=panorama,geocoder"
            defer></script>
    <!--
        서브 모듈 종류
            submodules로 지정할 수 있는 주요 서브 모듈은 다음과 같습니다:

            panorama: 파노라마 뷰 기능을 제공합니다.
            geocoder: 주소 검색 및 좌표 변환(지오코딩) 기능을 제공합니다.
            drawing: 지도 위에 도형(마커, 선, 다각형 등)을 그리는 기능을 제공합니다.
            visualization: 데이터 시각화(히트맵 등) 기능을 제공합니다.
     -->
    <!-- map.js 스크립트 추가 -->
    <script src="/resources/js/qsc/store_inspection/maps.js"></script>


</head>
<body>

<jsp:include page="../../sidebar/sidebar.jsp" />

<div class="page-wrapper2">
    <main class="page-content">
        <div class="content">
            <%--     가맹점 점검페이지      --%>
                <section id="today_inspection">
                    <div id="today_inspection_list_wrap">
                        <h2>금주의 점검</h2>
                        <p>이번주 점검 목록이 표시됩니다</p>
                        <ul id="today_inspection_list">
                            <li>
                                <h4>위생점검</h4>
                                <p class="today_inspection_list_title">혜화점 위생점검</p>
                                <p class="today_inspection_list_date">2024.09.23</p>
                            </li>
                            <li>
                                <h4>위생점검</h4>
                                <p class="today_inspection_list_title">성신여대점 위생점검</p>
                                <p class="today_inspection_list_date">2024.09.25</p>
                            </li>
                            <li>
                                <h4>위생점검</h4>
                                <p class="today_inspection_list_title">동대문점 위생점검</p>
                                <p class="today_inspection_list_date">2024.09.27</p>
                            </li>
                        </ul>
                    </div>


                    <div class="calendar-container">
                        <div class="calendar-header">
                            <select id="month-select">
                                <option value="0">January</option>
                                <option value="1">February</option>
                                <option value="2">March</option>
                                <option value="3" selected>April</option>
                                <option value="4">May</option>
                                <option value="5">June</option>
                                <option value="6">July</option>
                                <option value="7">August</option>
                                <option value="8">September</option>
                                <option value="9">October</option>
                                <option value="10">November</option>
                                <option value="11">December</option>
                            </select>
                            <span id="year">2024</span>
                        </div>

                        <table class="calendar">
                            <thead>
                            <tr>
                                <th>Mo</th>
                                <th>Tu</th>
                                <th>We</th>
                                <th>Th</th>
                                <th>Fr</th>
                                <th>Sa</th>
                                <th>Su</th>
                            </tr>
                            </thead>
                            <tbody id="calendar-body">
                            <!-- 달력 날짜가 js생성 -->
                            </tbody>
                        </table>
                    </div>


                </section>


                <section class="schedule-container">
                    <div class="schedule-header">
                        <label for="checklist-select">체크리스트 선택 :</label>
                        <select id="checklist-select">
                            <option value="위생 점검">위생 점검</option>
                            <option value="품질 점검">품질 점검</option>
                        </select>
                    </div>
                    <div class="schedule-table-wrapper">
                        <table class="schedule-table">
                            <thead>
                            <tr>
                                <th>일</th>
                                <th>월</th>
                                <th>화</th>
                                <th>수</th>
                                <th>목</th>
                                <th>금</th>
                                <th>토</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr>
                                <td class="empty-cell">
                                    <span>9/28</span>
                                </td>
                                <td>
                                    <span>9/29</span>
                                    <button class="inspection-btn" onclick="openPopup('혜화점 위생 점검')">혜화점 위생 점검</button>
                                    <button class="inspection-btn" onclick="openPopup('성신여대점 위생 점검')">성신여대점 위생 점검</button>
                                    <button class="inspection-btn" onclick="openPopup('동대문점 위생 점검')">동대문점 위생 점검</button>
                                </td>
                                <td>
                                    <span>9/30</span>
                                </td>
                                <td>
                                    <span>10/1</span>
                                    <button class="inspection-btn" onclick="openPopup('노원역점 위생 점검')">노원역점 위생 점검</button>
                                    <button class="inspection-btn" onclick="openPopup('양실리점 위생 점검')">양실리점 위생 점검</button>
                                </td>
                                <td>
                                    <span>10/2</span>
                                </td>
                                <td>
                                    <span>10/3</span>
                                    <button class="inspection-btn" onclick="openPopup('경희대점 위생 점검')">경희대점 위생 점검</button>
                                    <button class="inspection-btn" onclick="openPopup('천호역점 위생 점검')">천호역점 위생 점검</button>
                                    <button class="inspection-btn" onclick="openPopup('서울역점 위생 점검')">서울역점 위생 점검</button>
                                    <button class="inspection-btn" onclick="openPopup('강남역점 위생 점검')">강남역점 위생 점검</button>
                                    <button class="inspection-btn" onclick="openPopup('왕십리역점 위생 점검')">왕십리역점 위생 점검</button>
                                </td>
                                <td class="empty-cell">
                                    <span>10/4</span>
                                </td>
                            </tr>
                            </tbody>
                            </table>
                    </div>
                </section>

                <section class="map-section mt-5">
                    <h3>가맹점 위치</h3>
                    <div id="map" style="height: 400px; background-color: #f0f0f0; position: relative">
                        <!-- 여기에 지도 라이브러리 추가 -->
                        <div class="search" style="    position: absolute;
    z-index: 1000;
    top: 20px;
    left: 20px;">
                            <input type="text" placeholder="검색할 주소" id="address">
                            <input  id="submit" type="button" value="주소검색" >
                        </div>


                    </div>
                </section>

                <section class="store-info-table">
                    <table class="custom-table">
                        <thead>
                        <tr>
                            <th>가맹점명</th>
                            <th>최근 점검일</th>
                            <th>개점시간</th>
                            <th>점검 분류</th>
                            <th>점검 예약</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td>혜화점</td>
                            <td>2024.09.17</td>
                            <td>08:30</td>
                            <td>위생점검</td>
                            <td>2024.09.30</td>
                        </tr>
                        <tr>
                            <td>혜화점</td>
                            <td>2024.09.18</td>
                            <td>15:00</td>
                            <td>품질점검</td>
                            <td>2024.10.01</td>
                        </tr>
                        </tbody>
                    </table>
                </section>
            <%--     가맹점 점검페이지      --%>
        </div>
    </main>
</div>
</body>
<script src="/resources/js/qsc/store_inspection/store_inspection.js"></script>
<script src="/resources/js/qsc/store_inspection/store_inspection_popup.js"></script>
</html>
