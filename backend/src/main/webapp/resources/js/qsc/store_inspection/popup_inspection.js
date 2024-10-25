// 날짜 형식 포맷 함수 (YYYY.MM.DD)
function formatDate(dateStr) {
  // dateStr이 'YYYYMMDD' 형식인지 확인
  if (!dateStr || dateStr.length !== 8) return dateStr; // 형식이 올바르지 않으면 그대로 반환
  const year = dateStr.substring(0, 4);
  const month = dateStr.substring(4, 6);
  const day = dateStr.substring(6, 8);
  return `${year}.${month}.${day}`; // 템플릿 리터럴 사용하여 'YYYY.MM.DD' 형식으로 변경
}

// 개점시간 형식 변환 함수 (HHmm -> HH:MM)
function formatOpenHm(timeStr) {
  if (!timeStr || timeStr.length !== 4) return timeStr; // 형식이 올바르지 않으면 그대로 반환
  const hours = timeStr.substring(0, 2);
  const minutes = timeStr.substring(2, 4);
  return `${hours}:${minutes}`;
}

// 페이지 로드 시 실행
document.addEventListener("DOMContentLoaded", function () {
  const urlParams = new URLSearchParams(window.location.search);
  const chklstId = urlParams.get("chklstId");
  const storeNm = urlParams.get("storeNm");
  const inspPlanDt = urlParams.get("inspPlanDt");

  if (chklstId && storeNm && inspPlanDt) {
    fetchPopupData(chklstId, storeNm, inspPlanDt);
  } else {
    // alert('필수 파라미터(chklstId, storeNm, inspPlanDt)가 지정되지 않았습니다.');
  }

  generateContent(inspectionData);

  // 첫 번째 탭과 콘텐츠를 active 상태로 설정
  const firstTab = document.querySelector(".inspection-tab");
  const firstContent = document.querySelector(".inspection-list");

  if (firstTab) {
    firstTab.classList.add("active");
  }

  if (firstContent) {
    firstContent.classList.add("active");
  }
});

// REST API에서 inspection-detail 섹션 데이터를 가져오는 함수
function fetchPopupData(chklstId, storeNm, inspPlanDt) {
  const url = `/filter/store_inspection_popup?chklstId=${chklstId}&storeNm=${encodeURIComponent(storeNm)}&inspPlanDt=${inspPlanDt}`;

  fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error(
          `네트워크 응답이 올바르지 않습니다. 상태 코드: ${response.status}`,
        );
      }
      return response.json();
    })
    .then((data) => {
      console.log("팝업 데이터:", data);
      if (data.length > 0) {
        // 첫 번째 데이터를 inspection-detail 섹션에 채움
        populateInspectionDetail(data[0]);

        // 데이터를 변환하여 generateContent 함수에 전달
        const inspectionData = processFetchedData(data);
        generateContent(inspectionData);

        // 첫 번째 탭과 콘텐츠를 active 상태로 설정
        const firstTab = document.querySelector(".inspection-tab");
        const firstContent = document.querySelector(".inspection-list");

        if (firstTab) {
          firstTab.classList.add("active");
        }

        if (firstContent) {
          firstContent.classList.add("active");
        }
      } else {
        alert("점검 상세 데이터가 없습니다.");
      }
    })
    .catch((error) => {
      console.error("데이터 가져오기 실패:", error);
      alert("점검 데이터를 불러오는 데 실패했습니다.");
    });
}

// 데이터를 그룹화하여 generateContent 함수가 기대하는 형식으로 변환하는 함수
function processFetchedData(data) {
  const categoryMap = {};

  data.forEach((item) => {
    const ctgId = item.ctgId;
    const masterCtgId = item.masterCtgId;

    // 대분류 판단 (masterCtgId가 null 또는 0인 경우)
    if (masterCtgId == null || masterCtgId === 0) {
      // 대분류 생성 또는 가져오기
      if (!categoryMap[ctgId]) {
        categoryMap[ctgId] = {
          categoryName: item.ctgNm,
          categoryId: ctgId,
          subcategories: [],
        };
      }
    } else {
      // 중분류 처리
      // 해당 대분류 찾기
      let category = categoryMap[masterCtgId];
      if (!category) {
        // 대분류가 아직 없다면 생성
        category = {
          categoryName: "", // 이름은 나중에 채움
          categoryId: masterCtgId,
          subcategories: [],
        };
        categoryMap[masterCtgId] = category;
      }

      // 중분류 찾기 또는 생성
      let subcategory = category.subcategories.find(
        (sub) => sub.subcategoryId === ctgId,
      );
      if (!subcategory) {
        subcategory = {
          subcategoryName: item.ctgNm,
          subcategoryId: ctgId,
          questions: [],
        };
        category.subcategories.push(subcategory);
      }

      // 문항 추가 또는 업데이트
      if (item.evitContent) {
        // 문항 찾기 또는 생성
        let question = subcategory.questions.find(
          (q) => q.questionId === item.evitId,
        );
        if (!question) {
          let questionType = "";
          if (item.evitTypeCd === "ET001") {
            questionType = "2-choice";
          } else if (item.evitTypeCd === "ET004") {
            questionType = "5-choice";
          }

          question = {
            questionId: item.evitId,
            questionText: item.evitContent,
            questionType: questionType,
            options: [],
          };
          subcategory.questions.push(question);
        }

        // 옵션 추가
        if (item.chclstContent) {
          question.options.push(item.chclstContent);
        }
      }
    }
  });

  // 대분류 이름 채우기
  Object.values(categoryMap).forEach((category) => {
    if (!category.categoryName) {
      const item = data.find(
        (d) =>
          d.ctgId == category.categoryId &&
          (d.masterCtgId == null || d.masterCtgId === 0),
      );
      category.categoryName = item ? item.ctgNm : "Unknown Category";
    }
  });

  // 객체를 배열로 변환하여 반환
  return Object.values(categoryMap);
}

// inspection-detail 섹션을 동적으로 생성하는 함수
function populateInspectionDetail(data) {
  const inspectionDetailSection = document.getElementById("inspection-detail");
  if (!inspectionDetailSection) {
    console.error("inspection-detail 섹션을 찾을 수 없습니다.");
    return;
  }

  // 기존 내용 초기화
  inspectionDetailSection.innerHTML = "";

  // inspection-info div 생성
  const inspectionInfo = document.createElement("div");
  inspectionInfo.classList.add("inspection-info");

  // inspection-table 생성
  const table = document.createElement("table");
  table.classList.add("inspection-table");

  // 테이블 헤더 행 생성
  const headerRow = document.createElement("tr");

  const titleCell = document.createElement("td");
  titleCell.classList.add("info-title");
  const titleP = document.createElement("p");
  titleP.textContent = data.chklstNm || "점검표"; // chklstNm이 없을 경우 기본값
  titleCell.appendChild(titleP);

  const detailsCell = document.createElement("td");
  detailsCell.classList.add("info-details");

  const storeNameSpan = document.createElement("span");
  storeNameSpan.classList.add("store-name");
  storeNameSpan.textContent = data.brandNm || "브랜드명"; // brandNm이 없을 경우 기본값
  detailsCell.appendChild(storeNameSpan);

  const storeSubtitleSpan = document.createElement("span");
  storeSubtitleSpan.classList.add("store-subtitle");
  storeSubtitleSpan.textContent = `가맹점 (${data.storeNm || "가맹점명"})`; // storeNm이 없을 경우 기본값
  detailsCell.appendChild(storeSubtitleSpan);

  const inspectionDateSpan = document.createElement("span");
  inspectionDateSpan.classList.add("inspection-date");
  inspectionDateSpan.innerHTML = `<i class="fas fa-calendar-alt"></i> 점검일 : ${formatDate(data.inspPlanDt)}`;
  detailsCell.appendChild(inspectionDateSpan);

  const inspectorNameSpan = document.createElement("span");
  inspectorNameSpan.classList.add("inspector-name");
  inspectorNameSpan.innerHTML = `<i class="fas fa-user"></i> 점검자 : ${data.mbrNm || "점검자명"}`;
  detailsCell.appendChild(inspectorNameSpan);

  // 테이블에 행 추가
  headerRow.appendChild(titleCell);
  headerRow.appendChild(detailsCell);
  table.appendChild(headerRow);

  inspectionInfo.appendChild(table);
  inspectionDetailSection.appendChild(inspectionInfo);
}

// 콘텐츠를 동적으로 생성하는 함수
function generateContent(data) {
  // 탭 버튼들을 생성
  const tabContainer = document.querySelector(".inspection-tabs");
  const contentContainer = document.querySelector(".inspection-section");

  // 총점 초기화
  let totalScoreValue = 0;

  data.forEach((category, index) => {
    // 탭 버튼 생성
    const tabButton = document.createElement("button");
    tabButton.classList.add("inspection-tab");
    if (index === 0) tabButton.classList.add("active");
    tabButton.setAttribute("data-tab", category.categoryId);
    tabButton.textContent = category.categoryName;
    tabContainer.appendChild(tabButton);

    // 콘텐츠 섹션 생성
    const section = document.createElement("section");
    section.classList.add("inspection-list");
    section.id = category.categoryId;
    if (index === 0) section.classList.add("active");

    // 중분류와 문항들 생성
    category.subcategories.forEach((subcategory) => {
      const inspectionBox = document.createElement("div");
      inspectionBox.classList.add("inspection-box");

      // 중분류 헤더 생성
      const inspectionHeader = document.createElement("div");
      inspectionHeader.classList.add("inspection-header");
      inspectionHeader.textContent = subcategory.subcategoryName;
      const toggleIcon = document.createElement("span");
      toggleIcon.classList.add("toggle-icon");
      toggleIcon.textContent = "▼";
      inspectionHeader.appendChild(toggleIcon);

      // 중분류 내용 컨테이너 생성
      const inspectionContent = document.createElement("div");
      inspectionContent.classList.add("inspection-content");

      subcategory.questions.forEach((question) => {
        // 문항 상세 내용 생성
        const inspectionContentDetail = document.createElement("div");
        inspectionContentDetail.classList.add("inspection-content-detail");

        const questionText = document.createElement("p");
        questionText.textContent = question.questionText;
        inspectionContentDetail.appendChild(questionText);

        const addBtn = document.createElement("button");
        addBtn.classList.add("add-btn");
        addBtn.textContent = "+";
        addBtn.type = "button"; // 버튼의 기본 동작 방지
        inspectionContentDetail.appendChild(addBtn);

        inspectionContent.appendChild(inspectionContentDetail);

        // 문항 내용 래퍼 생성
        const inspectionContentWrapper = document.createElement("div");
        inspectionContentWrapper.classList.add("inspection-content-wrapper");

        // 답변 섹션 생성
        let answerSection;
        if (question.questionType === "2-choice") {
          answerSection = document.createElement("div");
          answerSection.classList.add("answer-section");

          question.options.forEach((option) => {
            const btn = document.createElement("button");
            btn.classList.add("answer-btn");
            btn.textContent = option;
            btn.dataset.questionId = question.questionId;
            btn.dataset.optionValue = option;
            btn.type = "button"; // 버튼의 기본 동작 방지

            // 답변 버튼 클릭 시 선택 상태 토글 및 하위 입력 필드 활성화
            btn.addEventListener("click", function () {
              // 같은 문항의 다른 버튼들 비활성화
              document
                .querySelectorAll(
                  `.answer-btn[data-question-id="${question.questionId}"]`,
                )
                .forEach((b) => {
                  b.classList.remove("active");
                });
              this.classList.add("active");

              // 해당 질문의 하위 입력 필드 찾기
              const detailContent =
                inspectionContentWrapper.querySelector(".detail-content");
              const storeInfo =
                inspectionContentWrapper.querySelector(".store-info");
              const locationInputs = storeInfo.querySelectorAll(
                `input[name^='location_${question.questionId}']`,
              );

              if (option === "부적합") {
                // "부적합" 선택 시 하위 입력 필드 활성화 (etc-input과 caupvd 제외)
                detailContent
                  .querySelectorAll("input, textarea, select")
                  .forEach((input) => {
                    if (
                      !input.classList.contains("caupvd") &&
                      !input.name.startsWith("etc_")
                    ) {
                      input.disabled = false;
                    }
                  });

                // 위치정보 라디오 버튼 활성화
                locationInputs.forEach((input) => {
                  input.disabled = false;
                });
              } else {
                // "적합" 선택 시 하위 입력 필드 비활성화 및 초기화 (etc-input과 caupvd 제외)
                detailContent
                  .querySelectorAll("input, textarea, select")
                  .forEach((input) => {
                    if (
                      !input.classList.contains("caupvd") &&
                      !input.name.startsWith("etc_")
                    ) {
                      input.disabled = true;
                      if (input.tagName.toLowerCase() === "textarea") {
                        input.value = "";
                      } else if (
                        input.tagName.toLowerCase() === "input" &&
                        input.type === "radio"
                      ) {
                        input.checked = false;
                      }
                    }
                  });

                // 위치정보 라디오 버튼 비활성화 및 초기화
                locationInputs.forEach((input) => {
                  input.disabled = true;
                  if (input.type === "radio") {
                    input.checked = false;
                  }
                });

                // 기타사항 입력 초기화
                const etcInput = storeInfo.querySelector(
                  `textarea[name='etc_${question.questionId}']`,
                );
                if (etcInput) {
                  etcInput.disabled = true;
                  etcInput.value = "";
                }
              }
            });

            answerSection.appendChild(btn);
          });
        } else if (question.questionType === "5-choice") {
          answerSection = document.createElement("div");
          answerSection.classList.add("answer-section2");
          question.options.forEach((option) => {
            const label = document.createElement("label");
            label.classList.add("radio-label2");

            const input = document.createElement("input");
            input.type = "radio";
            input.name = `rating_${question.questionId}`;
            input.value = option;

            // 라디오 버튼 변경 시 하위 입력 필드 활성화
            input.addEventListener("change", function () {
              const detailContent =
                inspectionContentWrapper.querySelector(".detail-content");
              const storeInfo =
                inspectionContentWrapper.querySelector(".store-info");
              const locationInputs = storeInfo.querySelectorAll(
                `input[name^='location_${question.questionId}']`,
              );

              if (option === "매우나쁨" || option === "나쁨") {
                // "매우나쁨" 또는 "나쁨" 선택 시 하위 입력 필드 활성화 (etc-input과 caupvd 제외)
                detailContent
                  .querySelectorAll("input, textarea, select")
                  .forEach((input) => {
                    if (
                      !input.classList.contains("caupvd") &&
                      !input.name.startsWith("etc_")
                    ) {
                      input.disabled = false;
                    }
                  });

                // 위치정보 라디오 버튼 활성화
                locationInputs.forEach((input) => {
                  input.disabled = false;
                });
              } else {
                // 그 외 선택 시 하위 입력 필드 비활성화 및 초기화 (etc-input과 caupvd 제외)
                detailContent
                  .querySelectorAll("input, textarea, select")
                  .forEach((input) => {
                    if (
                      !input.classList.contains("caupvd") &&
                      !input.name.startsWith("etc_")
                    ) {
                      input.disabled = true;
                      if (input.tagName.toLowerCase() === "textarea") {
                        input.value = "";
                      } else if (
                        input.tagName.toLowerCase() === "input" &&
                        input.type === "radio"
                      ) {
                        input.checked = false;
                      }
                    }
                  });

                // 위치정보 라디오 버튼 비활성화 및 초기화
                locationInputs.forEach((input) => {
                  input.disabled = true;
                  if (input.type === "radio") {
                    input.checked = false;
                  }
                });

                // 기타사항 입력 초기화
                const etcInput = storeInfo.querySelector(
                  `textarea[name='etc_${question.questionId}']`,
                );
                if (etcInput) {
                  etcInput.disabled = true;
                  etcInput.value = "";
                }
              }
            });

            label.appendChild(input);
            label.appendChild(document.createTextNode(option));

            // 비활성화된 상태에서 클릭 시 경고 메시지 표시 (현재 주석 처리됨)
            /*
            label.addEventListener('click', function(e) {
              const inputElem = this.querySelector("input");
              if (inputElem.disabled) {
                e.preventDefault();
                alert("입력할 수 없습니다.");
              }
            });
            */

            answerSection.appendChild(label);
          });

          // 비활성화된 상태에서 클릭 시 경고 메시지 표시는 제거하여 활성화 상태로 만듦
        }

        inspectionContentWrapper.appendChild(answerSection);

        // 사진 업로드 섹션
        const photoSection = document.createElement("div");
        photoSection.classList.add("photo-section");

        const photoButtons = document.createElement("div");
        photoButtons.classList.add("photo-buttons");

        const cameraBtn = document.createElement("button");
        cameraBtn.classList.add("photo-btn", "camera-btn");
        cameraBtn.innerHTML = '<i class="fa-solid fa-camera"></i>사진촬영';
        cameraBtn.type = "button"; // 버튼의 기본 동작 방지
        photoButtons.appendChild(cameraBtn);

        const galleryBtn = document.createElement("button");
        galleryBtn.classList.add("photo-btn", "gallery-btn");
        galleryBtn.innerHTML = '<i class="fa-regular fa-image"></i>갤러리';
        galleryBtn.type = "button"; // 버튼의 기본 동작 방지
        photoButtons.appendChild(galleryBtn);

        // photoBoxes 생성 및 설정
        const photoBoxes = document.createElement("div");
        photoBoxes.classList.add("photo-boxes");

        const photoBox1 = document.createElement("div");
        photoBox1.classList.add("photo-box");
        photoBox1.textContent = "사진 미등록";
        photoBoxes.appendChild(photoBox1);

        const photoBox2 = document.createElement("div");
        photoBox2.classList.add("photo-box");
        photoBox2.textContent = "최대 2개";
        photoBoxes.appendChild(photoBox2);

        photoSection.appendChild(photoButtons);
        photoSection.appendChild(photoBoxes);

        // setupPhotoUpload 호출
        setupPhotoUpload(photoBoxes, cameraBtn, galleryBtn);

        inspectionContentWrapper.appendChild(photoSection);

        // 매장 정보 라디오 버튼 리스트
        const storeInfo = document.createElement("div");
        storeInfo.classList.add("store-info");

        const tabSection = document.createElement("div");
        tabSection.classList.add("tab-section");

        const tabBtn1 = document.createElement("button");
        tabBtn1.classList.add("tab-btn", "active");
        tabBtn1.textContent = "위치정보";
        tabBtn1.type = "button"; // 버튼의 기본 동작 방지
        tabSection.appendChild(tabBtn1);

        const tabBtn2 = document.createElement("button");
        tabBtn2.classList.add("tab-btn");
        tabBtn2.textContent = "상세입력";
        tabBtn2.type = "button"; // 버튼의 기본 동작 방지
        tabSection.appendChild(tabBtn2);

        storeInfo.appendChild(tabSection);

        // 위치정보 콘텐츠
        const locationContentDiv = document.createElement("div");
        locationContentDiv.classList.add("content2", "location-content");

        const locationContentList = document.createElement("div");
        locationContentList.classList.add("content2", "location-content-list");

        ["매장", "카페", "주방", "기타"].forEach((location) => {
          const label = document.createElement("label");
          label.classList.add("radio-label");
          label.textContent = location;

          const input = document.createElement("input");
          input.type = "radio";
          input.name = `location_${question.questionId}`;
          input.value = location;
          input.disabled = true; // 초기에는 비활성화

          // 라디오 버튼 변경 시 "기타" 입력 필드 활성화
          input.addEventListener("change", function () {
            const otherInfo = storeInfo.querySelector(".other-info");
            if (location === "기타") {
              otherInfo.querySelector("textarea").disabled = false;
            } else {
              otherInfo.querySelector("textarea").disabled = true;
              otherInfo.querySelector("textarea").value = ""; // 내용 초기화
            }
          });

          // 비활성화된 상태에서 클릭 시 경고 메시지 표시
          label.addEventListener("click", function (e) {
            if (input.disabled) {
              e.preventDefault();
              alert("입력할 수 없습니다.");
            }
          });

          label.appendChild(input);

          locationContentList.appendChild(label);
        });

        locationContentDiv.appendChild(locationContentList);

        // 기타사항 입력
        const otherInfoDiv = document.createElement("div");
        otherInfoDiv.classList.add("other-info");

        const otherLabel = document.createElement("label");
        otherLabel.textContent = "기타사항";
        otherInfoDiv.appendChild(otherLabel);

        const etcInput = document.createElement("textarea");
        etcInput.classList.add("etc-input");
        etcInput.name = `etc_${question.questionId}`;
        etcInput.placeholder = "기타사항을 입력해주세요";
        etcInput.disabled = true; // 초기에는 비활성화
        otherInfoDiv.appendChild(etcInput);

        locationContentDiv.appendChild(otherInfoDiv);

        storeInfo.appendChild(locationContentDiv);

        // 상세입력 콘텐츠
        const detailContent = document.createElement("div");
        detailContent.classList.add("content2", "detail-content");
        detailContent.style.display = "none";

        const inputGroupCover = document.createElement("div");
        inputGroupCover.classList.add("input-group-cover");

        const inputGroup1 = document.createElement("div");
        inputGroup1.classList.add("input-group");

        const label1 = document.createElement("label");
        label1.textContent = "제품명 (또는 상세위치)";
        inputGroup1.appendChild(label1);

        const productName = document.createElement("input");
        productName.type = "text";
        productName.classList.add("product-name");
        productName.placeholder = "제품명 입력";
        productName.disabled = true; // 초기에는 비활성화
        inputGroup1.appendChild(productName);

        inputGroupCover.appendChild(inputGroup1);

        const inputGroup2 = document.createElement("div");
        inputGroup2.classList.add("input-group");

        const label2 = document.createElement("label");
        label2.textContent = "위반수량";
        inputGroup2.appendChild(label2);

        const violationQuantity = document.createElement("input");
        violationQuantity.type = "text";
        violationQuantity.classList.add("violation-quantity");
        violationQuantity.placeholder = "위반수량 입력";
        violationQuantity.disabled = true; // 초기에는 비활성화
        inputGroup2.appendChild(violationQuantity);

        inputGroupCover.appendChild(inputGroup2);

        detailContent.appendChild(inputGroupCover);

        // 원인
        const inputGroup3 = document.createElement("div");
        inputGroup3.classList.add("input-group");

        const label3 = document.createElement("label");
        label3.textContent = "원인";
        inputGroup3.appendChild(label3);

        const reason = document.createElement("textarea");
        reason.classList.add("reason");
        reason.placeholder = "원인을 작성해주세요";
        reason.disabled = true; // 초기에는 비활성화
        inputGroup3.appendChild(reason);

        detailContent.appendChild(inputGroup3);

        // 개선조치사항
        const inputGroup4 = document.createElement("div");
        inputGroup4.classList.add("input-group");

        const label4 = document.createElement("label");
        label4.textContent = "개선조치사항";
        inputGroup4.appendChild(label4);

        const action = document.createElement("textarea");
        action.classList.add("action");
        action.placeholder = "개선조치사항을 입력해주세요";
        action.disabled = true; // 초기에는 비활성화
        inputGroup4.appendChild(action);

        detailContent.appendChild(inputGroup4);

        // 위반사항
        const inputGroup5 = document.createElement("div");
        inputGroup5.classList.add("input-group");

        const label5 = document.createElement("label");
        label5.textContent = "위반사항";
        inputGroup5.appendChild(label5);

        const violation = document.createElement("textarea");
        violation.classList.add("violation");
        violation.placeholder = "위반사항을 입력해주세요";
        violation.disabled = true; // 초기에는 비활성화
        inputGroup5.appendChild(violation);

        detailContent.appendChild(inputGroup5);

        // 귀책사유
        const inputGroup6 = document.createElement("div");
        inputGroup6.classList.add("input-group");

        const label6 = document.createElement("label");
        label6.textContent = "귀책사유";
        inputGroup6.appendChild(label6);

        const radioGroup = document.createElement("div");
        radioGroup.classList.add("radio-group");

        ["점주", "SV", "직원", "기타"].forEach((responsibility) => {
          const respLabel = document.createElement("label");
          respLabel.textContent = responsibility;

          const respInput = document.createElement("input");
          respInput.type = "radio";
          respInput.name = `responsibility_${question.questionId}`;
          respInput.value = responsibility;
          respInput.disabled = true; // 초기에는 비활성화

          // 라디오 버튼 변경 시 "기타" 입력 필드 활성화
          respInput.addEventListener("change", function () {
            const caupvd = inputGroup6.querySelector(".caupvd");
            if (responsibility === "기타") {
              caupvd.disabled = false;
            } else {
              caupvd.disabled = true;
              caupvd.value = ""; // 내용 초기화
            }
          });

          // 비활성화된 상태에서 클릭 시 경고 메시지 표시
          respLabel.addEventListener("click", function (e) {
            if (respInput.disabled) {
              e.preventDefault();
              alert("입력할 수 없습니다.");
            }
          });

          respLabel.appendChild(respInput);

          radioGroup.appendChild(respLabel);
        });

        inputGroup6.appendChild(radioGroup);

        const caupvd = document.createElement("textarea");
        caupvd.classList.add("caupvd");
        caupvd.placeholder = "귀책사유를 입력해주세요";
        caupvd.disabled = true; // 초기에는 비활성화
        inputGroup6.appendChild(caupvd);

        detailContent.appendChild(inputGroup6);

        storeInfo.appendChild(detailContent);

        inspectionContentWrapper.appendChild(storeInfo);

        inspectionContent.appendChild(inspectionContentWrapper);
      });

      // 중분류의 scoreChklstEvit 값을 합산
      if (subcategory.scoreChklstEvit) {
        totalScoreValue += parseInt(subcategory.scoreChklstEvit, 10) || 0;
      }

      inspectionBox.appendChild(inspectionHeader);
      inspectionBox.appendChild(inspectionContent);
      section.appendChild(inspectionBox);
    });

    contentContainer.appendChild(section);
  });

  // 점수 영역을 동적으로 생성하여 삽입
  const totalScore = document.createElement("div");
  totalScore.classList.add("inspection-total-score");
  totalScore.innerHTML = `<p>총 <span>${totalScoreValue}</span> 점</p>`;

  contentContainer.appendChild(totalScore); // section 내부에 추가

  // 이벤트 리스너 재등록
  addEventListeners();
}

// -----------------사진 업로드 및 촬영 기능 설정--------------
function setupPhotoUpload(photoBoxes, cameraBtn, galleryBtn) {
  let photoCount = 0;

  // 카메라 버튼 클릭 시
  cameraBtn.addEventListener("click", function () {
    if (photoCount >= 2) {
      alert("이미지는 최대 2개까지만 업로드할 수 있습니다.");
      return;
    }

    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";
    fileInput.capture = "camera"; // 카메라만 호출
    fileInput.style.display = "none";

    fileInput.addEventListener("change", function (event) {
      const file = event.target.files[0];
      if (file) {
        displayImage(file, photoBoxes);
        photoCount++;
      }
    });

    fileInput.click();
  });

  // 갤러리 버튼 클릭 시
  galleryBtn.addEventListener("click", function () {
    if (photoCount >= 2) {
      alert("이미지는 최대 2개까지만 업로드할 수 있습니다.");
      return;
    }

    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";
    fileInput.style.display = "none";

    fileInput.addEventListener("change", function (event) {
      const file = event.target.files[0];
      if (file) {
        displayImage(file, photoBoxes);
        photoCount++;
      }
    });

    fileInput.click();
  });

  // 이미지 삭제 처리
  function removeImage(imageBox) {
    imageBox.style.backgroundImage = ""; // 배경 이미지 제거
    imageBox.textContent = "사진 미등록"; // 기본 텍스트로 복원
    const deleteButton = imageBox.querySelector(".delete-btn");
    if (deleteButton) {
      deleteButton.remove(); // 삭제 버튼 제거
    }
    photoCount--; // 사진 개수 감소
  }

  // 이미지 파일을 표시하는 함수
  function displayImage(file, photoBoxes) {
    const reader = new FileReader();
    reader.onload = function (e) {
      const emptyBox = Array.from(photoBoxes.children).find(
        (box) => !box.style.backgroundImage,
      );
      if (emptyBox) {
        // 이미지 표시
        emptyBox.style.backgroundImage = `url(${e.target.result})`;
        emptyBox.style.backgroundSize = "cover";
        emptyBox.style.backgroundPosition = "center";
        emptyBox.style.backgroundRepeat = "no-repeat";
        emptyBox.textContent = "";

        // X 버튼 추가
        const deleteButton = document.createElement("button");
        deleteButton.classList.add("delete-btn");
        deleteButton.innerHTML = '<i class="fa-solid fa-xmark"></i>';

        // 이미지 삭제 기능
        deleteButton.addEventListener("click", function () {
          removeImage(emptyBox);
        });

        emptyBox.appendChild(deleteButton);
      }
    };
    reader.readAsDataURL(file);
  }
}

// ------------------------- 기존 함수들 -------------------------

// animateHeight 함수 정의
function animateHeight(element, startHeight, endHeight, duration) {
  const startTime = performance.now();
  element.style.overflow = "hidden"; // 항상 애니메이션 중에는 overflow를 hidden으로

  function step(currentTime) {
    const progress = Math.min((currentTime - startTime) / duration, 1);
    const currentHeight = startHeight + progress * (endHeight - startHeight);

    element.style.height = currentHeight + "px";

    if (progress < 1) {
      requestAnimationFrame(step);
    } else {
      // 애니메이션이 끝나면 처리
      if (endHeight > 0) {
        element.style.height = "auto"; // 콘텐츠 크기에 맞게 height auto로 설정
        element.style.overflow = "visible"; // 콘텐츠가 모두 보이도록 overflow visible로 변경
      } else {
        element.style.height = "0";
      }
    }
  }

  requestAnimationFrame(step);
}

// toggleInspectionContent 함수
function toggleInspectionContent(button) {
  const contentWrapper = button.closest(
    ".inspection-content-detail",
  ).nextElementSibling;

  if (contentWrapper.classList.contains("open")) {
    const startHeight = contentWrapper.scrollHeight;
    contentWrapper.classList.remove("open");

    // 애니메이션으로 닫기
    animateHeight(contentWrapper, startHeight, 0, 300); // 300ms 동안 애니메이션

    button.textContent = "+"; // 버튼 기호 변경
  } else {
    contentWrapper.classList.add("open");

    // 열릴 때의 높이 계산
    const endHeight = contentWrapper.scrollHeight;

    // 애니메이션으로 열기
    animateHeight(contentWrapper, 0, endHeight, 300);

    button.textContent = "-"; // 버튼 기호 변경
  }
}

// toggleContent 함수 정의 (inspection-header용)
function toggleContent(content, header) {
  if (content.classList.contains("open")) {
    const startHeight = content.scrollHeight;
    content.classList.remove("open");
    animateHeight(content, startHeight, 0, 300); // 300ms 동안 높이 애니메이션
    header.querySelector(".toggle-icon").style.transform = "rotate(0deg)";
  } else {
    content.classList.add("open");
    const endHeight = content.scrollHeight;
    animateHeight(content, 0, endHeight, 300); // 300ms 동안 높이 애니메이션
    header.querySelector(".toggle-icon").style.transform = "rotate(180deg)";
  }
}

// 콘텐츠 높이를 조정하는 함수
function adjustWrapperHeight(element) {
  element.style.height = "auto"; // 높이를 자동으로 일단 설정
  const newHeight = element.scrollHeight; // 새로운 높이 계산
  element.style.height = newHeight + "px"; // 새로운 높이를 적용
  element.style.transition = "height 0.5s ease"; // 부드러운 전환
}

// 이벤트 리스너를 등록하는 함수
function addEventListeners() {
  // add-btn 클릭 이벤트 처리
  document.querySelectorAll(".add-btn").forEach((button) => {
    button.addEventListener("click", function () {
      toggleInspectionContent(this);
    });
  });

  // inspection-header 클릭 이벤트 처리
  document.querySelectorAll(".inspection-header").forEach((header) => {
    header.addEventListener("click", function (e) {
      e.stopPropagation();
      const content = header.nextElementSibling;
      toggleContent(content, header);
    });
  });

  // 탭 버튼 클릭 이벤트 처리
  document.querySelectorAll(".inspection-tab").forEach((tab) => {
    tab.addEventListener("click", function () {
      // 모든 탭에서 active 클래스 제거
      document
        .querySelectorAll(".inspection-tab")
        .forEach((tab) => tab.classList.remove("active"));
      this.classList.add("active");

      // 모든 inspection-list 숨기기
      document
        .querySelectorAll(".inspection-list")
        .forEach((list) => list.classList.remove("active"));

      // 클릭한 탭에 해당하는 콘텐츠 보여주기
      const contentId = this.getAttribute("data-tab");
      document.getElementById(contentId).classList.add("active");
    });
  });

  // 위치정보/상세입력 탭 버튼 클릭 이벤트 처리
  document.querySelectorAll(".tab-btn").forEach((button) => {
    button.addEventListener("click", function (e) {
      e.stopPropagation();

      const parentWrapper = button.closest(".store-info");
      const tabButtons = parentWrapper.querySelectorAll(".tab-btn");
      tabButtons.forEach((btn) => btn.classList.remove("active"));
      this.classList.add("active");

      const locationContent = parentWrapper.querySelector(".location-content");
      const detailContent = parentWrapper.querySelector(".detail-content");

      if (this.textContent === "위치정보") {
        locationContent.style.display = "block";
        detailContent.style.display = "none";
      } else if (this.textContent === "상세입력") {
        locationContent.style.display = "none";
        detailContent.style.display = "block";
      }

      adjustWrapperHeight(parentWrapper);
    });
  });

  // 추가적인 이벤트 리스너를 여기서 추가하세요...
}

// 높이 재조정 함수 (리사이즈 시 호출)
function adjustWrapperHeight(element) {
  if (element.style.display === "block") {
    element.style.height = "auto"; // 높이 자동 조정
    const newHeight = element.scrollHeight + "px"; // 새로운 높이 계산
    element.style.height = newHeight; // 새 높이 설정
  }
}


//-------------------------임시저장 함수------------------------
// function tenpoirySave() {
//   const requestData = {
//     chklstId: parseInt(getParameterByName('chklstId'), 10),
//     storeNm: getParameterByName('storeNm'),
//     inspPlanDt: getParameterByName('inspPlanDt'),
//     inspComplW: 'N', // 임시저장
//     answers: []
//   };
//
//   // 각 질문에 대한 데이터 수집
//   document.querySelectorAll(".inspection-content-detail").forEach(detail => {
//     const evitId = parseInt(detail.dataset.evitId, 10);
//     const questionType = detail.closest(".inspection-content").dataset.type;
//     let answerContent = "";
//
//     if (questionType === "2-choice") {
//       const activeBtn = detail.querySelector(`.answer-btn[data-question-id="${evitId}"].active`);
//       answerContent = activeBtn ? activeBtn.dataset.optionValue : null;
//     } else if (questionType === "5-choice") {
//       const selectedRadio = detail.querySelector(`input[name="rating_${evitId}"]:checked`);
//       answerContent = selectedRadio ? selectedRadio.value : null;
//     }
//
//     if (answerContent) {
//       const answer = {
//         evitId: evitId,
//         answerContent: answerContent,
//         pdtNmDtplc: null,
//         vltCnt: null,
//         vltContent: null,
//         vltCause: null,
//         instruction: null,
//         caupvdCd: null,
//         caupvdInput: null,
//         vltPlcCd: null,
//         etcInput: null,
//         photoPaths: []
//       };
//
//       // 추가 데이터 수집 (부적합, 나쁨, 매우나쁨인 경우)
//       if (["부적합", "나쁨", "매우나쁨"].includes(answerContent)) {
//         const productName = detail.querySelector(".product-name") ? detail.querySelector(".product-name").value : null;
//         const violationQuantity = detail.querySelector(".violation-quantity") ? parseInt(detail.querySelector(".violation-quantity").value, 10) : null;
//         const reason = detail.querySelector(".reason") ? detail.querySelector(".reason").value : null;
//         const action = detail.querySelector(".action") ? detail.querySelector(".action").value : null;
//         const responsibilitySelected = detail.querySelector(`input[name="responsibility_${evitId}"]:checked`);
//         const locationSelected = detail.querySelector(`input[name^="location_${evitId}"]:checked`);
//         const etcInput = detail.querySelector(`textarea[name='etc_${evitId}']`) ? detail.querySelector(`textarea[name='etc_${evitId}']`).value : null;
//
//         answer.pdtNmDtplc = productName;
//         answer.vltCnt = violationQuantity;
//         answer.vltCause = reason;
//         answer.instruction = action;
//
//         if (responsibilitySelected) {
//           const caupvdValueMap = {
//             "점주": "C001",
//             "SV": "C002",
//             "직원": "C003",
//             "기타": "C004"
//           };
//           answer.caupvdCd = caupvdValueMap[responsibilitySelected.value] || null;
//           if (responsibilitySelected.value === "기타") {
//             answer.caupvdInput = etcInput;
//           }
//         }
//
//         if (locationSelected) {
//           const plcValueMap = {
//             "매장": "VP001",
//             "카페": "VP002",
//             "주방": "VP003",
//             "기타": "VP004"
//           };
//           answer.vltPlcCd = plcValueMap[locationSelected.value] || null;
//           if (locationSelected.value === "기타") {
//             answer.etcInput = etcInput;
//           }
//         }
//       }
//
//       // 사진 경로 수집
//       const photoBoxes = detail.nextElementSibling.querySelectorAll(".photo-box");
//       photoBoxes.forEach(box => {
//         const bgImage = box.style.backgroundImage;
//         if (bgImage && bgImage !== 'none') {
//           const url = bgImage.slice(5, -2); // url("...")에서 URL 추출
//           answer.photoPaths.push(url);
//         }
//       });
//
//       requestData.answers.push(answer);
//     }
//   });
//
//   // POST 요청 전송
//   fetch('/filter/store_inspection_save', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify(requestData),
//   })
//       .then(response => response.text())
//       .then(data => {
//         alert(data);
//       })
//       .catch(error => {
//         console.error('임시저장 실패:', error);
//         alert('임시저장에 실패했습니다.');
//       });
// }
//
// // 도우미 함수: URL 파라미터 가져오기
// function getParameterByName(name) {
//   const urlParams = new URLSearchParams(window.location.search);
//   return urlParams.get(name);
// }


function tenpoirySave() {
  console.log("tenpoirySave() 함수가 호출")
  // 1. inspResultId를 숨겨진 입력 필드에서 가져옵니다.
  const inspResultIdElement = document.getElementById('inspResultId');
  const inspResultId = inspResultIdElement ? inspResultIdElement.value : null;

  if (!inspResultId) {
    alert('inspResultId가 누락되었습니다.');
    return;
  }

  // 2. URL 파라미터에서 필요한 값 가져오기
  const chklstId = getParameterByName('chklstId');
  const storeNm = getParameterByName('storeNm');
  const inspPlanDt = getParameterByName('inspPlanDt');

  if (!chklstId || !storeNm || !inspPlanDt) {
    alert('필수 파라미터(chklstId, storeNm, inspPlanDt)가 누락되었습니다.');
    return;
  }

  // 3. inspections 배열 초기화
  const inspections = [];

  // 각 카테고리 탭을 순회
  document.querySelectorAll('.inspection-tab').forEach(tab => {
    const categoryId = tab.getAttribute('data-tab');
    const categoryName = tab.textContent.trim();

    const subcategories = [];

    // 해당 카테고리에 속한 inspection-list 섹션을 찾기
    const inspectionList = document.getElementById(categoryId);
    if (inspectionList) {
      // 각 inspection-box (중분류) 순회
      inspectionList.querySelectorAll('.inspection-box').forEach(box => {
        const subcategoryHeader = box.querySelector('.inspection-header');
        const subcategoryName = subcategoryHeader ? subcategoryHeader.textContent.trim() : "Unknown Subcategory";

        // 각 서브카테고리의 inspection-content-detail 순회
        box.querySelectorAll('.inspection-content-detail').forEach(detail => {
          const evitId = parseInt(detail.getAttribute('data-evit-id'), 10);
          if (isNaN(evitId)) {
            console.warn('유효하지 않은 evitId:', detail);
            return;
          }

          const answerContent = getAnswerContent(detail);
          if (!answerContent) {
            // 답변이 없는 경우 건너뜁니다.
            return;
          }

          const pdtNmDtplc = getProductName(detail);
          const vltContent = getViolationContent(detail);
          const vltCnt = getViolationCount(detail);
          const caupvdCd = getCaupvdCd(detail);
          const vltCause = getVltCause(detail);
          const instruction = getInstruction(detail);
          const vltPlcCd = getVltPlcCd(detail);
          const photoPaths = getPhotoPaths(detail);

          const subcategoryInspection = {
            subcategoryName: subcategoryName,
            evitId: evitId,
            answerContent: answerContent,
            pdtNmDtplc: pdtNmDtplc,
            vltContent: vltContent,
            vltCnt: vltCnt,
            caupvdCd: caupvdCd,
            vltCause: vltCause,
            instruction: instruction,
            vltPlcCd: vltPlcCd,
            photoPaths: photoPaths,
            inspResultId: parseInt(inspResultId, 10)
          };

          subcategories.push(subcategoryInspection);
        });
      });
    }

    const categoryInspection = {
      categoryName: categoryName,
      subcategories: subcategories
    };

    inspections.push(categoryInspection);
  });

  // 최종 requestData 객체 구성
  const requestData = {
    inspResultId: parseInt(inspResultId, 10),
    inspSchdId: parseInt(chklstId, 10),
    inspComplW: "N", // 임시저장 상태
    inspections: inspections
  };

  // 콘솔에 requestData 확인 (디버깅용)
  console.log('임시저장 요청 데이터:', requestData);

  // 4. POST 요청 전송
  fetch('/filter/store_inspection_save', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestData),
  })
      .then(response => {
        if (!response.ok) {
          throw new Error(`서버 응답이 올바르지 않습니다. 상태 코드: ${response.status}`);
        }
        return response.text();
      })
      .then(data => {
        alert("임시저장이 완료되었습니다.");
      })
      .catch(error => {
        console.error('임시저장 실패:', error);
        alert("임시저장에 실패했습니다.");
      });
}

/**
 * 서브카테고리에서 답변 내용 추출
 *
 * @param {Element} detail - 서브카테고리 요소
 * @return {string|null} 답변 내용
 */
function getAnswerContent(detail) {
  // 2-choice
  const activeBtn = detail.querySelector('.answer-btn.active');
  if (activeBtn) {
    return activeBtn.getAttribute('data-option-value');
  }

  // 5-choice
  const selectedRadio = detail.querySelector('input[type="radio"]:checked');
  if (selectedRadio) {
    return selectedRadio.value;
  }

  return null;
}

/**
 * 서브카테고리에서 제품명/위생상태 추출
 *
 * @param {Element} detail - 서브카테고리 요소
 * @return {string|null} 제품명/위생상태
 */
function getProductName(detail) {
  const productInput = detail.querySelector('.product-name');
  return productInput ? productInput.value.trim() : null;
}

/**
 * 서브카테고리에서 위반 내용 추출
 *
 * @param {Element} detail - 서브카테고리 요소
 * @return {string|null} 위반 내용
 */
function getViolationContent(detail) {
  const violationContent = detail.querySelector('.violation');
  return violationContent ? violationContent.value.trim() : null;
}

/**
 * 서브카테고리에서 위반 횟수 추출
 *
 * @param {Element} detail - 서브카테고리 요소
 * @return {number|null} 위반 횟수
 */
function getViolationCount(detail) {
  const violationQty = detail.querySelector('.violation-quantity');
  return violationQty ? parseInt(violationQty.value, 10) || null : null;
}

/**
 * 서브카테고리에서 책임자 코드 추출
 *
 * @param {Element} detail - 서브카테고리 요소
 * @return {string|null} 책임자 코드
 */
function getCaupvdCd(detail) {
  const selectedResponsibility = detail.querySelector('input[name^="responsibility_"]:checked');
  const caupvdValueMap = {
    "점주": "C001",
    "SV": "C002",
    "직원": "C003",
    "기타": "C004"
  };
  return selectedResponsibility ? caupvdValueMap[selectedResponsibility.value] || null : null;
}

/**
 * 서브카테고리에서 위반 원인 추출
 *
 * @param {Element} detail - 서브카테고리 요소
 * @return {string|null} 위반 원인
 */
function getVltCause(detail) {
  const cause = detail.querySelector('.vltCause');
  return cause ? cause.value.trim() : null;
}

/**
 * 서브카테고리에서 지시사항 추출
 *
 * @param {Element} detail - 서브카테고리 요소
 * @return {string|null} 지시사항
 */
function getInstruction(detail) {
  const instruction = detail.querySelector('.instruction');
  return instruction ? instruction.value.trim() : null;
}

/**
 * 서브카테고리에서 위반 장소 코드 추출
 *
 * @param {Element} detail - 서브카테고리 요소
 * @return {string|null} 위반 장소 코드
 */
function getVltPlcCd(detail) {
  const selectedLocation = detail.querySelector('input[name^="location_"]:checked');
  const plcValueMap = {
    "매장": "VP001",
    "카페": "VP002",
    "주방": "VP003",
    "기타": "VP004"
  };
  return selectedLocation ? plcValueMap[selectedLocation.value] || null : null;
}

/**
 * 서브카테고리에서 사진 경로 목록 추출
 *
 * @param {Element} detail - 서브카테고리 요소
 * @return {Array} 사진 경로 목록
 */
function getPhotoPaths(detail) {
  const photoBoxes = detail.querySelectorAll('.photo-box');
  const paths = [];
  photoBoxes.forEach(box => {
    const bgImage = box.style.backgroundImage;
    if (bgImage && bgImage !== 'none') {
      const urlMatch = bgImage.match(/url\(["']?(.+?)["']?\)/);
      if (urlMatch && urlMatch[1]) {
        paths.push(urlMatch[1]);
      }
    }
  });
  return paths;
}







// -------------------------데이터 전달 함수-------------------------
function checkInspection() {
  // 모든 textarea 데이터를 가져옴
  const textareaData = {};
  document.querySelectorAll("textarea").forEach((textarea) => {
    textareaData[textarea.name] = textarea.value;
  });

  // 폼을 생성하여 데이터를 전송
  const form = document.createElement("form");
  form.method = "POST";
  form.action = "/qsc/popup_middleCheck";

  // textarea 데이터를 숨겨진 input 필드로 추가
  const input = document.createElement("input");
  input.type = "hidden";
  input.name = "textareaData";
  input.value = JSON.stringify(textareaData);
  form.appendChild(input);

  // 폼을 문서에 추가한 뒤 제출
  document.body.appendChild(form);
  form.submit();
}
