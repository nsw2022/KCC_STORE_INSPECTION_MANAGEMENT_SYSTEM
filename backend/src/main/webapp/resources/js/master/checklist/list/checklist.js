
// ROW 데이타 정의
const rowData = [
    { no: 1, brand: "KCC베이커리", checklist_name: "2024 체크리스트", master_checklist_name: "2023 체크리스트", inspection_type: "기획점검", create_date: "2024-10-07", status: "Y"},
    { no: 2, brand: "KCC베이커리", checklist_name: "2024 체크리스트", master_checklist_name: "2023 체크리스트", inspection_type: "기획점검", create_date: "2024-10-06", status: "Y"},
    { no: 3, brand: "KCC베이커리", checklist_name: "2024 체크리스트", master_checklist_name: "2023 체크리스트", inspection_type: "기획점검", create_date: "2024-10-05", status: "N"},
    { no: 4, brand: "KCC베이커리", checklist_name: "2024 체크리스트", master_checklist_name: "2023 체크리스트", inspection_type: "기획점검", create_date: "2024-10-04", status: "Y"},
    { no: 5, brand: "KCC베이커리", checklist_name: "2024 체크리스트", master_checklist_name: "2023 체크리스트", inspection_type: "기획점검", create_date: "2024-10-03", status: "Y"},
];

// 통합 설정 객체
const gridOptions = {
    rowData: rowData,
    columnDefs: [// 컬럼 정의
        {
            minWidth: 45,
            width: 70,
            headerCheckboxSelection: true,
            checkboxSelection: true,
            resizable: true,
            cellStyle: { backgroundColor: "#ffffff" },
        },
        { field: "no", headerName: "no", width: 80, minWidth: 50},
        { field: "brand", headerName: "브랜드", minWidth: 110},
        { field: "checklist_name", headerName: "체크리스명", minWidth: 110},
        { field: "master_checklist_name", headerName: "마스터 체크리스트", minWidth: 110 },
        { field: "inspection_type", headerName: "점검유형", minWidth: 110  },
        { field: "create_date", headerName: "등록년월", minWidth: 110  },
        { field: "status", headerName: "사용여부", minWidth: 70}

    ],

    autoSizeStrategy: {                    // 자동사이즈정책
        type: 'fitGridWidth',              // 그리드넓이기준으로
        defaultMinWidth: 10               // 컬럼 최소사이즈
    },
    rowHeight: 45,                          // row 높이지정
    rowSelection: 'multiple',
    // 페이지 설정
    pagination: true,
    paginationAutoPageSize:true,  // 요게 열려있으면 아래껀 무시당함!
    // paginationPageSizeSelector: [5, 10, 20, 30],  // 원하는 페이지 수 나열
    // paginationPageSize: 10,    // 디폴트 사이즈 선택, 위에 selector 중 하나를 선택
    onCellClicked: params => {
        console.log('cell was clicked', params);
    }
};



const gridDiv = document.querySelector('#myGrid');
//  new agGrid.Grid(gridDiv, gridOptions);  // deprecated
const gridApi = agGrid.createGrid(gridDiv, gridOptions);


// 체크리스트 개수를 업데이트하는 함수
function updateChecklistCount() {
    const checklistCount = document.querySelector('.checklist_count');
    checklistCount.textContent = rowData.length; // 현재 rowData 길이를 업데이트
}

// 처음 페이지 로드 시 checklist_count 값 설정
updateChecklistCount();

function createNewRowData() {
    var newData = {
        no: (rowData.length + 1),
        brand: "",
        checklist_name: "",
        master_checklist_name: "",
        inspection_type: "",
        create_date: "",
        status:""
    };
    return newData;
}

function onAddRow() {
    var newItem = createNewRowData();
    rowData.push(newItem);
    gridApi.applyTransaction({ add:[newItem]});
    updateChecklistCount();
}

function onDeleteRow() {
    var selectedRows = gridApi.getSelectedRows();
    if (selectedRows.length > 0) {
        gridApi.applyTransaction({ remove: selectedRows });

        selectedRows.forEach(row => {
            const index = rowData.findIndex(data => data.no === row.no);
            if (index > -1) {
                rowData.splice(index, 1);
            }
        });
        updateChecklistCount();
    } else {
        alert('삭제할 항목을 선택하세요.');
    }
}

