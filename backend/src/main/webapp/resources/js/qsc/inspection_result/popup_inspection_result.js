$(function () {
    /**
     * 처음 로딩될 때 내용 불러오기
     * 체크리스트, 점검유형, 총 벌금, 총 영업정지일수, 점검자, 점검완료일, 가맹점명, 브랜드명 정보를 받음
     */
    let inspResultId= $('input[type="hidden"]').val();
    $.ajax({
        url : `/qsc/popup/inspection/result/detail/${inspResultId}`,
        method: 'GET',
        success: function (data){
            let chklstNm = data.chklstNm + '(' + data.inspTypeNm + ')';
            let inspComplTm = '점검완료일 : ' + data.inspComplTm.slice(0, 8).replace(/(\d{4})(\d{2})(\d{2})/g, '$1-$2-$3');
            let inspectorNm = '점검자 : ' + data.mbrNm;
            $('.info-title').text(chklstNm);
            $('.store-name').text(data.brandNm);
            $('.store-subtitle').text(data.storeNm);
            $('.inspection-date').text(inspComplTm);
            $('.inspector-name').text(inspectorNm);
            $('.fine-amount span').text(data.totalPenalty);
            $('.closure-days span').text(data.totalBsnSspn);
        }
    })





    let inspectionData = [];
    /**
     * 점검 결과 ID를 통해 점검 결과를 가져오는 AJAX
     */
    $.ajax({
        url: `/qsc/popup/inspection/result/category/${inspResultId}`,
        method: 'GET',
        async: false,
        success: function (data) {
            inspectionData = data;
            console.log(inspectionData)
            /**
             *  최종점수 / 적합 & 부적합 & 항목 등 점수 및 결과와 관련된 사항 입력
             */
            const score = inspectionData.reduce((sum, x) => sum + x.categoryStndScore, 0);
            const receivedScore = inspectionData.reduce((sum, x) => sum + x.totalScore, 0);
            const finalScore = Math.round(receivedScore/score * 100);
            const totalProfitCnt = inspectionData.reduce((sum, x) => sum + x.profitCnt, 0);
            const totalNonProfitCnt = inspectionData.reduce((sum, x) => sum + x.nonProfitCnt, 0);
            const totalEvalCnt = inspectionData.reduce((sum, x) => sum + x.totalEvaluationCnt, 0);

            $('.score-table').find('tbody').find('td').eq(0).text(receivedScore);
            $('.score-table').find('tbody').find('td').eq(1).text(totalProfitCnt);
            $('.score-table').find('tbody').find('td').eq(2).text(totalNonProfitCnt);
            $('.score-table').find('tbody').find('td').eq(3).text(totalEvalCnt);
            $('.inspection-total-score').find('span').text(finalScore);
            $('.total-score-text').find('span').text(finalScore);

            /**
             * 최종 점수에 따라 등급 결정
             */
            if(finalScore >= 90 && finalScore <=100) {
                $('.grade-text').find('span').text('A');
            } else if(finalScore >= 80) {
                $('.grade-text').find('span').text('B');
            } else if(finalScore >= 70) {
                $('.grade-text').find('span').text('C');
            } else if(finalScore >= 60) {
                $('.grade-text').find('span').text('D');
            } else if(finalScore >= 50) {
                $('.grade-text').find('span').text('E');
            } else if(finalScore >=0 && finalScore < 50) {
                $('.grade-text').find('span').text('F');
            }

            const filteredData = inspectionData.map(x => {
                // 각 x에 대해 y를 필터링
                const filteredSubcategories = x.subcategories.map(y => {
                    // 각 y에 대해 z를 필터링
                    const filteredQuestions = y.questions.filter(z => z.vltId !== 0);

                    // z가 있는 경우에만 y를 포함
                    return {
                        ...y,
                        questions: filteredQuestions
                    };
                }).filter(y => y.questions.length > 0); // z가 있는 y만 포함

                // x에 filteredSubcategories가 있는 경우에만 포함
                return {
                    ...x,
                    subcategories: filteredSubcategories
                };
            }).filter(x => x.subcategories.length > 0); // y가 있는 x만 포함


            // // 페이지 로드 시 실행
            initializeTabs();
            generateDetailedItems(inspectionData); // 세부결과 탭의 상세 항목을 동적으로 생성
            initializeDetailButtons(inspectionData);


            /**
             * 상세 보기를 할 때 중분류의 개수가 홀수이면 맨 마지막 요소 혼자만 너무 커보여서 다른 요소와 크기 맞춰주기
             */
            $('body').on('click', '.detail-btn', function () {
                $('.check-subitem:even:last-child').css('flex', 'none').css('width', '49%');
                showViolationitems();
            });

            $('#checkboxInput').click(function(){
                $('#inspection-result-list').css('display', 'none');
                showViolationitems();
            })

            function showViolationitems() {
                if($('#checkboxInput').prop('checked')) {
                    generateDetailedItems(filteredData); // 세부결과 탭의 상세 항목을 동적으로 생성
                    initializeDetailButtons(filteredData);
                } else {
                    generateDetailedItems(inspectionData); // 세부결과 탭의 상세 항목을 동적으로 생성
                    initializeDetailButtons(inspectionData);
                }
            }
        }
    })


    // 세부결과 탭의 상세 항목을 동적으로 생성하는 함수
    function generateDetailedItems(inspectionData) {
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
            h3.textContent = category.categoryNm;

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

            // 테이블 바디 생성
            const tbody = document.createElement('tbody');
            const trBody = document.createElement('tr');
            [category.totalScore+"/"+category.categoryStndScore, category.profitCnt, category.nonProfitCnt, category.totalEvaluationCnt].forEach(value => {
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
    function initializeDetailButtons(inspectionData) {
        const detailButtons = document.querySelectorAll(".detail-btn");
        const inspectionList = document.getElementById("inspection-result-list");

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
                itemTitle.textContent = category.categoryNm;

                // 하단 상세 리스트 생성
                generateInspectionList(category);

                // 상세보기 버튼 클릭 시 inspection-result-list를 보이기
                inspectionList.style.display = "block";
                inspectionList.scrollIntoView({ behavior: 'smooth', block: 'start' }); // 스크롤 이동

                // 마지막으로 열린 인덱스를 현재 인덱스로 업데이트
                lastOpenedIndex = index;
            });
        });
    }


    // 하단의 상세 리스트를 생성하는 함수
    function generateInspectionList(category) {
        const inspectionList = document.getElementById('inspection-result-list');
        const checkItem = inspectionList.querySelector('.check-item');
        checkItem.innerHTML = ''; // 기존 내용 제거
        category.subcategories.forEach(subcategory => {
            const checkSubitem = document.createElement('div');
            checkSubitem.classList.add('check-subitem');

            const subitemTitle = document.createElement('p');
            subitemTitle.classList.add('subitem-title');
            subitemTitle.textContent = subcategory.subCtgNm;
            checkSubitem.appendChild(subitemTitle);

            subcategory.questions.forEach(question => {
                const subitemInfoWrapper = document.createElement('div');
                subitemInfoWrapper.classList.add('subitem-info-wrapper');

                const questionP = document.createElement('p');
                questionP.textContent = question.questionSeq + '. ' + question.questionContent;
                subitemInfoWrapper.appendChild(questionP);

                const infoUl = document.createElement('ul');
                infoUl.classList.add('subitem-info');

                const infoItems = [
                    { label: '배점/결과', value: `${question.score} / ${question.receivedScore}`, class: 'score' },
                    { label: '과태료', value: `${question.penalty} 만원` },
                    { label: '영업정지', value: `${question.bsnSspnDaynum} 일` }
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
                if (question.images && question.images.length > 0) {
                    question.images.forEach(imgSrc => {
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
                        let img =  'inspection_img/' + imgSrc.evitAnswImgPath;

                        /**
                         * img를 통해서 S3에 있는 이미지 가져오는 AJAX
                         */
                        $.ajax({
                            url :'/download',
                            method: 'POST',
                            headers : {
                                'Content-Type' : 'application/json'
                            },
                            data : JSON.stringify({path : img}),
                            xhrFields: {
                                responseType: 'blob'
                            },
                            success: function(blob) {
                                const url = window.URL.createObjectURL(blob);
                                imgElement.src =url;
                                imgElement.style.display = "block";
                            }
                        })

                        imgElement.classList.add('inspection-image');
                        imgWrapper.appendChild(imgElement);

                        // 이미지 및 아이콘 클릭 시 모달 오픈 이벤트
                        imgElement.addEventListener('click', () => openModal(imgElement.src));
                        zoomIcon.addEventListener('click', () => openModal(imgElement.src));

                        // imageSection에 img-wrapper 추가
                        imageSection.appendChild(imgWrapper);
                    });

                    // 이미지가 하나만 있을 때 두 번째 자리에 빈 placeholder 추가
                    if (question.images.length === 1) {
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
                    { label: '위반장소', value: `${question.vltPlcNm}` },
                    { label: '제품명 (또는 상세위치)', value: `${question.pdtNmDtplc}` },
                    { label: '귀책사유', value: `${question.cauPvdNm}` },
                    { label: '위반수량', value: `${question.vltCnt}` },
                    { label: '위반사항', value: `${question.vltContent}` },
                    { label: '원인', value: `${question.vltCause}` },
                    { label: '개선조치사항', value: `${question.instruction}` }
                ];
                // detailItems를 반복하면서 null이 아닌 항목만 추가
                detailItems.forEach((item, index) => {
                    // value가 null이 아닌 경우에만 처리

                        if (index % 2 === 0 && index < 4) {
                            const wrapperDiv = document.createElement('div');
                            wrapperDiv.classList.add('detail-item-row');

                            const firstDiv = document.createElement('div');
                            const firstLabel = document.createElement('p');
                            firstLabel.textContent = item.label;
                            const firstValue = document.createElement('p');
                            firstValue.textContent = item.value;
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

                                const value = document.createElement('p');
                                value.textContent = item.value;
                                singleWrapperDiv.appendChild(value);

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
        element.style.height = "0px";
        // element.style.transition = "height 0.3s ease, padding 0.3s ease";

        // 리사이즈 이벤트 추가 (열려 있는 동안)
        window.addEventListener('resize', () => adjustWrapperHeight(element));
    }

    // 콘텐츠 닫기 함수
    function closeContent(element) {
        element.style.height = "auto"; // 현재 높이로 설정
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
            const newHeight = "auto"; // 새로운 높이 계산
            element.style.height = newHeight; // 새 높이 설정
        }
    }








    /**
     * 위반사항이 없을 경우에 null을 보여주는 것 보다 display none 을 통해 안보이게 하기
     */
    $('body').on('click', '.edit-btn', function () {
        let texts = $(this).siblings('.inspection-content-wrapper').find('.detail-section').find('p:odd').text();
        if(texts.includes('null')) {
            $(this).siblings('.inspection-content-wrapper')
                .find('.detail-section')
                .css('display','none');
        }

    })




})

// ------------------나가기 버튼 클릭-----------------
function outInspectionResult() {
    // 팝업 창을 닫음
    window.close();  // 점검 완료 후 팝업창 종료
}
/**
 * 인쇄 버튼 클릭 시 모든 상세 내용을 확장하고 PDF을 생성한 후 원래 상태로 복원하는 함수
 */
window.fn_printClick = async function() {
    try {
        // 인쇄 전에 추가적인 콘텐츠를 추가
        addPrintContent();

        // '세부결과' 탭이 활성화되어 있는지 확인하고 활성화
        const detailedTabButton = document.querySelector('.inspection-tab[data-tab="detailed-result"]');
        if (detailedTabButton && !detailedTabButton.classList.contains('active')) {
            detailedTabButton.click();
            await waitForTabActivation(detailedTabButton);
        }

        // 모든 '상세보기' 버튼을 클릭하여 내용 확장
        const detailButtons = document.querySelectorAll('.detail-btn');
        for (let btn of detailButtons) {
            if (btn.textContent.trim() === '상세보기') { // '상세보기' 상태인 버튼만 클릭
                btn.click();
                await waitForContentExpansion(btn);
            }
        }

        // 모든 '더보기' 버튼을 클릭하여 세부 내용 확장
        const editButtons = document.querySelectorAll('.edit-btn');
        for (let btn of editButtons) {
            if (btn.textContent.trim() === '더보기') { // '더보기' 상태인 버튼만 클릭
                btn.click();
                await waitForContentExpansion(btn);
            }
        }

        // 모든 내용이 확장된 후 PDF 생성
        await generatePDF();

        // 인쇄 후에 추가된 콘텐츠 제거
        removePrintContent();

        // 확장된 모든 '더보기' 버튼을 다시 '닫기' 상태로 되돌림
        for (let btn of editButtons) {
            if (btn.textContent.trim() === '닫기') { // '닫기' 상태인 버튼만 클릭
                btn.click();
            }
        }

        // 확장된 모든 '상세보기' 버튼을 다시 '닫기' 상태로 되돌림
        for (let btn of detailButtons) {
            if (btn.textContent.trim() === '닫기') { // '닫기' 상태인 버튼만 클릭
                btn.click();
            }
        }

    } catch (error) {
        console.error("인쇄 과정 중 오류 발생:", error);
        alert("인쇄를 진행하는 중 오류가 발생했습니다. 다시 시도해주세요.");
        // 인쇄 전 상태로 되돌리기 (필요 시 추가)
        removePrintContent();
    }
}

/**
 * PDF 생성 함수
 */
async function generatePDF() {
    // PDF로 변환할 요소 선택 (전체 문서를 PDF로 변환하려면 body를 선택)
    const element = document.body;

    // html2pdf.js 옵션 설정
    const opt = {
        margin:       0,
        filename:     '점검 결과.pdf',
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale:  1.5},
        pagebreak:    { mode: ['avoid-all', 'css', 'legacy'] },
        jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }  // 세로는 portrait  가로는 landscape
    };

    // PDF 생성 및 저장
    await html2pdf().set(opt).from(element).save();
}

/**
 * 탭이 활성화될 때까지 대기하는 함수
 * @param {HTMLElement} tabButton - 탭 버튼 요소
 * @param {number} timeout - 최대 대기 시간 (밀리초)
 * @returns {Promise} - 탭이 활성화되면 해결, 시간 초과 시 거부
 */
function waitForTabActivation(tabButton, timeout = 5000) {
    return new Promise((resolve, reject) => {
        if (!tabButton) {
            reject(new Error("탭 버튼이 존재하지 않습니다."));
            return;
        }

        const intervalTime = 100;
        let elapsedTime = 0;
        const interval = setInterval(() => {
            if (tabButton.classList.contains('active')) {
                clearInterval(interval);
                resolve();
            }
            elapsedTime += intervalTime;
            if (elapsedTime >= timeout) {
                clearInterval(interval);
                reject(new Error("탭 활성화 실패"));
            }
        }, intervalTime);
    });
}

/**
 * 콘텐츠가 확장될 때까지 대기하는 함수
 * @param {HTMLElement} button - 버튼 요소
 * @param {number} timeout - 최대 대기 시간 (밀리초)
 * @returns {Promise} - 콘텐츠가 확장되면 해결, 시간 초과 시 거부
 */
function waitForContentExpansion(button, timeout = 5000) {
    return new Promise((resolve, reject) => {
        if (!button) {
            reject(new Error("버튼 요소가 존재하지 않습니다."));
            return;
        }

        const contentWrapper = button.nextElementSibling;
        if (!contentWrapper || !contentWrapper.classList.contains('inspection-content-wrapper')) {
            console.warn("inspection-content-wrapper 요소를 찾을 수 없습니다. 해당 버튼을 건너뜁니다.");
            resolve(); // 요소가 없으면 그냥 건너뜁니다.
            return;
        }

        const checkExpansion = () => {
            const isExpanded = window.getComputedStyle(contentWrapper).display !== 'none' && contentWrapper.style.height !== '0px';
            if (isExpanded) {
                clearInterval(interval);
                resolve();
            }
        };

        const intervalTime = 100;
        let elapsedTime = 0;
        const interval = setInterval(() => {
            checkExpansion();
            elapsedTime += intervalTime;
            if (elapsedTime >= timeout) {
                clearInterval(interval);
                reject(new Error("콘텐츠 확장 실패"));
            }
        }, intervalTime);
    });
}

/**
 * 인쇄 전용 콘텐츠 추가 함수
 */
window.addPrintContent = function() {
    // 인쇄 전용 콘텐츠가 이미 존재하는지 확인
    if (document.getElementById('additionalContent')) {
        return; // 이미 추가되어 있으면 중복 추가하지 않음
    }

    // 인쇄 전용 콘텐츠 추가
    var printContent = document.createElement('div');
    printContent.id = 'additionalContent';
    printContent.className = 'print-only';

    // body의 마지막에 추가 (또는 원하는 위치에 추가)
    document.body.appendChild(printContent);
}

/**
 * 인쇄 후 추가된 콘텐츠 제거 함수
 */
window.removePrintContent = function() {
    // 인쇄 후 추가된 콘텐츠 제거
    var printContent = document.getElementById('additionalContent');
    if (printContent) {
        printContent.parentNode.removeChild(printContent);
    }
}

/**
 * 나가기 버튼 클릭 시 팝업 창을 닫는 함수
 */
window.outInspectionResult = function() {
    // 팝업 창을 닫음
    window.close();  // 점검 완료 후 팝업창 종료
}

/**
 * 초기화 함수: 탭 이벤트 리스너 설정
 */
function initializeTabs() {
    const tabs = document.querySelectorAll(".inspection-tab");
    const reportSummary = document.querySelector(".report-summary");
    const detailedResult = document.querySelector(".detailed-result");
    const inspectionList = document.getElementById("inspection-result-list");

    // 기본 상태 설정: 보고서 간략은 보이기, 세부결과는 숨기기
    if(reportSummary) reportSummary.style.display = "flex";
    if(detailedResult) detailedResult.style.display = "none";
    if(inspectionList) inspectionList.style.display = "none";

    // 탭 클릭 이벤트 추가
    tabs.forEach(tab => {
        tab.addEventListener("click", function () {
            tabs.forEach(tab => tab.classList.remove("active"));

            this.classList.add("active");

            const selectedTab = this.getAttribute("data-tab");

            if (selectedTab === "report-summary") {
                if(reportSummary) reportSummary.style.display = "flex";
                if(detailedResult) detailedResult.style.display = "none";
                if(inspectionList) inspectionList.style.display = "none";
            } else if (selectedTab === "detailed-result") {
                if(reportSummary) reportSummary.style.display = "none";
                if(detailedResult) detailedResult.style.display = "flex";
                if(inspectionList) inspectionList.style.display = "none";
            }
        });
    });
}

/**
 * 초기화 함수 호출
 */
initializeTabs();