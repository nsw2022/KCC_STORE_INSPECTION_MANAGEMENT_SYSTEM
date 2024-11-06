<%@ page language="java" contentType="text/html; charset=UTF-8"
         pageEncoding="UTF-8" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SIMS</title>
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
    <link
            rel="stylesheet"
            href="/resources/css/home/dashboard/dashboard.css"
    />
    <link rel="stylesheet" href="/resources/css/qsc/store_inspection/alert_error.css">
    <script src='https://cdnjs.cloudflare.com/ajax/libs/gsap/3.11.5/gsap.min.js'></script>
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <!-- SweetAlert2 JS -->
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <script src="https://cdn.jsdelivr.net/npm/apexcharts"></script>
    <script src="https://cdn.jsdelivr.net/npm/ag-grid-community/dist/ag-grid-community.min.js"></script>
    <script
            src="https://cdnjs.cloudflare.com/ajax/libs/Sortable/1.14.0/Sortable.min.js"
            integrity="sha512-zYXldzJsDrNKV+odAwFYiDXV2Cy37cwizT+NkuiPGsa9X1dOz04eHvUWVuxaJ299GvcJT31ug2zO4itXBjFx4w=="
            crossorigin="anonymous"
            referrerpolicy="no-referrer"
    ></script>
</head>
<body>

<jsp:include page="../../sidebar/sidebar.jsp"/>

<div class="page-wrapper2">
    <main class="page-content">
        <div class="content">
            <%--     가맹점 점검페이지      --%>
            <section id="today_inspection">
                <div class="schedule-container">
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
                                <%--                                <th>일</th>--%>
                                <th>월</th>
                                <th>화</th>
                                <th>수</th>
                                <th>목</th>
                                <th>금</th>
                                <%--                                <th>토</th>--%>
                            </tr>
                            </thead>
                            <tbody id="schedule-table-body">
                            <!-- 동적으로 생성될 부분 -->
                            </tbody>
                        </table>
                    </div>
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
                <%-- 내부에 요소 추가하기 --%>

            </section>
            <section id="chart-group" class="mt-3">
                <div id="group" class="box row m-0 justify-content-between">
                    <div class="item col-lg-4 p-0 mb-3">
                        <div class="item-content me-2 p-3">
                            <div class="mb-3 title">점검 진행현황</div>
                            <div id="chart1"></div>
                        </div>
                    </div>
                    <div class="item col-lg-4 p-0 mb-3">
                        <div class="item-content me-2 ms-2 p-3">
                            <div class="title-box h-10 d-flex justify-content-between">
                                <div style="width: 100px">
                                    <div class="title">과태료</div>
                                    <span style="font: 300 12px 'Noto Sans KR';">(단위 : 만원)</span>
                                </div>
                                <div>
                                    <div style="font: 300 13px 'Noto Sans KR';">총 과태료 : <span class="total-penalty" style="font: 500 13px 'Noto Sans KR';">0</span>만원</div>
                                    <div style="font: 300 13px 'Noto Sans KR';">매장당 평균 : <span class="avg-penalty" style="font: 500 13px 'Noto Sans KR';">0</span>만원</div>
                                </div>
                            </div>
                            <div id="chart5"></div>
                        </div>
                    </div>

                    <div class="item col-lg-4 p-0 mb-3 ">
                        <div class="item-content ms-2 p-3">
                            <div class="title-box h-10 d-flex justify-content-between">
                                <div style="width: 100px">
                                    <div class="title">영업정지</div>
                                    <span style="font: 300 12px 'Noto Sans KR';">(단위 : 일)</span>
                                </div>
                                <div>
                                    <div style="font: 300 13px 'Noto Sans KR';">총 영업정지일 : <span class="total-bnsSspn" style="font: 500 13px 'Noto Sans KR';">0</span>일</div>
                                    <div style="font: 300 13px 'Noto Sans KR';">매장당 평균 : <span class="avg-bnsSspn" style="font: 500 13px 'Noto Sans KR';">0</span>일</div>
                                </div>
                            </div>
                            <div id="chart6"></div>
                        </div>
                    </div>
                    <div class="item col-lg-4 p-0 mb-3">
                        <div class="item-content me-2 p-3">
                            <div class="mb-3 title">미완료건 현황</div>
                            <div id="myGrid" class="ag-theme-quartz" style="height: 85%"></div>
                        </div>
                    </div>
                    <%--                    <div class="item col-lg-4 p-1 mb-3 ">--%>
                    <%--                        <div class="item-content m-1 p-3">--%>
                    <%--                            <div class="mb-3 title">심사 평균점수 비교</div>--%>
                    <%--                            <div id="chart3"></div>--%>
                    <%--                        </div>--%>
                    <%--                    </div>--%>
                    <div class="item col-lg-8 p-0 mb-3">
                        <div class="item-content ms-2 p-3" >
                            <div class="mb-3 title">월별 평균 점수</div>
                            <div id="chart7" ></div>
                        </div>
                    </div>
                </div>
                <div id="notification-group" >
                    <div style="width: 100px">
                        <div class="mb-3 title"><p style="font: 700 17px 'Noto Sans KR'; width: 110px">최근 점검 현황</p></div>
                    </div>
                    <div id="card-group" style="overflow:scroll; height: 95%">

                    </div>
                </div>
            </section>
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


<script src="/resources/js/qsc/store_inspection/alert_error.js"></script>
<script defer
        type="application/javascript"
        src="../../../../resources/js/home/dashboard/dashboard.js"
></script>
<!-- map.js 스크립트 추가 -->
</body>
</html>
