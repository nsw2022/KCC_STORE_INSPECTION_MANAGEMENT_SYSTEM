// ROW 데이터 정의
const rowData4 = [
    { no: 1, choice_list: "적합", strength: "정상", suitable: "Y", score: 100, status: "Y", seq: "1" },
    { no: 2, choice_list: "부적합", strength: "크리티컬", suitable: "N", score: 0, status: "Y", seq: "2" },
];

// 통합 설정 객체
const gridOptions4 = {
    rowData: rowData4,

    columnDefs: [
        {
            minWidth: 45,
            width: 45,
            headerCheckboxSelection: true,
            checkboxSelection: true,
            resizable: true,
            cellStyle: { backgroundColor: "#ffffff" },
        },
        { field: "no", headerName: "no", width: 50, minWidth: 50, tooltipField: "no" },
        { field: "choice_list", headerName: "선택지 내용", width: 200, minWidth: 90, tooltipField: "choice_list" },
        { field: "strength", headerName: "부적합 강도", width: 40, minWidth: 90, tooltipField: "strength" },
        { field: "suitable", headerName: "적합", width: 40, minWidth: 90, tooltipField: "score" },
        { field: "status", headerName: "사용여부", width: 40, minWidth: 90, tooltipField: "status" },
        { field: "seq", headerName: "정렬순서", width: 40, minWidth: 90, tooltipField: "seq"},
    ],

    autoSizeStrategy: {
        type: 'fitGridWidth',              // 그리드 넓이 기준으로
        defaultMinWidth: 10               // 컬럼 최소사이즈
    },
    rowHeight: 45,

    pagination: true,
    paginationAutoPageSize: true,

    rowSelection: 'multiple',
    rowDragManaged: true,
    rowDragEntireRow: true,
    rowDragMultiRow: true,

    tooltipShowDelay: 500,


    onCellClicked: params => {
        console.log('cell was clicked', params);
    },

    // 드래그 종료 후 seq 업데이트
    onRowDragEnd: params => {
        updateChoiceListRowDataSeq();
    },
};

const gridDiv4 = document.querySelector('#choiceListGrid');
const gridApi4 = agGrid.createGrid(gridDiv4, gridOptions4);


// 새로운 rowData 생성 함수
function createNewChoiceListRowData() {
    var newData4 = {
        no: (gridApi4.getDisplayedRowCount() + 1),
        choice_list: "",
        strength: "",
        suitable: "",
        status: "",
        seq: (gridApi4.getDisplayedRowCount() + 1).toString()
    };
    return newData4;
}

// 행 추가 함수
function onAddChoiceListRow() {
    var newItem4 = createNewChoiceListRowData();
    gridApi4.applyTransaction({ add: [newItem4] });
}

// 행 삭제 함수
function onDeleteChoiceListRow() {
    var selectedRows = gridApi4.getSelectedRows();
    if (selectedRows.length > 0) {
        gridApi4.applyTransaction({ remove: selectedRows });
    } else {
        alert('삭제할 항목을 선택하세요.');
    }
}

// 드래그 완료 후 seq 값을 업데이트하는 함수
function updateChoiceListRowDataSeq() {
    gridApi4.forEachNode((node, index) => {
        // 각 행의 seq를 1부터 순차적으로 할당
        node.data.seq = (index + 1).toString();
    });

    // 그리드에 변경된 seq 값을 반영
    gridApi4.refreshCells({ force: true });
}
