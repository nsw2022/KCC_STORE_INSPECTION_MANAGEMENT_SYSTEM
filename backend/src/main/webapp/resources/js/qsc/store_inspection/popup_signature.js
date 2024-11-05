// 전역 변수로 SignaturePad 인스턴스 선언
let signaturePad;

// Helper function to convert DataURL to Blob
function dataURLToBlob(dataURL) {
    const byteString = atob(dataURL.split(',')[1]);
    const mimeString = dataURL.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
}

// 날짜 형식 포맷 함수 (YYYY.MM.DD)
function formatDate(dateStr) {
    // dateStr이 'YYYYMMDD' 형식인지 확인
    if (!dateStr || dateStr.length !== 8) return dateStr; // 형식이 올바르지 않으면 그대로 반환
    const year = dateStr.substring(0, 4);
    const month = dateStr.substring(4, 6);
    const day = dateStr.substring(6, 8);
    return `${year}.${month}.${day}`; // 템플릿 리터럴 사용하여 'YYYY.MM.DD' 형식으로 변경
}

document.addEventListener("DOMContentLoaded", function () {
    const urlParams = new URLSearchParams(window.location.search);
    const chklstId = urlParams.get("chklstId");
    const storeNm = urlParams.get("storeNm");
    const inspPlanDt = urlParams.get("inspPlanDt");
    const inspResultId = urlParams.get("inspResultId");

    initializeSignaturePad();
    setTodayAsDefaultDate();

    globalInspResultId = inspResultId; // 전역 변수에 설정

    if (chklstId && storeNm && inspPlanDt) {
        // 기본 데이터를 먼저 로드
        fetchPopupData(chklstId, storeNm, inspPlanDt);
    } else if (inspResultId) {
        // inspResultId가 있는 경우 데이터를 로드
        loadInspectionData(inspResultId);
    } else {
        alert('필수 파라미터(chklstId, storeNm, inspPlanDt 또는 inspResultId)가 지정되지 않았습니다.');
    }
});

// 오늘 날짜를 기본값으로 설정하는 함수
function setTodayAsDefaultDate() {
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];
    document.getElementById('visitDate').value = formattedDate;
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

function loadInspectionData(inspResultId) {
    const dataUrl = `/filter/get_inspection_data?inspResultId=${inspResultId}`;

    fetch(dataUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`네트워크 응답이 올바르지 않습니다. 상태 코드: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (data) {
                // 데이터가 존재하면 화면에 반영
                populateInspectionDetail(data);
                // 총평 로드
                document.getElementById('summaryText').value = data.totalReview || '';
            } else {
                console.log("데이터가 없습니다.");
            }
        })
        .catch(error => {
            console.error("데이터 로드 실패:", error);
        });
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

function initializeSignaturePad() {
    const canvas = document.getElementById('signatureCanvas');
    if (!canvas) return;  // 서명 캔버스가 없으면 실행하지 않음
    signaturePad = new SignaturePad(canvas); // 전역 변수에 할당

    // 캔버스 크기 조정
    function resizeCanvas() {
        const ratio = Math.max(window.devicePixelRatio || 1, 1);
        canvas.width = canvas.offsetWidth * ratio;
        canvas.height = canvas.offsetHeight * ratio;
        canvas.getContext("2d").scale(ratio, ratio);
    }

    // 창 크기 변경 시 캔버스 크기 재조정
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // 서명이 없으면 placeholder 보이기
    function hidePlaceholder() {
        document.querySelector('.signature-placeholder').style.display = 'none';
        showClearButton();
    }

    // passive 옵션 추가
    canvas.addEventListener('mousedown', hidePlaceholder, { passive: true });
    canvas.addEventListener('touchstart', hidePlaceholder, { passive: true });
    canvas.addEventListener('pointerdown', hidePlaceholder, { passive: true }); // 추가된 이벤트 리스너

    // 서명 초기화 함수
    const clearSignature = () => {
        signaturePad.clear();
        document.querySelector('.signature-placeholder').style.display = 'block';
        hideClearButton();  // 서명 초기화 시 다시하기 버튼 숨기기
    };

    // 다시하기 버튼 생성 및 숨김 처리 함수
    const showClearButton = () => {
        let clearButton = document.getElementById('clear-signature-btn');
        if (!clearButton) {
            clearButton = document.createElement('button');
            clearButton.id = 'clear-signature-btn';
            clearButton.innerText = '다시하기';

            clearButton.addEventListener('click', clearSignature);

            const signatureArea = document.querySelector('.signature-area');
            signatureArea.appendChild(clearButton);
        }
    };

    const hideClearButton = () => {
        const clearButton = document.getElementById('clear-signature-btn');
        if (clearButton) {
            clearButton.remove();  // 다시하기 버튼 제거
        }
    };
}

//----------------------데이터 보내기-----------------------
function lastCheckInspection() {
    const inspResultId = globalInspResultId; // 전역 변수에서 inspResultId 가져오기
    const summaryText = document.getElementById('summaryText').value.trim();

    if (!inspResultId) {
        Swal.fire({
            icon: 'warning',
            title: '경고',
            text: 'inspResultId가 설정되지 않았습니다.',
        });
        return;
    }

    if (!summaryText) {
        Swal.fire({
            icon: 'warning',
            title: '경고',
            text: '총평을 작성해주세요.',
        });
        return;
    }

    if (!signaturePad || signaturePad.isEmpty()) {
        Swal.fire({
            icon: 'warning',
            title: '경고',
            text: '서명을 작성해주세요.',
        });
        return;
    }

    // 서명을 이미지 데이터로 변환 (PNG 형식)
    // signaturePad.toBlob이 없을 경우, toDataURL을 사용하여 Blob 생성
    let blobFunction;
    if (typeof signaturePad.toBlob === 'function') {
        blobFunction = signaturePad.toBlob.bind(signaturePad);
    } else {
        blobFunction = function(callback, type) {
            const dataURL = signaturePad.toDataURL(type || 'image/png');
            const blob = dataURLToBlob(dataURL);
            callback(blob);
        };
    }

    blobFunction(function(blob) {
        // FormData를 사용하여 서명 이미지 업로드
        const formData = new FormData();
        formData.append('file', blob, 'signature.png');

        fetch('/sign_img', { // AwsFileController의 /upload 엔드포인트 사용
            method: 'POST',
            body: formData
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`서명 이미지 업로드 실패: ${response.statusText}`);
                }
                return response.json(); // JSON 응답 처리
            })
            .then(data => {
                if (data.error) {
                    throw new Error(data.error);
                }

                // S3 키 생성: data.path에 'sign_img/'가 포함되어 있지 않은지 확인
                const s3Key = data.path.startsWith('sign_img/') ? data.path : 'sign_img/' + data.path;

                // UUID 추출 (예: 'sign_img/c10a7714-aeb7-4e31-8f1f-700a0fe71499'에서 'c10a7714-aeb7-4e31-8f1f-700a0fe71499')
                const uuid = s3Key.split('/')[1];

                console.log("서명 이미지 업로드 성공, S3 Key:", s3Key);
                console.log("데이터베이스에 저장할 UUID:", uuid);

                // 점검 완료 정보 저장을 위한 API 호출
                const completionData = {
                    inspResultId: inspResultId,
                    signImgPath: uuid, // UUID만 저장
                    totalReview: summaryText
                };

                return fetch('/filter/complete_inspection', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(completionData)
                });
            })
            .then(response => {
                if (!response.ok) {
                    console.log("응답이 JSON 형식이 아님:", text);
                    throw new Error(`점검 완료 저장 실패: ${response.statusText}`);
                }
                return response.text();
            })
            .then(message => {
                Swal.fire({
                    icon: 'success',
                    title: '완료',
                    text: '점검이 완료되었습니다.',
                }).then(() => {
                    // 결과 페이지로 inspResultId와 summaryText를 POST 방식으로 전송
                    redirectToResultPage(inspResultId, summaryText);
                });
            })
            .catch(error => {
                console.error("점검 완료 처리 실패:", error);
                Swal.fire({
                    icon: 'error',
                    title: '오류',
                    text: '점검 완료 처리에 실패했습니다.',
                });
            });
    }, 'image/png');
}


// 새로운 함수: 결과 페이지로 inspResultId를 POST로 전송하여 이동
function redirectToResultPage(inspResultId) {
    const resultUrl = "/qsc/popup/inspection/result"; // 결과 페이지 URL 설정

    // 폼 생성
    const form = document.createElement("form");
    form.method = "POST";
    form.action = resultUrl;

    // inspResultId를 hidden input으로 추가
    const input = document.createElement("input");
    input.type = "hidden";
    input.name = "inspectionContent";
    input.value = inspResultId;

    form.appendChild(input);

    // 폼을 body에 추가 후 제출
    document.body.appendChild(form);
    form.submit();
}
