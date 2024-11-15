let clickedListText = "";
let placeholderText = "";

// 리스트 아이템을 생성하는 함수
$('.masterChklstSearchBtn .search-btn').click(function(e) {
    let listItems = '';  // 리스트 아이템을 담을 문자열 변수 초기화

    placeholderText = $('.masterChecklistPlaceholder').text();

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
        <button class="btn btn-primary btn-sm rounded-20 masterChecklistPreviewBtn" type="button" data-bs-target="#MasterChecklistPreviewModal" data-bs-toggle="modal">
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
        if(text === placeholderText){
            clickedListText = text;
            // 클릭된 리스트 아이템의 스타일을 변경
            $(this).find('.item-info').css({
                'background-color': '#f2f6ff',
                'border': '1px solid #3274fa',
                'box-shadow': 'none',
            });
        }else{
            clickedListText = "";
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

    // 마스터 체크리스트 등록
    $('.chklstSelectBtn').click(function(){
        Swal.fire({
            title: "확인",
            html: "마스터 체크리스트를 등록하시겠습니까?",
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "확인",
            cancelButtonText: "취소",
        }).then((result) => {
            if (result.isConfirmed) {
                // const selectedRows = gridApi.getSelectedRows();
                // if (selectedRows.length === 0) {
                //     Swal.fire("실패!", "체크리스트를 선택해주세요.", "error");
                //     return;
                // }

                // 마스터 체크리스트를 서버에 저장하는 fetch 요청
                fetch("/master/checklist/master-chklst/copy", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        newChklstId: selectedRowChklstId,
                        masterChklstNm: clickedListText
                    }),
                })
                .then((response) => {
                    if (!response.ok) {
                        // 응답 상태 코드에 따른 에러 처리
                        if (response.status === 403) {
                            Swal.fire("실패!", "권한이 없습니다.", "error");
                        } else if (response.status === 500) {
                            Swal.fire("실패!", "저장에 실패했습니다. 관리자에게 문의하세요.", "error");
                        }
                        return Promise.reject();
                    }
                })
                .then((data) => {
                    // 서버 저장이 성공하면 완료 알림 표시
                    Swal.fire({
                        title: "완료!",
                        text: "완료되었습니다.",
                        icon: "success",
                        confirmButtonText: "OK",
                    }).then((result) => {
                        if (result.isConfirmed) {
                            checkUnload = false;
                            // placeholder에 text 추가
                            // $('.masterChecklistPlaceholder').text(clickedListText);
                            location.href = "/master/checklist";
                        }
                    });
                })
            }
        });


    });
});

/**
 * @Todo 체크리스트 추가 시 검색모달에 나타나는 현상 수정해야 함
 * @Todo 체크리스트 삭제 시 연결되어있는 대,중분류 삭제해야 함
 */
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
        <button class="btn btn-primary btn-sm rounded-20 preview-btn masterChecklistPreviewBtn" type="button" data-bs-target="#MasterChecklistPreviewModal" data-bs-toggle="modal">
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