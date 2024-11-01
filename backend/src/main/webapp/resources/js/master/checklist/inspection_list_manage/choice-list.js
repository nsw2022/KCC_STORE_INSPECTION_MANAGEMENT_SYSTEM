// ROW 데이터 정의
let rowData4 = [];

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
        { field: "chclstId", headerName: "no", width: 50, minWidth: 50, tooltipField: "ID" },
        { field: "chclstContent", headerName: "선택지 내용", width: 100, minWidth: 90, tooltipField: "chclstContent" },
        { field: "nprfsCd", headerName: "부적합 강도", width: 40, minWidth: 90, tooltipField: "nprfsCd" },
        { field: "prfW", headerName: "적합여부", width: 40, minWidth: 50, tooltipField: "prfW" },
        { field: "evitChclstUseW", headerName: "사용여부", width: 40, minWidth: 90, tooltipField: "status" },
        { field: "chclstSeq", headerName: "정렬순서", width: 40, minWidth: 90, tooltipField: "seq"},
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

    onCellClicked: params => {
        $('.chclst-nm').next().val(params.data.chclstContent);
        $('.chclst-score').next().val(params.data.score);

        $('.chclst-nprfsCd').next().val(params.data.nprfsCd);
        $('.chclst-penalty').next().val(params.data.penalty);

        $('.chclst-bsnSspnDaynum').next().val(params.data.bsnSspnDaynum);
        if(chklstEvitUseW === 'Y'){
            $('.chclst-use-w').next().prop('checked', true);
        }else if (chklstEvitUseW === 'N'){
            $('.chclst-use-w').next().prop('checked', false);
        }
    },

    // 드래그 종료 후 seq 업데이트
    onRowDragEnd: params => {
        updateChoiceListRowDataSeq();
    },
    // 체크박스 해제 시 인풋박스와 grid3 초기화
    onSelectionChanged: () => {
        const selectedRows = gridApi4.getSelectedRows();
        if(selectedRows.length === 0){
            $('.chclst-nm').next().val("");
            $('.chclst-score').next().val("");
            $('.chclst-nprfsCd').next().val("");
            $('.chclst-penalty').next().val("");
            $('.chclst-bsnSspnDaynum').next().val("");
            $('.chclst-use-w').next().prop('checked', false);
        }
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
