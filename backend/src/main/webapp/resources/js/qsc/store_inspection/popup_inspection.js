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

// 전역 변수로 inspResultId 설정 (DOMContentLoaded 이벤트 내에서 설정)
let globalInspResultId = null;

document.addEventListener("DOMContentLoaded", function () {
  const urlParams = new URLSearchParams(window.location.search);
  const chklstId = urlParams.get("chklstId");
  const storeNm = urlParams.get("storeNm");
  const inspPlanDt = urlParams.get("inspPlanDt");
  const inspResultId = urlParams.get("inspResultId");

  globalInspResultId = inspResultId; // 전역 변수에 설정

  if (chklstId && storeNm && inspPlanDt) {
    // 기본 데이터를 먼저 로드
    fetchPopupData(chklstId, storeNm, inspPlanDt);

    if (inspResultId) {
      // inspResultId가 있는 경우 임시저장된 데이터를 로드
      loadTemporaryInspection(inspResultId);
    }
  } else {
    alert('필수 파라미터(chklstId, storeNm, inspPlanDt 또는 inspResultId)가 지정되지 않았습니다.');
  }
});


/**
 * 임시저장된 점검 결과 조회
 *
 * @param {Long} inspResultId 점검 결과 ID
 * @return {StoreInspectionPopupRequest} 임시저장된 점검 결과 데이터
 */
function loadTemporaryInspection(inspResultId) {
  const temporaryDataUrl = `/filter/get_temporary_inspection?inspResultId=${inspResultId}`;

  fetch(temporaryDataUrl)
      .then(response => {
        if (response.status === 204) {
          console.log("임시저장된 데이터가 없습니다.");
          return null;
        }
        if (!response.ok) {
          throw new Error(`네트워크 응답이 올바르지 않습니다. 상태 코드: ${response.status}`);
        }
        return response.json();
      })
      .then(temporaryData => {
        if (temporaryData && temporaryData.inspections && temporaryData.inspections.length > 0) {
          // SweetAlert2를 사용한 확인 대화상자 호출
          Swal.fire({
            title: "확인",
            text: "임시저장 내역이 있습니다. 불러오시겠습니까?",
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "확인",
            cancelButtonText: "취소",
          }).then((result) => {
            if (result.isConfirmed) {
              // 임시저장된 데이터를 화면에 반영
              applyTemporaryData(temporaryData);
              // 성공 메시지 표시 (선택 사항)
              Swal.fire("완료!", "임시저장 내역을 불러왔습니다.", "success");
            } else {
              console.log("임시저장 내역 불러오기를 취소했습니다.");
            }
          });
        } else {
          console.log("임시저장된 데이터가 없습니다.");
        }
      })
      .catch(error => {
        console.error("임시저장된 데이터 불러오기 실패:", error);
        Swal.fire("오류", "임시저장된 데이터를 불러오는 데 실패했습니다.", "error");
      });
}

function applyTemporaryData(temporaryData) {
  // evitId, inspResultId, creMbrId를 키로 사용하여 tempDataMap 생성
  const tempDataMap = {};
  temporaryData.inspections.forEach((tempCategory) => {
    if (tempCategory.subcategories) {
      tempCategory.subcategories.forEach((tempSubcategory) => {
        const evitId = tempSubcategory.evitId;
        const inspResultId = tempSubcategory.inspResultId;
        const creMbrId = tempSubcategory.creMbrId;

        const key = `${evitId}-${inspResultId}-${creMbrId}`;
        tempDataMap[key] = tempSubcategory;
      });
    }
  });

  // 화면에 표시된 모든 문항을 순회하며 임시데이터를 반영
  document.querySelectorAll('.inspection-content-detail').forEach(detail => {
    const evitId = detail.getAttribute('data-evit-id');
    const inspResultId = detail.getAttribute('data-insp-result-id');
    const creMbrId = detail.getAttribute('data-cre-mbr-id');

    if (!evitId || !inspResultId || !creMbrId) {
      return;
    }

    const key = `${evitId}-${inspResultId}-${creMbrId}`;
    const tempData = tempDataMap[key];
    if (tempData) {
      // 해당 문항의 wrapper 요소를 찾음
      const inspectionContentWrapper = detail.nextElementSibling;

      // 답변 반영
      applyAnswerContent(inspectionContentWrapper, tempData.answerContent);

      // 상세 입력 필드 반영
      applyDetailContent(inspectionContentWrapper, tempData);
    }
  });
}




function applyAnswerContent(wrapper, answerContent) {
  if (!answerContent) return;

  // 2-choice
  const answerButtons = wrapper.querySelectorAll('.answer-btn');
  if (answerButtons.length > 0) {
    answerButtons.forEach(btn => {
      if (btn.getAttribute('data-option-value') === answerContent) {
        btn.classList.add('active');
        // 이벤트 트리거를 통해 필드 활성화
        btn.click();
      } else {
        btn.classList.remove('active');
      }
    });
    return;
  }

  // 5-choice
  const radios = wrapper.querySelectorAll('input[type="radio"]');
  radios.forEach(radio => {
    if (radio.value === answerContent) {
      radio.checked = true;
      // 이벤트 트리거를 통해 필드 활성화
      radio.dispatchEvent(new Event('change'));
    } else {
      radio.checked = false;
    }
  });
}

//귀책사유와 위치정보 설정 함수
function setResponsibility(detailContent, tempData) {
  const caupvdCdValueMap = {
    "C001": "점주",
    "C002": "SV",
    "C003": "직원",
    "C004": "기타"
  };

  // caupvdCd가 정의된 값인지 확인, 아니면 "기타"로 설정
  let responsibilityValue = tempData.caupvdCd && caupvdCdValueMap[tempData.caupvdCd]
      ? caupvdCdValueMap[tempData.caupvdCd]
      : "기타";

  const responsibilityRadios = detailContent.querySelectorAll('input[name^="responsibility_"]');
  responsibilityRadios.forEach(radio => {
    if (radio.value === responsibilityValue) {
      radio.checked = true;
      radio.dispatchEvent(new Event('change'));
    } else {
      radio.checked = false;
    }
  });

  // responsibilityValue가 "기타"인 경우에만 기타 입력 필드 활성화
  if (responsibilityValue === "기타") {
    const caupvdInput = detailContent.querySelector('.caupvd');
    if (caupvdInput) {
      caupvdInput.value = tempData.caupvdCd || ''; // 실제 값 설정
      caupvdInput.disabled = false;
    }
  } else {
    // 기타가 아닐 경우 입력 필드 비활성화 및 초기화
    const caupvdInput = detailContent.querySelector('.caupvd');
    if (caupvdInput) {
      caupvdInput.value = '';
      caupvdInput.disabled = true;
    }
  }
}


function setLocation(locationContent, tempData) {
  const vltPlcCdValueMap = {
    "VP001": "매장",
    "VP002": "주방",
    "VP003": "카페",
    "VP004": "기타"
  };

  // vltPlcCd가 정의된 값인지 확인, 아니면 "기타"로 설정
  let locationValue = tempData.vltPlcCd && vltPlcCdValueMap[tempData.vltPlcCd]
      ? vltPlcCdValueMap[tempData.vltPlcCd]
      : "기타";

  const locationRadios = locationContent.querySelectorAll('input[name^="location_"]');
  locationRadios.forEach(radio => {
    if (radio.value === locationValue) {
      radio.checked = true;
      radio.dispatchEvent(new Event('change'));
    } else {
      radio.checked = false;
    }
  });

  // locationValue가 "기타"인 경우에만 기타 입력 필드 활성화
  if (locationValue === "기타") {
    const etcInput = locationContent.querySelector('.etc-input');
    if (etcInput) {
      etcInput.value = tempData.vltPlcCd || ''; // 실제 값 설정
      etcInput.disabled = false;
    }
  } else {
    // 기타가 아닐 경우 입력 필드 비활성화 및 초기화
    const etcInput = locationContent.querySelector('.etc-input');
    if (etcInput) {
      etcInput.value = '';
      etcInput.disabled = true;
    }
  }
}



function applyDetailContent(wrapper, tempData) {
  // 긍정적인 답변 목록
  const positiveAnswers = ["적합", "매우좋음", "좋음", "보통"];
  const isPositiveAnswer = positiveAnswers.includes(tempData.answerContent);

  // 상세 입력 필드들을 활성화 또는 비활성화
  const detailContent = wrapper.querySelector('.detail-content');
  const locationContent = wrapper.querySelector('.location-content');

  if (isPositiveAnswer) {
    // 긍정적인 답변인 경우 하위 필드 비활성화 및 값 초기화
    disableAndClearFields(detailContent);
    disableAndClearFields(locationContent);

    // "기타" 필드 비활성화 및 초기화
    const caupvdInput = detailContent.querySelector('.caupvd');
    if (caupvdInput) {
      caupvdInput.value = '';
      caupvdInput.disabled = true;
    }

    const etcInput = locationContent.querySelector('.etc-input');
    if (etcInput) {
      etcInput.value = '';
      etcInput.disabled = true;
    }
  } else {
    // 부정적인 답변인 경우 하위 필드 활성화 및 값 적용
    enableFields(detailContent);
    enableFields(locationContent);

    // 제품명/상세위치
    const productNameInput = detailContent.querySelector('.product-name');
    if (productNameInput && tempData.pdtNmDtplc) {
      productNameInput.value = tempData.pdtNmDtplc;
    }

    // 위반수량
    const violationQuantityInput = detailContent.querySelector('.violation-quantity');
    if (violationQuantityInput && tempData.vltCnt) {
      violationQuantityInput.value = tempData.vltCnt;
    }

    // 원인
    const reasonTextarea = detailContent.querySelector('.reason');
    if (reasonTextarea && tempData.vltCause) {
      reasonTextarea.value = tempData.vltCause;
    }

    // 개선조치사항
    const actionTextarea = detailContent.querySelector('.action');
    if (actionTextarea && tempData.instruction) {
      actionTextarea.value = tempData.instruction;
    }

    // 위반사항
    const violationTextarea = detailContent.querySelector('.violation');
    if (violationTextarea && tempData.vltContent) {
      violationTextarea.value = tempData.vltContent;
    }

    // 귀책사유 설정
    setResponsibility(detailContent, tempData);

    // 위치정보 설정
    setLocation(locationContent, tempData);
  }

  // 사진 설정
  console.log("Setting photo paths:", tempData.photoPaths); // 디버깅 로그

  // 로컬 경로를 제외하고 S3 경로만 추출
  const s3PhotoPaths = tempData.photoPaths.filter(path => path && !path.startsWith('/'));

  setPhotoPaths(wrapper, s3PhotoPaths);
}

// S3 베이스 URL을 사용하는 대신, /download 엔드포인트를 사용
function setPhotoPaths(inspectionContentWrapper, photoPaths) {
  if (!photoPaths || !Array.isArray(photoPaths)) {
    console.warn("photoPaths가 유효하지 않습니다:", photoPaths);
    return;
  }

  const photoBoxes = inspectionContentWrapper.querySelectorAll('.photo-box');

  // 모든 photoBox를 초기화
  photoBoxes.forEach((box) => {
    box.style.backgroundImage = "";
    box.textContent = "사진 미등록";
    box.removeAttribute('data-path');

    // 기존의 delete 버튼 제거
    const deleteButton = box.querySelector('.delete-btn');
    if (deleteButton) {
      deleteButton.remove();
    }
  });

  // 사진 경로에 따라 사진 설정
  photoPaths.forEach((path, index) => {
    if (path && !path.startsWith('/')) {
      const s3Key = 'inspection_img/' + path;
      const box = photoBoxes[index];
      if (box) {
        console.log(`Path ${s3Key} is recognized as an S3 key.`);
        fetch('/download', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ path: s3Key })
        })
            .then(response => {
              console.log("Download response status:", response.status); // 디버깅 로그
              if (!response.ok) {
                throw new Error(`파일 다운로드 실패: ${response.statusText}`);
              }
              return response.blob();
            })
            .then(blob => {
              const imageUrl = URL.createObjectURL(blob);
              console.log("Image URL created:", imageUrl); // 디버깅 로그

              // 이미지 표시
              box.style.backgroundImage = `url(${imageUrl})`;
              box.style.backgroundSize = "cover";
              box.style.backgroundPosition = "center";
              box.style.backgroundRepeat = "no-repeat";
              box.textContent = "";

              // S3 경로 저장 (접두사 없이 원본 path만 저장)
              box.setAttribute('data-path', path);

              // X 버튼 추가 (이미 존재하지 않을 경우)
              if (!box.querySelector(".delete-btn")) {
                const deleteButton = document.createElement("button");
                deleteButton.classList.add("delete-btn");
                deleteButton.innerHTML = '<i class="fa-solid fa-xmark"></i>';
                box.appendChild(deleteButton);

                // 이미지 삭제 기능
                deleteButton.addEventListener("click", function () {
                  fetch('/delete', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ path: s3Key })
                  })
                      .then(response => response.json())
                      .then(data => {
                        if (data.error) {
                          throw new Error(data.error);
                        }
                        // 이미지 제거
                        box.style.backgroundImage = "";
                        box.textContent = "사진 미등록";
                        box.removeAttribute('data-path');
                        deleteButton.remove();
                      })
                      .catch(error => {
                        console.error("파일 삭제 실패:", error);
                        alert("파일 삭제에 실패했습니다.");
                      });
                });
              }
            })
            .catch(error => {
              console.error(`이미지 로드 실패 (path: ${s3Key}):`, error);
              box.textContent = "이미지 로드 실패";
            });
      }
    } else {
      // path가 없거나 로컬 경로인 경우 처리
      console.warn(`Photo box ${index}에 대한 유효한 S3 path가 없습니다.`);
      const box = photoBoxes[index];
      if (box) {
        box.style.backgroundImage = "";
        box.textContent = "사진 미등록";
      }
    }
  });
}




function disableAndClearFields(container) {
  if (!container) return;
  container.querySelectorAll('input, textarea, select').forEach(element => {
    element.disabled = true;
    if (element.type === 'radio' || element.type === 'checkbox') {
      element.checked = false;
    } else {
      element.value = '';
    }
  });
}

function enableFields(container) {
  if (!container) return;
  container.querySelectorAll('input, textarea, select').forEach(element => {
    element.disabled = false;
  });
}


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
    console.log(item);

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
            creMbrId: item.mbrId || "defaultCreMbrId" // creMbrId 추가 (데이터에 존재해야 함)

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

  console.log("Processed Inspection Data:", Object.values(categoryMap)); // 디버깅 로그 추가


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
  const tabContainer = document.querySelector(".inspection-tabs");
  const contentContainer = document.querySelector(".inspection-section");

  let totalScoreValue = 0;

  data.forEach((category, index) => {
    console.log(`Generating content for category: ${category.categoryName}`);

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
      console.log(`  Subcategory: ${subcategory.subcategoryName}`);

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
        console.log(`    Question: ${question.questionText}`);

        // 문항 상세 내용 생성
        const inspectionContentDetail = document.createElement("div");
        inspectionContentDetail.classList.add("inspection-content-detail");

        // 데이터 속성 설정 및 로그 추가
        inspectionContentDetail.setAttribute('data-evit-id', question.questionId);
        inspectionContentDetail.setAttribute('data-cre-mbr-id', question.creMbrId);
        inspectionContentDetail.setAttribute('data-insp-result-id', globalInspResultId);

        console.log(`Set data-evit-id: ${question.questionId}, data-cre-mbr-id: ${question.creMbrId}, data-insp-result-id: ${globalInspResultId}`);

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
                  `input[name='location_${question.questionId}']`,
              );
              const locationContent =
                  inspectionContentWrapper.querySelector(".location-content");

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
                  `input[name='location_${question.questionId}']`,
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

            answerSection.appendChild(label);
          });

          // 비활성화된 상태에서 클릭 시 경고 메시지 표시는 제거
        }

        inspectionContentWrapper.appendChild(answerSection);

        // 사진 업로드 섹션 생성
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
        setupPhotoUpload(photoBoxes, cameraBtn, galleryBtn, inspectionContentWrapper);

        inspectionContentWrapper.appendChild(photoSection);

        // 매장 정보 라디오 버튼 리스트 생성
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

        const pdtNmDtplc = document.createElement("input");
        pdtNmDtplc.type = "text";
        pdtNmDtplc.classList.add("product-name");
        pdtNmDtplc.placeholder = "제품명 입력";
        pdtNmDtplc.disabled = true; // 초기에는 비활성화
        inputGroup1.appendChild(pdtNmDtplc);

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


// 전역 변수로 삭제할 이미지 목록을 관리
let deletedImages = [];
function setupPhotoUpload(photoBoxes, cameraBtn, galleryBtn, inspectionContentWrapper) {
  // 기존 photoCount 제거하고 현재 사진 수를 기반으로 설정
  let photoCount = Array.from(photoBoxes).filter(box => box.getAttribute('data-path')).length;

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
        uploadAndDisplayImage(file, photoBoxes, inspectionContentWrapper);
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
        uploadAndDisplayImage(file, photoBoxes, inspectionContentWrapper);
      }
    });

    fileInput.click();
  });

  // 이미지 업로드 및 표시 처리 함수
  function uploadAndDisplayImage(file, photoBoxes, inspectionContentWrapper) {
    const formData = new FormData();
    formData.append("file", file);

    fetch('/upload', {
      method: 'POST',
      body: formData
    })
        .then(response => response.json())
        .then(data => {
          console.log("Upload response data:", data); // 디버깅 로그
          if (data.error) {
            throw new Error(data.error);
          }

          // S3 키 생성: data.path에 'inspection_img/'가 포함되어 있지 않은지 확인
          const s3Key = data.path.startsWith('inspection_img/') ? data.path : 'inspection_img/' + data.path;

          const emptyBox = Array.from(photoBoxes.children).find(
              (box) => !box.style.backgroundImage
          );
          if (emptyBox) {
            console.log("Fetching image from path:", s3Key); // 추가된 로그
            fetch('/download', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({ path: s3Key })
            })
                .then(response => {
                  console.log("Download response status:", response.status); // 디버깅 로그
                  if (!response.ok) {
                    throw new Error(`파일 다운로드 실패: ${response.statusText}`);
                  }
                  return response.blob();
                })
                .then(blob => {
                  const imageUrl = URL.createObjectURL(blob);
                  console.log("Image URL created:", imageUrl); // 디버깅 로그

                  // 이미지 표시
                  emptyBox.style.backgroundImage = `url(${imageUrl})`;
                  emptyBox.style.backgroundSize = "cover";
                  emptyBox.style.backgroundPosition = "center";
                  emptyBox.style.backgroundRepeat = "no-repeat";
                  emptyBox.textContent = "";

                  // S3 경로 저장 (접두사 없이 원본 path만 저장)
                  emptyBox.setAttribute('data-path', data.path);

                  // X 버튼 추가
                  const deleteButton = document.createElement("button");
                  deleteButton.classList.add("delete-btn");
                  deleteButton.innerHTML = '<i class="fa-solid fa-xmark"></i>';

                  // 이미지 삭제 기능
                  deleteButton.addEventListener("click", function () {
                    fetch('/delete', {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json'
                      },
                      body: JSON.stringify({ path: s3Key })
                    })
                        .then(response => response.json())
                        .then(data => {
                          if (data.error) {
                            throw new Error(data.error);
                          }
                          // 이미지 제거
                          emptyBox.style.backgroundImage = "";
                          emptyBox.textContent = "사진 미등록";
                          emptyBox.removeAttribute('data-path');
                          deleteButton.remove();
                          photoCount--;
                        })
                        .catch(error => {
                          console.error("파일 삭제 실패:", error);
                          alert("파일 삭제에 실패했습니다.");
                        });
                  });

                  emptyBox.appendChild(deleteButton);
                  photoCount++;
                })
                .catch(error => {
                  console.error(`이미지 로드 실패 (path: ${s3Key}):`, error);
                  alert("파일 다운로드에 실패했습니다.");
                });
          }
        })
        .catch(error => {
          console.error("파일 업로드 실패:", error);
          alert("파일 업로드에 실패했습니다.");
        });
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
// URL 파라미터 가져오기
function getParameterByName(name) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(name);
}

function temporarySave() {
  console.log("temporarySave() 함수가 호출됨");

  // 1. URL 파라미터에서 필요한 값 가져오기
  const inspResultId = getParameterByName('inspResultId');
  if (!inspResultId) {
    alert('inspResultId가 누락되었습니다.');
    return;
  }

  const chklstId = getParameterByName('chklstId');
  const storeNm = getParameterByName('storeNm');
  const inspPlanDt = getParameterByName('inspPlanDt');
  const inspSchdId = getParameterByName('inspSchdId'); // 추가된 부분

  // 필수 파라미터 누락 시 경고
  if (!chklstId || !storeNm || !inspPlanDt || !inspSchdId) { // inspSchdId 추가
    alert('필수 파라미터(chklstId, storeNm, inspPlanDt, inspSchdId)가 누락되었습니다.');
    return;
  }

  const inspections = []; // 각 카테고리의 데이터를 저장할 배열

  // 2. 각 카테고리 순회
  document.querySelectorAll('.inspection-tab').forEach(tab => {
    const categoryId = tab.getAttribute('data-tab');
    const categoryName = tab.textContent.trim();
    const subcategories = [];

    // 3. 해당 카테고리의 문항들 순회
    const inspectionList = document.getElementById(categoryId);
    if (inspectionList) {
      inspectionList.querySelectorAll('.inspection-box').forEach(box => {
        const subcategoryHeader = box.querySelector('.inspection-header');
        const subcategoryName = subcategoryHeader
            ? subcategoryHeader.textContent.trim().replace('▼', '').trim()
            : "알 수 없는 서브카테고리";

        console.log(`Processing Subcategory: ${subcategoryName}`); // 디버깅 로그

        box.querySelectorAll('.inspection-content-detail').forEach(detail => {
          const evitId = parseInt(detail.getAttribute('data-evit-id'), 10);
          const creMbrId = detail.getAttribute('data-cre-mbr-id'); // 추가된 부분
          const wrapper = detail.nextElementSibling;

          if (isNaN(evitId)) {
            console.warn('유효하지 않은 evitId:', detail);
            return;
          }

          // 4. 각 문항의 상세 내용 추출
          const answerContent = getAnswerContent(wrapper);
          const pdtNmDtplc = getProductName(wrapper) || "";
          const vltContent = getViolationContent(wrapper) || "";
          const vltCnt = getViolationCount(wrapper) || 0;
          const caupvdCd = getCaupvdCd(wrapper) || "";
          const vltCause = getVltCause(wrapper) || "";
          const instruction = getInstruction(wrapper) || "";
          const vltPlcCd = getVltPlcCd(wrapper) || "";
          let photoPaths = getPhotoPaths(wrapper) || [];

          // 사진 경로에서 null 값 제거
          photoPaths = photoPaths.filter(path => path);

          // 필수 데이터 검증
          if (!answerContent) {
            console.warn(`답변이 누락됨. evitId: ${evitId}`);
            return;
          }

          // 5. 서브카테고리 데이터 객체 생성
          const subcategoryInspection = {
            evitId,
            answerContent,
            pdtNmDtplc,
            vltContent,
            vltCnt,
            caupvdCd,
            vltCause,
            instruction,
            vltPlcCd,
            photoPaths,
            inspResultId: parseInt(inspResultId, 10),
            creMbrId: creMbrId || "defaultCreMbrId", // creMbrId 추가
          };

          console.log(`Collected data for evitId ${evitId}:`, subcategoryInspection);
          subcategories.push(subcategoryInspection);
        });
      });
    }

    inspections.push({ categoryName, subcategories });
  });

  // 6. 최종 데이터 객체 생성
  const requestData = {
    chklstId: parseInt(chklstId, 10),
    storeNm: storeNm,
    inspPlanDt: inspPlanDt,
    inspResultId: parseInt(inspResultId, 10),
    inspSchdId: parseInt(inspSchdId, 10), // 기존 함수에서 가져온 스케줄 ID 추가
    inspComplW: "N", // 임시저장 상태
    inspections,
  };

  console.log("Sending data to server:", JSON.stringify(requestData, null, 2));

  // 7. 서버로 데이터 전송
  sendDataToServer(requestData);
}

// 서버로 데이터 전송 함수
function sendDataToServer(requestData) {
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
        return response.text(); // JSON 대신 텍스트로 응답 받기
      })
      .then(data => {
        alert("임시저장이 완료되었습니다.");
        console.log("저장 성공:", data);
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
function getAnswerContent(wrapper) {
  // 2-choice
  const activeBtn = wrapper.querySelector('.answer-btn.active');
  if (activeBtn) {
    console.log(`Active button found: ${activeBtn.dataset.optionValue}`);
    return activeBtn.getAttribute('data-option-value');
  }

  // 5-choice
  const selectedRadio = wrapper.querySelector('input[type="radio"]:checked');
  if (selectedRadio) {
    console.log(`Checked radio found: ${selectedRadio.value}`);
    return selectedRadio.value;
  }

  console.log('No answer content found.');
  return null;
}


function getProductName(detailContent) {
  const productInput = detailContent.querySelector('.product-name');
  return productInput ? productInput.value.trim() : null;
}

function getViolationContent(detailContent) {
  const vltContent = detailContent.querySelector('.violation');
  return vltContent ? vltContent.value.trim() : null;
}

function getViolationCount(detailContent) {
  const violationQty = detailContent.querySelector('.violation-quantity');
  return violationQty ? parseInt(violationQty.value, 10) || null : null;
}

function getCaupvdCd(detailContent) {
  const selectedResponsibility = detailContent.querySelector('input[name^="responsibility_"]:checked');
  const caupvdValueMap = {
    "점주": "C001",
    "SV": "C002",
    "직원": "C003",
    "기타": "C004"
  };

  if (selectedResponsibility) {
    if (selectedResponsibility.value === "기타") {
      const caupvdInput = detailContent.querySelector('.caupvd');
      return caupvdInput ? caupvdInput.value.trim() : null; // 기타일 경우 입력된 값 사용
    } else {
      return caupvdValueMap[selectedResponsibility.value] || null;
    }
  }

  return null;
}

function getVltCause(detailContent) {
  const cause = detailContent.querySelector('.reason');
  return cause ? cause.value.trim() : null;
}

function getInstruction(detailContent) {
  const instruction = detailContent.querySelector('.action');
  return instruction ? instruction.value.trim() : null;
}

function getVltPlcCd(locationContent) {
  console.log("getVltPlcCd 함수 호출됨");
  console.log("locationContent:", locationContent);

  const selectedLoc = locationContent.querySelector('input[name^="location_"]:checked');
  const plcValueMap = {
    "매장": "VP001",
    "주방": "VP002",
    "카페": "VP003",
    "기타": "VP004"
  };

  if (selectedLoc) {
    if (selectedLoc.value === "기타") {
      const etcInput = locationContent.querySelector('.etc-input');
      console.log("ETC Input Found:", etcInput); // 디버깅 로그
      if (etcInput && etcInput.value.trim() !== "") {
        console.log("ETC Input Value:", etcInput.value.trim()); // 디버깅 로그
        return etcInput.value.trim(); // 기타일 경우 입력된 값 사용
      } else {
        console.warn("ETC Input is empty or not found.");
        return ""; // 빈 문자열 반환
      }
    } else {
      const mappedValue = plcValueMap[selectedLoc.value] || "";
      console.log("Mapped Value:", mappedValue); // 디버깅 로그
      return mappedValue;
    }
  }

  console.warn("No location selected.");

  return null;
}

function getPhotoPaths(inspectionContentWrapper) {
  const photoBoxes = inspectionContentWrapper.querySelectorAll('.photo-box');
  const paths = [];
  photoBoxes.forEach(box => {
    const path = box.getAttribute('data-path');
    if (path) {
      paths.push(path);
    } else {
      paths.push(null); // undefined 대신 null 사용
    }
  });
  return paths;
}







// -------------------------데이터 전달 함수-------------------------


function checkInspection() {
  // 모든 .inspection-content-wrapper 요소를 가져옵니다.
  const inspectionWrappers = document.querySelectorAll('.inspection-content-wrapper');
  let allInputsValid = true; // 모든 입력이 유효한지 확인하기 위한 플래그

  // 각 문항을 순회하며 검증합니다.
  inspectionWrappers.forEach(wrapper => {
    let answer = null;
    let isNegative = false; // 부정적인 답변 여부

    // .answer-section과 .answer-section2 중 어떤 섹션인지 확인
    const answerSection = wrapper.querySelector('.answer-section');
    const answerSection2 = wrapper.querySelector('.answer-section2');

    if (answerSection) {
      // 2-choice 질문
      const activeBtn = answerSection.querySelector('.answer-btn.active');
      if (activeBtn) {
        answer = activeBtn.getAttribute('data-option-value');
      }

      // 2-choice의 부정적인 답변 정의
      const negativeAnswers = ['부적합'];

      // 답변이 선택되지 않은 경우
      if (!answer) {
        allInputsValid = false;
        return; // 다음 문항으로 넘어감
      }

      // 부정적인 답변인지 확인
      if (negativeAnswers.includes(answer)) {
        isNegative = true;
      }
    } else if (answerSection2) {
      // 5-choice 질문
      const selectedRadio = answerSection2.querySelector('input[type="radio"]:checked');
      if (selectedRadio) {
        answer = selectedRadio.value;
      }

      // 5-choice의 부정적인 답변 정의
      const negativeAnswers = ['나쁨', '매우나쁨'];

      // 답변이 선택되지 않은 경우
      if (!answer) {
        allInputsValid = false;
        return; // 다음 문항으로 넘어감
      }

      // 부정적인 답변인지 확인
      if (negativeAnswers.includes(answer)) {
        isNegative = true;
      }
    } else {
      // .answer-section 또는 .answer-section2가 없는 경우
      console.warn("Unknown answer section type.");
      allInputsValid = false;
      return;
    }

    // 부정적인 답변인 경우에만 추가 입력 필드 검증
    if (isNegative) {
      const locationContent = wrapper.querySelector('.location-content');
      const detailContent = wrapper.querySelector('.detail-content');

      // 1. 위치정보 라디오 버튼 확인
      const locationRadios = locationContent.querySelectorAll('input[name^="location_"]');
      const locationChecked = Array.from(locationRadios).some(radio => radio.checked);
      if (!locationChecked) {
        allInputsValid = false;
        return;
      }

      // 2. "기타"가 선택된 경우 추가 입력 필드 확인
      const locationEtcRadio = locationContent.querySelector('input[name^="location_"][value="기타"]');
      if (locationEtcRadio && locationEtcRadio.checked) {
        const etcInput = locationContent.querySelector('.etc-input');
        if (!etcInput || !etcInput.value.trim()) {
          allInputsValid = false;
          return;
        }
      }

      // 3. 상세입력 필드 확인
      const requiredDetailFields = [
        '.product-name',
        '.violation-quantity',
        '.reason',
        '.action',
        '.violation'
      ];
      for (const selector of requiredDetailFields) {
        const input = detailContent.querySelector(selector);
        if (!input || !input.value.trim()) {
          allInputsValid = false;
          return;
        }
      }

      // 4. 귀책사유 라디오 버튼 확인
      const responsibilityRadios = detailContent.querySelectorAll('input[name^="responsibility_"]');
      const responsibilityChecked = Array.from(responsibilityRadios).some(radio => radio.checked);
      if (!responsibilityChecked) {
        allInputsValid = false;
        return;
      }

      // 5. 귀책사유 "기타" 선택 시 추가 입력 필드 확인
      const responsibilityEtcRadio = detailContent.querySelector('input[name^="responsibility_"][value="기타"]');
      if (responsibilityEtcRadio && responsibilityEtcRadio.checked) {
        const caupvdInput = detailContent.querySelector('.caupvd');
        if (!caupvdInput || !caupvdInput.value.trim()) {
          allInputsValid = false;
          return;
        }
      }
    }
  });

  if (!allInputsValid) {
    warningMessage();
    return; // 검증 실패 시 함수 종료
  }

  function warningMessage() {
    Swal.fire({
      title: "경고",
      text: "모든 항목을 응답해주십시오.",
      icon: "warning",
      confirmButtonText: "알겠습니다",
    });
  }

  // URL 파라미터 가져오기
  const urlParams = new URLSearchParams(window.location.search);
  const chklstId = urlParams.get("chklstId");
  const storeNm = urlParams.get("storeNm");
  const inspPlanDt = urlParams.get("inspPlanDt");
  const inspSchdId = urlParams.get("inspSchdId");
  const inspResultId = urlParams.get("inspResultId");

  // 필수 파라미터 검증
  if (!chklstId || !storeNm || !inspPlanDt || !inspSchdId || !inspResultId) {
    alert('필수 파라미터(chklstId, storeNm, inspPlanDt, inspSchdId, inspResultId)가 누락되었습니다.');
    return;
  }

  // 데이터 수집 로직 (temporarySave와 유사)
  const inspections = []; // 각 카테고리의 데이터를 저장할 배열

  // 1. 각 카테고리 순회
  document.querySelectorAll('.inspection-tab').forEach(tab => {
    const categoryId = tab.getAttribute('data-tab');
    const categoryName = tab.textContent.trim();
    const subcategories = [];

    // 2. 해당 카테고리의 문항들 순회
    const inspectionList = document.getElementById(categoryId);
    if (inspectionList) {
      inspectionList.querySelectorAll('.inspection-box').forEach(box => {
        const subcategoryHeader = box.querySelector('.inspection-header');
        const subcategoryName = subcategoryHeader
            ? subcategoryHeader.textContent.trim().replace('▼', '').trim()
            : "알 수 없는 서브카테고리";

        console.log(`Processing Subcategory: ${subcategoryName}`); // 디버깅 로그

        box.querySelectorAll('.inspection-content-detail').forEach(detail => {
          const evitId = parseInt(detail.getAttribute('data-evit-id'), 10);
          const creMbrId = detail.getAttribute('data-cre-mbr-id'); // 추가된 부분
          const wrapper = detail.nextElementSibling;

          if (isNaN(evitId)) {
            console.warn('유효하지 않은 evitId:', detail);
            return;
          }

          // 각 문항의 상세 내용 추출
          const answerContent = getAnswerContent(wrapper);
          const pdtNmDtplc = getProductName(wrapper) || "";
          const vltContent = getViolationContent(wrapper) || "";
          const vltCnt = getViolationCount(wrapper) || 0;
          const caupvdCd = getCaupvdCd(wrapper) || "";
          const vltCause = getVltCause(wrapper) || "";
          const instruction = getInstruction(wrapper) || "";
          const vltPlcCd = getVltPlcCd(wrapper) || "";
          let photoPaths = getPhotoPaths(wrapper) || [];

          // 사진 경로에서 null 값 제거
          photoPaths = photoPaths.filter(path => path);

          // 필수 데이터 검증
          if (!answerContent) {
            console.warn(`답변이 누락됨. evitId: ${evitId}`);
            return;
          }

          // 서브카테고리 데이터 객체 생성
          const subcategoryInspection = {
            evitId,
            answerContent,
            pdtNmDtplc,
            vltContent,
            vltCnt,
            caupvdCd,
            vltCause,
            instruction,
            vltPlcCd,
            photoPaths,
            inspResultId: parseInt(inspResultId, 10),
            creMbrId: creMbrId || "defaultCreMbrId", // creMbrId 추가
          };

          console.log(`Collected data for evitId ${evitId}:`, subcategoryInspection);
          subcategories.push(subcategoryInspection);
        });
      });
    }

    inspections.push({ categoryName, subcategories });
  });

  // 최종 데이터 객체 생성
  const requestData = {
    chklstId: parseInt(chklstId, 10),
    storeNm: storeNm,
    inspPlanDt: inspPlanDt,
    inspResultId: parseInt(inspResultId, 10),
    inspSchdId: parseInt(inspSchdId, 10), // 기존 함수에서 가져온 스케줄 ID 추가
    inspComplW: "N", // 임시저장 상태
    inspections,
  };

  console.log("Sending data to server:", JSON.stringify(requestData, null, 2));

  // 서버로 데이터 전송 (temporarySave 로직)
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
        return response.text(); // JSON 대신 텍스트로 응답 받기
      })
      .then(data => {
        // "점검결과가 저장되었습니다." 알림 표시
        Swal.fire({
          title: "완료",
          text: "점검결과가 저장되었습니다.",
          icon: "success",
          confirmButtonText: "확인",
        }).then(() => {
          // 알림 확인 후 페이지 이동
          const form = document.createElement("form");
          form.method = "GET"; // GET 방식 사용 (필요 시 "POST"로 변경 가능)
          form.action = "/qsc/popup_middleCheck";

          // 숨겨진 입력 필드 생성 및 추가
          const input1 = document.createElement("input");
          input1.type = "hidden";
          input1.name = "chklstId";
          input1.value = chklstId;
          form.appendChild(input1);

          const input2 = document.createElement("input");
          input2.type = "hidden";
          input2.name = "storeNm";
          input2.value = storeNm;
          form.appendChild(input2);

          const input3 = document.createElement("input");
          input3.type = "hidden";
          input3.name = "inspPlanDt";
          input3.value = inspPlanDt.replace(/\//g, ''); // '/' 제거
          form.appendChild(input3);

          const input4 = document.createElement("input");
          input4.type = "hidden";
          input4.name = "inspSchdId";
          input4.value = inspSchdId;
          form.appendChild(input4);

          const input5 = document.createElement("input");
          input5.type = "hidden";
          input5.name = "inspResultId";
          input5.value = inspResultId;
          form.appendChild(input5);

          // 폼을 문서에 추가하고 제출
          document.body.appendChild(form);
          form.submit();
        });
      })
      .catch(error => {
        console.error('점검결과 저장 실패:', error);
        Swal.fire("오류", "점검결과를 저장하는 데 실패했습니다.", "error");
      });
}





