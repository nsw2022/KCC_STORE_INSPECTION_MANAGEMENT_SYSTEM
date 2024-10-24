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
        <th>혼잡도</th>
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
        var startMarker = null;
        var endMarker = null;
        var waypointMarkers = [];

        // 마커 아이콘 설정 변수
        var startIcon, endIcon, waypointIcon;

        // 트래픽 레이어 및 관련 변수
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
                interval: trafficInterval,
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


            // $('#testBtn').click(function () {
            //     testDrivingRoute();
            // });

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
                0: "#1cdf1c", // 원활 (녹색)
                1: "#FBD126", // 보통 (주황색)
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
                    // 구간 데이터를 waypoints에 맞춰 매핑
                    // 출발지 → 목적지1, 목적지1 → 목적지2, ..., 목적지N → 도착지
                    var segments = [];

                    // 출발지 → 목적지1
                    segments.push({
                        from: '출발지',
                        to: '목적지 1',
                        distance: waypoints[0].distance,
                        duration: waypoints[0].duration,
                        congestion: sections[0] ? sections[0].congestion : 0
                    });

                    // 목적지1 → 목적지2, ..., 목적지N-1 → 목적지N
                    for (var i = 1; i < waypoints.length; i++) {
                        segments.push({
                            from: '목적지 ' + i,
                            to: '목적지 ' + (i + 1),
                            distance: waypoints[i].distance,
                            duration: waypoints[i].duration,
                            congestion: sections[i] ? sections[i].congestion : 0
                        });
                    }

                    // 목적지N → 도착지
                    segments.push({
                        from: '목적지 ' + waypoints.length,
                        to: '도착지',
                        distance: summary.goal.distance,
                        duration: summary.goal.duration,
                        congestion: sections[waypoints.length] ? sections[waypoints.length].congestion : 0
                    });

                    // 테이블에 추가
                    segments.forEach(function(segment) {
                        var row = '<tr>' +
                            '<td>' + segment.from + '</td>' +
                            '<td>' + segment.to + '</td>' +
                            '<td>' + segment.distance.toLocaleString() + ' m</td>' +
                            '<td>' + Math.round(segment.duration / 60000) + ' 분</td>' +
                            '<td>' + getCongestionLabel(segment.congestion) + '</td>' + // 혼잡도 추가
                            '</tr>';
                        $('#routeTableBody').append(row);

                        // 총계 업데이트
                        totalDistance += segment.distance;
                        totalDuration += Math.round(segment.duration / 60000);
                    });
                } else {
                    // 경유지가 없을 경우 출발지 → 도착지
                    var segment = {
                        from: '출발지',
                        to: '도착지',
                        distance: summary.goal.distance,
                        duration: summary.goal.duration,
                        congestion: sections[0] ? sections[0].congestion : 0
                    };
                    var row = '<tr>' +
                        '<td>' + segment.from + '</td>' +
                        '<td>' + segment.to + '</td>' +
                        '<td>' + segment.distance.toLocaleString() + ' m</td>' +
                        '<td>' + Math.round(segment.duration / 60000) + ' 분</td>' +
                        '<td>' + getCongestionLabel(segment.congestion) + '</td>' + // 혼잡도 추가
                        '</tr>';
                    $('#routeTableBody').append(row);

                    // 총계 업데이트
                    totalDistance += segment.distance;
                    totalDuration += Math.round(segment.duration / 60000);
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

                        // 좌표가 유효한지 확인
                        if (sectionStart < 0 || sectionEnd >= path.length) {
                            console.warn(`Section ${sectionIndex + 1}: Invalid pointIndex (${sectionStart}) or pointCount (${section.pointCount}).`);
                            return;
                        }

                        // 비혼잡 구간: 현재 인덱스와 섹션 시작 사이
                        if (currentIdx < sectionStart) {
                            var nonCongestedPathCoords = path.slice(currentIdx, sectionStart);
                            if (nonCongestedPathCoords.length > 1) {
                                var nonCongestedPath = nonCongestedPathCoords.map(function (coords) {
                                    return new naver.maps.LatLng(coords[1], coords[0]); // y, x
                                });

                                // 외곽 검정선 폴리라인 (두께를 4로 설정)
                                var outlinePolyline = new naver.maps.Polyline({
                                    map: routesVisible ? map : null,
                                    path: nonCongestedPath,
                                    strokeColor: "#000000", // 검정색
                                    strokeOpacity: 1,
                                    strokeWeight: 6 // 외곽선 두께 조정
                                });

                                polylines.push(outlinePolyline);
                                console.log(`Non-Congested Outline Segment ${currentIdx} to ${sectionStart}:`, outlinePolyline);

                                // 내부 폴리라인 (원래 색상 유지, 약간 얇게)
                                var mainNonCongestedPolyline = new naver.maps.Polyline({
                                    map: routesVisible ? map : null,
                                    path: nonCongestedPath,
                                    strokeColor: "#1cdf1c", // 원래 색상 유지 (예: 녹색)
                                    strokeOpacity: 1,
                                    strokeWeight: 6 // 내부 선 두께 조정
                                });

                                polylines.push(mainNonCongestedPolyline);
                                console.log(`Non-Congested Main Segment ${currentIdx} to ${sectionStart}:`, mainNonCongestedPolyline);
                            }
                        }

                        // 혼잡 구간: 섹션 시작과 끝 사이
                        var pathCoordinates = path.slice(sectionStart, sectionEnd + 1); // endIdx 포함

                        // 섹션 객체 전체를 콘솔에 출력하여 congestion 값 확인
                        console.log(`Section ${sectionIndex + 1} Details:`, section);

                        var congestion = Number(section.congestion); // 문자열일 경우 숫자로 변환
                        var color = congestionColors[congestion] || "#FF0000"; // 기본 색상: 녹색

                        // 콘솔에 색상 출력 (디버깅용)
                        console.log(`Section ${sectionIndex + 1}: 색상 - ${color}, 혼잡도 - ${congestion}`);

                        // 변수를 다른 이름으로 변경하여 변수 충돌 방지
                        var polylinePath = pathCoordinates.map(function (coords) {
                            return new naver.maps.LatLng(coords[1], coords[0]); // y, x
                        });

                        // 외곽 검정선 폴리라인 (두께를 4로 설정)
                        var outlinePolyline = new naver.maps.Polyline({
                            map: routesVisible ? map : null,
                            path: polylinePath,
                            strokeColor: "#000000", // 검정색
                            strokeOpacity: 1,
                            strokeWeight: 6 // 외곽선 두께 조정
                        });

                        polylines.push(outlinePolyline);
                        console.log(`Section ${sectionIndex + 1} Outline Polyline:`, outlinePolyline);

                        // 내부 폴리라인 (혼잡도에 따른 색상, 약간 얇게)
                        var mainPolyline = new naver.maps.Polyline({
                            map: routesVisible ? map : null,
                            path: polylinePath,
                            strokeColor: color, // 혼잡도에 따른 색상
                            strokeOpacity: 1,
                            strokeWeight: 6 // 내부 선 두께 조정
                        });

                        polylines.push(mainPolyline);
                        console.log(`Section ${sectionIndex + 1} Main Polyline:`, mainPolyline);

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

                            // 외곽 검정선 폴리라인 (두께를 4로 설정)
                            var remainingOutlinePolyline = new naver.maps.Polyline({
                                map: routesVisible ? map : null,
                                path: remainingPath,
                                strokeColor: "#000000", // 검정색
                                strokeOpacity: 1,
                                strokeWeight: 6 // 외곽선 두께 조정
                            });

                            polylines.push(remainingOutlinePolyline);
                            console.log(`Remaining Non-Congested Outline Segment ${currentIdx} to ${path.length}:`, remainingOutlinePolyline);

                            // 내부 폴리라인 (원래 색상 유지, 약간 얇게)
                            var remainingMainPolyline = new naver.maps.Polyline({
                                map: routesVisible ? map : null,
                                path: remainingPath,
                                strokeColor: "#FF0000", // 원래 색상 유지 (예: 빨강)
                                strokeOpacity: 1,
                                strokeWeight: 6 // 내부 선 두께 조정
                            });

                            polylines.push(remainingMainPolyline);
                            console.log(`Remaining Non-Congested Main Segment ${currentIdx} to ${path.length}:`, remainingMainPolyline);
                        }
                    }
                } else {
                    // 구간이 없을 경우 전체 경로를 기본 색상으로 그리기
                    var fullPath = path.map(function (coords) {
                        return new naver.maps.LatLng(coords[1], coords[0]); // y, x
                    });

                    // 외곽 검정선 폴리라인 (두께를 4로 설정)
                    var fullOutlinePolyline = new naver.maps.Polyline({
                        map: routesVisible ? map : null,
                        path: fullPath,
                        strokeColor: "#000000", // 검정색
                        strokeOpacity: 1,
                        strokeWeight: 6 // 외곽선 두께 조정
                    });

                    polylines.push(fullOutlinePolyline);
                    console.log(`Full Path Outline Polyline:`, fullOutlinePolyline);

                    // 내부 폴리라인 (기존 색상 유지, 약간 얇게)
                    var fullMainPolyline = new naver.maps.Polyline({
                        map: routesVisible ? map : null,
                        path: fullPath,
                        strokeColor: "#1cdf1c", // 원래 색상 유지 (예: 녹색)
                        strokeOpacity: 1,
                        strokeWeight: 6 // 내부 선 두께 조정
                    });

                    polylines.push(fullMainPolyline);
                    console.log(`Full Path Main Polyline:`, fullMainPolyline);
                }
            }); // routes.forEach 끝

            // 총계 행 추가
            var totalRow = '<tr class="total-row">' +
                '<td colspan="2">총계</td>' +
                '<td>' + totalDistance.toLocaleString() + ' m</td>' +
                '<td>' + totalDuration.toLocaleString() + ' 분</td>' +
                '<td></td>' + // 총계 행에는 혼잡도 없음
                '</tr>';
            $('#routeTableBody').append(totalRow);

            // 지도 범위 조정 (전체 마커를 포함하도록)
            adjustMapBounds();

            hideLoading();
        }

// 혼잡도 값을 레이블로 변환하는 함수
        function getCongestionLabel(congestion) {
            switch (congestion) {
                case 0:
                    return '<span class="congestion-low">원활</span>';
                case 1:
                    return '<span class="congestion-medium">보통</span>';
                case 2:
                    return '<span class="congestion-medium">혼잡</span>';

                default:
                    return '혼잡';
            }
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
                    strokeOpacity: 1,
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
