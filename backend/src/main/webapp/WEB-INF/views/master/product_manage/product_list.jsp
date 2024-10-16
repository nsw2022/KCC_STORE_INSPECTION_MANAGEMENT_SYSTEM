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
        <div class="content">

            <!-- 본문 -->
            <div class="row middle-box mb-3">
                <div class="col">
                    <div class="middle-content p-5">
                        <div class="header_area mb-5 d-flex align-items-center justify-content-between row mx-0">
                            <div class="header_text mb-4">제품 관리</div>
                            <div class="header_input_area border border-1 px-0 d-flex align-items-center justify-content-between col-6">
                                <!-- 자동 완성 Wrapper -->
                                <div class="wrapper" data-autocomplete="inspector">
                                    <!-- Search Button -->
                                    <div class="search-btn top-search">
                                        <span class="ms-4">찾으시려는 제품명을 선택해주세요</span>
                                        <i class="fa-solid fa-angle-down me-4 fa-lg"></i>
                                    </div>

                                    <!-- 검색 입력 및 옵션이 포함된 숨겨진 목록 -->
                                    <div class="hide-list mt-2 border border-1">
                                        <div class="search">
                                            <div class="search_input_area d-flex align-items-center justify-content-between py-2 px-3 border border-1">
                                                <input type="text" class="top-search" placeholder="제품명을 입력해주세요."/>
                                                <i class="fa-solid fa-magnifying-glass fa-lg"></i>
                                            </div>
                                            <ul class="options"></ul>
                                        </div>
                                    </div>
                                </div>

                            </div>
                            <div class="header_btn_area d-flex align-items-center justify-content-end p-0 col-4">
                                <button type="button"
                                        class="btn btn-light me-3 d-flex justify-content-center align-items-center p-0"
                                        onclick="onAddRow()">추가
                                </button>
                                <button type="button"
                                        class="btn btn-light d-flex justify-content-center align-items-center p-0"
                                        onclick="onDeleteRow()">삭제
                                </button>
                            </div>
                        </div>

                        <div>
                            <div id="myGrid" style="height: 60vh; width:100%" class="ag-theme-quartz"></div>
                        </div>
                    </div>
                </div>
            </div>
            <!-- 본문 끝 -->

        </div>
    </main>
</div>

<!-- 제품 등록/수정 Modal -->
<div class="modal fade" id="productManagementModal" tabindex="-1" data-bs-keyboard="false"
     aria-labelledby="productManagementModalLabel" aria-hidden="true" data-bs-backdrop="static">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content p-3">
            <div class="modal-header">
                <h1 class="modal-title" id="staticBackdropLabel">제품 등록/수정</h1>
            </div>
            <div class="modal-body">
                <div class="row mx-0 mb-4 justify-content-between">
                    <div class="productName_input_area col-md-5 row m-0 p-0">
                        <label for="productName" class="col-12 py-2 mb-3">제품명</label>
                        <input type="text" id="productName" class="ps-3 py-2" placeholder="제품명 입력">
                    </div>
                    <div class="brandName_input_area col-md-6 row p-0 m-0">
                        <label for="brandName" class="py-2 mb-3">브랜드</label>
                        <div class="wrapper p-0" data-autocomplete="store">
                            <!-- Search Button -->
                            <div class="search-btn top-search py-2">
                                <span class="ps-3">브랜드 선택</span>
                                <i class="fa-solid fa-angle-down me-4 fa-lg"></i>
                            </div>

                            <!-- 검색 입력 및 옵션이 포함된 숨겨진 목록 -->
                            <div class="hide-list border border-1">
                                <div class="search">
                                    <div class="search_input_area d-flex align-items-center justify-content-between py-2 px-3 border border-1">
                                        <input type="text" class="top-search" placeholder="브랜드 입력"/>
                                        <i class="fa-solid fa-magnifying-glass fa-lg"></i>
                                    </div>
                                    <ul class="options"></ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="row mx-0 mb-4 justify-content-between">
                    <div class="expiration_input_area col-md-5 row m-0 p-0">
                        <label for="expiration" class="col-12 py-2 mb-3">소비기한(일수)</label>
                        <input type="number" class="ps-3 py-2" id="expiration" placeholder="소비기한 입력">
                    </div>
                    <div class="price_input_area p-0 col-md-6 m-0 row">
                        <label for="price" class="py-2 col-12 mb-3">가격(원)</label>
                        <input type="number" id="price" class="ps-3 py-2" placeholder="가격 입력">
                    </div>
                </div>
                <div class="productStatus_checkbox_area d-flex row">
                    <div class="label_text col-12 mb-3 pt-2">판매상태</div>
                    <div class="radio_input_area">
                        <label for="for_sale">판매중</label><input type="radio" name="pdtSellSttsCd" class="ms-1 me-3"
                                                                id="for_sale">
                        <label for="out_of_stack">품절</label><input type="radio" name="pdtSellSttsCd" class="ms-1 me-3"
                                                                   id="out_of_stack">
                        <label for="pre_order">예약 판매</label><input type="radio" name="pdtSellSttsCd" class="ms-1 me-3"
                                                                   id="pre_order">
                        <label for="not_for_sale">판매 중지</label><input type="radio" name="pdtSellSttsCd"
                                                                      class="ms-1 me-3" id="not_for_sale">
                        <label for="restock_in_progress">재고확보중</label><input type="radio" name="pdtSellSttsCd"
                                                                             class="ms-1 me-3" id="restock_in_progress">
                    </div>
                </div>
            </div>
            <div class="modal-footer mt-2">
                <button type="button" class="btn-cancel" data-bs-dismiss="modal">등록 취소</button>
                <button type="button" class="btn-register">등록 완료</button>
            </div>
        </div>
    </div>
</div>


<!-- 본문 끝 -->

<!-- 해당 JSP의 SCRIPT 경로 -->
<script src="/resources/js/master/product_manage/product_list.js"></script>

</body>
</html>