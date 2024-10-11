// ROW 데이터 정의
const rowData2 = [
    { no: 1, sub_category_name: "영엽취소", status: "Y", seq: "1" },
    { no: 2, sub_category_name: "영업정지 1개월 이상", status: "Y", seq: "2" },
    { no: 3, sub_category_name: "영업정지 15일 이상", status: "Y", seq: "3" },
    { no: 4, sub_category_name: "시정명령", status: "Y", seq: "4" },
    { no: 5, sub_category_name: "과태료", status: "Y", seq: "5" },
];

// 통합 설정 객체
const gridOptions2 = {
    rowData: rowData2,

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
        { field: "sub_category_name", headerName: "중분류명", width: 200, minWidth: 90, tooltipField: "sub_category_name" },
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
        updateSubCategoryRowDataSeq();
    },
};

const gridDiv2 = document.querySelector('#subCategoryGrid');
const gridApi2 = agGrid.createGrid(gridDiv2, gridOptions2);


// 새로운 rowData 생성 함수
function createNewSubCategoryRowData() {
    var newData2 = {
        no: (gridApi2.getDisplayedRowCount() + 1),
        sub_category_name: "",
        status: "",
        seq: (gridApi2.getDisplayedRowCount() + 1).toString()
    };
    return newData2;
}

// 행 추가 함수
function onAddSubCategoryRow() {
    var newItem2 = createNewSubCategoryRowData();
    gridApi2.applyTransaction({ add: [newItem2] });
}

// 행 삭제 함수
function onDeleteSubCategoryRow() {
    var selectedRows = gridApi2.getSelectedRows();
    if (selectedRows.length > 0) {
        gridApi2.applyTransaction({ remove: selectedRows });
    } else {
        alert('삭제할 항목을 선택하세요.');
    }
}

// 드래그 완료 후 seq 값을 업데이트하는 함수
function updateSubCategoryRowDataSeq() {
    gridApi2.forEachNode((node, index) => {
        // 각 행의 seq를 1부터 순차적으로 할당
        node.data.seq = (index + 1).toString();
    });

    // 그리드에 변경된 seq 값을 반영
    gridApi2.refreshCells({ force: true });
}
