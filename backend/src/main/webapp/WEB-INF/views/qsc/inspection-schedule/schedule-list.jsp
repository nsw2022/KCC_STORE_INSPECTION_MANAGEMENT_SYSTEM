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

    <link rel="stylesheet" href="/resources/css/qsc/store_inspection/popup_inspection.css">
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
        body {
            padding: 0px;
        }
    </style>

    <script src='https://cdnjs.cloudflare.com/ajax/libs/gsap/3.11.5/gsap.min.js'></script>
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/ag-grid-community/dist/ag-grid-community.min.js"></script>

</head>
<%!
    String getTodayString() {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd"); // 날짜 형식 지정
        return sdf.format(new Date()); // 현재 날짜를 위에서 지정한 형식으로 포맷팅
    }
%>

<div class="sidebar">
    <jsp:include page="../../sidebar/sidebar.jsp"/>
</div>
<div class="page-wrapper2">
    <main class="page-content">
        <div class="container content">
            <%-- top box start--%>
            <div class="row top-box mb-3" style="margin-bottom: 40px !important;">
                <div class="col ">
                    <div class="top-content">
                        <div class="button-box"  style="display: flex; justify-content: space-between; align-items: center;">
                            <div class="d-flex justify-content-start">
                                <span class="m-3" style="font: 700 20px Noto Sans KR; margin: 0 !important;">가맹점 점검 계획 관리</span>
                                <div class="top-drop-down">
                                    <button>
                                        <i class="fa-solid fa-angle-right"></i>
                                    </button>
                                </div>
                            </div>
                            <div class="my-3" style="margin: 0 !important;">
                                <button type="button" class="btn btn-light me-3 select-btn p-0">
                                    조회
                                </button>
                                <button type="button" class="btn btn-light init-btn p-0" id="reset-selection-top">초기화
                                </button>
                            </div>

                        </div>

                        <div class="bottom-box-content my-4">
                            <!-- 검색 필드 섹션 -->
                            <div class="container-fluid top-box-content px-0">
                                <div class="row g-3 align-items-center">

                                    <!-- 가맹점 라벨과 검색 필드 -->
                                    <div class="col-xl-2 col-lg-3 col-md-4 col-sm-6 col-12">
                                        <label for="topStoreSearch" class="form-label">가맹점</label>
                                        <div class="wrapper" data-autocomplete="store">
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

                                    <!-- 브랜드 라벨과 검색 필드 -->
                                    <div class="col-xl-2 col-lg-3 col-md-4 col-sm-6 col-12">
                                        <label for="topBrandSearch" class="form-label">브랜드</label>
                                        <div class="wrapper" data-autocomplete="BRAND">
                                            <div class="search-btn top-search form-control d-flex align-items-center justify-content-between">
                                                <span id="brandNm">브랜드 검색</span>
                                                <i class="uil uil-angle-down"></i>
                                            </div>
                                            <div class="hide-list">
                                                <div class="search">
                                                    <input
                                                            type="text"
                                                            class="form-control top-search"
                                                            id="topBrandSearch"
                                                            placeholder="브랜드명을 입력해주세요"
                                                    />
                                                    <ul class="options"></ul>
                                                </div>
                                            </div>
                                        </div>
                                    </div>


                                    <!-- 점검 예정일 라벨과 필드 -->
                                    <div class="col-xl-2 col-lg-3 col-md-4 col-sm-6 col-12">
                                        <label for="topScheduleDate" class="form-label">점검 예정일</label>
                                        <div class="wrapper" data-autocomplete="sv">
                                            <div class="search">
                                                <input
                                                        type="date"
                                                        class="form-control top-search"
                                                        id="topScheduleDate"
                                                        placeholder="예정일을 입력해주세요"

                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <!-- 체크리스트명 라벨과 검색 필드 -->
                                    <div class="col-xl-3 col-lg-4 col-md-6 col-sm-12 col-12">
                                        <label for="topChkLst" class="form-label">체크리스트</label>
                                        <div class="wrapper" data-autocomplete="CHKLST">
                                            <div class="search-btn top-search form-control d-flex align-items-center justify-content-between">
                                                <span id="chklstNm">체크리스트 검색</span>
                                                <i class="uil uil-angle-down"></i>
                                            </div>
                                            <div class="hide-list">
                                                <div class="search">
                                                    <input
                                                            type="text"
                                                            class="form-control top-search"
                                                            id="topChkLst"
                                                            placeholder="체크리스트를 입력해주세요"
                                                    />
                                                    <ul class="options"></ul>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- 점검자 라벨과 검색 필드 -->
                                    <div class="col-xl-3 col-lg-4 col-md-6 col-sm-12 col-12">
                                        <label for="topInspector" class="form-label">점검자</label>
                                        <div class="wrapper" data-autocomplete="inspector">
                                            <div class="search-btn top-search form-control d-flex align-items-center justify-content-between">
                                                <span id="inspector">점검자 검색</span>
                                                <i class="uil uil-angle-down"></i>
                                            </div>
                                            <div class="hide-list">
                                                <div class="search">
                                                    <input
                                                            type="text"
                                                            class="form-control top-search"
                                                            id="topInspector"
                                                            placeholder="점검자를 입력해주세요"
                                                    />
                                                    <ul class="options"></ul>
                                                </div>
                                            </div>
                                        </div>
                                    </div>


                                    <!-- 빈도 -->
                                    <div class="col-lg-3 col-md-6 col-12">
                                        <label for="top-frequency" class="form-label ">빈도</label>
                                        <select id="top-frequency" name="frequency" class="form-select bottom-select">
                                            <option value="all" selected>전체</option>
                                            <option value="none">빈도없음</option>
                                            <option value="daily">일별</option>
                                            <option value="weekly">주별</option>
                                            <option value="monthly">월별</option>
                                        </select>
                                    </div>

                                    <!-- 횟수 -->
                                    <div class="col-lg-3 col-md-6 col-12">
                                        <label for="top-count" class="form-label">횟수</label>
                                        <select id="top-count" name="count" class="form-select bottom-select">
                                            <option value="none" selected>전체</option>
                                            <!-- 빈도에 따라 동적으로 옵션이 추가될 예정 -->
                                        </select>

                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
            <%-- top box end--%>

            <%-- middle box start--%>
            <div class="row middle-box">
                <div class="col px-0">
                    <div class="middle-content">
                        <div class="button-box"
                             style="display: flex; justify-content: space-between; align-items: center;">
                            <span class="ms-3" style="font: 350 20px Noto Sans KR;">총 <span id="checklist_count"
                                                                                            style="color: #0035BE"></span>개</span>
                            <div class="my-0">
                                <button type="button" class="btn btn-light me-3" id="addRowButton">추가</button>
                                <button type="button" class="btn btn-light" id="deleteRowButton">삭제</button>
                            </div>
                        </div>
                        <div>
                            <div id="myGrid" style="height: 45vh; width:100%" class="ag-theme-quartz mb-3"></div>
                        </div>
                    </div>
                </div>
            </div>
            <%-- middle box end--%>
            <%-- bottom box start--%>
            <div class="row bottom-box mb-3">
                <div class="col px-0">
                    <div class="top-content">
                        <div class="button-box"
                             style="display: flex; justify-content: space-between; align-items: center;">
                            <span class="m-0" style="font: 700 20px Noto Sans KR;">가맹점 점검 계획 관리</span>
                            <div class="my-0">
                                <button type="button" class="btn btn-primaty save-btn me-3">저장</button>
                                <button type="button" class="btn init-btn btn-light me-0 p-0"
                                        id="reset-selection-bottom">초기화
                                </button>
                            </div>
                        </div>
                        <div class="container px-0 bottom-box-filter">
                            <div class="row g-3 align-items-center pt-4">

                                <!-- 점검유형 -->
                                <div class="col-lg-3 col-md-6 col-12">
                                    <label for="inspectionType" class="form-label">점검 유형</label>
                                    <div class="wrapper" data-autocomplete="BottomINSP" data-include-all="false">
                                        <div class="search-btn top-search form-control d-flex align-items-center justify-content-between">
                                            <span id="bottom-INSP">점검 유형</span>
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
                                    <div class="wrapper" data-autocomplete="BottomCHKLST" data-include-all="false">
                                        <div class="search-btn top-search form-control d-flex align-items-center justify-content-between">
                                            <span id="bottom-CHKLST">체크리스트</span>
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
                                    <div class="wrapper" data-autocomplete="store" data-include-all="false">
                                        <div class="search-btn top-search form-control d-flex align-items-center justify-content-between">
                                            <span id="bottom-STORE">가맹점</span>
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
                                    <div class="wrapper" data-autocomplete="BRAND" data-include-all="false">
                                        <div class="search-btn top-search form-control d-flex align-items-center justify-content-between">
                                            <span id="bottom-BRAND">브랜드</span>
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
                                    <div class="wrapper" data-autocomplete="inspector" data-include-all="false">
                                        <div class="search-btn top-search form-control d-flex align-items-center justify-content-between">
                                            <span id="bottom-INSPECTOR">점검자</span>
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
                                    <label for="frequency" class="form-label ">빈도</label>
                                    <select id="frequency" name="frequency" class="form-select bottom-select">
                                        <option value="none" selected>빈도없음</option>
                                        <option value="daily">일별</option>
                                        <option value="weekly">주별</option>
                                        <option value="monthly">월별</option>
                                    </select>
                                </div>

                                <!-- 횟수 -->
                                <div class="col-lg-3 col-md-6 col-12">
                                    <label for="count" class="form-label">횟수</label>
                                    <select id="count" name="count" class="form-select bottom-select">
                                        <option value="none" selected>없음</option>
                                        <!-- 빈도에 따라 동적으로 옵션이 추가될 예정 -->
                                    </select>

                                </div>

                                <!-- 점검 예정일 -->
                                <div class="col-lg-3 col-md-6 col-12 search" id="input-schedule">
                                    <label for="bottomScheduleDate" class="form-label">점검 예정일</label>
                                    <input
                                            type="date"
                                            class="form-control "
                                            id="bottomScheduleDate"
                                            min="<%= getTodayString() %>"
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
                                                    <tr class="text-center">
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
            </div>
            <%-- bottom box end--%>
        </div>
    </main>
</div>
<%-------------  modal -------------%>
<div class="modal fade" id="masterChecklistModal" aria-hidden="true" aria-labelledby="masterChecklistList" tabindex="-1"
     data-bs-backdrop="static" data-bs-keyboard="false">
    <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
        <div class="modal-content">

            <%-------------- header --------------%>
            <div class="modal-header">
            <span class="modal-title fs-5" id="masterChecklistList" style="font: 450 16px 'Noto Sans KR'">
              마스터체크리스트 선택
            </span>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <%-------------- header --------------%>

            <%-------------- body --------------%>
            <div class="modal-body">
                <div class="input-group mb-3 modal-search-box" style="    padding: .5rem 1rem;">
                    <input type="text" class="form-control me-2" placeholder="체크리스트 검색"
                           aria-label="Recipient's username" aria-describedby="button-addon2" style="width: 75%">
                    <button class="btn btn-outline-secondary" type="button" id="button-addon2">검색</button>
                </div>
                <ol class="list-group  scrollable-list ">
                    <li class="list-group-item d-flex justify-content-between align-items-center mb-1">
                        <div class="item-info d-flex align-items-center">
                            <span class="me-3">01</span>
                            <p class="mb-0">KCC 카페 제품 점검 체크리스트</p>
                        </div>
                        <button class="btn btn-primary btn-sm" type="button" data-bs-target="#exampleModalToggle2"
                                data-bs-toggle="modal">
                            미리보기
                            <i class="fa-regular fa-eye"></i>
                        </button>
                    </li>
                    <li class="list-group-item d-flex justify-content-between align-items-center mb-1">
                        <div class="item-info d-flex align-items-center">
                            <span class="me-3">01</span>
                            <p class="mb-0">KCC 카페 제품 점검 체크리스트</p>
                        </div>
                        <button class="btn btn-primary btn-sm" type="button" data-bs-target="#exampleModalToggle2"
                                data-bs-toggle="modal">
                            미리보기
                            <i class="fa-regular fa-eye"></i>
                        </button>
                    </li>
                    <li class="list-group-item d-flex justify-content-between align-items-center mb-1">
                        <div class="item-info d-flex align-items-center">
                            <span class="me-3">01</span>
                            <p class="mb-0">KCC 카페 제품 점검 체크리스트</p>
                        </div>
                        <button class="btn btn-primary btn-sm" type="button" data-bs-target="#exampleModalToggle2"
                                data-bs-toggle="modal">
                            미리보기
                            <i class="fa-regular fa-eye"></i>
                        </button>
                    </li>
                    <li class="list-group-item d-flex justify-content-between align-items-center mb-1">
                        <div class="item-info d-flex align-items-center">
                            <span class="me-3">01</span>
                            <p class="mb-0">KCC 카페 제품 점검 체크리스트</p>
                        </div>
                        <button class="btn btn-primary btn-sm" type="button" data-bs-target="#exampleModalToggle2"
                                data-bs-toggle="modal">
                            미리보기
                            <i class="fa-regular fa-eye"></i>
                        </button>
                    </li>
                    <li class="list-group-item d-flex justify-content-between align-items-center mb-1">
                        <div class="item-info d-flex align-items-center">
                            <span class="me-3">01</span>
                            <p class="mb-0">KCC 카페 제품 점검 체크리스트</p>
                        </div>
                        <button class="btn btn-primary btn-sm" type="button" data-bs-target="#exampleModalToggle2"
                                data-bs-toggle="modal">
                            미리보기
                            <i class="fa-regular fa-eye"></i>
                        </button>
                    </li>
                    <li class="list-group-item d-flex justify-content-between align-items-center mb-1">
                        <div class="item-info d-flex align-items-center">
                            <span class="me-3">01</span>
                            <p class="mb-0">KCC 카페 제품 점검 체크리스트</p>
                        </div>
                        <button class="btn btn-primary btn-sm" type="button" data-bs-target="#exampleModalToggle2"
                                data-bs-toggle="modal">
                            미리보기
                            <i class="fa-regular fa-eye"></i>
                        </button>
                    </li>
                    <li class="list-group-item d-flex justify-content-between align-items-center mb-1">
                        <div class="item-info d-flex align-items-center">
                            <span class="me-3">01</span>
                            <p class="mb-0">KCC 카페 제품 점검 체크리스트</p>
                        </div>
                        <button class="btn btn-primary btn-sm" type="button" data-bs-target="#exampleModalToggle2"
                                data-bs-toggle="modal" style="border-radius: 8px;">
                            미리보기
                            <i class="fa-regular fa-eye"></i>
                        </button>
                    </li>


                </ol>
            </div>
            <%-------------- body --------------%>

            <%-------------- footer --------------%>
            <div class="modal-footer">
                <button class="btn btn-secondary" data-bs-dismiss="modal" aria-label="Close">취소</button>
                <button class="" data-bs-dismiss="modal">선택</button>
            </div>
            <%-------------- footer --------------%>
        </div>
    </div>
</div>


<%--    second modal     --%>
<div class="modal fade" id="exampleModalToggle2" aria-hidden="true" aria-labelledby="details" tabindex="-1"
     data-bs-backdrop="static" data-bs-keyboard="false">
    <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-lg"
         style="max-width : 1015px!important;">
        <div class="modal-content" style="overflow-y: scroll;">
            <section class="inspection-section">
                <div class="inspection-tabs" style="">

                    <button class="inspection-tab2" data-bs-target="#masterChecklistModal"
                            data-bs-toggle="modal" style="background-color: #afa4dd; color: white;">뒤로가기
                    </button>
                </div>
            </section>
            <div class="modal-footer">

            </div>
        </div>
    </div>
</div>


<%--<script src="/resources/js/qsc/store_inspection/popup_inspection.js"></script>--%>
<script src="/resources/js/qsc/inspection_schedule/schedule_list.js"></script>
<!-- SweetAlert2 JS -->
<script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
</body>
</html>
