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
      href="/resources/css/checklist/list/checklist_list.css"
    />
    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.11.5/gsap.min.js"></script>
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/ag-grid-community/dist/ag-grid-community.min.js"></script>
  </head>
  <body>
  <div class="sidebar">
    <jsp:include page="../../sidebar/sidebar.jsp" />
  </div>

    <div class="page-wrapper2">
      <main class="page-content">
        <div class="container content">
          <%-- top box start--%>
          <div class="row top-box mb-3">
            <div class="col">
              <div class="top-content">
                <div class="button-box" style="display: flex; justify-content: space-between; align-items: center;">
                  <span class="m-3" style="font: 350 20px Noto Sans KR;">체크리스트 관리</span>
                  <div class="my-3">
                    <button type="button" class="btn btn-light me-3 select-btn" onclick="onAddRow()">조회</button>
                    <button type="button" class="btn btn-light me-3 init-btn" onclick="onDeleteRow()">초기화</button>
                  </div>
                </div>
                <div class="container">
                  <div class="row first-input-box mb-3">
                    <div class="col-12 col-lg-3 d-flex align-items-center">
                      <label class="col-form-label me-2" style="min-width: 40px;">브랜드</label>
                      <input type="text" class="form-control" placeholder="브랜드" list="useBrandOptions">
                      <datalist id="useBrandOptions">
                        <option value="-전체-">
                        <option value="KCC 베이커리">
                        <option value="KCC 카페">
                      </datalist>
                    </div>
                    <div class="col-12 col-lg-3 d-flex align-items-center">
                      <label class="col-form-label me-2" style="min-width: 80px;">체크리스트명</label>
                      <input type="text" class="form-control" placeholder="체크리스트명" list="useChecklistOptions">
                      <datalist id="useChecklistOptions">
                        <option value="-전체-">
                        <option value="2024 정기 점검 체크리스트">
                        <option value="2024 긴급 점검 체크리스트">
                      </datalist>
                    </div>
                    <div class="col-12 col-lg-3 d-flex align-items-center">
                      <label class="col-form-label me-2" style="min-width: 100px; font: 500 12px Noto Sans KR;">마스터체크리스트</label>
                      <input type="text" class="form-control" placeholder="마스터체크리스트" list="useMasterChecklistOptions">
                      <datalist id="useMasterChecklistOptions">
                        <option value="-전체-">
                        <option value="2023 정기 점검 체크리스트">
                        <option value="2023 긴급 점검 체크리스트">
                      </datalist>
                    </div>
                    <div class="col-12 col-lg-3 d-flex align-items-center">
                      <label class="col-form-label me-2" style="min-width: 50px;">점검유형</label>
                      <input type="text" class="form-control" placeholder="점검유형" list="useInspectionTypeOptions">
                      <datalist id="useInspectionTypeOptions">
                        <option value="-전체-">
                        <option value="정기 점검">
                        <option value="기획 점검">
                        <option value="제품 점검">
                        <option value="긴급 점검">
                      </datalist>
                    </div>
                  </div>

                  <div class="row second-input-box mb-3">
                    <div class="col-12 col-lg-3 d-flex align-items-center">
                      <label class="col-form-label me-2" style="min-width: 50px;">등록년월</label>
                      <input type="date" class="form-control" placeholder="2024-10-07">
                    </div>
                    <div class="col-12 col-lg-3 d-flex align-items-center">
                      <label class="col-form-label me-2" style="min-width: 60px;">마스터여부</label>
                      <input type="text" class="form-control" placeholder="마스터여부 선택" list="useMasterChecklistCheckOptions">
                      <datalist id="useMasterChecklistCheckOptions">
                        <option value="-전체-">
                      </datalist>
                    </div>
                    <div class="col-12 col-lg-3 d-flex align-items-center">
                      <label class="col-form-label me-2" style="min-width: 50px;">사용여부</label>
                      <input type="text" class="form-control" placeholder="사용여부 선택" list="useStatusOptions" id="useStatusInput">
                      <datalist id="useStatusOptions">
                        <option value="-전체-">
                        <option value="Y">
                        <option value="N">
                      </datalist>
                    </div>
                    <div class="col-12 col-lg-3 d-flex align-items-center" >
                    </div>
                  </div>
                </div>


              </div>
            </div>
          </div>
          <%-- top box end--%>

          <%-- middle box start--%>
          <div class="row middle-box mb-3">
            <div class="col">
              <div class="middle-content">
                <div class="button-box" style="display: flex; justify-content: space-between; align-items: center;">
                  <span class="m-3" style="font: 350 20px Noto Sans KR;">총 <span class="checklist_count" style="color: #0035BE"></span>개</span>
                  <div class="my-3">
                    <button type="button" class="btn btn-light me-3" onclick="onAddRow()">추가</button>
                    <button type="button" class="btn btn-light me-3" onclick="onDeleteRow()">삭제</button>
                  </div>
                </div>
                <div>
                  <div id="myGrid" style="height: 60vh; width:100%" class="ag-theme-quartz mb-3"></div>
                </div>
              </div>
            </div>
          </div>
          <%-- middle box end--%>
            <%-- bottom box start--%>
            <div class="row top-box mb-3">
              <div class="col">
                <div class="top-content">
                  <div class="button-box" style="display: flex; justify-content: space-between; align-items: center;">
                    <span class="m-3" style="font: 350 20px Noto Sans KR;">체크리스트 상세</span>
                    <div class="my-3">
                      <button type="button" class="btn btn-primaty me-3 save-btn" onclick="onAddRow()">저장</button>
                    </div>
                  </div>
                  <div class="container">
                    <div class="row first-input-box mb-3">
                      <div class="col-12 col-lg-3 d-flex align-items-center">
                        <label class="col-form-label me-2" style="min-width: 40px;">브랜드</label>
                        <input type="text" class="form-control" placeholder="브랜드" list="useBrandOptions">
                      </div>
                      <div class="col-12 col-lg-3 d-flex align-items-center">
                        <label class="col-form-label me-2" style="min-width: 80px;">체크리스트명</label>
                        <input type="text" class="form-control" placeholder="체크리스트명">
                      </div>
                      <div class="col-12 col-lg-3 d-flex align-items-center">
                        <label class="col-form-label me-2" style="min-width: 100px; font: 500 12px Noto Sans KR;">마스터체크리스트</label>
                        <input type="text" class="form-control" placeholder="마스터체크리스트" list="useMasterChecklistOptions">
                      </div>
                      <div class="col-12 col-lg-3 d-flex align-items-center">
                        <label class="col-form-label me-2" style="min-width: 50px;">점검유형</label>
                        <input type="text" class="form-control" placeholder="점검유형" list="useInspectionTypeOptions">
                      </div>
                    </div>

                    <div class="row second-input-box mb-3">
                      <div class="col-12 col-lg-3 d-flex align-items-center">
                        <label class="col-form-label me-2" style="min-width: 50px;">등록년월</label>
                        <input type="date" class="form-control" placeholder="2024-10-07">
                      </div>
                      <div class="col-12 col-lg-3 d-flex align-items-center">
                        <label class="col-form-label me-2" style="min-width: 60px;">마스터여부</label>
                        <input type="checkbox" >
                      </div>
                      <div class="col-12 col-lg-3 d-flex align-items-center">
                        <label class="col-form-label me-2" style="min-width: 50px;">사용여부</label>
                        <input type="checkbox">
                      </div>
                      <div class="col-12 col-md-3" style="height: 0px"></div>
                    </div>
                  </div>


                </div>
              </div>
            </div>
            <%-- bottom box end--%>
        </div>
      </main>
    </div>

    <script
      type="application/javascript"
      src="../../../../resources/js/checklist/list/checklist.js"
    ></script>
  </body>
</html>
