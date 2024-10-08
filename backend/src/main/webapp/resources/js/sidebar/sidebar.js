// 페이지가 로드될 때 대시보드가 기본으로 선택되도록 설정
$(document).ready(function () {
  // 기본 대시보드를 선택된 상태로 활성화
  activateDefaultMenu("대시보드");

  // 현재 화면 크기에 따라 사이드바와 버튼 상태 설정
  handleResize();
});

// 사이드바 열기 버튼
$("#show-sidebar").click(function () {
  // 사이드바를 먼저 display: block;으로 설정
  $(".sidebar-wrapper").css("display", "block");

  // 슬라이드 애니메이션을 적용하여 사이드바가 열리도록 설정
  setTimeout(function () {
    $(".page-wrapper").addClass("toggled");

    // 1000px 이하일 때 스크롤을 막음
    if (window.innerWidth <= 1000) {
      $("body").css("overflow", "hidden"); // 스크롤 방지
    }
  }, 10); // 약간의 지연을 주어 애니메이션과 display가 자연스럽게 연결되도록

  // 열리면 열기 버튼을 숨기고 닫기 버튼을 보여줌
  $("#show-sidebar").hide();
  $("#close-sidebar").show();
});

// 사이드바 닫기 버튼
$("#close-sidebar").click(function () {
  // 슬라이드 애니메이션을 적용하여 사이드바가 닫히도록 설정
  $(".page-wrapper").removeClass("toggled");

  // 애니메이션이 끝난 후 사이드바를 display: none;으로 설정
  setTimeout(function () {
    $(".sidebar-wrapper").css("display", "none");

    // 스크롤 가능하게 복원
    $("body").css("overflow", "auto");
  }, 300); // 애니메이션 시간과 맞춰서 300ms 후에 숨김

  // 닫기 버튼을 숨기고 열기 버튼을 다시 보이게 함
  $("#show-sidebar").show();
  $("#close-sidebar").hide();
});

// 창 크기 변경 시 처리
$(window).resize(function () {
  handleResize();
});

// 사이드바와 버튼을 화면 크기에 맞게 조정하는 함수
function handleResize() {
  if (window.innerWidth <= 1000) {
    $(".page-wrapper").removeClass("toggled");
    $(".sidebar-wrapper").css("display", "none"); // 사이드바 숨기기
    $("#show-sidebar").show(); // 사이드바 열기 버튼 보이기
    $("#close-sidebar").hide(); // 사이드바 닫기 버튼 숨기기
    $("body").css("overflow", "auto"); // 스크롤 가능하게 복원
  } else {
    $(".page-wrapper").addClass("toggled");
    $(".sidebar-wrapper").css("display", "block"); // 사이드바 보이기
    $("#show-sidebar").hide(); // 사이드바 열기 버튼 숨기기
    $("#close-sidebar").hide(); // 사이드바 닫기 버튼 숨기기
    $("body").css("overflow", "auto"); // 스크롤 가능하게 복원
  }
}

// 드롭다운 메뉴 클릭 시 서브메뉴 열기/닫기 기능 추가
$(".sidebar-dropdown > a").click(function (e) {
  e.preventDefault();

  let $submenu = $(this).next(".sidebar-submenu");

  // 이미 열려있는 서브메뉴를 닫음
  if ($submenu.is(":visible")) {
    $submenu.slideUp(200);
    $(this).parent().removeClass("active");
  } else {
    // 다른 열려있는 서브메뉴 닫기
    $(".sidebar-submenu").slideUp(200);
    $(".sidebar-dropdown").removeClass("active");

    // 클릭한 메뉴의 서브메뉴를 열기
    $submenu.slideDown(200);
    $(this).parent().addClass("active");
  }
});

// submenu에 클릭 시 hover 스타일 유지 및 제거 함수
$(".sidebar-submenu > ul > li > a").click(function (e) {
  e.preventDefault();

  // 다른 모든 submenu에서 hover 클래스 제거
  $(".sidebar-submenu > ul > li > a").removeClass("active-hover");

  // 클릭된 submenu에만 hover 클래스 추가
  $(this).addClass("active-hover");
});

// 다른 sidebar-dropdown이나 span 클릭 시 hover 스타일 제거
$(".sidebar-dropdown > a, .sidebar-dropdown > a > span").click(function () {
  $(".sidebar-submenu > ul > li > a").removeClass("active-hover");
});

// 대분류 메뉴 및 서브메뉴 클릭 시 top-bar에 표시하는 함수
$(".sidebar-dropdown > a, .sidebar-submenu > ul > li > a").click(function () {
  // 클릭한 서브메뉴와 대분류 메뉴를 가져옴
  let subMenu = $(this).text().trim();
  let parentMenu = $(this)
    .closest(".sidebar-dropdown")
    .find("a span")
    .text()
    .trim();

  // breadcrumb 형식으로 top-bar에 텍스트 출력
  if ($(this).parents(".sidebar-submenu").length) {
    $("#breadcrumb").html(
      `<span class="parent-menu">${parentMenu}</span> <span class="separator">></span> <span class="sub-menu">${subMenu}</span>`,
    );
  } else {
    $("#breadcrumb").html(`<span class="parent-menu">${parentMenu}</span>`);
  }
});

// 기본으로 대시보드를 선택하는 함수
function activateDefaultMenu(defaultMenu) {
  $(".sidebar-dropdown > a span").each(function () {
    if ($(this).text().trim() === defaultMenu) {
      $(this).closest(".sidebar-dropdown").addClass("active");
      $(this).next(".sidebar-submenu").slideDown(200); // 서브메뉴가 있으면 열림
      // 기본 선택된 대시보드로 breadcrumb 설정
      $("#breadcrumb").html(`<span class="parent-menu">${defaultMenu}</span>`);
    }
  });
}
