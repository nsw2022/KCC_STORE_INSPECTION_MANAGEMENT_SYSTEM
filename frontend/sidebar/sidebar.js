// 페이지가 로드될 때 대시보드가 기본으로 선택되도록 설정
$(document).ready(function() {
  // 기본 대시보드를 선택된 상태로 활성화
  activateDefaultMenu("대시보드");

  if (window.innerWidth > 768) {
    $("#show-sidebar").hide(); // 768px 이상에서는 열기 버튼 숨기기
    $("#close-sidebar").hide(); // 768px 이상에서는 닫기 버튼 숨기기
  } else {
    $("#show-sidebar").show(); // 768px 이하에서는 열기 버튼 보이기
    $("#close-sidebar").show(); // 768px 이하에서는 닫기 버튼 보이기
  }
});

// 사이드바 메뉴 토글 기능
$(".sidebar-dropdown > a").click(function() {
  $(".sidebar-submenu").slideUp(200);
  if (
    $(this).parent().hasClass("active")
  ) {
    $(".sidebar-dropdown").removeClass("active");
    $(this).parent().removeClass("active");
  } else {
    $(".sidebar-dropdown").removeClass("active");
    $(this).next(".sidebar-submenu").slideDown(200);
    $(this).parent().addClass("active");
  }
});

// 사이드바 닫기 버튼
$("#close-sidebar").click(function() {
  $(".page-wrapper").removeClass("toggled");
});

// 사이드바 열기 버튼
$("#show-sidebar").click(function() {
  $(".page-wrapper").addClass("toggled");
});

// 모바일 환경인지 체크
const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || window.innerWidth <= 768;

if (isMobile) {
  $(".page-wrapper").removeClass("toggled");
}

// 창 크기 변경 시 처리
$(window).resize(function() {
  if (window.innerWidth <= 768) {
    $(".page-wrapper").removeClass("toggled");
    $("#show-sidebar").show(); // 사이드바 열기 버튼 보이기
    $("#close-sidebar").show(); // 사이드바 닫기 버튼 보이기
  } else {
    $(".page-wrapper").addClass("toggled");
    $("#show-sidebar").hide(); // 사이드바 열기 버튼 숨기기
    $("#close-sidebar").hide(); // 사이드바 닫기 버튼 숨기기
  }
});

// submenu에 클릭 시 hover 스타일 유지 및 제거 함수
$(".sidebar-submenu > ul > li > a").click(function(e) {
  e.preventDefault();
  
  // 다른 모든 submenu에서 hover 클래스 제거
  $(".sidebar-submenu > ul > li > a").removeClass("active-hover");
  
  // 클릭된 submenu에만 hover 클래스 추가
  $(this).addClass("active-hover");
});

// 다른 sidebar-dropdown이나 span 클릭 시 hover 스타일 제거
$(".sidebar-dropdown > a, .sidebar-dropdown > a > span").click(function() {
  $(".sidebar-submenu > ul > li > a").removeClass("active-hover");
});

// 대분류 메뉴 및 서브메뉴 클릭 시 top-bar에 표시하는 함수
$(".sidebar-dropdown > a, .sidebar-submenu > ul > li > a").click(function() {
  // 클릭한 서브메뉴와 대분류 메뉴를 가져옴
  let subMenu = $(this).text().trim();
  let parentMenu = $(this).closest(".sidebar-dropdown").find("a span").text().trim();

  // breadcrumb 형식으로 top-bar에 텍스트 출력
  if ($(this).parents('.sidebar-submenu').length) {
      $("#breadcrumb").html(`<span class="parent-menu">${parentMenu}</span> <span class="separator">></span> <span class="sub-menu">${subMenu}</span>`);
  } else {
      $("#breadcrumb").html(`<span class="parent-menu">${parentMenu}</span>`);
  }
});

// 기본으로 대시보드를 선택하는 함수
function activateDefaultMenu(defaultMenu) {
  $(".sidebar-dropdown > a span").each(function() {
    if ($(this).text().trim() === defaultMenu) {
      $(this).closest(".sidebar-dropdown").addClass("active");
      $(this).next(".sidebar-submenu").slideDown(200); // 서브메뉴가 있으면 열림
      // 기본 선택된 대시보드로 breadcrumb 설정
      $("#breadcrumb").html(`<span class="parent-menu">${defaultMenu}</span>`);
    }
  });
}
