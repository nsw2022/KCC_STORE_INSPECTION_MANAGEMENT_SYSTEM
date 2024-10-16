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

        const firstDay = new Date(year, month, 1).getDay(); // 해당 월의 첫 번째 날의 요일 (0: 일요일)
        const lastDate = new Date(year, month + 1, 0).getDate(); // 해당 월의 마지막 날짜

        let day = 1;
        let row;

        // 총 주 수 계산 (첫 주 + 마지막 주의 빈 칸을 고려)
        const totalDays = firstDay + lastDate;
        const totalWeeks = Math.ceil(totalDays / 7);

        for (let week = 0; week < totalWeeks; week++) {
            row = document.createElement('tr');

            for (let i = 0; i < 7; i++) {
                const currentDayIndex = week * 7 + i;
                const cell = document.createElement('td');

                if (currentDayIndex >= firstDay && day <= lastDate) {
                    const dayContent = createCalendarCell(day++, year, month);
                    cell.appendChild(dayContent);
                }

                row.appendChild(cell);
            }

            calendarBody.appendChild(row);
        }

        // 초기 로드시 오늘 날짜의 점검 목록과 스케줄 테이블 생성
        const selectedDay = selectedDate ? parseInt(selectedDate.textContent) : defaultDay;
        const date = new Date(year, month, selectedDay);
        generateTodayInspectionList(date);
        generateScheduleTable(date);
    }


    // 셀 생성 함수
    function createCalendarCell(day, year, month) {
        const dayContent = document.createElement('div');
        dayContent.classList.add('day-content');
        dayContent.textContent = day;

        // 오늘 날짜 자동 선택
        if (year === defaultYear && month === defaultMonth && day === defaultDay) {
            dayContent.classList.add('selected'); // selected 클래스 추가
            selectedDate = dayContent;
        }

        // 클릭 이벤트 추가
        dayContent.addEventListener('click', function () {
            if (selectedDate) {
                selectedDate.classList.remove('selected'); // 이전 선택 제거
            }
            selectedDate = dayContent; // 새로 선택된 요소로 갱신
            dayContent.classList.add('selected'); // 선택된 날짜 표시

            const selectedYear = parseInt(yearSelect.value);
            const selectedMonth = parseInt(monthSelect.value);
            const selectedDay = parseInt(dayContent.textContent);
            const date = new Date(selectedYear, selectedMonth, selectedDay);

            generateTodayInspectionList(date); // 점검 목록 생성
            generateScheduleTable(date); // 스케줄 테이블 생성
        });

        return dayContent;
    }




    // 년도 및 월 선택 시 달력 갱신
    function updateCalendar() {
        const selectedYear = parseInt(yearSelect.value);
        const selectedMonth = parseInt(monthSelect.value);
        generateCalendar(selectedMonth, selectedYear);
    }

    // 페이지 로드 시 초기 설정
    populateYearSelect(2024, 2100, defaultYear); // 년도 드롭다운 생성
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
    });
}

//좌측상단 오늘의 점검표시 함수
function generateTodayInspectionList(date) {
    const listContainer = document.getElementById('today_inspection_list');
    listContainer.innerHTML = '';

    const dateStr = formatDate(date); // "YYYY/MM/DD" 형식으로 변환
    let hasInspection = false; // 점검 여부를 추적하는 변수

    inspectionAllScheduleData.forEach(category => {
        category.SUB_CTH_NM.forEach(item => {
            if (item.INSP_PLAN_DT === dateStr) {
                hasInspection = true; // 점검이 있음을 표시
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

// 점검이 없는 경우 "점검이 없습니다." 메시지 표시
    if (!hasInspection) {
        const noInspectionMsg = document.createElement('li');
        const pTag = document.createElement('p');
        pTag.textContent = '점검이 없습니다.';
        pTag.classList.add('no-inspection-message');
        noInspectionMsg.appendChild(pTag);
        listContainer.appendChild(noInspectionMsg);
    }

}


// 점검 한주 스케줄 표시 함수
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
        span.textContent = `${cellDate.getMonth() + 1}/${cellDate.getDate()}`;
        td.appendChild(span);

        // 일요일(0)과 토요일(6)에 empty-cell 클래스 추가
        if (i === 0 || i === 6) {
            td.classList.add('empty-cell');
        }

        // 해당 날짜의 점검 항목 가져오기
        const dateStr = formatDate(cellDate);

        let allItems = [];
        inspectionAllScheduleData.forEach(category => {
            if (selectedChecklist === 'all' || category.CTG_NM === selectedChecklist) {
                category.SUB_CTH_NM.forEach(item => {
                    if (item.INSP_PLAN_DT === dateStr) {
                        allItems.push({
                            categoryName: category.CTG_NM,
                            itemName: item.CHKLST_NM,
                            planDate: item.INSP_PLAN_DT
                        });
                    }
                });
            }
        });

        // 버튼들을 td에 추가
        allItems.forEach((item, index) => {
            if (index < 3) {
                const button = document.createElement('button');
                button.classList.add('inspection-btn');
                button.textContent = item.itemName;
                button.onclick = function() {
                    openPopup(item.itemName);
                };
                td.appendChild(button);
            }
        });

        // 버튼이 3개 이상일 경우 '+n 더보기' 버튼 추가
        if (allItems.length > 3) {
            const extraCount = allItems.length - 3;
            const moreButton = document.createElement('button');
            moreButton.classList.add('more-btn');
            moreButton.textContent = `+${extraCount} 더보기`;

            // '+n 더보기' 버튼 클릭 시 모달 창 열기
            moreButton.addEventListener('click', function() {
                openModal(allItems);
            });

            td.appendChild(moreButton);
        }

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


// 모달 창 열기 함수
function openModal(items) {
    // 모달 배경 요소 생성
    let modalBackground = document.getElementById('modal-background');
    if (!modalBackground) {
        modalBackground = document.createElement('div');
        modalBackground.id = 'modal-background';
        modalBackground.classList.add('modal-background');
        document.body.appendChild(modalBackground);
    }

    // 모달 내용 요소 생성
    let modalContent = document.getElementById('modal-content');
    if (!modalContent) {
        modalContent = document.createElement('div');
        modalContent.id = 'modal-content';
        modalContent.classList.add('modal-content');
        modalBackground.appendChild(modalContent);
    }

    // 모달 내용 초기화
    modalContent.innerHTML = '<h2>점검 목록</h2>';

    // 아이템들을 모달에 추가
    items.forEach(function(item) {
        const button = document.createElement('button');
        button.classList.add('inspection-btn');
        button.textContent = item.itemName;
        button.onclick = function() {
            openPopup(item.itemName);
        };
        modalContent.appendChild(button);
    });

    // 모달 닫기 버튼 추가
    const closeButton = document.createElement('button');
    closeButton.textContent = '닫기';
    closeButton.classList.add('modal-close-btn');
    closeButton.addEventListener('click', function() {
        // 'show' 클래스 제거하여 애니메이션 시작
        modalBackground.classList.remove('show');
        modalContent.classList.remove('show');
        // 애니메이션 후 display:none 처리
        setTimeout(function() {
            modalBackground.style.display = 'none';
        }, 300); // transition 시간과 동일하게 설정
    });
    modalContent.appendChild(closeButton);

    // 모달 표시 (display:flex 설정 후 약간의 지연을 주어 애니메이션 적용)
    modalBackground.style.display = 'flex';
    setTimeout(function() {
        modalBackground.classList.add('show');
        modalContent.classList.add('show');
    }, 10);
}


