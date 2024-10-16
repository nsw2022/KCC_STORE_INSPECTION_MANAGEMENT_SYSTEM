$(function () {
  // https://www.youtube.com/watch?v=ORmnc-hLrYs
  // 알쓸신잡 느낌스 숨쉴거리 00:30~3:09 자스 쌈뽕하게 주석다는 법

  /**
     뼈대 구조
     <!-- Iconscout Link For Icons  해더에 넣기 -->
     <link
     rel="stylesheet"
     href="https://unicons.iconscout.com/release/v4.0.0/css/line.css"
     />

     <!-- 자동 완성 Wrapper -->
     <div class="wrapper" data-autocomplete="TYPE">
     <!-- Search Button -->
     <div class="search-btn top-search form-control">
     <span>여기가 클릭전 보여지는 문구</span>
     <i class="uil uil-angle-down"></i>
     </div>

     <!-- 검색 입력 및 옵션이 포함된 숨겨진 목록 -->
     <div class="hide-list">
     <div class="search">
     <input
     type="text"
     class="form-control top-search"
     id="INPUT_ID"
     placeholder="PLACEHOLDER TEXT"
     />
     <ul class="options"></ul>
     </div>
     </div>
     </div>

     */

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
          `<p style="margin-top: 10px;">찾으시는 항목이 없습니다.</p>`,
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

  // '전체 선택' 체크박스 클릭 시
  $("#checkAll").click(function () {
    // 모든 'checkItem' 체크박스에 대해 체크 상태를 'checkAll'과 동일하게 설정
    $(".checkItem").prop("checked", this.checked);
  });

  // 개별 체크박스가 클릭될 때
  $(".checkItem").click(function () {
    // 'checkItem' 체크박스 중 하나라도 해제되면 'checkAll' 체크박스 해제
    if ($(".checkItem:checked").length === $(".checkItem").length) {
      $("#checkAll").prop("checked", true);
    } else {
      $("#checkAll").prop("checked", false);
    }
  });

  // 모달안의 사업자등록증 함수
  // 모달안의 사업자등록증 함수
  function fileCus() {
    $(".file_cus input[type=file]").on("change", function () {
      const fileName = $(this).val().split("\\").pop();
      const fileDisplay = $(this).siblings(".file_display");
      const fileNameDisplay = fileDisplay.find(".file_name");
      const fileRemoveButton = fileDisplay.find(".file_remove");

      fileNameDisplay.text(fileName || "파일을 선택해주세요.");

      // 파일이 선택되면 'X' 버튼을 보여줍니다.
      if (fileName) {
        fileRemoveButton.show();
      } else {
        fileRemoveButton.hide();
      }
    });

    // 'X' 버튼 클릭 시 파일 입력 초기화
    $(".file_cus .file_remove").on("click", function (e) {
      e.preventDefault(); // 기본 동작 방지
      const fileDisplay = $(this).closest(".file_display");
      const fileInput = $(this).closest("label").find("input[type=file]");
      const fileNameDisplay = fileDisplay.find(".file_name");

      // 파일 입력 초기화
      fileInput.val("");
      // 파일명 표시 영역 초기화
      fileNameDisplay.text("파일을 선택해주세요.");
      // 'X' 버튼 숨기기
      $(this).hide();
    });
  }

  fileCus();

  // 중간테이블 영역 시작
  // ROW 데이터 정의
  const rowData = [
    {
      no: "01",
      store: "혜화점",
      brand: "KCC 크라상",
      BRN: "111-11-1234",
      OPEN: "10:30",
      OWN: "노승우",
      SV: "노승우",
      INSP: "노승우",
      more: "수정",
    },
    {
      no: "02",
      store: "동대문점",
      brand: "KCC 크라상",
      BRN: "111-11-1234",
      OPEN: "10:30",
      OWN: "노승우",
      SV: "노승우",
      INSP: "노승우",
      more: "수정",
    },
    {
      no: "03",
      store: "천호점",
      brand: "KCC 크라상",
      BRN: "111-11-1234",
      OPEN: "10:30",
      OWN: "이지훈",
      SV: "이지훈",
      INSP: "이지훈",
      more: "수정",
    },
    {
      no: "04",
      store: "건대입구점",
      brand: "KCC 카페",
      BRN: "111-11-1234",
      OPEN: "10:30",
      OWN: "이지훈",
      SV: "이지훈",
      INSP: "이지훈",
      more: "수정",
    },
    {
      no: "05",
      store: "명동점",
      brand: "KCC 카페",
      BRN: "111-11-1234",
      OPEN: "10:30",
      OWN: "유재원",
      SV: "유재원",
      INSP: "유재원",
      more: "수정",
    },
    {
      no: "06",
      store: "수유점",
      brand: "KCC 카페",
      BRN: "111-11-1234",
      OPEN: "10:30",
      OWN: "유재원",
      SV: "유재원",
      INSP: "유재원",
      more: "수정",
    },
    {
      no: "07",
      store: "청량리점",
      brand: "KCC 카페",
      BRN: "111-11-1234",
      OPEN: "10:30",
      OWN: "원승언",
      SV: "원승언",
      INSP: "원승언",
      more: "수정",
    },
    {
      no: "08",
      store: "왕십리점",
      brand: "KCC 디저트",
      BRN: "111-11-1234",
      OPEN: "10:30",
      OWN: "원승언",
      SV: "원승언",
      INSP: "원승언",
      more: "수정",
    },
  ];

  // 통합 설정 객체
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
        field: "BRN",
        headerName: "사업자등록번호",
        width: 150,
        minWidth: 110,
      },
      {
        field: "OPEN",
        headerName: "오픈시간",
        width: 150,
        minWidth: 110,
      },
      { field: "OWN", headerName: "점주명", width: 150, minWidth: 110 },
      { field: "SV", headerName: "SV", width: 150, minWidth: 110 },
      { field: "INSP", headerName: "점검자", width: 150, minWidth: 110 },
      {
        headerName: "관리",
        field: "more",
        width: 150,
        minWidth: 120,
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
              left: offset.left + $svg.outerWidth() / 2 - 25, // SVG의 중앙에서 10px 왼쪽으로 이동
              transform: "translateX(-50%)", // 가로 중앙 정렬
            });

            // 'show' 클래스 토글
            $editDiv.toggleClass("show");
          });

          // '수정' 옵션 클릭 시 모달 열기
          $editDiv.on("click", function (e) {
            e.stopPropagation(); // 이벤트 버블링 방지

            // 모달 열기
            $("#DetailStore").modal("show");

            // 'edit-options' 숨기기
            $editDiv.removeClass("show");
          });

          // 컨테이너에 SVG 추가
          $container.append($svg);

          // 'edit-options'를 body에 추가
          $("body").append($editDiv);

          return $container[0]; // DOM 요소 반환
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

  const gridDiv = document.querySelector("#myGrid");
  const gridApi = agGrid.createGrid(gridDiv, gridOptions);

  // 체크리스트 개수를 업데이트하는 함수
  function updateChecklistCount() {
    const checklistCount = document.querySelector(".checklist_count");
    if (checklistCount) {
      checklistCount.textContent = rowData.length; // 현재 rowData 길이를 업데이트
    }
  }

  // 처음 페이지 로드 시 checklist_count 값 설정
  updateChecklistCount();

  function createNewRowData() {
    var newData = {
      no: rowData.length + 1,
      store: "",
      brand: "",
      BRN: "",
      OPEN: "",
      OWN: "",
      SV: "",
      INSP: "",
      more: "",
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
      Swal.fire({
        title: "경고!",
        text: "삭제할 항목을 선택해주세요.",
        icon: "warning",
        confirmButtonText: "확인",
      });
    }
  }

  $("#addRowButton").on("click", function () {
    onAddRow();
  });

  $("#deleteRowButton").on("click", function () {
    onDeleteRow();
  });

  // 총 몇건
  $("#totalCount").text(rowData.length);

  // 문서 전체에 클릭 이벤트 바인딩하여 Popover 숨기기
  $(document).on("click", function () {
    $(".edit-options").removeClass("show");
  });

  //  중간 테이블 영역 끝
});
