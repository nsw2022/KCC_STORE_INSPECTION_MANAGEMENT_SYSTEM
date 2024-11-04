<%@ page language="java" contentType="text/html; charset=UTF-8"
         pageEncoding="UTF-8"%>
<html>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>dashboard</title>
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
            href="/resources/css/home/dashboard/dashboard.css"
    />
    <script
            src="https://cdnjs.cloudflare.com/ajax/libs/Sortable/1.14.0/Sortable.min.js"
            integrity="sha512-zYXldzJsDrNKV+odAwFYiDXV2Cy37cwizT+NkuiPGsa9X1dOz04eHvUWVuxaJ299GvcJT31ug2zO4itXBjFx4w=="
            crossorigin="anonymous"
            referrerpolicy="no-referrer"
    ></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.11.5/gsap.min.js"></script>
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/apexcharts"></script>
</head>
<body>

<div class="sidebar">
  <jsp:include page="../../sidebar/sidebar.jsp" />
</div>

<div class="page-wrapper2">
    <main class="page-content">
            <div class="container">
                <div class="header">
                    <div class="d-flex justify-content-end">
                        <button class="btn btn-primary" style="width: 120px; border-radius: 8px" data-bs-toggle="modal" data-bs-target="#staticBackdrop">편집</button>
                    </div>
                </div>
                <div id="group" class="box row justify-content-between">
                    <div class="item col-lg-4 p-1 mb-3">
                        <div class="item-content m-1 p-3">
                            <div class="mb-3 title">심사 진행현황</div>
                            <div id="chart1"></div>
                        </div>
                    </div>
                    <div class="item col-lg-4 p-1 mb-3">
                        <div class="item-content m-1 p-3">
                            <div class="mb-3 title">개선조치 진행현황</div>
                            <div id="chart2"></div>
                        </div>
                    </div>
                    <div class="item col-lg-4 p-1 mb-3 ">
                        <div class="item-content m-1 p-3">
                            <div class="mb-3 title">심사 평균점수 비교</div>
                            <div id="chart3"></div>
                        </div>
                    </div>
                    <div class="item col-lg-4 p-1 mb-3">
                        <div class="item-content m-1 p-3">
                            <div class="mb-3 title">등급별 비율</div>
                            <div id="chart4"></div>
                        </div>
                    </div>
                    <div class="item col-lg-4 p-1 mb-3">
                        <div class="item-content m-1 p-3">
                            <div class="title-box h-20 d-flex justify-content-between">
                                <div style="width: 100px">
                                    <div class="title">과태료</div>
                                    <span style="font: 300 12px 'Noto Sans KR';">(단위 : 만원)</span>
                                </div>
                                <div>
                                    <div style="font: 300 13px 'Noto Sans KR';">총 과태료 : <span class="total-penalty" style="font: 500 13px 'Noto Sans KR';">0</span>원</div>
                                    <div style="font: 300 13px 'Noto Sans KR';">매장당 평균 : <span class="avg-penalty" style="font: 500 13px 'Noto Sans KR';">0</span>원</div>
                                </div>
                            </div>
                            <div id="chart5"></div>
                        </div>
                    </div>


                    <div class="item col-lg-4 p-1 mb-3 ">
                        <div class="item-content m-1 p-3">
                            <div class="title-box h-20 d-flex justify-content-between">
                                <div style="width: 100px">
                                    <div class="title">영업정지</div>
                                    <span style="font: 300 12px 'Noto Sans KR';">(단위 : 일)</span>
                                </div>
                                <div>
                                    <div style="font: 300 13px 'Noto Sans KR';">총 영업정지일 : <span style="font: 500 13px 'Noto Sans KR';">0</span>일</div>
                                    <div style="font: 300 13px 'Noto Sans KR';">매장당 평균 : <span style="font: 500 13px 'Noto Sans KR';">0</span>일</div>
                                </div>
                            </div>
                            <div id="chart6"></div>
                        </div>
                    </div>
                    <div class="item col-lg-8 p-1 mb-3">
                        <div class="item-content m-1 p-3" >
                            <div class="mb-3 title">월별 평균 점수</div>
                            <div id="chart7" ></div>
                        </div>
                    </div>
                    <div class="item col-lg-4 p-1 mb-3">
                        <div class="item-content m-1 p-3">개선조치 진행현황</div>
                    </div>
                    <div class="item col-lg-12 p-1 mb-3">
                        <div class="item-content m-1 p-3">등급별 비율</div>
                    </div>

                </div>
            </div>
    </main>
</div>
<!-- Modal -->
<div class="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content p-4">
                <h1 class="modal-title fs-5 mb-3" id="staticBackdropLabel" style="font: 800 20px 'Noto Sans KR'">그래프 편집</h1>
            <div class="modal-body">
                <div class="mb-3" style="font: 600 17px 'Noto Sans KR'">
                    <input class="form-check-input" type="checkbox" checked> <span class="ms-2">심사 진행 현황</span>
                </div>
                <div class="mb-3" style="font: 600 17px 'Noto Sans KR'">
                    <input class="form-check-input" type="checkbox"checked> <span class="ms-2">개선조치 진행현황</span>
                </div>
                <div class="mb-3" style="font: 600 17px 'Noto Sans KR'">
                    <input class="form-check-input" type="checkbox" checked> <span class="ms-2">심사 평균점수 비교</span>
                </div>
                <div class="mb-3" style="font: 600 17px 'Noto Sans KR'">
                    <input class="form-check-input" type="checkbox" checked> <span class="ms-2">등급별 비율</span>
                </div>
                <div class="mb-3" style="font: 600 17px 'Noto Sans KR'">
                    <input class="form-check-input" type="checkbox" checked> <span class="ms-2">과태료</span>
                </div>
                <div class="mb-3" style="font: 600 17px 'Noto Sans KR'">
                    <input class="form-check-input" type="checkbox" checked> <span class="ms-2">영업정지</span>
                </div>
                <div class="mb-3" style="font: 600 17px 'Noto Sans KR'">
                    <input class="form-check-input" type="checkbox" checked> <span class="ms-2">대분류별 적합/부적합 비율</span>
                </div>
                <div class="mb-3" style="font: 600 17px 'Noto Sans KR'">
                    <input class="form-check-input" type="checkbox" checked> <span class="ms-2">최하등급 TOP5</span>
                </div>
                <div class="mb-3" style="font: 600 17px 'Noto Sans KR'">
                    <input class="form-check-input" type="checkbox" checked> <span class="ms-2">부적합 매장 TOP10</span>
                </div>
                <div class="mb-3" style="font: 600 17px 'Noto Sans KR'">
                    <input class="form-check-input" type="checkbox" checked> <span class="ms-2">부적합 항목 TOP5</span>
                </div>
                <div class="mb-3" style="font: 600 17px 'Noto Sans KR'">
                    <input class="form-check-input" type="checkbox" checked> <span class="ms-2">지역별 평균 점수</span>
                </div>

            </div>
            <div class="d-flex justify-content-between mt-3">
                <button type="button" style="width: 50%; height: 50px; border-radius: 8px" class="btn btn-secondary m-1" data-bs-dismiss="modal">취소</button>
                <button type="button" style="width: 50%; height: 50px; border-radius: 8px" class="btn btn-primary m-1" data-bs-dismiss="modal">저장</button>
            </div>
        </div>
    </div>
</div>

<script defer
        type="application/javascript"
        src="../../../../resources/js/home/dashboard/dashboard.js"
></script>
</body>
</html>
