document.addEventListener('DOMContentLoaded', function () {
    calender();
    scheduleScroll();
});


function calender(){

    const calendarBody = document.getElementById('calendar-body');
    const monthSelect = document.getElementById('month-select');
    const yearDisplay = document.getElementById('year');
    let selectedDate = null;

    function generateCalendar(month, year) {
        // 달력 날짜 초기화
        calendarBody.innerHTML = '';

        // 해당 월의 첫 번째 날과 마지막 날 계산
        const firstDay = new Date(year, month, 1).getDay();
        const lastDate = new Date(year, month + 1, 0).getDate();

        let day = 1;
        let row = document.createElement('tr');

        // 월요일 시작으로 설정
        for (let i = 0; i < (firstDay === 0 ? 6 : firstDay - 1); i++) {
            const emptyCell = document.createElement('td');
            row.appendChild(emptyCell);
        }

        // 날짜 채우기
        for (let i = firstDay === 0 ? 6 : firstDay - 1; i < 7; i++) {
            const cell = document.createElement('td');
            cell.textContent = day++;
            cell.addEventListener('click', function () {
                if (selectedDate) {
                    selectedDate.classList.remove('selected');
                }
                selectedDate = cell;
                cell.classList.add('selected');
            });
            row.appendChild(cell);
        }

        calendarBody.appendChild(row);

        // 남은 날짜 채우기
        while (day <= lastDate) {
            row = document.createElement('tr');
            for (let i = 0; i < 7 && day <= lastDate; i++) {
                const cell = document.createElement('td');
                cell.textContent = day++;
                cell.addEventListener('click', function () {
                    if (selectedDate) {
                        selectedDate.classList.remove('selected');
                    }
                    selectedDate = cell;
                    cell.classList.add('selected');
                });
                row.appendChild(cell);
            }
            calendarBody.appendChild(row);
        }
    }

    // 초기 달력 생성
    const currentMonth = 3;  // April
    const currentYear = 2024;
    generateCalendar(currentMonth, currentYear);

    // 월 선택 시 달력 갱신
    monthSelect.addEventListener('change', function () {
        const selectedMonth = parseInt(monthSelect.value);
        generateCalendar(selectedMonth, parseInt(yearDisplay.textContent));
    });
}
function scheduleScroll() {
    // 모든 td 요소를 선택
    const tdElements = document.querySelectorAll('.schedule-table tbody td');

    tdElements.forEach(function(td) {
        // td 안에 있는 버튼의 개수를 확인
        const buttons = td.querySelectorAll('.inspection-btn');
        console.log(`TD 내부 버튼 개수: ${buttons.length}`); // 디버깅을 위해 버튼 개수 출력

        // 버튼이 3개 이상일 경우에만 스크롤을 활성화
        if (buttons.length >= 3) {
            // 버튼을 감싸는 div 추가
            const scrollableContent = document.createElement('div');
            scrollableContent.classList.add('scrollable-content');

            // 버튼들을 scrollableContent 안으로 이동
            buttons.forEach(function(button) {
                scrollableContent.appendChild(button);
            });

            // td 안에 scrollableContent 추가
            td.appendChild(scrollableContent);
        }
    });
}

x``
