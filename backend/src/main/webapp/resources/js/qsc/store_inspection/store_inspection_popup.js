document.addEventListener('DOMContentLoaded', function () {
});


function openPopup(content) {
    // 팝업 페이지 URL 설정 (필요에 따라 URL 수정)
    const popupUrl = 'popup_page';  // 팝업 페이지 URL (필요 시 수정)

    // 현재 화면 크기 확인
    const screenWidth = window.innerWidth || document.documentElement.clientWidth || screen.width;
    const screenHeight = window.innerHeight || document.documentElement.clientHeight || screen.height;

    // 모바일 디바이스 확인 (가로 크기가 768px 이하인 경우)
    const isMobile = screenWidth <= 768;

    // 팝업 창 크기 설정 (화면의 90% 크기 또는 전체 크기)
    const popupWidth = isMobile ? screenWidth : screenWidth * 0.8;  // 모바일: 100%, 데스크탑: 90%
    const popupHeight = isMobile ? screenHeight : screenHeight * 1;  // 모바일: 100%, 데스크탑: 90%

    // 팝업 창의 중앙 위치 계산 (모바일은 무시)
    const screenLeft = window.screenLeft || window.screenX;
    const screenTop = window.screenTop || window.screenY;
    const left = isMobile ? 0 : screenLeft + (screenWidth - popupWidth) / 2;
    const top = isMobile ? 0 : screenTop + (screenHeight - popupHeight) / 2;

    // 팝업 창 옵션 (위치 및 크기 포함)
    const popupOptions = `width=${popupWidth},height=${popupHeight},top=${top},left=${left},scrollbars=yes,resizable=yes`;

    // 새 창을 팝업으로 엽니다
    window.open(popupUrl, '_blank', popupOptions);
}

// function startInspection() {
//     // 비어있는 데이터로 POST 요청 보내기
//     fetch('/qsc/popup_page_inspection', {
//         method: 'POST', // POST 요청
//         headers: {
//             'Content-Type': 'application/json', // JSON 형식으로 전송
//         },
//         body: JSON.stringify({}) // 비어있는 데이터 전송
//     })
//         .then(response => {
//             if (response.ok) {
//                 // 성공 시 현재 팝업창에서 리다이렉트
//                 window.location.href = '/qsc/popup_page_inspection'; // 현재 팝업창에서 새 페이지로 이동
//             } else {
//                 alert('POST 요청 실패');
//             }
//         })
//         .catch(error => {
//             console.error('POST 요청 중 에러 발생:', error);
//         });
// }

function startInspection() {
    // form 태그를 생성해서 POST 방식으로 페이지 전환
    var form = document.createElement("form");
    form.method = "POST";
    form.action = "/qsc/popup_page_inspection";
    document.body.appendChild(form);
    form.submit();
}



