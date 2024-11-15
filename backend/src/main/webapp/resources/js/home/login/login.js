function basicAlert() {
    Swal.fire({
      title: "알림",
      text: "비밀번호 문의는 관리자에게 연락주세요.",
      icon: "info",
      confirmButtonText: "확인",
    });
};

$(function () {
    // '비밀번호 찾기' 클릭 시 알림
    $('.find_password_text').click(basicAlert);

    // 비밀번호 보기 토글
    $('body .input_area').on('click', '.fa-eye-slash', function () {
        $(this).removeClass('fa-eye-slash').addClass('fa-eye');
        $('.password_input').attr('type', 'text');
    });

    $('body .input_area').on('click', '.fa-eye', function () {
        $(this).removeClass('fa-eye').addClass('fa-eye-slash');
        $('.password_input').attr('type', 'password');
    });
});

// '사번 기억하기' 체크박스가 변경될 때 쿠키 처리
$('.remember-checkbox').change(function () {
    if ($(this).is(":checked")) {
        const mbrNo = $('.empno_input').val();
        document.cookie = `mbrNo=${mbrNo}; path=/; max-age=604800;`; // 7일 유효
    } else {
        document.cookie = "mbrNo=; path=/; max-age=0;"; // 쿠키 삭제
    }
});

// 로그인 버튼 클릭 시 입력된 '사번' 쿠키에 저장
$('.login_btn').click(function (event) {
    if ($('.remember-checkbox').is(":checked")) {
        const mbrNo = $('.empno_input').val();
        document.cookie = `mbrNo=${mbrNo}; path=/; max-age=604800;`; // 7일 유효
    } else {
        document.cookie = "mbrNo=; path=/; max-age=0;"; // 쿠키 삭제
    }
});

// 페이지 로드 시 쿠키에서 사번 가져오기
$(document).ready(function () {

    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('error')) {
        Swal.fire({
            title: "실패!",
            text: "로그인에 실패했습니다. 아이디와 비밀번호를 확인하세요.",
            icon: "error",
            confirmButtonText: "확인",
        });
    }
    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    }

    const savedMbrNo = getCookie("mbrNo");
    if (savedMbrNo) {
        $('.empno_input').val(savedMbrNo);
        $('.remember-checkbox').prop("checked", true); // 체크박스 상태 유지
    }
});

window.onload = function() {

};