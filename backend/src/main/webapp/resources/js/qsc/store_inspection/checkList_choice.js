// 탭 버튼 클릭 이벤트 처리
document.querySelectorAll('.tab-btn').forEach(button => {
    button.addEventListener('click', function (e) {
        // 클릭한 버튼 외에 다른 버튼의 클릭 이벤트 전파 방지
        e.stopPropagation();

        // 탭 버튼 active 상태 처리
        const parentWrapper = button.closest('.inspection-content-wrapper'); // 가장 가까운 inspection-content-wrapper 찾기
        const tabButtons = parentWrapper.querySelectorAll('.tab-btn'); // 해당 wrapper 내부의 모든 탭 버튼
        tabButtons.forEach(btn => btn.classList.remove('active')); // 모든 버튼의 active 상태 제거
        this.classList.add('active'); // 클릭된 버튼에 active 상태 추가

        // 위치정보와 상세입력 콘텐츠 전환 (해당 wrapper 안에서만)
        const locationContent = parentWrapper.querySelector('.location-content');
        const detailContent = parentWrapper.querySelector('.detail-content');

        if (this.textContent === '위치정보') {
            locationContent.style.display = 'block';
            detailContent.style.display = 'none';
        } else if (this.textContent === '상세입력') {
            locationContent.style.display = 'none';
            detailContent.style.display = 'block';
        }

        // inspection-content-wrapper 높이를 다시 계산하여 적용
        adjustWrapperHeight(parentWrapper);
    });
});