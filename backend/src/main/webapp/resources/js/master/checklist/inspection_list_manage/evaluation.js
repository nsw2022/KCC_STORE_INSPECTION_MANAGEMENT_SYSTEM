// ROW 데이터 정의
const rowData3 = [
    { no: 1, evaluation_item: "소비기한 변조 및 삭제", evaluation_item_type: "선택지형", score: 100, status: "Y", seq: "1" },
    { no: 2, evaluation_item: "시설물 위생 관리", evaluation_item_type: "선택지형", score: 100, status: "Y", seq: "2" },
    { no: 3, evaluation_item: "식품보관법", evaluation_item_type: "선택지형", score: 100, status: "Y", seq: "3" },
];

// 통합 설정 객체
const gridOptions3 = {
    rowData: rowData3,

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
        { field: "evaluation_item", headerName: "평가항목", width: 200, minWidth: 90, tooltipField: "evaluation_item" },
        { field: "evaluation_item_type", headerName: "평가항목 유형", width: 40, minWidth: 90, tooltipField: "status" },
        { field: "score", headerName: "점수", width: 40, minWidth: 90, tooltipField: "score" },
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
        updateRowDataSeq();
    },
};

const gridDiv3 = document.querySelector('#evaluationGrid');
const gridApi3 = agGrid.createGrid(gridDiv3, gridOptions3);


// 새로운 rowData 생성 함수
function createNewRowData() {
    var newData3 = {
        no: (gridApi3.getDisplayedRowCount() + 1),
        category_name: "",
        reference_score: "",
        status: "",
        seq: (gridApi3.getDisplayedRowCount() + 1).toString()
    };
    return newData3;
}

// 행 추가 함수
function onAddRow() {
    var newItem3 = createNewRowData();
    gridApi3.applyTransaction({ add: [newItem3] });
}

// 행 삭제 함수
function onDeleteRow() {
    var selectedRows = gridApi3.getSelectedRows();
    if (selectedRows.length > 0) {
        gridApi3.applyTransaction({ remove: selectedRows });
    } else {
        alert('삭제할 항목을 선택하세요.');
    }
}

// 드래그 완료 후 seq 값을 업데이트하는 함수
function updateRowDataSeq() {
    gridApi3.forEachNode((node, index) => {
        // 각 행의 seq를 1부터 순차적으로 할당
        node.data.seq = (index + 1).toString();
    });

    // 그리드에 변경된 seq 값을 반영
    gridApi3.refreshCells({ force: true });
}
