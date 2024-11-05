$(document).ready(function () {
  restoreActiveMenu(); // 저장된 메뉴와 breadcrumb 복원
  handleResize(); // 화면 크기 조정

  $.ajax({
    url: '/loginUserInfo',
    method: 'GET',
    success: function(data) {
      $('#login-user-roll').text(data.mbrRoleCd);
      $('#login-user-name').text(data.mbrNm);
    },
    error: function(error) {
      console.error('사용자 정보를 가져오는 중 오류 발생:', error);
    }
  });


  // 로그아웃 버튼 클릭 시 처리
  $('#logOut').click(function () {
    // '/logout'으로 이동
    window.location.href = '/logout';
  });


  // 작은 화면용 사용자 아이콘 클릭 시 처리
  $('#user_mini').click(function (e) {
    e.stopPropagation(); // 이벤트 버블링 방지
    $('#login-wrap').toggleClass('show');
  });

  // 작은 화면 외부 클릭 시 login-wrap 축소
  $(document).click(function (e) {
    if ($(window).width() <= 1000) {
      if (!$(e.target).closest('#login-wrap').length && !$(e.target).closest('#user_mini').length) {
        $('#login-wrap').removeClass('show');
      }
    }
  });

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


  // 작은 화면일 때 login-wrap 초기 상태로 되돌리기
  if (window.innerWidth > 1000) {
    $('#login-wrap').removeClass('show');
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
});

// breadcrumb 업데이트 함수
function updateBreadcrumb(parentMenuText, subMenuText) {
  let breadcrumbText = `<span class="parent-menu">${parentMenuText}</span>`;

  if (subMenuText) {
    breadcrumbText += ` <span class="separator">></span> <span class="sub-menu">${subMenuText}</span>`;
  }

  $("#breadcrumb").html(breadcrumbText);
}



// 저장된 메뉴와 breadcrumb 복원
function restoreActiveMenu() {
  // 현재 URL 경로를 가져옵니다
  const path = window.location.pathname;

  // URL과 메뉴 인덱스를 매핑한 객체를 생성
  const menuMapping = {
    '/': { parentIndex: 0 }, // 대시보드
    '/master/store/manage': { parentIndex: 1, subIndex: 0 },
    '/master/product/manage': { parentIndex: 1, subIndex: 1 },
    '/master/checklist': { parentIndex: 2, subIndex: 0 },
    '/master/inspection-list-manage': { parentIndex: 2, subIndex: 1 },
    '/qsc/inspection-schedule/schedule-list': { parentIndex: 3, subIndex: 0 },
    '/qsc/store-inspection-schedule': { parentIndex: 3, subIndex: 1 },
    '/qsc/store-inspection': { parentIndex: 3, subIndex: 2 },
    '/qsc/inspection/result': { parentIndex: 3, subIndex: 3 },

  };

  const menuIndices = menuMapping[path];

  if (menuIndices) {
    const { parentIndex, subIndex } = menuIndices;
    const $activeMenu = $(".sidebar-dropdown").eq(parentIndex);
    $activeMenu.addClass("active");
    $activeMenu.find(".sidebar-submenu").slideDown(0); // 서브메뉴 열기

    if (subIndex !== undefined) {
      const $activeSubMenu = $activeMenu.find("ul > li").eq(subIndex);
      $activeSubMenu.find("a").addClass("active-hover");
    }

    const parentMenuText = $activeMenu.find("> a span").text().trim();
    const subMenuText = subIndex !== undefined
        ? $activeMenu.find("ul > li").eq(subIndex).find("a").text().trim()
        : null;

    updateBreadcrumb(parentMenuText, subMenuText);
  } else {
    // 매핑되지 않은 경우 기본값 설정
    updateBreadcrumb("대시보드", null);
  }
}


