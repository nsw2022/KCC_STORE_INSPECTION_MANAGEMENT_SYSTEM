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
});
