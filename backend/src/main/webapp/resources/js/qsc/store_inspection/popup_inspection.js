// 예시 JSON 데이터
const inspectionData = [
    {
        categoryName: "중대법규",
        categoryId: "중대법규",
        subcategories: [
            {
                subcategoryName: "영업취소",
                questions: [
                    {
                        questionId: 1,
                        questionText: "1. 소비기한 변조 및 삭제",
                        questionType: "2-choice"
                    }
                ]
            },
            {
                subcategoryName: "영업정지 1개월 이상",
                questions: [
                    {
                        questionId: 2,
                        questionText: "2. 표시사항 전부를 표시하지 않은 식품을 영업에 사용",
                        questionType: "5-choice"
                    },
                    {
                        questionId: 3,
                        questionText: "3. 식품안전법 위반에 괸한 법률",
                        questionType: "5-choice"
                    }
                ]
            },
            {
                subcategoryName: "영업정지 15일 이상",
                questions: [
                    {
                        questionId: 4,
                        questionText: "4. 표시사항 전부를 표시하지 않은 식품을 영업에 사용",
                        questionType: "2-choice"
                    }
                ]
            }
            // 추가적인 중분류와 문항들을 여기에 추가하세요...
        ]
    },
    {
        categoryName: "기타법규",
        categoryId: "기타법규",
        subcategories: [
            {
                subcategoryName: "영업취소",
                questions: [
                    {
                        questionId: 1,
                        questionText: "1. 소비기한 변조 및 삭제",
                        questionType: "2-choice"
                    }
                ]
            }
        ]
    },
    {
        categoryName: "위생관리",
        categoryId: "위생관리",
        subcategories: [
            {
                subcategoryName: "영업취소",
                questions: [
                    {
                        questionId: 1,
                        questionText: "1. 소비기한 변조 및 삭제",
                        questionType: "2-choice"
                    }
                ]
            }
        ]
    },
    {
        categoryName: "위생지도상황",
        categoryId: "위생지도상황",
        subcategories: [
            {
                subcategoryName: "과태료",
                questions: [
                    {
                        questionId: 1,
                        questionText: "1. 소비기한 변조 및 삭제",
                        questionType: "2-choice"
                    }
                ]
            }
        ]
    },
    // 대분류 추가하기!
];

// 콘텐츠를 동적으로 생성하는 함수
function generateContent(data) {
    // 탭 버튼들을 생성
    const tabContainer = document.querySelector('.inspection-tabs');
    const contentContainer = document.querySelector('.inspection-section');

    data.forEach((category, index) => {
        // 탭 버튼 생성
        const tabButton = document.createElement('button');
        tabButton.classList.add('inspection-tab');
        if (index === 0) tabButton.classList.add('active');
        tabButton.setAttribute('data-tab', category.categoryId);
        tabButton.textContent = category.categoryName;
        tabContainer.appendChild(tabButton);

        // 콘텐츠 섹션 생성
        const section = document.createElement('section');
        section.classList.add('inspection-list');
        section.id = category.categoryId;
        if (index === 0) section.classList.add('active');

        // 중분류와 문항들 생성
        category.subcategories.forEach(subcategory => {
            const inspectionBox = document.createElement('div');
            inspectionBox.classList.add('inspection-box');

            // 중분류 헤더 생성
            const inspectionHeader = document.createElement('div');
            inspectionHeader.classList.add('inspection-header');
            inspectionHeader.textContent = subcategory.subcategoryName;
            const toggleIcon = document.createElement('span');
            toggleIcon.classList.add('toggle-icon');
            toggleIcon.textContent = '▼';
            inspectionHeader.appendChild(toggleIcon);

            // 중분류 내용 컨테이너 생성
            const inspectionContent = document.createElement('div');
            inspectionContent.classList.add('inspection-content');

            subcategory.questions.forEach(question => {
                // 문항 상세 내용 생성
                const inspectionContentDetail = document.createElement('div');
                inspectionContentDetail.classList.add('inspection-content-detail');

                const questionText = document.createElement('p');
                questionText.textContent = question.questionText;
                inspectionContentDetail.appendChild(questionText);

                const addBtn = document.createElement('button');
                addBtn.classList.add('add-btn');
                addBtn.textContent = '+';
                inspectionContentDetail.appendChild(addBtn);

                inspectionContent.appendChild(inspectionContentDetail);

                // 문항 내용 래퍼 생성
                const inspectionContentWrapper = document.createElement('div');
                inspectionContentWrapper.classList.add('inspection-content-wrapper');

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

                inspectionContentWrapper.appendChild(answerSection);

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

                // 먼저 photoBoxes를 정의하고 나서 setupPhotoUpload 호출
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

                photoSection.appendChild(photoButtons);
                photoSection.appendChild(photoBoxes);

                // setupPhotoUpload 호출
                setupPhotoUpload(photoBoxes, cameraBtn, galleryBtn);

                inspectionContentWrapper.appendChild(photoSection);

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

                inspectionContentWrapper.appendChild(storeInfo);

                inspectionContent.appendChild(inspectionContentWrapper);
            });

            inspectionBox.appendChild(inspectionHeader);
            inspectionBox.appendChild(inspectionContent);
            section.appendChild(inspectionBox);
        });

        contentContainer.appendChild(section);
    });

    // 점수 영역을 동적으로 생성하여 삽입
    const totalScore = document.createElement('div');
    totalScore.classList.add('inspection-total-score');
    totalScore.innerHTML = '<p>총 <span>100</span> 점</p>';

    contentContainer.appendChild(totalScore);  // section 내부에 추가

    // 이벤트 리스너 재등록
    addEventListeners();
}


// -----------------사진 업로드 및 촬영 기능 설정--------------
// -----------------사진 업로드 및 촬영 기능 설정--------------
function setupPhotoUpload(photoBoxes, cameraBtn, galleryBtn) {
    let photoCount = 0;

    // 카메라 버튼 클릭 시
    cameraBtn.addEventListener('click', function () {
        if (photoCount >= 2) {
            alert('이미지는 최대 2개까지만 업로드할 수 있습니다.');
            return;
        }

        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/*';
        fileInput.capture = 'camera';  // 카메라만 호출
        fileInput.style.display = 'none';

        fileInput.addEventListener('change', function (event) {
            const file = event.target.files[0];
            if (file) {
                displayImage(file, photoBoxes);
                photoCount++;
            }
        });

        fileInput.click();
    });

    // 갤러리 버튼 클릭 시
    galleryBtn.addEventListener('click', function () {
        if (photoCount >= 2) {
            alert('이미지는 최대 2개까지만 업로드할 수 있습니다.');
            return;
        }

        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/*';
        fileInput.style.display = 'none';

        fileInput.addEventListener('change', function (event) {
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
        imageBox.style.backgroundImage = ''; // 배경 이미지 제거
        imageBox.textContent = '사진 미등록'; // 기본 텍스트로 복원
        const deleteButton = imageBox.querySelector('.delete-btn');
        if (deleteButton) {
            deleteButton.remove(); // 삭제 버튼 제거
        }
        photoCount--; // 사진 개수 감소
    }

    // 이미지 파일을 표시하는 함수
    function displayImage(file, photoBoxes) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const emptyBox = Array.from(photoBoxes.children).find(box => !box.style.backgroundImage);
            if (emptyBox) {
                // 이미지 표시
                emptyBox.style.backgroundImage = `url(${e.target.result})`;
                emptyBox.style.backgroundSize = 'cover';
                emptyBox.style.backgroundPosition = 'center';
                emptyBox.style.backgroundRepeat = 'no-repeat';
                emptyBox.textContent = '';

                // X 버튼 추가
                const deleteButton = document.createElement('button');
                deleteButton.classList.add('delete-btn');
                deleteButton.innerHTML = '<i class="fa-solid fa-xmark"></i>';

                // 이미지 삭제 기능
                deleteButton.addEventListener('click', function () {
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
    element.style.overflow = 'hidden';  // 항상 애니메이션 중에는 overflow를 hidden으로

    function step(currentTime) {
        const progress = Math.min((currentTime - startTime) / duration, 1);
        const currentHeight = startHeight + progress * (endHeight - startHeight);

        element.style.height = currentHeight + 'px';

        if (progress < 1) {
            requestAnimationFrame(step);
        } else {
            // 애니메이션이 끝나면 처리
            if (endHeight > 0) {
                element.style.height = 'auto';  // 콘텐츠 크기에 맞게 height auto로 설정
                element.style.overflow = 'visible';  // 콘텐츠가 모두 보이도록 overflow visible로 변경
            } else {
                element.style.height = '0';
            }
        }
    }

    requestAnimationFrame(step);
}

// toggleInspectionContent 함수
function toggleInspectionContent(button) {
    const contentWrapper = button.closest('.inspection-content-detail').nextElementSibling;

    if (contentWrapper.classList.contains('open')) {
        const startHeight = contentWrapper.scrollHeight;
        contentWrapper.classList.remove('open');

        // 애니메이션으로 닫기
        animateHeight(contentWrapper, startHeight, 0, 300); // 300ms 동안 애니메이션

        button.textContent = '+'; // 버튼 기호 변경
    } else {
        contentWrapper.classList.add('open');

        // 열릴 때의 높이 계산
        const endHeight = contentWrapper.scrollHeight;

        // 애니메이션으로 열기
        animateHeight(contentWrapper, 0, endHeight, 300);

        button.textContent = '-'; // 버튼 기호 변경
    }
}

// toggleContent 함수 정의 (inspection-header용)
function toggleContent(content, header) {
    if (content.classList.contains('open')) {
        const startHeight = content.scrollHeight;
        content.classList.remove('open');
        animateHeight(content, startHeight, 0, 300); // 300ms 동안 높이 애니메이션
        header.querySelector('.toggle-icon').style.transform = 'rotate(0deg)';
    } else {
        content.classList.add('open');
        const endHeight = content.scrollHeight;
        animateHeight(content, 0, endHeight, 300); // 300ms 동안 높이 애니메이션
        header.querySelector('.toggle-icon').style.transform = 'rotate(180deg)';
    }
}

// 콘텐츠 높이를 조정하는 함수
function adjustWrapperHeight(element) {
    element.style.height = 'auto'; // 높이를 자동으로 일단 설정
    const newHeight = element.scrollHeight; // 새로운 높이 계산
    element.style.height = newHeight + 'px'; // 새로운 높이를 적용
    element.style.transition = 'height 0.5s ease'; // 부드러운 전환
}

// 이벤트 리스너를 등록하는 함수
function addEventListeners() {
    // add-btn 클릭 이벤트 처리
    document.querySelectorAll('.add-btn').forEach(button => {
        button.addEventListener('click', function() {
            toggleInspectionContent(this);
        });
    });

    // inspection-header 클릭 이벤트 처리
    document.querySelectorAll('.inspection-header').forEach(header => {
        header.addEventListener('click', function(e) {
            e.stopPropagation();
            const content = header.nextElementSibling;
            toggleContent(content, header);
        });
    });

    // 탭 버튼 클릭 이벤트 처리
    document.querySelectorAll('.inspection-tab').forEach(tab => {
        tab.addEventListener('click', function () {
            // 모든 탭에서 active 클래스 제거
            document.querySelectorAll('.inspection-tab').forEach(tab => tab.classList.remove('active'));
            this.classList.add('active');

            // 모든 inspection-list 숨기기
            document.querySelectorAll('.inspection-list').forEach(list => list.classList.remove('active'));

            // 클릭한 탭에 해당하는 콘텐츠 보여주기
            const contentId = this.getAttribute('data-tab');
            document.getElementById(contentId).classList.add('active');
        });
    });

    // 위치정보/상세입력 탭 버튼 클릭 이벤트 처리
    document.querySelectorAll('.tab-btn').forEach(button => {
        button.addEventListener('click', function (e) {
            e.stopPropagation();

            const parentWrapper = button.closest('.store-info');
            const tabButtons = parentWrapper.querySelectorAll('.tab-btn');
            tabButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            const locationContent = parentWrapper.querySelector('.location-content');
            const detailContent = parentWrapper.querySelector('.detail-content');

            if (this.textContent === '위치정보') {
                locationContent.style.display = 'block';
                detailContent.style.display = 'none';
            } else if (this.textContent === '상세입력') {
                locationContent.style.display = 'none';
                detailContent.style.display = 'block';
            }

            adjustWrapperHeight(parentWrapper);
        });
    });

    // 추가적인 이벤트 리스너를 여기서 추가하세요...
}

// 페이지 로드 시 실행
document.addEventListener('DOMContentLoaded', function() {
    generateContent(inspectionData);

    // 첫 번째 탭과 콘텐츠를 active 상태로 설정
    const firstTab = document.querySelector('.inspection-tab');
    const firstContent = document.querySelector('.inspection-list');

    if (firstTab) {
        firstTab.classList.add('active');
    }

    if (firstContent) {
        firstContent.classList.add('active');
    }
});

// 높이 재조정 함수 (리사이즈 시 호출)
function adjustWrapperHeight(element) {
    if (element.style.display === "block") {
        element.style.height = "auto"; // 높이 자동 조정
        const newHeight = element.scrollHeight + "px"; // 새로운 높이 계산
        element.style.height = newHeight; // 새 높이 설정
    }
}


// -------------------------데이터 전달 함수-------------------------
function checkInspection() {
    // 모든 textarea 데이터를 가져옴
    const textareaData = {};
    document.querySelectorAll('textarea').forEach(textarea => {
        textareaData[textarea.name] = textarea.value;
    });

    // 폼을 생성하여 데이터를 전송
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = '/qsc/popup_middleCheck';

    // textarea 데이터를 숨겨진 input 필드로 추가
    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = 'textareaData';
    input.value = JSON.stringify(textareaData);
    form.appendChild(input);

    // 폼을 문서에 추가한 뒤 제출
    document.body.appendChild(form);
    form.submit();
}
