$(function () {
  /**
   * Autocomplete 클래스 정의
   */
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
        item.toLowerCase().includes(query.toLowerCase()),
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
          `<li class="list-group-item">찾으시는 항목이 없습니다.</li>`,
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

    // 체크리스트
    CHKLST: ["KCC 크라상 위생 점검표", "KCC 카페 제품 점검표"],

    // 브랜드
    BRAND: ["KCC 크라상", "KCC 카페", "KCC 디저트"],
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

  /**
   * 초기화 버튼 클릭 시 모든 선택 초기화
   */
  $("#reset-selection-top").on("click", function () {
    // 점검 예정일 초기화
    $("#topScheduleDate").val("");

    // 자동완성 필드 초기화
    $(".top-box-content .wrapper").each(function () {
      const $wrapper = $(this);
      const instance = $wrapper.data("autocompleteInstance");
      if (instance) {
        instance.updateSelected("선택 해 주세요.");
      }
    });
  });

  // ROW 데이터 정의
  const rowData = [
    {
      no: 1,
      store: "혜화점",
      brand: "KCC 크라상",
      checklist_name: "KCC 크라상 인상점검표",
      schedule_date: "2024.10.09",
      inspector: "노승우",
    },
    // ... 나머지 데이터는 그대로 유지
  ];

  // 그리드 옵션 설정
  const gridOptions = {
    rowData: rowData,
    columnDefs: [
      {
        headerName: "",
        checkboxSelection: true,
        headerCheckboxSelection: true,
        minWidth: 45,
        width: 70,
        resizable: true,
        cellStyle: { backgroundColor: "#ffffff" },
      },
      { field: "no", headerName: "No", width: 80, minWidth: 50 },
      { field: "store", headerName: "가맹점", width: 150, minWidth: 50 },
      { field: "brand", headerName: "브랜드", width: 150, minWidth: 110 },
      {
        field: "checklist_name",
        headerName: "체크리스트명",
        width: 150,
        minWidth: 110,
      },
      {
        field: "schedule_date",
        headerName: "점검예정일",
        width: 150,
        minWidth: 110,
      },
      { field: "inspector", headerName: "점검자", width: 150, minWidth: 110 },
      {
        headerName: "자세히보기",
        field: "more",
        width: 150,
        minWidth: 120,
        cellRenderer: function (params) {
          const button = document.createElement("button");
          button.innerText = "자세히 보기";
          button.setAttribute("data-bs-toggle", "modal");
          button.setAttribute("data-bs-target", "#masterChecklistModal");
          button.classList.add("modal_btn", "more");
          return button;
        },
        pinned: "right",
      },
    ],
    autoSizeStrategy: {
      type: "fitGridWidth",
      defaultMinWidth: 10,
    },
    rowHeight: 45,
    rowSelection: "multiple",
    pagination: true,
    paginationAutoPageSize: true,
    onCellClicked: (params) => {},
  };

  // 그리드 초기화
  const gridDiv = document.querySelector("#myGrid");
  new agGrid.Grid(gridDiv, gridOptions);

  // 체크리스트 개수를 업데이트하는 함수
  function updateChecklistCount() {
    const checklistCount = document.querySelector(".checklist_count");
    if (checklistCount) {
      checklistCount.textContent = rowData.length; // 현재 rowData 길이를 업데이트
    }
  }

  // 처음 페이지 로드 시 checklist_count 값 설정
  updateChecklistCount();

  // 새로운 행 데이터를 생성하는 함수
  function createNewRowData() {
    var newData = {
      no: rowData.length + 1,
      store: "",
      brand: "",
      checklist_name: "",
      schedule_date: "",
      inspector: "",
    };
    return newData;
  }

  // '추가' 버튼 클릭 이벤트 리스너
  $("#addRowButton").on("click", function () {
    var newItem = createNewRowData();
    rowData.push(newItem);
    gridOptions.api.applyTransaction({ add: [newItem] });
    updateChecklistCount();
  });

  // '삭제' 버튼 클릭 이벤트 리스너
  $("#deleteRowButton").on("click", function () {
    var selectedRows = gridOptions.api.getSelectedRows();
    if (selectedRows.length > 0) {
      gridOptions.api.applyTransaction({ remove: selectedRows });

      selectedRows.forEach(function (row) {
        var index = rowData.findIndex(function (data) {
          return data.no === row.no;
        });
        if (index > -1) {
          rowData.splice(index, 1);
        }
      });
      updateChecklistCount();
    } else {
      Swal.fire({
        title: "경고!",
        text: "삭제할 항목을 선택해주세요.",
        icon: "warning",
        confirmButtonText: "확인",
      });
    }
  });
});
