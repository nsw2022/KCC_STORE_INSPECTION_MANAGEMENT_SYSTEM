let clickedListText = "";
// 리스트 아이템을 생성하는 함수
$('.masterChklstSearchBtn .search-btn').click(function(e) {
    let listItems = '';  // 리스트 아이템을 담을 문자열 변수 초기화

    // defaultRowData 배열을 순회하면서 리스트 아이템을 생성
    for (let i = 0; i < defaultRowData.length; i++) {
        listItems += `
      <li class="list-group-item d-flex justify-content-between align-items-center mb-1">
        <div class="item-info d-flex align-items-center">
          <span class="me-3">${(i + 1).toString().padStart(2, '0')}</span>
          <p class="mb-0">${defaultRowData[i].chklstNm}</p>
        </div>
        <button class="btn btn-primary btn-sm rounded-20" type="button" data-bs-target="#exampleModalToggle2" data-bs-toggle="modal">
          미리보기
          <i class="fa-regular fa-eye"></i>
        </button>
      </li>`;
    }

    // 생성된 리스트 아이템들을 .list-group에 삽입
    $('.list-group').html(listItems);

    // 리스트 아이템에 클릭 이벤트 추가 (동적 요소이기 때문에 click 이벤트는 동적으로 적용)
    $('.item-info').click(function() {
        clickedListText = $(this).find('p').text();
        // 모든 리스트 아이템의 기존 스타일로 복원
        $('.item-info').css({
            'background-color': '',            // 기본 배경색으로 초기화
            'border': '',                      // 기본 보더로 초기화
            'box-shadow': 'rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px',  // 기본 그림자 설정
            'border-radius': '6px',            // 기본 보더-반경 설정
            'width': '80%',
            'height': '60px',
            'padding': '10px',
        });

        // 클릭된 리스트 아이템의 스타일을 변경
        $(this).css({
            'background-color': '#f2f6ff',     // 선택 시 배경색
            'border': '1px solid #3274fa',     // 선택 시 보더색
            'box-shadow': 'none',              // 선택 시 그림자 제거 (원하는 대로 설정 가능)
        });
    });

    $('.chklstSelectBtn').click(function(){
        $('.masterChecklistPlaceholder').text(clickedListText);
    });
});
