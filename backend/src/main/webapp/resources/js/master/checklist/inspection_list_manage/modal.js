let clickedListText = "";
let placeholderText = "";
let defaultRowData = [];

async function getChecklistAll(searchCriteria = {}) {
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

        if (defaultRowData.length === 0) {
            defaultRowData = data;
        }

        // rowData에 데이터를 할당
        defaultRowData = data.map((item) => {
            item.is_master_checklist = item.masterChklstNm === null ? 'N' : 'Y';
            return item;
        });

        // 리스트 아이템 생성 호출
        createChecklistItems();
    } catch (error) {
        console.error("Error fetching checklist data:", error);
    }
}

// 리스트 아이템을 생성하는 함수
function createChecklistItems() {
    let listItems = '';  // 리스트 아이템을 담을 문자열 변수 초기화

    placeholderText = $('.chklstTitlePlaceholder').attr('placeholder');

    // defaultRowData 배열에서 placeholderText와 일치하는 항목을 분리
    const matchedItem = defaultRowData.find(item => item.chklstNm === placeholderText);
    const filteredData = defaultRowData.filter(item => item.chklstNm !== placeholderText);

    // matchedItem이 존재하면 리스트의 맨 앞에 추가
    if (matchedItem) {
        filteredData.unshift(matchedItem);
    }

    // filteredData 배열을 순회하면서 리스트 아이템을 생성
    for (let i = 0; i < filteredData.length; i++) {
        listItems += `
      <li class="list-group-item d-flex justify-content-between align-items-center mb-1">
        <div class="item-info d-flex align-items-center">
          <span class="me-3">${(i + 1).toString().padStart(2, '0')}</span>
          <p class="mb-0">${filteredData[i].chklstNm}</p>
        </div>
        <button class="btn btn-primary btn-sm rounded-20 checklistPreviewBtn" type="button" data-bs-target="#checklistPreviewModal" data-bs-toggle="modal">
          미리보기
          <i class="fa-regular fa-eye"></i>
        </button>
      </li>`;
    }

    // 생성된 리스트 아이템들을 .list-group에 삽입
    $('.list-group').html(listItems);

    // 기존 placeholderText와 일치하는 리스트 아이템 강조
    $('.list-group-item').each(function() {
        let text = $(this).find('p').text();
        if (text === placeholderText) {
            // 클릭된 리스트 아이템의 스타일을 변경
            $(this).find('.item-info').css({
                'background-color': '#f2f6ff',
                'border': '1px solid #3274fa',
                'box-shadow': 'none',
            });
        }
    });

    // 리스트 아이템에 클릭 이벤트 추가 (동적 요소이기 때문에 click 이벤트는 동적으로 적용)
    $('.item-info').off('click').on('click', function() {  // .off()를 사용하여 기존 클릭 이벤트 제거 후 재설정
        clickedListText = $(this).find('p').text();
        // 모든 리스트 아이템의 기존 스타일로 복원
        $('.item-info').css({
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

    $('.chklstSelectBtn').click(function() {
        $('.chklstTitlePlaceholder').text(clickedListText);
    });
}

// 클릭 시 모든 체크리스트 불러오기
$('.chklstTitlePlaceholder').click(function(e) {
    getChecklistAll();
});

// 검색 버튼 클릭 시 실행
$('.chklst-search-btn').click(function() {
    // 검색 텍스트를 가져옴
    const searchText = $('.chklst-search-box').val().toLowerCase();

    // 리스트 아이템을 담을 문자열 변수 초기화
    let filteredItems = '';

    // defaultRowData 배열에서 검색 텍스트와 일치하는 항목을 필터링
    const filteredData = defaultRowData.filter(item =>
        item.chklstNm.toLowerCase().includes(searchText)
    );

    // 필터링된 데이터를 기반으로 리스트 아이템 생성
    for (let i = 0; i < filteredData.length; i++) {
        filteredItems += `
      <li class="list-group-item d-flex justify-content-between align-items-center mb-1">
        <div class="item-info d-flex align-items-center">
          <span class="me-3">${(i + 1).toString().padStart(2, '0')}</span>
          <p class="mb-0">${filteredData[i].chklstNm}</p>
        </div>
        <button class="btn btn-primary btn-sm rounded-20 checklistPreviewBtn" type="button" data-bs-target="#checklistPreviewModal" data-bs-toggle="modal">
          미리보기
          <i class="fa-regular fa-eye"></i>
        </button>
      </li>`;
    }

    // 필터링된 리스트를 .list-group에 삽입
    $('.list-group').html(filteredItems);

    // 클릭 이벤트 재적용
    $('.item-info').off('click').on('click', function() {
        clickedListText = $(this).find('p').text();
        $('.item-info').css({
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
$('.chklst-search-box').on('keyup', function(event) {
    if (event.key === 'Enter') {
        $('.chklst-search-btn').click();
    }
});

// 선택 시 placeholder 내용 수정
$('.chklstSelectBtn').click(function() {
    $('.chklstTitlePlaceholder').attr('placeholder', clickedListText);
});