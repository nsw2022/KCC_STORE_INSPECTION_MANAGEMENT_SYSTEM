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
        var colors = ['#FF0000', '#0000FF', '#00FF00', '#FFA500', '#800080']; // 경로 색상 배열

        // 마커 관리 변수
        var searchMarkers = []; // 목적지 검색 마커
        var initialMarkers = []; // 초기 마커
        var startMarker = null;
        var endMarker = null;
        var waypointMarkers = [];

        // 마커 아이콘 설정 변수
        var startIcon, endIcon, waypointIcon;

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
                data: JSON.stringify({address: address}),
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
                    start: {x: startX, y: startY},
                    addressList: getGoalList(goals),
                    viaPoints: viaPoints.map(function (point) {
                        return {x: point.x, y: point.y};
                    }) // 서버에서 받은 경유지 목록을 전달
                }),
                success: function (response) {
                    console.log("SearchRoute Response:", response); // 디버깅용 로그
                    if (response.code === 0 && response.route && response.route.trafast) {
                        var routes = response.route.trafast; // 'trafast' 배열을 routes로 설정
                        displayRouteResults(routes);
                        drawRouteOnMap(routes);

                        // 지도 중심을 첫 번째 경로의 출발지로 이동
                        if (routes.length > 0) {
                            var firstRoute = routes[0];
                            var startCoordinates = firstRoute.summary.start.location;
                            map.setCenter(new naver.maps.LatLng(startCoordinates[1], startCoordinates[0]));
                        }
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
                data: JSON.stringify({address: startAddress}),
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
                                data: JSON.stringify({address: address}),
                                success: function (destResponse) {
                                    console.log("GetCoordinates (Destination) Response:", destResponse); // 디버깅용 로그
                                    if (destResponse.status === 200) {
                                        var destData = destResponse.data;
                                        goals.push({x: destData.x, y: destData.y});
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
                        drawRouteOnMap(routes);

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
         * 사용자 위치를 가져와 지도에 표시
         */
        // function showUserLocation() {
        //     if (navigator.geolocation) {
        //         navigator.geolocation.getCurrentPosition(function(position) {
        //             var userLat = position.coords.latitude;
        //             var userLng = position.coords.longitude;
        //
        //             var userMarker = new naver.maps.Marker({
        //                 position: new naver.maps.LatLng(userLat, userLng),
        //                 map: map,
        //                 title: '내 위치',
        //                 icon: {
        //                     url: 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_current.png', // 사용자 위치 아이콘 URL
        //                     size: new naver.maps.Size(24, 37),
        //                     origin: new naver.maps.Point(0, 0),
        //                     anchor: new naver.maps.Point(12, 37)
        //                 }
        //             });
        //
        //             // 지도 중심을 사용자 위치로 이동
        //             map.setCenter(new naver.maps.LatLng(userLat, userLng));
        //         }, function(error) {
        //             console.error("사용자 위치 가져오기 실패:", error);
        //             alert("사용자 위치를 가져올 수 없습니다.");
        //         });
        //     } else {
        //         alert("Geolocation을 지원하지 않는 브라우저입니다.");
        //     }
        // }

        /**
         * 경로 결과를 테이블에 표시하고 마커 추가
         * @param {Array} routes - 경로 배열 (trafast 배열의 요소들)
         */
        function displayRouteResults(routes) {
            $('#routeTableBody').empty();
            showLoading();
            hideError();

            // 기존 폴리라인 제거
            $.each(polylines, function (index, polyline) {
                polyline.setMap(null);
            });
            polylines = [];

            // 기존 마커 제거 (출발지, 도착지, 경유지)
            if (startMarker) startMarker.setMap(null);
            if (endMarker) endMarker.setMap(null);
            $.each(waypointMarkers, function (index, marker) {
                marker.setMap(null);
            });
            waypointMarkers = [];

            // 경로별로 처리
            routes.forEach(function (route, routeIndex) {
                var summary = route.summary;
                var startLocation = summary.start.location; // [x, y]
                var goalLocation = summary.goal.location; // [x, y]
                var waypoints = summary.waypoints || [];

                // 마커 추가
                addStartMarker({x: startLocation[0], y: startLocation[1]});
                addEndMarker({x: goalLocation[0], y: goalLocation[1]});
                addWaypointMarkers(waypoints);

                // 테이블에 각 구간 추가
                // 출발지 → 목적지1
                if (waypoints.length > 0) {
                    var firstWaypoint = waypoints[0];
                    var row1 = '<tr>' +
                        '<td>출발지</td>' +
                        '<td>목적지 1</td>' +
                        '<td>' + firstWaypoint.distance.toLocaleString() + ' m</td>' +
                        '<td>' + Math.round(firstWaypoint.duration / 60000) + ' 분</td>' +
                        '</tr>';
                    $('#routeTableBody').append(row1);

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
                } else {
                    // 경유지가 없을 경우 출발지 → 도착지
                    var row = '<tr>' +
                        '<td>출발지</td>' +
                        '<td>도착지</td>' +
                        '<td>' + summary.goal.distance.toLocaleString() + ' m</td>' +
                        '<td>' + Math.round(summary.goal.duration / 60000) + ' 분</td>' +
                        '</tr>';
                    $('#routeTableBody').append(row);
                }

                // 경로 그리기
                var color = colors[routeIndex]; // 색상 배열의 인덱스에 따라 색상 할당
                var path = route.path.map(function (coords) {
                    return new naver.maps.LatLng(coords[1], coords[0]); // y, x
                });
                var polyline = new naver.maps.Polyline({
                    map: map,
                    path: path,
                    strokeColor: color,
                    strokeOpacity: 0.7,
                    strokeWeight: 5
                });
                polylines.push(polyline);
            });

            // 지도 범위 조정 (전체 마커를 포함하도록)
            adjustMapBounds();

            hideLoading();
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
                    strokeColor: colors[index], // index만 사용
                    strokeOpacity: 0.8,
                    strokeWeight: 3,
                    map: map
                });
                polylines.push(polyline);
            });
        }

        /**
         * 프론트엔드용 Coordinates 클래스 정의
         */
        function Coordinates(x, y) {
            this.x = x;
            this.y = y;
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

            // if (!bounds.isEmpty()) {
            //     map.fitBounds(bounds);
            // }
        }

        // **변경 사항 시작**
        // 좌표를 토대로 검색하는 부분을 주석 처리
        /*
        /**
         * 좌표를 토대로 검색하는 함수 (현재 주석 처리)
         */
        /*
        function coordinateBasedSearch() {
            // 여기에 좌표를 토대로 검색하는 로직을 구현
        }
        */
        // **변경 사항 끝**
    });
</script>

</body>
</html>
