<%@ page import="java.util.Date" %>
<%@ page import="java.text.SimpleDateFormat" %>
<%@ page language="java" contentType="text/html; charset=UTF-8"
pageEncoding="UTF-8" %>
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>checklist_list</title>
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
                    <button type="button" class="btn btn-light me-3 select-btn p-0" onclick="onAddRow()">조회</button>
                    <button type="button" class="btn btn-light init-btn p-0" onclick="onDeleteRow()">초기화</button>
                  </div>
                </div>

                <div class="bottom-box-content my-4">
                  <!-- 검색 필드 섹션 -->
                  <div class="container-fluid px-0">
                    <div class="row g-3 align-items-center">

                      <!-- 점검유형 -->
                      <div class="col-lg-3 col-md-6 col-12">
                        <label for="inspectionType" class="form-label">브랜드</label>
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
                                      id="inspectionType"
                                      placeholder="브랜드명을 입력해주세요"
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

                      <!-- 마스터 체크리스트 -->
                      <div class="col-lg-3 col-md-6 col-12">
                        <label for="storeSearch" class="form-label">마스터 체크리스트</label>
                        <div class="wrapper" data-autocomplete="MASTER_CHKLST">
                          <div class="search-btn top-search form-control d-flex align-items-center justify-content-between">
                            <span>마스터 체크리스트</span>
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
                            <span>점검유형</span>
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

                      <div class="col-lg-3 col-md-4 col-12">
                        <label for="topScheduleDate" class="form-label">등록일</label>
                        <div class="wrapper" data-autocomplete="sv">
                          <div class="search">
                            <input
                                    type="date"
                                    class="form-control top-search"
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
                            <span>마스터여부</span>
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
                            <span>사용여부</span>
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
                        <label for="inspectionType" class="form-label">브랜드</label>
                        <div class="wrapper bottom-wrapper" data-autocomplete="BRAND1">
                          <div class="search-btn top-search form-control d-flex align-items-center justify-content-between">
                            <span class="brandPlaceholder">브랜드</span>
                            <i class="uil uil-angle-down"></i>
                          </div>
                          <div class="hide-list">
                            <div class="search">
                              <input
                                      type="text"
                                      class="form-control top-search"
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
                        <label for="checklistName" class="form-label">체크리스트</label>
                        <div class="wrapper bottom-wrapper" data-autocomplete="CHKLST1">
                          <div class="search-btn top-search form-control d-flex align-items-center justify-content-between">
                            <span class="checklistPlaceholder">체크리스트</span>
                            <i class="uil uil-angle-down"></i>
                          </div>
                          <div class="hide-list">
                            <div class="search">
                              <input
                                      type="text"
                                      class="form-control top-search"
                                      id="checklistName2"
                                      placeholder="체크리스트를 입력해주세요"
                              />
                              <ul class="options"></ul>
                            </div>
                          </div>
                        </div>
                      </div>
                      <!-- 마스터 체크리스트 -->
                      <div class="col-lg-3 col-md-6 col-12">
                        <label for="storeSearch" class="form-label">마스터 체크리스트</label>
                        <div class="wrapper masterChklstSearchBtn bottom-wrapper" data-autocomplete="MASTER_CHKLST">
                          <div class="search-btn top-search form-control d-flex align-items-center justify-content-between" style="height: 34px !important" data-bs-toggle="modal" data-bs-target="#masterChecklistModal">
                            <span class="masterChecklistPlaceholder">마스터 체크리스트</span>
                          </div>
                        </div>
                      </div>

                      <!-- 점검유형 -->
                      <div class="col-lg-3 col-md-6 col-12">
                        <label for="brandSearch" class="form-label">점검유형</label>
                        <div class="wrapper bottom-wrapper" data-autocomplete="INSP1">
                          <div class="search-btn top-search form-control d-flex align-items-center justify-content-between">
                            <span class="inspectionTypePlaceholder">점검유형</span>
                            <i class="uil uil-angle-down"></i>
                          </div>
                          <div class="hide-list">
                            <div class="search">
                              <input
                                      type="text"
                                      class="form-control top-search"
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
              <input type="text" class="form-control me-2" placeholder="체크리스트 검색" aria-label="Recipient's username" aria-describedby="button-addon2">
              <button class="btn btn-outline-secondary" type="button" id="button-addon2">검색</button>
            </div>
            <ol class="list-group">
              <li class="list-group-item d-flex justify-content-between align-items-center mb-1">
                <div class="item-info d-flex align-items-center">
                  <span class="me-3">01</span>
                  <p class="mb-0">KCC 카페 제품 점검 체크리스트</p>
                </div>
                <button class="btn btn-primary btn-sm rounded-20" type="button" data-bs-target="#exampleModalToggle2" data-bs-toggle="modal">
                  미리보기
                  <i class="fa-regular fa-eye"></i>
                </button>
              </li>
              <li class="list-group-item d-flex justify-content-between align-items-center mb-1">
                <div class="item-info d-flex align-items-center">
                  <span class="me-3">01</span>
                  <p class="mb-0">KCC 카페 제품 점검 체크리스트</p>
                </div>
                <button class="btn btn-primary btn-sm" type="button" data-bs-target="#exampleModalToggle2" data-bs-toggle="modal">
                  미리보기
                  <i class="fa-regular fa-eye"></i>
                </button>
              </li>
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
    <div class="modal fade" id="exampleModalToggle2" aria-hidden="false" aria-labelledby="details" tabindex="-1" data-bs-backdrop="static" data-bs-keyboard="false">
      <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-lg">
        <div class="modal-content">
          <%--------------         second modal header       ----------------------%>
          <div class="modal-header">
            <div class="large-category-group">
              <button type="button" class="btn btn-primary">중대법규</button>
              <button type="button" class="btn btn-outline-primary">기타법규</button>
            </div>
            <button class="btn back-btn" data-bs-target="#masterChecklistModal" data-bs-toggle="modal">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-left" viewBox="0 0 16 16">
                <path fill-rule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8"/>
              </svg>
            </button>
          </div>
          <%--------------          second modal header       ----------------------%>
          <%--------------          second modal body       ----------------------%>
          <div class="modal-body">
            <div class="row d-flex justify-content-between">
              <div class="col-lg mb-3">
                <div class="accordion" id="accordionExample">
                  <div class="accordion-item">
                    <h2 class="accordion-header">
                      <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="false" aria-controls="collapseOne">
                        영업취소
                      </button>
                    </h2>
                    <div id="collapseOne" class="accordion-collapse collapse" >
                      <div class="accordion-body p-0">
                        <!-- 내부 아코디언 -->
                        <div class="accordion" id="innerAccordion1">
                          <div class="accordion-item border border-0">
                            <h2 class="accordion-header" id="innerHeadingOne">
                              <button class="accordion-button collapsed border border-0" style="background-color: white !important;" type="button" data-bs-toggle="collapse" data-bs-target="#innerCollapseOne" aria-expanded="false" aria-controls="innerCollapseOne">
                                <span style="font: 400 13px Noto Sans KR">1. </span><span style="font: 400 13px Noto Sans KR">소비기한 변조 및 삭제</span>
                              </button>
                            </h2>
                            <div id="innerCollapseOne" class="accordion-collapse collapse" aria-labelledby="innerHeadingOne">
                              <div class="accordion-body">
                                <div class="row row-cols-2 btn-box">
                                  <div class="col-lg border border-light-subtle d-flex justify-content-center align-items-center">
                                    <span>예</span>
                                  </div>
                                  <div class="col-lg border border-light-subtle d-flex justify-content-center align-items-center">
                                    <span>아니오</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                      </div>
                      <!-- 내부 아코디언 -->
                    </div>
                    </div>
                  </div>
              </div>
              </div>
              <div class="col-lg mb-3">
                <div class="accordion-item">
                  <h2 class="accordion-header">
                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                      영업정지 1개월 이상
                    </button>
                  </h2>
                  <div id="collapseTwo" class="accordion-collapse collapse">
                    <!-- 내부 아코디언 -->
                    <div class="accordion" id="innerAccordion2">
                      <div class="accordion-item border border-0">
                        <h2 class="accordion-header" id="innerHeadingTwo">
                          <button class="accordion-button collapsed border border-0" style="background-color: white !important;" type="button" data-bs-toggle="collapse" data-bs-target="#innerCollapseTwo" aria-expanded="false" aria-controls="innerCollapseTwo">
                            <span style="font: 400 13px Noto Sans KR">1. </span><span style="font: 400 13px Noto Sans KR">표시사항 전부를 표시하지 않은 식품</span>
                          </button>
                        </h2>
                        <div id="innerCollapseTwo" class="accordion-collapse collapse" aria-labelledby="innerHeadingTwo">
                          <div class="accordion-body">
                            <div class="row d-flex justify-content-center radio-box">
                              <div class="col form-check">
                                <label class="form-check-label" for="flexRadioDefault1">
                                  매우 좋음
                                </label>
                                <input class="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault1">
                              </div>
                              <div class="col form-check">
                                <label class="form-check-label" for="flexRadioDefault1">
                                  좋음
                                </label>
                                <input class="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault2">
                              </div>
                              <div class="col form-check">
                                <label class="form-check-label" for="flexRadioDefault1">
                                  보통
                                </label>
                                <input class="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault3">
                              </div>
                              <div class="col form-check">
                                <label class="form-check-label" for="flexRadioDefault1">
                                  나쁨
                                </label>
                                <input class="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault4">
                              </div>
                              <div class="col form-check">
                                <label class="form-check-label" for="flexRadioDefault1">
                                  매우 나쁨
                                </label>
                                <input class="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault5">
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <!-- 내부 아코디언 -->
                  </div>
                </div>
              </div>
            </div>
            <div class="d-flex flex-row justify-content-end align-items-center score">
              <span class="me-2">총</span>
              <span style="color: #D90D0D">100</span>
              <span class="me-2">점</span>
            </div>



          </div>
          <%--------------         second modal  body       ----------------------%>

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
  </body>
</html>
