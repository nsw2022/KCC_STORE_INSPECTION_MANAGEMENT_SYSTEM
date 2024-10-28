// 전역 변수로 rowData와 gridApi 선언
let rowData = [];
let defaultRowData = [];
let gridApi = null;
let gridOptions = null;
let selectedRowNo = 0;
let firstRowLength = 0;
// 체크리스트 데이터를 서버에서 받아오는 함수
async function getChecklistAll(searchCriteria = {}) {
  try {
    const response = await fetch("/master/checklist/list", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(searchCriteria)
    });

    const data = await response.json();
    console.log(data);

    if(defaultRowData.length === 0){
      defaultRowData = data;
      console.log(defaultRowData)
    }
    // rowData에 데이터를 할당
    rowData = data.map((item) => {
      firstRowLength++;
      item.is_master_checklist = item.masterChklstNm === null ? 'N' : 'Y';
      return item;
    });

    // gridApi가 존재할 경우 데이터 설정
    if (gridApi) {
      gridApi.setGridOption("rowData", rowData); // 데이터 설정
      updateChecklistCount();
    } else {
      console.error("gridApi is not initialized.");
    }

  } catch (error) {
    console.error("Error fetching data:", error);
  }
}
function initializeGrid() {
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
      { field: "chklstId", headerName: "No", width: 80, minWidth: 50 },
      { field: "brandNm", headerName: "브랜드", minWidth: 110 },
      { field: "chklstNm", headerName: "체크리스트명", minWidth: 110 },
      { field: "masterChklstNm", headerName: "마스터 체크리스트", minWidth: 110 },
      { field: "inspTypeNm", headerName: "점검유형", minWidth: 110 },
      { field: "creTm", headerName: "등록일", minWidth: 110 },
      { field: "is_master_checklist", headerName: "마스터 체크리스트 여부", minWidth: 70 },
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

            location.href = `/master/inspection-list-manage/${gridApi.getSelectedRows()[0].chklstId}`;
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
    onRowSelected: (event) => {
      const selectedRows = gridApi.getSelectedRows();

      if (selectedRows.length === 1 && event.node.isSelected()) {
        // 선택된 행만 업데이트를 진행합니다.
        const selectedNode = event.node; // 선택된 노드를 가져옴
        selectedRowNo = selectedNode.rowIndex; // 선택된 행의 인덱스를 저장
        console.log("선택된 행 번호: ", selectedRowNo);

        $(".brandPlaceholder").text(selectedRows[0].brandNm);
        $(".checklistPlaceholder").text(selectedRows[0].chklstNm);
        $(".masterChecklistPlaceholder").text(selectedRows[0].masterChklstNm);
        $(".inspectionTypePlaceholder").text(selectedRows[0].inspTypeNm);

        enableElementSearchBtn(); // 검색 버튼 활성화
      } else if (!event.node.isSelected() && event.node.rowIndex === selectedRowNo) {
        // 행이 선택 해제될 때 선택된 행 번호를 초기화합니다.
        selectedRowNo = null;
        disableSearchBtn(); // 검색 버튼 비활성화
      }
    },
  };
  // 그리드 API 생성 및 설정
  const gridDiv = document.querySelector("#myGrid");
  gridApi = agGrid.createGrid(gridDiv, gridOptions);

  // 초기 데이터 로드
  getChecklistAll();
  updateChecklistCount();


}
document.addEventListener("DOMContentLoaded", initializeGrid);
// 비활성화 함수
function disableSearchBtn() {
  $('.bottom-wrapper').addClass('disabled');
}

// 활성화 함수
function enableElementSearchBtn() {
  $('.bottom-wrapper').removeClass('disabled');
}

// 비활성화 함수 호출
disableSearchBtn();


// 체크리스트 카운트 업데이트 함수
function updateChecklistCount() {
  const checklistCount = document.querySelector(".checklist_count");
  checklistCount.textContent = gridApi.getDisplayedRowCount();
}

// 새로운 Row 생성 함수
function createNewRowData() {
  let today = new Date();
  let formattedDate = today
      .toLocaleDateString()
      .replace(/\s+/g, "")
      .replace(/\./g, ".");

  return {
    chklstId: null,
    brandNm: "",
    chklstNm: "",
    masterChklstNm: "",
    inspTypeNm: "",
    creTm: formattedDate.substring(0, 10),
    is_master_checklist: "N",
    chklstUseW: "N",
  };
}


// Row 추가 함수
function onChecklistAddRow() {
  checkUnload = true;
  const newItem = createNewRowData();
  rowData.unshift(newItem);
  gridApi.applyTransaction({
    add: [newItem],
    addIndex: 0
  });
  updateChecklistCount();
}
function warningMessage() {
  return Swal.fire({
    title: "경고!",
    text: "이 작업은 되돌릴 수 없습니다.",
    icon: "warning",
    showCancelButton: true, // 취소 버튼 표시
    cancelButtonText: "취소",
    confirmButtonText: "삭제",
  });
}

// Row 삭제 함수
function onChecklistDeleteRow() {
  const selectedRows = gridApi.getSelectedRows();

  if (selectedRows.length > 0) {
    // 경고 메시지 표시
    warningMessage().then((result) => {
      if (result.isConfirmed) { // 사용자가 삭제를 확인한 경우
        fetch(`/master/checklist/delete`, {
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
            }else if(response.status === 409){
              Swal.fire("실패!", "사용중인 점검계획이 있습니다.", "error");
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
            updateChecklistCount();
          }
        })
      }
    });
  } else {
    alert("삭제할 항목을 선택하세요.");
  }
}

// 체크리스트 저장 / 수정 기능
function confirmationDialog() {
  Swal.fire({
    title: "확인",
    html: "선택된 체크리스트를 저장하시겠습니까?<br><b>선택하지 않은 체크리스트는 저장되지 않습니다.</b>",
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
        Swal.fire("실패!", "체크리스트를 선택해주세요.", "error");
        return;
      }

      // 체크리스트를 서버에 저장하는 fetch 요청
      fetch("/master/checklist/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(selectedRows.map((row) => ({
          chklstId: row.chklstId,
          brandNm: row.brandNm,
          chklstNm: row.chklstNm,
          masterChklstNm: row.masterChklstNm,
          chklstUseW: row.chklstUseW,
          inspTypeNm: row.inspTypeNm,
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
            return response.json(); // 성공적으로 응답을 받았으면 데이터를 JSON으로 변환
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
                location.href = "/master/checklist";
              }
            });
          })
    }
  });
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
    // 점검 유형
    INSP: ["-전체-"],
    // 체크리스트
    CHKLST: ["-전체-"],
    // 브랜드
    BRAND: ["-전체-"],
    // 마스터 체크리스트
    MASTER_CHKLST: ["-전체-"],
    // 상태
    STATUS: ["-전체-", "Y", "N"],
    // 택1 브랜드
    BRAND1: [],
    // 택1 체크리스트
    CHKLST1: [],
    // 택1 점검유형
    INSP1: [],
  };

  fetch("/master/checklist/options")
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        // 받아온 데이터로 autocompleteData 업데이트
        autocompleteData.BRAND.push(...data.brandOptions);
        autocompleteData.BRAND1.push(...data.brandOptions);
        autocompleteData.INSP.push(...data.inspTypeOptions);
        autocompleteData.INSP1.push(...data.inspTypeOptions);
        autocompleteData.CHKLST.push(...data.checklistOptions);
        autocompleteData.CHKLST1.push(...data.checklistOptions);
        autocompleteData.MASTER_CHKLST.push(...data.checklistOptions);

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


// MutationObserver를 이용해 span의 텍스트 변화를 감지
function observeChanges(selector, callback) {
  const targetNode = document.querySelector(selector);
  if (!targetNode) return;

  const observer = new MutationObserver(function(mutationsList) {
    for (let mutation of mutationsList) {
      if (mutation.type === 'childList' || mutation.type === 'characterData') {
        callback(mutation.target.textContent);
      }
    }
  });

  observer.observe(targetNode, { childList: true, characterData: true, subtree: true });
}

// span 요소들의 변화 감지
observeChanges(".brandPlaceholder", function(newText) {
  if (selectedRowNo !== null) {
    checkUnload = true;
    $('.save-btn').removeAttr("disabled");
    rowData[selectedRowNo].brandNm = newText;
    gridApi.applyTransaction({
      update: [rowData[selectedRowNo]]
    });
  }
});
observeChanges(".checklistPlaceholder", function(newText) {
  if (selectedRowNo !== null) {
    checkUnload = true;
    $('.save-btn').removeAttr("disabled");
    rowData[selectedRowNo].chklstNm = newText;
    gridApi.applyTransaction({
      update: [rowData[selectedRowNo]]
    });
  }
});
observeChanges(".masterChecklistPlaceholder", function(newText) {
  if (selectedRowNo !== null) {
    checkUnload = true;
    $('.save-btn').removeAttr("disabled");
    rowData[selectedRowNo].masterChklstNm = newText;
    gridApi.applyTransaction({
      update: [rowData[selectedRowNo]]
    });
  }
});
observeChanges(".inspectionTypePlaceholder", function(newText) {
  if (selectedRowNo !== null) {
    checkUnload = true;
    $('.save-btn').removeAttr("disabled");
    rowData[selectedRowNo].inspTypeNm = newText;
    gridApi.applyTransaction({
      update: [rowData[selectedRowNo]]
    });
  }
});

// 페이지를 벗어날 때 알림을 띄움
$(window).on("beforeunload", function() {
  if (checkUnload) return '이 페이지를 벗어나면 작성된 내용은 저장되지 않습니다.';
});


$('.edit-container').click(function(e) {
  console.log("clicked");
});

$('.bi').click(function(e) {
  console.log("clicked");
});