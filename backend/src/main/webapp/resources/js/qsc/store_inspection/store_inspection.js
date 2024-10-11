document.addEventListener('DOMContentLoaded', function () {
    calender();
    scheduleScroll();
});


function calender() {
    const calendarBody = document.getElementById('calendar-body');
    const monthSelect = document.getElementById('month-select');
    const yearSelect = document.getElementById('year-select');
    let selectedDate = null;

    // 년도 드롭다운 생성 함수
    function populateYearSelect(startYear = 1900, endYear = 2100, defaultYear = 2024) {
        yearSelect.innerHTML = ''; // 기존 옵션 제거
        for (let year = startYear; year <= endYear; year++) {
            const option = document.createElement('option');
            option.value = year;
            option.textContent = `${year}년`;
            if (year === defaultYear) {
                option.selected = true;
            }
            yearSelect.appendChild(option);
        }
    }

    // 달력 생성 함수
    function generateCalendar(month, year) {
        calendarBody.innerHTML = ''; // 기존 달력 내용 초기화

        const firstDay = new Date(year, month, 1).getDay(); // 해당 월의 첫 번째 날의 요일
        const lastDate = new Date(year, month + 1, 0).getDate(); // 해당 월의 마지막 날짜

        let day = 1;
        let row = document.createElement('tr');

        // 월요일 시작을 위해 빈 칸 채우기
        for (let i = 0; i < (firstDay === 0 ? 6 : firstDay - 1); i++) {
            const emptyCell = document.createElement('td');
            row.appendChild(emptyCell);
        }

        // 달력 날짜 채우기
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

    // 년도 및 월 선택 시 달력 갱신
    function updateCalendar() {
        const selectedYear = parseInt(yearSelect.value);
        const selectedMonth = parseInt(monthSelect.value);
        generateCalendar(selectedMonth, selectedYear);
    }

    // 페이지 로드 시 초기 설정
    populateYearSelect(); // 년도 드롭다운 생성
    updateCalendar(); // 초기 달력 생성

    // 월 또는 년도 변경 시 달력 갱신
    monthSelect.addEventListener('change', updateCalendar);
    yearSelect.addEventListener('change', updateCalendar);
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
