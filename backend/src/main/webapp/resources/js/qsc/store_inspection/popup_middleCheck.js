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
    const inspectionList = document.getElementById("inspection-middleCheck-list");
    const itemTitle = document.querySelector(".item-title");


    //상세보기
    detailButtons.forEach(button => {
        button.addEventListener("click", function () {
            // 해당 버튼이 속한 item-header의 h3 안의 텍스트 가져오기
            const sectionTitle = this.closest('.item-header').querySelector('h3').textContent;

            // <h2 class="item-title"> 안에 가져온 텍스트 넣기
            itemTitle.textContent = sectionTitle;

            // 상세보기 버튼 클릭 시 inspection-middleCheck-list를 토글로 보이거나 숨기기
            if (inspectionList.style.display === "none") {
                inspectionList.style.display = "block";
                inspectionList.scrollIntoView({ behavior: 'smooth', block: 'start' }); //스크롤 이동
            } else {
                inspectionList.style.display = "none";
            }
        });
    });
}

// 하단부분 수정하기 버튼 클릭
function initializeEditButtons() {
    const editButtons = document.querySelectorAll(".edit-btn");

    editButtons.forEach(button => {
        button.addEventListener("click", function () {
            const contentWrapper = this.parentElement.querySelector(".inspection-content-wrapper");

            if (contentWrapper) {
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


// ------------------서명페이지로 데이터 넘기기-----------------
function middleCheckInspection() {
    // textarea 데이터를 가져옴
    const textareaData = document.querySelector('.etc-input').value;

    // 폼을 생성하여 데이터를 전송
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = '/qsc/popup_signature';  // 페이지 이동 경로 설정

    // textarea 데이터를 숨겨진 input 필드로 추가
    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = 'textareaData';
    input.value = textareaData || "";  // 데이터가 없을 경우 빈 값으로 설정
    form.appendChild(input);

    // 폼을 문서에 추가한 뒤 제출
    document.body.appendChild(form);
    form.submit();
}



