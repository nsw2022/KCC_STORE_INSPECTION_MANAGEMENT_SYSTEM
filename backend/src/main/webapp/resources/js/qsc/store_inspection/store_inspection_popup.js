let inspectionData = null;

// 날짜 형식 포맷 함수 (YYYY - MM - DD)
function formatDate(dateStr) {
    // dateStr이 'YYYYMMDD' 형식인지 확인
    if (!dateStr || dateStr.length !== 8) return dateStr; // 형식이 올바르지 않으면 그대로 반환
    const year = dateStr.substring(0, 4);
    const month = dateStr.substring(4, 6);
    const day = dateStr.substring(6, 8);
    return `${year} - ${month} - ${day}`; // 템플릿 리터럴 사용
}

// 개점시간 형식 변환 함수 (HHmm -> HH:MM)
function formatOpenHm(timeStr) {
    if (!timeStr || timeStr.length !== 4) return timeStr; // 형식이 올바르지 않으면 그대로 반환
    const hours = timeStr.substring(0, 2);
    const minutes = timeStr.substring(2, 4);
    return `${hours}:${minutes}`;
}

// 팝업 페이지 로드 시 파라미터 읽기 및 데이터 가져오기
document.addEventListener('DOMContentLoaded', function () {
    const urlParams = new URLSearchParams(window.location.search);
    const chklstId = urlParams.get('chklstId');
    const storeNm = urlParams.get('storeNm');
    const inspPlanDt = urlParams.get('inspPlanDt');

    if (chklstId && storeNm && inspPlanDt) {
        fetchPopupData(chklstId, storeNm, inspPlanDt);
        fetchRecentInspectionHistory(storeNm, 'IS001'); // inspSttsCd는 'IS002'로 변경됨
    } else {
        alert('필수 파라미터(chklstId, storeNm, inspPlanDt)가 지정되지 않았습니다.');
    }
});

// inspection-detail 섹션의 테이블을 생성하고 데이터를 채우는 함수
function populateInspectionDetail(data) {
    const table = document.getElementById('inspection-detail-table');
    if (!table) {
        console.error('inspection-detail-table 요소를 찾을 수 없습니다.');
        return;
    }

    // 테이블 헤더 생성
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    const th = document.createElement('th');
    th.colSpan = 2;

    const brandSpan = document.createElement('span');
    brandSpan.classList.add('inspection-status');
    brandSpan.textContent = data.brandNm;

    const storeSpan = document.createElement('span');
    storeSpan.classList.add('inspection-subtitle');
    storeSpan.textContent = `가맹점 (${data.storeNm})`; // 템플릿 리터럴 사용

    th.appendChild(brandSpan);
    th.appendChild(storeSpan);
    headerRow.appendChild(th);
    thead.appendChild(headerRow);
    table.appendChild(thead);

    // 테이블 바디 생성
    const tbody = document.createElement('tbody');

    const row1 = document.createElement('tr');
    const cell1_1 = document.createElement('td');
    cell1_1.innerHTML = `<i class="fas fa-calendar-alt"></i> 점검일 : ${formatDate(data.inspPlanDt)}`;
    const cell1_2 = document.createElement('td');
    cell1_2.innerHTML = `<i class="fas fa-calendar-check"></i> 최근 점검일 : `; // 최근 점검일은 별도로 업데이트
    row1.appendChild(cell1_1);
    row1.appendChild(cell1_2);
    tbody.appendChild(row1);

    const row2 = document.createElement('tr');
    const cell2_1 = document.createElement('td');
    cell2_1.innerHTML = `<i class="fas fa-clock"></i> 개점시간 : ${formatOpenHm(data.openHm)}`; // 개점시간 형식 변환
    const cell2_2 = document.createElement('td');
    cell2_2.innerHTML = `<i class="fas fa-user"></i> 점검자 : ${data.mbrNm}`;
    row2.appendChild(cell2_1);
    row2.appendChild(cell2_2);
    tbody.appendChild(row2);

    table.appendChild(tbody);
}

// REST API에서 inspection-detail 섹션 데이터를 가져오는 함수
function fetchPopupData(chklstId, storeNm, inspPlanDt) {
    const url = `/filter/store_inspection_popup?chklstId=${chklstId}&storeNm=${encodeURIComponent(storeNm)}&inspPlanDt=${inspPlanDt}`;

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`네트워크 응답이 올바르지 않습니다. 상태 코드: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('팝업 데이터:', data);
            if (data.length > 0) {
                // 첫 번째 데이터를 inspection-detail 섹션에 채움
                populateInspectionDetail(data[0]);

                // 전역 변수에 데이터 저장
                inspectionData = data[0];
            } else {
                alert('점검 상세 데이터가 없습니다.');
            }
        })
        .catch(error => {
            console.error('데이터 가져오기 실패:', error);
            alert('점검 데이터를 불러오는 데 실패했습니다.');
        });
}

// 새로운 REST API에서 최근 점검 이력 데이터 가져오기 (inspection-results-section)
function fetchRecentInspectionHistory(storeNm, inspSttsCd) {
    const url = `/filter/recent_inspection_history?storeNm=${encodeURIComponent(storeNm)}&inspSttsCd=${inspSttsCd}`;

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`네트워크 응답이 올바르지 않습니다. 상태 코드: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('최근 점검 이력 데이터:', data);
            populateRecentInspectionHistory(data);
        })
        .catch(error => {
            console.error('최근 점검 이력 데이터 가져오기 실패:', error);
            alert('최근 점검 이력을 불러오는 데 실패했습니다.');
        });
}

// inspection-results-section 데이터를 HTML에 채우는 함수
function populateRecentInspectionHistory(data) {
    const historyBody = document.getElementById('inspection-results-body');
    if (!historyBody) {
        console.error('inspection-results-body 요소를 찾을 수 없습니다.');
        return;
    }

    // 기존 내용 초기화
    historyBody.innerHTML = '';

    // 오늘 날짜 기준으로 과거 데이터만 필터링
    const today = new Date();
    const pastData = data.filter(item => {
        const year = item.inspPlanDt.substring(0, 4);
        const month = item.inspPlanDt.substring(4, 6);
        const day = item.inspPlanDt.substring(6, 8);
        const inspDate = new Date(`${year}-${month}-${day}`);
        return inspDate < today;
    });

    // 최근 날짜 순으로 정렬 (내림차순)
    pastData.sort((a, b) => {
        const dateA = new Date(`${a.inspPlanDt.substring(0,4)}-${a.inspPlanDt.substring(4,6)}-${a.inspPlanDt.substring(6,8)}`);
        const dateB = new Date(`${b.inspPlanDt.substring(0,4)}-${b.inspPlanDt.substring(4,6)}-${b.inspPlanDt.substring(6,8)}`);
        return dateB - dateA;
    });

    // 최근 점검일자를 추출하여 inspection-detail 섹션의 "최근 점검일"에 업데이트
    if (pastData.length > 0) {
        const mostRecentInspection = pastData[0];
        const recentInspDtElement = document.querySelector('#inspection-detail-table tbody tr td:nth-child(2)');
        if (recentInspDtElement) {
            recentInspDtElement.innerHTML = `<i class="fas fa-calendar-check"></i> 최근 점검일 : ${formatDate(mostRecentInspection.inspPlanDt)}`;
        }
    }

    // 데이터가 없는 경우 처리
    if (pastData.length === 0) {
        const noDataRow = document.createElement('tr');
        const noDataCell = document.createElement('td');
        noDataCell.colSpan = 5;
        noDataCell.textContent = '최근 점검 이력이 없습니다.';
        noDataRow.appendChild(noDataCell);
        historyBody.appendChild(noDataRow);
        return;
    }

    // 데이터 반복하여 표시
    pastData.forEach(item => {
        const row = document.createElement('tr');

        // 유형 (chklstNm의 앞 네 글자)
        const typeCell = document.createElement('td');
        typeCell.textContent = item.chklstNm.substring(0, 4);
        row.appendChild(typeCell);

        // 점검일자 (YYYY - MM - DD)
        const dateCell = document.createElement('td');
        dateCell.textContent = formatDate(item.inspPlanDt); // formatDate 함수 사용
        row.appendChild(dateCell);

        // 점검자
        const inspectorCell = document.createElement('td');
        inspectorCell.textContent = item.mbrNm;
        row.appendChild(inspectorCell);

        // 점수
        const scoreCell = document.createElement('td');
        scoreCell.textContent = item.totalScore !== null ? item.totalScore : '점수없음'; // 점수가 null일 경우 "점수없음" 표시
        row.appendChild(scoreCell);

        // 이력 조회 버튼
        const historyCell = document.createElement('td');
        const historyBtn = document.createElement('button');
        historyBtn.classList.add('history-btn');
        historyBtn.textContent = '이력조회';
        historyBtn.addEventListener('click', function() {
            viewHistory(item); // 이력 조회 함수 호출
        });
        historyCell.appendChild(historyBtn);
        row.appendChild(historyCell);

        historyBody.appendChild(row);
    });
}

// 이력 조회 버튼 클릭 시 호출되는 함수
function viewHistory(item) {
    // 임시 alert
    alert(`점검 유형: ${item.chklstNm}\n점검일자: ${formatDate(item.inspPlanDt)}\n점검자: ${item.mbrNm}\n점수: ${item.totalScore !== null ? item.totalScore : '점수없음'}`);
}

function startInspection() {
    // 현재 페이지의 URL에서 파라미터 추출
    const urlParams = new URLSearchParams(window.location.search);
    const chklstId = urlParams.get('chklstId');
    const storeNm = urlParams.get('storeNm');
    const inspPlanDt = urlParams.get('inspPlanDt');
    const inspSchdId = inspectionData.inspSchdId;


    const url = `/filter/store_inspection_popup?chklstId=${chklstId}&storeNm=${encodeURIComponent(storeNm)}&inspPlanDt=${inspPlanDt}`;

    console.log(inspSchdId);

    if (!chklstId || !storeNm || !inspPlanDt) {
        alert('필수 파라미터(chklstId, storeNm, inspPlanDt)가 지정되지 않았습니다.');
        return;
    }

    // inspPlanDt의 '/' 문자 제거 (예: '2024/10/18' -> '20241018')
    const formattedInspPlanDt = inspPlanDt.replace(/\//g, '');


    const requestData = {
        chklstId: parseInt(chklstId, 10),
        storeNm: storeNm,
        inspPlanDt: inspPlanDt,
        inspSchdId: parseInt(inspSchdId, 10), // 필요 시 조정
        inspComplW: 'N', // 점검 완료 여부 초기화
        creMbrId: null, // 서버에서 설정
        inspections: [] // 초기에는 비어있음
    };

    // AJAX POST 요청 to insert INSP_RESULT
    fetch('/filter/get_or_insert_insp_result', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
        credentials: 'include' // 쿠키를 포함시켜 세션 유지
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`서버 응답이 올바르지 않습니다. 상태 코드: ${response.status}`);
            }
            return response.json(); // inspResultId 반환 예상
        })
        .then(inspResultId => {

            // 팝업 페이지로 이동하면서 inspSchdId 전달
            var form = document.createElement("form");
            form.method = "GET"; // @GetMapping에 맞춰 GET 방식 사용
            form.action = "/qsc/popup_page_inspection";

            // 숨겨진 입력 필드 생성 및 추가
            var input1 = document.createElement("input");
            input1.type = "hidden";
            input1.name = "chklstId";
            input1.value = chklstId;
            form.appendChild(input1);

            var input2 = document.createElement("input");
            input2.type = "hidden";
            input2.name = "storeNm";
            input2.value = storeNm;
            form.appendChild(input2);

            var input3 = document.createElement("input");
            input3.type = "hidden";
            input3.name = "inspPlanDt";
            input3.value = formattedInspPlanDt;
            form.appendChild(input3);

            var input4 = document.createElement("input");
            input4.type = "hidden";
            input4.name = "inspSchdId";
            input4.value = inspSchdId;
            form.appendChild(input4);

            var input5 = document.createElement("input");
            input5.type = "hidden";
            input5.name = "inspResultId";
            input5.value = inspResultId;
            form.appendChild(input5);

            // 폼을 문서에 추가하고 제출
            document.body.appendChild(form);
            form.submit();
        })
        .catch(error => {
            console.error('점검 시작 실패:', error);
            alert('점검을 시작하는 데 실패했습니다.');
        });
}




