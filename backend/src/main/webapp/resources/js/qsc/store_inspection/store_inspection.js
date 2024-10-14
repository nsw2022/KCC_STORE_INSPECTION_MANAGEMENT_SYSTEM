const inspectionAllScheduleData = [
    {
        CTG_NM: "위생 점검",
        SUB_CTH_NM: [
            {
                CHKLST_NM:"홍대점 위생점검",
                INSP_PLAN_DT:"2024/10/11"
            },
            {
                CHKLST_NM:"혜화점 위생점검",
                INSP_PLAN_DT:"2024/10/14"
            },
            {
                CHKLST_NM:"성신여대점 위생점검",
                INSP_PLAN_DT:"2024/10/14"
            },
            {
                CHKLST_NM:"동대문점 위생점검",
                INSP_PLAN_DT:"2024/10/14"
            },
            {
                CHKLST_NM:"노원역점 위생점검",
                INSP_PLAN_DT:"2024/10/16"
            },
            {
                CHKLST_NM:"천호역점 위생점검",
                INSP_PLAN_DT:"2024/10/16"
            },
            {
                CHKLST_NM:"노원역점 위생점검",
                INSP_PLAN_DT:"2024/10/16"
            },
            {
                CHKLST_NM:"경희대점 위생점검",
                INSP_PLAN_DT:"2024/10/18"
            },
            {
                CHKLST_NM:"서울역점 위생점검",
                INSP_PLAN_DT:"2024/10/18"
            },
            {
                CHKLST_NM:"강남역점 위생점검",
                INSP_PLAN_DT:"2024/10/18"
            },
            {
                CHKLST_NM:"왕십리역점 위생점검",
                INSP_PLAN_DT:"2024/10/18"
            },
            {
                CHKLST_NM:"군자역점 위생점검",
                INSP_PLAN_DT:"2024/10/18"
            },
            {
                CHKLST_NM:"이태원점 위생점검",
                INSP_PLAN_DT:"2024/10/22"
            },
            {
                CHKLST_NM:"국민대점 위생점검",
                INSP_PLAN_DT:"2024/10/24"
            },
        ]
    },
    {
        CTG_NM: "품질 점검",
        SUB_CTH_NM: [
            {
                CHKLST_NM:"혜화점 품질점검",
                INSP_PLAN_DT:"2024/10/11"
            },
            {
                CHKLST_NM:"성신여대점 품질점검",
                INSP_PLAN_DT:"2024/10/15"
            },
            {
                CHKLST_NM:"동대문점 품질점검",
                INSP_PLAN_DT:"2024/10/15"
            },
            {
                CHKLST_NM:"명동점 품질점검",
                INSP_PLAN_DT:"2024/10/15"
            },
            {
                CHKLST_NM:"노원역점 품질점검",
                INSP_PLAN_DT:"2024/10/17"
            },
            {
                CHKLST_NM:"천호역점 품질점검",
                INSP_PLAN_DT:"2024/10/17"
            },
            {
                CHKLST_NM:"경희대점 품질점검",
                INSP_PLAN_DT:"2024/10/21"
            },
            {
                CHKLST_NM:"서울역점 품질점검",
                INSP_PLAN_DT:"2024/10/21"
            },
            {
                CHKLST_NM:"강남역점 품질점검",
                INSP_PLAN_DT:"2024/10/21"
            },
            {
                CHKLST_NM:"왕십리역점 품질점검",
                INSP_PLAN_DT:"2024/10/21"
            },
            {
                CHKLST_NM:"군자역점 품질점검",
                INSP_PLAN_DT:"2024/10/21"
            },
            {
                CHKLST_NM:"이태원점 품질점검",
                INSP_PLAN_DT:"2024/10/23"
            },
            {
                CHKLST_NM:"국민대점 품질점검",
                INSP_PLAN_DT:"2024/10/25"
            },
        ]
    }
]


document.addEventListener('DOMContentLoaded', function () {
    calender();
    scheduleScroll();
});


function calender() {
    const calendarBody = document.getElementById('calendar-body');
    const monthSelect = document.getElementById('month-select');
    const yearSelect = document.getElementById('year-select');
    const checklistSelect = document.getElementById('checklist-select');
    let selectedDate = null;

    const today = new Date(); // 오늘 날짜 객체 생성
    const defaultYear = today.getFullYear(); // 오늘의 년도
    const defaultMonth = today.getMonth(); // 오늘의 월 (0부터 시작)
    const defaultDay = today.getDate(); // 오늘의 일

    // 년도 드롭다운 생성 함수
    function populateYearSelect(startYear = 1900, endYear = 2100, defaultYear) {
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

    // 월 드롭다운 생성 함수
    function populateMonthSelect(defaultMonth) {
        const months = ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'];
        monthSelect.innerHTML = '';
        months.forEach((monthName, index) => {
            const option = document.createElement('option');
            option.value = index;
            option.textContent = monthName;
            if (index === defaultMonth) {
                option.selected = true;
            }
            monthSelect.appendChild(option);
        });
    }

    // 달력 생성 함수
    function generateCalendar(month, year) {
        calendarBody.innerHTML = ''; // 기존 달력 내용 초기화

        const firstDay = new Date(year, month, 1).getDay(); // 해당 월의 첫 번째 날의 요일
        const lastDate = new Date(year, month + 1, 0).getDate(); // 해당 월의 마지막 날짜

        let day = 1;
        let row = document.createElement('tr');

        // 일요일 시작에 맞게 빈 칸 채우기
        for (let i = 0; i < firstDay; i++) {
            const emptyCell = document.createElement('td');
            row.appendChild(emptyCell);
        }

        // 달력 날짜 채우기
        for (let i = firstDay; i < 7; i++) {
            const cell = document.createElement('td');
            cell.textContent = day++;
            if (year === defaultYear && month === defaultMonth && parseInt(cell.textContent) === defaultDay) {
                cell.classList.add('selected'); // 오늘 날짜를 기본 선택
                selectedDate = cell;
            }
            cell.addEventListener('click', function () {
                if (selectedDate) {
                    selectedDate.classList.remove('selected');
                }
                selectedDate = cell;
                cell.classList.add('selected');
                const selectedYear = parseInt(yearSelect.value);
                const selectedMonth = parseInt(monthSelect.value);
                const selectedDay = parseInt(cell.textContent);
                const date = new Date(selectedYear, selectedMonth, selectedDay);
                generateTodayInspectionList(date);
                generateScheduleTable(date);
                scheduleScroll(); // 스케줄 테이블 생성 후 호출
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
                if (year === defaultYear && month === defaultMonth && parseInt(cell.textContent) === defaultDay) {
                    cell.classList.add('selected'); // 오늘 날짜를 기본 선택
                    selectedDate = cell;
                }
                cell.addEventListener('click', function () {
                    if (selectedDate) {
                        selectedDate.classList.remove('selected');
                    }
                    selectedDate = cell;
                    cell.classList.add('selected');
                    const selectedYear = parseInt(yearSelect.value);
                    const selectedMonth = parseInt(monthSelect.value);
                    const selectedDay = parseInt(cell.textContent);
                    const date = new Date(selectedYear, selectedMonth, selectedDay);
                    generateTodayInspectionList(date);
                    generateScheduleTable(date);
                    scheduleScroll(); // 스케줄 테이블 생성 후 호출
                });
                row.appendChild(cell);
            }
            calendarBody.appendChild(row);
        }

        // 초기 로드시 오늘 날짜의 점검 목록과 스케줄 테이블 생성
        if (!selectedDate) {
            const cells = calendarBody.querySelectorAll('td');
            cells.forEach(cell => {
                if (cell.textContent == defaultDay) {
                    cell.classList.add('selected');
                    selectedDate = cell;
                }
            });
        }
        const date = new Date(year, month, selectedDate ? parseInt(selectedDate.textContent) : 1);
        generateTodayInspectionList(date);
        generateScheduleTable(date);
        scheduleScroll(); // 초기 로드시 호출
    }

    // 년도 및 월 선택 시 달력 갱신
    function updateCalendar() {
        const selectedYear = parseInt(yearSelect.value);
        const selectedMonth = parseInt(monthSelect.value);
        generateCalendar(selectedMonth, selectedYear);
    }

    // 페이지 로드 시 초기 설정
    populateYearSelect(1900, 2100, defaultYear); // 년도 드롭다운 생성
    populateMonthSelect(defaultMonth); // 월 드롭다운 생성
    updateCalendar(); // 초기 달력 생성

    // 월 또는 년도 변경 시 달력 갱신
    monthSelect.addEventListener('change', updateCalendar);
    yearSelect.addEventListener('change', updateCalendar);

    // 체크리스트 선택 변경 시 스케줄 테이블 갱신
    checklistSelect.addEventListener('change', function() {
        const selectedYear = parseInt(yearSelect.value);
        const selectedMonth = parseInt(monthSelect.value);
        const selectedDay = selectedDate ? parseInt(selectedDate.textContent) : defaultDay;
        const date = new Date(selectedYear, selectedMonth, selectedDay);
        generateScheduleTable(date);
        scheduleScroll(); // 스케줄 테이블 생성 후 호출
    });
}

function generateTodayInspectionList(date) {
    const listContainer = document.getElementById('today_inspection_list');
    listContainer.innerHTML = '';

    const dateStr = formatDate(date); // "YYYY/MM/DD" 형식으로 변환

    inspectionAllScheduleData.forEach(category => {
        category.SUB_CTH_NM.forEach(item => {
            if (item.INSP_PLAN_DT === dateStr) {
                const li = document.createElement('li');
                const h4 = document.createElement('h4');
                h4.textContent = category.CTG_NM;
                const pTitle = document.createElement('p');
                pTitle.classList.add('today_inspection_list_title');
                pTitle.textContent = item.CHKLST_NM;
                const pDate = document.createElement('p');
                pDate.classList.add('today_inspection_list_date');
                pDate.textContent = item.INSP_PLAN_DT.replace(/\//g, '.');
                li.appendChild(h4);
                li.appendChild(pTitle);
                li.appendChild(pDate);
                listContainer.appendChild(li);
            }
        });
    });
}

function generateScheduleTable(date) {
    const tableBody = document.getElementById('schedule-table-body');
    tableBody.innerHTML = '';

    // 선택한 날짜의 주 (일요일 시작)
    const weekStartDate = new Date(date);
    weekStartDate.setDate(date.getDate() - date.getDay()); // 일요일로 설정

    const selectedChecklist = document.getElementById('checklist-select').value;

    const weekRow = document.createElement('tr');
    for (let i = 0; i < 7; i++) {
        const cellDate = new Date(weekStartDate);
        cellDate.setDate(weekStartDate.getDate() + i);

        const td = document.createElement('td');
        const span = document.createElement('span');
        span.textContent = `${cellDate.getMonth()+1}/${cellDate.getDate()}`;
        td.appendChild(span);

        // 일요일(0)과 토요일(6)에 empty-cell 클래스 추가
        if (i === 0 || i === 6) {
            td.classList.add('empty-cell');
        }

        // 해당 날짜의 점검 항목 추가
        const dateStr = formatDate(cellDate);

        inspectionAllScheduleData.forEach(category => {
            if (selectedChecklist === 'all' || category.CTG_NM === selectedChecklist) {
                category.SUB_CTH_NM.forEach(item => {
                    if (item.INSP_PLAN_DT === dateStr) {
                        const button = document.createElement('button');
                        button.classList.add('inspection-btn');
                        button.textContent = item.CHKLST_NM;
                        button.onclick = function() {
                            openPopup(item.CHKLST_NM);
                        };
                        td.appendChild(button);
                    }
                });
            }
        });

        weekRow.appendChild(td);
    }

    tableBody.appendChild(weekRow);
}

function formatDate(date) {
    const year = date.getFullYear();
    const month = ('0'+(date.getMonth()+1)).slice(-2);
    const day = ('0'+date.getDate()).slice(-2);
    return `${year}/${month}/${day}`;
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
