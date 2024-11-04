// ROW 데이터 정의
let rowData = [];
let defaultRowData = [];
let gridApi = null;
let gridOptions = null;
let firstRowLength;

async function getStoreAll(searchCriteria = {}) {
  try {
    const response = await fetch("/master/store/list", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(searchCriteria)
    });

    let data = await response.json();
    data = data.map((item, index) => ({
      ...item,
      no : index+1
    }));

    rowData = data.map((item) => {
      item.openHm = item.openHm.slice(0,2) + ':' + item.openHm.slice(2);
      item.brn = item.brn.replace(item.brn.split('-')[2],'*****');
      item.ownNm = item.ownNm.replace(item.ownNm.split('')[1], '*');
      firstRowLength++;

      return item;
    })

    if(defaultRowData.length === 0){
      defaultRowData = data;
    }

    // gridApi가 존재할 경우 데이터 설정
    if (gridApi) {
      gridApi.setGridOption("rowData", rowData); // 데이터 설정
      updateStoreCount();
    } else {
      console.error("gridApi is not initialized.");
    }

  } catch (error) {
    console.error("Error fetching data:", error);
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
      { field: "no", headerName: "No", width: 80, minWidth: 60 },
      { field: `storeNm`, headerName: "가맹점", width: 150, minWidth: 130 },
      { field: "brandNm", headerName: "브랜드", width: 180, minWidth: 120 },
      {
        field: "brn",
        headerName: "사업자등록번호",
        width: 200,
        minWidth: 180,
      },
      {
        field: "openHm",
        headerName: "오픈 시간",
        width: 150,
        minWidth: 110,
      },
      {
        field: "ownNm",
        headerName: "점주명",
        width: 130,
        minWidth: 110,
      },
      {
        field: "svMbrNm",
        headerName: "SV",
        width: 130,
        minWidth: 110,
      },
      {
        field: "inspMbrNm",
        headerName: "점검자",
        width: 130,
        minWidth: 110,
      },
      {
        headerName: "자세히보기",
        field: "more",
        width: 150,
        minWidth: 110,
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

          let storeId = params.data.storeId;

          // '수정' 옵션 div 생성
          const $editDiv = $(`<div class="edit-options" data-no="${storeId}">수정</div>`);

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
            let storeId = $(this).attr('data-no');
            e.stopPropagation(); // 이벤트 버블링 방지
            // 모달 열기
            $("#DetailStore").modal("show");
            if(storeId === 'undefined') {
              $('.modal-body #storeName').attr('placeholder', "매장명 입력");
              $('.modal-body #brn').attr('placeholder', "사업자등록번호 입력 (e.g. 111-11-11111)");
              $('.modal-body .wrapper span').eq(0).text("브랜드 검색");
              $('#operationHours').val('');
              $('#storeAddress').attr('placeholder', "주소찾기 버튼을 클릭해주세요");
              $('#detailedAddress').attr('placeholder',"상세 주소 입력");
              $('.file_name').text("파일을 선택해주세요");
              $('#ownerName').attr('placeholder', "점주명 입력");
              $('#ownerPhone').attr('placeholder', "휴대폰 번호 입력 (e.g. 010-1111-1111)");
              $('.modal-body .wrapper span').eq(1).text("점검자 검색");
              $('.modal-body .wrapper span').eq(2).text("SV 검색");
              $('.modal-body').find('input[type="radio"]').prop("checked", false)


              // 'edit-options' 숨기기
              $editDiv.removeClass("show");
            } else {
              $.ajax({
                url : `/master/store/${storeId}`,
                method : 'POST',
                success : function (data) {
                  console.log(data);
                  $('input[type="hidden"]').val(data.storeId)
                  let openHm = data.openHm.slice(0,2) + ':' + data.openHm.slice(2);
                  $('.modal-body #storeName').attr('placeholder', data.storeNm);
                  $('.modal-body #brn').attr('placeholder', data.brn.replace(data.brn.split('-')[2],'*****'));
                  $('.modal-body .wrapper span').eq(0).text(data.brandNm);
                  $('#operationHours').val(openHm);
                  let address = splitAddress(data.storeAddr);
                  $('#storeAddress').attr('placeholder', address.address);
                  $('#detailedAddress').attr('placeholder', address.detailAddress);
                  $('.file_name').text(data.brdPath);
                  $('#deleteFile').val(data.brdPath);
                  $('#ownerName').attr('placeholder', data.ownNm.replace(data.ownNm.split('')[1],'*'));
                  $('#ownerPhone').attr('placeholder', data.ownTel.replace(data.ownTel.split('-')[2],'****'));
                  $('.modal-body .wrapper span').eq(1).text(data.inspMbrNm+'('+data.inspMbrNo+')');
                  $('.modal-body .wrapper span').eq(2).text(data.svMbrNm+'('+data.svMbrNo+')');
                  let status = $('.modal-body').find('input[type="radio"]');
                  $.each(status, function (index, item) {
                    if(item.value === data.storeBsnSttsNm) {
                      item.checked = true;
                    }
                  })
                  setTimeout(function () {
                    searchAddressToCoordinate(address.address);
                  }, 1000)
                }
              })
            }




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
  };

  // 그리드 초기화
  const gridDiv = document.querySelector("#myGrid");
  gridApi = agGrid.createGrid(gridDiv, gridOptions);

  getStoreAll();
  updateStoreCount();

}


function splitAddress(address) {
  const regex = /^([ㄱ-ㅎ가-힣]+)\s([ㄱ-ㅎ-가-힣]+)\s([ㄱ-ㅎ-가-힣-0-9]+)\s([ㄱ-ㅎ-가-힣-0-9]+(-[ㄱ-ㅎ가-힣0-9]+)?)\s*(.*)$/;

  const match = address.match(regex);

  if(match) {
    let address = match.slice(1,5).join(' ');
    let detailAddress = match[6]
    if(detailAddress === 'undefined') {
      detailAddress = null;
    }
    return {
      address : address,
      detailAddress :detailAddress
    };
  }
}

document.addEventListener("DOMContentLoaded", initializeGrid);

// 체크리스트 카운트 업데이트 함수
function updateStoreCount() {
  const storeCount = document.querySelector(".store_count");
  storeCount.textContent = gridApi.getDisplayedRowCount();
}


// 새로운 Row 생성 함수
function createNewRowData() {
  return {
    no: rowData.length+1,
    storeNm: "",
    brandNm: "",
    brn: "",
    openHm : "",
    ownNm : "",
    svMbrNm : "",
    inspMbrNm : ""
  };
}


// Row 추가 함수
function onStoreAddRow() {
  checkUnload = true;
  const newItem = createNewRowData();
  rowData.unshift(newItem);
  gridApi.applyTransaction({
    add: [newItem],
    addIndex: 0
  });
  updateStoreCount();
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
function onStoreDeleteRow() {
  const selectedRows = gridApi.getSelectedRows();
  console.log(selectedRows);
  if (selectedRows.length > 0) {
    // 경고 메시지 표시
    warningMessage().then((result) => {
      if (result.isConfirmed) { // 사용자가 삭제를 확인한 경우
        fetch('/master/store/delete', {
          method: 'PATCH',
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(selectedRows.map(row => ({ storeId: row.storeId })))
        }).then(response => {
          // 응답 상태 코드 확인
          if (!response.ok) {
            if (response.status === 403) {
              Swal.fire("실패!", "권한이 없습니다.", "error");
            }
          } else {
            Swal.fire({
              title: "삭제 완료!",
              text: "완료되었습니다.",
              icon: "success",
              confirmButtonText: "OK"
            });
            // 그리드에서도 해당 행 삭제
            gridApi.applyTransaction({ remove: selectedRows });

            selectedRows.forEach((row) => {
              const index = rowData.findIndex((data) => data.storeId === row.storeId);
              if (index > -1) {
                rowData.splice(index, 1);
              }
            });
            updateStoreCount();
          }
        })
      }
    });
  } else {
    alert("삭제할 항목을 선택하세요.");
  }
}

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

  // 각 자동완성 필드에 대한 데이터 목록 정의
  /**
   * @todo responseBody로 받아올것이라면 여기서 Ajax로 데이터를 요청하면 됨
   *
   */
  const autocompleteData = {
    storeNm: [
      "전체"
    ],

    brandNm: [
        "전체"
    ],

    inspector : [
        "전체"
    ],

    inspectorModal: [],

    brandNmModal: [],

    svModal: []
  };

  /**
   * autocompleteData에 옵션 목록 넣어두기
   */
  $.ajax({
    url : '/master/store/options',
    method : 'GET',
    async : false,
    success : function(data) {
      data.storeNmList.filter(x => {
        autocompleteData.storeNm.push(x)
      })

      data.brandNmList.filter(x => {
        autocompleteData.brandNm.push(x);
      })

      data.brandNmList.filter(x => {
        autocompleteData.brandNmModal.push(x);
      })

      data.inspectorNmList.filter(x => {
        x = x.mbrNm + '(' + x.mbrNo + ')';
        autocompleteData.inspector.push(x);
      })

      data.inspectorNmList.filter(x => {
        x = x.mbrNm + '(' + x.mbrNo + ')';
        autocompleteData.inspectorModal.push(x);
      })

      data.svNmList.filter(x => {
        x = x.mbrNm + '(' + x.mbrNo + ')';
        autocompleteData.svModal.push(x);
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




  // 최상단 드롭 다운 버튼
  function toggleSearchBox() {
    const toggleButton = document.querySelector(".top-drop-down button"); // 버튼 선택
    const icon = toggleButton.querySelector("i"); // 아이콘 선택
    const searchSection = document.querySelector(
      ".top-box .bottom-box-content  ",
    ); // 검색 섹션 선택 --> 해당 부분은 접을 부분(custom)할 것

    // 초기 상태: 검색 섹션 닫힘
    let isOpen = false;

    // 초기 스타일 설정
    searchSection.style.maxHeight = "0";
    searchSection.style.overflow = "hidden"; // 내용 숨김

    // CSS 트랜지션을 추가하여 부드러운 애니메이션 효과
    searchSection.style.transition =
      "max-height 0.3s ease, transform 0.3s ease";

    // 버튼 클릭 이벤트 리스너
    toggleButton.addEventListener("click", () => {
      isOpen = !isOpen; // 상태 토글

      if (isOpen) {
        searchSection.style.maxHeight = `${searchSection.scrollHeight}px`; // 자연스럽게 열기
        searchSection.style.maxHeight = `${searchSection.scrollHeight}px`; // 자연스럽게 열기
        icon.style.transform = "rotate(-90deg)"; // 아이콘 180도 회전
      } else {
        searchSection.style.maxHeight = "0"; // 높이를 0으로 줄여서 닫기
        icon.style.transform = "rotate(0deg)"; // 아이콘 원래 상태로

        // 애니메이션이 끝나면 overflow를 hidden으로 설정
        searchSection.addEventListener(
          "transitionend",
          () => {
            if (!isOpen) searchSection.style.overflow = "hidden";
          },
          { once: true }, // 이벤트가 한 번만 실행되도록 설정
        );
      }
    });
  }

  // 함수 호출
  toggleSearchBox();

  // 문서 전체에 클릭 이벤트 바인딩하여 Popover 숨기기
  $(document).on("click", function () {
    $(".edit-options").removeClass("show");
  });

  //  중간 테이블 영역 끝
});


