<%@ page language="java" contentType="text/html; charset=UTF-8"
         pageEncoding="UTF-8" %>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>MASTER - PRODUCT </title>

    <!-- Bootstrap CSS -->
    <link
            href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css"
            rel="stylesheet"
    />
    <!-- Font Awesome -->
    <link
            rel="stylesheet"
            href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css"
    />
    <link rel="preconnect" href="https://fonts.googleapis.com"/>
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
    <link
            href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@100..900&display=swap"
            rel="stylesheet"
    />
    <link rel="preconnect" href="https://fonts.googleapis.com"/>
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
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
    <!-- SweetAlert2 CSS -->
    <link
            href="https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.min.css"
            rel="stylesheet"
    />
    <!-- SweetAlert2 JS -->
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.11.5/gsap.min.js"></script>
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <link rel="stylesheet" href="/resources/css/master/product_manage/product_list.css">
    <script src="https://cdn.jsdelivr.net/npm/ag-grid-community/dist/ag-grid-community.min.js"></script>
</head>
<body>

<!-- 사이드바 -->
<div class="sidebar">
    <jsp:include page="../../sidebar/sidebar.jsp"/>
</div>
<!-- 사이드바 끝 -->

<div class="page-wrapper2">
    <main class="page-content">
        <div class="container content">
            <%-- top box start--%>
            <div class="row top-box mb-3">
                <div class="col ">
                    <div class="top-content">
                        <div class="button-box"
                             style="display: flex; justify-content: space-between; align-items: center;">
                            <div class="d-flex justify-content-start">
                                <span class="m-3"
                                      style="font: 700 20px Noto Sans KR; margin: 0 !important;">제품 관리</span>
                                <div class="top-drop-down">
                                    <button>
                                        <i class="fa-solid fa-angle-right"></i>
                                    </button>
                                </div>
                            </div>

                            <div class="my-3" style="margin: 0 !important;">
                                <button type="button" class="btn btn-light me-3 select-btn p-0" onclick="onSearchRow()">
                                    조회
                                </button>
                                <button type="button" class="btn btn-light init-btn p-0" id="reset-selection-top"
                                        onclick="onSearchInit()">초기화
                                </button>
                            </div>
                        </div>

                        <div class="bottom-box-content my-4">
                            <!-- 검색 필드 섹션 -->
                            <div class="container-fluid px-0">
                                <div class="row g-3 align-items-center">

                                    <!-- 가맹점 라벨과 검색 필드 -->
                                    <div class="col-12 col-md-4">
                                        <label for="storeSearch" class="form-label">브랜드</label>
                                        <div class="wrapper" data-autocomplete="brandNm">
                                            <div class="search-btn top-search form-control d-flex align-items-center justify-content-between">
                                                <span>브랜드 검색</span>
                                                <i class="uil uil-angle-down"></i>
                                            </div>
                                            <div class="hide-list">
                                                <div class="search">
                                                    <input
                                                            type="text"
                                                            class="form-control top-search"
                                                            id="storeSearch"
                                                            placeholder="브랜드명을 입력해주세요"
                                                            aria-label="브랜드 검색"
                                                    />
                                                    <ul class="options"></ul>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- 브랜드 라벨과 검색 필드 -->
                                    <div class="col-12 col-md-4">
                                        <label for="pdtNmForSearch" class="form-label">제품명</label>
                                        <div class="wrapper" data-autocomplete="pdtNm">
                                            <div class="search-btn top-search form-control d-flex align-items-center justify-content-between">
                                                <span>제품명 검색</span>
                                                <i class="uil uil-angle-down"></i>
                                            </div>
                                            <div class="hide-list">
                                                <div class="search">
                                                    <input
                                                            type="text"
                                                            class="form-control top-search"
                                                            id="pdtNmForSearch"
                                                            placeholder="제품명을 입력해주세요"
                                                            aria-label="제품명 검색"
                                                    />
                                                    <ul class="options"></ul>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- 점검자 라벨과 검색 필드 -->
                                    <div class="col-12 col-md-4">
                                        <label for="pdtSellSttsNmForSearch" class="form-label">판매상태</label>
                                        <div class="wrapper" data-autocomplete="pdtSellSttsNm">
                                            <div class="search-btn top-search form-control d-flex align-items-center justify-content-between">
                                                <span>판매상태 검색</span>
                                                <i class="uil uil-angle-down"></i>
                                            </div>
                                            <div class="hide-list">
                                                <div class="search">
                                                    <input
                                                            type="text"
                                                            class="form-control top-search"
                                                            id="pdtSellSttsNmForSearch"
                                                            placeholder="판매상태를 입력해주세요"
                                                            aria-label="판매상태 검색"
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
                        <div class="button-box"
                             style="display: flex; justify-content: space-between; align-items: center;">
                            <span class="ms-3" style="font: 350 20px Noto Sans KR;">총 <span class="product_count"
                                                                                            style="color: #0035BE"></span>개</span>
                            <div class="my-0">
                                <button type="button" id="addRowBtn" class="btn btn-light me-3"
                                        onclick="onProductAddRow()" data-bs-toggle="modal"
                                        data-bs-target="#productManagementModal">추가
                                </button>
                                <button type="button" class="btn btn-light" onclick="onProductDeleteRow()">삭제</button>
                            </div>
                        </div>
                        <div>
                            <div id="myGrid" style="height: 70vh; width:100%" class="ag-theme-quartz mb-3"></div>
                        </div>
                    </div>
                </div>
            </div>
            <%-- middle box end--%>
        </div>
    </main>
</div>

<!-- 제품 등록/수정 Modal -->
<div class="modal fade" id="productManagementModal" tabindex="-1" data-bs-keyboard="false"
     aria-labelledby="productManagementModalLabel" data-bs-backdrop="static">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content p-3">
            <div class="modal-header">
                <h1 class="modal-title" id="staticBackdropLabel"></h1>
                <button type="button" class="btn-close button-close" data-bs-dismiss="modal"
                        aria-label="Close"></button>
            </div>


            <div class="modal-body">
                <div class="row mx-0 mb-4 justify-content-between">
                    <div class="productName_input_area col-md-5 row m-0 p-0">
                        <label for="productName" class="col-12 py-2 mb-2 d-flex align-items-center">제품명</label>
                        <input type="text" id="productName" class="ps-3 py-2" placeholder="제품명 입력" name="pdtNm"
                               required>
                    </div>
                    <div class="brandName_input_area col-md-6 row p-0 m-0">
                        <label for="brandName" class="py-2 mb-2 d-flex align-items-center">브랜드</label>
                        <div class="wrapper p-0" data-autocomplete="modalBrandNm">
                            <!-- Search Button -->
                            <div class="search-btn top-search py-2">
                                <span class="ps-3" id="brandName">브랜드 선택</span>
                                <i class="fa-solid fa-angle-down me-4 fa-lg"></i>
                            </div>

                            <!-- 검색 입력 및 옵션이 포함된 숨겨진 목록 -->
                            <div class="hide-list border border-1">
                                <div class="search">
                                    <div class="search_input_area d-flex align-items-center justify-content-between py-2 px-3 border border-1">
                                        <input type="text" class="top-search" placeholder="브랜드 입력"/>
                                    </div>
                                    <ul class="options"></ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="row mx-0 mb-4 justify-content-between">
                    <div class="expiration_input_area col-md-5 row m-0 p-0">
                        <label for="expiration" class="col-12 py-2 mb-2 d-flex align-items-center">소비기한(일수)</label>
                        <input type="number" class="ps-3 py-2" id="expiration" placeholder="소비기한 입력" name="expDaynum"
                               required>
                    </div>
                    <div class="price_input_area p-0 col-md-6 m-0 row">
                        <label for="price" class="py-2 col-12 mb-2 d-flex align-items-center">가격(원)</label>
                        <input type="text" id="price" class="ps-3 py-2" placeholder="가격 입력" name="pdtPrice" required>
                    </div>
                </div>
                <div class="productStatus_checkbox_area d-flex row">
                    <div class="label_text col-12 mb-3 pt-2 d-flex align-items-center">판매상태</div>
                    <div class="radio_input_area">
                        <label for="for_sale">판매중</label><input type="radio" name="pdtSellSttsCd" class="ms-1 me-3"
                                                                id="for_sale" value="판매중" checked>
                        <label for="out_of_stack">품절</label><input type="radio" name="pdtSellSttsCd" class="ms-1 me-3"
                                                                   id="out_of_stack" value="품절">
                        <label for="not_for_sale">판매 중지</label><input type="radio" name="pdtSellSttsCd"
                                                                      class="ms-1 me-3" id="not_for_sale" value="판매 중지">
                        <label for="restock_in_progress">재고확보중</label><input type="radio" name="pdtSellSttsCd"
                                                                             class="ms-1 me-3" id="restock_in_progress"
                                                                             value="재고확보중">
                    </div>
                </div>
            </div>
            <div class="modal-footer mt-2">
                <button type="button" class="btn-cancel button-close" data-bs-dismiss="modal">취소</button>
                <button type="button" class="btn-register" id="submit"></button>
            </div>
            <input type="hidden">
        </div>
    </div>
</div>


<!-- 본문 끝 -->

<!-- 해당 JSP의 SCRIPT 경로 -->
<script src="/resources/js/master/product_manage/product_list.js"></script>
<script src="/resources/js/master/product_manage/product_filter.js"></script>
<script src="/resources/js/master/product_manage/product_modal.js"></script>

</body>
</html>