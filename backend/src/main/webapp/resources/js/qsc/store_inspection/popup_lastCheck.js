document.addEventListener("DOMContentLoaded", function () {
    initializeTabs();
    initializeDetailButtons();
});

function initializeTabs() {
    const tabs = document.querySelectorAll(".inspection-tab");
    const reportSummary = document.querySelector(".report-summary");
    const detailedResult = document.querySelector(".detailed-result");
    const inspectionList = document.getElementById("inspection-lastCheck-list");

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

function initializeDetailButtons() {
    const detailButtons = document.querySelectorAll(".detail-btn");
    const inspectionList = document.getElementById("inspection-lastCheck-list");
    const itemTitle = document.querySelector(".item-title");
    const checkItemsContainer = document.querySelector(".check-item");

    let currentOpenSection = null; // 현재 열려 있는 섹션을 추적하기 위한 변수

    // 각 상세보기 버튼에 대한 데이터를 하드코딩한 상태로 준비
    const dataMap = {
        "중대법규": [
            {
                subitemTitle: "영업취소",
                description: "1. 소비기한 변조 및 삭제",
                score: "5 / 5",
                fine: "-",
                suspension: "-"
            },
            {
                subitemTitle: "영업정지 1개월 이상",
                description: "2. 표시사항 전부를 표시하지 않은 식품을 영업에 사용",
                score: "5 / 5",
                fine: "-",
                suspension: "-"
            }
        ],
        "기타법규": [
            {
                subitemTitle: "영업취소",
                description: "3. 기타 법규 위반 내용",
                score: "10 / 10",
                fine: "100만원",
                suspension: "3개월"
            },
            {
                subitemTitle: "영업취소",
                description: "3. 기타 법규 위반 내용",
                score: "10 / 10",
                fine: "100만원",
                suspension: "3개월"
            }
        ],
        "위생관리": [
            {
                subitemTitle: "위생 문제",
                description: "4. 위생 관리 소홀",
                score: "7 / 10",
                fine: "-",
                suspension: "-"
            },
            {
                subitemTitle: "위생 문제",
                description: "4. 위생 관리 소홀",
                score: "7 / 10",
                fine: "-",
                suspension: "-"
            }
        ],
        "위생지도상황": [
            {
                subitemTitle: "위생 지도 위반",
                description: "5. 위생 지도 불이행",
                score: "10 / 10",
                fine: "-",
                suspension: "2개월"
            },
            {
                subitemTitle: "위생 지도 위반",
                description: "5. 위생 지도 불이행",
                score: "10 / 10",
                fine: "-",
                suspension: "2개월"
            },
            {
                subitemTitle: "위생 지도 위반",
                description: "5. 위생 지도 불이행",
                score: "10 / 10",
                fine: "-",
                suspension: "2개월"
            },
            {
                subitemTitle: "위생 지도 위반",
                description: "5. 위생 지도 불이행",
                score: "10 / 10",
                fine: "-",
                suspension: "2개월"
            }
        ]
    };

    // 상세보기 버튼 클릭 시 이벤트
    detailButtons.forEach(button => {
        button.addEventListener("click", function () {
            const sectionTitle = this.closest('.item-header').querySelector('h3').textContent;

            if (currentOpenSection === sectionTitle) {
                // 같은 섹션을 다시 클릭했을 때: 닫기
                inspectionList.style.display = "none";
                currentOpenSection = null; // 열려 있는 섹션이 없음을 표시
                return;
            }

            // 다른 섹션을 클릭했을 때 또는 처음 열 때
            itemTitle.textContent = sectionTitle;
            const data = dataMap[sectionTitle] || [];

            // 기존 내용을 지우기
            checkItemsContainer.innerHTML = '';

            // 가져온 데이터를 기반으로 HTML 구성
            data.forEach(item => {
                const subitemHtml = `
                <div class="check-subitem">
                    <p class="subitem-title">${item.subitemTitle}</p>
                    <div class="subitem-info-wrapper">
                        <p>${item.description}</p>
                        <ul class="subitem-info">
                            <li class="info-box">
                                <p>배점/결과</p>
                                <span class="score">${item.score}</span>
                            </li>
                            <li class="info-box">
                                <p>과태료</p>
                                <span>${item.fine}</span>
                            </li>
                            <li class="info-box">
                                <p>영업정지</p>
                                <span>${item.suspension}</span>
                            </li>
                        </ul>
                        <jsp:include page="checkList_choice.jsp" />
                    </div>
                </div>`;
                checkItemsContainer.insertAdjacentHTML('beforeend', subitemHtml);
            });

            // 새로운 섹션 열기
            inspectionList.style.display = "block";
            inspectionList.scrollIntoView({ behavior: 'smooth', block: 'start' });

            // 현재 열려 있는 섹션 업데이트
            currentOpenSection = sectionTitle;
        });
    });
}


// 점검 완료 버튼 클릭 시 호출되는 함수
function lastCheckInspection() {
    // 임의로 데이터를 생성 (실제 데이터는 입력받은 데이터를 활용할 것)
    const inspectionData = {
        storeName: "KCC 크라상",
        inspectorName: "노승우",
        inspectionDate: "2024-09-24",
        results: [
            {
                category: "중대법규",
                score: 40,
                appropriate: 30,
                inappropriate: 10,
                notApplicable: 0
            },
            {
                category: "기타법규",
                score: 10,
                appropriate: 10,
                inappropriate: 0,
                notApplicable: 0
            }
            // 기타 결과 추가 가능
        ]
    };

    // 데이터를 JSON 형식으로 변환
    const inspectionDataJson = JSON.stringify(inspectionData);

    // 폼을 생성하여 서버로 데이터를 POST 방식으로 전송
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = '/qsc/popup_lastCheck';  // 점검 완료 페이지로 전송

    // 숨겨진 input 필드에 데이터를 담아 전송
    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = 'inspectionData';
    input.value = inspectionDataJson;

    form.appendChild(input);

    // 폼을 문서에 추가하고 제출
    document.body.appendChild(form);
    form.submit();

    // 팝업 창을 닫음
    window.close();  // 점검 완료 후 팝업창 종료
}
