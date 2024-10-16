/* 본문 헤더 영역 */
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
    // js에서는 변수에 나 객체요! 를 명시할때 변수앞에 $써서 표기
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
     *
     */
    renderOptions(selectedItem = null) {
      this.$options.empty();
      this.dataList.forEach((item) => {
        const isSelected = item === selectedItem ? "selected" : "";
        const li = `<li onclick="window.updateName(this)" class="${isSelected} autocomplete-item">${item}</li>`;
        this.$options.append(li);
      });
    }

    /**
     * 필터링된 옵션 리스트를 렌더링
     * @param {string} query - 검색어
     * @description - li에 class나 id를 넣고 싶다면 여기서 추가할 것
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
          const li = `<li onclick="window.updateName(this)" class="${isSelected} autocomplete-item" >${item}</li>`;
          this.$options.append(li);
        });
      } else {
        this.$options.html(
          `<p style="margin-top: 10px; width: 100%;" class="pe-0">존재하지 않습니다.</p>`,
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
   * 전역 함수로 선택된 아이템을 업데이트합니다.
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
   *
   */
  const autocompleteData = {
    store: [
      "혜화점",
      "종로점",
      "청량리점",
      "안산점",
      "부평점",
      "용산점",
      "답십리점",
    ],
    inspector: ["노승우", "이지훈", "유재원", "원승언", "노승수"],
    sv: ["홍길동", "이순신", "신사임당", "최강록", "박성호"],
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

  /* 전체 너비에 따라 col 범위 설정 */

  // 768px에서 DOM이 변경되는데 DOM이 변경된 이후에 function이 실행될 수 있게 SetTimeout 함수 사용
  setTimeout(function () {
    window.dispatchEvent(new Event("resize"));
  }, 1);

  let maxWidth = window.innerWidth;
  function headerAreaColChange(maxWidth) {
    // 헤더 영역의 검색 영역
    let headerInputArea = $(".header_input_area");

    // 헤더 영역의 버튼 영역
    let headerBtnArea = $(".header_btn_area");

    // 헤더 영역의 텍스트 영역
    let headerText = $(".header_text");

    if (maxWidth <= 576) {
      // 버튼 영역을 검색창 앞으로 옮기기
      headerBtnArea.after(headerInputArea);

      headerText.addClass("col-6");

      if (headerInputArea.hasClass("col-sm-7")) {
        headerInputArea.removeClass("col-6");
      } else {
        headerInputArea.removeClass("col-6");
        headerInputArea.addClass("col-sm-7");
      }
    } else if (maxWidth <= 768) {
      headerText.removeClass("col-6");
      headerBtnArea.before(headerInputArea);
      headerInputArea.removeClass("col-6");
      headerInputArea.addClass("col-sm-7");
    } else {
      headerInputArea.removeClass("col-sm-7");
      headerInputArea.addClass("col-6");
    }
  }

  $(window).resize(function () {
    let maxWidth = window.innerWidth;
    headerAreaColChange(maxWidth);
  });

  headerAreaColChange(maxWidth);
});

/* 본문 헤더 영역 끝 */

/* 본문 표 영역 */

// 아이콘이 포함된 셀 렌더러 정의
function BtnCellRenderer() {}

BtnCellRenderer.prototype.init = function () {
  // div를 생성하고 클릭 이벤트 추가
  this.eGui = document.createElement("div");
  this.eGui.innerHTML = `
    <button class="edit_btn" data-bs-toggle="modal" data-bs-target="#productManagementModal">
      <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="currentColor" class="bi bi-three-dots-vertical" viewBox="0 0 15 15">
        <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0"/>
      </svg>
    </button>
    `;
  this.eGui.className = "icon-container d-inline-flex"; // 필요한 경우 스타일 추가
};

BtnCellRenderer.prototype.getGui = function () {
  return this.eGui;
};

// ROW 데이타 정의
const rowData = [
  {
    No: 1,
    productName: "소보로빵",
    brand: "KCC베이커리",
    expiration_daynum: "30",
    product_price: "1800",
    product_sell_status: "판매중",
  },
  {
    No: 2,
    productName: "크림빵",
    brand: "KCC베이커리",
    expiration_daynum: "21",
    product_price: "2000",
    product_sell_status: "판매중",
  },
  {
    No: 3,
    productName: "소금빵",
    brand: "KCC베이커리",
    expiration_daynum: "15",
    product_price: "2200",
    product_sell_status: "판매중",
  },
  {
    No: 4,
    productName: "카스테라",
    brand: "KCC베이커리",
    expiration_daynum: "45",
    product_price: "2500",
    product_sell_status: "판매중",
  },
  {
    No: 5,
    productName: "두바이 초콜릿 쿠키",
    brand: "KCC베이커리",
    expiration_daynum: "7",
    product_price: "4000",
    product_sell_status: "품절(재고없음)",
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
    { field: "No", headerName: "No", width: 120, minWidth: 60 },
    { field: "productName", headerName: "제품명", minWidth: 150 },
    { field: "brand", headerName: "브랜드", minWidth: 120 },
    { field: "expiration_daynum", headerName: "소비기한", minWidth: 110 },
    { field: "product_price", headerName: "가격", minWidth: 110 },
    { field: "product_sell_status", headerName: "판매상태", minWidth: 110 },
    {
      field: "action",
      headerName: "관리",
      width: 110,
      minWidth: 60,
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

        // '수정' 옵션 div 생성
        const $editDiv = $('<div class="edit-options">수정</div>');

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
            left: offset.left + $svg.outerWidth() / 2 - 35, // SVG의 중앙에 왼쪽으로 이동
            transform: "translateX(-50%)", // 가로 중앙 정3
          });

          // 'show' 클래스 토글
          $editDiv.toggleClass("show");
        });

        // '수정' 옵션 클릭 시 모달 열기
        $editDiv.on("click", function (e) {
          e.stopPropagation(); // 이벤트 버블링 방지

          // 모달 열기
          $("#productManagementModal").modal("show");

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

function createNewRowData() {
  var newData = {
    No: rowData.length + 1,
    productName: "",
    brand: "",
    expiration_daynum: "",
    product_price: "",
    product_sell_status: "",
    status: "",
  };
  return newData;
}

function onAddRow() {
  var newItem = createNewRowData();
  rowData.push(newItem);
  gridApi.applyTransaction({ add: [newItem] });
}

function onDeleteRow() {
  var selectedRows = gridApi.getSelectedRows();
  if (selectedRows.length > 0) {
    gridApi.applyTransaction({ remove: selectedRows });

    selectedRows.forEach((row) => {
      const index = rowData.findIndex((data) => data.No === row.No);
      if (index > -1) {
        rowData.splice(index, 1);
      }
    });
  } else {
    alert("삭제할 항목을 선택하세요.");
  }
}

/** 본문의 표에서 소비기한 뒤에는 '일'을 가격 뒤에는 '원'을 붙여주고 가격에서 세자리마다 ',' 붙여주는 function */
function updateCellValues() {
  // 소비기한 뒤에 '일' 추가
  const elements5n = document.querySelectorAll(
    ".ag-cell-value.ag-cell:nth-child(5n)",
  );
  elements5n.forEach(function (element) {
    element.innerHTML += "일";
  });

  // 가격 뒤에 '원' 붙여주고 세자리마다 ',' 추가
  const elements6n = document.querySelectorAll(
    ".ag-cell-value.ag-cell:nth-child(6n)",
  );
  elements6n.forEach(function (element) {
    // 현재 요소의 텍스트를 숫자로 변환
    let amount = parseInt(element.innerHTML, 10);

    // 숫자를 세 자리마다 쉼표를 추가하여 포맷하는 함수
    let formattedAmount = amount
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    // 포맷된 금액에 '원'을 추가
    element.innerHTML = formattedAmount + "원";
  });
}

$(function () {
  // 표에서 가격이나 소비기한을 뒤에 '일' '원' 붙여주기
  updateCellValues();

  // 동적으로 page-wrapper 클래스에 toggled 클래스명의 유무에 따라 position 변경
  // => 사이드바가 열리면 다른 요소가 보이지 않게끔 해줌
  setInterval(() => {
    let hasToggle = $(".page-wrapper").hasClass("toggled");
    if (window.innerWidth <= 1000 && hasToggle) {
      $(".page-wrapper").css("position", "relative");
    } else {
      $(".page-wrapper").css("position", "fixed");
    }
  }, 10);
});

/* 본문 표 영역 끝 */

/** 모달 영역 */
$(function () {
  $(".radio_input_area input").change(function () {
    $(this).attr("");
  });
});

// 문서 전체에 클릭 이벤트 바인딩하여 Popover 숨기기
$(document).on("click", function () {
  $(".edit-options").removeClass("show");
});

/** 모달 영역 끝 */
