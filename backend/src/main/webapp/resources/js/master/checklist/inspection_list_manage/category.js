// ROW 데이터 정의
let rowData = [];
let ctgId = "";
let checkUnload = false;
let selectedRowNo;
let gridApi;

$(document).ready(async function() {
    $('.ctg-stnd-score').on('input', function() {
        const value = parseFloat($(this).val());

        if (!isNaN(value) && value > 100) {
            Swal.fire({
                title: "오류!",
                text: "100점을 초과할 수 없습니다",
                icon: "error",
                confirmButtonText: "확인",
            });
            $(this).val(''); // 입력값 초기화
        }
    });
    try {
        const response = await fetch(`/master/inspection-list-manage/ctg/${chklstId}`);
        const data = await response.json();
        console.log(data);

        for (let i = 0; i < data.length; i++) {
            rowData.push(data[i]);
        }
        console.log(rowData);

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
                { field: "ctgId", headerName: "no", width: 50, minWidth: 50, tooltipField: "no"  },
                { field: "ctgNm", headerName: "대분류명", width: 90, minWidth: 90, tooltipField: "category_name"  },
                { field: "stndScore", headerName: "기준점수", width: 90, minWidth: 90, tooltipField: "reference_score" },
                { field: "ctgUseW", headerName: "사용여부", width: 90, minWidth: 90, tooltipField: "status"},
                { field: "seq", headerName: "정렬순서", width: 90, minWidth: 90, tooltipField: "seq"},
            ],

            getRowId: params => params.data.ctgId, // 각 행의 고유 ID로 ctgId를 사용

            autoSizeStrategy: {
                type: 'fitGridWidth',
                defaultMinWidth: 10
            },
            rowHeight: 45,

            rowSelection: 'multiple',
            rowDragManaged: true,
            rowDragEntireRow: true,
            rowDragMultiRow: true,

            tooltipShowDelay: 500,

            onCellClicked: params => {
                const encodedCtgNm = encodeURIComponent(params.data.ctgNm);
                const ctgNm = params.data.ctgNm;
                const stndScore = params.data.stndScore;
                const ctgUseW = params.data.ctgUseW;

                ctgId = params.data.ctgId;
                fetch(`/master/inspection-list-manage/sub-ctg/${chklstId}?ctg-nm=${encodedCtgNm}`)
                    .then(response => response.json())
                    .then(data => {
                        rowData2 = [];
                        for (let i = 0; i < data.length; i++) {
                            rowData2.push(data[i]);
                        }
                        gridApi2.setGridOption("rowData", rowData2);  // Initialize gridApi2 with rowData2
                    });
                $('.ctg-nm').next().val(ctgNm);
                $('.stnd-score').next().val(stndScore);
                if(ctgUseW === 'Y'){
                    $('.ctg-use-w').next().prop('checked', true);
                }else if (ctgUseW === 'N'){
                    $('.ctg-use-w').next().prop('checked', false);
                }
            },

            onRowDragEnd: params => {
                updateCategoryRowDataSeq();
            },

            onSelectionChanged: () => {
                const selectedRows = gridApi.getSelectedRows();
                if(selectedRows.length === 0){
                    gridApi2.setGridOption("rowData", []);
                    $('.ctg-nm').next().val("");
                    $('.stnd-score').next().val("");
                    $('.ctg-use-w').next().prop('checked', false);
                }
            },

            onRowSelected: (event) => {
                const selectedRows = gridApi.getSelectedRows();

                if (selectedRows.length === 1 && event.node.isSelected()) {
                    const selectedNode = event.node;
                    selectedRowNo = selectedNode.rowIndex;
                    console.log("선택된 행 번호: ", selectedRowNo);

                } else if (!event.node.isSelected() && event.node.rowIndex === selectedRowNo) {
                    selectedRowNo = null;
                }
            },
        };


        const gridDiv = document.querySelector('#categoryGrid');
        gridApi = agGrid.createGrid(gridDiv, gridOptions);
    } catch (error) {
        console.error("Error fetching data:", error);
    }
});


// 새로운 rowData 생성 함수
function createNewCategoryRowData() {
    return {
        ctgId: "",
        ctgNm: "",
        stndScore: "",
        ctgUseW: "",
        seq: (gridApi.getDisplayedRowCount() + 1).toString()
    };
}

// 행 추가 함수
function onAddCategoryRow() {
    const newItem = createNewCategoryRowData();
    rowData.push(newItem); // rowData에 새 항목 추가
    gridApi.applyTransaction({ add: [newItem] }); // 그리드에 항목 추가
}

function onDeleteCategoryRow() {
    const selectedRows = gridApi.getSelectedRows();
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
                const ctgIds = selectedRows.map(row => row.ctgId).join(',');

                fetch(`/master/inspection-list-manage/ctg/delete?ctg-id=${ctgIds}`, {
                    method: 'DELETE',
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(selectedRows.map(row => ({ chklstId: row.chklstId })))
                }).then(response => {
                    // 응답 상태 코드 확인
                    if (!response.ok) {
                        if (response.status === 403) {
                            Swal.fire("실패!", "권한이 없습니다.", "error");
                        }
                    } else {
                        // 그리드에서도 해당 행 삭제
                        gridApi.applyTransaction({ remove: selectedRows });

                        selectedRows.forEach((row) => {
                            const index = rowData.findIndex((data) => data.chklstId === row.chklstId);
                            if (index > -1) {
                                rowData.splice(index, 1);
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








// 드래그 완료 후 seq 값을 업데이트하고 rowData 순서도 변경하는 함수
function updateCategoryRowDataSeq() {
    checkUnload = true;
    $('.ctg-save-btn').removeAttr("disabled");

    const updatedRowData = [];

    // 각 행의 seq를 1부터 순차적으로 업데이트하고 업데이트된 데이터를 updatedRowData에 추가
    gridApi.forEachNode((node, index) => {
        node.data.seq = (index + 1).toString();
        updatedRowData.push({ ...node.data });
    });

    // rowData를 새로 정렬된 updatedRowData로 설정
    rowData = updatedRowData;

    // 변경 사항을 그리드에 적용
    gridApi.applyTransaction({ update: rowData });
}

function toggleSearchBox() {
    const toggleButton = document.querySelector('.top-drop-down button'); // 버튼 선택
    const icon = toggleButton.querySelector('i'); // 아이콘 선택
    const searchSection = document.querySelector('.top-content .container'); // 검색 섹션 선택 --> 해당 부분은 접을 부분(custom)할 것

    // 초기 상태: 검색 섹션 닫힘
    let isOpen = false;

    // 초기 스타일 설정
    searchSection.style.maxHeight = '0';
    searchSection.style.overflow = 'hidden'; // 내용 숨김

    // 버튼 클릭 이벤트 리스너
    toggleButton.addEventListener('click', () => {
        isOpen = !isOpen; // 상태 토글

        if (isOpen) {
            searchSection.style.overflow = 'hidden'; // 열리는 동안 내용이 넘치지 않도록 설정
            searchSection.style.maxHeight = `${searchSection.scrollHeight}px`; // 자연스럽게 열기
            icon.style.transform = 'rotate(-90deg)'; // 아이콘 180도 회전
        } else {
            searchSection.style.maxHeight = '0'; // 높이를 0으로 줄여서 닫기
            icon.style.transform = 'rotate(0deg)'; // 아이콘 원래 상태로

            // 애니메이션이 끝나면 overflow를 hidden으로 설정
            searchSection.addEventListener(
                'transitionend',
                () => {
                    if (!isOpen) searchSection.style.overflow = 'hidden';
                },
                { once: true } // 이벤트가 한 번만 실행되도록 설정
            );
        }
    });
}
// 페이지 로딩 후 함수 실행
document.addEventListener('DOMContentLoaded', () => {
    toggleSearchBox(); // 함수 호출
});

// 대분류명 수정 시 이벤트
$('.ctg-input').keyup(function(){
    if (selectedRowNo !== null) {
        checkUnload = true;
        $('.ctg-save-btn').removeAttr("disabled");
        rowData[selectedRowNo].ctgNm = $('.ctg-input').val();
        gridApi.applyTransaction({
            update: [rowData[selectedRowNo]]
        });
    }
})
// 기준점수 수정 시 이벤트
$('.ctg-stnd-score').keyup(function(){
    if (selectedRowNo !== null) {
        checkUnload = true;
        $('.ctg-save-btn').removeAttr("disabled");
        rowData[selectedRowNo].stndScore = $('.ctg-stnd-score').val();
        gridApi.applyTransaction({
            update: [rowData[selectedRowNo]]
        });
    }
})
// 사용여부 수정(체크) 시 이벤트
$('.ctg-use-w-check').change(function(){
    console.log("checked");
    if (selectedRowNo !== null) {
        checkUnload = true;
        $('.ctg-save-btn').removeAttr("disabled");

        if($('.ctg-use-w-check').is(":checked")){
            rowData[selectedRowNo].ctgUseW = 'Y';
        }else{
            rowData[selectedRowNo].ctgUseW = 'N';
        }
        gridApi.applyTransaction({
            update: [rowData[selectedRowNo]]
        });
        $('.ctg-use-w-check').removeAttr("disabled");
    }
})

// 페이지를 벗어날 때 알림을 띄움
$(window).on("beforeunload", function() {
    if (checkUnload) return '이 페이지를 벗어나면 작성된 내용은 저장되지 않습니다.';
});

function ctgSaveOrUpdate() {
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
            const selectedRows = gridApi.getSelectedRows();
            if (selectedRows.length === 0) {
                Swal.fire("실패!", "항목을 선택해주세요.", "error");
                return;
            }

            // 체크리스트를 서버에 저장하는 fetch 요청
            fetch("/master/inspection-list-manage/ctg/submit", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(selectedRows.map((row) => ({
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
                        $('.ctg-save-btn').attr("disabled", "disabled");
                        location.href = `/master/inspection-list-manage?chklst-id=${chklstId}`;
                    }
                });
            })
        }
    });
}