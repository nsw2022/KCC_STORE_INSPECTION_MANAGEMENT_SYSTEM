<%@ page language="java" contentType="text/html; charset=UTF-8"
         pageEncoding="UTF-8" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
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



</head>
<body>

<jsp:include page="../../sidebar/sidebar.jsp" />

<div class="page-wrapper2">
    <main class="page-content">
        <div class="content">
            <%--     가맹점 점검페이지      --%>
                <section id="today_inspection">
                    <div id="today_inspection_list_wrap">
                        <h2>점검 목록</h2>
                        <p>선택한 날짜의 점검 목록이 표시됩니다</p>
                        <ul id="today_inspection_list">
                            <!-- 동적으로 생성되는 부분 -->
                        </ul>
                    </div>


                    <div class="calendar-container">
                        <div class="calendar-header">
                            <!-- 년도 선택 추가 -->
                            <select id="year-select">
                                <!-- JS에서 동적으로 추가 -->
                            </select>

                            <!-- 월 선택 -->
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

                            <select id="insp-mbr">
                                <!-- JS에서 동적으로 추가 -->
                            </select>
                        </div>

                        <table class="calendar">
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
                            <tbody id="calendar-body">
                            <!-- 달력 날짜가 js 생성 -->
                            </tbody>
                        </table>
                    </div>


                </section>


                <section class="schedule-container">
                    <div class="schedule-header">
                        <label for="checklist-select">체크리스트 선택 :</label>
                        <select id="checklist-select">
                            <option value="all">전체</option>
                            <option value="위생점검">위생 점검</option>
                            <option value="품질점검">품질 점검</option>
                            <option value="기획점검">기획 점검</option>
                            <option value="정기점검">정기 점검</option>
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
                            <tbody id="schedule-table-body">
                            <!-- 동적으로 생성될 부분 -->
                            </tbody>
                        </table>
                    </div>
                </section>

                <section class="map-section">

                    <div id="map-input-container">

                        <c:if test="${userRole == 'ADMIN'}">
                            <h1>관리자다</h1>
                        </c:if>

                        <c:if test="${userRole == 'QUALITY_MANAGER'}">
                            <h1>품질관리자다</h1>
                        </c:if>

                        <c:if test="${userRole == 'SV'}">
                            <h1>SV</h1>
                        </c:if>

                        <c:if test="${userRole == 'INSPECTOR'}">
                            <h4 style="font-size: 20px">오늘의 점검 지도</h4>
                            <div id="left-container">
                                <div class="map-summary my-3">
                                    <div class="map-summary-time">
                                        총 소요시간 : <strong>1</strong>시간 <strong>16</strong>분
                                    </div>
                                    <div class="map-summary-distance">도합 거리 : <strong>3.6</strong>km</div>
                                </div>
                                <div class="route-container">
                                    <div class="map-route">
                                        <div class="map-route-detail">
                                            <span>내위치<i class="fa-solid fa-angles-right"></i> 청량리역사점</span>
                                            <span>
                                                <strong>19</strong>분
                                                <span class="divider"></span>
                                                <span>1.2km</span>
                                                <span class="congestionWant text-end" id="congestion1">원활</span>
                                            </span>
                                        </div>
                                    </div>
                                    <div class="map-route ">
                                        <div class="map-route-detail">
                                            <span>청량리역사점<i class="fa-solid fa-angles-right"></i>동대문점</span>
                                            <span>
                                                <strong>20</strong>분
                                                <span class="divider"></span>
                                                <span>0.7km</span>
                                                <span id="congestion2" class="congestionNormal">보통</span>
                                            </span>
                                        </div>
                                    </div>
                                    <div class="map-route">
                                        <div class="map-route-detail">
                                            <span>동대문점 <i class="fa-solid fa-angles-right"></i> 홍대입구점</span>
                                            <span>
                                                <strong>37</strong>분
                                                <span class="divider"></span>
                                                <span>1.7km</span>
                                                <span id="congestion3" class="congestionConfusion">혼잡</span>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>


                        </c:if>
                    </div>
                    <div id="map" style=" background-color: #f0f0f0;">
                        <div class="map-box-container">
                            <div id="map-all">전체보기</div>
                            <div id="map-tsp">오늘의 점검</div>
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


<script type="text/javascript">
    var currentUsername = '<c:out value="${username}" />';
    var currentUserRole = '<c:out value="${userRole}" />';
    if (currentUserRole === 'UNKNOWN'){
         location.href = "/login";
    }
</script>


<script src="/resources/js/qsc/store_inspection/store_inspection.js"></script>
<!-- map.js 스크립트 추가 -->
<script src="/resources/js/qsc/store_inspection/maps.js"></script>
</body>
</html>
