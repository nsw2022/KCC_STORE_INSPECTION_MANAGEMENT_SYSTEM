document.addEventListener("DOMContentLoaded", function () {
    initializeSignaturePad();
});

function initializeSignaturePad() {
    const canvas = document.getElementById('signatureCanvas');
    if (!canvas) return;  // 서명 캔버스가 없으면 실행하지 않음
    const signaturePad = new SignaturePad(canvas);

    // 캔버스 크기 조정
    function resizeCanvas() {
        const ratio = Math.max(window.devicePixelRatio || 1, 1);
        canvas.width = canvas.offsetWidth * ratio;
        canvas.height = canvas.offsetHeight * ratio;
        canvas.getContext("2d").scale(ratio, ratio);
    }

    // 창 크기 변경 시 캔버스 크기 재조정
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // 서명이 없으면 placeholder 보이기
    function hidePlaceholder() {
        document.querySelector('.signature-placeholder').style.display = 'none';
        showClearButton();
    }

    canvas.addEventListener('mousedown', hidePlaceholder);
    canvas.addEventListener('touchstart', hidePlaceholder);
    canvas.addEventListener('pointerdown', hidePlaceholder); // 추가된 이벤트 리스너

    // 서명 초기화 함수
    const clearSignature = () => {
        signaturePad.clear();
        document.querySelector('.signature-placeholder').style.display = 'block';
        hideClearButton();  // 서명 초기화 시 다시하기 버튼 숨기기
    };

    // 다시하기 버튼 생성 및 숨김 처리 함수
    const showClearButton = () => {
        let clearButton = document.getElementById('clear-signature-btn');
        if (!clearButton) {
            clearButton = document.createElement('button');
            clearButton.id = 'clear-signature-btn';
            clearButton.innerText = '다시하기';

            clearButton.addEventListener('click', clearSignature);

            const signatureArea = document.querySelector('.signature-area');
            signatureArea.appendChild(clearButton);
        }
    };

    const hideClearButton = () => {
        const clearButton = document.getElementById('clear-signature-btn');
        if (clearButton) {
            clearButton.remove();  // 다시하기 버튼 제거
        }
    };
}

//----------------------데이터 보내기-----------------------
function lastCheckInspection() {
    // 지금은 비어있는 데이터 > 임시 데이터 전송

    // 빈 데이터를 만들거나 필요한 데이터를 추가
    const data = "";  // 아직은 비어있는 데이터

    // 폼을 생성하여 데이터를 전송
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = '/qsc/popup_lastCheck';  // 페이지 이동 경로 설정

    // 숨겨진 input 필드로 데이터 추가
    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = 'inspectionData';
    input.value = data || "";  // 데이터가 없을 경우 빈 값으로 설정
    form.appendChild(input);

    // 폼을 문서에 추가한 뒤 제출
    document.body.appendChild(form);
    form.submit();
}
