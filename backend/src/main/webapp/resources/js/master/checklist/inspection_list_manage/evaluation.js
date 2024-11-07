// ROW 데이터 정의
let rowData3 = [];
let evitId = "";
let selectedRowNo3;

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
        evitId = params.data.evitId;
        const evitNm = params.data.evitNm;
        const evitTypeNm = params.data.evitTypeNm;
        const score = params.data.score;
        const chklstEvitUseW = params.data.chklstEvitUseW;
        const encodedEvitNm = encodeURIComponent(evitNm);

        fetch(`/master/inspection-list-manage/evit-chclst?ctg-id=${subCtgId}&evit-nm=${encodedEvitNm}`)
            .then(response => response.json())
            .then(data => {
                rowData4 = [];
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

    onRowSelected: (event) => {
        const selectedRows = gridApi3.getSelectedRows();

        if (selectedRows.length === 1 && event.node.isSelected()) {
            const selectedNode = event.node;
            selectedRowNo3 = selectedNode.rowIndex;

        } else if (!event.node.isSelected() && event.node.rowIndex === selectedRowNo3) {
            selectedRowNo3 = null;
        }
    },
};

const gridDiv3 = document.querySelector('#evaluationGrid');
const gridApi3 = agGrid.createGrid(gridDiv3, gridOptions3);


// 새로운 rowData 생성 함수
function createNewEvaluationRowData() {
    var newData3 = {
        evitId: (gridApi3.getDisplayedRowCount() + 1),
        evitNm: "",
        evitTypeNm: "",
        score: "",
        chklstEvitUseW: "",
        seq: (gridApi3.getDisplayedRowCount() + 1).toString()
    };
    return newData3;
}

// 행 추가 함수
function onAddEvaluationRow() {
    var newItem3 = createNewEvaluationRowData();
    rowData3.push(newItem3);
    gridApi3.applyTransaction({ add: [newItem3] });
}

// 행 삭제 함수
// function onDeleteEvaluationRow() {
//     var selectedRows = gridApi3.getSelectedRows();
//     if (selectedRows.length > 0) {
//         gridApi3.applyTransaction({ remove: selectedRows });
//     } else {
//         alert('삭제할 항목을 선택하세요.');
//     }
// }

function onDeleteEvaluationRow() {
    const selectedRows = gridApi3.getSelectedRows();
    Swal.fire({
        title: "확인",
        html: "선택한 항목을 삭제하시겠습니까?<br><b>이 작업은 되돌릴 수 없습니다.</b>",
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
                const evitIds = selectedRows.map(row => row.evitId).join(',');

                fetch(`/master/inspection-list-manage/chklst-evit/delete?evit-id=${evitIds}`, {
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
                        gridApi3.applyTransaction({ remove: selectedRows });

                        selectedRows.forEach((row) => {
                            const index = rowData3.findIndex((data) => data.chklstId === row.chklstId);
                            if (index > -1) {
                                rowData3.splice(index, 1);
                            }
                        });
                        Swal.fire({
                            title: "완료!",
                            text: "삭제가 완료되었습니다.",
                            icon: "success",
                            confirmButtonText: "OK",
                        })
                    }
                });
            }
        } else {
            Swal.fire("실패!", "삭제 할 항목을 선택해주세요.", "error");
        }
    });
}

function updateEvaluationRowDataSeq() {
    checkUnload = true;
    $('.evit-save-btn').removeAttr("disabled");

    const updatedRowData = [];

    // 각 행의 seq를 1부터 순차적으로 업데이트하고 업데이트된 데이터를 updatedRowData에 추가
    gridApi3.forEachNode((node, index) => {
        node.data.seq = (index + 1).toString();
        updatedRowData.push({...node.data});
    });

    // rowData를 새로 정렬된 updatedRowData로 설정
    rowData3 = updatedRowData;

    // 변경 사항을 그리드에 적용
    gridApi3.redrawRows({ force: true});

}

// 평가항목 이름 수정 시 이벤트
$('.evit-nm-input').keyup(function(){
    if (selectedRowNo3 !== null) {
        checkUnload = true;
        $('.evit-save-btn').removeAttr("disabled");

        // gridApi3에서 선택된 행 데이터 가져오기
        const selectedRowNode = gridApi3.getDisplayedRowAtIndex(selectedRowNo3);
        if (selectedRowNode && selectedRowNode.data) {
            // 가져온 데이터가 유효할 때만 업데이트
            selectedRowNode.data.evitNm = $(this).val();
            gridApi3.applyTransaction({
                update: [selectedRowNode.data]
            });
        }
    }
});
// 평가항목 타입 수정 시 이벤트
$('.evit-type-input').keyup(function(){
    if (selectedRowNo3 !== null) {
        checkUnload = true;
        $('.evit-save-btn').removeAttr("disabled");

        // gridApi3에서 선택된 행 데이터 가져오기
        const selectedRowNode = gridApi3.getDisplayedRowAtIndex(selectedRowNo3);
        if (selectedRowNode && selectedRowNode.data) {
            // 가져온 데이터가 유효할 때만 업데이트
            selectedRowNode.data.evitTypeNm = $(this).val();
            gridApi3.applyTransaction({
                update: [selectedRowNode.data]
            });
        }
    }
});
// 평가항목 점수 수정 시 이벤트
$('.evit-score').keyup(function(){
    if (selectedRowNo3 !== null) {
        checkUnload = true;
        $('.evit-save-btn').removeAttr("disabled");

        // gridApi3에서 선택된 행 데이터 가져오기
        const selectedRowNode = gridApi3.getDisplayedRowAtIndex(selectedRowNo3);
        if (selectedRowNode && selectedRowNode.data) {
            // 가져온 데이터가 유효할 때만 업데이트
            selectedRowNode.data.score = $(this).val();
            gridApi3.applyTransaction({
                update: [selectedRowNode.data]
            });
        }
        const selectedRows = gridApi2.getSelectedRows();
        const subCtgScore = selectedRows.length > 0 && selectedRows[0].stndScore !== undefined ? selectedRows[0].stndScore : 0;
        console.log(rowData3);

        const totalScore = rowData3.reduce((sum, row) => sum + (parseInt(row.score, 10) || 0), 0);
        console.log(totalScore + $('.evit-score').val());
        if (totalScore > subCtgScore) {
            Swal.fire("실패!", `총 기준점수는 ${subCtgScore}를 초과할 수 없습니다.`, "error");
            $(this).val(''); // 입력값 초기화
            return;
        }
    }
});
// 사용여부 수정(체크) 시 이벤트
$('.evit-use-w-input').change(function(){
    if (selectedRowNo3 !== null) {
        checkUnload = true;
        $('.evit-save-btn').removeAttr("disabled");

        // gridApi에서 선택된 행 데이터 가져오기
        const selectedRowNode = gridApi3.getDisplayedRowAtIndex(selectedRowNo3);
        if (selectedRowNode && selectedRowNode.data) {
            // 체크 상태에 따라 ctgUseW 값 업데이트
            selectedRowNode.data.chklstEvitUseW = $(this).is(":checked") ? 'Y' : 'N';
            gridApi3.applyTransaction({
                update: [selectedRowNode.data]
            });
        }
    }
});


function evitSaveOrUpdate() {
    Swal.fire({
        title: "확인",
        html: "선택한 항목을 저장하시겠습니까?<br><b>선택하지 않은 항목은 저장되지 않습니다.</b>",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "확인",
        cancelButtonText: "취소",
    }).then((result) => {
        if (result.isConfirmed) {

            const selectedEvitRows = gridApi3.getSelectedRows();
            if (selectedEvitRows.length === 0) {
                Swal.fire("실패!", "선택항목을 선택해주세요.", "error");
                return;
            }
            const selectedRows = gridApi2.getSelectedRows();
            const subCtgScore = selectedRows.length > 0 && selectedRows[0].stndScore !== undefined ? selectedRows[0].stndScore : 0;

            const totalScore = rowData3.reduce((sum, row) => sum + (parseInt(row.score, 10) || 0), 0);
            if (totalScore != subCtgScore) {
                Swal.fire("실패!", `총 기준점수는 ${subCtgScore}점과 같아야 합니다.`, "error");
                $(this).val(''); // 입력값 초기화
                return;
            }

            // 체크리스트를 서버에 저장하는 fetch 요청
            fetch("/master/inspection-list-manage/chklst-evit/submit", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(selectedEvitRows.map((row) => ({
                    subCtgId: subCtgId,
                    evitId: row.evitId,
                    evitNm: row.evitNm,
                    evitTypeNm: row.evitTypeNm,
                    score: row.score,
                    chklstEvitUseW: row.chklstEvitUseW,
                    evitSeq: row.seq,
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
                        $('.evit-save-btn').attr("disabled", "disabled");
                        location.href = `/master/inspection-list-manage?chklst-id=${chklstId}`;
                    }
                });
            })
        }
    });
}