// ROW 데이타 정의
const rowData = [
  {
    no: 1,
    brand: "KCC베이커리",
    checklist_name: "2024 체크리스트",
    master_checklist_name: "2023 체크리스트",
    inspection_type: "기획점검",
    create_date: "2024-10-07",
    status: "Y",
  },
  {
    no: 2,
    brand: "KCC베이커리",
    checklist_name: "2024 체크리스트",
    master_checklist_name: "2023 체크리스트",
    inspection_type: "기획점검",
    create_date: "2024-10-06",
    status: "Y",
  },
  {
    no: 3,
    brand: "KCC베이커리",
    checklist_name: "2024 체크리스트",
    master_checklist_name: "2023 체크리스트",
    inspection_type: "기획점검",
    create_date: "2024-10-05",
    status: "N",
  },
  {
    no: 4,
    brand: "KCC베이커리",
    checklist_name: "2024 체크리스트",
    master_checklist_name: "2023 체크리스트",
    inspection_type: "기획점검",
    create_date: "2024-10-04",
    status: "Y",
  },
  {
    no: 5,
    brand: "KCC베이커리",
    checklist_name: "2024 체크리스트",
    master_checklist_name: "2023 체크리스트",
    inspection_type: "기획점검",
    create_date: "2024-10-03",
    status: "Y",
  },
];

// 통합 설정 객체
const gridOptions = {
  rowData: rowData,
  columnDefs: [
    // 컬럼 정의
    {
      minWidth: 45,
      width: 70,
      headerCheckboxSelection: true,
      checkboxSelection: true,
      resizable: true,
      cellStyle: { backgroundColor: "#ffffff" },
    },
    { field: "no", headerName: "no", width: 80, minWidth: 50 },
    { field: "brand", headerName: "브랜드", minWidth: 110 },
    { field: "checklist_name", headerName: "체크리스트명", minWidth: 110 },
    {
      field: "master_checklist_name",
      headerName: "마스터 체크리스트",
      minWidth: 110,
    },
    { field: "inspection_type", headerName: "점검유형", minWidth: 110 },
    { field: "create_date", headerName: "등록년월", minWidth: 110 },
    { field: "status", headerName: "사용여부", minWidth: 70 },
    {
      field: "action",
      headerName: "관리",
      width: 100,
      minWidth: 53,
      pinned: "right",
      cellRenderer: function (params) {
        // jQuery를 사용하여 컨테이너 div 생성
        const $container = $("<div>", {
          class: "edit-container",
          css: { position: "relative", cursor: "pointer" },
        });

        // SVG 요소 생성
        const $svg = $(`
                        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="currentColor" class="bi bi-three-dots-vertical" viewBox="0 0 15 15">
                            <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0"/>
                        </svg>
                    `);

        // '자세히보기' 옵션 div 생성
        const $editDiv = $('<div class="edit-options">자세히보기</div>');

        // SVG 클릭 시 '수정' 옵션 표시
        $svg.on("click", function (e) {
          e.stopPropagation(); // 이벤트 버블링 방지

          // 모든 다른 'edit-options' 숨기기
          $(".edit-options").not($editDiv).removeClass("show");

          // SVG의 위치 계산
          const offset = $svg.offset();
          const svgHeight = $svg.outerHeight();

          // 'edit-options' 위치 설정 (SVG 아래에 표시)
          $editDiv.css({
            top: offset.top + svgHeight + 2, // SVG 바로 아래에 2px 간격
            left: offset.left + $svg.outerWidth() / 2 - 43, // SVG의 중앙에 왼쪽으로 이동
            transform: "translateX(-50%)", // 가로 중앙 정3
          });

          // 'show' 클래스 토글
          $editDiv.toggleClass("show");
        });

        // '수정' 옵션 클릭 시 모달 열기
        $editDiv.on("click", function (e) {
          e.stopPropagation(); // 이벤트 버블링 방지

          // 모달 열기
          $("#masterChecklistModal").modal("show");

          // 'edit-options' 숨기기
          $editDiv.removeClass("show");
        });

        // 컨테이너에 SVG 추가
        $container.append($svg);

        // 'edit-options'를 body에 추가
        $("body").append($editDiv);

        return $container[0]; // DOM 요소 반환
      },
      autoHeight: true,
    },
  ],

  autoSizeStrategy: {
    // 자동사이즈정책
    type: "fitGridWidth", // 그리드넓이기준으로
    defaultMinWidth: 10, // 컬럼 최소사이즈
  },
  rowHeight: 45, // row 높이지정
  rowSelection: "multiple",
  // 페이지 설정
  pagination: true,
  paginationAutoPageSize: true, // 요게 열려있으면 아래껀 무시당함!
  // paginationPageSizeSelector: [5, 10, 20, 30],  // 원하는 페이지 수 나열
  // paginationPageSize: 10,    // 디폴트 사이즈 선택, 위에 selector 중 하나를 선택
  onCellClicked: (params) => {
    console.log("cell was clicked", params);
  },
};

const gridDiv = document.querySelector("#myGrid");
//  new agGrid.Grid(gridDiv, gridOptions);  // deprecated
const gridApi = agGrid.createGrid(gridDiv, gridOptions);

// 체크리스트 개수를 업데이트하는 함수
function updateChecklistCount() {
  const checklistCount = document.querySelector(".checklist_count");
  checklistCount.textContent = rowData.length; // 현재 rowData 길이를 업데이트
}

// 처음 페이지 로드 시 checklist_count 값 설정
updateChecklistCount();

function createNewRowData() {
  var newData = {
    no: rowData.length + 1,
    brand: "",
    checklist_name: "",
    master_checklist_name: "",
    inspection_type: "",
    create_date: "",
    status: "",
  };
  return newData;
}

function onAddRow() {
  var newItem = createNewRowData();
  rowData.push(newItem);
  gridApi.applyTransaction({ add: [newItem] });
  updateChecklistCount();
}

function onDeleteRow() {
  var selectedRows = gridApi.getSelectedRows();
  if (selectedRows.length > 0) {
    gridApi.applyTransaction({ remove: selectedRows });

    selectedRows.forEach((row) => {
      const index = rowData.findIndex((data) => data.no === row.no);
      if (index > -1) {
        rowData.splice(index, 1);
      }
    });
    updateChecklistCount();
  } else {
    alert("삭제할 항목을 선택하세요.");
  }
}

$(function () {
  class Autocomplete {
    /**
     * 생성자
     * @param {jQuery} $wrapper - 자동완성을 적용할 wrapper 요소
     * @param {Array} dataList - 자동완성에 사용할 데이터 목록
     */
    constructor($wrapper, dataList) {
      this.$wrapper = $wrapper;
      this.$searchBtn = $wrapper.find(".search-btn");
      this.$input = $wrapper.find("input");
      this.$options = $wrapper.find(".options");
      this.dataList = dataList;

      this.init();
    }

    /**
     * 초기화 메서드
     * 이벤트 리스너를 설정하고 초기 리스트를 렌더링
     */
    init() {
      this.renderOptions();
      this.bindEvents();
    }

    /**
     * 옵션 리스트를 렌더링.
     * @param {string} [selectedItem] - 선택된 아이템을 표시
     */
    renderOptions(selectedItem = null) {
      this.$options.empty();
      this.dataList.forEach((item) => {
        const isSelected = item === selectedItem ? "selected" : "";
        const li = `<li onclick="window.updateName(this)" class="${isSelected} autocomplete-item list-group-item list-group-item-action">${item}</li>`;
        this.$options.append(li);
      });
    }

    /**
     * 필터링된 옵션 리스트를 렌더링
     * @param {string} query - 검색어
     */
    filterOptions(query) {
      const filtered = this.dataList.filter((item) =>
        item.toLowerCase().includes(query.toLowerCase())
      );

      this.$options.empty();
      if (filtered.length > 0) {
        filtered.forEach((item) => {
          const isSelected =
            item === this.$searchBtn.children().first().text()
              ? "selected"
              : "";
          const li = `<li onclick="window.updateName(this)" class="${isSelected} autocomplete-item list-group-item list-group-item-action">${item}</li>`;
          this.$options.append(li);
        });
      } else {
        this.$options.html(
          `<li class="list-group-item">찾으시는 항목이 없습니다.</li>`
        );
      }
    }

    /**
     * 이벤트 리스너를 바인딩
     */
    bindEvents() {
      // 검색 버튼 클릭 시 옵션 리스트 토글
      this.$searchBtn.on("click", (e) => {
        e.stopPropagation(); // 이벤트 버블링 방지
        $(".wrapper").not(this.$wrapper).removeClass("active"); // 다른 wrapper의 active 클래스 제거
        this.$wrapper.toggleClass("active");
        this.$input.focus();
      });

      // 입력 필드 키업 이벤트 처리
      this.$input.on("keyup", (e) => {
        e.stopPropagation(); // 이벤트 버블링 방지
        const query = this.$input.val();
        if (query) {
          this.filterOptions(query);
        } else {
          this.renderOptions();
        }
      });

      // 외부 클릭 시 옵션 리스트 숨기기
      $(document).on("click", (e) => {
        if (
          !this.$wrapper.is(e.target) &&
          this.$wrapper.has(e.target).length === 0
        ) {
          this.$wrapper.removeClass("active");
        }
      });
    }

    /**
     * 선택된 아이템을 업데이트
     * @param {string} selectedItem - 선택된 아이템 텍스트
     */
    updateSelected(selectedItem) {
      this.$input.val("");
      this.renderOptions(selectedItem);
      this.$wrapper.removeClass("active");
      this.$searchBtn.children().first().text(selectedItem);
    }
  }

  /**
   * 전역 함수로 선택된 아이템을 업데이트
   * @param {HTMLElement} selectedLi - 선택된 li 요소
   */
  window.updateName = function (selectedLi) {
    const selectedText = $(selectedLi).text();
    // 해당 li가 속한 wrapper를 찾습니다.
    const $wrapper = $(selectedLi).closest(".wrapper");
    const instance = $wrapper.data("autocompleteInstance");
    if (instance) {
      instance.updateSelected(selectedText);
    }
  };

  // 각 자동완성 필드에 대한 데이터 목록 정의
  /**
   * @todo responseBody로 받아올것이라면 여기서 Ajax로 데이터를 요청하면 됨
   */
  const autocompleteData = {
    // 가맹점
    store: [
      "혜화점",
      "종로점",
      "청량리점",
      "안산점",
      "부평점",
      "용산점",
      "답십리점",
    ],

    // 점검자
    inspector: ["노승우", "이지훈", "유재원", "원승언", "노승수"],

    // 점검 유형
    INSP: ["정기 점검", "제품 점검"],

    // 체크리스트
    CHKLST: ["KCC 크라상 위생 점검표", "KCC 카페 제품 점검표"],

    // 브랜드
    BRAND: ["KCC 크라상", "KCC 카페", "KCC 디저트"],

    // 마스터 체크리스트
    MASTER_CHKLST: ["품질점검체크리스트", "기획점검체크리스트"],
  };

  // 자동완성 인스턴스를 초기화하고 wrapper 요소에 저장
  $(".wrapper").each(function () {
    const $wrapper = $(this);
    const type = $wrapper.data("autocomplete");
    if (type && autocompleteData[type]) {
      const autocomplete = new Autocomplete($wrapper, autocompleteData[type]);
      $wrapper.data("autocompleteInstance", autocomplete);
    }
  });
});
// 문서 전체에 클릭 이벤트 바인딩하여 Popover 숨기기
$(document).on("click", function () {
  $(".edit-options").removeClass("show");
});
