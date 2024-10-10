
// animateHeight 함수 정의
function animateHeight(element, startHeight, endHeight, duration) {
    const startTime = performance.now();
    element.style.overflow = 'hidden';  // 항상 애니메이션 중에는 overflow를 hidden으로

    function step(currentTime) {
        const progress = Math.min((currentTime - startTime) / duration, 1);
        const currentHeight = startHeight + progress * (endHeight - startHeight);

        element.style.height = currentHeight + 'px';

        if (progress < 1) {
            requestAnimationFrame(step);
        } else {
            // 애니메이션이 끝나면 처리
            if (endHeight > 0) {
                element.style.height = 'auto';  // 콘텐츠 크기에 맞게 height auto로 설정
                element.style.overflow = 'visible';  // 콘텐츠가 모두 보이도록 overflow visible로 변경
            } else {
                element.style.height = '0';
            }
        }
    }

    requestAnimationFrame(step);
}

// toggleInspectionContent 함수 수정
function toggleInspectionContent(button) {
    const contentWrapper = button.closest('.inspection-content').querySelector('.inspection-content-wrapper');

    if (contentWrapper.classList.contains('open')) {
        const startHeight = contentWrapper.scrollHeight;
        contentWrapper.classList.remove('open');

        // 애니메이션으로 닫기
        animateHeight(contentWrapper, startHeight, 0, 300); // 300ms 동안 애니메이션

        button.textContent = '+'; // 버튼 기호 변경
    } else {
        contentWrapper.classList.add('open');

        // 열릴 때의 높이 계산
        const endHeight = contentWrapper.scrollHeight;

        // 애니메이션으로 열기
        animateHeight(contentWrapper, 0, endHeight, 300);

        button.textContent = '-'; // 버튼 기호 변경
    }
}

// add-btn에 대한 이벤트 처리
document.querySelectorAll('.add-btn').forEach(button => {
    button.addEventListener('click', function() {
        toggleInspectionContent(this);
    });
});

// toggle-icon에 대한 애니메이션 처리
document.querySelectorAll('.inspection-header').forEach(header => {
    header.addEventListener('click', (e) => {
        // 이벤트 전파 방지
        e.stopPropagation();

        const content = header.nextElementSibling;

        if (content.classList.contains('open')) {
            const startHeight = content.scrollHeight;
            content.classList.remove('open');
            animateHeight(content, startHeight, 0, 300); // 300ms 동안 높이 애니메이션
            header.querySelector('.toggle-icon').style.transform = 'rotate(0deg)';

            // add-btn이 열려 있으면 같이 닫기
            const addButton = content.querySelector('.add-btn');
            const contentWrapper = content.querySelector('.inspection-content-wrapper');
            if (contentWrapper && contentWrapper.classList.contains('open')) {
                toggleInspectionContent(addButton);  // 열려 있으면 닫기
            }
        } else {
            content.classList.add('open');
            const endHeight = content.scrollHeight;
            animateHeight(content, 0, endHeight, 300); // 300ms 동안 높이 애니메이션
            header.querySelector('.toggle-icon').style.transform = 'rotate(180deg)';
        }
    });
});



// 콘텐츠 높이를 조정하는 함수
function adjustWrapperHeight(element) {
    element.style.height = 'auto'; // 높이를 자동으로 일단 설정
    const newHeight = element.scrollHeight; // 새로운 높이 계산
    element.style.height = newHeight + 'px'; // 새로운 높이를 적용
    element.style.transition = 'height 0.5s ease'; // 부드러운 전환
}



// 페이지 로드 시 첫 번째 탭과 첫 번째 콘텐츠를 active 상태로 설정
window.addEventListener('DOMContentLoaded', function () {
    // 첫 번째 탭과 첫 번째 inspection-list 요소 찾기
    const firstTab = document.querySelector('.inspection-tab');
    const firstContent = document.querySelector('.inspection-list');

    // 첫 번째 탭과 콘텐츠에 active 클래스 추가
    if (firstTab) {
        firstTab.classList.add('active');
    }

    if (firstContent) {
        firstContent.classList.add('active');
    }
});

// 탭 클릭 시 활성화 처리 및 콘텐츠 표시
document.querySelectorAll('.inspection-tab').forEach(tab => {
    tab.addEventListener('click', function () {
        // 모든 탭에서 active 클래스를 제거
        document.querySelectorAll('.inspection-tab').forEach(tab => tab.classList.remove('active'));

        // 현재 클릭한 탭에만 active 클래스 추가
        this.classList.add('active');

        // 모든 inspection-list 숨기기
        document.querySelectorAll('.inspection-list').forEach(list => list.classList.remove('active'));

        // 클릭한 탭에 해당하는 내용을 보여주기
        const contentId = this.getAttribute('data-tab');
        document.getElementById(contentId).classList.add('active');
    });
});

// -------------------------데이터 전달 함수-------------------------
function checkInspection() {
    // textarea 데이터를 가져옴
    const textareaData = document.querySelector('.etc-input').value;

    // 폼을 생성하여 데이터를 전송
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = '/qsc/popup_middleCheck';

    // textarea 데이터를 숨겨진 input 필드로 추가
    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = 'textareaData';
    input.value = textareaData;
    form.appendChild(input);

    // 폼을 문서에 추가한 뒤 제출
    document.body.appendChild(form);
    form.submit();
}








