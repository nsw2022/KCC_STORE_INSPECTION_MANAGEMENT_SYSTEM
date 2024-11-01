// ROW 데이터 정의
let rowData2 = [];
let subCtgId = "";
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
        { field: "ctgId", headerName: "no", width: 50, minWidth: 50, tooltipField: "no" },
        { field: "ctgNm", headerName: "중분류명", width: 200, minWidth: 90, tooltipField: "sub_category_name" },
        { field: "ctgUseW", headerName: "사용여부", width: 40, minWidth: 90, tooltipField: "status" },
        { field: "seq", headerName: "정렬순서", width: 40, minWidth: 90, tooltipField: "seq"},
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
        const encodedCtgNm = encodeURIComponent(params.data.ctgNm);
        const ctgNm = params.data.ctgNm;
        const ctgUseW = params.data.ctgUseW;
        console.log(ctgNm, ctgId);
        subCtgId = params.data.ctgId;
        fetch(`/master/inspection-list-manage/chklst-evit?ctg-id=${ctgId}&ctg-nm=${encodedCtgNm}`)
            .then(response => response.json())
            .then(data => {
                console.log(data);
                const rowData3 = [];
                for (let i = 0; i < data.length; i++) {
                    rowData3.push(data[i]);
                }
                gridApi3.setGridOption("rowData", rowData3);  // Initialize gridApi2 with rowData2
            });
        $('.sub-ctg-nm').next().val(ctgNm);
        if(ctgUseW === 'Y'){
            $('.sub-ctg-use-w').next().prop('checked', true);
        }else if (ctgUseW === 'N'){
            $('.sub-ctg-use-w').next().prop('checked', false);
        }
    },

    // 드래그 종료 후 seq 업데이트
    onRowDragEnd: params => {
        updateSubCategoryRowDataSeq();
    },

    // 체크박스 해제 시 인풋박스와 grid3 초기화
    onSelectionChanged: () => {
        const selectedRows = gridApi2.getSelectedRows();
        if(selectedRows.length === 0){
            gridApi3.setGridOption("rowData", []);
            $('.sub-ctg-nm').next().val("");
            $('.sub-ctg-use-w').next().prop('checked', false);
        }
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
