// ROW 데이터 정의
let rowData2 = [];
let subCtgId = "";
let selectedRowNo2;
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
        { field: "ctgNm", headerName: "중분류명", width: 200, minWidth: 90, tooltipField: "중분류명" },
        { field: "stndScore", headerName: "기준점수", width: 200, minWidth: 90, tooltipField: "기준점수" },
        { field: "ctgUseW", headerName: "사용여부", width: 40, minWidth: 90, tooltipField: "사용여부" },
        { field: "seq", headerName: "정렬순서", width: 40, minWidth: 90, tooltipField: "순서"},
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
        $('.sub-ctg-stnd-score').val(params.data.stndScore);
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

    onRowSelected: (event) => {
        const selectedRows = gridApi2.getSelectedRows();

        if (selectedRows.length === 1 && event.node.isSelected()) {
            const selectedNode = event.node;
            selectedRowNo2 = selectedNode.rowIndex;
            console.log("sub-category 선택된 행 번호: ", selectedRowNo2);

        } else if (!event.node.isSelected() && event.node.rowIndex === selectedRowNo2) {
            selectedRowNo2 = null;
        }
    },
};

const gridDiv2 = document.querySelector('#subCategoryGrid');
const gridApi2 = agGrid.createGrid(gridDiv2, gridOptions2);


// 새로운 rowData 생성 함수
function createNewSubCategoryRowData() {
    var newData2 = {
        ctgId: "new" + (gridApi2.getDisplayedRowCount() + 1),
        ctgNm: "",
        ctgUseW: "",
        seq: (gridApi2.getDisplayedRowCount() + 1).toString()
    };
    return newData2;
}

// 행 추가 함수
function onAddSubCategoryRow() {
    var newItem2 = createNewSubCategoryRowData();
    rowData2.push(newItem2); // rowData에 새 항목 추가
    gridApi2.applyTransaction({ add: [newItem2] });
}

function onDeleteSubCategoryRow() {
    const selectedRows = gridApi2.getSelectedRows();
    Swal.fire({
        title: "확인",
        html: "선택된 중분류를 삭제하시겠습니까?<br><b>이 작업은 되돌릴 수 없습니다.</b>",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "확인",
        cancelButtonText: "취소",
    }).then((result) => {
        if (selectedRows.length > 0) {
            // 경고 메시지 표시
            if (result.isConfirmed) { // 사용자가 삭제를 확인한 경우
                // ctgId 배열 생성
                const ctgIds = selectedRows.map(row => row.ctgId).join(',');

                fetch(`/master/inspection-list-manage/ctg/delete?ctg-id=${ctgIds}`, {
                    method: 'DELETE',
                    headers: {
                        "Content-Type": "application/json",
                    },
                    // body: JSON.stringify(selectedRows.map(row => ({ chklstId: row.chklstId })))
                }).then(response => {
                    // 응답 상태 코드 확인
                    if (!response.ok) {
                        if (response.status === 403) {
                            Swal.fire("실패!", "권한이 없습니다.", "error");
                        }
                    } else {
                        // 그리드에서도 해당 행 삭제
                        gridApi2.applyTransaction({ remove: selectedRows });

                        selectedRows.forEach((row) => {
                            const index = rowData2.findIndex((data) => data.chklstId === row.chklstId);
                            if (index > -1) {
                                rowData2.splice(index, 1);
                            }
                        });
                    }
                });
            }
        } else {
            Swal.fire("실패!", "삭제 할 항목을 선택해주세요.", "error");
        }
    });
}

// 드래그 완료 후 seq 값을 업데이트하고 rowData 순서도 변경하는 함수
/**
 * @Todo 드래그 후 selectedRowNo 변경해야 함
 */
function updateSubCategoryRowDataSeq() {
    checkUnload = true;
    $('.sub-ctg-save-btn').removeAttr("disabled");

    const updatedRowData = [];

    // 각 행의 seq를 1부터 순차적으로 업데이트하고 업데이트된 데이터를 updatedRowData에 추가
    gridApi2.forEachNode((node, index) => {
        node.data.seq = (index + 1).toString();
        updatedRowData.push({...node.data});
    });

    // rowData를 새로 정렬된 updatedRowData로 설정
    rowData2 = updatedRowData;

    // 변경 사항을 그리드에 적용
    gridApi2.applyTransaction({update: rowData2});
}



// 중분류명 수정 시 이벤트
$('.sub-ctg-input').keyup(function(){
    if (selectedRowNo2 !== null) {
        checkUnload = true;
        $('.sub-ctg-save-btn').removeAttr("disabled");

        // gridApi2에서 선택된 행 데이터 가져오기
        const selectedRowNode = gridApi2.getDisplayedRowAtIndex(selectedRowNo2);
        if (selectedRowNode && selectedRowNode.data) {
            // 가져온 데이터가 유효할 때만 업데이트
            selectedRowNode.data.ctgNm = $('.sub-ctg-input').val();
            gridApi2.applyTransaction({
                update: [selectedRowNode.data]
            });
        }
    }
});
// 중분류 기준점수 수정 시 이벤트
$('.sub-ctg-stnd-score').keyup(function(){
    console.log("zz");
    if (selectedRowNo2 !== null) {
        checkUnload = true;
        $('.sub-ctg-save-btn').removeAttr("disabled");

        // gridApi2에서 선택된 행 데이터 가져오기
        const selectedRowNode = gridApi2.getDisplayedRowAtIndex(selectedRowNo2);
        if (selectedRowNode && selectedRowNode.data) {
            // 가져온 데이터가 유효할 때만 업데이트
            selectedRowNode.data.stndScore = $(this).val();
            gridApi2.applyTransaction({
                update: [selectedRowNode.data]
            });
        }
    }
});

// 사용여부 수정(체크) 시 이벤트
$('.sub-ctg-use-w-input').change(function(){
    console.log("checked");
    if (selectedRowNo2 !== null) {
        checkUnload = true;
        $('.sub-ctg-save-btn').removeAttr("disabled");

        // gridApi에서 선택된 행 데이터 가져오기
        const selectedRowNode = gridApi2.getDisplayedRowAtIndex(selectedRowNo2);
        if (selectedRowNode && selectedRowNode.data) {
            // 체크 상태에 따라 ctgUseW 값 업데이트
            selectedRowNode.data.ctgUseW = $('.sub-ctg-use-w-input').is(":checked") ? 'Y' : 'N';
            gridApi2.applyTransaction({
                update: [selectedRowNode.data]
            });
        }
    }
});



function subCtgSaveOrUpdate() {
    Swal.fire({
        title: "확인",
        html: "선택된 중분류를 저장하시겠습니까?<br><b>선택하지 않은 중분류는 저장되지 않습니다.</b>",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "확인",
        cancelButtonText: "취소",
    }).then((result) => {
        if (result.isConfirmed) {
            const selectedRows = gridApi2.getSelectedRows();
            if (selectedRows.length === 0) {
                Swal.fire("실패!", "중분류를 선택해주세요.", "error");
                return;
            }

            // 체크리스트를 서버에 저장하는 fetch 요청
            fetch("/master/inspection-list-manage/sub-ctg/submit", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(selectedRows.map((row) => ({
                    masterCtgId: ctgId,
                    ctgId: row.ctgId,
                    ctgNm: row.ctgNm,
                    chklstId: chklstId,
                    stndScore: row.stndScore,
                    ctgUseW: row.ctgUseW,
                    seq: row.seq,
                }))),
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
                        $('.sub-ctg-save-btn').attr("disabled", "disabled");
                    }
                });
            })
        }
    });
}