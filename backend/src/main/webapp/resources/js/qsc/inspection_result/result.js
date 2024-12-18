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

async function getInspResultAll(searchCriteria = {}) {
  try {
    const response = await fetch("/qsc/inspection/result/list", {
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

    if(defaultRowData.length === 0){
      defaultRowData = data;
    }

    rowData = data.map((item) => {
      item.inspComplTm = item.inspComplTm.slice(0, 8).replace(/(\d{4})(\d{2})(\d{2})/g, '$1-$2-$3');

      firstRowLength++;
      return item;
    })
    // gridApi가 존재할 경우 데이터 설정
    if (gridApi) {
      setTimeout(function() {
        gridApi.setGridOption("loading", false);
      }, 200)
      gridApi.paginationGoToFirstPage();
      gridApi.setGridOption("rowData", rowData); // 데이터 설정
      updateResultCount();
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
  }
}


function initializeGrid() {
  // 그리드 옵션 설정
  gridOptions = {
    rowData: rowData,
    columnDefs: [
      { field: "no", headerName: "No", width: 80, minWidth: 60 , cellStyle: {textAlign: 'center'} },
      { field: "brandNm", headerName: "브랜드", width: 150, minWidth: 100 ,cellStyle: {textAlign: 'center'} },
      { field: `storeNm`, headerName: "가맹점", width: 150, minWidth: 160 },
      {
        field: "chklstNm",
        headerName: "체크리스트명",
        width: 150,
        minWidth: 130,
      },
      {
        field: "inspTypeNm",
        headerName: "점검유형",
        width: 150,
        minWidth: 110,
        cellStyle: {textAlign: 'center'}
      },
      {
        field: "inspComplTm",
        headerName: "점검완료일",
        width: 150,
        minWidth: 110,
        cellStyle: {textAlign: 'center'}
      },

      { field: "mbrNm", headerName: "점검자", width: 150, minWidth: 110, cellStyle: {textAlign: 'center'}  },
      {
        headerName: "자세히보기",
        field: "more",
        width: 150,
        minWidth: 90,
        cellRenderer: function (params) {
          // jQuery를 사용하여 컨테이너 div 생성
          const $container = $("<div>", {
            class: "edit-container",
            css: { position: "relative", cursor: "pointer" },
          });
          $('#input').prop('checked')
          // SVG 요소 생성
          const $svg = $(`
                        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="currentColor" class="bi bi-three-dots-vertical" viewBox="0 0 15 15">
                            <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0"/>
                        </svg>
                    `);

          // '자세히보기' 옵션 div 생성
          let insp_result_id = params.data.inspResultId;
          const $editDiv = $(`<div class="edit-options" data-no="${insp_result_id}">자세히보기</div>`);
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
            openPopup(params.data.inspResultId); // 팝업으로 데이터 전송 - 다른페이지에서는  $("#masterChecklistModal").modal("show");

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

  getInspResultAll();
  updateResultCount();

}

document.addEventListener("DOMContentLoaded", initializeGrid);

// 체크리스트 카운트 업데이트 함수
function updateResultCount() {
  const inspResultCount = document.querySelector(".insp_result_count");
  inspResultCount.textContent = gridApi.getDisplayedRowCount();
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


$(function () {
  // 엔터키치면 입력한 텍스트가 wrapper의 span에 들어감
  setupSearchInput();
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
    const $wrapper = $(selectedLi).closest(".wrapper");
    const instance = $wrapper.data("autocompleteInstance");
    if (instance) {
      instance.updateSelected(selectedText);
    }
  };

  // 각 자동완성 필드에 대한 데이터 목록 정의
  const autocompleteData = {

    // 가맹점
    store: ['전체'],

    // 점검자
    inspector: ['전체'],

    // 체크리스트
    CHKLST: ['전체'],
    
    // 체크리스트 점검유형
    INSPTYPENM : ['전체'],

    // 브랜드
    BRAND: ['전체']
  };

  $.ajax({
    url : '/qsc/inspection/result/options',
    method : 'GET',
    async : false,
    success : function (data) {
      data.brandNms.filter(brand => {
        autocompleteData.BRAND.push(brand);
      })

      data.storeNms.filter(store => {
        autocompleteData.store.push(store);
      })

      data.chklstNms.filter(chklst => {
        autocompleteData.CHKLST.push(chklst)
      });

      data.inspTypeNms.filter(inspType => {
        autocompleteData.INSPTYPENM.push(inspType)
      })

      data.inspectorNms.filter(inspector => {
        let inspectorNm = inspector.mbrNm + '(' + inspector.mbrNo + ')';
        autocompleteData.inspector.push(inspectorNm)
      })

    },
    error : function(xhr) {
      console.log(xhr.status);
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

  /**
   * 초기화 버튼 클릭 시 모든 선택 초기화
   */
  $("#re-selection-top").on("click", function () {
    // 점검 예정일 초기화
    $("#topScheduleDate").val("");

    // 자동완성 필드 초기화
    $(".top-box-content .wrapper").each(function () {
      const $wrapper = $(this);
      const instance = $wrapper.data("autocompleteInstance");
      if (instance) {
		let text = $(this).siblings('label').text() + ' 검색';
		
        instance.updateSelected(text);
      }
    });
  });

});

function openPopup(content) {
  // 팝업 페이지 URL 설정
  const popupUrl = "/qsc/popup/inspection/result"; // 팝업 페이지로 보낼 URL 설정

  // 현재 화면 크기 확인
  const screenWidth =
    window.innerWidth || document.documentElement.clientWidth || screen.width;
  const screenHeight =
    window.innerHeight ||
    document.documentElement.clientHeight ||
    screen.height;

  // 모바일 디바이스 확인 (가로 크기가 768px 이하인 경우)
  const isMobile = screenWidth <= 768;

  // 팝업 창 크기 설정 (화면의 90% 크기 또는 전체 크기)
  const popupWidth = isMobile ? screenWidth : screenWidth * 0.8;
  const popupHeight = isMobile ? screenHeight : screenHeight;

  // 팝업 창의 중앙 위치 계산 (모바일은 무시)
  const screenLeft = window.screenLeft || window.screenX;
  const screenTop = window.screenTop || window.screenY;
  const left = isMobile ? 0 : screenLeft + (screenWidth - popupWidth) / 2;
  const top = isMobile ? 0 : screenTop + (screenHeight - popupHeight) / 2;

  // 팝업 창 옵션 (위치 및 크기 포함)
  const popupOptions = `width=${popupWidth},height=${popupHeight},top=${top},left=${left},scrollbars=yes,resizable=yes`;

  // 팝업 창을 열기
  const popupWindow = window.open("", "_blank", popupOptions);

  // 팝업 창이 열렸는지 확인 후 폼을 팝업 창에서 제출
  if (popupWindow) {
    // 팝업 창에 form을 작성하여 POST 방식으로 데이터를 전송
    const form = popupWindow.document.createElement("form");
    form.method = "POST";
    form.action = popupUrl; // 팝업 창에서 처리할 URL

	
    // 필요한 데이터를 form에 추가 (필요에 따라 수정 가능)
    const input = popupWindow.document.createElement("input");
    input.type = "hidden";
    input.name = "inspectionContent";
    input.value = content; // content는 팝업으로 전송할 데이터

    form.appendChild(input);

    // form을 팝업창에 추가 후 제출
    popupWindow.document.body.appendChild(form);
    form.submit();
  } else {
    alert("팝업 차단이 발생했습니다. 팝업을 허용해 주세요.");
  }
}
// 문서 전체에 클릭 이벤트 바인딩하여 Popover 숨기기
$(document).on("click", function () {
  $(".edit-options").removeClass("show");
});

function toggleSearchBox() {
  const toggleButton = document.querySelector('.top-drop-down button'); // 버튼 선택
  const icon = toggleButton.querySelector('i'); // 아이콘 선택
  const searchSection = document.querySelector('.top-search-box'); // 검색 섹션 선택

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
      searchSection.style.maxHeight = '1000px'; // 자연스럽게 열기
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





