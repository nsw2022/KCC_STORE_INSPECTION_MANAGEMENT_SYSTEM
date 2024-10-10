<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
 <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>점검 관리 - 가맹점 점검 일정 조회</title>
        <!-- Bootstrap CSS -->
        <link
            href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css"
            rel="stylesheet">
        <!-- Font Awesome -->
        <link
            rel="stylesheet"
            href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css">
        <link rel="preconnect" href="https://fonts.googleapis.com"/>
        <link
            rel="preconnect"
            href="https://fonts.gstatic.com"
            crossorigin="crossorigin"/>
        <link
            href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@100..900&display=swap"
            rel="stylesheet"/>
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link
            rel="preconnect"
            href="https://fonts.gstatic.com"
            crossorigin="crossorigin">
        <link
            href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap"
            rel="stylesheet">
        <link
            rel="stylesheet"
            href="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css"/>
        <link
            rel='stylesheet'
            href='https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
            integrity='sha512-iecdLmaskl7CVkqkXNQ/ZH/XLlvWZOJyj7Yy7tcenmpD1ypASozpmT/E0iPtmFIB46ZmdtAc9eNBvH0H/ZpiBw=='
            crossorigin='anonymous'/>
        <!-- Iconscout Link For Icons  해더에 넣기 -->
        <link
        rel="stylesheet"
        href="https://unicons.iconscout.com/release/v4.0.0/css/line.css"
        />
        <link rel="stylesheet" href="/resources/css/qsc/store_inspection_schedule/store_inspection_schedule.css">
        <script src='https://cdnjs.cloudflare.com/ajax/libs/gsap/3.11.5/gsap.min.js'></script>
        <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js" integrity="sha512-v2CJ7UaYy4JwqLDIrZUI/4hqeoQieOmAZNXBeQyjo21dadnwR+8ZaIJVT8EE2iyI61OV8e6M8PP2/4hpQINQ/g==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
</head>
<body>

<jsp:include page="../../sidebar/sidebar.jsp"></jsp:include>

 <!-- 본문 -->
        <div class="page-wrapper2">
            <main class="page-content">
                <div class="container-fluid">
                    <!-- 검색 영억 -->
                    <div
                        class="row container-header d-flex align-items-center justify-content-between mx-0">
                        <div class="col-xl-4 md-4 mx-0 inspector_area d-flex align-items-center row p-0">
                            <div class="inspector_text col-md-5 pe-0 mb-3">점검자 검색:</div>
                            <div
                                class="input_area border border-1 d-flex flex-column justify-content-between align-items-center col-md-7 mb-3"
                                data-autocomplete="inspector">
                                <div class="search-btn top-search d-flex">
                                    <span>선택해주세요.</span>
                                    <i class="uil uil-angle-down"></i>
                                </div>
                                <!-- 검색 입력 및 옵션이 포함된 숨겨진 목록 -->
                                <div class="hide-list border border-1">
                                    <div class="search">
                                      <div class="input_area d-flex justify-content-between align-items-center border border-1">
                                        <input type="text" class="px-3 py-2 top-search border border-1" placeholder="점검자 검색"/>
                                        <i class="fa-solid fa-magnifying-glass"></i>
                                      </div>
                                      <ul class="options my-0"></ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-xl-4 md-4 mx-0 inspection_type_area d-flex align-items-center row p-0">
                            <div class="inspection_type_text col-md-5 pe-0 mb-3">점검 유형 선택:</div>
                            <div
                                class="input_area border border-1 d-flex flex-column justify-content-between align-items-center col-md-7 mb-3"
                                data-autocomplete="inspection_type">
                                <div class="search-btn top-search d-flex">
                                    <span>선택해주세요.</span>
                                    <i class="uil uil-angle-down"></i>
                                </div>
                                <!-- 검색 입력 및 옵션이 포함된 숨겨진 목록 -->
                                <div class="hide-list border border-1">
                                    <div class="search">
                                      <div class="input_area d-flex justify-content-between align-items-center border border-1">
                                        <input type="text" class="px-3 py-2 top-search border border-1" placeholder="점검 유형 검색"/>
                                        <i class="fa-solid fa-magnifying-glass"></i>
                                      </div>
                                      <ul class="options my-0"></ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div
                        class="col-xl-3 select_date_btn_area d-flex align-items-center row p-0 mb-3 mx-0">
                            <button class="prev col-2 px-0" onclick="changeMonth(-1)">
                                <i class="fa-solid fa-chevron-left"></i>
                            </button>
                            <div id="currentDate" class="date_text d-flex align-items-center justify-content-center col-8"></div>
                            <button class="next col-2 px-0" onclick="changeMonth(1)">
                                <i class="fa-solid fa-chevron-right"></i>
                            </button>
                        </div>
                        
                    </div>
                    

                    <!-- 캘린더 -->
                    <div id="wrapper" class="container-fluid mt-2 mb-0 p-0"></div>
                    
                    <!-- 가맹점 점검체크리스트 목록 Modal -->
						<div class="modal fade" id="storeChecklistModal" tabindex="-1" aria-labelledby="storeChecklistModalLabel" aria-hidden="true">
							<div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
								<div class="modal-content">
									<div class="modal-header px-4 py-3">
										<div class="modal-title modal_store_name" id="storeChecklistModalLabel"></div>
										<div class="modal_inspector_area">
											<div class="modal_inspector_name px-3 py-2 border border-1"></div>
										</div>
										<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
									</div>
									<div class="modal-body py-0 mb-3">
										<div class="checklist_item_area d-flex align-items-center">
											<div class="checklist_number">01</div>
											<div class="checklist_item me-5">KCC 크라상 위생 점검 체크리스트</div>
										</div>
										<div class="checklist_item_area d-flex align-items-center">
											<div class="checklist_number">02</div>
											<div class="checklist_item me-5">KCC 크라상 제품 점검 체크리스트</div>
										</div>
										<div class="checklist_item_area d-flex align-items-center">
											<div class="checklist_number">03</div>
											<div class="checklist_item me-5">KCC 크라상 정기 점검 체크리스트</div>
										</div>
										<div class="checklist_item_area d-flex align-items-center">
											<div class="checklist_number">04</div>
											<div class="checklist_item me-5">KCC 크라상 비정기 점검 체크리스트</div>
										</div>
										<div class="checklist_item_area d-flex align-items-center">
											<div class="checklist_number">05</div>
											<div class="checklist_item me-5">KCC 크라상 기획 점검 체크리스트</div>
										</div>
										<div class="checklist_item_area d-flex align-items-center">
											<div class="checklist_number">06</div>
											<div class="checklist_item me-5">KCC 크라상 위생 점검 체크리스트</div>
										</div>
										<div class="checklist_item_area d-flex align-items-center">
											<div class="checklist_number">07</div>
											<div class="checklist_item me-5">KCC 크라상 위생 점검 체크리스트</div>
										</div>
									</div>
								</div>
							</div>
						</div>

                </div>
            </main>
        </div>

        <!-- 본문 끝 -->
<script src="/resources/js/qsc/store_inspection_schedule/store_inspection_schedule.js"></script>

</body>
</html>