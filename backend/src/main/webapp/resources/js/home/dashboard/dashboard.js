const group = document.querySelector("#group");
let sortableInstance;
const mediaQuery = window.matchMedia("(min-width: 1400px)");
// 조건에 따라 Sortable 적용 및 해제 함수
function handleMediaQueryChange(e) {
  if (e.matches) {
    // 화면 너비가 1400px 이상일 때 Sortable 활성화
    sortableInstance = new Sortable(group, {
      animation: 150,
      ghostClass: "blue-bg",
    });
  } else {
    // 1000px 미만일 때 Sortable 제거
    if (sortableInstance) {
      sortableInstance.destroy();
      sortableInstance = null;
    }
  }
}

// 처음 로드 시에도 조건에 따라 설정
handleMediaQueryChange(mediaQuery);

// 화면 크기 변경 시 이벤트 리스너 추가
mediaQuery.addEventListener("change", handleMediaQueryChange);


$(document).ready(function () {

  fetch("/InspSchdAndResultResponse")
      .then(response => response.json())
      .then(data => {
        var options1 = {
          series: [data.completed, (data.total - data.completed)],
          chart: {
            type: "donut",
            toolbar: {
              show: true,
              tools: {
                download: true,
              },
            },
            width: "100%",
            height: "85%",
          },
          labels: ["점검완료", "점검 미완료"],
          colors: ["#3274F9", "#edf0f8"],
          legend: {
            position: "bottom", // 범례를 하단에 표시
          },
          plotOptions: {
            pie: {
              donut: {
                size: "70%",
                labels: {
                  show: true,
                  total: {
                    show: true,
                    label: "점검완료 / 전체",
                    formatter: function (w) {
                      var completed = w.globals.series[0];
                      var total = w.globals.seriesTotals.reduce((a, b) => a + b, 0);
                      return `${completed} / ${total}`;
                    },
                  },
                },
              },
            },
          },
          responsive: [
            {
              breakpoint: 400, // 390픽셀 이하일 때
              options: {
                chart: {
                  width: "100%", // 너비를 100%로 설정하여 전체 너비를 사용
                  height: "80%", // 높이를 조정하여 차트 비율 유지
                },
                legend: {
                  position: "bottom",
                },
                plotOptions: {
                  pie: {
                    donut: {
                      size: "60%", // 도넛 크기를 줄여 비율 조정
                    },
                  },
                },
              },
            },
          ],
        };
        var chart1 = new ApexCharts(document.querySelector("#chart1"), options1);
        chart1.render();
      })
});

var options3 = {
  series: [
    {
      name: "점수", // 시리즈 이름 추가
      data: [81, 88],
    },
  ],
  chart: {
    type: "bar",
    width: "100%", // 기본 차트 너비를 100%로 설정하여 반응형으로 만들기
    height: "90%",
  },
  plotOptions: {
    bar: {
      borderRadius: 5,
      columnWidth: "30%", // 차트 두께 줄이기 (30%로 설정)
      dataLabels: {
        position: "top", // top, center, bottom
      },
    },
  },
  dataLabels: {
    enabled: true,
    offsetY: -20,
    style: {
      fontSize: "12px",
      colors: ["#304758"],
    },
  },
  colors: ["#3274F9"],
  xaxis: {
    categories: ["전체 매장", "담당 매장"],
    labels: {
      style: {
        fontSize: "13px", // X축 라벨 크기 조정
        fontWeight: "bold", // 글자 두께 조정
      },
    },
  },
  yaxis: {
    labels: {
      show: false, // Y축 라벨 숨기기
    },
  },
  grid: {
    show: false, // 배경 그리드 없애기
  },
};

var chart3 = new ApexCharts(document.querySelector("#chart3"), options3);
chart3.render();

var options4 = {
  series: [44, 55, 13, 43, 22],
  chart: {
    width: "100%", // 기본 차트 너비를 100%로 설정하여 반응형으로 만들기
    type: "pie",
    height: "80%", // 기본 차트 높이를 100%로 설정
  },

  labels: ["S", "A", "B", "C", "D"],

  legend: {
    position: "bottom", // 범례를 하단에 표시
  },
  responsive: [
    {
      breakpoint: 400, // 390픽셀 이하일 때
      options: {
        chart: {
          width: "100%", // 너비를 100%로 설정하여 전체 너비를 사용
          height: "300px", // 높이를 조정하여 차트 비율 유지
        },
        legend: {
          position: "bottom", // 작은 화면에서도 범례를 하단에 표시
        },
      },
    },
  ],
};

var chart4 = new ApexCharts(document.querySelector("#chart4"), options4);
chart4.render();

$(document).ready(function () {
  fetch("/penalty")
      .then(response => response.json())
      .then(data =>{
        const store = data.map(item => item.storeNm);
        const penalty = data.map(item => Number(item.penalty) || 0); // 문자열을 숫자로 변환하고, 값이 없을 경우 0으로 설정

        const totalPenalty = penalty.reduce((sum, item) => sum + item, 0); // 모든 penalty 값 합산
        $('.total-penalty').text(totalPenalty);
        $('.avg-penalty').text(Math.floor(totalPenalty/penalty.length));

        var options5 = {
          series: [
            {
              name: "과태료", // 시리즈 이름 추가
              data: penalty,
            },
          ],
          chart: {
            type: "bar",
            width: "100%",
            height: "85%",
          },
          colors: ["#F95454"],
          plotOptions: {
            bar: {
              borderRadius: 5,
              columnWidth: "40%", // 차트 두께 줄이기 (30%로 설정)
              dataLabels: {
                position: "top", // top, center, bottom
              },
            },
          },
          dataLabels: {
            enabled: true,
            offsetY: -20,
            style: {
              fontSize: "12px",
              colors: ["#304758"],
            },
          },
          xaxis: {
            categories: store,
            labels: {
              style: {
                fontSize: "0.6rem", // X축 라벨 크기 조정
                fontWeight: "bold", // 글자 두께 조정
              },
            },
          },
          yaxis: {
            labels: {
              show: false, // Y축 라벨 숨기기
            },
          },
          grid: {
            show: false, // 배경 그리드 없애기
          },
        };
        var chart5 = new ApexCharts(document.querySelector("#chart5"), options5);
        chart5.render();
      })
});

$(document).ready(function(){
  fetch("/bsnssnp")
      .then(response => response.json())
      .then(data => {
        const store = data.map(item => item.storeNm);
        const bsnSspn = data.map(item => Number(item.bsnSspn) || 0);

        const totalBsnSspn = bsnSspn.reduce((sum, item) => sum + item, 0);
        $('.total-bnsSspn').text(totalBsnSspn);

        const avgBsnSspn = bsnSspn.length > 0 ? Math.floor(totalBsnSspn / bsnSspn.length) : 0;
        $('.avg-bnsSspn').text(avgBsnSspn);

        var options6 = {
          series: [
            {
              name: "영업정지", // 시리즈 이름 추가
              data: bsnSspn,
            },
          ],
          chart: {
            type: "bar",
            width: "100%",
            height: "85%",
          },
          colors: ["#F95454"],
          plotOptions: {
            bar: {
              borderRadius: 5,
              columnWidth: "40%", // 차트 두께 줄이기 (30%로 설정)
              dataLabels: {
                position: "top", // top, center, bottom
              },
            },
          },
          dataLabels: {
            enabled: true,
            offsetY: -20,
            style: {
              fontSize: "12px",
              colors: ["#304758"],
            },
          },
          xaxis: {
            categories: store,
            labels: {
              style: {
                fontSize: "0.6rem", // X축 라벨 크기 조정
                fontWeight: "bold", // 글자 두께 조정
              },
            },
          },
          yaxis: {
            labels: {
              show: false, // Y축 라벨 숨기기
            },
          },
          grid: {
            show: false, // 배경 그리드 없애기
          },
        };

        var chart6 = new ApexCharts(document.querySelector("#chart6"), options6);
        chart6.render();
      })
});

$(document).ready(function () {
  var options7 = {
    series : [
      {
        name: "전체",
        type: "column",
        data: [75, 82, 90, 68, 95, 80, 88, 76, 84, 91, 67], // 예시 데이터
      },
      {
        name: "위생 점검",
        type: "line",
        data: [65, 70, 85, 90, 78, 88, 92, 80, 75, 82, 69], // 예시 데이터
      },
      {
        name: "기획 점검",
        type: "line",
        data: [80, 85, 90, 88, 76, 84, 91, 70, 78, 82, 66], // 예시 데이터
      },
      {
        name: "정기 점검",
        type: "line",
        data: [60, 72, 88, 95, 80, 77, 85, 90, 82, 75, 68], // 예시 데이터
      },
      {
        name: "제품 점검",
        type: "line",
        data: [70, 78, 85, 92, 88, 76, 80, 90, 84, 81, 69], // 예시 데이터
      },
      {
        type: "line",
        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // 예시 데이터
      },
    ],
    chart: {
      height: "90%",
      type: "line", // 기본 차트 타입 설정
      zoom: {
        enabled: false, // 줌 기능 비활성화
      },
    },
    colors: ["#edf0f8", "#008FFB", "#775DD0", "#FE4560", "#FEAF1A"],
    plotOptions: {
      bar: {
        borderRadius: 5,
        dataLabels: {
          position: "top", // top, center, bottom
        },
        colors: {
          backgroundBarOpacity: 1,
          hover: {
            enabled: true,
            color: "#FF4560", // 호버 시 색상 설정
          },
        },
      },
    },
    stroke: {
      width: [0, 3, 3, 3, 3], // 첫 번째 시리즈는 선 너비가 0, 두 번째는 4
    },
    xaxis: {
      categories: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ], // 월별 카테고리
      labels: {
        style: {
          fontSize: "12px", // X축 라벨 크기 조정
          fontWeight: "bold", // 글자 두께 조정
        },
      },
      tooltip: {
        enabled: false,
      },
    },
    grid: {
      show: false,
    },

  };

// 차트 생성
  var chart7 = new ApexCharts(document.querySelector("#chart7"), options7);
  chart7.render();
});


$(document).ready(function(){
  fetch("/not-complete")
      .then(response => response.json())
      .then(data => {
        // 서버에서 받은 데이터를 rowData로 변환
        const rowData = data.map(item => ({
          make: item.mbrNm, // mbrNm을 make로 사용
          model: item.notCompleteCount.toString() // notCompleteCount를 model로 사용
        }));

        // 총합계 계산
        const totalModel = rowData.reduce((sum, item) => sum + Number(item.model), 0);

        // 하단 고정 행 데이터
        const pinnedBottomRowData = [
          { make: "총합계", model: totalModel.toString() }
        ];

        const gridOptions = {
          rowData: rowData,
          columnDefs: [
            {
              field: "make",
              headerName: "구분",
              cellStyle: { textAlign: "center", backgroundColor: "#E7F2FE" },
              headerClass: "header-center",
              suppressMovable: true,
              width: 100,
            },
            {
              field: "model",
              headerName: "미완료건",
              cellStyle: { textAlign: "center" },
              headerClass: "header-center",
              suppressMovable: true,
              width: 100,
            },
          ],
          pinnedBottomRowData: pinnedBottomRowData, // 하단 고정 행 추가
          defaultColDef: {
            flex: 1, // 컬럼 너비 자동 조정
            minWidth: 100,
          },
        };

        // Apply custom CSS styles
        const style = document.createElement("style");
        style.textContent = `
          .header-center .ag-header-cell-label {
            justify-content: center;
          }
        `;
        document.head.append(style);

        const myGridElement = document.querySelector("#myGrid");
        agGrid.createGrid(myGridElement, gridOptions);
      });
});

// 최근 점검 현황 조회
$(document).ready(function() {
  let pageNumber = 1; // 초기 페이지 번호 설정
  let isLoading = false; // 데이터 로딩 중인지 확인하는 플래그

  // 페이지 로드 시 첫 번째 데이터 로드
  loadMoreData();

  // 무한 스크롤 이벤트 추가 (notification-group 스크롤 발생 시)
  $('#card-group').on('scroll', function() {
    if ($(this).scrollTop() + $(this).innerHeight() >= this.scrollHeight && !isLoading) {
      loadMoreData(); // 스크롤이 하단에 도달하면 데이터 로드
    }
  });

  function loadMoreData() {
    isLoading = true; // 로딩 상태를 true로 설정
    fetch(`/recent-inspection?page-number=${pageNumber}`) // pageNumber 변수명 수정
        .then(response => response.json())
        .then(data => {
          if (data && data.length > 0) {
            const resultContainer = $('#card-group');
            data.forEach(item => {
              // 시간 표시 함수 호출
              const timeAgoText = timeAgo(item.inspComplTm);

              const newItem = `
              <div class="noti-card mb-2">
                  <div class="noti-container">
                      <div class="left">
                          <div class="status-ind"></div>
                      </div>
                      <div class="right">
                          <div class="text-wrap">
                              <p class="text-content m-0" style="font: 500 14px 'Noto Sans KR'">
                                  ${item.storeNm}<a class="text-link" href="#" style="font: 500 12px 'Noto Sans KR'; color: #777">(점검자:${item.inspMbrNm})</a> ${item.inspTypeNm} 완료
                              </p>
                              <p class="time mt-1 mb-1" style="font: 500 12px 'Noto Sans KR'">${timeAgoText}</p>
                          </div>
                          <div class="button-wrap">
                            <button class="primary-cta p-0" style="font: 500 12px 'Noto Sans KR'" onclick="getResultPage(${item.inspResultId})">점검 결과</button>
                          </div>
                      </div>
                  </div>
              </div>
            `;
              resultContainer.append(newItem);
            });
            pageNumber++; // 다음 페이지로 증가
          }
          isLoading = false; // 로딩 상태를 false로 설정
        })
        .catch(error => {
          console.error('Error loading data:', error);
          isLoading = false; // 에러 발생 시 로딩 상태 해제
        });
  }
});



function getResultPage(inspResultId) {
  // 팝업 페이지 URL 설정
  const popupUrl = "/qsc/popup/inspection/result"; // 팝업 페이지로 보낼 URL 설정

  // 현재 화면 크기 확인
  const screenWidth =
      window.innerWidth || document.documentElement.clientWidth || screen.width;
  const screenHeight =
      window.innerHeight ||
      document.documentElement.clientHeight ||
      screen.height;

  // 모바일 디바이스 확인 (가로 크기가 768px 이하인 경우)
  const isMobile = screenWidth <= 768;

  // 팝업 창 크기 설정 (화면의 90% 크기 또는 전체 크기)
  const popupWidth = isMobile ? screenWidth : screenWidth * 0.8;
  const popupHeight = isMobile ? screenHeight : screenHeight;

  // 팝업 창의 중앙 위치 계산 (모바일은 무시)
  const screenLeft = window.screenLeft || window.screenX;
  const screenTop = window.screenTop || window.screenY;
  const left = isMobile ? 0 : screenLeft + (screenWidth - popupWidth) / 2;
  const top = isMobile ? 0 : screenTop + (screenHeight - popupHeight) / 2;

  // 팝업 창 옵션 (위치 및 크기 포함)
  const popupOptions = `width=${popupWidth},height=${popupHeight},top=${top},left=${left},scrollbars=yes,resizable=yes`;

  // 팝업 창을 열기
  const popupWindow = window.open("", "_blank", popupOptions);

  // 팝업 창이 열렸는지 확인 후 폼을 팝업 창에서 제출
  if (popupWindow) {
    // 팝업 창에 form을 작성하여 POST 방식으로 데이터를 전송
    const form = popupWindow.document.createElement("form");
    form.method = "POST";
    form.action = popupUrl; // 팝업 창에서 처리할 URL


    // 필요한 데이터를 form에 추가 (필요에 따라 수정 가능)
    const input = popupWindow.document.createElement("input");
    input.type = "hidden";
    input.name = "inspectionContent";
    input.value = inspResultId; // inspResultId는 팝업으로 전송할 데이터

    form.appendChild(input);

    // form을 팝업창에 추가 후 제출
    popupWindow.document.body.appendChild(form);
    form.submit();
  } else {
    alert("팝업 차단이 발생했습니다. 팝업을 허용해 주세요.");
  }
}

// 시간 차이를 계산하는 함수
function timeAgo(inspComplTm) {
  // 받아온 시간 (예: 202411040226)을 Date 객체로 변환
  const inspDate = new Date(
      parseInt(inspComplTm.substring(0, 4)), // 년도
      parseInt(inspComplTm.substring(4, 6)) - 1, // 월 (0-11)
      parseInt(inspComplTm.substring(6, 8)), // 날짜
      parseInt(inspComplTm.substring(8, 10)), // 시간
      parseInt(inspComplTm.substring(10, 12)) // 분
  );

  // 현재 시간 구하기
  const currentTime = new Date();

  // 시간 차이 계산 (밀리초 단위)
  const timeDiff = currentTime - inspDate;

  // 밀리초를 초, 분, 시간, 일 단위로 변환
  const seconds = Math.floor(timeDiff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  // 조건에 따라 다른 형식으로 시간 표시
  if (days > 0) {
    return days === 1 ? "1일 전" : `${days}일 전`;
  } else if (hours > 0) {
    return `${hours}시간 전`;
  } else if (minutes > 0) {
    return `${minutes}분 전`;
  } else {
    return "방금 전";
  }
}