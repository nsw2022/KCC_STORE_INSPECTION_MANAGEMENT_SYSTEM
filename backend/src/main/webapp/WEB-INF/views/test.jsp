<%@ page language="java" contentType="text/html; charset=UTF-8"
         pageEncoding="UTF-8" %>

<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <title>경로 결과 표시</title>
    <style>
        /* 기존 스타일 유지 */
        body {
            font-family: Arial, sans-serif;
        }

        #map {
            width: 100%;
            height: 500px;
            margin-bottom: 20px;
        }

        #routeTable {
            width: 100%;
            border-collapse: collapse;
        }

        #routeTable th, #routeTable td {
            border: 1px solid #ddd;
            padding: 8px;
        }

        #routeTable th {
            background-color: #f2f2f2;
            text-align: center;
        }

        #routeTable td {
            text-align: center;
        }

        /* 로딩 스피너 스타일 */
        #loadingSpinner {
            display: none;
            position: fixed;
            z-index: 9999;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
        }

        /* 에러 메시지 스타일 */
        #errorMessage {
            color: red;
            margin-bottom: 20px;
            display: none;
        }

        /* 버튼 컨테이너 스타일 */
        #buttonContainer {
            margin-bottom: 20px;
        }

        #buttonContainer button {
            margin-right: 10px;
            padding: 10px 20px;
            font-size: 16px;
        }

        /* 주소 입력 필드 스타일 */
        #addressContainer {
            margin-bottom: 20px;
        }

        #addressContainer input {
            width: 300px;
            padding: 8px;
            margin-right: 10px;
            font-size: 16px;
        }

        /* 교통 레이어 컨트롤 버튼 스타일 */
        #trafficControlContainer {
            position: absolute;
            top: 10px;
            right: 10px;
            background: white;
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 4px;
            box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
            z-index: 1000;
        }

        #trafficControlContainer button {
            display: block;
            width: 100%;
            padding: 8px;
            margin-bottom: 10px;
            font-size: 14px;
            cursor: pointer;
        }

        #trafficControlContainer label {
            display: flex;
            align-items: center;
            font-size: 14px;
            cursor: pointer;
        }

        #trafficControlContainer input[type="checkbox"] {
            margin-right: 5px;
        }

        /* 경로 토글 컨트롤 버튼 스타일 */
        #routeControlContainer {
            position: absolute;
            top: 10px;
            right: 150px; /* 교통 레이어 컨트롤과 겹치지 않도록 위치 조정 */
            background: white;
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 4px;
            box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
            z-index: 1000;
        }

        #routeControlContainer button {
            display: block;
            width: 100%;
            padding: 8px;
            font-size: 14px;
            cursor: pointer;
        }

        /* **선택 사항: 총계 행 스타일링** */
        .total-row {
            font-weight: bold;
            background-color: #f9f9f9;
        }
    </style>
    <!-- Naver Maps API 스크립트 (API 키 필요) -->
    <script type="text/javascript"
            src="https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${naverClientId}&submodules=panorama,geocoder"
            defer></script>
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
</head>
<body>

<!-- 로딩 스피너 -->
<div id="loadingSpinner">
    <img src="https://i.imgur.com/llF5iyg.gif" alt="Loading...">
</div>

<!-- 에러 메시지 -->
<div id="errorMessage"></div>

<!-- 교통 레이어 컨트롤 -->
<div id="trafficControlContainer">
    <button id="traffic">교통 정보 토글</button>
    <label>
        <input type="checkbox" id="autorefresh">
        자동 새로고침
    </label>
</div>

<!-- 경로 토글 컨트롤 -->
<div id="routeControlContainer">
    <button id="toggleRouteBtn">경로 숨기기</button>
</div>

<!-- 지도 표시 영역 -->
<div id="map"></div>

<!-- 주소 입력 필드 -->
<div id="addressContainer">
    <input type="text" id="addressStart" placeholder="시작 주소 입력">
    <button id="saveStartBtn">시작 주소 저장</button>
</div>
<div id="addressContainer">
    <input type="text" id="addressList" placeholder="목적지 주소 목록 입력 (':'로 구분)">
    <button id="searchDestBtn">목적지 검색</button>
</div>

<!-- 버튼 컨테이너 -->
<div id="buttonContainer">
    <button id="searchRouteBtn">경로 검색</button>
    <button id="testBtn">테스트</button>
</div>

<!-- 경로 결과 테이블 -->
<table id="routeTable">
    <thead>
    <tr>
        <th>출발지</th>
        <th>목적지</th>
        <th>거리 (m)</th>
        <th>소요 시간 (분)</th>
    </tr>
    </thead>
    <tbody id="routeTableBody">
    <!-- 동적으로 채워질 내용 -->
    </tbody>
</table>

<script>
    // 모든 스크립트를 DOMContentLoaded 이벤트 내에 넣습니다.
    document.addEventListener("DOMContentLoaded", function () {
        // 글로벌 변수 선언
        var map = null;
        var polylines = [];
        // 혼잡도 색상 매핑 제거 또는 사용하지 않도록 설정
        // var congestionColorMap = { ... };

        // 마커 관리 변수
        var searchMarkers = []; // 목적지 검색 마커
        var initialMarkers = []; // 초기 마커
        var startMarker = null;
        var endMarker = null;
        var waypointMarkers = [];

        // 마커 아이콘 설정 변수
        var startIcon, endIcon, waypointIcon;

        // 트래픽 레이어 및 관련 변수
        var trafficLayer = null;
        var trafficInterval = 300000; // 5분 (300,000 밀리초)

        // 경로 표시 상태
        var routesVisible = true;

        // Naver Maps API 로드 완료 시 실행되는 함수
        naver.maps.onJSContentLoaded = function () {
            // 마커 아이콘 설정 (기본 아이콘 사용)
            startIcon = {
                url: 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png', // 출발지용 아이콘 URL
                size: new naver.maps.Size(24, 37),
                origin: new naver.maps.Point(0, 0),
                anchor: new naver.maps.Point(12, 37)
            };

            endIcon = {
                url: 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerRed.png', // 도착지용 아이콘 URL
                size: new naver.maps.Size(24, 37),
                origin: new naver.maps.Point(0, 0),
                anchor: new naver.maps.Point(12, 37)
            };

            waypointIcon = {
                url: 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/waypoint.png', // 경유지용 아이콘 URL
                size: new naver.maps.Size(24, 37),
                origin: new naver.maps.Point(0, 0),
                anchor: new naver.maps.Point(12, 37)
            };
        }

        /**
         * Naver Maps API가 로드된 후 호출되는 콜백 함수
         */
        function initMap() {
            var mapOptions = {
                center: new naver.maps.LatLng(37.3089449, 126.8367496),
                zoom: 14,
                mapTypeId: naver.maps.MapTypeId.NORMAL,
                scaleControl: true,
                zoomControl: true,
                zoomControlOptions: {
                    position: naver.maps.Position.TOP_RIGHT
                }
            };
            map = new naver.maps.Map('map', mapOptions);

            // 트래픽 레이어 초기화
            trafficLayer = new naver.maps.TrafficLayer({
                interval: trafficInterval // 5분마다 새로고침
            });

            // 초기 트래픽 레이어 설정 (지도를 로드할 때 트래픽 레이어를 추가)
            trafficLayer.setMap(map);

            // 지도 클릭 이벤트
            naver.maps.Event.addListener(map, 'click', function (e) {
                alert('현좌표 (left click): ' + e.coord.x + '-' + e.coord.y);
            });

            // 지도 오른쪽 클릭 이벤트
            naver.maps.Event.addListener(map, 'rightclick', function (e) {
                naver.maps.Service.reverseGeocode({
                    coords: new naver.maps.LatLng(e.coord.y, e.coord.x)
                }, function (status, response) {
                    if (status !== naver.maps.Service.Status.OK) {
                        return alert('주소 검색에 실패했습니다.');
                    }
                    var result = response.v2.address;
                    alert('현주소 (right click): ' + result.jibunAddress);
                });
            });

            // 이벤트 리스너 설정
            setupEventListeners();
        }

        // initMap 함수 호출
        initMap();

        /**
         * jQuery 이벤트 리스너 설정
         */
        function setupEventListeners() {
            $('#saveStartBtn').click(function () {
                var startAddress = $('#addressStart').val();
                if (startAddress.trim() === "") {
                    alert("시작 주소를 입력해주세요.");
                    return;
                }
                // 시작 주소 저장 로직 (필요시)
                alert("시작 주소가 저장되었습니다.");
            });

            $('#searchDestBtn').click(function () {
                var addressList = $('#addressList').val();
                if (addressList.trim() === "") {
                    alert("목적지 주소 목록을 입력해주세요.");
                    return;
                }
                // 주소 목록 검색 및 지도에 마커 표시
                searchAddresses(addressList);
            });

            $('#searchRouteBtn').click(function () {
                searchRoute();
            });

            $('#testBtn').click(function () {
                testDrivingRoute();
            });

            // 트래픽 레이어 토글 버튼 이벤트
            $('#traffic').on("click", function (e) {
                e.preventDefault();
                toggleTrafficLayer();
            });

            // 자동 새로고침 체크박스 이벤트
            $("#autorefresh").on("click", function (e) {
                var btn = $(this),
                    checked = btn.is(":checked");

                if (checked) {
                    trafficLayer.startAutoRefresh();
                } else {
                    trafficLayer.endAutoRefresh();
                }
            });

            // 경로 토글 버튼 이벤트 추가
            $('#toggleRouteBtn').on("click", function (e) {
                e.preventDefault();
                toggleRoutesVisibility();
            });
        }

        /**
         * 주소 목록을 지오코딩하여 마커 표시
         */
        function searchAddresses(addressList) {
            var addresses = addressList.split(':').map(function (addr) { // ':'로 분리
                return addr.trim();
            }).filter(function (addr) {
                return addr !== "";
            });
            if (addresses.length === 0) {
                alert("유효한 목적지 주소가 없습니다.");
                return;
            }
            addresses.forEach(function (address, index) {
                callNaverAddressService(address, index + 1);
            });
        }

        /**
         * 주소를 좌표로 변환하고 마커 추가
         */
        function callNaverAddressService(address, index) {
            $.ajax({
                url: '/api/map/GetCoordinates', // 경로 수정: '/Map/GetCoordinates' -> '/api/map/GetCoordinates'
                method: 'POST',
                contentType: 'application/json',
                data: JSON.stringify({ address: address }),
                success: function (response) {
                    if (response.status === 200) {
                        var data = response.data;
                        var lat = parseFloat(data.y);
                        var lng = parseFloat(data.x);
                        var marker = new naver.maps.Marker({
                            position: new naver.maps.LatLng(lat, lng),
                            map: map,
                            title: '목적지 ' + index // '목적지' + index
                            // icon: 기본 아이콘 사용
                        });
                        searchMarkers.push(marker); // 목적지 마커 배열에 추가
                        map.setCenter(new naver.maps.LatLng(lat, lng));
                    } else {
                        alert('주소 검색에 실패했습니다: ' + response.message);
                    }
                },
                error: function () {
                    alert('서버 오류가 발생했습니다.');
                }
            });
        }

        /**
         * 서버로부터 경로 정보를 받아 지도에 표시
         */
        function callSearchRoute(startX, startY, goals, viaPoints) {
            $.ajax({
                url: '/api/map/SearchRoute', // 경로 수정: '/Map/SearchRoute' -> '/api/map/SearchRoute'
                method: 'POST',
                contentType: 'application/json',
                data: JSON.stringify({
                    start: { x: startX, y: startY },
                    addressList: getGoalList(goals),
                    viaPoints: viaPoints.map(function (point) {
                        return { x: point.x, y: point.y };
                    }) // 서버에서 받은 경유지 목록을 전달
                }),
                success: function (response) {
                    console.log("SearchRoute Response:", response); // 디버깅용 로그
                    if (response.code === 0 && response.route && response.route.trafast) {
                        var routes = response.route.trafast; // 'trafast' 배열을 routes로 설정
                        displayRouteResults(routes);
                        // drawRouteOnMap(routes); // 이제 displayRouteResults에서 경로를 그리므로 주석 처리
                    } else {
                        alert('경로 검색에 실패했습니다: ' + (response.message || 'Unknown Error'));
                        console.error("SearchRoute Error:", response);
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    alert('서버 오류가 발생했습니다.');
                    console.error("SearchRoute AJAX Error:", textStatus, errorThrown);
                }
            });
        }

        /**
         * 목적지 목록을 ':'로 구분된 문자열로 변환
         */
        function getGoalList(goals) {
            return goals.map(function (goal) {
                return goal.x + "," + goal.y;
            }).join(":");
        }

        /**
         * 경유지 목록을 JSON 배열로 변환 (필요 시)
         * 현재 예시에서는 별도의 경유지 목록을 유지하고 있지 않으므로, 빈 배열 반환
         */
        function getViaPointsList() {
            // 필요 시 경유지 목록을 반환하도록 수정
            return [];
        }

        /**
         * 경로 검색 및 지도에 경로 표시
         */
        function searchRoute() {
            var startAddress = $('#addressStart').val().trim();
            var addressList = $('#addressList').val().trim();

            if (startAddress === "" || addressList === "") {
                alert("시작 주소와 목적지 주소 목록을 모두 입력해주세요.");
                return;
            }

            // 시작 주소를 먼저 지오코딩하여 좌표를 가져옵니다.
            $.ajax({
                url: '/api/map/GetCoordinates', // 경로 수정: '/Map/GetCoordinates' -> '/api/map/GetCoordinates'
                method: 'POST',
                contentType: 'application/json',
                data: JSON.stringify({ address: startAddress }),
                success: function (startResponse) {
                    console.log("GetCoordinates (Start) Response:", startResponse); // 디버깅용 로그
                    if (startResponse.status === 200) {
                        var startData = startResponse.data;
                        var startX = parseFloat(startData.x);
                        var startY = parseFloat(startData.y);

                        // 목적지 주소 목록을 ':'로 구분하여 좌표 수집
                        var addresses = addressList.split(':').map(function (addr) {
                            return addr.trim();
                        }).filter(function (addr) {
                            return addr !== "";
                        });
                        if (addresses.length === 0) {
                            alert("유효한 목적지 주소가 없습니다.");
                            return;
                        }

                        var goals = [];
                        var processed = 0;
                        var failed = false;

                        addresses.forEach(function (address, index) {
                            $.ajax({
                                url: '/api/map/GetCoordinates', // 경로 수정: '/Map/GetCoordinates' -> '/api/map/GetCoordinates'
                                method: 'POST',
                                contentType: 'application/json',
                                data: JSON.stringify({ address: address }),
                                success: function (destResponse) {
                                    console.log("GetCoordinates (Destination) Response:", destResponse); // 디버깅용 로그
                                    if (destResponse.status === 200) {
                                        var destData = destResponse.data;
                                        goals.push({ x: destData.x, y: destData.y });
                                    } else {
                                        alert('주소 검색에 실패했습니다: ' + destResponse.message);
                                        failed = true;
                                    }
                                    processed++;
                                    if (processed === addresses.length && !failed) {
                                        // 모든 목적지 주소가 처리된 후 경로 검색
                                        callSearchRoute(startX, startY, goals, getViaPointsList()); // 필요 시 viaPoints를 추가
                                    }
                                },
                                error: function () {
                                    alert('서버 오류가 발생했습니다.');
                                    processed++;
                                    if (processed === addresses.length && !failed) {
                                        // 모든 목적지 주소가 처리된 후 경로 검색
                                        callSearchRoute(startX, startY, goals, getViaPointsList()); // 필요 시 viaPoints를 추가
                                    }
                                }
                            });
                        });
                    } else {
                        alert('시작 주소 검색에 실패했습니다: ' + startResponse.message);
                        console.error("GetCoordinates (Start) Error:", startResponse);
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    alert('서버 오류가 발생했습니다.');
                    console.error("GetCoordinates (Start) AJAX Error:", textStatus, errorThrown);
                }
            });
        }

        /**
         * 테스트용 메서드: 고정된 좌표로 최적화된 경로 계산
         */
        function testDrivingRoute() {
            $.ajax({
                url: '/api/map/test-driving-route', // 경로 수정: '/Map/TestDrivingRoute' -> '/api/map/test-driving-route'
                method: 'GET',
                success: function (response) {
                    console.log("TestDrivingRoute Response:", response); // 디버깅용 로그
                    if (response.code === 0 && response.route && response.route.trafast) {
                        var routes = response.route.trafast;
                        displayRouteResults(routes);
                        // drawRouteOnMap(routes); // 이제 displayRouteResults에서 경로를 그리므로 주석 처리

                        // 지도 중심을 첫 번째 경로의 출발지로 이동
                        if (routes.length > 0) {
                            var firstRoute = routes[0];
                            var startCoordinates = firstRoute.summary.start.location;
                            map.setCenter(new naver.maps.LatLng(startCoordinates[1], startCoordinates[0]));
                        }

                        alert("테스트 경로가 정상적으로 조회되었습니다.");
                    } else {
                        alert('테스트 경로 검색에 실패했습니다: ' + (response.message || 'Unknown Error'));
                        console.error("TestDrivingRoute Error:", response);
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    alert('서버 오류가 발생했습니다.');
                    console.error("TestDrivingRoute AJAX Error:", textStatus, errorThrown);
                }
            });
        }

        /**
         * 마커와 정보창을 추가하는 함수
         * @param {Object} options - 마커 옵션
         */
        function addMarker(options) {
            var marker = new naver.maps.Marker({
                map: map,
                position: options.position,
                title: options.title,
                icon: options.icon || null
            });

            if (options.infoWindow) {
                var infowindow = new naver.maps.InfoWindow({
                    content: options.infoWindow.content,
                    backgroundColor: options.infoWindow.backgroundColor || '#fff',
                    borderColor: options.infoWindow.borderColor || '#ccc',
                    borderWidth: options.infoWindow.borderWidth || 1,
                    anchorSize: options.infoWindow.anchorSize || new naver.maps.Size(10, 10),
                    anchorSkew: options.infoWindow.anchorSkew || true
                });

                naver.maps.Event.addListener(marker, 'click', function (e) {
                    infowindow.open(map, marker);
                });
            }

            return marker;
        }

        /**
         * 출발지 마커 추가 함수
         */
        function addStartMarker(coordinates) {
            console.log("Adding Start Marker at:", coordinates);
            if (startMarker) {
                startMarker.setMap(null);
            }

            startMarker = addMarker({
                position: new naver.maps.LatLng(coordinates.y, coordinates.x), // y, x
                title: '출발지',
                icon: startIcon,
                infoWindow: {
                    content: '<div style="padding:5px;">출발지</div>'
                }
            });
        }

        /**
         * 도착지 마커 추가 함수
         */
        function addEndMarker(coordinates) {
            console.log("Adding End Marker at:", coordinates);
            if (endMarker) {
                endMarker.setMap(null);
            }

            endMarker = addMarker({
                position: new naver.maps.LatLng(coordinates.y, coordinates.x), // y, x
                title: '도착지',
                icon: endIcon,
                infoWindow: {
                    content: '<div style="padding:5px;">도착지</div>'
                }
            });
        }

        /**
         * 경유지 마커 추가 함수
         */
        function addWaypointMarkers(viaPoints) {
            console.log("Adding Waypoint Markers:", viaPoints);
            $.each(waypointMarkers, function (index, marker) {
                marker.setMap(null);
            });
            waypointMarkers = [];

            $.each(viaPoints, function (index, point) {
                if (point.location && point.location.length === 2) {
                    var markerTitle = '목적지 ' + (index + 1); // 'Destination'을 '목적지'로 변경

                    var marker = addMarker({
                        position: new naver.maps.LatLng(point.location[1], point.location[0]), // y, x
                        title: markerTitle,
                        icon: waypointIcon,
                        infoWindow: {
                            content: '<div style="padding:5px;">' + markerTitle + '</div>'
                        }
                    });
                    waypointMarkers.push(marker);
                } else {
                    console.error("Invalid waypoint location:", point.location);
                }
            });
        }

        /**
         * 좌표로부터 주소를 가져오는 함수
         * @param {Object} coordinates - {x, y} 형식의 좌표 객체
         * @returns {Promise<string>} - 주소 문자열
         */
        function getAddressFromCoordinates(coordinates) {
            // 주석 처리: 지오코드 관련 기능 비활성화
            /*
            return new Promise(function(resolve, reject) {
                $.ajax({
                    url: '/api/map/reverse-geocode',
                    method: 'POST',
                    contentType: 'application/json',
                    data: JSON.stringify({
                        x: coordinates.x,
                        y: coordinates.y
                    }),
                    dataType: 'json',
                    success: function (response) {
                        if (response.address) {
                            resolve(response.address);
                        } else {
                            resolve("Unknown Address");
                        }
                    },
                    error: function (xhr, status, error) {
                        console.error("역지오코딩 오류:", error);
                        resolve("Unknown Address"); // 실패 시에도 테이블 표시를 위해 Unknown Address 반환
                    }
                });
            });
            */
            // 대신, 임의의 주소 반환 (필요에 따라 수정 가능)
            return Promise.resolve("목적지");
        }

        /**
         * 경로 결과를 테이블에 표시하고 마커 및 구간별 폴리라인 추가
         * @param {Array} routes - 경로 배열 (trafast 배열의 요소들)
         */
        function displayRouteResults(routes) {
            console.log("총경로 수 = " + routes.length);
            console.log("Routes:", routes);
            $('#routeTableBody').empty();
            showLoading();
            hideError();

            // 기존 폴리라인 제거
            polylines.forEach(function (polyline) {
                polyline.setMap(null);
            });
            polylines = [];

            // 기존 마커 제거 (출발지, 도착지, 경유지)
            if (startMarker) startMarker.setMap(null);
            if (endMarker) endMarker.setMap(null);
            waypointMarkers.forEach(function (marker) {
                marker.setMap(null);
            });
            waypointMarkers = [];

            // 총계 변수 선언 및 초기화
            var totalDistance = 0; // 전체 거리 (m)
            var totalDuration = 0; // 전체 소요 시간 (분)

            // 색상 매핑: 혼잡도에 따른 색상 지정
            const congestionColors = {
                0: "#00FF00", // 원활 (녹색)
                1: "#FFA500", // 보통 (주황색)
                2: "#FF0000"  // 혼잡 (빨간색)
            };

            // 색상 매핑 확인
            console.log("Congestion Colors:", congestionColors);

            // 경로별로 처리 (현재 응답에는 단일 경로만 포함됨)
            routes.forEach(function (route, routeIndex) {
                var summary = route.summary;
                var startLocation = summary.start.location; // [x, y]
                var goalLocation = summary.goal.location; // [x, y]
                var waypoints = summary.waypoints || [];
                var sections = route.section || [];
                var path = route.path; // 전체 경로 포인트

                // route.path 유효성 검사
                if (!path || !Array.isArray(path)) {
                    console.warn(`Route ${routeIndex + 1}: path 데이터가 유효하지 않습니다.`);
                    return;
                }

                console.log(`Route ${routeIndex + 1} Path Length: ${path.length}`);

                console.log("Processing route:", routeIndex + 1);

                // 마커 추가
                addStartMarker({ x: startLocation[0], y: startLocation[1] });
                addEndMarker({ x: goalLocation[0], y: goalLocation[1] });
                addWaypointMarkers(waypoints);

                // 테이블에 각 구간 추가
                if (waypoints.length > 0) {
                    var firstWaypoint = waypoints[0];
                    var row1 = '<tr>' +
                        '<td>출발지</td>' +
                        '<td>목적지 1</td>' +
                        '<td>' + firstWaypoint.distance.toLocaleString() + ' m</td>' +
                        '<td>' + Math.round(firstWaypoint.duration / 60000) + ' 분</td>' +
                        '</tr>';
                    $('#routeTableBody').append(row1);

                    // 총계 업데이트
                    totalDistance += firstWaypoint.distance;
                    totalDuration += Math.round(firstWaypoint.duration / 60000);

                    // 목적지1 → 목적지2, ..., 목적지N-1 → 목적지N
                    for (var i = 1; i < waypoints.length; i++) {
                        var currentWaypoint = waypoints[i];
                        var previousWaypoint = waypoints[i - 1];
                        var row = '<tr>' +
                            '<td>목적지 ' + i + '</td>' +
                            '<td>목적지 ' + (i + 1) + '</td>' +
                            '<td>' + currentWaypoint.distance.toLocaleString() + ' m</td>' +
                            '<td>' + Math.round(currentWaypoint.duration / 60000) + ' 분</td>' +
                            '</tr>';
                        $('#routeTableBody').append(row);

                        // 총계 업데이트
                        totalDistance += currentWaypoint.distance;
                        totalDuration += Math.round(currentWaypoint.duration / 60000);
                    }

                    // 마지막 목적지 → 도착지
                    var lastWaypoint = waypoints[waypoints.length - 1];
                    var rowLast = '<tr>' +
                        '<td>목적지 ' + waypoints.length + '</td>' +
                        '<td>도착지</td>' +
                        '<td>' + summary.goal.distance.toLocaleString() + ' m</td>' +
                        '<td>' + Math.round(summary.goal.duration / 60000) + ' 분</td>' +
                        '</tr>';
                    $('#routeTableBody').append(rowLast);

                    // 총계 업데이트
                    totalDistance += summary.goal.distance;
                    totalDuration += Math.round(summary.goal.duration / 60000);
                } else {
                    // 경유지가 없을 경우 출발지 → 도착지
                    var row = '<tr>' +
                        '<td>출발지</td>' +
                        '<td>도착지</td>' +
                        '<td>' + summary.goal.distance.toLocaleString() + ' m</td>' +
                        '<td>' + Math.round(summary.goal.duration / 60000) + ' 분</td>' +
                        '</tr>';
                    $('#routeTableBody').append(row);

                    // 총계 업데이트
                    totalDistance += summary.goal.distance;
                    totalDuration += Math.round(summary.goal.duration / 60000);
                }

                // 구간별 폴리라인 그리기
                if (sections.length > 0) {
                    // 구간을 정렬하여 순차적으로 처리
                    sections.sort((a, b) => a.pointIndex - b.pointIndex);

                    let currentIdx = 0; // 현재 위치 인덱스

                    sections.forEach(function (section, sectionIndex) {
                        // 섹션 시작과 끝 인덱스
                        var sectionStart = section.pointIndex;
                        var sectionEnd = sectionStart + section.pointCount;

                        // 비혼잡 구간: 현재 인덱스와 섹션 시작 사이
                        if (currentIdx < sectionStart) {
                            var nonCongestedPathCoords = path.slice(currentIdx, sectionStart);
                            if (nonCongestedPathCoords.length > 1) {
                                var nonCongestedPath = nonCongestedPathCoords.map(function (coords) {
                                    return new naver.maps.LatLng(coords[1], coords[0]); // y, x
                                });

                                var nonCongestedPolyline = new naver.maps.Polyline({
                                    map: routesVisible ? map : null,
                                    path: nonCongestedPath,
                                    strokeColor: "#00FF00", // 기본 색상: 파란색
                                    strokeOpacity: 0.7,
                                    strokeWeight: 5
                                });

                                polylines.push(nonCongestedPolyline);
                                console.log(`Non-Congested Segment ${currentIdx} to ${sectionStart}:`, nonCongestedPolyline);
                            }
                        }

                        // 혼잡 구간: 섹션 시작과 끝 사이
                        var pathCoordinates = path.slice(sectionStart, sectionEnd + 1); // endIdx 포함

                        // 좌표가 유효한지 확인
                        if (sectionStart < 0 || sectionEnd >= path.length) {
                            console.warn(`Section ${sectionIndex + 1}: Invalid pointIndex (${sectionStart}) or pointCount (${section.pointCount}).`);
                            return;
                        }

                        // 섹션 객체 전체를 콘솔에 출력하여 congestion 값 확인
                        console.log(`Section ${sectionIndex + 1} Details:`, section);

                        var congestion = Number(section.congestion); // 문자열일 경우 숫자로 변환
                        var color = congestionColors[congestion] || "#00FF00"; // 기본 색상: 파란색

                        // 콘솔에 색상 출력 (디버깅용)
                        console.log(`Section ${sectionIndex + 1}: 색상 - ${color}, 혼잡도 - ${congestion}`);

                        // 변수를 다른 이름으로 변경하여 변수 충돌 방지
                        var polylinePath = pathCoordinates.map(function (coords) {
                            return new naver.maps.LatLng(coords[1], coords[0]); // y, x
                        });

                        var polyline = new naver.maps.Polyline({
                            map: routesVisible ? map : null,
                            path: polylinePath,
                            strokeColor: color,
                            strokeOpacity: 0.7,
                            strokeWeight: 5 // 두께 조정 (필요시 변경)
                        });

                        polylines.push(polyline);
                        console.log(`Section ${sectionIndex + 1} Polyline:`, polyline);

                        // 현재 인덱스를 섹션 끝으로 이동
                        currentIdx = sectionEnd + 1;
                    });

                    // 마지막 구간 이후의 비혼잡 구간 처리
                    if (currentIdx < path.length) {
                        var remainingPathCoords = path.slice(currentIdx, path.length);
                        if (remainingPathCoords.length > 1) {
                            var remainingPath = remainingPathCoords.map(function (coords) {
                                return new naver.maps.LatLng(coords[1], coords[0]); // y, x
                            });

                            var remainingPolyline = new naver.maps.Polyline({
                                map: routesVisible ? map : null,
                                path: remainingPath,
                                strokeColor: "#00FF00", // 기본 색상: 파란색
                                strokeOpacity: 0.7,
                                strokeWeight: 5
                            });

                            polylines.push(remainingPolyline);
                            console.log(`Remaining Non-Congested Segment ${currentIdx} to ${path.length}:`, remainingPolyline);
                        }
                    }
                } else {
                    // 구간이 없을 경우 전체 경로를 기본 색상으로 그리기
                    var fullPath = path.map(function (coords) {
                        return new naver.maps.LatLng(coords[1], coords[0]); // y, x
                    });

                    var polyline = new naver.maps.Polyline({
                        map: routesVisible ? map : null,
                        path: fullPath,
                        strokeColor: "#00FF00", // 기본 색상: 파란색
                        strokeOpacity: 0.7,
                        strokeWeight: 5
                    });

                    polylines.push(polyline);
                    console.log(`Full Path Polyline:`, polyline);
                }
            }); // routes.forEach 끝

            // 총계 행 추가
            var totalRow = '<tr class="total-row">' +
                '<td colspan="2">총계</td>' +
                '<td>' + totalDistance.toLocaleString() + ' m</td>' +
                '<td>' + totalDuration.toLocaleString() + ' 분</td>' +
                '</tr>';
            $('#routeTableBody').append(totalRow);

            // 지도 범위 조정 (전체 마커를 포함하도록)
            adjustMapBounds();

            hideLoading();
        }

        /**
         * 테스트용 메서드: 고정된 좌표로 최적화된 경로 계산
         */
        function testDrivingRoute() {
            $.ajax({
                url: '/api/map/test-driving-route', // 경로 수정: '/Map/TestDrivingRoute' -> '/api/map/test-driving-route'
                method: 'GET',
                success: function (response) {
                    console.log("TestDrivingRoute Response:", response); // 디버깅용 로그
                    if (response.code === 0 && response.route && response.route.trafast) {
                        var routes = response.route.trafast;
                        console.log("trafast routes:", routes);
                        displayRouteResults(routes);
                        // drawRouteOnMap(routes); // 이제 displayRouteResults에서 경로를 그리므로 주석 처리

                        // 지도 중심을 첫 번째 경로의 출발지로 이동
                        if (routes.length > 0) {
                            var firstRoute = routes[0];
                            var startCoordinates = firstRoute.summary.start.location;
                            map.setCenter(new naver.maps.LatLng(startCoordinates[1], startCoordinates[0]));
                        }

                        alert("테스트 경로가 정상적으로 조회되었습니다.");
                    } else {
                        alert('테스트 경로 검색에 실패했습니다: ' + (response.message || 'Unknown Error'));
                        console.error("TestDrivingRoute Error:", response);
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    alert('서버 오류가 발생했습니다.');
                    console.error("TestDrivingRoute AJAX Error:", textStatus, errorThrown);
                }
            });
        }



        /**
         * 테스트용 메서드: 고정된 좌표로 최적화된 경로 계산
         */
        function testDrivingRoute() {
            $.ajax({
                url: '/api/map/test-driving-route', // 경로 수정: '/Map/TestDrivingRoute' -> '/api/map/test-driving-route'
                method: 'GET',
                success: function (response) {
                    console.log("TestDrivingRoute Response:", response); // 디버깅용 로그
                    if (response.code === 0 && response.route && response.route.trafast) {
                        var routes = response.route.trafast;
                        console.log("trafast routes:", routes);
                        displayRouteResults(routes);
                        // drawRouteOnMap(routes); // 이제 displayRouteResults에서 경로를 그리므로 주석 처리

                        // 지도 중심을 첫 번째 경로의 출발지로 이동
                        if (routes.length > 0) {
                            var firstRoute = routes[0];
                            var startCoordinates = firstRoute.summary.start.location;
                            map.setCenter(new naver.maps.LatLng(startCoordinates[1], startCoordinates[0]));
                        }

                        alert("테스트 경로가 정상적으로 조회되었습니다.");
                    } else {
                        alert('테스트 경로 검색에 실패했습니다: ' + (response.message || 'Unknown Error'));
                        console.error("TestDrivingRoute Error:", response);
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    alert('서버 오류가 발생했습니다.');
                    console.error("TestDrivingRoute AJAX Error:", textStatus, errorThrown);
                }
            });
        }




        /**
         * 지도에 경로를 그립니다.
         */
        function drawRouteOnMap(routes) {
            // 기존 경로 삭제
            $.each(polylines, function (index, polyline) {
                polyline.setMap(null);
            });
            polylines = [];

            $.each(routes, function (index, route) {
                var path = [];
                $.each(route.path, function (i, coords) {
                    if (coords && coords.length === 2) {
                        path.push(new naver.maps.LatLng(coords[1], coords[0])); // y, x
                    }
                });
                var polyline = new naver.maps.Polyline({
                    path: path,
                    strokeColor: "#0000FF", // 단일 색상 적용 (파란색)
                    strokeOpacity: 0.8,
                    strokeWeight: 3,
                    map: routesVisible ? map : null // 현재 경로 표시 상태에 따라 지도에 추가 또는 제거
                });
                polylines.push(polyline);
            });
        }

        /**
         * 로딩 스피너 표시
         */
        function showLoading() {
            $('#loadingSpinner').show();
        }

        /**
         * 로딩 스피너 숨기기
         */
        function hideLoading() {
            $('#loadingSpinner').hide();
        }

        /**
         * 에러 메시지 표시
         */
        function showError(message) {
            $('#errorMessage').text(message).show();
        }

        /**
         * 에러 메시지 숨기기
         */
        function hideError() {
            $('#errorMessage').hide();
        }

        /**
         * 전체 마커를 포함하는 지도의 범위를 조정하는 함수
         */
        function adjustMapBounds() {
            var bounds = new naver.maps.LatLngBounds();

            if (startMarker) bounds.extend(startMarker.getPosition());
            if (endMarker) bounds.extend(endMarker.getPosition());
            $.each(waypointMarkers, function (index, marker) {
                bounds.extend(marker.getPosition());
            });


        }

        /**
         * 트래픽 레이어 토글 함수
         */
        function toggleTrafficLayer() {
            if (trafficLayer.getMap()) {
                trafficLayer.setMap(null);
                $('#traffic').removeClass('control-on');
                $("#autorefresh").parent().hide();
            } else {
                trafficLayer.setMap(map);
                $('#traffic').addClass('control-on');
                $("#autorefresh").parent().show();
            }
        }

        /**
         * 경로(polylines)의 가시성을 토글하는 함수
         */
        function toggleRoutesVisibility() {
            if (routesVisible) {
                // 경로 숨기기
                polylines.forEach(function (polyline) {
                    polyline.setMap(null);
                });
                routesVisible = false;
                $('#toggleRouteBtn').text('경로 표시하기');
            } else {
                // 경로 다시 표시하기
                polylines.forEach(function (polyline) {
                    polyline.setMap(map);
                });
                routesVisible = true;
                $('#toggleRouteBtn').text('경로 숨기기');
            }
        }
    });
</script>

</body>
</html>
