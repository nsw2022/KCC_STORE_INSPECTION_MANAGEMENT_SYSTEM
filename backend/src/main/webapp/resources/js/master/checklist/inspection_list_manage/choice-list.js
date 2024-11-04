// ROW 데이터 정의
let rowData4 = [];
let chclstId = "";
let selectedRowNo4;

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
        if(params.data.evitChclstUseW === 'Y'){
            $('.chclst-use-w').next().prop('checked', true);
        }else if (params.data.evitChclstUseW === 'N'){
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
    onRowSelected: (event) => {
        const selectedRows = gridApi4.getSelectedRows();

        if (selectedRows.length === 1 && event.node.isSelected()) {
            const selectedNode = event.node;
            selectedRowNo4 = selectedNode.rowIndex;
            console.log("선택된 행 번호: ", selectedRowNo4);

        } else if (!event.node.isSelected() && event.node.rowIndex === selectedRowNo4) {
            selectedRowNo4 = null;
        }
    },
};

const gridDiv4 = document.querySelector('#choiceListGrid');
const gridApi4 = agGrid.createGrid(gridDiv4, gridOptions4);


// 새로운 rowData 생성 함수
function createNewChoiceListRowData() {
    var newData4 = {
        chclstId: (gridApi4.getDisplayedRowCount() + 1),
        chclstContent: "",
        nprfsCd: "",
        prfW: "",
        evitChclstUseW: "",
        bsnSspnDaynum:"",
        penalty:"",
        score: "",
        chclstSeq: (gridApi4.getDisplayedRowCount() + 1).toString()
    };
    return newData4;
}

// 행 추가 함수
function onAddChoiceListRow() {
    var newItem4 = createNewChoiceListRowData();
    gridApi4.applyTransaction({ add: [newItem4] });
}

function onDeleteChoiceListRow() {
    const selectedRows = gridApi4.getSelectedRows();
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
                const chclstId = selectedRows.map(row => row.chclstId).join(',');

                fetch(`/master/inspection-list-manage/evit-chclst/delete?evit-chclst-id=${chclstId}`, {
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
                        gridApi4.applyTransaction({ remove: selectedRows });

                        selectedRows.forEach((row) => {
                            const index = rowData4.findIndex((data) => data.chklstId === row.chklstId);
                            if (index > -1) {
                                rowData4.splice(index, 1);
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

function updateChoiceListRowDataSeq() {
    checkUnload = true;
    $('.chclst-save-btn').removeAttr("disabled");

    const updatedRowData = [];

    // 각 행의 seq를 1부터 순차적으로 업데이트하고 업데이트된 데이터를 updatedRowData에 추가
    gridApi4.forEachNode((node, index) => {
        node.data.chclstSeq = (index + 1).toString();
        updatedRowData.push({...node.data});
    });

    // rowData를 새로 정렬된 updatedRowData로 설정
    rowData4 = updatedRowData;

    // 변경 사항을 그리드에 적용
    gridApi4.redrawRows({ force: true});
}

// 선택지 내용 수정 시 이벤트
$('.chclst-nm-input').keyup(function(){
    if (selectedRowNo4 !== null) {
        checkUnload = true;
        $('.chclst-save-btn').removeAttr("disabled");

        // gridApi3에서 선택된 행 데이터 가져오기
        const selectedRowNode = gridApi4.getDisplayedRowAtIndex(selectedRowNo4);
        console.log("selectedRowNode", selectedRowNode);
        if (selectedRowNode && selectedRowNode.data) {

            // 가져온 데이터가 유효할 때만 업데이트
            selectedRowNode.data.chclstContent = $(this).val();
            gridApi4.applyTransaction({
                update: [selectedRowNode.data]
            });
        }
    }
});
// 사용여부 수정(체크) 시 이벤트
$('.chclst-use-w-input').change(function(){
    if (selectedRowNo4 !== null) {
        checkUnload = true;
        $('.chclst-save-btn').removeAttr("disabled");

        // gridApi에서 선택된 행 데이터 가져오기
        const selectedRowNode = gridApi4.getDisplayedRowAtIndex(selectedRowNo4);
        if (selectedRowNode && selectedRowNode.data) {
            // 체크 상태에 따라 ctgUseW 값 업데이트
            selectedRowNode.data.evitChclstUseW = $(this).is(":checked") ? 'Y' : 'N';
            gridApi4.applyTransaction({
                update: [selectedRowNode.data]
            });
        }
    }
});

// 적합 여부 수정(체크) 시 이벤트
$('.chclst-prfW-input').change(function(){
    if (selectedRowNo4 !== null) {
        checkUnload = true;
        $('.chclst-save-btn').removeAttr("disabled");

        // gridApi에서 선택된 행 데이터 가져오기
        const selectedRowNode = gridApi4.getDisplayedRowAtIndex(selectedRowNo4);
        if (selectedRowNode && selectedRowNode.data) {
            // 체크 상태에 따라 ctgUseW 값 업데이트
            selectedRowNode.data.prfW = $(this).is(":checked") ? 'Y' : 'N';
            gridApi4.applyTransaction({
                update: [selectedRowNode.data]
            });
        }
    }
});
// 부적합강도 수정 시 이벤트
$('.chclst-nprfsCd').keyup(function(){
    if (selectedRowNo4 !== null) {
        checkUnload = true;
        $('.chclst-save-btn').removeAttr("disabled");

        // gridApi3에서 선택된 행 데이터 가져오기
        const selectedRowNode = gridApi4.getDisplayedRowAtIndex(selectedRowNo4);
        if (selectedRowNode && selectedRowNode.data) {

            // 가져온 데이터가 유효할 때만 업데이트
            selectedRowNode.data.nprfsCd = $(this).val();
            gridApi4.applyTransaction({
                update: [selectedRowNode.data]
            });
        }
    }
});
// 부적합강도 수정 시 이벤트
$('.chclst-penalty').keyup(function(){
    if (selectedRowNo4 !== null) {
        checkUnload = true;
        $('.chclst-save-btn').removeAttr("disabled");

        // gridApi3에서 선택된 행 데이터 가져오기
        const selectedRowNode = gridApi4.getDisplayedRowAtIndex(selectedRowNo4);
        if (selectedRowNode && selectedRowNode.data) {

            // 가져온 데이터가 유효할 때만 업데이트
            selectedRowNode.data.penalty = $(this).val();
            gridApi4.applyTransaction({
                update: [selectedRowNode.data]
            });
        }
    }
});
// 과태료, 영업정지 수정 시 이벤트
$('.suspention-input, penalty-input').keyup(function(){
    if (selectedRowNo3 !== null) {
        checkUnload = true;
        $('.chclst-save-btn').removeAttr("disabled");
    }
});

// 선택지 내용 수정 시 이벤트
$('.chclst-score-input').keyup(function(){
    if (selectedRowNo4 !== null) {
        checkUnload = true;
        $('.chclst-save-btn').removeAttr("disabled");

        // gridApi4에서 선택된 행 데이터 가져오기
        const selectedRowNode = gridApi4.getDisplayedRowAtIndex(selectedRowNo4);
        if (selectedRowNode && selectedRowNode.data) {
            // 가져온 데이터가 유효할 때만 업데이트
            selectedRowNode.data.score = $(this).val();
            gridApi4.applyTransaction({
                update: [selectedRowNode.data]
            });
        }
        const selectedEvitRows = gridApi3.getSelectedRows();
        const EvitScore = selectedEvitRows.length > 0 && selectedEvitRows[0].score !== undefined ? selectedEvitRows[0].score : 0;

        const totalScore = gridApi4.getGridOption("rowData").reduce((sum, row) => sum + (parseInt(row.score, 10) || 0), 0);

        if (totalScore > EvitScore) {
            Swal.fire("실패!", `총 기준점수는 ${EvitScore}를 초과할 수 없습니다.`, "error");
            $(this).val(''); // 입력값 초기화
            return;
        }
    }
});
function onInsertOrUpdateChclst() {
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
            const selectedRows = gridApi4.getSelectedRows();
            if (selectedRows.length === 0) {
                Swal.fire("실패!", "선택지를 선택해주세요.", "error");
                return;
            }
            const selectedEvitRows = gridApi3.getSelectedRows();
            const EvitScore = selectedEvitRows.length > 0 && selectedEvitRows[0].score !== undefined ? selectedEvitRows[0].score : 0;

            const totalScore = gridApi4.getGridOption("rowData").reduce((sum, row) => sum + (parseInt(row.score, 10) || 0), 0);
            console.log(EvitScore, totalScore);
            if (totalScore != EvitScore) {
                Swal.fire("실패!", `총 기준점수는 ${EvitScore}점과 같아야 합니다.`, "error");
                $(this).val(''); // 입력값 초기화
                return;
            }

            // 체크리스트를 서버에 저장하는 fetch 요청
            fetch("/master/inspection-list-manage/evit-chclst/submit", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(selectedRows.map((row) => ({
                    evitId: evitId,
                    chclstId: row.chclstId,
                    chclstContent: row.chclstContent,
                    nprfsCd: row.nprfsCd,
                    prfW: row.prfW,
                    score: $('.chclst-score').next().val(),
                    penalty: $('.chclst-penalty').next().val(),
                    bsnSspnDaynum: row.bsnSspnDaynum,
                    evitChclstUseW: row.evitChclstUseW,
                    chclstSeq: row.chclstSeq
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
                            $('.chclst-save-btn').attr("disabled", "disabled");
                            location.href = `/master/inspection-list-manage?chklst-id=${chklstId}`;
                        }
                    });
                })
        }
    });
}