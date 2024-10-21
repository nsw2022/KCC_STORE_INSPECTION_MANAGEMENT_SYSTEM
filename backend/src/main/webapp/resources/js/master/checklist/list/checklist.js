// 전역 변수로 rowData와 gridApi 선언
let rowData = [];
let gridApi = null;
let gridOptions = null;

async function loadData() {
  try {
    const response = await fetch("https://localhost:8081/master/checklist/list");
    const data = await response.json();

    // rowData에 데이터를 할당
    rowData = data.map((item) => {
      if (item.masterChklstNm === null) {
        item.is_master_checklist = 'N';
      } else {
        item.is_master_checklist = 'Y';
      }
      return item;
    });

    // 그리드 설정 객체
    gridOptions = {
      rowData: rowData,
      columnDefs: [
        {
          minWidth: 45,
          width: 70,
          headerCheckboxSelection: true,
          checkboxSelection: true,
          resizable: true,
          cellStyle: { backgroundColor: "#ffffff" },
        },
        { field: "chklstId", headerName: "no", width: 80, minWidth: 50 },
        { field: "brandNm", headerName: "브랜드", minWidth: 110 },
        { field: "chklstNm", headerName: "체크리스트명", minWidth: 110 },
        { field: "masterChklstNm", headerName: "마스터 체크리스트", minWidth: 110 },
        { field: "inspTypeNm", headerName: "점검유형", minWidth: 110 },
        { field: "creTm", headerName: "등록일", minWidth: 110 },
        { field: "is_master_checklist", headerName: "마스터 체크리스 여부", minWidth: 70 },
        { field: "chklstUseW", headerName: "사용여부", minWidth: 70 },
        {
          field: "action",
          headerName: "관리",
          width: 100,
          minWidth: 53,
          pinned: "right",
          cellRenderer: function (params) {
            const $container = $("<div>", {
              class: "edit-container",
              css: { position: "relative", cursor: "pointer" },
            });

            const $svg = $(`
              <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="currentColor" class="bi bi-three-dots-vertical" viewBox="0 0 15 15">
                <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0"/>
              </svg>
            `);

            const $editDiv = $('<div class="edit-options">점검 항목 관리</div>');

            $svg.on("click", function (e) {
              e.stopPropagation();
              $(".edit-options").not($editDiv).removeClass("show");

              const offset = $svg.offset();
              const svgHeight = $svg.outerHeight();
              $editDiv.css({
                top: offset.top + svgHeight + 2,
                left: offset.left + $svg.outerWidth() / 2 - 43,
                transform: "translateX(-50%)",
              });

              $editDiv.toggleClass("show");
            });

            $editDiv.on("click", function (e) {
              e.stopPropagation();
              location.href = "/master/inspection/list/manage";
              $editDiv.removeClass("show");
            });

            $container.append($svg);
            $("body").append($editDiv);

            return $container[0];
          },
          autoHeight: true,
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
      onCellClicked: (params) => {
        console.log("cell was clicked", params);
      },
    };

    // 그리드 API 생성 및 설정
    const gridDiv = document.querySelector("#myGrid");
    gridApi = agGrid.createGrid(gridDiv, gridOptions);

    // 체크리스트 카운트 업데이트 함수 호출
    updateChecklistCount();

  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

// 데이터 로딩 함수 호출
loadData();

// 체크리스트 카운트 업데이트 함수
function updateChecklistCount() {
  const checklistCount = document.querySelector(".checklist_count");
  checklistCount.textContent = rowData.length;
}

// 새로운 Row 생성 함수
function createNewRowData() {
  return {
    chklstId: rowData.length + 1,
    brandNm: "",
    chklstNm: "",
    masterChklstNm: "",
    inspTypeNm: "",
    creTm: "",
    is_master_checklist: "",
    chklstUseW: "",
  };
}

// Row 추가 함수
function onAddRow() {
  const newItem = createNewRowData();
  rowData.push(newItem);
  gridApi.applyTransaction({ add: [newItem] });
  updateChecklistCount();
}

// Row 삭제 함수
function onDeleteRow() {
  const selectedRows = gridApi.getSelectedRows();
  if (selectedRows.length > 0) {
    gridApi.applyTransaction({ remove: selectedRows });

    selectedRows.forEach((row) => {
      const index = rowData.findIndex((data) => data.chklstId === row.chklstId);
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
    store: ["-전체", "혜화점", "종로점", "청량리점", "안산점", "부평점", "용산점", "답십리점",],
    // 점검자
    inspector: ["-전체-", "노승우", "이지훈", "유재원", "원승언", "노승수"],
    // 점검 유형
    INSP: ["-전체-", "정기 점검", "제품 점검"],
    // 체크리스트
    CHKLST: ["-전체-", "KCC 크라상 위생 점검표", "KCC 카페 제품 점검표"],
    // 브랜드
    BRAND: ["-전체-", "KCC 크라상", "KCC 카페", "KCC 디저트"],
    // 마스터 체크리스트
    MASTER_CHKLST: ["-전체-", "품질점검체크리스트", "기획점검체크리스트"],

    STATUS: ["-전체-", "Y", "N"],
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


function toggleSearchBox() {
  const toggleButton = document.querySelector('.top-drop-down button'); // 버튼 선택
  const icon = toggleButton.querySelector('i'); // 아이콘 선택
  const searchSection = document.querySelector('.top-box .bottom-box-content'); // 검색 섹션 선택 --> 해당 부분은 접을 부분(custom)할 것

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