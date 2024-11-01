// ROW 데이터 정의
let rowData3 = [];

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
        { field: "evitId", headerName: "no", width: 50, minWidth: 50, tooltipField: "no" },
        { field: "evitNm", headerName: "평가항목", width: 200, minWidth: 90, tooltipField: "evaluation_item" },
        { field: "evitTypeNm", headerName: "평가항목 유형", width: 40, minWidth: 90, tooltipField: "status" },
        { field: "score", headerName: "점수", width: 40, minWidth: 90, tooltipField: "score" },
        { field: "chklstEvitUseW", headerName: "사용여부", width: 40, minWidth: 90, tooltipField: "status" },
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

        const evitNm = params.data.evitNm;
        const evitTypeNm = params.data.evitTypeNm;
        const score = params.data.score;
        const chklstEvitUseW = params.data.chklstEvitUseW;
        const encodedEvitNm = encodeURIComponent(evitNm);

        fetch(`/master/inspection-list-manage/evit-chclst?ctg-id=${subCtgId}&evit-nm=${encodedEvitNm}`)
            .then(response => response.json())
            .then(data => {
                console.log(data);
                console.log("subCtgId", subCtgId);
                const rowData4 = [];
                for (let i = 0; i < data.length; i++) {
                    rowData4.push(data[i]);
                }
                gridApi4.setGridOption("rowData", rowData4);  // Initialize gridApi2 with rowData2
            });
        $('.evit-nm').next().val(evitNm);
        $('.evit-type-nm').next().val(evitTypeNm);
        $('.evit-score').next().val(score);
        if(chklstEvitUseW === 'Y'){
            $('.evit-use-w').next().prop('checked', true);
        }else if (chklstEvitUseW === 'N'){
            $('.evit-use-w').next().prop('checked', false);
        }
    },

    // 드래그 종료 후 seq 업데이트
    onRowDragEnd: params => {
        updateEvaluationRowDataSeq();
    },

    // 체크박스 해제 시 인풋박스와 grid3 초기화
    onSelectionChanged: () => {
        const selectedRows = gridApi3.getSelectedRows();
        if(selectedRows.length === 0){
            gridApi4.setGridOption("rowData", []);
            $('.evit-nm').next().val("");
            $('.evit-type-nm').next().val("");
            $('.evit-score').next().val("");
            $('.evit-use-w').next().prop('checked', false);
        }
    },
};

const gridDiv3 = document.querySelector('#evaluationGrid');
const gridApi3 = agGrid.createGrid(gridDiv3, gridOptions3);


// 새로운 rowData 생성 함수
function createNewEvaluationRowData() {
    var newData3 = {
        no: (gridApi3.getDisplayedRowCount() + 1),
        evaluation_item: "",
        evaluation_item_type: "",
        score: null,
        status: "",
        seq: (gridApi3.getDisplayedRowCount() + 1).toString()
    };
    return newData3;
}

// 행 추가 함수
function onAddEvaluationRow() {
    var newItem3 = createNewEvaluationRowData();
    gridApi3.applyTransaction({ add: [newItem3] });
}

// 행 삭제 함수
function onDeleteEvaluationRow() {
    var selectedRows = gridApi3.getSelectedRows();
    if (selectedRows.length > 0) {
        gridApi3.applyTransaction({ remove: selectedRows });
    } else {
        alert('삭제할 항목을 선택하세요.');
    }
}

// 드래그 완료 후 seq 값을 업데이트하는 함수
function updateEvaluationRowDataSeq() {
    gridApi3.forEachNode((node, index) => {
        // 각 행의 seq를 1부터 순차적으로 할당
        node.data.seq = (index + 1).toString();
    });

    // 그리드에 변경된 seq 값을 반영
    gridApi3.refreshCells({ force: true });
}
