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

  // 빈도 관련 데이터 및 함수
  /**
   *
   * @type {{daily: Array, weekly: Array, monthly: Array,  none: string[]}}
   * @description daily 매일마다  weekly 매주마다 monthly 매월마다 none은 값 안고름
   */
  const frequencyOptions = {
    daily: generateOptions("매일마다", 50, "일마다"),
    weekly: generateOptions("매주마다", 50, "주마다"),
    monthly: generateOptions("매달마다", 12, "개월마다"),
    none: ["없음"],
  };

  /**
   * 옵션 생성 함수
   * @param {string} prefix - 빈도별 횟수의 맨처음 들어갈 말 e.g) '일마다', '주마다', '개월마다'
   * @param {number} max - 생성할 조건의 최대 숫자
   * @param {string} suffix - 횟수의 숫자 뒤에 붙을 말들 e.g) 빈도가 월이면 '개월마다'
   * @returns {Array} - 생성된 옵션 배열
   */
  function generateOptions(prefix, max, suffix) {
    const options = [];
    for (let i = 1; i <= max; i++) {
      if (i === 1) {
        options.push(`${prefix}`);
      } else {
        options.push(`${i}${suffix}`);
      }
    }
    return options;
  }

  /**
   * 초기화 시 횟수 select 박스 설정
   */
  function initializeCountSelect() {
    const selectedFrequency = $("#frequency").val();
    updateCountOptions(selectedFrequency);
  }

  /**
   * 횟수 옵션을 업데이트하는 함수
   * @param {string} frequency - 선택된 빈도 유형
   */
  function updateCountOptions(frequency) {
    const countSelect = $("#count");
    countSelect.empty(); //  기존 옵션 제거
    $("#bottomScheduleDate").val("none");
    if (frequencyOptions[frequency]) {
      frequencyOptions[frequency].forEach((option) => {
        countSelect.append(`<option value="${option}">${option}</option>`);
      });
    } else {
      countSelect.append(`<option value="없음">없음</option>`);
    }

    // '없음'일 경우 횟수 선택 박스 비활성화
    if (frequency === "none") {
      countSelect.prop("disabled", true);
    } else {
      countSelect.prop("disabled", false);
    }

    // 빈도에 따른 추가적인 UI 생성
    generateFrequencySpecificUI(frequency);
  }

  /**
   * 빈도에 따라 추가적인 UI 요소를 생성하는 함수
   * @param {string} frequency - 선택된 빈도 값입니다.
   */
  function generateFrequencySpecificUI(frequency) {
    // 동적으로 생성될 요소를 넣을 영역의 ID
    const dynamicButtonsContainer = $("#dynamic-buttons");

    // 기존 요소 제거
    dynamicButtonsContainer.empty();

    if (frequency === "monthly") {
      // 매달마다의 추가적인 UI (1~31, 매월 마지막 일)
      const buttonsHTML = `
            <div class="container g-0">
              <div class="row g-2">
                <!-- 버튼들 생성 -->
                ${generateMonthButtons(31)}
                <div class="col-12 mt-2">
                  <button class="btn btn-outline-secondary w-100" type="button" value="32" aria-pressed="false">
                    매월 마지막 일
                  </button>
                </div>
              </div>
            </div>
          `;
      dynamicButtonsContainer.append(buttonsHTML);
    } else if (frequency === "weekly") {
      // 매주마다의 추가적인 UI (요일 버튼들)
      const buttonsHTML = `
            <div class="container g-0">
              <div class="row g-2">
                ${generateWeekdayButtons()}
              </div>
            </div>
          `;
      dynamicButtonsContainer.append(buttonsHTML);
    }
    // 'daily'나 'none'에 대해서는 추가적인 UI를 원하지 않을 경우 생략
  }

  /**
   * 월별 선택 시 버튼들을 생성하는 함수
   * @param {number} count - 생성할 버튼의 개수.
   * @returns {string} - 생성된 버튼 HTML 문자열
   */
  function generateMonthButtons(count) {
    let buttonsHTML = "";
    for (let i = 1; i <= count; i++) {
      if (i <= 31) {
        // 일수에 맞게 버튼 생성
        buttonsHTML += `
              <div class="col-2 col-sm-3 col-md-2 col-lg-1 mb-2">
                <button class="btn btn-outline-primary w-100 d-flex justify-content-center" type="button" value="${i}" aria-pressed="${i === 1 ? "false" : "false"}">
                  ${i}
                </button>
              </div>
            `;
      }
    }

    return buttonsHTML;
  }

  /**
   * 주별 선택 시 요일 버튼들을 생성하는 함수
   * @returns {string} - 생성된 요일 버튼 HTML 문자열
   */
  function generateWeekdayButtons() {
    const weekdays = ["월", "화", "수", "목", "금", "토", "일"];
    let buttonsHTML = "";
    weekdays.forEach((day, index) => {
      buttonsHTML += `
            <div class="col-6 col-sm-4 col-md-3 col-lg-1 mb-2">
              <button class="btn btn-outline-secondary w-100" type="button" value="${index + 1}" aria-pressed="false">
                ${day}
              </button>
            </div>
          `;
    });
    return buttonsHTML;
  }

  // 선택된 날짜를 저장할 배열 (월별)
  let selectedDays = [];

  // 선택된 요일을 저장할 배열 (주별)
  let selectedWeekdays = [];

  // 커스텀 달력 관련 변수
  let selectedCalendarDates = [];
  // 버튼 클릭 시 active 클래스 및 aria-pressed 속성 토글 부트스트랩 색깔 변경
  $(document).on("click", "#dynamic-buttons button", function () {
    // 현재 빈도에 따라 동작
    const frequency = $("#frequency").val();

    if (frequency === "monthly") {
      const day = $(this).val();
      const isPressed = $(this).attr("aria-pressed") === "true";

      if (isPressed) {
        // 이미 선택된 경우 배열에서 제거
        selectedDays = selectedDays.filter(
          (selectedDay) => selectedDay !== day,
        );
      } else {
        // 선택되지 않은 경우 배열에 추가
        selectedDays.push(day);
      }

      // 버튼의 aria-pressed 상태 및 active 클래스 토글
      $(this).attr("aria-pressed", !isPressed);
      $(this).toggleClass("active");
    } else if (frequency === "weekly") {
      // 매주
      const weekday = $(this).val();
      const isPressed = $(this).attr("aria-pressed") === "true";

      if (isPressed) {
        // 이미 선택된 경우 배열에서 제거
        selectedWeekdays = selectedWeekdays.filter(
          (selectedDay) => selectedDay !== weekday,
        );
      } else {
        // 선택되지 않은 경우 배열에 추가
        selectedWeekdays.push(weekday);
      }

      // 버튼의 aria-pressed 상태 및 active 클래스 토글
      $(this).attr("aria-pressed", !isPressed);
      $(this).toggleClass("active");
    }
  });

  /**
   * 달력 함수 정의
   */
  function calender() {
    const $calendarBody = $(".calendar-body"); // 클래스 선택자로 변경
    const $monthSelectCalendar = $("#month-select-calendar");
    const $yearSelectCalendar = $("#year-select-calendar");
    const $customCalendarContainer = $("#custom-calendar-container");
    const $scheduleDateContainer = $("#schedule-date-container");
    const $selectedDatesContainer = $("#selected-dates-container");

    // 오늘 날짜 정보 가져오기
    const today = new Date();
    const todayYear = today.getFullYear();
    const todayMonth = today.getMonth(); // 0-based index
    const todayDate = today.getDate();

    // 현재 연도 설정
    const currentYear = todayYear;

    // 연도 선택 옵션 생성 (현재 연도부터 현재 연도 +5까지)
    const startYear = currentYear;
    const endYear = currentYear + 5;
    for (let year = startYear; year <= endYear; year++) {
      $yearSelectCalendar.append(new Option(year, year));
    }
    $yearSelectCalendar.val(currentYear); // 현재 연도를 기본값으로 설정

    // 월 선택을 현재 월로 설정
    $monthSelectCalendar.val(todayMonth);

    /**
     * 선택된 날짜를 카드로 추가하는 함수
     * @param {string} date - 'YYYY-MM-DD' 형식의 날짜
     */
    function addDateCard(date) {
      // 중복된 날짜는 추가하지 않음
      if (selectedCalendarDates.includes(date)) return;

      selectedCalendarDates.push(date);

      const cardHTML = `
            <div class="date-card">
              <span>${date}</span>
              <span class="remove-date">&times;</span>
            </div>
          `;
      $selectedDatesContainer.append(cardHTML);
    }

    /**
     * 날짜 카드를 제거하는 함수
     * @param {string} date - 'YYYY-MM-DD' 형식의 날짜
     */
    function removeDateCard(date) {
      selectedCalendarDates = selectedCalendarDates.filter((d) => d !== date);
      $selectedDatesContainer.find(`.date-card:contains('${date}')`).remove();
    }

    /**
     * 선택된 날짜 카드를 초기화하는 함수
     */
    function resetDateCards() {
      selectedCalendarDates = [];
      $selectedDatesContainer.empty();
      $calendarBody.find("td.selected").removeClass("selected");
    }

    /**
     * 선택된 날짜를 표시하는 카드에 이벤트 리스너 추가
     */
    $selectedDatesContainer.on("click", ".remove-date", function () {
      const dateText = $(this).siblings().first().text();
      removeDateCard(dateText);

      // 달력에서 해당 날짜의 선택 상태 해제
      $calendarBody.find(`td[data-date="${dateText}"]`).removeClass("selected");
    });

    /**
     * 달력 생성 함수
     */
    function generateCalendar(month, year) {
      // 달력 초기화
      $calendarBody.empty();

      // 첫 번째 날과 마지막 날짜 계산
      const firstDay = new Date(year, month, 1).getDay();
      const lastDate = new Date(year, month + 1, 0).getDate();

      let day = 1;
      let $row = $("<tr></tr>");

      // 월요일 시작으로 설정 (일요일을 0으로 간주)
      for (let i = 0; i < (firstDay === 0 ? 6 : firstDay - 1); i++) {
        $row.append($("<td></td>"));
      }

      // 첫 주 날짜 채우기
      for (
        let i = firstDay === 0 ? 6 : firstDay - 1;
        i < 7 && day <= lastDate;
        i++, day++
      ) {
        const $cell = $("<td></td>").text(day);
        const dateString = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`; // 'YYYY-MM-DD' 형식

        // 오늘 날짜인지 확인
        const isToday =
          day === todayDate && month === todayMonth && year === todayYear;

        // 오늘 이전 날짜인지 확인
        if (
          year < todayYear ||
          (year === todayYear && month < todayMonth) ||
          (year === todayYear && month === todayMonth && day < todayDate)
        ) {
          // 오늘 이전 날짜는 비활성화
          $cell.addClass("disabled");
        } else {
          // 선택된 날짜인지 확인
          if (selectedCalendarDates.includes(dateString)) {
            $cell.addClass("selected");
          }

          // 오늘 날짜에 특별한 스타일 적용
          if (isToday) {
            $cell.addClass("today");
          }

          // 클릭 이벤트 추가
          $cell.on("click", function () {
            if ($(this).hasClass("disabled")) return;

            if ($(this).hasClass("selected")) {
              $(this).removeClass("selected");
              removeDateCard(dateString);
            } else {
              $(this).addClass("selected");
              addDateCard(dateString);
            }
          });
        }

        // 데이터 속성 추가
        $cell.attr("data-date", dateString);

        $row.append($cell);
        day++;
      }

      $calendarBody.append($row);

      // 나머지 주 날짜 채우기
      while (day <= lastDate) {
        $row = $("<tr></tr>");
        for (let i = 0; i < 7 && day <= lastDate; i++, day++) {
          const $cell = $("<td></td>").text(day);
          const dateString = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`; // 'YYYY-MM-DD' 형식

          // 오늘 날짜인지 확인
          const isToday =
            day === todayDate && month === todayMonth && year === todayYear;

          // 오늘 이전 날짜인지 확인
          if (
            year < todayYear ||
            (year === todayYear && month < todayMonth) ||
            (year === todayYear && month === todayMonth && day < todayDate)
          ) {
            // 오늘 이전 날짜는 비활성화
            $cell.addClass("disabled");
          } else {
            // 선택된 날짜인지 확인
            if (selectedCalendarDates.includes(dateString)) {
              $cell.addClass("selected");
            }

            // 오늘 날짜에 특별한 스타일 적용
            if (isToday) {
              $cell.addClass("today");
            }

            // 클릭 이벤트 추가
            $cell.on("click", function () {
              if ($(this).hasClass("disabled")) return;

              if ($(this).hasClass("selected")) {
                $(this).removeClass("selected");
                removeDateCard(dateString);
              } else {
                $(this).addClass("selected");
                addDateCard(dateString);
              }
            });
          }

          // 데이터 속성 추가
          $cell.attr("data-date", dateString);

          $row.append($cell);
        }
        $calendarBody.append($row);
      }
    }

    /**
     * 월 및 연도 선택 시 달력 갱신 및 과거 월 비활성화
     */
    $("#month-select-calendar, #year-select-calendar").on(
      "change",
      function () {
        const selectedMonth = parseInt($("#month-select-calendar").val());
        const selectedYear = parseInt($("#year-select-calendar").val());
        generateCalendar(selectedMonth, selectedYear);
        disablePastMonthsAndYears();
      },
    );

    /**
     * 연도 및 월 선택 시 과거 월 비활성화 함수
     */
    function disablePastMonthsAndYears() {
      const selectedYear = parseInt($("#year-select-calendar").val());

      $("#month-select-calendar option").each(function () {
        const optionMonth = parseInt($(this).val());
        if (selectedYear === todayYear && optionMonth < todayMonth) {
          $(this).attr("disabled", true);
        } else {
          $(this).removeAttr("disabled");
        }
      });

      // 연도 선택 시 현재 연도 이전을 비활성화하려면 아래 주석 해제
      /*
                                    $("#year-select-calendar option").each(function () {
                                      const optionYear = parseInt($(this).val());
                                      if (optionYear < todayYear) {
                                        $(this).attr("disabled", true);
                                      } else {
                                        $(this).removeAttr("disabled");
                                      }
                                    });
                                    */
    }

    // 초기 달력 생성 (현재 월과 연도)
    const currentMonth = todayMonth; // 현재 월
    generateCalendar(currentMonth, currentYear);
    disablePastMonthsAndYears();
  }

  // 달력 함수 호출
  calender();

  /**
   * 초기화 버튼 클릭 시 모든 선택 초기화
   */
  $("#reset-selection-top").on("click", function () {
    // 점검 예정일
    $("#topScheduleDate").val("none");

    // 자동완성 필드 초기화
    $(".top-box-content .wrapper").each(function () {
      const $wrapper = $(this);
      const instance = $wrapper.data("autocompleteInstance");
      if (instance) {
        instance.updateSelected("선택 해 주세요.");
      }
    });
  });

  $("#reset-selection-bottom").on("click", function () {
    // 빈도 초기화
    $("#frequency").val("none");
    updateCountOptions("none");
    initializeUI();

    // 점검 예정일
    $("#bottomScheduleDate").val("none");

    // 자동완성 필드 초기화
    $(".bottom-box-content .wrapper").each(function () {
      const $wrapper = $(this);
      const instance = $wrapper.data("autocompleteInstance");
      if (instance) {
        instance.updateSelected("선택 해 주세요.");
      }
    });

    // 커스텀 달력 선택 초기화
    resetDateCards();

    // 횟수 초기화
    $("#count").val("없음");
  });

  /**
   * 초기화 시 점검 예정일 및 커스텀 달력 표시 상태 설정
   */
  function initializeUI() {
    const selectedFrequency = $("#frequency").val();
    if (selectedFrequency === "none" || selectedFrequency === "daily") {
      $("#schedule-date-container").hide();
      $("#input-schedule").hide();
      $("#custom-calendar-container").show();
    } else {
      $("#schedule-date-container").show();
      $("#input-schedule").show();
      $("#custom-calendar-container").hide();
    }
  }

  /**
   * 커스텀 달력 선택 초기화 함수
   */
  function resetDateCards() {
    selectedCalendarDates = [];
    $("#selected-dates-container").empty();
    $(".calendar-body td.selected").removeClass("selected");
  }

  /**
   * 페이지 로드 시 초기 UI 설정
   */
  initializeUI();

  /**
   * 빈도 선택 변경 시 UI 업데이트
   */
  $("#frequency").change(function () {
    const selectedFrequency = $(this).val();
    updateCountOptions(selectedFrequency);
    if (selectedFrequency === "none") {
      $("#schedule-date-container").hide();
      $("#input-schedule").hide();
      $("#custom-calendar-container").show();
    } else {
      $("#schedule-date-container").show();
      $("#input-schedule").show();
      $("#custom-calendar-container").hide();
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

  // 모달 영역 시작
  const $modal = $(".modal");

  // 이벤트 위임을 사용하여 동적으로 생성된 .modal_btn에 클릭 이벤트 핸들러 적용
  $(document).on("click", ".modal_btn", function (e) {
    e.preventDefault(); // 기본 동작 방지 (필요 시)
    e.stopPropagation(); // 이벤트 버블링 방지 (필요 시)
    $modal.show(); // 모달 표시
  });

  // 이벤트 위임을 사용하여 동적으로 생성된 .close_btn에 클릭 이벤트 핸들러 적용
  $(document).on("click", ".close_btn", function (e) {
    e.preventDefault(); // 기본 동작 방지 (필요 시)
    e.stopPropagation(); // 이벤트 버블링 방지 (필요 시)
    $modal.hide(); // 모달 숨기기
  });

  // 추가: 모달 외부 클릭 시 모달 닫기
  $(document).on("click", ".modal", function (e) {
    if ($(e.target).is(".modal")) {
      $modal.hide();
    }
  });

  // 추가: 모달 내 '취소' 버튼 클릭 시 모달 닫기
  $(document).on("click", ".modal-footer .btn-secondary", function (e) {
    e.preventDefault();
    $modal.hide();
  });

  // 모달 영역 끝

  // ROW 데이타 정의
  // ROW 데이터 정의
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
      {
        headerName: "",
        checkboxSelection: true,
        headerCheckboxSelection: true,
        width: 50,
        resizable: true,
        cellStyle: { backgroundColor: "#ffffff" },
      },
      { field: "no", headerName: "No", width: 80, minWidth: 50 },
      { field: "brand", headerName: "브랜드", minWidth: 110 },
      { field: "checklist_name", headerName: "체크리스트명", minWidth: 150 },
      {
        field: "master_checklist_name",
        headerName: "마스터 체크리스트",
        minWidth: 150,
      },
      { field: "inspection_type", headerName: "점검유형", minWidth: 110 },
      { field: "create_date", headerName: "등록년월", minWidth: 110 },
      { field: "status", headerName: "사용여부", minWidth: 70 },
      {
        headerName: "자세히보기",
        field: "more",
        minWidth: 120,
        cellRenderer: function (params) {
          const button = document.createElement("button");
          button.innerText = "자세히 보기";
          button.classList.add("modal_btn");
          button.classList.add("more");
          return button;
        },
      },
    ],
    autoSizeStrategy: {
      type: "fitGridWidth",
      defaultMinWidth: 10,
    },
    rowHeight: 50,
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

  //  중간 테이블 영역 끝
});
