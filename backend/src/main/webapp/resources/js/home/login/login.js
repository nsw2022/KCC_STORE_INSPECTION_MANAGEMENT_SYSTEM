// 1. 기본 알림
    function basicAlert() {
        Swal.fire({
          title: "알림",
          text: "비밀번호 문의는 관리자에게 연락주세요.",
          icon: "info",
          confirmButtonText: "확인",
        });
      }

    $(function () {
        $('.find_password_text').click(basicAlert);
        
        $('body .input_area').on('click', '.fa-eye-slash', function () {
            $(this).removeClass('fa-eye-slash');
            $(this).addClass('fa-eye');
            $('.password_input').attr('type','text');
        })
        
        $('body .input_area').on('click', '.fa-eye', function () {
            $(this).removeClass('fa-eye');
            $(this).addClass('fa-eye-slash');
            $('.password_input').attr('type','password');
        })
    })