class CustomLoadingOverlay  {
  eGui;

  init(params) {
    this.eGui = document.createElement('div');
    this.refresh(params);
  }

  getGui() {
    return this.eGui;
  }

  refresh(params) {
    this.eGui.innerHTML = `
    <div class="ag-overlay-loading-center" role="presentation">
      <div aria-label="Loading..." role="status" class="loader">
        <svg class="icon" viewBox="0 0 256 256">
          <line x1="128" y1="32" x2="128" y2="64" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"></line>
          <line x1="195.9" y1="60.1" x2="173.3" y2="82.7" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"></line>
          <line x1="224" y1="128" x2="192" y2="128" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"></line>
          <line x1="195.9" y1="195.9" x2="173.3" y2="173.3" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"></line>
          <line x1="128" y1="224" x2="128" y2="192" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"></line>
          <line x1="60.1" y1="195.9" x2="82.7" y2="173.3" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"></line>
          <line x1="32" y1="128" x2="64" y2="128" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"></line>
          <line x1="60.1" y1="60.1" x2="82.7" y2="82.7" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"></line>
        </svg>
        <span class="loading-text">Loading...</span>
      </div>
     </div>`;
  }
}

// ROW 데이터 정의
let rowData = [];
let defaultRowData = [];
let gridApi = null;
let gridOptions = null;
let firstRowLength;

async function getProductAll(searchCriteria = {}) {
  try {
    const response = await fetch("/master/product/list", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(searchCriteria)
    });

    gridApi.setGridOption("loading", true);
    let data = await response.json();
    data = data.map((item, index) => ({
      ...item,
      no : index+1
    }));


    rowData = data.map((item) => {
      item.expDaynum = item.expDaynum + '일';
      item.pdtPrice = parseInt(item.pdtPrice).toLocaleString("ko-KR") + ' 원';
      firstRowLength++;

      return item;
    })

    if(defaultRowData.length === 0){
      defaultRowData = data;
    }

    // gridApi가 존재할 경우 데이터 설정
    if (gridApi) {
      setTimeout(function() {
        gridApi.setGridOption("loading", false);
      }, 200)
      gridApi.paginationGoToFirstPage()
      gridApi.setGridOption("rowData", rowData); // 데이터 설정
      updateProductCount();
    } else {
      console.error("gridApi is not initialized.");
    }

  } catch (error) {
    console.error("Error fetching data:", error);
    rowData = [];
    gridApi.setGridOption("rowData", rowData); // 데이터 설정
    setTimeout(function() {
      gridApi.setGridOption("loading", false);
    }, 200)
    updateProductCount();
  }
}


function initializeGrid() {
  // 그리드 옵션 설정
  gridOptions = {
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
      { field: "no", headerName: "No", width: 80, minWidth: 60, cellStyle: {textAlign: 'center'} },
      { field: "brandNm", headerName: "브랜드", width: 180, minWidth: 120, cellStyle: {textAlign: 'center'} },
      { field: `pdtNm`, headerName: "제품명", width: 200, minWidth: 180 },
      {
        field: "expDaynum",
        headerName: "소비기한",
        width: 150,
        minWidth: 130,
        type: 'rightAligned'
      },
      {
        field: "pdtPrice",
        headerName: "가격",
        width: 150,
        minWidth: 110,
        type: 'rightAligned'
      },
      {
        field: "pdtSellSttsNm",
        headerName: "판매상태",
        width: 150,
        minWidth: 110,
        cellStyle: {textAlign: 'center'}
      },

      {
        headerName: "자세히보기",
        field: "more",
        width: 150,
        minWidth: 100,
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
          let pdtId = params.data.pdtId;
          const $editDiv = $(`<div class="edit-options" data-no="${pdtId}" data-bs-toggle="modal" data-bs-target="#productManagementModal">자세히보기</div>`);
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
            let pdtId = $(this).attr('data-no');
              $.ajax({
                url : `/master/product/${pdtId}`,
                method : 'POST',
                success : function (data) {
                  $('.modal-title').text('제품 상세보기/수정');
                  $('#submit').text('수정');
                  $('#productName').val(data.pdtNm);
                  $('input[type="hidden"]').val(data.pdtId);
                  $('#brandName').text(data.brandNm);
                  $('#expiration').val(data.expDaynum);
                  $('#price').val(data.pdtPrice.toLocaleString('ko-KR'));
                  let status = $('.radio_input_area input[name="pdtSellSttsCd"]');
                  $.each(status, function (index, item)  {
                    if(item.value === data.pdtSellSttsNm) {
                      item.checked = true;
                    }
                  })

                }
              })

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
    loadingOverlayComponent: CustomLoadingOverlay,
    loadingOverlayComponentParams: {
      loadingMessage: "One moment please...",
    }
  };

  // 그리드 초기화
  const gridDiv = document.querySelector("#myGrid");
  gridApi = agGrid.createGrid(gridDiv, gridOptions);

  getProductAll();
  updateProductCount();

}

document.addEventListener("DOMContentLoaded", initializeGrid);

// 체크리스트 카운트 업데이트 함수
function updateProductCount() {
  const productCount = document.querySelector(".product_count");
  productCount.textContent = gridApi.getDisplayedRowCount();
}

// 검색창에서 ENTER키 누를 때 검색창에 입력한 값이 wrapper의 span text 에 들어옴
function setupSearchInput() {
  $('.form-control').keyup(function (e) {
    if(e.keyCode === 13) {
      let text = $(this).val();
      $(this).parents('.wrapper').find('span').text(text);
      $(this).parents('.wrapper').removeClass('active');
    }
  })
}

/* 본문 헤더 영역 */
$(function () {
  /**
   * 초기화 버튼 클릭 시 모든 선택 초기화
   */
  $("#reset-selection-top").on("click", function () {

    // 자동완성 필드 초기화
    $(".container-fluid .wrapper").each(function () {
      const $wrapper = $(this);
      const instance = $wrapper.data("autocompleteInstance");
      if (instance) {
        let text = $(this).siblings('label').text() + ' 검색';
        instance.updateSelected(text);
      }
    });
  });

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
    brandNm: [
      "전체"
    ],
    modalBrandNm: [

    ],
    pdtNm: [
      "전체"
    ],
    pdtSellSttsNm: [
      "전체"
    ],
  };

  /**
   * autocompleteData에 옵션 목록 넣어두기
   */
  $.ajax({
    url : '/master/product/options',
    method : 'GET',
    async : false,
    success : function(data) {
      data.brandNmList.filter(x => {
        autocompleteData.brandNm.push(x);
      })
      data.brandNmList.filter(x => {
        autocompleteData.modalBrandNm.push(x);
      })
      data.pdtNmList.filter(x => {
        autocompleteData.pdtNm.push(x);
      })
      data.pdtSellSttsNmList.filter(x => {
        autocompleteData.pdtSellSttsNm.push(x)
      })
    }
  })

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





// 새로운 Row 생성 함수
function createNewRowData() {
  return {
    pdtNm: "",
    brandNm: "",
    expDaynum: "",
    pdtPrice: "",
    pdtSellSttsNm: ""
  };
}


// Row 추가 함수
function onProductAddRow() {
  gridApi.paginationGoToFirstPage()
  checkUnload = true;
  const newItem = createNewRowData();
  rowData.unshift(newItem);
  gridApi.applyTransaction({
    add: [newItem],
    addIndex: 0
  });
  updateProductCount();
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
function onProductDeleteRow() {
  const selectedRows = gridApi.getSelectedRows();

    if (selectedRows.length > 0) {
      // 경고 메시지 표시
      warningMessage().then((result) => {
        if (result.isConfirmed) { // 사용자가 삭제를 확인한 경우
          fetch('/master/product/delete', {
            method: 'PATCH',
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(selectedRows.map(row => ({ pdtId: row.pdtId })))
          }).then(response => {
            // 응답 상태 코드 확인
            if (!response.ok) {
              if (response.status === 403) {
                Swal.fire("실패!", "권한이 없습니다.", "error");
              }else if(response.status === 409){
                Swal.fire("실패!", "사용중인 점검계획이 있습니다.", "error");
              }
            } else {
              Swal.fire({
                title: "삭제 완료!",
                text: "완료되었습니다.",
                icon: "success",
                confirmButtonText: "OK"
              }).then((result) => {
                if(result.isConfirmed) {
                  location.href = "/master/product/manage";
                }
              });
              // 그리드에서도 해당 행 삭제
              gridApi.applyTransaction({ remove: selectedRows });

              selectedRows.forEach((row) => {
                const index = rowData.findIndex((data) => data.pdtId === row.pdtId);
                if (index > -1) {
                  rowData.splice(index, 1);
                }
              });
              updateProductCount();
            }
          })
        }
      });
    } else {
      Swal.fire("실패!", "삭제할 항목을 선택해주세요", "error");
    }
}


$(function () {
  setupSearchInput();

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

  // 가맹점 추가 버튼 누르고 저장 안했을 경우 생선된 ROW 삭제
  $('.modal-content .button-close').click(function () {
    const itemsWithoutNo = rowData.filter(item => !Object.keys(item).includes('no'));
    gridApi.applyTransaction({ remove: itemsWithoutNo });
  })

  // 추가 버튼 누를 때 모달에서 입력 문구 띄우기
  $('#addRowBtn').click(function () {
    $('.modal-title').text('제품 등록')
    $('#submit').text('등록');
    $('#productName').attr('placeholder', '제품명 입력');
    $('#brandName').text( '브랜드 선택');
    $('#expiration').attr('placeholder', '소비기한 입력');
    $('#price').attr('placeholder', '가격 입력');
    $('#for_sale').prop('checked', true);
  })


});
/* 본문 표 영역 끝 */

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

