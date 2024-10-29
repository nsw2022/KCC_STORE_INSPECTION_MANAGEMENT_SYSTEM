// ROW 데이터 정의
const rowData = [
    { no: 1, category_name: "중대법규", reference_score: "100", status: "Y", seq: "1" },
    { no: 2, category_name: "기타법규", reference_score: "100", status: "Y", seq: "2" },
    { no: 3, category_name: "위생관리", reference_score: "100", status: "Y", seq: "3" },
];

// 통합 설정 객체
const gridOptions = {
    rowData: rowData,

    columnDefs: [
        {
            minWidth: 45,
            width: 45,
            headerCheckboxSelection: true,
            checkboxSelection: true,
            resizable: true,
            cellStyle: { backgroundColor: "#ffffff" },
        },
        { field: "no", headerName: "no", width: 50, minWidth: 50, tooltipField: "no"  },
        { field: "category_name", headerName: "대분류명", width: 90, minWidth: 90, tooltipField: "category_name"  },
        { field: "reference_score", headerName: "기준점수", width: 90, minWidth: 90, tooltipField: "reference_score" },
        { field: "status", headerName: "사용여부", width: 90, minWidth: 90, tooltipField: "status"},
        { field: "seq", headerName: "정렬순서", width: 90, minWidth: 90, tooltipField: "seq"},
    ],

    autoSizeStrategy: {
        type: 'fitGridWidth',              // 그리드 넓이 기준으로
        defaultMinWidth: 10               // 컬럼 최소사이즈
    },
    rowHeight: 45,

    rowSelection: 'multiple',
    rowDragManaged: true,
    rowDragEntireRow: true,
    rowDragMultiRow: true,

    tooltipShowDelay: 500,

    onCellClicked: params => {
        console.log('cell was clicked', params);
    },
    onGridReady: (params) => {
        // 그리드가 로드된 후 첫 번째 행 선택
        params.api.forEachNode((node, index) => {
            if (index === 0) {
                node.setSelected(true);
            }
        });
    },

    // 드래그 종료 후 seq 업데이트
    onRowDragEnd: params => {
        updateCategoryRowDataSeq();
    },
};

const gridDiv = document.querySelector('#categoryGrid');
const gridApi = agGrid.createGrid(gridDiv, gridOptions);


// 새로운 rowData 생성 함수
function createNewCategoryRowData() {
    var newData = {
        no: (gridApi.getDisplayedRowCount() + 1),
        category_name: "",
        reference_score: "",
        status: "",
        seq: (gridApi.getDisplayedRowCount() + 1).toString()  // seq 값도 생성 시 자동 할당
    };
    return newData;
}

// 행 추가 함수
function onAddCategoryRow() {
    var newItem = createNewCategoryRowData();
    gridApi.applyTransaction({ add: [newItem] });
}

// 행 삭제 함수
function onDeleteCategoryRow() {
    var selectedRows = gridApi.getSelectedRows();
    if (selectedRows.length > 0) {
        gridApi.applyTransaction({ remove: selectedRows });
    } else {
        alert('삭제할 항목을 선택하세요.');
    }
}

// 드래그 완료 후 seq 값을 업데이트하는 함수
function updateCategoryRowDataSeq() {
    gridApi.forEachNode((node, index) => {
        // 각 행의 seq를 1부터 순차적으로 할당
        node.data.seq = (index + 1).toString();
    });

    // 그리드에 변경된 seq 값을 반영
    gridApi.refreshCells({ force: true });
}




function toggleSearchBox() {
    const toggleButton = document.querySelector('.top-drop-down button'); // 버튼 선택
    const icon = toggleButton.querySelector('i'); // 아이콘 선택
    const searchSection = document.querySelector('.top-content .container'); // 검색 섹션 선택 --> 해당 부분은 접을 부분(custom)할 것

    // 초기 상태: 검색 섹션 닫힘
    let isOpen = false;

    // 초기 스타일 설정
    searchSection.style.maxHeight = '0';
    searchSection.style.overflow = 'hidden'; // 내용 숨김

    // 버튼 클릭 이벤트 리스너
    toggleButton.addEventListener('click', () => {
        isOpen = !isOpen; // 상태 토글

        if (isOpen) {
            searchSection.style.overflow = 'hidden'; // 열리는 동안 내용이 넘치지 않도록 설정
            searchSection.style.maxHeight = `${searchSection.scrollHeight}px`; // 자연스럽게 열기
            icon.style.transform = 'rotate(-90deg)'; // 아이콘 180도 회전
        } else {
            searchSection.style.maxHeight = '0'; // 높이를 0으로 줄여서 닫기
            icon.style.transform = 'rotate(0deg)'; // 아이콘 원래 상태로

            // 애니메이션이 끝나면 overflow를 hidden으로 설정
            searchSection.addEventListener(
                'transitionend',
                () => {
                    if (!isOpen) searchSection.style.overflow = 'hidden';
                },
                { once: true } // 이벤트가 한 번만 실행되도록 설정
            );
        }
    });
}
// 페이지 로딩 후 함수 실행
document.addEventListener('DOMContentLoaded', () => {
    toggleSearchBox(); // 함수 호출
});