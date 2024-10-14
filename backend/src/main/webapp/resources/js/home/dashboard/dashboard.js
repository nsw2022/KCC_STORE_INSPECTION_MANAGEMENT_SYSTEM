console.log("called")

new Sortable(group, {
    animation: 150,
    ghostClass: "blue-bg",
});


var options1 = {
    series: [7, 3],
    chart: {
        type: 'donut',
        toolbar: {
            show: true,
            tools: {
                download: true,
            },
        },
        height: '80%', // 높이를 100%로 설정하여 반응형으로 만들기
    },
    labels: ['심사완료', '심사 미완료'],
    colors: ['#3274F9', '#D0D5DD'],
    legend: {
        position: 'bottom' // 범례를 하단에 표시
    },
    plotOptions: {
        pie: {
            donut: {
                size: '70%',
                labels: {
                    show: true,
                    total: {
                        show: true,
                        label: '심사완료 / 전체',
                        formatter: function (w) {
                            var completed = w.globals.series[0];
                            var total = w.globals.seriesTotals.reduce((a, b) => a + b, 0);
                            return `${completed} / ${total}`;
                        }
                    }
                }
            }
        }
    },
    responsive: [{
        breakpoint: 400, // 390픽셀 이하일 때
        options: {
            chart: {
                width: '100%', // 너비를 100%로 설정하여 전체 너비를 사용
                height: '300px' // 높이를 조정하여 차트 비율 유지
            },
            legend: {
                position: 'bottom'
            },
            plotOptions: {
                pie: {
                    donut: {
                        size: '60%' // 도넛 크기를 줄여 비율 조정
                    }
                }
            }
        }
    }]
};

var chart1 = new ApexCharts(document.querySelector("#chart1"), options1);
chart1.render();



var options2 = {
    series: [3, 1], // 데이터 배열
    chart: {
        type: 'donut', // 도넛 차트로 설정
        toolbar: {
            show: true, // 기본 툴바 표시
            tools: {
                download: true, // 다운로드 버튼 표시
            },
        },
        height: '80%', // 차트 높이를 100%로 설정하여 반응형으로 만들기
    },
    labels: ['완료', '미완료'], // 각 데이터에 대한 라벨
    colors: ['#3274F9', '#D0D5DD'],
    legend: {
        position: 'bottom' // 범례를 하단에 표시
    },
    plotOptions: {
        pie: {
            donut: {
                size: '70%', // 도넛 두께 설정
                labels: {
                    show: true,
                    total: {
                        show: true,
                        label: '완료 / 전체', // 중앙 텍스트
                        formatter: function (w) {
                            var completed = w.globals.series[0]; // 완료 (첫 번째 시리즈)
                            var total = w.globals.seriesTotals.reduce((a, b) => a + b, 0); // 전체 합계
                            return `${completed} / ${total}`; // "완료 / 전체" 형식으로 반환
                        }
                    }
                }
            }
        }
    },
    responsive: [{
        breakpoint: 400, // 390픽셀 이하일 때
        options: {
            chart: {
                width: '100%', // 너비를 100%로 설정하여 전체 너비를 사용
                height: '300px' // 높이를 조정하여 차트 비율 유지
            },
            legend: {
                position: 'bottom' // 작은 화면에서도 범례를 하단에 표시
            },
            plotOptions: {
                pie: {
                    donut: {
                        size: '60%' // 도넛 크기를 줄여 비율 조정
                    }
                }
            }
        }
    }]
};

var chart2 = new ApexCharts(document.querySelector("#chart2"), options2);
chart2.render();


var options3 = {
    series: [{
        name: '점수', // 시리즈 이름 추가
        data: [81, 88]
    }],
    chart: {
        type: 'bar',
        height: 350
    },
    plotOptions: {
        bar: {
            borderRadius: 5,
            columnWidth: '30%', // 차트 두께 줄이기 (30%로 설정)
            dataLabels: {
                position: 'top', // top, center, bottom
            },
        }
    },
    dataLabels: {
        enabled: true,
        offsetY: -20,
        style: {
            fontSize: '12px',
            colors: ["#304758"]
        }
    },
    colors: ['#3274F9'],
    xaxis: {
        categories: ["전체 매장", "담당 매장"],
        labels: {
            style: {
                fontSize: '13px', // X축 라벨 크기 조정
                fontWeight: 'bold', // 글자 두께 조정
            }
        }
    },
    yaxis: {
        labels: {
            show: false // Y축 라벨 숨기기
        }
    },
    grid: {
        show: false // 배경 그리드 없애기
    }
};

var chart3 = new ApexCharts(document.querySelector("#chart3"), options3);
chart3.render();


var options4 = {
    series: [44, 55, 13, 43, 22],
    chart: {
        width: '100%', // 기본 차트 너비를 100%로 설정하여 반응형으로 만들기
        type: 'pie',
        height: '80%', // 기본 차트 높이를 100%로 설정
    },

    labels: ['S', 'A', 'B', 'C', 'D'],

    legend: {
        position: 'bottom' // 범례를 하단에 표시
    },
    responsive: [{
        breakpoint: 400, // 390픽셀 이하일 때
        options: {
            chart: {
                width: '100%', // 너비를 100%로 설정하여 전체 너비를 사용
                height: '300px' // 높이를 조정하여 차트 비율 유지
            },
            legend: {
                position: 'bottom' // 작은 화면에서도 범례를 하단에 표시
            }
        }
    }]
};

var chart4 = new ApexCharts(document.querySelector("#chart4"), options4);
chart4.render();




var options5 = {
    series: [{
        name: '과태료', // 시리즈 이름 추가
        data: [80, 50, 70]
    }],
    chart: {
        type: 'bar',
        height: 350,
    },
    colors: ['#F95454'],
    plotOptions: {
        bar: {
            borderRadius: 5,
            columnWidth: '30%', // 차트 두께 줄이기 (30%로 설정)
            dataLabels: {
                position: 'top', // top, center, bottom
            },

        },
    },
    dataLabels: {
        enabled: true,
        offsetY: -20,
        style: {
            fontSize: '12px',
            colors: ['#304758'],
        }
    },
    xaxis: {
        categories: ["혜화", "동대문", "서울역"],
        labels: {
            style: {
                fontSize: '13px', // X축 라벨 크기 조정
                fontWeight: 'bold', // 글자 두께 조정
            }
        }
    },
    yaxis: {
        labels: {
            show: false // Y축 라벨 숨기기
        }
    },
    grid: {
        show: false // 배경 그리드 없애기
    }
};

var chart5 = new ApexCharts(document.querySelector("#chart5"), options5);
chart5.render();

var options6 = {
    series: [{
        name: '영업정지', // 시리즈 이름 추가
        data: [14, 14, 7, 21, 10]
    }],
    chart: {
        type: 'bar',
        height: 350,
    },
    colors: ['#F95454'],
    plotOptions: {
        bar: {
            borderRadius: 5,
            columnWidth: '30%', // 차트 두께 줄이기 (30%로 설정)
            dataLabels: {
                position: 'top', // top, center, bottom
            },

        },
    },
    dataLabels: {
        enabled: true,
        offsetY: -20,
        style: {
            fontSize: '12px',
            colors: ['#304758'],
        }
    },
    xaxis: {
        categories: ["혜화", "동대문", "서울역", "성균관대", "대학로"],
        labels: {
            style: {
                fontSize: '13px', // X축 라벨 크기 조정
                fontWeight: 'bold', // 글자 두께 조정
            }
        }
    },
    yaxis: {
        labels: {
            show: false // Y축 라벨 숨기기
        }
    },
    grid: {
        show: false // 배경 그리드 없애기
    }
};

var chart6 = new ApexCharts(document.querySelector("#chart6"), options6);
chart6.render();



var options7 = {
    series: [{
        name: '전체 매장',
        type: 'column',
        data: [70, 75, 70, 90, 95, 99, 100, 94, 98, 87, 86, 90] // 담당 매장 점수 데이터
    }, {
        name: '담당 매장',
        type: 'line',
        data: [85, 80, 80, 85, 90, 92, 98, 88, 90, 86, 84, 89] // 전체 매장 점수 데이터 (예시)
    }],
    chart: {
        height: 350,
        type: 'line', // 기본 차트 타입 설정

        zoom: {
            enabled: false // 줌 기능 비활성화
        }
    },
    colors: ['#D0D5DD', '#3274F9'],
    plotOptions: {
        bar: {
            borderRadius: 5,
            dataLabels: {
                position: 'top', // top, center, bottom
            },
            colors: {


                backgroundBarOpacity: 1,
                hover: {
                    enabled: true,
                    color: '#FF4560' // 호버 시 색상 설정
                }
            }
        }
    },
    stroke: {
        width: [0, 4] // 첫 번째 시리즈는 선 너비가 0, 두 번째는 4
    },
    tooltip: {
        shared: false, // 각 시리즈별로 개별 정보 제공
    },
    dataLabels: {
        enabled: true,
        enabledOnSeries: [1]
    },
    xaxis: {
        categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"], // 월별 카테고리
        tooltip: {
            enabled: false
        }
    },
    grid: {
        show: false
    },
};

var chart7 = new ApexCharts(document.querySelector("#chart7"), options7);
chart7.render();
