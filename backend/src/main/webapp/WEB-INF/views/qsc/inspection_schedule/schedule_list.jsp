<%@ page import="java.util.Date" %>
<%@ page import="java.text.SimpleDateFormat" %>
<%@ page language="java" contentType="text/html; charset=UTF-8"
         pageEncoding="UTF-8" %>
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>가맹점 점검 계획 관리</title>
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

    <link rel="stylesheet" href="/resources/css/qsc/inspection_schedule/schedule_list.css">
    <!-- Iconscout Link For Icons -->
    <link
            rel="stylesheet"
            href="https://unicons.iconscout.com/release/v4.0.0/css/line.css"
    />
    <!-- AG Grid CSS -->
    <link rel="stylesheet" href="https://unpkg.com/ag-grid-community/styles/ag-grid.css">
    <link rel="stylesheet" href="https://unpkg.com/ag-grid-community/styles/ag-theme-alpine.css">

    <style>
        /*.page-wrapper2 {*/
        /*    display: flex;*/
        /*    flex-direction: column;*/
        /*    min-height: 100vh;*/
        /*    background-color: #f0f2f5; !* 큰 영역의 배경색 *!*/
        /*}*/

        /*.page-content {*/
        /*    overflow-x: hidden;*/
        /*    flex: 1;*/
        /*    position: relative;*/
        /*}*/

    </style>

    <script src='https://cdnjs.cloudflare.com/ajax/libs/gsap/3.11.5/gsap.min.js'></script>
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/ag-grid-community/dist/ag-grid-community.min.js"></script>

</head>
<body>
<%--<div class="top-bar">--%>
<%--    <span id="breadcrumb"><span class="parent-menu">체크리스트 관리</span></span>--%>
<%--</div>--%>

<jsp:include page="../../sidebar/sidebar.jsp"/>

<div class="page-wrapper2">
    <main class="page-content">
        <div class="content">
            <!--  top 영역시작 -->
            <div
                    class="top-box py-2"
            >
                <div class="top-box-content my-4">
                    <!-- row 안에 col로 그리드를 할경우 자동 양쪽마진 15px가 붙음으로 -->
                    <!-- g-0을 해줘야 마진이 추가로 붙질않음 -->
                    <!-- https://getbootstrap.kr/docs/5.3/layout/gutters/#%EA%B1%B0%ED%84%B0-%EC%A0%9C%EA%B1%B0 -->
                    <!-- 검색 .g-0 -->
                    <div class="d-flex justify-content-between align-items-center">
                        <div class="">
                            <b id="가맹점">가맹점 점검 계획 관리</b>
                        </div>
                        <div class="d-flex justify-content-between">
                            <div class="top-button-wrapper px-2">
                                <div class="top-button top-lookup">조회</div>
                            </div>
                            <div class="">
                                <div class="top-button-wrapper px-2">
                                    <div class="top-button top-reset" id="reset-selection-top">초기화</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <%-- 자동 완성 영역 --%>
                    <div class="container">
                        <div class="row g-3 align-items-center pt-4 top-search-box d-flex">
                            <!-- 가맹점 라벨과 검색 필드 -->
                            <div class="col-lg-2 col-md-4 col-12">
                                <label for="storeSearch" class="form-label">가맹점</label>
                                <div class="wrapper" data-autocomplete="store">
                                    <div class="search-btn top-search form-control d-flex align-items-center justify-content-between">
                                        <span>가맹점 검색</span>
                                        <i class="uil uil-angle-down"></i>
                                    </div>
                                    <div class="hide-list">
                                        <div class="search">
                                            <input
                                                    type="text"
                                                    class="form-control top-search"
                                                    id="storeSearch"
                                                    placeholder="가맹점명을 입력해주세요"
                                            />
                                            <ul class="options"></ul>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- 브랜드 라벨과 검색 필드 -->
                            <div class="col-lg-2 col-md-4 col-12">
                                <label for="inspectorSearch" class="form-label">브랜드</label>
                                <div class="wrapper" data-autocomplete="inspector">
                                    <div class="search-btn top-search form-control d-flex align-items-center justify-content-between">
                                        <span>브랜드 검색</span>
                                        <i class="uil uil-angle-down"></i>
                                    </div>
                                    <div class="hide-list">
                                        <div class="search">
                                            <input
                                                    type="text"
                                                    class="form-control top-search"
                                                    id="inspectorSearch"
                                                    placeholder="브랜드명을 입력해주세요"
                                            />
                                            <ul class="options"></ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <%!
                                String getTodayString() {
                                    SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd"); // 날짜 형식 지정
                                    return sdf.format(new Date()); // 현재 날짜를 위에서 지정한 형식으로 포맷팅
                                }
                            %>
                            <!-- 점검 예정일 라벨과 필드 -->
                            <div class="col-lg-2 col-md-4 col-12">
                                <label for="topScheduleDate" class="form-label">점검 예정일</label>
                                <div class="wrapper" data-autocomplete="sv">
                                    <div class="search">
                                        <input
                                                type="date"
                                                class="form-control top-search"
                                                id="topScheduleDate"
                                                placeholder="예정일을 입력해주세요"
                                                min="<%= getTodayString() %>"
                                        />
                                    </div>
                                </div>
                            </div>

                            <!-- 체크리스트명 라벨과 검색 필드 -->
                            <div class="col-lg-3 col-md-6 col-12">
                                <label for="svSearchInput" class="form-label">체크리스트</label>
                                <div class="wrapper" data-autocomplete="CHKLST">
                                    <div class="search-btn top-search form-control d-flex align-items-center justify-content-between">
                                        <span>체크리스트 검색</span>
                                        <i class="uil uil-angle-down"></i>
                                    </div>
                                    <div class="hide-list">
                                        <div class="search">
                                            <input
                                                    type="text"
                                                    class="form-control top-search"
                                                    id="svSearchInput"
                                                    placeholder="체크리스트를 입력해주세요"
                                            />
                                            <ul class="options"></ul>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- 점검자 라벨과 검색 필드 -->
                            <div class="col-lg-2 col-md-4 col-12">
                                <label for="inspector" class="form-label">점검자</label>
                                <div class="wrapper" data-autocomplete="inspector">
                                    <div class="search-btn top-search form-control d-flex align-items-center justify-content-between">
                                        <span>점검자 검색</span>
                                        <i class="uil uil-angle-down"></i>
                                    </div>
                                    <div class="hide-list">
                                        <div class="search">
                                            <input
                                                    type="text"
                                                    class="form-control top-search"
                                                    id="inspector"
                                                    placeholder="점검자를 입력해주세요"
                                            />
                                            <ul class="options"></ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>


                </div>
                <%--  top 영역끝  --%>

                <%--  중간 게시판 목록 시작  --%>
                <%--                <div class="middle-box py-2">--%>
                <%--                    <div class="middle-content ">--%>
                <%--                        <div class="d-flex justify-content-end py-4">--%>
                <%--                            <div class="top-button-wrapper px-2">--%>
                <%--                                <div class="top-button middle-register">추가</div>--%>
                <%--                            </div>--%>
                <%--                            <div class="">--%>
                <%--                                <div class="top-button-wrapper px-2">--%>
                <%--                                    <div class="top-button middle-delete">삭제</div>--%>
                <%--                                </div>--%>
                <%--                            </div>--%>
                <%--                        </div>--%>
                <%--                        <div class="table-responsive">--%>
                <%--                            <table class="table">--%>
                <%--                                <thead>--%>
                <%--                                <tr>--%>
                <%--                                    <th><input type="checkbox" id="checkAll"/></th>--%>
                <%--                                    <th>No</th>--%>
                <%--                                    <th>가맹점명</th>--%>
                <%--                                    <th>브랜드</th>--%>
                <%--                                    <th>체크리스트명</th>--%>
                <%--                                    <th>점검예정일</th>--%>
                <%--                                    <th>점검자</th>--%>
                <%--                                    <th>자세히보기</th>--%>

                <%--                                </tr>--%>
                <%--                                </thead>--%>
                <%--                                <tbody>--%>
                <%--                                <tr>--%>
                <%--                                    <td><input type="checkbox" class="checkItem"/></td>--%>
                <%--                                    <td>1</td>--%>
                <%--                                    <td>혜화점</td>--%>
                <%--                                    <td>KCC 크라상</td>--%>
                <%--                                    <td>KCC 크라상 위생점검표</td>--%>
                <%--                                    <td>2024.10.30</td>--%>
                <%--                                    <td>노승우</td>--%>
                <%--                                    <td>--%>
                <%--                                        <button class="more modal_btn">자세히 보기</button>--%>
                <%--                                    </td>--%>
                <%--                                </tr>--%>


                <%--                                </tbody>--%>
                <%--                            </table>--%>
                <%--                        </div>--%>
                <%--                        <div class="d-flex justify-content-end align-items-center middle-pagebox ">--%>

                <%--                            <div class="pe-3 d-flex align-item-center">--%>
                <%--                                <label for="" style="--%>
                <%--                                        width: 101px;--%>
                <%--                                        padding-top: 6px;--%>
                <%--                                        padding-right: 10px;--%>
                <%--                                       ">페이지 : </label>--%>
                <%--                                <select name="" id="" class="form-select">--%>
                <%--                                    <option value="1" selected>1페이지</option>--%>
                <%--                                    <option value="2">2페이지</option>--%>
                <%--                                    <option value="3">3페이지</option>--%>
                <%--                                    <option value="4">4페이지</option>--%>
                <%--                                    <option value="5">5페이지</option>--%>
                <%--                                </select>--%>
                <%--                            </div>--%>
                <%--                            <div style="display: flex; justify-content: center; align-items: center;">--%>
                <%--                                <a href="" style="text-decoration: none;margin-right: 10px">--%>
                <%--                                    <i class="fa-solid fa-caret-left middle-page-arrow"--%>
                <%--                                       style="color: black; font-size: 1.4rem; vertical-align: middle;"></i>--%>
                <%--                                </a>--%>
                <%--                                페이지 <span style="vertical-align: middle; margin: 0 10px;">20</span> 중 <span--%>
                <%--                                    style="vertical-align: middle; margin: 0 10px;">1</span>--%>
                <%--                                <a href="" style="text-decoration: none;">--%>
                <%--                                    <i class="fa-solid fa-caret-right middle-page-arrow"--%>
                <%--                                       style="color: black; font-size: 1.4rem; vertical-align: middle;"></i>--%>
                <%--                                </a>--%>
                <%--                            </div>--%>

                <%--                        </div>--%>
                <%--                    </div>--%>
                <div class="middle-box py-2">
                    <div class="middle-content ">
                        <div id="myGrid" class="ag-theme-alpine" style="height: 500px; width: 100%;"></div>
                    </div>
                </div>


                <%--                    <!-- 중간 게시판 목록 끝 -->--%>

                <%--                </div>--%>

                <%--  하단 점검 시작  --%>


                <div class="bottom-box-content my-4">
                    <!-- 헤더 섹션 -->
                    <div class="d-flex justify-content-between align-items-center">
                        <div>
                            <b>가맹점 점검 계획 등록</b>
                        </div>
                        <div class="d-flex">
                            <div class="px-2">
                                <div class="top-button middle-register">추가</div>
                            </div>
                            <div class="px-2">
                                <div class="top-button top-reset" id="reset-selection-bottom">초기화</div>
                            </div>
                        </div>
                    </div>

                    <!-- 검색 필드 섹션 -->
                    <div class="container">
                        <div class="row g-3 align-items-center pt-4">

                            <!-- 점검유형 -->
                            <div class="col-lg-3 col-md-6 col-12">
                                <label for="inspectionType" class="form-label">점검 유형</label>
                                <div class="wrapper" data-autocomplete="INSP">
                                    <div class="search-btn top-search form-control d-flex align-items-center justify-content-between">
                                        <span>정기 점검 검색</span>
                                        <i class="uil uil-angle-down"></i>
                                    </div>
                                    <div class="hide-list">
                                        <div class="search">
                                            <input
                                                    type="text"
                                                    class="form-control top-search"
                                                    id="inspectionType"
                                                    placeholder="점검유형을 입력해주세요"
                                            />
                                            <ul class="options"></ul>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- 체크리스트명 -->
                            <div class="col-lg-3 col-md-6 col-12">
                                <label for="checklistName" class="form-label">체크리스트</label>
                                <div class="wrapper" data-autocomplete="CHKLST">
                                    <div class="search-btn top-search form-control d-flex align-items-center justify-content-between">
                                        <span>체크리스트 검색</span>
                                        <i class="uil uil-angle-down"></i>
                                    </div>
                                    <div class="hide-list">
                                        <div class="search">
                                            <input
                                                    type="text"
                                                    class="form-control top-search"
                                                    id="checklistName"
                                                    placeholder="체크리스트를 입력해주세요"
                                            />
                                            <ul class="options"></ul>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- 가맹점 -->
                            <div class="col-lg-3 col-md-6 col-12">
                                <label for="storeSearch" class="form-label">가맹점</label>
                                <div class="wrapper" data-autocomplete="store">
                                    <div class="search-btn top-search form-control d-flex align-items-center justify-content-between">
                                        <span>가맹점 검색</span>
                                        <i class="uil uil-angle-down"></i>
                                    </div>
                                    <div class="hide-list">
                                        <div class="search">
                                            <input
                                                    type="text"
                                                    class="form-control top-search"
                                                    id="storeSearch"
                                                    placeholder="가맹점명을 입력해주세요"
                                            />
                                            <ul class="options"></ul>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- 브랜드 -->
                            <div class="col-lg-3 col-md-6 col-12">
                                <label for="brandSearch" class="form-label">브랜드</label>
                                <div class="wrapper" data-autocomplete="BRAND">
                                    <div class="search-btn top-search form-control d-flex align-items-center justify-content-between">
                                        <span>브랜드 검색</span>
                                        <i class="uil uil-angle-down"></i>
                                    </div>
                                    <div class="hide-list">
                                        <div class="search">
                                            <input
                                                    type="text"
                                                    class="form-control top-search"
                                                    id="brandSearch"
                                                    placeholder="브랜드명을 입력해주세요"
                                            />
                                            <ul class="options"></ul>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- 점검자 -->
                            <div class="col-lg-3 col-md-6 col-12">
                                <label for="inspectorSearch" class="form-label">점검자</label>
                                <div class="wrapper" data-autocomplete="inspector">
                                    <div class="search-btn top-search form-control d-flex align-items-center justify-content-between">
                                        <span>점검자 검색</span>
                                        <i class="uil uil-angle-down"></i>
                                    </div>
                                    <div class="hide-list">
                                        <div class="search">
                                            <input
                                                    type="text"
                                                    class="form-control top-search"
                                                    id="inspectorSearch"
                                                    placeholder="점검자명을 입력해주세요"
                                            />
                                            <ul class="options"></ul>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- 빈도 -->
                            <div class="col-lg-3 col-md-6 col-12">
                                <label for="frequency" class="form-label">빈도</label>
                                <select id="frequency" name="frequency" class="form-select">
                                    <option value="none" selected>빈도없음</option>
                                    <option value="daily">일별</option>
                                    <option value="weekly">주별</option>
                                    <option value="monthly">월별</option>
                                </select>
                            </div>

                            <!-- 횟수 -->
                            <div class="col-lg-3 col-md-6 col-12">
                                <label for="count" class="form-label">횟수</label>
                                <select id="count" name="count" class="form-select">
                                    <option value="none" selected>없음</option>
                                    <!-- 빈도에 따라 동적으로 옵션이 추가될 예정 -->
                                </select>

                            </div>

                            <!-- 점검 예정일 -->
                            <div class="col-lg-3 col-md-6 col-12" id="input-schedule">
                                <label for="bottomScheduleDate" class="form-label">점검 예정일</label>
                                <input
                                        type="date"
                                        class="form-control"
                                        id="bottomScheduleDate"
                                />
                            </div>
                            <!-- 커스텀 달력 -->
                            <div class="col-12" id="custom-calendar-container" style="display: none;">
                                <label class="form-label">점검 날짜 선택</label>
                                <div class="card">
                                    <div class="card-body">
                                        <div class="row mb-3">
                                            <div class="col-md-6 col-sm-12 mb-2">
                                                <label for="year-select-calendar" class="form-label">연도 선택</label>
                                                <select id="year-select-calendar" class="form-select">
                                                    <!-- 연도 선택 옵션은 JS에서 동적으로 생성됩니다 -->
                                                </select>
                                            </div>
                                            <div class="col-md-6 col-sm-12 mb-2">
                                                <label for="month-select-calendar" class="form-label">월 선택</label>
                                                <select id="month-select-calendar" class="form-select">
                                                    <option value="0">1월</option>
                                                    <option value="1">2월</option>
                                                    <option value="2">3월</option>
                                                    <option value="3">4월</option>
                                                    <option value="4">5월</option>
                                                    <option value="5">6월</option>
                                                    <option value="6">7월</option>
                                                    <option value="7">8월</option>
                                                    <option value="8">9월</option>
                                                    <option value="9">10월</option>
                                                    <option value="10">11월</option>
                                                    <option value="11">12월</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div class="table-responsive">
                                            <table class="table table-bordered">
                                                <thead class="table-light">
                                                <tr>
                                                    <th>월</th>
                                                    <th>화</th>
                                                    <th>수</th>
                                                    <th>목</th>
                                                    <th>금</th>
                                                    <th>토</th>
                                                    <th>일</th>
                                                </tr>
                                                </thead>
                                                <tbody class="calendar-body">
                                                <!-- 달력 날짜가 여기에 생성됩니다 -->
                                                </tbody>
                                            </table>
                                        </div>
                                        <!-- 선택된 날짜 카드 컨테이너 -->
                                        <div id="selected-dates-container"></div>
                                    </div>
                                </div>
                            </div>

                            <!-- 빈도별 동적 버튼 영역 (weekly, monthly) -->
                            <div id="dynamic-buttons" class="mt-3"></div>
                        </div>
                    </div>
                </div>

            </div>
            <%--  하단 점검 끝  --%>
        </div>


    </main>
</div>
<div class="modal on">
    <div class="modal_popup">
        <div class="modal-header d-flex justify-content-between align-items-center">
            <h4 class="modal-title">체크 리스트 선택</h4>

            <svg class="svg-inline--fa fa-times fa-w-11 close_btn close" aria-hidden="true" focusable="false"
                 data-prefix="fas" data-icon="times" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 352 512"
                 data-fa-i2svg="">
                <path fill="currentColor"
                      d="M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z"></path>
            </svg>
        </div>
        <div class="modal_wrapper modal-body">
            <ul class="list-group">
                <li class="list-group-item d-flex justify-content-between align-items-center mb-3">
                    <div class="item-info d-flex align-items-center">
                        <span class="me-3">01</span>
                        <p class="mb-0">KCC 크라상 위생 점검 체크리스트</p>
                    </div>
                    <button class="btn btn-primary btn-sm">
                        <i class="fa-regular fa-eye"></i>
                        미리보기
                    </button>
                </li>
                <li class="list-group-item d-flex justify-content-between align-items-center mb-3">
                    <div class="item-info d-flex align-items-center">
                        <span class="me-3">02</span>
                        <p class="mb-0">KCC 카페 제품 점검 체크리스트</p>
                    </div>
                    <button class="btn btn-primary btn-sm">
                        <i class="fa-regular fa-eye"></i>
                        미리보기
                    </button>
                </li>
                <li class="list-group-item d-flex justify-content-between align-items-center mb-3">
                    <div class="item-info d-flex align-items-center">
                        <span class="me-3">03</span>
                        <p class="mb-0">KCC 디저트 위생 점검 체크리스트</p>
                    </div>
                    <button class="btn btn-primary btn-sm">
                        <i class="fa-regular fa-eye"></i>
                        미리보기
                    </button>
                </li>
                <li class="list-group-item d-flex justify-content-between align-items-center mb-3">
                    <div class="item-info d-flex align-items-center">
                        <span class="me-3">04</span>
                        <p class="mb-0">KCC 계란 긴급 점검</p>
                    </div>
                    <button class="btn btn-primary btn-sm">
                        <i class="fa-regular fa-eye"></i>
                        미리보기
                    </button>
                </li>
                <!-- 추가 리스트 아이템 -->
            </ul>
        </div>
        <div class="modal-footer">
            <button class="btn btn-secondary">취소</button>
            <button class="btn btn-primary">선택</button>
        </div>
    </div>
</div>


<script src="/resources/js/qsc/inspection_schedule/schedule_list.js"></script>
</body>
</html>
