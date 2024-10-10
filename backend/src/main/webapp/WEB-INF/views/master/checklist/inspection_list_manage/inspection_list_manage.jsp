<%@ page language="java" contentType="text/html; charset=UTF-8"
         pageEncoding="UTF-8" %>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>checklist_list</title>

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
          href="/resources/css/master/checklist/inspection_list_manage/inspection_list_manage.css"
  />
  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.11.5/gsap.min.js"></script>
  <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/ag-grid-community/dist/ag-grid-community.min.js"></script>



</head>
<body>
<div class="sidebar">
  <jsp:include page="../../../sidebar/sidebar.jsp" />
</div>
<div class="page-wrapper2">
  <main class="page-content">
    <div class="container content">
      <%-- top box start--%>
      <div class="row top-box mb-3">
        <div class="col">
          <div class="top-content">
            <div class="button-box" style="display: flex; justify-content: space-between; align-items: center;">
              <span class="m-3" style="font: 350 20px Noto Sans KR;">점검 항목 관리</span>
              <div class="my-3">
                <button type="button" class="btn btn-light me-3 select-btn" onclick="onAddRow()">조회</button>
                <button type="button" class="btn btn-light me-3 init-btn" onclick="onDeleteRow()">초기화</button>
              </div>
            </div>
            <div class="container mt-3">
              <div class="row first-input-box mb-3">
                <div class="col-12 d-flex align-items-center justify-content-between p-0">
                  <label class="col-form-label" style="width: 100px">마스터</br>체크리스트</label>
                  <input type="text" class="form-control" placeholder="마스터 체크리스트" list="useChecklistOptions">
                  <datalist id="useChecklistOptions">
                    <option value="2024 위생 점검 체크리스트">
                  </datalist>
                </div>
              </div>
              <div class="row first-input-box mb-3">
                <div class="col-12 d-flex align-items-center justify-content-between p-0">
                  <label class="col-form-label" style="width: 100px">모듈</label>
                  <input type="text" class="form-control" placeholder="모듈">
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <%-- top box end--%>

      <%-- middle box start--%>
        <div class="row middle-row d-flex justify-content-between">
          <div class="col-lg-6 col-12 mb-3 accordion-box">
            <div class="accordion">
              <div class="accordion-item">
                <h2 class="accordion-header">
                  <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                    대분류 관리
                  </button>
                </h2>
                <div id="collapseOne" class="accordion-collapse collapse show" data-bs-parent="#accordionExample">
                  <div class="accordion-body">
                    <div class="button-box d-flex justify-content-end">
                      <div class="my-2 d-flex justify-content-center">
                        <button type="button" class="btn btn-light m-1" onclick="onAddRow()">추가</button>
                        <button type="button" class="btn btn-light m-1" onclick="onDeleteRow()">삭제</button>
                      </div>
                    </div>
                    <div>
                      <div id="categoryGrid" style="height: 324px; width:100%" class="ag-theme-quartz mb-2"></div>
                    </div>
                    <div class="update-box border border-light-subtle mb-2">
                      <div class="title-box">
                        <span class="m-3" style="font: 400 15px Noto Sans KR;">대분류 등록 및 수정</span>
                        <div class="my-3">
                          <button type="button" class="btn btn-primary me-3">저장</button>
                        </div>
                      </div>
                      <div class="container">
                        <div class="update-box-content">
                          <div class="row row-cols-3 first-input-box mb-3">
                            <div class="col-12 col-lg-6 d-flex align-items-center mb-2">
                              <label class="col-form-label me-2" style="min-width: 50px;">대분류명</label>
                              <input type="text" class="form-control" placeholder="대분류명">
                            </div>
                            <div class="col-12 col-lg-3 d-flex align-items-center mb-2">
                              <label class="col-form-label me-2" style="min-width: 50px;">기준점수</label>
                              <input type="text" class="form-control" placeholder="0">
                            </div>
                            <div class="col-12 col-lg-3 d-flex align-items-center mb-2">
                              <label class="col-form-label me-2" style="min-width: 50px;">사용여부</label>
                              <input type="checkbox" class="form-check-label" checked>
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

          <div class="col-lg-6 col-12 mb-3 accordion-box">
            <div class="accordion">
              <div class="accordion-item">
                <h2 class="accordion-header">
                  <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                    중분류 관리
                  </button>
                </h2>
                <div id="collapseTwo" class="accordion-collapse collapse show" data-bs-parent="#accordionExample">
                  <div class="accordion-body">
                    <div class="button-box d-flex justify-content-end">
                      <div class="my-2 d-flex justify-content-center">
                        <button type="button" class="btn btn-light m-1" onclick="onAddRow()">추가</button>
                        <button type="button" class="btn btn-light m-1" onclick="onDeleteRow()">삭제</button>
                      </div>
                    </div>
                    <div>
                      <div id="subCategoryGrid" style="height: 324px; width:100%" class="ag-theme-quartz mb-2"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="col-lg-6 col-12 mb-3 accordion-box">
            <div class="accordion">
              <div class="accordion-item">
                <h2 class="accordion-header">
                  <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
                    평가항목관리
                  </button>
                </h2>
                <div id="collapseThree" class="accordion-collapse collapse show">
                  <div class="accordion-body">
                    <strong>This is the third item's accordion body.</strong> It is hidden by default, until the collapse plugin adds the appropriate classes that we use to style each element.
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="col-lg-6 col-12 mb-3 accordion-box">
            <div class="accordion">
              <div class="accordion-item">
                <h2 class="accordion-header">
                  <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseFour" aria-expanded="false" aria-controls="collapseFour">
                    선택지관리
                  </button>
                </h2>
                <div id="collapseFour" class="accordion-collapse collapse show">
                  <div class="accordion-body">
                    <strong>This is the fourth item's accordion body.</strong> It is hidden by default, until the collapse plugin adds the appropriate classes that we use to style each element.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      <%-- middle box End--%>

    </div>
  </main>
</div>



<script defer
        type="application/javascript"
        src="../../../../../resources/js/master/checklist/inspection_list_manage/category.js"
></script>
<script defer
        type="application/javascript"
        src="../../../../../resources/js/master/checklist/inspection_list_manage/sub_category.js"
></script>
</body>
</html>
