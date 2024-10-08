document.addEventListener("DOMContentLoaded", function () {
    initializeTabs();
    initializeDetailButtons();
    initializeEditButtons();
});

function initializeTabs() {
    const tabs = document.querySelectorAll(".inspection-tab");
    const reportSummary = document.querySelector(".report-summary");
    const detailedResult = document.querySelector(".detailed-result");
    const inspectionList = document.getElementById("inspection-middleCheck-list");

    // 기본 상태 설정: 보고서 간략은 보이기, 세부결과는 숨기기
    reportSummary.style.display = "flex";  // 보고서 간략은 기본 표시
    detailedResult.style.display = "none";  // 세부결과는 숨김
    inspectionList.style.display = "none";  // 기본적으로 inspection-middleCheck-list도 숨김

    // 탭 클릭 이벤트 추가
    tabs.forEach(tab => {
        tab.addEventListener("click", function () {
            // 모든 탭 버튼에서 active 클래스 제거
            tabs.forEach(tab => tab.classList.remove("active"));

            // 클릭된 탭 버튼에 active 클래스 추가
            this.classList.add("active");

            // 선택된 탭에 따라 콘텐츠 전환
            const selectedTab = this.getAttribute("data-tab");

            if (selectedTab === "report-summary") {
                reportSummary.style.display = "flex";  // 보고서 간략 보이기
                detailedResult.style.display = "none";  // 세부결과 숨기기
                inspectionList.style.display = "none";  // 보고서 간략 탭에서는 리스트 숨김
            } else if (selectedTab === "detailed-result") {
                reportSummary.style.display = "none";  // 보고서 간략 숨기기
                detailedResult.style.display = "flex";  // 세부결과 보이기
                inspectionList.style.display = "none";  // 세부결과가 보이면서 상세보기 클릭 전에는 숨김
            }
        });
    });
}

function initializeDetailButtons() {
    const detailButtons = document.querySelectorAll(".detail-btn");
    const inspectionList = document.getElementById("inspection-middleCheck-list");

    // 각 상세보기 버튼에 클릭 이벤트 추가
    detailButtons.forEach(button => {
        button.addEventListener("click", function () {
            // 상세보기 버튼 클릭 시 inspection-middleCheck-list를 토글로 보이거나 숨기기
            if (inspectionList.style.display === "none") {
                inspectionList.style.display = "block";  // 클릭하면 보이기
            } else {
                inspectionList.style.display = "none";  // 다시 클릭하면 숨기기
            }
        });
    });
}

// 하단부분 수정하기 버튼 클릭
function initializeEditButtons() {
    // 모든 "수정하기" 버튼에 클릭 이벤트를 추가
    const editButtons = document.querySelectorAll(".edit-btn");

    editButtons.forEach(button => {
        button.addEventListener("click", function () {
            const contentWrapper = this.parentElement.querySelector(".inspection-content-wrapper");

            if (contentWrapper) {
                // 현재 감춰져 있으면 열기, 열려 있으면 닫기
                if (contentWrapper.style.height === "0px" || contentWrapper.style.height === "") {
                    openContent(contentWrapper);
                } else {
                    closeContent(contentWrapper);
                }
            }
        });
    });

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
}

