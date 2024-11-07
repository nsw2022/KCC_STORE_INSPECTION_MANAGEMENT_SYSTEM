<%@ page import="java.util.Date" %>
<%@ page import="java.text.SimpleDateFormat" %>
<%@ page language="java" contentType="text/html; charset=UTF-8"
pageEncoding="UTF-8" %>
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>SIMS</title>
    <!-- Font Awesome -->
    <link
      rel="stylesheet"
      href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css"
    />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@100..900&display=swap"
      rel="stylesheet"
    />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap"
      rel="stylesheet"
    />
    <link
      rel="stylesheet"
      href="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css"
    />
    <link
      rel="stylesheet"
      href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
      integrity="sha512-iecdLmaskl7CVkqkXNQ/ZH/XLlvWZOJyj7Yy7tcenmpD1ypASozpmT/E0iPtmFIB46ZmdtAc9eNBvH0H/ZpiBw=="
      crossorigin="anonymous"
    />
    <!-- Iconscout Link For Icons -->
    <link
      rel="stylesheet"
      href="https://unicons.iconscout.com/release/v4.0.0/css/line.css"
    />
    <link
      rel="stylesheet"
      href="/resources/css/master/checklist/list/checklist_list.css"
    />
    <!-- SweetAlert2 CSS -->
    <link
            href="https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.min.css"
            rel="stylesheet"
    />

    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.11.5/gsap.min.js"></script>
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/ag-grid-community/dist/ag-grid-community.min.js"></script>
    <!-- SweetAlert2 JS -->
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
</head>
<body>
<div class="sidebar">
  <jsp:include page="../../../sidebar/sidebar.jsp" />
</div>

  <div class="page-wrapper2">
    <main class="page-content">
      <div class="container content">
        <%-- top box start--%>
        <div class="row top-box">
          <div class="col ">
            <div class="top-content">
              <div class="button-box" style="display: flex; justify-content: space-between; align-items: center;">
                <div class="d-flex justify-content-start">
                  <p class="m-3" style="font: 700 20px Noto Sans KR; margin: 0 !important;">체크리스트 관리</p>
                  <div class="top-drop-down">
                    <button>
                      <i class="fa-solid fa-angle-right"></i>
                    </button>
                  </div>
                </div>
                <div class="my-3" style="margin: 0 !important;">
                  <button type="button" class="btn btn-light me-3 select-btn p-0" onclick="onSearchRow()">조회</button>
                  <button type="button" class="btn btn-light init-btn p-0" onclick="onSearchInit()">초기화</button>
                </div>
              </div>

              <div class="bottom-box-content my-4">
                <!-- 검색 필드 섹션 -->
                <div class="container-fluid px-0">
                  <div class="row g-3 align-items-center">
                    <!-- 체크리스트명 -->
                    <div class="col-lg-3 col-md-6 col-12">
                      <label for="checklistName" class="form-label">체크리스트</label>
                      <div class="wrapper" data-autocomplete="CHKLST">
                        <div class="search-btn top-search form-control d-flex align-items-center justify-content-between">
                          <span class="searchChklstPlaceholder">체크리스트 검색</span>
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
                    <!-- 브랜드 -->
                    <div class="col-lg-3 col-md-6 col-12">
                      <label for="inspectionType" class="form-label">브랜드</label>
                      <div class="wrapper" data-autocomplete="BRAND">
                        <div class="search-btn top-search form-control d-flex align-items-center justify-content-between">
                          <span class="searchBrandPlaceholder">브랜드 검색</span>
                          <i class="uil uil-angle-down"></i>
                        </div>
                        <div class="hide-list">
                          <div class="search">
                            <input
                                    type="text"
                                    class="form-control top-search"
                                    id="inspectionType"
                                    placeholder="브랜드명을 입력해주세요"
                            />
                            <ul class="options"></ul>
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- 마스터 체크리스트 -->
                    <div class="col-lg-3 col-md-6 col-12">
                      <label for="storeSearch" class="form-label">마스터 체크리스트</label>
                      <div class="wrapper" data-autocomplete="MASTER_CHKLST">
                        <div class="search-btn top-search form-control d-flex align-items-center justify-content-between">
                          <span class="searchMasterChklstPlaceholder">마스터 체크리스트</span>
                          <i class="uil uil-angle-down"></i>
                        </div>
                        <div class="hide-list">
                          <div class="search">
                            <input
                                    type="text"
                                    class="form-control top-search"
                                    id="storeSearch"
                                    placeholder="마스터 체크리스트명을 입력해주세요"
                            />
                            <ul class="options"></ul>
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- 점검유형 -->
                    <div class="col-lg-3 col-md-6 col-12">
                      <label for="brandSearch" class="form-label">점검유형</label>
                      <div class="wrapper" data-autocomplete="INSP">
                        <div class="search-btn top-search form-control d-flex align-items-center justify-content-between">
                          <span class="searchInspTypePlaceholder">점검유형</span>
                          <i class="uil uil-angle-down"></i>
                        </div>
                        <div class="hide-list">
                          <div class="search">
                            <input
                                    type="text"
                                    class="form-control top-search"
                                    id="brandSearch"
                                    placeholder="점검유형을 입력해주세요"
                            />
                            <ul class="options"></ul>
                          </div>
                        </div>
                      </div>
                    </div>
                    <%--등록일--%>
                    <div class="col-lg-3 col-md-4 col-12">
                      <label for="topScheduleDate" class="form-label">등록일</label>
                      <div class="wrapper" data-autocomplete="sv">
                        <div class="search">
                          <input
                                  type="date"
                                  class="form-control top-search searchDatePlaceholder"
                                  id="topScheduleDate"
                          />
                        </div>
                      </div>
                    </div>

                    <!-- 마스터여부 -->
                    <div class="col-lg-3 col-md-6 col-12">
                      <label class="form-label">마스터여부</label>
                      <div class="wrapper" data-autocomplete="STATUS">
                        <div class="search-btn top-search form-control d-flex align-items-center justify-content-between">
                          <span class="searchMasterSttsPlaceholder">마스터여부</span>
                          <i class="uil uil-angle-down"></i>
                        </div>
                        <div class="hide-list">
                          <div class="search">
                            <input
                                    type="text"
                                    class="form-control top-search"
                                    id="isMaster"
                                    placeholder="마스터체크리스트명"
                            />
                            <ul class="options"></ul>
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- 사용여부 -->
                    <div class="col-lg-3 col-md-6 col-12">
                      <label class="form-label">사용여부</label>
                      <!-- 빈도에 따라 동적으로 옵션이 추가될 예정 -->
                      <div class="wrapper" data-autocomplete="STATUS">
                        <div class="search-btn top-search form-control d-flex align-items-center justify-content-between">
                          <span class="searchUseWPlaceholder">사용여부</span>
                          <i class="uil uil-angle-down"></i>
                        </div>
                        <div class="hide-list">
                          <div class="search">
                            <input
                                    type="text"
                                    class="form-control top-search"
                                    id="isUsing"
                                    placeholder="사용여부"
                            />
                            <ul class="options"></ul>
                          </div>
                        </div>
                      </div>

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
              <div class="button-box" style="display: flex; justify-content: space-between; align-items: center;">
                <span class="ms-3" style="font: 350 20px Noto Sans KR;">총 <span class="checklist_count" style="color: #0035BE"></span>개</span>
                <div class="my-0">
                  <button type="button" class="btn btn-light me-3" onclick="onChecklistAddRow()">추가</button>
                  <button type="button" class="btn btn-light" onclick="onChecklistDeleteRow()">삭제</button>
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
                <div class="button-box" style="display: flex; justify-content: space-between; align-items: center;">
                  <span class="m-0" style="font: 700 20px Noto Sans KR;">체크리스트 상세</span>
                  <div class="my-0">
                    <button type="button" class="btn btn-primaty save-btn" onclick="confirmationDialog()" disabled>저장</button>
                  </div>
                </div>
                <div class="container px-0">
                  <div class="row first-input-box mb-3">
                    <!-- 브랜드 -->
                    <div class="col-lg-3 col-md-6 col-12">
                      <label for="inspectionType" class="form-label form-label-essential d-flex">브랜드명</label>
                      <div class="wrapper bottom-wrapper" data-autocomplete="BRAND1">
                        <div class="search-btn top-search form-control d-flex align-items-center justify-content-between">
                          <span class="brandPlaceholder">브랜드</span>
                          <i class="uil uil-angle-down"></i>
                        </div>
                        <div class="hide-list">
                          <div class="search">
                            <input
                                    type="text"
                                    class="form-control"
                                    id="brandName2"
                                    placeholder="브랜드명을 입력해주세요"
                            />
                            <ul class="options"></ul>
                          </div>
                        </div>
                      </div>
                    </div>
                    <!-- 체크리스트명 -->
                    <div class="col-lg-3 col-md-6 col-12">
                      <label for="checklistName" class="form-label form-label-essential d-flex">체크리스트명</label>
                      <div class="wrapper bottom-wrapper">
                        <div class="search-btn top-search form-control d-flex align-items-center justify-content-between" style="height: 34px">
                          <span class="checklistPlaceholder" contenteditable="true" style="width: 100%">체크리스트명</span>
                        </div>
                      </div>
                    </div>
                    <!-- 마스터 체크리스트 -->
                    <div class="col-lg-3 col-md-6 col-12">
                      <label for="storeSearch" class="form-label">마스터 체크리스트</label>
                      <div class="wrapper masterChklstSearchBtn bottom-wrapper">
                        <div class="search-btn top-search form-control d-flex align-items-center justify-content-between" style="height: 34px !important" data-bs-toggle="modal" data-bs-target="#masterChecklistModal">
                          <span class="masterChecklistPlaceholder">마스터 체크리스트</span>
                        </div>
                      </div>
                    </div>

                    <!-- 점검유형 -->
                    <div class="col-lg-3 col-md-6 col-12">
                      <label for="brandSearch" class="form-label form-label-essential d-flex">점검유형</label>
                      <div class="wrapper bottom-wrapper" data-autocomplete="INSP1">
                        <div class="search-btn top-search form-control d-flex align-items-center justify-content-between">
                          <span class="inspectionTypePlaceholder">점검유형</span>
                          <i class="uil uil-angle-down"></i>
                        </div>
                        <div class="hide-list">
                          <div class="search">
                            <input
                                    type="text"
                                    class="form-control"
                                    id="inspectionType2"
                                    placeholder="점검유형을 입력해주세요"
                            />
                            <ul class="options"></ul>
                          </div>
                        </div>
                      </div>
                    </div>
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
<div class="modal fade" id="masterChecklistModal" aria-hidden="true" aria-labelledby="masterChecklistList" tabindex="-1" data-bs-backdrop="static" data-bs-keyboard="false">
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
          <input type="text" class="form-control me-2 chklst-search-box" placeholder="체크리스트 검색" aria-label="Recipient's username" aria-describedby="button-addon2">
          <button class="btn btn-outline-secondary chklst-search-btn" type="button" id="button-addon2">검색</button>
        </div>
        <ol class="list-group">

        </ol>
      </div>
      <%-------------- modal body --------------%>

      <%-------------- modal footer --------------%>
      <div class="modal-footer">
        <button class="btn btn-primary chklstSelectBtn" data-bs-dismiss="modal">선택</button>
      </div>
      <%-------------- modal footer --------------%>
    </div>
  </div>
</div>


<%--    second modal     --%>
<div class="modal fade" id="MasterChecklistPreviewModal" aria-hidden="false" aria-labelledby="details" tabindex="-1" data-bs-backdrop="static" data-bs-keyboard="false">
  <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-lg">
    <div class="modal-content">
      <%--------------         second modal header       ----------------------%>
      <div class="modal-header">
        <div class="large-category-group">
        </div>
        <button class="btn back-btn" data-bs-target="#masterChecklistModal" data-bs-toggle="modal">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-left" viewBox="0 0 16 16">
            <path fill-rule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8"/>
          </svg>
        </button>
      </div>
      <%--------------          second modal header       ----------------------%>
        <div class="modal-body subCategory">
          <div class="row row-cols-2 d-flex justify-content-between category">
          </div>
          <div class="d-flex flex-row justify-content-end align-items-center score">
            <span class="me-2">총</span>
            <span style="color: #D90D0D">100</span>
            <span class="me-2">점</span>
          </div>
        </div>
        <%--------------           body       ----------------------%>
    </div>
  </div>
</div>
<%----------- second modal end ---------------%>
<script
  type="application/javascript"
  src="../../../../../resources/js/master/checklist/list/checklist.js"
></script>
<script
        type="application/javascript"
        src="../../../../../resources/js/master/checklist/list/checklist_modal.js"
></script>
<script
        type="application/javascript"
        src="../../../../../resources/js/master/checklist/list/checklist_filter.js"
></script>
<script
        type="application/javascript"
        src="../../../../../resources/js/master/checklist/list/checklist_second_modal.js"
></script>
</body>
</html>
