$(document).ready(function () {
  restoreActiveMenu(); // 저장된 메뉴와 breadcrumb 복원
  handleResize(); // 화면 크기 조정
});

// 사이드바 열기 버튼
$("#show-sidebar").click(function () {
  $(".sidebar-wrapper").css("display", "block");
  setTimeout(function () {
    $(".page-wrapper").addClass("toggled");
    if (window.innerWidth <= 1000) {
      $("body").css("overflow", "hidden");
    }
  }, 10);
  $("#show-sidebar").hide();
  $("#close-sidebar").show();
});

// 사이드바 닫기 버튼
$("#close-sidebar").click(function () {
  $(".page-wrapper").removeClass("toggled");
  setTimeout(function () {
    $(".sidebar-wrapper").css("display", "none");
    $("body").css("overflow", "auto");
  }, 300);
  $("#show-sidebar").show();
  $("#close-sidebar").hide();
});

// 창 크기 변경 시 처리
$(window).resize(function () {
  handleResize();
});

// 화면 크기에 맞게 사이드바와 버튼 조정
function handleResize() {
  if (window.innerWidth <= 1000) {
    $(".page-wrapper").removeClass("toggled");
    $(".sidebar-wrapper").css("display", "none");
    $("#show-sidebar").show();
    $("#close-sidebar").hide();
    $("body").css("overflow", "auto");
  } else {
    $(".page-wrapper").addClass("toggled");
    $(".sidebar-wrapper").css("display", "block");
    $("#show-sidebar").hide();
    $("#close-sidebar").hide();
    $("body").css("overflow", "auto");
  }
}

// 드롭다운 메뉴 클릭 시 서브메뉴 열기/닫기
$(".sidebar-dropdown > a").click(function (e) {
  e.preventDefault();
  let $submenu = $(this).next(".sidebar-submenu");

  if ($submenu.is(":visible")) {
    $submenu.slideUp(200);
    $(this).parent().removeClass("active");
  } else {
    $(".sidebar-submenu").slideUp(200);
    $(".sidebar-dropdown").removeClass("active");

    $submenu.slideDown(200);
    $(this).parent().addClass("active");

    let parentMenuText = $(this).find("span").text().trim();
    updateBreadcrumb(parentMenuText, null);
    saveActiveMenu($(this).closest(".sidebar-dropdown").index(), null);
  }
});

// 서브메뉴 클릭 시 상태 유지 및 breadcrumb 업데이트
$(".sidebar-submenu > ul > li > a").click(function (e) {
  e.preventDefault();
  $(".sidebar-submenu > ul > li > a").removeClass("active-hover");
  $(this).addClass("active-hover");

  let parentIndex = $(this).closest(".sidebar-dropdown").index();
  let subIndex = $(this).closest("li").index();

  let parentMenuText = $(".sidebar-dropdown").eq(parentIndex).find("> a span").text().trim();
  let subMenuText = $(this).text().trim();

  updateBreadcrumb(parentMenuText, subMenuText);
  saveActiveMenu(parentIndex, subIndex);
});

// breadcrumb 업데이트 함수
function updateBreadcrumb(parentMenuText, subMenuText) {
  let breadcrumbText = `<span class="parent-menu">${parentMenuText}</span>`;

  if (subMenuText) {
    breadcrumbText += ` <span class="separator">></span> <span class="sub-menu">${subMenuText}</span>`;
  }

  $("#breadcrumb").html(breadcrumbText);
  localStorage.setItem("breadcrumb", breadcrumbText); // breadcrumb 저장
}

// 메뉴 상태와 breadcrumb 저장
function saveActiveMenu(parentIndex, subIndex) {
  localStorage.setItem("activeMenuIndex", parentIndex);
  localStorage.setItem("activeSubMenuIndex", subIndex !== null ? subIndex : "");
}

// 저장된 메뉴와 breadcrumb 복원
function restoreActiveMenu() {
  let activeMenuIndex = localStorage.getItem("activeMenuIndex");
  let activeSubMenuIndex = localStorage.getItem("activeSubMenuIndex");
  let savedBreadcrumb = localStorage.getItem("breadcrumb");

  if (activeMenuIndex !== null) {
    let $activeMenu = $(".sidebar-dropdown").eq(activeMenuIndex);
    $activeMenu.addClass("active");
    $activeMenu.find(".sidebar-submenu").slideDown(0); // 중분류 열린 상태 유지

    if (activeSubMenuIndex !== "") {
      let $activeSubMenu = $activeMenu.find("ul > li").eq(activeSubMenuIndex);
      $activeSubMenu.find("a").addClass("active-hover");
    }
  }

  if (savedBreadcrumb) {
    $("#breadcrumb").html(savedBreadcrumb);
  } else {
    updateBreadcrumb("대시보드", null);
  }
}
