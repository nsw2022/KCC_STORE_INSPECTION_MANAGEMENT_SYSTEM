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

const gridDiv = document.querySelector('#categoryGrid');
const gridApi = agGrid.createGrid(gridDiv, gridOptions);


// 새로운 rowData 생성 함수
function createNewRowData() {
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
function onAddRow() {
    var newItem = createNewRowData();
    gridApi.applyTransaction({ add: [newItem] });
}

// 행 삭제 함수
function onDeleteRow() {
    var selectedRows = gridApi.getSelectedRows();
    if (selectedRows.length > 0) {
        gridApi.applyTransaction({ remove: selectedRows });
    } else {
        alert('삭제할 항목을 선택하세요.');
    }
}

// 드래그 완료 후 seq 값을 업데이트하는 함수
function updateRowDataSeq() {
    gridApi.forEachNode((node, index) => {
        // 각 행의 seq를 1부터 순차적으로 할당
        node.data.seq = (index + 1).toString();
    });

    // 그리드에 변경된 seq 값을 반영
    gridApi.refreshCells({ force: true });
}
