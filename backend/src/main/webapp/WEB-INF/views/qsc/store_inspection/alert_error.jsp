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
    <link rel="stylesheet" href="/resources/css/qsc/store_inspection/alert_error.css">
    <script src='https://cdnjs.cloudflare.com/ajax/libs/gsap/3.11.5/gsap.min.js'></script>
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
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
                <div class="schedule-container">
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
<!-- map.js 스크립트 추가 -->
</body>
</html>
