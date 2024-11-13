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
    <link rel="preconnect" href="https://fonts.googleapis.com"/>
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
    <link
            href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@100..900&display=swap"
            rel="stylesheet"
    />
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap"
          rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css"/>
    <link rel='stylesheet' href='https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
          integrity='sha512-iecdLmaskl7CVkqkXNQ/ZH/XLlvWZOJyj7Yy7tcenmpD1ypASozpmT/E0iPtmFIB46ZmdtAc9eNBvH0H/ZpiBw=='
          crossorigin='anonymous'/>
    <link
            rel="stylesheet"
            href="https://unicons.iconscout.com/release/v4.0.0/css/line.css"
    />
    <!-- SweetAlert2 CSS -->
    <link
            href="https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.min.css"
            rel="stylesheet"
    />
    <link rel="stylesheet" href="/resources/css/qsc/store_inspection/store_inspection.css">



    <style>
        .page-content{
            overflow-x: initial!important;
        }
    </style>

    <script src='https://cdnjs.cloudflare.com/ajax/libs/gsap/3.11.5/gsap.min.js'></script>
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script type="text/javascript"
            src="https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${naverClientId}&submodules=panorama,geocoder"
            defer></script>
    <!-- SweetAlert2 JS -->
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>

</head>
<body>

<jsp:include page="../../sidebar/sidebar.jsp"/>

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
                        <option value="제품점검">제품 점검</option>
                        <option value="위생점검">위생 점검</option>
                        <option value="정기점검">정기 점검</option>
                        <option value="비정기점검">비정기 점검</option>
                        <option value="기획점검">기획 점검</option>
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
                    <h4 style="font-size: 20px">오늘의 점검 지도</h4>

                    <!-- All View Content -->
                    <div id="all-view" class="view-container">
                        <div class="d-flex align-items-center justify-content-between">
                            <label for="topStoreSearch" class="form-label" style="margin-bottom: 0;!important;">가맹점</label>
                            <div class="wrapper" data-autocomplete="store" style="flex: 0.75">
                                <div class="search-btn top-search form-control d-flex align-items-center justify-content-between">
                                    <span id="storeNm">가맹점 검색</span>
                                    <i class="uil uil-angle-down"></i>
                                </div>
                                <div class="hide-list">
                                    <div class="search">
                                        <input
                                                type="text"
                                                class="form-control top-search"
                                                id="topStoreSearch"
                                                placeholder="가맹점명을 입력해주세요"
                                        />
                                        <ul class="options"></ul>
                                    </div>
                                </div>

                            </div>


                        </div>
                        <!-- 전체보기에 대한 경로 정보 -->
                        <div class="map-summary mt-3">

                                <!-- 가맹점 -->
                                <div class="map-summary-context">

                                        <label for="selectStore" class="form-label">가맹점</label>
                                        <input type="text" class="form-control" id="selectStore" readonly>

                                </div>

                                <!-- 브랜드 -->
                                <div class="map-summary-context">
                                    <label for="selectBrand" class="form-label">브랜드</label>
                                    <input type="text" class="form-control" id="selectBrand" readonly>
                                </div>

                                <!-- 점검자 -->
                                <div class="map-summary-context">
                                    <label for="selectInspector" class="form-label">점검자</label>
                                    <input type="text" class="form-control" id="selectInspector" readonly>
                                </div>

                                <!-- SV -->
                                <div class="map-summary-context">
                                    <label for="selectSV" class="form-label">SV</label>
                                    <input type="text" class="form-control" id="selectSV" readonly>
                                </div>

                                <!-- 최근점검일 -->
                                <div class="map-summary-context">
                                    <label for="selectComplTm" class="form-label">최근점검일</label>
                                    <input type="text" class="form-control" id="selectComplTm" readonly>
                                </div>



                        </div>

                    </div>

                    <!-- Today Inspection View Content -->
                    <div id="today-inspection-view" class="view-container" style="display: none;">
                        <!-- 오늘의 점검에 대한 내용 추가 -->
                        <div class="map-summary my-3">
                            <div class="map-summary-time">
                                총 소요시간 : <strong id="today-total-time-hour">0</strong>시간 <strong
                                    id="today-total-time-minute">0</strong>분
                            </div>
                            <div class="map-summary-distance">도합 거리 : <strong id="today-total-distance">0</strong>km
                            </div>
                        </div>
                        <div class="route-container" id="route-container-id">
                            <!-- 동적으로 생성될 경로 정보 -->
                        </div>
                    </div>


                </div>

                <div id="map" style=" background-color: #f0f0f0;">
                    <div class="map-box-container">
                      

                        <div id="map-all" class="map-view-button active">전체보기</div>
                        <div id="map-tsp" class="map-view-button">오늘의 점검</div>
                    </div>
                </div>
            </section>


            <section class="store-info-table">
                <table class="custom-table">
                    <thead>
                    <tr>
                        <th>가맹점명</th>
                        <th>점검 예정일</th>
                        <th>체크리스트명</th>
                        <th>점검자</th>
                        <th>SV</th>
                    </tr>
                    </thead>
                    <tbody>

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
    if (currentUserRole === 'UNKNOWN') {
        location.href = "/login";
    }
</script>


<script src="/resources/js/qsc/store_inspection/store_inspection.js"></script>
<!-- map.js 스크립트 추가 -->
<script src="/resources/js/qsc/store_inspection/maps.js"></script>
</body>
</html>
