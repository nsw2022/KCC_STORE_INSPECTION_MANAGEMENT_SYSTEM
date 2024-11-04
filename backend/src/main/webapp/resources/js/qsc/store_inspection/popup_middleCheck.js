let inspectionData = []; // 전역 변수로 선언

let temporaryInspectionData = null; // 임시 데이터 저장을 위한 전역 변수

// 적합 및 부적합 상태 정의
const appropriateStatuses = ["적합", "보통", "좋음", "매우좋음"];
const inappropriateStatuses = ["부적합", "나쁨", "매우나쁨"];


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
    console.log("globalInspResultId:", globalInspResultId); // 값 확인

    if (chklstId && storeNm && inspPlanDt) {
        // 기본 데이터를 먼저 로드
        fetchPopupData(chklstId, storeNm, inspPlanDt)
            .then(fetchedData => {
                if (fetchedData.length > 0) {
                    // 첫 번째 데이터를 inspection-detail 섹션에 채움
                    populateInspectionDetail(fetchedData[0]);

                    // 데이터를 변환하여 inspectionData에 저장
                    processFetchedData(fetchedData); // 주석 해제

                    // 세부결과 탭의 상세 항목을 동적으로 생성
                } else {
                    alert("점검 상세 데이터가 없습니다.");
                }

                if (inspResultId) {
                    // inspResultId가 있는 경우 임시저장된 데이터를 로드
                    loadTemporaryInspection(inspResultId);
                }
            })
            .catch(error => {
                console.error("데이터 가져오기 실패:", error);
                alert("점검 데이터를 불러오는 데 실패했습니다.");
            });
    } else {
        alert('필수 파라미터(chklstId, storeNm, inspPlanDt)가 지정되지 않았습니다.');
    }

    initializeTabs();
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
            console.log("임시저장된 데이터:", temporaryData); // 데이터 구조 확인
            if (temporaryData && temporaryData.inspections && temporaryData.inspections.length > 0) {
                // 전역 변수에 임시 데이터 설정
                temporaryInspectionData = temporaryData;

                // 임시저장된 데이터를 화면에 반영
                applyTemporaryData(temporaryData);

                // 점수 재계산 및 테이블 업데이트
                const scores = calculateScores(inspectionData, temporaryInspectionData);
                updateScoreTable(scores);
                updateGradeAndPercentage(scores.totalScore, inspectionData);

                // 테이블 갱신 함수 호출
                generateDetailedItems(); // 추가된 부분
                initializeDetailButtons(); // 새로 추가된 부분

                console.log("임시저장 내역을 불러왔습니다.");
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
    console.log("임시 저장 데이터 구조:", temporaryData); // 데이터 구조 확인

    // 임시 데이터 형식 검증
    if (!temporaryData || !temporaryData.inspections || !Array.isArray(temporaryData.inspections)) {
        console.error("임시 저장 데이터 형식이 올바르지 않습니다:", temporaryData);
        return;
    }

    // evitId, inspResultId, creMbrId를 키로 사용하여 tempDataMap 생성
    const tempDataMap = {};

    temporaryData.inspections.forEach((tempCategory) => {
        if (tempCategory.subcategories && Array.isArray(tempCategory.subcategories)) {
            tempCategory.subcategories.forEach((tempSubcategory, index) => {
                // tempSubcategory는 개별 질문 객체임
                const questionTemp = tempSubcategory;
                const evitId = questionTemp.evitId;
                const inspResultId = questionTemp.inspResultId;
                const creMbrId = questionTemp.creMbrId;

                if (!evitId || !inspResultId || !creMbrId) {
                    console.warn(`필수 데이터가 누락되었습니다 (index: ${index}):`, questionTemp);
                    return;
                }

                const key = `${evitId}-${inspResultId}-${creMbrId}`;
                tempDataMap[key] = questionTemp;
                console.log(`TempDataMap에 추가된 키: ${key}`, questionTemp);
            });
        }
    });

    console.log("Temp Data Map:", tempDataMap); // 데이터 맵 확인

    // DOM 요소 존재 여부 확인
    const wrappers = document.querySelectorAll('.inspection-content-wrapper');
    console.log(`찾은 .inspection-content-wrapper 요소 개수: ${wrappers.length}`);

    if (wrappers.length === 0) {
        console.warn("'.inspection-content-wrapper' 요소가 존재하지 않습니다.");
        return;
    }

    // 화면에 표시된 모든 문항을 순회하며 임시데이터를 반영
    wrappers.forEach(wrapper => {
        // const evitId = wrapper.getAttribute('data-evit-id');
        // const inspResultId = wrapper.getAttribute('data-insp-result-id');
        // const creMbrId = wrapper.getAttribute('data-cre-mbr-id');
        const evitId = wrapper.getAttribute('data-evit-id');
        const inspResultId = wrapper.getAttribute('data-insp-result-id');
        const creMbrId = wrapper.getAttribute('data-cre-mbr-id');


        if (!evitId || !inspResultId || !creMbrId) {
            console.warn("필수 data 속성이 누락되었습니다:", wrapper);
            return;
        }

        const key = `${evitId}-${inspResultId}-${creMbrId}`;
        console.log(`검색 중인 키: ${key}`); // 키 검색 확인
        const tempData = tempDataMap[key];
        if (tempData) {
            console.log(`적용할 데이터: ${key}`, tempData); // 데이터 적용 확인
            const inspectionContentWrapper = wrapper;

            applyAnswerContent(inspectionContentWrapper, tempData.answerContent);
            console.log(`Calling applyDetailContent for key: ${key}`); // 호출 확인
            applyDetailContent(inspectionContentWrapper, tempData);
        } else {
            console.warn(`TempDataMap에 존재하지 않는 키: ${key}`);
        }
    });
}


function applyAnswerContent(wrapper, answerContent) {
    if (!answerContent) {
        console.log("답변 내용이 없습니다.");
        return;
    }

    // 2-choice
    const answerButtons = wrapper.querySelectorAll('.answer-btn');
    if (answerButtons.length > 0) {
        answerButtons.forEach(btn => {
            if (btn.getAttribute('data-option-value') === answerContent) {
                btn.classList.add('active');
                // 이벤트 트리거를 통해 필드 활성화
                btn.click();
                console.log(`Button activated: ${btn.textContent}`);
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
            console.log(`Radio checked: ${radio.value}`);
        } else {
            radio.checked = false;
        }
    });
}

function applyDetailContent(wrapper, tempData) {
    console.log(`applyDetailContent 호출: evitId=${tempData.evitId}`, tempData);

    const positiveAnswers = ["적합", "매우좋음", "좋음", "보통"];
    const isPositiveAnswer = positiveAnswers.includes(tempData.answerContent);

    const detailContent = wrapper.querySelector('.detail-content');
    const locationContent = wrapper.querySelector('.location-content');

    console.log(`evitId=${tempData.evitId}, isPositiveAnswer=${isPositiveAnswer}`);

    if (!detailContent) {
        console.error(`No .detail-content found for wrapper with evitId=${tempData.evitId}`);
        return;
    }

    if (!locationContent) {
        console.error(`No .location-content found for wrapper with evitId=${tempData.evitId}`);
        return;
    }

    if (isPositiveAnswer) {
        // 긍정적인 답변인 경우 하위 필드 비활성화 및 값 초기화
        disableAndClearFields(detailContent);
        disableAndClearFields(locationContent);

        const caupvdInput = detailContent.querySelector('.caupvd');
        if (caupvdInput) {
            caupvdInput.value = '';
            caupvdInput.disabled = true;
            console.log(`caupvdInput 초기화 및 비활성화 for evitId=${tempData.evitId}`);
        }

        const etcInput = locationContent.querySelector('.etc-input');
        if (etcInput) {
            etcInput.value = '';
            etcInput.disabled = true;
            console.log(`etcInput 초기화 및 비활성화 for evitId=${tempData.evitId}`);
        }
    } else {
        // 부정적인 답변인 경우 하위 필드 활성화 및 값 적용
        enableFields(detailContent);
        enableFields(locationContent);
        console.log(`Detail 및 Location 필드 활성화 for evitId=${tempData.evitId}`);

        // 제품명/상세위치
        const productNameInput = detailContent.querySelector('.product-name');
        if (productNameInput) {
            console.log(`Before setting product-name: ${productNameInput.value}`);
            productNameInput.value = tempData.pdtNmDtplc || '';
            console.log(`After setting product-name: ${productNameInput.value}`);
        } else {
            console.error(`.product-name input not found for evitId=${tempData.evitId}`);
        }

        // 위반수량
        const violationQuantityInput = detailContent.querySelector('.violation-quantity');
        if (violationQuantityInput) {
            console.log(`Before setting violation-quantity: ${violationQuantityInput.value}`);
            violationQuantityInput.value = tempData.vltCnt || '';
            console.log(`After setting violation-quantity: ${violationQuantityInput.value}`);
        } else {
            console.error(`.violation-quantity input not found for evitId=${tempData.evitId}`);
        }

        // 원인
        const reasonTextarea = detailContent.querySelector('.reason');
        if (reasonTextarea) {
            console.log(`Before setting reason: ${reasonTextarea.value}`);
            reasonTextarea.value = tempData.vltCause || '';
            console.log(`After setting reason: ${reasonTextarea.value}`);
        } else {
            console.error(`.reason textarea not found for evitId=${tempData.evitId}`);
        }

        // 개선조치사항
        const actionTextarea = detailContent.querySelector('.action');
        if (actionTextarea) {
            console.log(`Before setting action: ${actionTextarea.value}`);
            actionTextarea.value = tempData.instruction || '';
            console.log(`After setting action: ${actionTextarea.value}`);
        } else {
            console.error(`.action textarea not found for evitId=${tempData.evitId}`);
        }

        // 위반사항
        const violationTextarea = detailContent.querySelector('.violation');
        if (violationTextarea) {
            console.log(`Before setting violation: ${violationTextarea.value}`);
            violationTextarea.value = tempData.vltContent || '';
            console.log(`After setting violation: ${violationTextarea.value}`);
        } else {
            console.error(`.violation textarea not found for evitId=${tempData.evitId}`);
        }

        // 귀책사유 설정
        setResponsibility(detailContent, tempData);
        console.log(`귀책사유 설정 완료 for evitId=${tempData.evitId}`);

        // 위치정보 설정
        setLocation(locationContent, tempData);
        console.log(`위치정보 설정 완료 for evitId=${tempData.evitId}`);
    }

    // 사진 설정
    console.log("Setting photo paths:", tempData.photos);

    if (tempData.photos && Array.isArray(tempData.photos)) {
        const s3PhotoPaths = tempData.photos.filter(photo => photo && photo.photoPath && !photo.photoPath.startsWith('/'));
        setPhotoPaths(wrapper, s3PhotoPaths);
    } else {
        console.warn(`tempData.photos가 유효하지 않습니다:`, tempData.photos);
    }
}




//귀책사유와 위치정보 설정 함수
function setResponsibility(detailContent, tempData) {
    const caupvdCdValueMap = {
        "C001": "점주",
        "C002": "SV",
        "C003": "직원",
        "C004": "기타"
    };

    let responsibilityValue = tempData.caupvdCd && caupvdCdValueMap[tempData.caupvdCd]
        ? caupvdCdValueMap[tempData.caupvdCd]
        : "기타";

    console.log(`Responsibility Value: ${responsibilityValue} for evitId=${tempData.evitId}`);

    const responsibilityRadios = detailContent.querySelectorAll(`input[name="responsibility_${tempData.evitId}"]`);
    responsibilityRadios.forEach(radio => {
        if (radio.value === responsibilityValue) {
            radio.checked = true;
            radio.dispatchEvent(new Event('change'));
            console.log(`Responsibility radio checked: ${radio.value} for evitId=${tempData.evitId}`);
        } else {
            radio.checked = false;
        }
    });

    if (responsibilityValue === "기타") {
        const caupvdInput = detailContent.querySelector('.caupvd');
        if (caupvdInput) {
            caupvdInput.value = tempData.caupvdCd || '';
            caupvdInput.disabled = false;
            console.log(`caupvdInput 값 설정: ${caupvdInput.value} for evitId=${tempData.evitId}`);
        }
    } else {
        const caupvdInput = detailContent.querySelector('.caupvd');
        if (caupvdInput) {
            caupvdInput.value = '';
            caupvdInput.disabled = true;
            console.log(`caupvdInput 초기화 및 비활성화 for evitId=${tempData.evitId}`);
        }
    }
}


function setLocation(locationContent, tempData) {
    // tempData.location 또는 tempData.vltPlcCd를 사용하여 위치 정보를 설정
    const vltPlcCdValueMap = {
        "VP001": "매장",
        "VP002": "주방",
        "VP003": "카페",
        "VP004": "기타"
    };

    let locationValue = tempData.vltPlcCd && vltPlcCdValueMap[tempData.vltPlcCd]
        ? vltPlcCdValueMap[tempData.vltPlcCd]
        : "기타";

    console.log(`Location Value: ${locationValue} for evitId=${tempData.evitId}`);

    const locationRadios = locationContent.querySelectorAll(`input[name="location_${tempData.evitId}"]`);
    locationRadios.forEach(radio => {
        if (radio.value === locationValue) {
            radio.checked = true;
            radio.dispatchEvent(new Event('change'));
            console.log(`Location radio checked: ${radio.value} for evitId=${tempData.evitId}`);
        } else {
            radio.checked = false;
        }
    });

    if (locationValue === "기타") {
        const etcInput = locationContent.querySelector('.etc-input');
        if (etcInput) {
            etcInput.value = tempData.vltPlcCd || '';
            etcInput.disabled = false;
            console.log(`etcInput 값 설정: ${etcInput.value} for evitId=${tempData.evitId}`);
        }
    } else {
        const etcInput = locationContent.querySelector('.etc-input');
        if (etcInput) {
            etcInput.value = '';
            etcInput.disabled = true;
            console.log(`etcInput 초기화 및 비활성화 for evitId=${tempData.evitId}`);
        }
    }
}

// S3 베이스 URL을 사용하는 대신, /download 엔드포인트를 사용
function setPhotoPaths(contentWrapper, photos) {
    if (!photos || !Array.isArray(photos)) {
        console.warn("photoPaths가 유효하지 않습니다:", photos);
        return;
    }

    const photoBoxes = contentWrapper.querySelectorAll('.photo-box');

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
    photos.forEach((photo, index) => {
        const path = photo.photoPath;
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

    return fetch(url)
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

                // 데이터를 변환하여 inspectionData에 저장
                processFetchedData(data);

                // 세부결과 탭의 상세 항목을 동적으로 생성
                generateDetailedItems();
                initializeDetailButtons();

                // 점수 계산 및 .score-table 업데이트
                const scores = calculateScores(inspectionData, temporaryInspectionData);
                updateScoreTable(scores);

                // 등급 및 백분율 계산 및 업데이트
                updateGradeAndPercentage(scores.totalScore, inspectionData);

                // 첫 번째 탭과 콘텐츠를 active 상태로 설정
                const firstTab = document.querySelector(".inspection-tab");
                const firstContent = document.querySelector(".inspection-list");

                if (firstTab) {
                    firstTab.classList.add("active");
                }

                if (firstContent) {
                    firstContent.classList.add("active");
                }

                return data;
            } else {
                alert("점검 상세 데이터가 없습니다.");
                return [];
            }
        })
        .catch((error) => {
            console.error("데이터 가져오기 실패:", error);
            alert("점검 데이터를 불러오는 데 실패했습니다.");
            return [];
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
            let category = categoryMap[masterCtgId];
            if (!category) {
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
                let question = subcategory.questions.find(q => q.evitId === item.evitId);
                if (!question) {
                    let questionType = "";
                    if (item.evitTypeCd === "ET001") {
                        questionType = "2-choice";
                    } else if (item.evitTypeCd === "ET004") {
                        questionType = "5-choice";
                    }

                    // penalty 및 bsnSspnDaynum 로그 추가
                    console.log(`evitId ${item.evitId} - Penalty: ${item.penalty}, Closure Days: ${item.bsnSspnDaynum}`);

                    question = {
                        evitId: item.evitId,
                        questionText: item.evitContent,
                        questionType: questionType,
                        options: [], // 옵션과 점수를 함께 저장
                        creMbrId: item.creMbrId || item.mbrId || 'defaultCreMbrId',
                        inspResultId: item.inspResultId || globalInspResultId,
                        penalty: item.penalty || 0, // 추가된 부분
                        bsnSspnDaynum: item.bsnSspnDaynum || 0, // 추가된 부분
                        scoreMap: {} // 옵션별 점수 매핑
                    };
                    subcategory.questions.push(question);

                    // 로그 추가
                    console.log(`Question created:`, question);
                }

                // 옵션 추가
                if (item.chclstContent) {
                    question.options.push(item.chclstContent);
                    // 옵션에 대한 점수 매핑
                    question.scoreMap[item.chclstContent] = parseFloat(item.scoreEvitChclst) || 0;
                    console.log(`Option "${item.chclstContent}" mapped to score ${question.scoreMap[item.chclstContent]} for evitId ${question.evitId}`);
                }
            }
        }
    });

    // 각 문항의 최대 점수를 계산하여 question.score에 할당
    Object.values(categoryMap).forEach(category => {
        category.subcategories.forEach(subcategory => {
            subcategory.questions.forEach(question => {
                const scores = Object.values(question.scoreMap);
                question.score = scores.length > 0 ? Math.max(...scores) : 0;
                console.log(`Question evitId ${question.evitId} - Max Score: ${question.score}`);
            });
        });
    });

    // 대분류 이름 및 categoryId 설정
    Object.values(categoryMap).forEach((category) => {
        if (!category.categoryName) {
            const item = data.find(
                (d) =>
                    d.ctgId == category.categoryId &&
                    (d.masterCtgId == null || d.masterCtgId === 0),
            );
            category.categoryName = item ? item.ctgNm : "Unknown Category";
            category.categoryId = item ? item.ctgId : category.categoryId; // Ensure categoryId is set
        }
    });

    inspectionData = Object.values(categoryMap);

    console.log("Processed Inspection Data:", inspectionData); // 디버깅 로그
    return inspectionData;
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

//총점, 적합 수, 부적합 수, 문항 수를 계산하는 함수
function calculateScores(inspectionData, temporaryData) {
    let totalScore = 0;
    let appropriateCount = 0;
    let inappropriateCount = 0;
    let totalQuestionCount = 0;
    let totalPossibleScore = 0; // 총 가능한 점수 추가

    // 상태 카운트 정의
    const appropriateStatuses = ["적합", "보통", "좋음", "매우좋음"];
    const inappropriateStatuses = ["부적합", "나쁨", "매우나쁨"];

    // Temporary Data Map: evitId -> answerContent
    const tempDataMap = {};
    if (temporaryData && temporaryData.inspections && temporaryData.inspections.length > 0) {
        temporaryData.inspections.forEach(cat => {
            if (cat.subcategories) {
                cat.subcategories.forEach(subcat => {
                    // answerContent을 우선적으로 사용하고, 없으면 chclstContent 사용
                    tempDataMap[subcat.evitId] = subcat.answerContent || subcat.chclstContent || "";
                });
            }
        });
    }

    console.log("Temporary Data Map for score calculation:", tempDataMap);

    // Iterate through inspectionData to calculate scores
    inspectionData.forEach(category => {
        category.subcategories.forEach(subcategory => {
            subcategory.questions.forEach(question => {
                totalQuestionCount++;

                // 모든 옵션의 점수를 총 가능한 점수에 더함
                Object.values(question.scoreMap).forEach(score => {
                    totalPossibleScore += score;
                });

                const answer = tempDataMap[question.evitId];

                if (answer) {
                    const score = question.scoreMap[answer] || 0;
                    totalScore += score;
                    console.log(`evitId: ${question.evitId}, Answer: ${answer}, Score: ${score}`);

                    // 상태 카운트
                    if (appropriateStatuses.includes(answer)) {
                        appropriateCount++;
                    } else if (inappropriateStatuses.includes(answer)) {
                        inappropriateCount++;
                    }
                } else {
                    console.warn(`No answer found for evitId: ${question.evitId}`);
                }
            });
        });
    });

    console.log(`총점: ${totalScore}, 적합 수: ${appropriateCount}, 부적합 수: ${inappropriateCount}, 문항 수: ${totalQuestionCount}, 총 가능한 점수: ${totalPossibleScore}`);

    return {
        totalScore,
        appropriateCount,
        inappropriateCount,
        totalQuestionCount,
        totalPossibleScore // 반환 객체에 추가
    };

}

//.score-table을 업데이트하는 함수
function updateScoreTable(scores) {
    const scoreTableRow = document.querySelector(".score-table tbody tr");
    if (scoreTableRow) {
        const tds = scoreTableRow.querySelectorAll("td");
        if (tds.length === 4) {
            tds[0].textContent = scores.totalScore;
            tds[1].textContent = scores.appropriateCount;
            tds[2].textContent = scores.inappropriateCount;
            tds[3].textContent = scores.totalQuestionCount;
        } else {
            console.warn("score-table의 <td> 개수가 예상과 다릅니다.");
        }
    } else {
        console.warn(".score-table tbody tr을 찾을 수 없습니다.");
    }
}

// 점수를 추출하여 다른 요소에 반영하는 함수
function updateInspectionTotalScore() {
    // .total-score-text > span 요소에서 점수 추출
    const totalScoreSpan = document.querySelector('.total-score-text > span');
    if (totalScoreSpan) {
        const totalScoreValue = totalScoreSpan.textContent.trim();
        console.log('Extracted total score text:', totalScoreValue);

        if (totalScoreValue) {
            // .inspection-total-score > p > span 요소를 찾아서 점수 반영
            const inspectionTotalScoreSpan = document.querySelector('.inspection-total-score > p > span');
            if (inspectionTotalScoreSpan) {
                inspectionTotalScoreSpan.textContent = totalScoreValue;
                console.log(`Inspection total score updated to: ${totalScoreValue}`);
            } else {
                console.warn('.inspection-total-score > p > span 요소를 찾을 수 없습니다.');
            }
        } else {
            console.warn('.total-score-text > span에서 점수를 추출할 수 없습니다.');
        }
    }
}

// MutationObserver 설정
const targetNode = document.querySelector('.total-score-text > span');
if (targetNode) {
    const observer = new MutationObserver(mutationsList => {
        for (let mutation of mutationsList) {
            if (mutation.type === 'childList') {
                console.log('Changed text content:', mutation.target.textContent.trim());
                updateInspectionTotalScore(); // 값이 변경될 때 함수 호출
            }
        }
    });
    observer.observe(targetNode, { childList: true });
}

// 함수 호출하여 업데이트 수행
updateInspectionTotalScore();


//등급과 백분율을 계산하여 업데이트하는 함수
function updateGradeAndPercentage(totalScore, inspectionData) {
    // 총 가능한 점수 계산 (모든 문항의 점수 합)
    let totalPossibleScore = 0;
    inspectionData.forEach(category => {
        category.subcategories.forEach(subcategory => {
            subcategory.questions.forEach(question => {
                totalPossibleScore += question.score || 0;
            });
        });
    });

    // 백분율 계산
    let percentage = totalPossibleScore > 0 ? (totalScore / totalPossibleScore) * 100 : 0;
    percentage = Math.round(percentage); // 소수점 제거

    // 등급 매핑
    let grade = 'F';
    if (percentage >= 90) {
        grade = 'A';
    } else if (percentage >= 80) {
        grade = 'B';
    } else if (percentage >= 70) {
        grade = 'C';
    } else if (percentage >= 60) {
        grade = 'D';
    } else if (percentage >= 50) {
        grade = 'E';
    }

    // 등급과 환산된 점수를 HTML에 반영
    const gradeTextSpan = document.querySelector(".grade-text span");
    const totalScoreTextSpan = document.querySelector(".total-score-text span");
    if (gradeTextSpan && totalScoreTextSpan) {
        gradeTextSpan.textContent = grade;
        totalScoreTextSpan.textContent = percentage;
    } else {
        console.warn("grade-text span 또는 total-score-text span을 찾을 수 없습니다.");
    }
}

//카테고리별 문항의 갯수를 세는 함수
let grandTotalFine = 0;
let grandTotalClosureDays = 0;

function calculateCategoryScores(category, temporaryData) {
    const appropriateStatuses = ["적합", "보통", "좋음", "매우좋음"];
    const inappropriateStatuses = ["부적합", "나쁨", "매우나쁨"];

    let categoryScore = 0;
    let categoryAppropriate = 0;
    let categoryInappropriate = 0;
    let categoryQuestionCount = 0;
    let totalFine = 0; // 카테고리의 과태료 합산 변수
    let totalClosureDays = 0; // 카테고리의 영업정지일수 합산 변수

    // Temporary Data Map: evitId -> answerContent
    const tempDataMap = {};
    if (temporaryData && temporaryData.inspections && temporaryData.inspections.length > 0) {
        temporaryData.inspections.forEach(cat => {
            if (cat.subcategories && cat.subcategories.length > 0) {
                cat.subcategories.forEach(subcat => {
                    const evitId = String(subcat.evitId).trim();
                    const answerContent = subcat.answerContent ? subcat.answerContent.trim() : (subcat.chclstContent ? subcat.chclstContent.trim() : "");
                    tempDataMap[evitId] = answerContent;
                    console.log(`Mapped evitId: ${evitId} to answerContent: "${answerContent}"`);
                });
            }
        });
    }

    console.log("Temporary Data Map for category scores and penalties:", tempDataMap);

    // 카테고리의 모든 문항 점수 및 과태료/영업정지일수 합산
    category.subcategories.forEach(subcategory => {
        subcategory.questions.forEach(question => {
            categoryQuestionCount++;
            const evitIdStr = String(question.evitId).trim();
            const answer = tempDataMap[evitIdStr];

            if (answer) {
                const score = question.scoreMap[answer] || 0;
                categoryScore += score;
                console.log(`Category - evitId: ${question.evitId}, Answer: ${answer}, Score: ${score}`);

                if (appropriateStatuses.includes(answer)) {
                    categoryAppropriate++;
                } else if (inappropriateStatuses.includes(answer)) {
                    categoryInappropriate++;
                    totalFine += question.penalty || 0;
                    totalClosureDays += question.bsnSspnDaynum || 0;
                    console.log(`Penalty for evitId ${question.evitId}: ${question.penalty}, Closure Days: ${question.bsnSspnDaynum}`);
                }
            } else {
                console.warn(`No answer found for evitId: ${question.evitId}`);
            }
        });
    });

    // 각 카테고리의 과태료와 영업정지일수를 총합에 누적
    grandTotalFine += totalFine;
    grandTotalClosureDays += totalClosureDays;

    console.log(`카테고리: ${category.categoryName}, 총점: ${categoryScore}, 적합 수: ${categoryAppropriate}, 부적합 수: ${categoryInappropriate}, 문항 수: ${categoryQuestionCount}`);
    console.log(`총 과태료: ${totalFine}, 총 영업정지일수: ${totalClosureDays}`);
    console.log(`현재까지 누적된 총 과태료: ${grandTotalFine}, 누적된 총 영업정지일수: ${grandTotalClosureDays}`);

    // 총합을 해당 요소에 표시
    const fineAmountSpan = document.querySelector('.fine-amount > span');
    const closureDaysSpan = document.querySelector('.closure-days > span');

    if (fineAmountSpan) {
        fineAmountSpan.textContent = grandTotalFine.toLocaleString(); // 천 단위 콤마 추가
    } else {
        console.warn('.fine-amount > span 요소를 찾을 수 없습니다.');
    }

    if (closureDaysSpan) {
        closureDaysSpan.textContent = grandTotalClosureDays.toLocaleString();
    } else {
        console.warn('.closure-days > span 요소를 찾을 수 없습니다.');
    }

    return {
        totalScore: categoryScore,
        appropriateCount: categoryAppropriate,
        inappropriateCount: categoryInappropriate,
        totalQuestionCount: categoryQuestionCount,
        totalFine,
        totalClosureDays
    };
}

// 탭 초기화 함수
function initializeTabs() {
    const tabs = document.querySelectorAll(".inspection-tab");
    const reportSummary = document.querySelector(".report-summary");
    const detailedResult = document.querySelector(".detailed-result");
    const inspectionList = document.getElementById("inspection-middleCheck-list");

    // 기본 상태 설정: 보고서 간략은 보이기, 세부결과는 숨기기
    reportSummary.style.display = "flex";
    detailedResult.style.display = "none";
    inspectionList.style.display = "none";

    // 탭 클릭 이벤트 추가
    tabs.forEach(tab => {
        tab.addEventListener("click", function () {
            tabs.forEach(tab => tab.classList.remove("active"));

            this.classList.add("active");

            const selectedTab = this.getAttribute("data-tab");

            if (selectedTab === "report-summary") {
                reportSummary.style.display = "flex";
                detailedResult.style.display = "none";
                inspectionList.style.display = "none";
            } else if (selectedTab === "detailed-result") {
                reportSummary.style.display = "none";
                detailedResult.style.display = "flex";
                inspectionList.style.display = "none";
            }
        });
    });
}

// 세부결과 탭의 상세 항목을 동적으로 생성하는 함수
function generateDetailedItems() {
    const detailedSection = document.querySelector('.detailed-section');
    if (!detailedSection) {
        console.error("detailed-section 요소를 찾을 수 없습니다.");
        return;
    }

    detailedSection.innerHTML = ''; // 기존 내용 제거

    console.log(`@@@@@@@@@@@`, inspectionData);

    inspectionData.forEach((category, index) => {
        // detailed-item 생성
        const detailedItem = document.createElement('div');
        detailedItem.classList.add('detailed-item');

        // item-header 생성
        const itemHeader = document.createElement('div');
        itemHeader.classList.add('item-header');

        // 카테고리 이름 h3 생성
        const h3 = document.createElement('h3');
        h3.textContent = category.categoryName || "Unknown Category";

        // 상세보기 버튼 생성
        const detailBtn = document.createElement('button');
        detailBtn.classList.add('detail-btn');
        detailBtn.textContent = '상세보기';

        // item-header에 추가
        itemHeader.appendChild(h3);
        itemHeader.appendChild(detailBtn);

        // 테이블 생성
        const table = document.createElement('table');
        table.classList.add('detailed-table');

        // 테이블 헤더 생성
        const thead = document.createElement('thead');
        const trHead = document.createElement('tr');
        ['총점', '적합 수', '부적합 수', '문항 수'].forEach(text => {
            const th = document.createElement('th');
            th.textContent = text;
            trHead.appendChild(th);
        });
        thead.appendChild(trHead);

        // 점수 계산
        const categoryScores = calculateCategoryScores(category, temporaryInspectionData);

        // 테이블 바디 생성
        const tbody = document.createElement('tbody');
        const trBody = document.createElement('tr');
        [categoryScores.totalScore, categoryScores.appropriateCount, categoryScores.inappropriateCount, categoryScores.totalQuestionCount].forEach(value => {
            const td = document.createElement('td');
            td.textContent = value;
            trBody.appendChild(td);
        });
        tbody.appendChild(trBody);

        table.appendChild(thead);
        table.appendChild(tbody);

        // detailed-item에 추가
        detailedItem.appendChild(itemHeader);
        detailedItem.appendChild(table);

        // detailed-section에 추가
        detailedSection.appendChild(detailedItem);
    });
}





// 상세보기 버튼 초기화 함수
function initializeDetailButtons() {
    const detailButtons = document.querySelectorAll(".detail-btn");
    const inspectionList = document.getElementById("inspection-middleCheck-list");

    detailButtons.forEach((button, index) => {
        button.addEventListener("click", function () {
            // 해당 카테고리 데이터 가져오기
            const category = inspectionData[index];

            // item-title 요소 가져오기
            const itemTitle = inspectionList.querySelector(".item-title");
            if (!itemTitle) {
                console.error("item-title 요소를 찾을 수 없습니다.");
                return;
            }

            // item-title 설정
            itemTitle.textContent = category.categoryName;

            // 하단 상세 리스트 생성
            generateInspectionList(category);

            // 상세보기 버튼 클릭 시 inspection-middleCheck-list를 보이기
            inspectionList.style.display = "block";
            inspectionList.scrollIntoView({ behavior: 'smooth', block: 'start' }); //스크롤 이동

            // 임시 저장된 데이터가 있을 경우 해당 데이터를 적용
            if (temporaryInspectionData) {
                applyTemporaryData(temporaryInspectionData);

                // 점수 재계산 및 테이블 업데이트
                const scores = calculateScores(inspectionData, temporaryInspectionData);
                updateScoreTable(scores);
                updateGradeAndPercentage(scores.totalScore, inspectionData);

                // 과태료와 영업정지일수 합산 및 업데이트
                // updateFineAndClosureSums();
            }
        });
    });
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




// 하단의 상세 리스트를 생성하는 함수
// 세부결과 탭의 상세 항목을 동적으로 생성하는 함수
function generateInspectionList(category) {
    const inspectionList = document.getElementById('inspection-middleCheck-list');
    if (!inspectionList) {
        console.error("inspection-middleCheck-list 요소를 찾을 수 없습니다.");
        return;
    }

    const checkItem = inspectionList.querySelector('.check-item');
    if (!checkItem) {
        console.error(".check-item 요소를 찾을 수 없습니다.");
        return;
    }

    checkItem.innerHTML = '';

    // 임시 저장된 데이터를 기반으로 매핑 생성
    const tempDataMap = {};
    if (temporaryInspectionData && temporaryInspectionData.inspections) {
        temporaryInspectionData.inspections.forEach(cat => {
            if (cat.subcategories) {
                cat.subcategories.forEach(subcat => {
                    tempDataMap[subcat.evitId] = subcat;
                });
            }
        });
    }

    // 각 서브카테고리에 대해 처리
    category.subcategories.forEach(subcategory => {
        // check-subitem 생성 (서브카테고리당 한 번)
        const checkSubitem = document.createElement('div');
        checkSubitem.classList.add('check-subitem');

        // subitem-title 생성 (서브카테고리 이름)
        const subitemTitle = document.createElement('p');
        subitemTitle.classList.add('subitem-title');
        subitemTitle.textContent = subcategory.subcategoryName || "Unknown Subcategory";
        checkSubitem.appendChild(subitemTitle);

        // 각 문항에 대해 subitem-info-wrapper 생성
        subcategory.questions.forEach(question => {
            // subitem-info-wrapper 생성
            const subitemInfoWrapper = document.createElement('div');
            subitemInfoWrapper.classList.add('subitem-info-wrapper');

            // 질문 텍스트 추가
            const questionP = document.createElement('p');
            questionP.textContent = question.questionText;
            subitemInfoWrapper.appendChild(questionP);

            // 정보 박스 생성
            const infoUl = document.createElement('ul');
            infoUl.classList.add('subitem-info');

            // 답변 상태에 따른 과태료 및 영업정지 표시
            const tempData = tempDataMap[question.evitId];
            const answerContent = tempData ? tempData.answerContent : null;
            const appropriateStatuses = ["적합", "보통", "좋음", "매우좋음"];
            const inappropriateStatuses = ["부적합", "나쁨", "매우나쁨"];

            let penaltyDisplay = '-';
            let bsnSspnDaynumDisplay = '-';
            let selectedScore = 0;

            if (answerContent) {
                if (inappropriateStatuses.includes(answerContent)) {
                    penaltyDisplay = `${question.penalty} 만원`;
                    bsnSspnDaynumDisplay = `${question.bsnSspnDaynum} 일`;
                }
                selectedScore = question.scoreMap[answerContent] || 0;
            }

            // 배점/결과, 과태료, 영업정지 정보 생성
            const infoItems = [
                { label: '배점/결과', value: `${question.score} / ${selectedScore}`, class: 'score' },
                { label: '과태료', value: penaltyDisplay },
                { label: '영업정지', value: bsnSspnDaynumDisplay }
            ];

            infoItems.forEach(item => {
                const li = document.createElement('li');
                li.classList.add('info-box');

                const p = document.createElement('p');
                p.textContent = item.label;

                const span = document.createElement('span');
                if (item.class) {
                    span.classList.add(item.class);
                }
                span.textContent = item.value;

                li.appendChild(p);
                li.appendChild(span);

                infoUl.appendChild(li);
            });

            subitemInfoWrapper.appendChild(infoUl);

            // "수정하기" 버튼 생성
            const editBtn = document.createElement('button');
            editBtn.classList.add('edit-btn');
            editBtn.textContent = '수정하기';
            subitemInfoWrapper.appendChild(editBtn);

            // "수정하기" 버튼 이벤트 리스너 추가
            editBtn.addEventListener('click', function () {
                // 해당 문항의 contentWrapper를 토글
                const contentWrapper = subitemInfoWrapper.querySelector('.inspection-content-wrapper');
                if (!contentWrapper) {
                    console.error("inspection-content-wrapper 요소를 찾을 수 없습니다.");
                    return;
                }

                if (contentWrapper.style.height === "0px" || contentWrapper.style.height === "") {
                    openContent(contentWrapper);
                } else {
                    closeContent(contentWrapper);
                }
            });

            // inspection-content-wrapper 생성 및 데이터 속성 설정
            const contentWrapper = document.createElement('div');
            contentWrapper.classList.add('inspection-content-wrapper');
            contentWrapper.setAttribute('data-evit-id', question.evitId);
            contentWrapper.setAttribute('data-insp-result-id', globalInspResultId);
            contentWrapper.setAttribute('data-cre-mbr-id', question.creMbrId || 'defaultCreMbrId');
            contentWrapper.style.height = '0px'; // 초기에는 숨김

            // 답변 섹션 생성
            let answerSection;
            if (question.questionType === '2-choice') {
                answerSection = document.createElement('div');
                answerSection.classList.add('answer-section');

                question.options.forEach(option => {
                    const btn = document.createElement('button');
                    btn.classList.add('answer-btn');
                    btn.textContent = option;
                    btn.dataset.questionId = question.evitId; // `evitId` 사용
                    btn.dataset.optionValue = option;
                    btn.type = "button"; // 버튼의 기본 동작 방지

                    // 답변 버튼 클릭 시 선택 상태 토글 및 하위 입력 필드 활성화
                    // btn.addEventListener("click", function () {
                    //     // 같은 문항의 다른 버튼들 비활성화
                    //     subitemInfoWrapper.querySelectorAll(`.answer-btn[data-question-id="${question.evitId}"]`).forEach((b) => {
                    //         b.classList.remove("active");
                    //     });
                    //     this.classList.add("active");
                    //
                    //     // 해당 질문의 하위 입력 필드 찾기
                    //     const detailContent = contentWrapper.querySelector(".detail-content");
                    //     const storeInfo = contentWrapper.querySelector(".store-info");
                    //     const locationInputs = storeInfo.querySelectorAll(`input[name='location_${question.evitId}']`);
                    //     const locationContent = contentWrapper.querySelector(".location-content");
                    //
                    //     if (option === "부적합") {
                    //         // "부적합" 선택 시 하위 입력 필드 활성화 (etc-input과 caupvd 제외)
                    //         detailContent.querySelectorAll("input, textarea, select").forEach((input) => {
                    //             if (!input.classList.contains("caupvd") && !input.name.startsWith("etc_")) {
                    //                 input.disabled = false;
                    //             }
                    //         });
                    //
                    //         // 위치정보 라디오 버튼 활성화
                    //         locationInputs.forEach((input) => {
                    //             input.disabled = false;
                    //         });
                    //     } else {
                    //         // "적합" 선택 시 하위 입력 필드 비활성화 및 초기화 (etc-input과 caupvd 제외)
                    //         detailContent.querySelectorAll("input, textarea, select").forEach((input) => {
                    //             if (!input.classList.contains("caupvd") && !input.name.startsWith("etc_")) {
                    //                 input.disabled = true;
                    //                 if (input.tagName.toLowerCase() === "textarea") {
                    //                     input.value = "";
                    //                 } else if (input.tagName.toLowerCase() === "input" && input.type === "radio") {
                    //                     input.checked = false;
                    //                 }
                    //             }
                    //         });
                    //
                    //         // 위치정보 라디오 버튼 비활성화 및 초기화
                    //         locationInputs.forEach((input) => {
                    //             input.disabled = true;
                    //             if (input.type === "radio") {
                    //                 input.checked = false;
                    //             }
                    //         });
                    //
                    //         // 기타사항 입력 초기화
                    //         const etcInput = storeInfo.querySelector(`textarea[name='etc_${question.evitId}']`);
                    //         if (etcInput) {
                    //             etcInput.disabled = true;
                    //             etcInput.value = "";
                    //         }
                    //     }
                    // });
                    btn.addEventListener("click", function () {
                        // 같은 문항의 다른 버튼들 비활성화
                        subitemInfoWrapper.querySelectorAll(`.answer-btn[data-question-id="${question.evitId}"]`).forEach((b) => {
                            b.classList.remove("active");
                        });
                        this.classList.add("active");

                        // 해당 질문의 하위 입력 필드 찾기
                        const detailContent = contentWrapper.querySelector(".detail-content");
                        const storeInfo = contentWrapper.querySelector(".store-info");
                        const locationInputs = storeInfo.querySelectorAll(`input[name='location_${question.evitId}']`);
                        const locationContent = contentWrapper.querySelector(".location-content");

                        if (option === "부적합") {
                            // "부적합" 선택 시 하위 입력 필드 활성화
                            detailContent.querySelectorAll("input, textarea, select").forEach((input) => {
                                input.disabled = false;
                            });

                            // 위치정보 라디오 버튼 활성화
                            locationInputs.forEach((input) => {
                                input.disabled = false;
                            });

                            // 기타사항 입력 활성화
                            const etcInput = storeInfo.querySelector(`textarea[name='etc_${question.evitId}']`);
                            if (etcInput) {
                                etcInput.disabled = false;
                            }
                        } else {
                            // "적합" 선택 시 하위 입력 필드 비활성화 및 초기화
                            detailContent.querySelectorAll("input, textarea, select").forEach((input) => {
                                input.disabled = true;
                                if (input.tagName.toLowerCase() === "textarea" || input.tagName.toLowerCase() === "input") {
                                    input.value = "";
                                }
                                if (input.type === "radio" || input.type === "checkbox") {
                                    input.checked = false;
                                }
                            });

                            // 위치정보 라디오 버튼 비활성화 및 초기화
                            locationInputs.forEach((input) => {
                                input.disabled = true;
                                input.checked = false;
                            });

                            // 기타사항 입력 비활성화 및 초기화
                            const etcInput = storeInfo.querySelector(`textarea[name='etc_${question.evitId}']`);
                            if (etcInput) {
                                etcInput.disabled = true;
                                etcInput.value = "";
                            }
                        }
                    });

                    answerSection.appendChild(btn);
                });
            } else if (question.questionType === '5-choice') {
                answerSection = document.createElement('div');
                answerSection.classList.add('answer-section2');

                question.options.forEach((option) => {
                    const label = document.createElement("label");
                    label.classList.add("radio-label2");

                    const input = document.createElement("input");
                    input.type = "radio";
                    input.name = `rating_${question.evitId}`;
                    input.value = option;

                    // 라디오 버튼 변경 시 하위 입력 필드 활성화
                    input.addEventListener("change", function () {
                        const detailContent = contentWrapper.querySelector(".detail-content");
                        const storeInfo = contentWrapper.querySelector(".store-info");
                        const locationInputs = storeInfo.querySelectorAll(`input[name='location_${question.evitId}']`);

                        if (option === "매우나쁨" || option === "나쁨") {
                            // "매우나쁨" 또는 "나쁨" 선택 시 하위 입력 필드 활성화 (etc-input과 caupvd 제외)
                            detailContent.querySelectorAll("input, textarea, select").forEach((input) => {
                                if (!input.classList.contains("caupvd") && !input.name.startsWith("etc_")) {
                                    input.disabled = false;
                                }
                            });

                            // 위치정보 라디오 버튼 활성화
                            locationInputs.forEach((input) => {
                                input.disabled = false;
                            });
                        } else {
                            // 그 외 선택 시 하위 입력 필드 비활성화 및 초기화 (etc-input과 caupvd 제외)
                            detailContent.querySelectorAll("input, textarea, select").forEach((input) => {
                                if (!input.classList.contains("caupvd") && !input.name.startsWith("etc_")) {
                                    input.disabled = true;
                                    if (input.tagName.toLowerCase() === "textarea") {
                                        input.value = "";
                                    } else if (input.tagName.toLowerCase() === "input" && input.type === "radio") {
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
                            const etcInput = storeInfo.querySelector(`textarea[name='etc_${question.evitId}']`);
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
            }

            contentWrapper.appendChild(answerSection);

            // 사진 업로드 섹션 생성
            const photoSection = document.createElement('div');
            photoSection.classList.add('photo-section');

            const photoButtons = document.createElement('div');
            photoButtons.classList.add('photo-buttons');

            const cameraBtn = document.createElement('button');
            cameraBtn.classList.add('photo-btn', 'camera-btn');
            cameraBtn.innerHTML = '<i class="fa-solid fa-camera"></i>사진촬영';
            cameraBtn.type = "button"; // 버튼의 기본 동작 방지
            photoButtons.appendChild(cameraBtn);

            const galleryBtn = document.createElement('button');
            galleryBtn.classList.add('photo-btn', 'gallery-btn');
            galleryBtn.innerHTML = '<i class="fa-regular fa-image"></i>갤러리';
            galleryBtn.type = "button"; // 버튼의 기본 동작 방지
            photoButtons.appendChild(galleryBtn);

            photoSection.appendChild(photoButtons);

            const photoBoxes = document.createElement('div');
            photoBoxes.classList.add('photo-boxes');

            for (let i = 0; i < 2; i++) { // 최대 2개
                const photoBox = document.createElement('div');
                photoBox.classList.add('photo-box');
                photoBox.textContent = i === 0 ? '사진 미등록' : '사진 미등록'; // 두 번째 박스도 초기 상태로 설정
                photoBoxes.appendChild(photoBox);
            }

            photoSection.appendChild(photoBoxes);

            // 사진 업로드 기능 설정
            setupPhotoUpload(photoBoxes, cameraBtn, galleryBtn, contentWrapper);

            contentWrapper.appendChild(photoSection);

            // 매장 정보 라디오 버튼 리스트 생성
            const storeInfo = document.createElement('div');
            storeInfo.classList.add('store-info');

            const tabSection = document.createElement('div');
            tabSection.classList.add('tab-section');

            const tabBtn1 = document.createElement('button');
            tabBtn1.classList.add('tab-btn', 'active');
            tabBtn1.textContent = '위치정보';
            tabBtn1.type = "button"; // 버튼의 기본 동작 방지
            tabSection.appendChild(tabBtn1);

            const tabBtn2 = document.createElement('button');
            tabBtn2.classList.add('tab-btn');
            tabBtn2.textContent = '상세입력';
            tabBtn2.type = "button"; // 버튼의 기본 동작 방지
            tabSection.appendChild(tabBtn2);

            tabBtn1.addEventListener('click', function() {
                // 탭 버튼의 활성화 상태 변경
                tabBtn1.classList.add('active');
                tabBtn2.classList.remove('active');

                // 콘텐츠 표시 설정
                locationContent.style.display = 'block';
                detailContent.style.display = 'none';

                adjustWrapperHeight(contentWrapper);
            });

            tabBtn2.addEventListener('click', function() {
                // 탭 버튼의 활성화 상태 변경
                tabBtn2.classList.add('active');
                tabBtn1.classList.remove('active');

                // 콘텐츠 표시 설정
                detailContent.style.display = 'block';
                locationContent.style.display = 'none';

                adjustWrapperHeight(contentWrapper);
            });

            storeInfo.appendChild(tabSection);

            // 위치정보 콘텐츠 생성
            const locationContent = document.createElement('div');
            locationContent.classList.add('content', 'location-content');

            const locationContentList = document.createElement('div');
            locationContentList.classList.add('location-content-list');

            ["매장", "카페", "주방", "기타"].forEach((location) => {
                const label = document.createElement("label");
                label.classList.add("radio-label");
                label.textContent = location;

                const input = document.createElement("input");
                input.type = "radio";
                input.name = `location_${question.evitId}`;
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

            locationContent.appendChild(locationContentList);

            // 기타사항 입력
            const otherInfo = document.createElement('div');
            otherInfo.classList.add('other-info');

            const otherLabel = document.createElement('label');
            otherLabel.textContent = '기타사항';
            otherInfo.appendChild(otherLabel);

            const etcInput = document.createElement('textarea');
            etcInput.classList.add('etc-input');
            etcInput.name = `etc_${question.evitId}`;
            etcInput.placeholder = '기타사항을 입력해주세요';
            etcInput.disabled = true; // 초기에는 비활성화
            otherInfo.appendChild(etcInput);

            locationContent.appendChild(otherInfo);

            storeInfo.appendChild(locationContent);

            // 상세입력 콘텐츠 생성
            const detailContent = document.createElement('div');
            detailContent.classList.add('content', 'detail-content');
            detailContent.style.display = 'none';

            const inputGroupCover = document.createElement('div');
            inputGroupCover.classList.add('input-group-cover');

            const inputGroup1 = document.createElement('div');
            inputGroup1.classList.add('input-group');

            const label1 = document.createElement('label');
            label1.textContent = '제품명 (또는 상세위치)';
            inputGroup1.appendChild(label1);

            const pdtNmDtplc = document.createElement('input');
            pdtNmDtplc.type = 'text';
            pdtNmDtplc.classList.add('product-name');
            pdtNmDtplc.placeholder = '제품명 입력';
            pdtNmDtplc.disabled = true; // 초기에는 비활성화
            inputGroup1.appendChild(pdtNmDtplc);

            inputGroupCover.appendChild(inputGroup1);

            const inputGroup2 = document.createElement('div');
            inputGroup2.classList.add('input-group');

            const label2 = document.createElement('label');
            label2.textContent = '위반수량';
            inputGroup2.appendChild(label2);

            const violationQuantity = document.createElement('input');
            violationQuantity.type = 'text';
            violationQuantity.classList.add('violation-quantity');
            violationQuantity.placeholder = '위반수량 입력';
            violationQuantity.disabled = true; // 초기에는 비활성화
            inputGroup2.appendChild(violationQuantity);

            inputGroupCover.appendChild(inputGroup2);

            detailContent.appendChild(inputGroupCover);

            const inputGroup3 = document.createElement('div');
            inputGroup3.classList.add('input-group');

            const label3 = document.createElement('label');
            label3.textContent = '원인';
            inputGroup3.appendChild(label3);

            const reason = document.createElement('textarea');
            reason.classList.add('reason');
            reason.placeholder = '원인을 작성해주세요';
            reason.disabled = true; // 초기에는 비활성화
            inputGroup3.appendChild(reason);

            detailContent.appendChild(inputGroup3);

            const inputGroup4 = document.createElement('div');
            inputGroup4.classList.add('input-group');

            const label4 = document.createElement('label');
            label4.textContent = '개선조치사항';
            inputGroup4.appendChild(label4);

            const action = document.createElement('textarea');
            action.classList.add('action');
            action.placeholder = '개선조치사항을 입력해주세요';
            action.disabled = true; // 초기에는 비활성화
            inputGroup4.appendChild(action);

            detailContent.appendChild(inputGroup4);

            const inputGroup5 = document.createElement('div');
            inputGroup5.classList.add('input-group');

            const label5 = document.createElement('label');
            label5.textContent = '위반사항';
            inputGroup5.appendChild(label5);

            const violation = document.createElement('textarea');
            violation.classList.add('violation');
            violation.placeholder = '위반사항을 입력해주세요';
            violation.disabled = true; // 초기에는 비활성화
            inputGroup5.appendChild(violation);

            detailContent.appendChild(inputGroup5);

            const inputGroup6 = document.createElement('div');
            inputGroup6.classList.add('input-group');

            const label6 = document.createElement('label');
            label6.textContent = '귀책사유';
            inputGroup6.appendChild(label6);

            const radioGroup = document.createElement('div');
            radioGroup.classList.add('radio-group');

            ["점주", "SV", "직원", "기타"].forEach((responsibility) => {
                const respLabel = document.createElement("label");
                respLabel.textContent = responsibility;

                const respInput = document.createElement("input");
                respInput.type = "radio";
                respInput.name = `responsibility_${question.evitId}`;
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

            const caupvd = document.createElement('textarea');
            caupvd.classList.add('caupvd');
            caupvd.placeholder = '귀책사유를 입력해주세요';
            caupvd.disabled = true; // 초기에는 비활성화
            inputGroup6.appendChild(caupvd);

            detailContent.appendChild(inputGroup6);

            storeInfo.appendChild(detailContent);

            contentWrapper.appendChild(storeInfo);

            subitemInfoWrapper.appendChild(contentWrapper);

            // check-subitem에 문항 정보 추가
            checkSubitem.appendChild(subitemInfoWrapper);
        });

        checkItem.appendChild(checkSubitem);
    });
}








// 콘텐츠 높이를 조정하는 함수
function adjustWrapperHeight(element) {
    element.style.height = 'auto';
    const newHeight = element.scrollHeight;
    element.style.height = newHeight + 'px';
    element.style.transition = 'height 0.5s ease';
}

// 콘텐츠 열기 함수
function openContent(element) {
    element.style.height = element.scrollHeight + "px";  // 내부 콘텐츠 크기만큼 높이 설정
    element.style.transition = "height 0.5s ease";  // 부드러운 전환
}

// 콘텐츠 닫기 함수
function closeContent(element) {
    element.style.height = "0px";  // 높이를 0으로 설정
    element.style.transition = "height 0.5s ease";  // 부드러운 전환
}



//-------------------------임시저장 함수------------------------

// URL 파라미터 가져오기
function getParameterByName(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

// function temporarySave() {
//     console.log("temporarySave() 함수가 호출됨");
//
//     // 1. URL 파라미터에서 필요한 값 가져오기
//     const inspResultId = getParameterByName('inspResultId');
//     if (!inspResultId) {
//         alert('inspResultId가 누락되었습니다.');
//         return;
//     }
//
//     const chklstId = getParameterByName('chklstId');
//     const storeNm = getParameterByName('storeNm');
//     const inspPlanDt = getParameterByName('inspPlanDt');
//     const inspSchdId = getParameterByName('inspSchdId'); // 추가된 부분
//
//     // 필수 파라미터 누락 시 경고
//     if (!chklstId || !storeNm || !inspPlanDt || !inspSchdId) { // inspSchdId 추가
//         alert('필수 파라미터(chklstId, storeNm, inspPlanDt, inspSchdId)가 누락되었습니다.');
//         return;
//     }
//
//     const inspections = []; // 각 카테고리의 데이터를 저장할 배열
//
//     // 2. 각 서브카테고리 순회
//     document.querySelectorAll('#inspection-middleCheck-list .check-subitem').forEach(subitem => {
//         const subcategoryName = subitem.querySelector('.subitem-title').textContent.trim();
//         const subcategories = [];
//
//         const contentWrapper = subitem.querySelector('.inspection-content-wrapper');
//         if (!contentWrapper) {
//             console.warn("inspection-content-wrapper 요소를 찾을 수 없습니다:", subitem);
//             return;
//         }
//
//         const evitId = parseInt(contentWrapper.getAttribute('data-evit-id'), 10);
//         const creMbrId = contentWrapper.getAttribute('data-cre-mbr-id');
//         const inspResultIdLocal = parseInt(contentWrapper.getAttribute('data-insp-result-id'), 10);
//
//         if (isNaN(evitId)) {
//             console.warn('유효하지 않은 evitId:', contentWrapper);
//             return;
//         }
//
//         // 3. 각 문항의 상세 내용 추출
//         const answerContent = getAnswerContent(contentWrapper);
//         const pdtNmDtplc = getProductName(contentWrapper) || "";
//         const vltContent = getViolationContent(contentWrapper) || "";
//         const vltCnt = getViolationCount(contentWrapper) || 0;
//         const caupvdCd = getCaupvdCd(contentWrapper) || "";
//         const vltCause = getVltCause(contentWrapper) || "";
//         const instruction = getInstruction(contentWrapper) || "";
//         const vltPlcCd = getVltPlcCd(contentWrapper) || "";
//         let photoPaths = getPhotoPaths(contentWrapper) || [];
//
//         // 사진 경로에서 null 값 제거
//         photoPaths = photoPaths.filter(path => path);
//
//         // 필수 데이터 검증
//         if (!answerContent) {
//             console.warn(`답변이 누락됨. evitId: ${evitId}`);
//             return;
//         }
//
//         // 4. 서브카테고리 데이터 객체 생성
//         const subcategoryInspection = {
//             evitId,
//             answerContent,
//             pdtNmDtplc,
//             vltContent,
//             vltCnt,
//             caupvdCd,
//             vltCause,
//             instruction,
//             vltPlcCd,
//             photoPaths,
//             inspResultId: inspResultIdLocal,
//             creMbrId: creMbrId || "defaultCreMbrId",
//             categoryName: subcategoryName // 카테고리 이름 추가
//         };
//
//         console.log(`Collected data for evitId ${evitId}:`, subcategoryInspection);
//         subcategories.push(subcategoryInspection);
//
//         inspections.push({ categoryName: subcategoryName, subcategories });
//     });
//
//
//
//     // 5. 최종 데이터 객체 생성
//     const requestData = {
//         chklstId: parseInt(chklstId, 10),
//         storeNm: storeNm,
//         inspPlanDt: inspPlanDt,
//         inspResultId: parseInt(inspResultId, 10),
//         inspSchdId: parseInt(inspSchdId, 10), // 기존 함수에서 가져온 스케줄 ID 추가
//         inspComplW: "N", // 임시저장 상태
//         inspections,
//     };
//
//     console.log("Sending data to server:", JSON.stringify(requestData, null, 2));
//
//     // 6. 서버로 데이터 전송
//     sendDataToServer(requestData);
// }
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

    // **추가된 부분: 이전 답변들을 저장할 맵 생성**
    const previousAnswers = {};
    if (temporaryInspectionData && temporaryInspectionData.inspections) {
        temporaryInspectionData.inspections.forEach(cat => {
            if (cat.subcategories) {
                cat.subcategories.forEach(subcat => {
                    previousAnswers[subcat.evitId] = subcat.answerContent;
                });
            }
        });
    }

    // 2. 각 서브카테고리 순회
    document.querySelectorAll('#inspection-middleCheck-list .check-subitem').forEach(subitem => {
        const subcategoryName = subitem.querySelector('.subitem-title').textContent.trim();
        const subcategories = [];

        const contentWrapper = subitem.querySelector('.inspection-content-wrapper');
        if (!contentWrapper) {
            console.warn("inspection-content-wrapper 요소를 찾을 수 없습니다:", subitem);
            return;
        }

        const evitId = parseInt(contentWrapper.getAttribute('data-evit-id'), 10);
        const creMbrId = contentWrapper.getAttribute('data-cre-mbr-id');
        const inspResultIdLocal = parseInt(contentWrapper.getAttribute('data-insp-result-id'), 10);

        if (isNaN(evitId)) {
            console.warn('유효하지 않은 evitId:', contentWrapper);
            return;
        }

        // 3. 각 문항의 상세 내용 추출
        const answerContent = getAnswerContent(contentWrapper);
        const pdtNmDtplc = getProductName(contentWrapper) || "";
        const vltContent = getViolationContent(contentWrapper) || "";
        const vltCnt = getViolationCount(contentWrapper) || 0;
        const caupvdCd = getCaupvdCd(contentWrapper) || "";
        const vltCause = getVltCause(contentWrapper) || "";
        const instruction = getInstruction(contentWrapper) || "";
        const vltPlcCd = getVltPlcCd(contentWrapper) || "";
        const photos = getPhotoPaths(contentWrapper) || [];

        // 사진 경로에서 null 값 제거
        const filteredPhotos = photos.filter(photo => photo.photoPath);

        // 필수 데이터 검증
        if (!answerContent) {
            console.warn(`답변이 누락됨. evitId: ${evitId}`);
            return;
        }

        // **추가된 부분: 이전 답변과 현재 답변 비교**
        const previousAnswer = previousAnswers[evitId];
        const currentAnswer = answerContent;

        // 부적합에서 적합으로 변경되었는지 확인
        const nonCompliantAnswers = ['부적합', '나쁨', '매우나쁨'];
        const compliantAnswers = ['적합', '보통', '좋음', '매우좋음'];

        let changedFromNonCompliantToCompliant = false;

        if (nonCompliantAnswers.includes(previousAnswer) && compliantAnswers.includes(currentAnswer)) {
            changedFromNonCompliantToCompliant = true;
        }

        // 4. 서브카테고리 데이터 객체 생성
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
            photos: filteredPhotos,
            inspResultId: inspResultIdLocal,
            creMbrId: creMbrId || "defaultCreMbrId",
            categoryName: subcategoryName, // 카테고리 이름 추가
            changedFromNonCompliantToCompliant // **변경 여부 추가**
        };

        console.log(`Collected data for evitId ${evitId}:`, subcategoryInspection);
        subcategories.push(subcategoryInspection);

        inspections.push({ categoryName: subcategoryName, subcategories });
    });

    // 5. 최종 데이터 객체 생성
    const requestData = {
        chklstId: parseInt(chklstId, 10),
        storeNm: storeNm,
        inspPlanDt: inspPlanDt,
        inspResultId: parseInt(inspResultId, 10),
        inspSchdId: parseInt(inspSchdId, 10),
        inspComplW: "N", // 임시저장 상태
        inspections,
    };

    console.log("Sending data to server:", JSON.stringify(requestData, null, 2));

    // 6. 서버로 데이터 전송
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
            Swal.fire({
                title: "완료",
                text: "임시저장이 완료되었습니다.",
                icon: "success",
                confirmButtonText: "확인",
            });
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
 * @param {Element} wrapper - inspection-content-wrapper 요소
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

function getProductName(contentWrapper) {
    const productInput = contentWrapper.querySelector('.product-name');
    return productInput ? productInput.value.trim() : null;
}

function getViolationContent(contentWrapper) {
    const vltContent = contentWrapper.querySelector('.violation');
    return vltContent ? vltContent.value.trim() : null;
}

function getViolationCount(contentWrapper) {
    const violationQty = contentWrapper.querySelector('.violation-quantity');
    return violationQty ? parseInt(violationQty.value, 10) || null : null;
}

function getCaupvdCd(contentWrapper) {
    const selectedResponsibility = contentWrapper.querySelector('input[name^="responsibility_"]:checked');
    const caupvdValueMap = {
        "점주": "C001",
        "SV": "C002",
        "직원": "C003",
        "기타": "C004"
    };

    if (selectedResponsibility) {
        if (selectedResponsibility.value === "기타") {
            const caupvdInput = contentWrapper.querySelector('.caupvd');
            return caupvdInput ? caupvdInput.value.trim() : null; // 기타일 경우 입력된 값 사용
        } else {
            return caupvdValueMap[selectedResponsibility.value] || null;
        }
    }

    return null;
}

function getVltCause(contentWrapper) {
    const cause = contentWrapper.querySelector('.reason');
    return cause ? cause.value.trim() : null;
}

function getInstruction(contentWrapper) {
    const instruction = contentWrapper.querySelector('.action');
    return instruction ? instruction.value.trim() : null;
}

function getVltPlcCd(contentWrapper) {
    console.log("getVltPlcCd 함수 호출됨");
    console.log("contentWrapper:", contentWrapper);

    const selectedLoc = contentWrapper.querySelector('input[name^="location_"]:checked');
    const plcValueMap = {
        "매장": "VP001",
        "주방": "VP002",
        "카페": "VP003",
        "기타": "VP004"
    };

    if (selectedLoc) {
        if (selectedLoc.value === "기타") {
            const etcInput = contentWrapper.querySelector('.etc-input');
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

// function getPhotoPaths(contentWrapper) {
//     const photoBoxes = contentWrapper.querySelectorAll('.photo-box');
//     const photos = [];
//     photoBoxes.forEach((box, index) => {
//         const path = box.getAttribute('data-path');
//         if (path) {
//             photos.push({
//                 seq: index + 1,
//                 photoPath: path
//             });
//         }
//     });
//     return photos;
// }








// ------------------서명페이지로 데이터 넘기기-----------------
function middleCheckInspection() {
    console.log("middleCheckInspection() 함수가 호출됨");

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

    /**
     * 경고 메시지를 표시하는 함수
     */
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

    const inspections = []; // 각 카테고리의 데이터를 저장할 배열

    // 이전 답변들을 저장할 맵 생성
    const previousAnswers = {};
    if (temporaryInspectionData && temporaryInspectionData.inspections) {
        temporaryInspectionData.inspections.forEach(cat => {
            if (cat.subcategories) {
                cat.subcategories.forEach(subcat => {
                    previousAnswers[subcat.evitId] = subcat.answerContent;
                });
            }
        });
    }

    // 2. 각 서브카테고리 순회
    document.querySelectorAll('#inspection-middleCheck-list .check-subitem').forEach(subitem => {
        const subcategoryName = subitem.querySelector('.subitem-title').textContent.trim();
        const subcategories = [];

        const contentWrapper = subitem.querySelector('.inspection-content-wrapper');
        if (!contentWrapper) {
            console.warn("inspection-content-wrapper 요소를 찾을 수 없습니다:", subitem);
            return;
        }

        const evitId = parseInt(contentWrapper.getAttribute('data-evit-id'), 10);
        const creMbrId = contentWrapper.getAttribute('data-cre-mbr-id');
        const inspResultIdLocal = parseInt(contentWrapper.getAttribute('data-insp-result-id'), 10);

        if (isNaN(evitId)) {
            console.warn('유효하지 않은 evitId:', contentWrapper);
            return;
        }

        // 각 문항의 상세 내용 추출
        const answerContent = getAnswerContent(contentWrapper);
        const pdtNmDtplc = getProductName(contentWrapper) || "";
        const vltContent = getViolationContent(contentWrapper) || "";
        const vltCnt = getViolationCount(contentWrapper) || 0;
        const caupvdCd = getCaupvdCd(contentWrapper) || "";
        const vltCause = getVltCause(contentWrapper) || "";
        const instruction = getInstruction(contentWrapper) || "";
        const vltPlcCd = getVltPlcCd(contentWrapper) || "";
        const photos = getPhotoPaths(contentWrapper) || [];

        // 사진 경로에서 null 값 제거
        const filteredPhotos = photos.filter(photo => photo.photoPath);

        // 필수 데이터 검증
        if (!answerContent) {
            console.warn(`답변이 누락됨. evitId: ${evitId}`);
            return;
        }

        // 이전 답변과 현재 답변 비교
        const previousAnswer = previousAnswers[evitId];
        const currentAnswer = answerContent;

        // 부적합에서 적합으로 변경되었는지 확인
        const nonCompliantAnswers = ['부적합', '나쁨', '매우나쁨'];
        const compliantAnswers = ['적합', '보통', '좋음', '매우좋음'];

        let changedFromNonCompliantToCompliant = false;

        if (nonCompliantAnswers.includes(previousAnswer) && compliantAnswers.includes(currentAnswer)) {
            changedFromNonCompliantToCompliant = true;
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
            photos: filteredPhotos,
            inspResultId: inspResultIdLocal,
            creMbrId: creMbrId || "defaultCreMbrId",
            categoryName: subcategoryName, // 카테고리 이름 추가
            changedFromNonCompliantToCompliant // 변경 여부 추가
        };

        console.log(`Collected data for evitId ${evitId}:`, subcategoryInspection);
        subcategories.push(subcategoryInspection);

        inspections.push({ categoryName: subcategoryName, subcategories });
    });

    // 총점, 총과태료, 총영업정지일수 추출
    const totalScore = document.querySelector('.score-table > tbody > tr > td').textContent.trim();
    const totalPenalty = document.querySelector('.fine-amount > span').textContent.trim();
    const totalClosureDays = document.querySelector('.closure-days > span').textContent.trim();

    // 5. 최종 데이터 객체 생성
    const requestData = {
        chklstId: parseInt(chklstId, 10),
        storeNm: storeNm,
        inspPlanDt: inspPlanDt,
        inspResultId: parseInt(inspResultId, 10),
        inspSchdId: parseInt(inspSchdId, 10), // 기존 함수에서 가져온 스케줄 ID 추가
        inspComplW: "N", // 임시저장 상태
        totalScore: parseInt(totalScore, 10) || 0, // 숫자 변환 및 기본값
        totalPenalty: parseInt(totalPenalty.replace(/,/g, ''), 10) || 0,
        totalClosureDays: parseInt(totalClosureDays.replace(/,/g, ''), 10) || 0,
        inspections,
    };

    console.log("Sending data to server:", JSON.stringify(requestData, null, 2));

    // 6. 서버로 데이터 전송
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
                // 두 번째 요청: 총점, 총과태료, 총영업정지일수 업데이트
                fetch('/filter/update_total_values', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(requestData), // 동일한 requestData를 전송
                })
                    .then(response => {
                        if (!response.ok) {
                            throw new Error(`총점 업데이트 실패. 상태 코드: ${response.status}`);
                        }
                        return response.text();
                    })
                    .then(data => {
                        console.log('총점, 총과태료, 총영업정지일수 업데이트 성공:', data);

                        // 알림 확인 후 페이지 이동
                        const form = document.createElement("form");
                        form.method = "GET"; // GET 방식 사용
                        form.action = "/qsc/popup_signature";

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
                    })
                    .catch(error => {
                        console.error('총점, 총과태료, 총영업정지일수 업데이트 실패:', error);
                        Swal.fire("오류", "총점, 총과태료, 총영업정지일수를 업데이트하는 데 실패했습니다.", "error");
                    });
            });
        })
        .catch(error => {
            console.error('점검결과 저장 실패:', error);
            Swal.fire("오류", "점검결과를 저장하는 데 실패했습니다.", "error");
        });
}


/**
 * 서브카테고리에서 답변 내용 추출
 *
 * @param {Element} wrapper - inspection-content-wrapper 요소
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

function getProductName(contentWrapper) {
    const productInput = contentWrapper.querySelector('.product-name');
    return productInput ? productInput.value.trim() : null;
}

function getViolationContent(contentWrapper) {
    const vltContent = contentWrapper.querySelector('.violation');
    return vltContent ? vltContent.value.trim() : null;
}

function getViolationCount(contentWrapper) {
    const violationQty = contentWrapper.querySelector('.violation-quantity');
    return violationQty ? parseInt(violationQty.value, 10) || null : null;
}

function getCaupvdCd(contentWrapper) {
    const selectedResponsibility = contentWrapper.querySelector('input[name^="responsibility_"]:checked');
    const caupvdValueMap = {
        "점주": "C001",
        "SV": "C002",
        "직원": "C003",
        "기타": "C004"
    };

    if (selectedResponsibility) {
        if (selectedResponsibility.value === "기타") {
            const caupvdInput = contentWrapper.querySelector('.caupvd');
            return caupvdInput ? caupvdInput.value.trim() : null; // 기타일 경우 입력된 값 사용
        } else {
            return caupvdValueMap[selectedResponsibility.value] || null;
        }
    }

    return null;
}

function getVltCause(contentWrapper) {
    const cause = contentWrapper.querySelector('.reason');
    return cause ? cause.value.trim() : null;
}

function getInstruction(contentWrapper) {
    const instruction = contentWrapper.querySelector('.action');
    return instruction ? instruction.value.trim() : null;
}

function getVltPlcCd(contentWrapper) {
    console.log("getVltPlcCd 함수 호출됨");
    console.log("contentWrapper:", contentWrapper);

    const selectedLoc = contentWrapper.querySelector('input[name^="location_"]:checked');
    const plcValueMap = {
        "매장": "VP001",
        "주방": "VP002",
        "카페": "VP003",
        "기타": "VP004"
    };

    if (selectedLoc) {
        if (selectedLoc.value === "기타") {
            const etcInput = contentWrapper.querySelector('.etc-input');
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

// 전역 범위에서 정의된 getPhotoPaths 함수
function getPhotoPaths(contentWrapper) {
    const photoBoxes = contentWrapper.querySelectorAll('.photo-box');
    const photos = [];
    photoBoxes.forEach((box, index) => {
        const path = box.getAttribute('data-path');
        if (path) {
            photos.push({
                seq: index + 1,
                photoPath: path
            });
        }
    });
    return photos;
}

