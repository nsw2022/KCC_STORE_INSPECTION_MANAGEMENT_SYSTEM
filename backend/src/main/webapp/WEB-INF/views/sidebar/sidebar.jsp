<%@ page language="java" contentType="text/html; charset=UTF-8"
         pageEncoding="UTF-8" %>
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>사이드바 컴포넌트 - 아코디언</title>
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
    <link rel="stylesheet" href="/resources/css/sidebar/sidebar.css">
    <script src='https://cdnjs.cloudflare.com/ajax/libs/gsap/3.11.5/gsap.min.js'></script>
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
</head>
<body>

<div class="page-wrapper chiller-theme toggled">
    <a id="show-sidebar" class="btn btn-sm btn-dark" href="#">
        <i class="fas fa-bars"></i>
    </a>
    <nav id="sidebar" class="sidebar-wrapper">
        <div class="sidebar-content">
            <div class="sidebar-brand">
                <form id="home" action="/" method="get"></form>
                <a href="#" onclick="document.getElementById('home').submit()">SIMS</a>
                <div id="close-sidebar">
                    <i class="fas fa-times"></i>
                </div>
            </div>

            <div class="sidebar-menu">
                <ul>
                    <li class="sidebar-dropdown">

                        <a href="#">
                            <form id="dashBoard" action="/" method="get"></form>
                            <a href="#" onclick="document.getElementById('dashBoard').submit()">대시보드</a>
                        </a>
                    </li>
                    <li class="sidebar-dropdown">
                        <a href="#">
                            <span>마스터 관리</span>
                        </a>
                        <div class="sidebar-submenu">
                            <ul>
                                <li>
                                    <form id="store_manage" action="/master/store_manage/store_list" method="get"></form>
                                    <a href="#" onclick="document.getElementById('store_manage').submit()">가맹점 관리</a>
                                </li>
                                <li>
                                    <form id="product_manage" action="/master/product_manage/product_list" method="get"></form>
                                    <a href="#" onclick="document.getElementById('product_manage').submit()">제품 관리</a>
                                </li>
                            </ul>
                        </div>
                    </li>
                    <li class="sidebar-dropdown">
                        <a href="#">
                            <span>체크리스트 관리</span>
                        </a>
                        <div class="sidebar-submenu">
                            <ul>
                                <li>
                                    <form id="checklist_list" action="/master/checklist" method="get"></form>
                                    <a href="#" onclick="document.getElementById('checklist_list').submit()">체크리스트 관리</a>
                                </li>
                                <li>
                                    <form id="inspection_list" action="/master/inspection-list-manage" method="get"></form>
                                    <a href="#" onclick="document.getElementById('inspection_list').submit()">점검 항목 관리</a>
                                </li>
                            </ul>
                        </div>
                    </li>
                    <li class="sidebar-dropdown">
                        <a href="#">
                            <span>점검 관리</span>
                        </a>
                        <div class="sidebar-submenu">
                            <ul>
                                <li>
                                    <form id="inspection_schedule" action="/qsc/inspection-schedule/schedule-list" method="get"></form>
                                    <a href="#" onclick="document.getElementById('inspection_schedule').submit()">가맹점 점검 계획 관리</a>
                                </li>

                                <li>
                                    <form id="inspection_schedule_detail" action="/qsc/store-inspection-schedule" method="get"></form>
                                    <a href="#" onclick="document.getElementById('inspection_schedule_detail').submit()">가맹점 점검 일정 조회</a>
                                </li>
                                <li>
                                    <form id="inspection" action="/qsc/store_inspection" method="get"></form>
                                    <a href="#" onclick="document.getElementById('inspection').submit()">가맹점 점검</a>
                                </li>
                                <li>
                                    <form id="inspection_result" action="/qsc/inspection/result" method="get"></form>
                                    <a href="#" onclick="document.getElementById('inspection_result').submit()">가맹점 점검 결과</a>
                                </li>
                            </ul>
                        </div>
                    </li>
                </ul>
            </div>
            <!-- sidebar-menu  -->
        </div>

    </nav>
    <div class="top-bar">
        <span id="breadcrumb"></span>
    </div>
    <!-- sidebar-wrapper  -->
</div>

<!-- Bootstrap JS -->
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"></script>
<!-- Font Awesome JS -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/js/all.min.js"></script>
<script src="/resources/js/sidebar/sidebar.js"></script>

</body>
</html>