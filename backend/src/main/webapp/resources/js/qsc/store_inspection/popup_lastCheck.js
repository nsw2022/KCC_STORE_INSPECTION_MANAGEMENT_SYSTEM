// 예시 JSON 데이터
const inspectionData = [
    {
        categoryName: "중대법규",
        categoryId: "category1",
        totalScore: 40,
        appropriate: 30,
        inappropriate: 10,
        notApplicable: 0,
        subcategories: [
            {
                subcategoryName: "영업취소",
                questions: [
                    {
                        questionId: 1,
                        questionText: "1. 소비기한 변조 및 삭제",
                        questionType: "2-choice",
                        score: 5,
                        img:["/resources/img/ex01.jpg", "/resources/img/ex02.jpg"],
                        PDT_NM_DTPLC: "싱크대",
                        VLT_CNT: "2개",
                        CAUSE: "직원의 위생 부주의",
                        violationOfLaws: "식품위생관리법 위반",
                        improvementMeasures: "직원에게 싱크대 및 기타 위생 관련 시설의 청소 및 유지 관리 교육을 강화하고, 청소 확인 체크리스트를 도입하여 매일의 청소 상태를 기록하도록 합니다. 또한, 주기적인 위생 점검을 실시하여 위생 관리가 표준에 부합하도록 지속적으로 모니터링합니다.",
                        violations: "싱크대 물때 제거 미흡",
                        CAUPVD: ["점원", "해당 직원이 정기적인 청소 절차와 위생 관리 지침을 준수하지 않아 싱크대의 물때 제거가 미흡한 상태로 방치되었습니다."]

                    }
                ]
            },
            {
                subcategoryName: "영업정지 1개월 이상",
                questions: [
                    {
                        questionId: 2,
                        questionText: "2. 표시사항 전부를 표시하지 않은 식품을 영업에 사용",
                        questionType: "5-choice",
                        score: 5,
                        img:"",
                        PDT_NM_DTPLC: "싱크대",
                        VLT_CNT: "2개",
                        CAUSE: "직원의 위생 부주의",
                        violationOfLaws: "식품위생관리법 위반",
                        improvementMeasures: "직원에게 싱크대 및 기타 위생 관련 시설의 청소 및 유지 관리 교육을 강화하고, 청소 확인 체크리스트를 도입하여 매일의 청소 상태를 기록하도록 합니다. 또한, 주기적인 위생 점검을 실시하여 위생 관리가 표준에 부합하도록 지속적으로 모니터링합니다.",
                        violations: "싱크대 물때 제거 미흡",
                        CAUPVD: ["점주", "해당 직원이 정기적인 청소 절차와 위생 관리 지침을 준수하지 않아 싱크대의 물때 제거가 미흡한 상태로 방치되었습니다."]
                    }
                ]
            },
            // 추가적인 중분류와 문항들...
        ]
    },
    {
        categoryName: "기타법규",
        categoryId: "category2",
        totalScore: 10,
        appropriate: 10,
        inappropriate: 0,
        notApplicable: 0,
        subcategories: [
            {
                subcategoryName: "영업정지 15일 이상",
                questions: [
                    {
                        questionId: 1,
                        questionText: "1. 소비기한 변조 및 삭제",
                        questionType: "2-choice",
                        score: 5,
                        img:["/resources/img/ex01.jpg"],
                        PDT_NM_DTPLC: "싱크대",
                        VLT_CNT: "2개",
                        CAUSE: "직원의 위생 부주의",
                        violationOfLaws: "식품위생관리법 위반",
                        improvementMeasures: "직원에게 싱크대 및 기타 위생 관련 시설의 청소 및 유지 관리 교육을 강화하고, 청소 확인 체크리스트를 도입하여 매일의 청소 상태를 기록하도록 합니다. 또한, 주기적인 위생 점검을 실시하여 위생 관리가 표준에 부합하도록 지속적으로 모니터링합니다.",
                        violations: "싱크대 물때 제거 미흡",
                        CAUPVD: ["점주", "해당 직원이 정기적인 청소 절차와 위생 관리 지침을 준수하지 않아 싱크대의 물때 제거가 미흡한 상태로 방치되었습니다."]

                    }
                ]
            },
            {
                subcategoryName: "시정명령",
                questions: [
                    {
                        questionId: 2,
                        questionText: "2. 표시사항 전부를 표시하지 않은 식품을 영업에 사용",
                        questionType: "5-choice",
                        score: 5,
                        img:["/resources/img/ex01.jpg", "/resources/img/ex02.jpg"],
                        PDT_NM_DTPLC: "싱크대",
                        VLT_CNT: "2개",
                        CAUSE: "직원의 위생 부주의",
                        violationOfLaws: "식품위생관리법 위반",
                        improvementMeasures: "직원에게 싱크대 및 기타 위생 관련 시설의 청소 및 유지 관리 교육을 강화하고, 청소 확인 체크리스트를 도입하여 매일의 청소 상태를 기록하도록 합니다. 또한, 주기적인 위생 점검을 실시하여 위생 관리가 표준에 부합하도록 지속적으로 모니터링합니다.",
                        violations: "싱크대 물때 제거 미흡",
                        CAUPVD: ["점원", "해당 직원이 정기적인 청소 절차와 위생 관리 지침을 준수하지 않아 싱크대의 물때 제거가 미흡한 상태로 방치되었습니다."]

                    }
                ]
            },
            {
                subcategoryName: "영업정지 1개월 이상",
                questions: [
                    {
                        questionId: 3,
                        questionText: "3. 표시사항 전부를 표시하지 않은 식품을 영업에 사용",
                        questionType: "2-choice",
                        score: 5,
                        img:["/resources/img/ex01.jpg", "/resources/img/ex02.jpg"],
                        PDT_NM_DTPLC: "싱크대",
                        VLT_CNT: "2개",
                        CAUSE: "직원의 위생 부주의",
                        violationOfLaws: "식품위생관리법 위반",
                        improvementMeasures: "직원에게 싱크대 및 기타 위생 관련 시설의 청소 및 유지 관리 교육을 강화하고, 청소 확인 체크리스트를 도입하여 매일의 청소 상태를 기록하도록 합니다. 또한, 주기적인 위생 점검을 실시하여 위생 관리가 표준에 부합하도록 지속적으로 모니터링합니다.",
                        violations: "싱크대 물때 제거 미흡",
                        CAUPVD: ["점주", "해당 직원이 정기적인 청소 절차와 위생 관리 지침을 준수하지 않아 싱크대의 물때 제거가 미흡한 상태로 방치되었습니다."]

                    }
                ]
            },
            {
                subcategoryName: "과태료",
                questions: [
                    {
                        questionId: 4,
                        questionText: "4. 표시사항 전부를 표시하지 않은 식품을 영업에 사용",
                        questionType: "5-choice",
                        score: 5,
                        img:"",
                        PDT_NM_DTPLC: "싱크대",
                        VLT_CNT: "2개",
                        CAUSE: "직원의 위생 부주의",
                        violationOfLaws: "식품위생관리법 위반",
                        improvementMeasures: "직원에게 싱크대 및 기타 위생 관련 시설의 청소 및 유지 관리 교육을 강화하고, 청소 확인 체크리스트를 도입하여 매일의 청소 상태를 기록하도록 합니다. 또한, 주기적인 위생 점검을 실시하여 위생 관리가 표준에 부합하도록 지속적으로 모니터링합니다.",
                        violations: "싱크대 물때 제거 미흡",
                        CAUPVD: ["점주", "해당 직원이 정기적인 청소 절차와 위생 관리 지침을 준수하지 않아 싱크대의 물때 제거가 미흡한 상태로 방치되었습니다."]

                    }
                ]
            },
            // 추가적인 중분류와 문항들...
        ]
    },
    {
        categoryName: "위생관리",
        categoryId: "category3",
        totalScore: 30,
        appropriate: 20,
        inappropriate: 10,
        notApplicable: 0,
        subcategories: [
            {
                subcategoryName: "영업정지 15일 이상",
                questions: [
                    {
                        questionId: 1,
                        questionText: "1. 소비기한 변조 및 삭제",
                        questionType: "2-choice",
                        score: 5,
                        img:"",
                        PDT_NM_DTPLC: "싱크대",
                        VLT_CNT: "2개",
                        CAUSE: "직원의 위생 부주의",
                        violationOfLaws: "식품위생관리법 위반",
                        improvementMeasures: "직원에게 싱크대 및 기타 위생 관련 시설의 청소 및 유지 관리 교육을 강화하고, 청소 확인 체크리스트를 도입하여 매일의 청소 상태를 기록하도록 합니다. 또한, 주기적인 위생 점검을 실시하여 위생 관리가 표준에 부합하도록 지속적으로 모니터링합니다.",
                        violations: "싱크대 물때 제거 미흡",
                        CAUPVD: ["점원", "해당 직원이 정기적인 청소 절차와 위생 관리 지침을 준수하지 않아 싱크대의 물때 제거가 미흡한 상태로 방치되었습니다."]

                    }
                ]
            },
            {
                subcategoryName: "시정명령",
                questions: [
                    {
                        questionId: 2,
                        questionText: "2. 표시사항 전부를 표시하지 않은 식품을 영업에 사용",
                        questionType: "5-choice",
                        score: 5,
                        img:["/resources/img/ex01.jpg", "/resources/img/ex02.jpg"],
                        PDT_NM_DTPLC: "싱크대",
                        VLT_CNT: "2개",
                        CAUSE: "직원의 위생 부주의",
                        violationOfLaws: "식품위생관리법 위반",
                        improvementMeasures: "직원에게 싱크대 및 기타 위생 관련 시설의 청소 및 유지 관리 교육을 강화하고, 청소 확인 체크리스트를 도입하여 매일의 청소 상태를 기록하도록 합니다. 또한, 주기적인 위생 점검을 실시하여 위생 관리가 표준에 부합하도록 지속적으로 모니터링합니다.",
                        violations: "싱크대 물때 제거 미흡",
                        CAUPVD: ["점원 노승우", "해당 직원이 정기적인 청소 절차와 위생 관리 지침을 준수하지 않아 싱크대의 물때 제거가 미흡한 상태로 방치되었습니다."]

                    }
                ]
            },
            {
                subcategoryName: "영업정지 1개월 이상",
                questions: [
                    {
                        questionId: 3,
                        questionText: "3. 표시사항 전부를 표시하지 않은 식품을 영업에 사용",
                        questionType: "2-choice",
                        score: 5,
                        img:"",
                        PDT_NM_DTPLC: "싱크대",
                        VLT_CNT: "2개",
                        CAUSE: "직원의 위생 부주의",
                        violationOfLaws: "식품위생관리법 위반",
                        improvementMeasures: "직원에게 싱크대 및 기타 위생 관련 시설의 청소 및 유지 관리 교육을 강화하고, 청소 확인 체크리스트를 도입하여 매일의 청소 상태를 기록하도록 합니다. 또한, 주기적인 위생 점검을 실시하여 위생 관리가 표준에 부합하도록 지속적으로 모니터링합니다.",
                        violations: "싱크대 물때 제거 미흡",
                        CAUPVD: ["점원", "해당 직원이 정기적인 청소 절차와 위생 관리 지침을 준수하지 않아 싱크대의 물때 제거가 미흡한 상태로 방치되었습니다."]

                    }
                ]
            },
            {
                subcategoryName: "과태료",
                questions: [
                    {
                        questionId: 4,
                        questionText: "4. 표시사항 전부를 표시하지 않은 식품을 영업에 사용",
                        questionType: "5-choice",
                        score: 5,
                        img:["/resources/img/ex01.jpg", "/resources/img/ex02.jpg"],
                        PDT_NM_DTPLC: "싱크대",
                        VLT_CNT: "2개",
                        CAUSE: "직원의 위생 부주의",
                        violationOfLaws: "식품위생관리법 위반",
                        improvementMeasures: "직원에게 싱크대 및 기타 위생 관련 시설의 청소 및 유지 관리 교육을 강화하고, 청소 확인 체크리스트를 도입하여 매일의 청소 상태를 기록하도록 합니다. 또한, 주기적인 위생 점검을 실시하여 위생 관리가 표준에 부합하도록 지속적으로 모니터링합니다.",
                        violations: "싱크대 물때 제거 미흡",
                        CAUPVD: ["점주 이지훈", "해당 직원이 정기적인 청소 절차와 위생 관리 지침을 준수하지 않아 싱크대의 물때 제거가 미흡한 상태로 방치되었습니다."]

                    }
                ]
            },
            // 추가적인 중분류와 문항들...
        ]
    },
    {
        categoryName: "위생지도상황",
        categoryId: "category4",
        totalScore: 20,
        appropriate: 10,
        inappropriate: 0,
        notApplicable: 0,
        subcategories: [
            {
                subcategoryName: "영업정지 15일 이상",
                questions: [
                    {
                        questionId: 1,
                        questionText: "1. 소비기한 변조 및 삭제",
                        questionType: "2-choice",
                        score: 5,
                        img:["/resources/img/ex01.jpg", "/resources/img/ex02.jpg"],
                        PDT_NM_DTPLC: "싱크대",
                        VLT_CNT: "2개",
                        CAUSE: "직원의 위생 부주의",
                        violationOfLaws: "식품위생관리법 위반",
                        improvementMeasures: "직원에게 싱크대 및 기타 위생 관련 시설의 청소 및 유지 관리 교육을 강화하고, 청소 확인 체크리스트를 도입하여 매일의 청소 상태를 기록하도록 합니다. 또한, 주기적인 위생 점검을 실시하여 위생 관리가 표준에 부합하도록 지속적으로 모니터링합니다.",
                        violations: "싱크대 물때 제거 미흡",
                        CAUPVD: ["점주 유재원", "해당 직원이 정기적인 청소 절차와 위생 관리 지침을 준수하지 않아 싱크대의 물때 제거가 미흡한 상태로 방치되었습니다."]

                    }
                ]
            },
            {
                subcategoryName: "시정명령",
                questions: [
                    {
                        questionId: 2,
                        questionText: "2. 표시사항 전부를 표시하지 않은 식품을 영업에 사용",
                        questionType: "5-choice",
                        score: 5,
                        img:"",
                        PDT_NM_DTPLC: "싱크대",
                        VLT_CNT: "2개",
                        CAUSE: "직원의 위생 부주의",
                        violationOfLaws: "식품위생관리법 위반",
                        improvementMeasures: "직원에게 싱크대 및 기타 위생 관련 시설의 청소 및 유지 관리 교육을 강화하고, 청소 확인 체크리스트를 도입하여 매일의 청소 상태를 기록하도록 합니다. 또한, 주기적인 위생 점검을 실시하여 위생 관리가 표준에 부합하도록 지속적으로 모니터링합니다.",
                        violations: "싱크대 물때 제거 미흡",
                        CAUPVD: ["점주 원승언", "해당 직원이 정기적인 청소 절차와 위생 관리 지침을 준수하지 않아 싱크대의 물때 제거가 미흡한 상태로 방치되었습니다."]

                    }
                ]
            },
            {
                subcategoryName: "영업정지 1개월 이상",
                questions: [
                    {
                        questionId: 3,
                        questionText: "3. 표시사항 전부를 표시하지 않은 식품을 영업에 사용",
                        questionType: "2-choice",
                        score: 5,
                        img:["/resources/img/ex01.jpg", "/resources/img/ex02.jpg"],
                        PDT_NM_DTPLC: "싱크대",
                        VLT_CNT: "2개",
                        CAUSE: "직원의 위생 부주의",
                        violationOfLaws: "식품위생관리법 위반",
                        improvementMeasures: "직원에게 싱크대 및 기타 위생 관련 시설의 청소 및 유지 관리 교육을 강화하고, 청소 확인 체크리스트를 도입하여 매일의 청소 상태를 기록하도록 합니다. 또한, 주기적인 위생 점검을 실시하여 위생 관리가 표준에 부합하도록 지속적으로 모니터링합니다.",
                        violations: "싱크대 물때 제거 미흡",
                        CAUPVD: ["점원", "해당 직원이 정기적인 청소 절차와 위생 관리 지침을 준수하지 않아 싱크대의 물때 제거가 미흡한 상태로 방치되었습니다."]

                    }
                ]
            },
            {
                subcategoryName: "과태료",
                questions: [
                    {
                        questionId: 4,
                        questionText: "4. 표시사항 전부를 표시하지 않은 식품을 영업에 사용",
                        questionType: "5-choice",
                        score: 5,
                        img:["/resources/img/ex01.jpg", "/resources/img/ex02.jpg"],
                        PDT_NM_DTPLC: "싱크대",
                        VLT_CNT: "2개",
                        CAUSE: "직원의 위생 부주의",
                        violationOfLaws: "식품위생관리법 위반",
                        improvementMeasures: "직원에게 싱크대 및 기타 위생 관련 시설의 청소 및 유지 관리 교육을 강화하고, 청소 확인 체크리스트를 도입하여 매일의 청소 상태를 기록하도록 합니다. 또한, 주기적인 위생 점검을 실시하여 위생 관리가 표준에 부합하도록 지속적으로 모니터링합니다.",
                        violations: "싱크대 물때 제거 미흡",
                        CAUPVD: ["점원", "해당 직원이 정기적인 청소 절차와 위생 관리 지침을 준수하지 않아 싱크대의 물때 제거가 미흡한 상태로 방치되었습니다."]

                    }
                ]
            },
            // 추가적인 중분류와 문항들...
        ]
    },
    // 다른 카테고리들...
];

// 페이지 로드 시 실행
document.addEventListener("DOMContentLoaded", function () {
    initializeTabs();
    generateDetailedItems(); // 세부결과 탭의 상세 항목을 동적으로 생성
    initializeDetailButtons();
});

// 탭 초기화 함수
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

// 세부결과 탭의 상세 항목을 동적으로 생성하는 함수
function generateDetailedItems() {
    const detailedSection = document.querySelector('.detailed-section');
    detailedSection.innerHTML = ''; // 기존 내용 제거

    inspectionData.forEach((category, index) => {
        // detailed-item 생성
        const detailedItem = document.createElement('div');
        detailedItem.classList.add('detailed-item');

        // item-header 생성
        const itemHeader = document.createElement('div');
        itemHeader.classList.add('item-header');

        // 카테고리 이름 h3 생성
        const h3 = document.createElement('h3');
        h3.textContent = category.categoryName;

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
        ['배점', '적합', '부적합', '해당없음'].forEach(text => {
            const th = document.createElement('th');
            th.textContent = text;
            trHead.appendChild(th);
        });
        thead.appendChild(trHead);

        // 테이블 바디 생성
        const tbody = document.createElement('tbody');
        const trBody = document.createElement('tr');
        [category.totalScore, category.appropriate, category.inappropriate, category.notApplicable].forEach(value => {
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
    const inspectionList = document.getElementById("inspection-lastCheck-list");

    let lastOpenedIndex = null; // 마지막으로 열린 카테고리의 인덱스 추적

    detailButtons.forEach((button, index) => {
        button.addEventListener("click", function () {
            // 이미 열려있는 카테고리를 다시 클릭한 경우, 내용을 숨김
            if (lastOpenedIndex === index) {
                inspectionList.style.display = "none";
                lastOpenedIndex = null; // 인덱스 초기화
                return;
            }

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

            // 상세보기 버튼 클릭 시 inspection-lastCheck-list를 보이기
            inspectionList.style.display = "block";
            inspectionList.scrollIntoView({ behavior: 'smooth', block: 'start' }); // 스크롤 이동

            // 마지막으로 열린 인덱스를 현재 인덱스로 업데이트
            lastOpenedIndex = index;
        });
    });
}


// 하단의 상세 리스트를 생성하는 함수
function generateInspectionList(category) {
    const inspectionList = document.getElementById('inspection-lastCheck-list');
    const checkItem = inspectionList.querySelector('.check-item');
    checkItem.innerHTML = ''; // 기존 내용 제거

    category.subcategories.forEach(subcategory => {
        const checkSubitem = document.createElement('div');
        checkSubitem.classList.add('check-subitem');

        const subitemTitle = document.createElement('p');
        subitemTitle.classList.add('subitem-title');
        subitemTitle.textContent = subcategory.subcategoryName;
        checkSubitem.appendChild(subitemTitle);

        subcategory.questions.forEach(question => {
            const subitemInfoWrapper = document.createElement('div');
            subitemInfoWrapper.classList.add('subitem-info-wrapper');

            const questionP = document.createElement('p');
            questionP.textContent = question.questionText;
            subitemInfoWrapper.appendChild(questionP);

            const infoUl = document.createElement('ul');
            infoUl.classList.add('subitem-info');

            const infoItems = [
                { label: '배점/결과', value: `${question.score} / ${question.score}`, class: 'score' },
                { label: '과태료', value: '-' },
                { label: '영업정지', value: '-' }
            ];

            infoItems.forEach(item => {
                const li = document.createElement('li');
                li.classList.add('info-box');

                const p = document.createElement('p');
                p.textContent = item.label;

                const span = document.createElement('span');
                if (item.class) span.classList.add(item.class);
                span.textContent = item.value;

                li.appendChild(p);
                li.appendChild(span);
                infoUl.appendChild(li);
            });

            subitemInfoWrapper.appendChild(infoUl);

            const editBtn = document.createElement('button');
            editBtn.classList.add('edit-btn');
            editBtn.textContent = '더보기';
            subitemInfoWrapper.appendChild(editBtn);

            const contentWrapper = document.createElement('div');
            contentWrapper.classList.add('inspection-content-wrapper');
            contentWrapper.style.height = '0px'; // 초기에는 숨김

            const imageSection = document.createElement('div');
            imageSection.classList.add('image-section');

            // 이미지 처리 부분
            if (question.img && question.img.length > 0) {
                question.img.forEach(imgSrc => {
                    // 이미지와 아이콘을 감싸는 img-wrapper 생성
                    const imgWrapper = document.createElement('div');
                    imgWrapper.classList.add('img-wrapper'); // 이미지와 아이콘을 감쌀 div

                    // 확대 아이콘 생성
                    const zoomIcon = document.createElement('div');
                    zoomIcon.classList.add('zoom-icon');
                    const iconElement = document.createElement('i');
                    iconElement.classList.add('bi', 'bi-fullscreen'); // 부트스트랩 아이콘
                    zoomIcon.appendChild(iconElement);

                    imgWrapper.appendChild(zoomIcon);

                    // 이미지 요소 생성 및 추가
                    const imgElement = document.createElement('img');
                    imgElement.src = imgSrc;
                    imgElement.classList.add('inspection-image');
                    imgWrapper.appendChild(imgElement);

                    // 이미지 및 아이콘 클릭 시 모달 오픈 이벤트
                    imgElement.addEventListener('click', () => openModal(imgSrc));
                    zoomIcon.addEventListener('click', () => openModal(imgSrc));

                    // imageSection에 img-wrapper 추가
                    imageSection.appendChild(imgWrapper);
                });

                // 이미지가 하나만 있을 때 두 번째 자리에 빈 placeholder 추가
                if (question.img.length === 1) {
                    const placeholder = document.createElement('div');
                    placeholder.classList.add('image-placeholder');
                    const placeholderText = document.createElement('p');
                    placeholderText.textContent = '이미지 미등록'; // p 태그로 텍스트 추가
                    placeholder.appendChild(placeholderText);
                    imageSection.appendChild(placeholder);
                }
            } else {
                // 이미지가 없을 때 placeholder 두 개 생성
                for (let i = 0; i < 2; i++) {
                    const placeholder = document.createElement('div');
                    placeholder.classList.add('image-placeholder');
                    const placeholderText = document.createElement('p');
                    placeholderText.textContent = '이미지 미등록'; // p 태그로 텍스트 추가
                    placeholder.appendChild(placeholderText);
                    imageSection.appendChild(placeholder);
                }
            }

            // imageSection을 contentWrapper에 추가
            contentWrapper.appendChild(imageSection);


            const detailSection = document.createElement('div');
            detailSection.classList.add('detail-section');

            const detailItems = [
                { label: '제품명 (또는 상세위치)', value: question.PDT_NM_DTPLC },
                { label: '위반수량', value: question.VLT_CNT },
                { label: '원인', value: question.CAUSE },
                { label: '위반법규', value: question.violationOfLaws },
                { label: '개선조치사항', value: question.improvementMeasures },
                { label: '위반사항', value: question.violations },
                { label: '귀책사유', value: question.CAUPVD }
            ];

            detailItems.forEach((item, index) => {
                if (index % 2 === 0 && index < 4) {
                    const wrapperDiv = document.createElement('div');
                    wrapperDiv.classList.add('detail-item-row');

                    const firstDiv = document.createElement('div');
                    const firstLabel = document.createElement('p');
                    firstLabel.textContent = detailItems[index].label;
                    const firstValue = document.createElement('p');
                    firstValue.textContent = detailItems[index].value;
                    firstDiv.appendChild(firstLabel);
                    firstDiv.appendChild(firstValue);

                    const secondDiv = document.createElement('div');
                    const secondLabel = document.createElement('p');
                    secondLabel.textContent = detailItems[index + 1].label;
                    const secondValue = document.createElement('p');
                    secondValue.textContent = detailItems[index + 1].value;
                    secondDiv.appendChild(secondLabel);
                    secondDiv.appendChild(secondValue);

                    wrapperDiv.appendChild(firstDiv);
                    wrapperDiv.appendChild(secondDiv);
                    detailSection.appendChild(wrapperDiv);
                } else if (index >= 4) {
                    const singleWrapperDiv = document.createElement('div');
                    singleWrapperDiv.classList.add('detail-single-item');

                    const label = document.createElement('p');
                    label.textContent = item.label;
                    singleWrapperDiv.appendChild(label); // Label 추가

                    if (Array.isArray(item.value)) {
                        // CAUPVD 배열 처리
                        item.value.forEach((subValue) => {
                            const valueParagraph = document.createElement('p');
                            valueParagraph.textContent = subValue;
                            singleWrapperDiv.appendChild(valueParagraph);
                        });
                    } else {
                        const value = document.createElement('p');
                        value.textContent = item.value;
                        singleWrapperDiv.appendChild(value);
                    }

                    detailSection.appendChild(singleWrapperDiv);
                }
            });


            contentWrapper.appendChild(detailSection);

            editBtn.addEventListener('click', function () {
                if (contentWrapper.style.height === '0px' || contentWrapper.style.height === '') {
                    openContent(contentWrapper);
                    adjustWrapperHeight(contentWrapper);
                    contentWrapper.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    editBtn.textContent = '닫기';
                } else {
                    closeContent(contentWrapper);
                    editBtn.textContent = '더보기';
                }
            });

            subitemInfoWrapper.appendChild(contentWrapper);
            checkSubitem.appendChild(subitemInfoWrapper);
        });

        checkItem.appendChild(checkSubitem);
    });
}

// 모달 열기 함수
function openModal(imgSrc) {
    const modal = document.createElement('div');
    modal.classList.add('modal');

    const modalImage = document.createElement('img');
    modalImage.src = imgSrc;
    modal.appendChild(modalImage);

    const closeButton = document.createElement('span');
    closeButton.classList.add('modal-close');
    closeButton.innerHTML = '&times;';
    modal.appendChild(closeButton);

    closeButton.addEventListener('click', () => {
        document.body.removeChild(modal);
    });

    modal.addEventListener('click', () => {
        document.body.removeChild(modal);
    });

    document.body.appendChild(modal);
    modal.style.display = 'flex';
}


// 콘텐츠 열기 함수
function openContent(element) {
    element.style.padding = "20px"; // padding을 먼저 설정
    element.offsetHeight; // 강제 리플로우 발생

    element.style.display = "block"; // display를 block으로 변경
    element.style.overflow = "hidden"; // overflow 설정
    element.style.height = "0px"; // 초기 높이 설정
    element.offsetHeight; // 강제 리플로우 발생

    // 최종 높이 설정 후 애니메이션 시작
    element.style.height = element.scrollHeight + "px";
    element.style.transition = "height 0.3s ease, padding 0.3s ease";

    // 리사이즈 이벤트 추가 (열려 있는 동안)
    window.addEventListener('resize', () => adjustWrapperHeight(element));
}

// 콘텐츠 닫기 함수
function closeContent(element) {
    element.style.height = element.scrollHeight + "px"; // 현재 높이로 설정
    element.offsetHeight; // 강제 리플로우 발생

    // 높이와 padding을 0으로 애니메이션
    element.style.height = "0px";
    element.style.padding = "0px";
    element.style.transition = "height 0.3s ease, padding 0.3s ease";

    // transition 종료 후 display를 none으로 설정
    element.addEventListener('transitionend', function onTransitionEnd() {
        if (element.style.height === "0px") {
            element.style.display = "none"; // display를 none으로 설정

            // 리사이즈 이벤트 제거 (닫힐 때)
            window.removeEventListener('resize', () => adjustWrapperHeight(element));
        }
        element.removeEventListener('transitionend', onTransitionEnd); // 리스너 제거
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
