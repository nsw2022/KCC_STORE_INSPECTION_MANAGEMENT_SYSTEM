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
                        score: 5
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
                        score: 5
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
                        score: 5
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
                        score: 5
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
                        score: 5
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
                        score: 5
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
                        score: 5
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
                        score: 5
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
                        score: 5
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
                        score: 5
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
                        score: 5
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
                        score: 5
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
                        score: 5
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
                        score: 5
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
        });
    });
}

// 하단의 상세 리스트를 생성하는 함수
function generateInspectionList(category) {
    const inspectionList = document.getElementById('inspection-middleCheck-list');
    const checkItem = inspectionList.querySelector('.check-item');
    checkItem.innerHTML = ''; // 기존 내용 제거

    category.subcategories.forEach(subcategory => {
        // check-subitem 생성
        const checkSubitem = document.createElement('div');
        checkSubitem.classList.add('check-subitem');

        // subitem-title 생성
        const subitemTitle = document.createElement('p');
        subitemTitle.classList.add('subitem-title');
        subitemTitle.textContent = subcategory.subcategoryName;
        checkSubitem.appendChild(subitemTitle);

        subcategory.questions.forEach(question => {
            // subitem-info-wrapper 생성
            const subitemInfoWrapper = document.createElement('div');
            subitemInfoWrapper.classList.add('subitem-info-wrapper');

            // 질문 텍스트 생성
            const questionP = document.createElement('p');
            questionP.textContent = question.questionText;
            subitemInfoWrapper.appendChild(questionP);

            // 정보 박스 생성
            const infoUl = document.createElement('ul');
            infoUl.classList.add('subitem-info');

            // 배점/결과, 과태료, 영업정지 정보 생성
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
                if (item.class) {
                    span.classList.add(item.class);
                }
                span.textContent = item.value;

                li.appendChild(p);
                li.appendChild(span);

                infoUl.appendChild(li);
            });

            subitemInfoWrapper.appendChild(infoUl);

            // 수정하기 버튼 생성
            const editBtn = document.createElement('button');
            editBtn.classList.add('edit-btn');
            editBtn.textContent = '수정하기';

            subitemInfoWrapper.appendChild(editBtn);

            // 상세 입력 폼 생성 (inspection-content-wrapper)
            const contentWrapper = document.createElement('div');
            contentWrapper.classList.add('inspection-content-wrapper');
            contentWrapper.style.height = '0px'; // 초기에는 숨김

            // 답변 섹션 생성
            let answerSection;
            if (question.questionType === '2-choice') {
                answerSection = document.createElement('div');
                answerSection.classList.add('answer-section');

                const yesBtn = document.createElement('button');
                yesBtn.classList.add('answer-btn');
                yesBtn.textContent = '예';
                answerSection.appendChild(yesBtn);

                const noBtn = document.createElement('button');
                noBtn.classList.add('answer-btn');
                noBtn.textContent = '아니오';
                answerSection.appendChild(noBtn);
            } else if (question.questionType === '5-choice') {
                answerSection = document.createElement('div');
                answerSection.classList.add('answer-section2');

                const options = ['매우좋음', '좋음', '보통', '나쁨', '매우나쁨'];
                options.forEach(option => {
                    const label = document.createElement('label');
                    label.classList.add('radio-label2');

                    const input = document.createElement('input');
                    input.type = 'radio';
                    input.name = `rating_${question.questionId}`;
                    input.value = option;

                    label.appendChild(input);
                    label.appendChild(document.createTextNode(option));

                    answerSection.appendChild(label);
                });
            }

            contentWrapper.appendChild(answerSection);

            // 사진 업로드 섹션
            const photoSection = document.createElement('div');
            photoSection.classList.add('photo-section');

            const photoButtons = document.createElement('div');
            photoButtons.classList.add('photo-buttons');

            const cameraBtn = document.createElement('button');
            cameraBtn.classList.add('photo-btn', 'camera-btn');
            cameraBtn.innerHTML = '<i class="fa-solid fa-camera"></i>사진촬영';
            photoButtons.appendChild(cameraBtn);

            const galleryBtn = document.createElement('button');
            galleryBtn.classList.add('photo-btn', 'gallery-btn');
            galleryBtn.innerHTML = '<i class="fa-regular fa-image"></i>갤러리';
            photoButtons.appendChild(galleryBtn);

            photoSection.appendChild(photoButtons);

            const photoBoxes = document.createElement('div');
            photoBoxes.classList.add('photo-boxes');

            const photoBox1 = document.createElement('div');
            photoBox1.classList.add('photo-box');
            photoBox1.textContent = '사진 미등록';
            photoBoxes.appendChild(photoBox1);

            const photoBox2 = document.createElement('div');
            photoBox2.classList.add('photo-box');
            photoBox2.textContent = '최대 2개';
            photoBoxes.appendChild(photoBox2);

            photoSection.appendChild(photoBoxes);

            contentWrapper.appendChild(photoSection);

            // 매장 정보 라디오 버튼 리스트
            const storeInfo = document.createElement('div');
            storeInfo.classList.add('store-info');

            const tabSection = document.createElement('div');
            tabSection.classList.add('tab-section');

            const tabBtn1 = document.createElement('button');
            tabBtn1.classList.add('tab-btn', 'active');
            tabBtn1.textContent = '위치정보';
            tabSection.appendChild(tabBtn1);

            const tabBtn2 = document.createElement('button');
            tabBtn2.classList.add('tab-btn');
            tabBtn2.textContent = '상세입력';
            tabSection.appendChild(tabBtn2);

            storeInfo.appendChild(tabSection);

            // 위치정보 콘텐츠
            const locationContent = document.createElement('div');
            locationContent.classList.add('content', 'location-content');

            const locationContentList = document.createElement('div');
            locationContentList.classList.add('content', 'location-content-list');

            ['매장', '카페', '주방', '기타'].forEach(location => {
                const label = document.createElement('label');
                label.classList.add('radio-label');
                label.textContent = location;

                const input = document.createElement('input');
                input.type = 'radio';
                input.name = `location_${question.questionId}`;
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
            etcInput.name = `etc_${question.questionId}`;
            etcInput.placeholder = '기타사항을 입력해주세요';
            otherInfo.appendChild(etcInput);

            locationContent.appendChild(otherInfo);

            storeInfo.appendChild(locationContent);

            // 상세입력 콘텐츠
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

            const productName = document.createElement('input');
            productName.type = 'text';
            productName.classList.add('product-name');
            productName.placeholder = '제품명 입력';
            inputGroup1.appendChild(productName);

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
            inputGroup5.appendChild(violation);

            detailContent.appendChild(inputGroup5);

            const inputGroup6 = document.createElement('div');
            inputGroup6.classList.add('input-group');

            const label6 = document.createElement('label');
            label6.textContent = '귀책사유';
            inputGroup6.appendChild(label6);

            const radioGroup = document.createElement('div');
            radioGroup.classList.add('radio-group');

            ['SV', '점주', '직원', '기타'].forEach(responsibility => {
                const label = document.createElement('label');
                label.textContent = responsibility;

                const input = document.createElement('input');
                input.type = 'radio';
                input.name = `responsibility_${question.questionId}`;
                input.value = responsibility;
                label.appendChild(input);

                radioGroup.appendChild(label);
            });

            inputGroup6.appendChild(radioGroup);

            const caupvd = document.createElement('textarea');
            caupvd.classList.add('caupvd');
            caupvd.placeholder = '귀책사유를 입력해주세요';
            inputGroup6.appendChild(caupvd);

            detailContent.appendChild(inputGroup6);

            storeInfo.appendChild(detailContent);

            contentWrapper.appendChild(storeInfo);

            // 수정하기 버튼 이벤트 리스너 추가
            editBtn.addEventListener('click', function () {
                if (contentWrapper.style.height === "0px" || contentWrapper.style.height === "") {
                    openContent(contentWrapper);
                } else {
                    closeContent(contentWrapper);
                }
            });

            // 탭 버튼 이벤트 리스너 추가 (위치정보/상세입력)
            const tabButtons = tabSection.querySelectorAll('.tab-btn');
            tabButtons.forEach(button => {
                button.addEventListener('click', function (e) {
                    e.stopPropagation();

                    tabButtons.forEach(btn => btn.classList.remove('active'));
                    this.classList.add('active');

                    if (this.textContent === '위치정보') {
                        locationContent.style.display = 'block';
                        detailContent.style.display = 'none';
                    } else if (this.textContent === '상세입력') {
                        locationContent.style.display = 'none';
                        detailContent.style.display = 'block';
                    }

                    // contentWrapper 높이 재조정
                    adjustWrapperHeight(contentWrapper);
                });
            });

            // contentWrapper를 subitemInfoWrapper 내부에 추가
            subitemInfoWrapper.appendChild(contentWrapper);

            // subitemInfoWrapper를 check-subitem에 추가
            checkSubitem.appendChild(subitemInfoWrapper);
        });

        // check-item에 check-subitem 추가
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

// ------------------서명페이지로 데이터 넘기기-----------------
function middleCheckInspection() {
    // textarea 데이터를 가져옴 (textarea가 존재하지 않을 경우 빈 값으로 처리)
    const textareaInput = document.querySelector('.etc-input');
    const textareaData = textareaInput ? textareaInput.value : '';

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

