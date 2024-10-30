let masterClickedListText = "";
let masterPlaceholderText = "";
let masterDefaultRowData = [];

async function getMasterChecklistAll(searchCriteria = {}) {
    try {
        const response = await fetch("/master/checklist/list", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(searchCriteria)
        });

        const data = await response.json();
        console.log(data);

        if (masterDefaultRowData.length === 0) {
            masterDefaultRowData = data;
        }

        // rowData에 데이터를 할당
        masterDefaultRowData = data.map((item) => {
            item.is_master_checklist = item.masterChklstNm === null ? 'N' : 'Y';
            return item;
        });

        // 리스트 아이템 생성 호출
        createMasterChecklistItems();
    } catch (error) {
        console.error("Error fetching checklist data:", error);
    }
}

// 리스트 아이템을 생성하는 함수
function createMasterChecklistItems() {
    let listItems = '';  // 리스트 아이템을 담을 문자열 변수 초기화

    masterPlaceholderText = $('.masterChklstTitlePlaceholder').attr('placeholder');

    // masterDefaultRowData 배열에서 masterPlaceholderText와 일치하는 항목을 분리
    const matchedItem = masterDefaultRowData.find(item => item.chklstNm === masterPlaceholderText);
    const filteredData = masterDefaultRowData.filter(item => item.chklstNm !== masterPlaceholderText);

    // matchedItem이 존재하면 리스트의 맨 앞에 추가
    if (matchedItem) {
        filteredData.unshift(matchedItem);
    }

    // filteredData 배열을 순회하면서 리스트 아이템을 생성
    for (let i = 0; i < filteredData.length; i++) {
        listItems += `
      <li class="master-list-group-item list-group-item d-flex justify-content-between align-items-center mb-1">
        <div class="master-item-info d-flex align-items-center">
          <span class="me-3">${(i + 1).toString().padStart(2, '0')}</span>
          <p class="mb-0">${filteredData[i].chklstNm}</p>
        </div>
        <button class="btn btn-primary btn-sm rounded-20 masterChecklistPreviewBtn" type="button" data-bs-target="#checklistPreviewModal" data-bs-toggle="modal">
          미리보기
          <i class="fa-regular fa-eye"></i>
        </button>
      </li>`;
    }

    // 생성된 리스트 아이템들을 .master-list-group에 삽입
    $('.master-list-group').html(listItems);

    // 기존 masterPlaceholderText와 일치하는 리스트 아이템 강조
    $('.master-list-group-item').each(function() {
        let text = $(this).find('p').text();
        if (text === masterPlaceholderText) {
            // 클릭된 리스트 아이템의 스타일을 변경
            $(this).find('.master-item-info').css({
                'background-color': '#f2f6ff',
                'border': '1px solid #3274fa',
                'box-shadow': 'none',
            });
        }
    });

    // 리스트 아이템에 클릭 이벤트 추가 (동적 요소이기 때문에 click 이벤트는 동적으로 적용)
    $('.master-item-info').off('click').on('click', function() {  // .off()를 사용하여 기존 클릭 이벤트 제거 후 재설정
        masterClickedListText = $(this).find('p').text();
        // 모든 리스트 아이템의 기존 스타일로 복원
        $('.master-item-info').css({
            'background-color': '',
            'border': '',
            'box-shadow': 'rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px',  // 기본 그림자 설정
            'border-radius': '6px',
            'width': '80%',
            'height': '60px',
            'padding': '10px',
        });

        // 클릭된 리스트 아이템의 스타일을 변경
        $(this).css({
            'background-color': '#f2f6ff',
            'border': '1px solid #3274fa',
            'box-shadow': 'none',
        });
    });
    // 선택 시 placeholder 내용 수정
    $('.masterChklstSelectBtn').click(function() {
        $('.masterChklstTitlePlaceholder').attr('placeholder', masterClickedListText);
    });
}

// 클릭 시 모든 체크리스트 불러오기
$('.masterChklstTitlePlaceholder').click(function(e) {
    getMasterChecklistAll();
});

// 검색 버튼 클릭 시 실행
$('.master-chklst-search-btn').click(function() {
    // 검색 텍스트를 가져옴
    const searchText = $('.master-chklst-search-box').val().toLowerCase();

    // 리스트 아이템을 담을 문자열 변수 초기화
    let filteredItems = '';

    // masterDefaultRowData 배열에서 검색 텍스트와 일치하는 항목을 필터링
    const filteredData = masterDefaultRowData.filter(item =>
        item.chklstNm.toLowerCase().includes(searchText)
    );

    // 필터링된 데이터를 기반으로 리스트 아이템 생성
    for (let i = 0; i < filteredData.length; i++) {
        filteredItems += `
      <li class="master-list-group-item list-group-item d-flex justify-content-between align-items-center mb-1">
        <div class="master-item-info d-flex align-items-center">
          <span class="me-3">${(i + 1).toString().padStart(2, '0')}</span>
          <p class="mb-0">${filteredData[i].chklstNm}</p>
        </div>
        <button class="btn btn-primary btn-sm rounded-20 masterChecklistPreviewBtn" type="button" data-bs-target="#checklistPreviewModal" data-bs-toggle="modal">
          미리보기
          <i class="fa-regular fa-eye"></i>
        </button>
      </li>`;
    }

    // 필터링된 리스트를 .master-list-group에 삽입
    $('.master-list-group').html(filteredItems);

    // 클릭 이벤트 재적용
    $('.master-item-info').off('click').on('click', function() {
        masterClickedListText = $(this).find('p').text();
        $('.master-item-info').css({
            'background-color': '',
            'border': '',
            'box-shadow': 'rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px',
            'border-radius': '6px',
            'width': '80%',
            'height': '60px',
            'padding': '10px',
        });

        $(this).css({
            'background-color': '#f2f6ff',
            'border': '1px solid #3274fa',
            'box-shadow': 'none',
        });
    });
});

// 엔터 키 입력 시 검색 실행
$('.master-chklst-search-box').on('keyup', function(event) {
    if (event.key === 'Enter') {
        $('.master-chklst-search-btn').click();
    }
});

