<%@ page language="java" contentType="text/html; charset=UTF-8"
         pageEncoding="UTF-8" %>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>최단 거리 탐색</title>
    <style>
        #map {
            width: 600px;
            height: 600px;
        }

        #results {
            margin-top: 20px;
        }
    </style>
    <!-- Naver Maps API 스크립트 로드 -->
    <script type="text/javascript"
            src="https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${naverClientId}&submodules=panorama,geocoder"
            defer></script>
    <!-- jQuery 로드 -->
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
</head>
<body>
<h1>최단 거리 탐색</h1>
<form id="routeForm">
    <table>
        <tr>
            <td>시작 주소</td>
            <td><input type="text" id="addressStart" placeholder="예: 서울특별시 동대문구 약령로 147" style="width:500px;"/></td>
        </tr>
        <tr>
            <td>목적지 주소 목록</td>
            <td><input type="text" id="addressList" placeholder="예: 서울특별시 동대문구 불정로 6, 서울특별시 동대문구 약령로 147"
                       style="width:500px;"/></td>
        </tr>
    </table>
    <br/>
    <button type="button" id="saveStartBtn">시작 주소 저장</button>
    <button type="button" id="searchDestBtn">목적지 주소 검색</button>
    <button type="button" id="searchRouteBtn">경로 조회</button>
    <button type="button" id="testBtn">Test</button>
</form>

<br/>
<div id="map"></div>

<br/>
<div id="results">
    <h2>경로 결과</h2>
    <table border="1" cellpadding="5">
        <thead>
        <tr>
            <th>Rank</th>
            <th>경로</th>
            <th>거리</th>
        </tr>
        </thead>
        <tbody id="routeTableBody">
        <!-- 결과가 여기에 추가됩니다 -->
        </tbody>
    </table>
</div>

<script type="text/javascript">
    // 모든 스크립트를 DOMContentLoaded 이벤트 내에 넣습니다.
    document.addEventListener("DOMContentLoaded", function () {
        // 글로벌 변수 선언
        var map = null;
        var markers = [];
        var polylines = [];

        // 마커 관리 변수
        var startMarker = null;
        var endMarker = null;
        var waypointMarkers = [];

        // 마커 아이콘 설정 변수
        var startIcon, endIcon, waypointIcon;

        // Naver Maps API 로드 완료 시 실행되는 함수
        naver.maps.onJSContentLoaded = function () {
            // 마커 아이콘 설정
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
            }
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
                var addresses = addressList.split(',').map(function (addr) {
                    return addr.trim();
                }).filter(function (addr) {
                    return addr !== "";
                });
                if (addresses.length === 0) {
                    alert("유효한 목적지 주소가 없습니다.");
                    return;
                }
                addresses.forEach(function (address) {
                    callNaverAddressService(address);
                });
            }

            /**
             * 주소를 좌표로 변환하고 마커 추가
             */
            function callNaverAddressService(address) {
                $.ajax({
                    url: '/Map/GetCoordinates', // 절대 경로로 수정
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
                                title: address
                            });
                            markers.push(marker);
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
                    url: '/Map/GetCoordinates', // 절대 경로로 수정
                    method: 'POST',
                    contentType: 'application/json',
                    data: JSON.stringify({address: startAddress}),
                    success: function (startResponse) {
                        if (startResponse.status === 200) {
                            var startData = startResponse.data;
                            var startX = parseFloat(startData.x);
                            var startY = parseFloat(startData.y);

                            // 목적지 주소 목록을 지오코딩하여 좌표를 수집합니다.
                            var addresses = addressList.split(',').map(function (addr) {
                                return addr.trim();
                            }).filter(function (addr) {
                                return addr !== "";
                            });
                            if (addresses.length === 0) {
                                alert("유효한 목적지 주소가 없습니다.");
                                return;
                            }

                            var viaPoints = [];
                            var processed = 0;
                            var failed = false;

                            addresses.forEach(function (address, index) {
                                $.ajax({
                                    url: '/Map/GetCoordinates', // 절대 경로로 수정
                                    method: 'POST',
                                    contentType: 'application/json',
                                    data: JSON.stringify({address: address}),
                                    success: function (destResponse) {
                                        if (destResponse.status === 200) {
                                            var destData = destResponse.data;
                                            viaPoints.push(new Coordinates(destData.x, destData.y));
                                        } else {
                                            alert('주소 검색에 실패했습니다: ' + destResponse.message);
                                            failed = true;
                                        }
                                        processed++;
                                        if (processed === addresses.length && !failed) {
                                            // 모든 목적지 주소가 처리된 후 경로 검색
                                            callSearchRoute(startX, startY, viaPoints);
                                        }
                                    },
                                    error: function () {
                                        alert('서버 오류가 발생했습니다.');
                                        processed++;
                                        if (processed === addresses.length && !failed) {
                                            // 모든 목적지 주소가 처리된 후 경로 검색
                                            callSearchRoute(startX, startY, viaPoints);
                                        }
                                    }
                                });
                            });
                        } else {
                            alert('시작 주소 검색에 실패했습니다: ' + startResponse.message);
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
            function callSearchRoute(startX, startY, viaPoints) {
                $.ajax({
                    url: '/Map/SearchRoute', // 절대 경로로 수정
                    method: 'POST',
                    contentType: 'application/json',
                    data: JSON.stringify({
                        start: {x: startX, y: startY},
                        addressList: getAddressList(viaPoints)
                    }),
                    success: function (response) {
                        if (response.code === 0) {
                            // `route.trafast` 리스트를 전달
                            displayRouteResults(response.route.trafast);
                            drawRouteOnMap(response.route.trafast);

                            // 지도 중심을 출발지로 이동
                            map.setCenter(new naver.maps.LatLng(startY, startX));
                        } else {
                            alert('경로 검색에 실패했습니다: ' + response.message);
                        }
                    },
                    error: function () {
                        alert('서버 오류가 발생했습니다.');
                    }
                });
            }

            /**
             * 경유지 좌표 리스트를 쉼표로 구분된 x,y 문자열로 변환
             */
            function getAddressList(viaPoints) {
                return viaPoints.map(function (point) {
                    return point.x + "," + point.y;
                }).join(",");
            }

            /**
             * 경로 결과를 테이블에 표시하고 마커 추가
             */
            function displayRouteResults(routes) {
                $('#routeTableBody').empty();
                $.each(routes, function (index, route) {
                    var routeStr = route.summary.start.location.x + "," + route.summary.start.location.y + " -> " +
                        route.summary.goal.location.x + "," + route.summary.goal.location.y;
                    var distance = route.summary.distance; // 거리 정보 가져오기
                    var row = '<tr>' +
                        '<td>' + (index + 1) + '</td>' +
                        '<td>' + routeStr + '</td>' +
                        '<td>' + distance + 'm</td>' +
                        '</tr>';
                    $('#routeTableBody').append(row);
                });

                // 마커 추가
                if (routes.length > 0) {
                    var route = routes[0]; // 첫 번째 경로 사용 (trafast 리스트 중 첫 번째)

                    // 출발지와 도착지 마커 추가
                    var startCoordinates = route.summary.start.location;
                    var endCoordinates = route.summary.goal.location;
                    addStartMarker(startCoordinates);
                    addEndMarker(endCoordinates);

                    // 경유지 마커 추가 (우선순위 표시)
                    var waypoints = route.summary.waypoints;
                    addWaypointMarkers(waypoints);
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
                            path.push(new naver.maps.LatLng(coords[1], coords[0])); // y, x 순
                        }
                    });
                    var polyline = new naver.maps.Polyline({
                        path: path,
                        strokeColor: '#FF0000',
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
             * 출발지 마커 추가 함수
             */
            function addStartMarker(coordinates) {
                // 기존 마커 삭제
                if (startMarker) {
                    startMarker.setMap(null);
                }

                startMarker = new naver.maps.Marker({
                    position: new naver.maps.LatLng(coordinates.y, coordinates.x),
                    map: map,
                    icon: startIcon,
                    title: '출발지'
                });
            }

            /**
             * 도착지 마커 추가 함수
             */
            function addEndMarker(coordinates) {
                // 기존 마커 삭제
                if (endMarker) {
                    endMarker.setMap(null);
                }

                endMarker = new naver.maps.Marker({
                    position: new naver.maps.LatLng(coordinates.y, coordinates.x),
                    map: map,
                    icon: endIcon,
                    title: '도착지'
                });
            }

            /**
             * 경유지 마커 추가 함수
             */
            function addWaypointMarkers(viaPoints) {
                // 기존 마커 삭제
                $.each(waypointMarkers, function (index, marker) {
                    marker.setMap(null);
                });
                waypointMarkers = [];

                // 경유지 마커 추가
                $.each(viaPoints, function (index, point) {
                    var marker = new naver.maps.Marker({
                        position: new naver.maps.LatLng(point.y, point.x),
                        map: map,
                        icon: waypointIcon,
                        title: '경유지 ' + (index + 1)
                    });

                    // 순위를 표시하는 InfoWindow 추가
                    var infowindow = new naver.maps.InfoWindow({
                        content: '<div style="padding:5px;">경유지 ' + (index + 1) + '</div>',
                        backgroundColor: '#fff',
                        borderColor: '#ccc',
                        borderWidth: 1,
                        anchorSize: new naver.maps.Size(10, 10),
                        anchorSkew: true
                    });

                    naver.maps.Event.addListener(marker, 'click', function (e) {
                        infowindow.open(map, marker);
                    });

                    waypointMarkers.push(marker);
                });
            }

            /**
             * 테스트용 메서드: 고정된 좌표로 최단 경로 계산
             */
            function testDrivingRoute() {
                $.ajax({
                    url: '/Map/TestDrivingRoute',
                    method: 'GET',
                    success: function (response) {
                        if (response.code === 0 || response.route) {
                            displayRouteResults(response.route.trafast);
                            drawRouteOnMap(response.route.trafast);

                            // 추가: 출발지와 경유지 마커 추가
                            if (response.route.trafast && response.route.trafast.length > 0) {
                                var route = response.route.trafast[0];
                                var startCoordinates = route.summary.start.location;
                                var endCoordinates = route.summary.goal.location;
                                var waypoints = route.summary.waypoints;

                                addStartMarker(startCoordinates);
                                addEndMarker(endCoordinates);
                                addWaypointMarkers(waypoints);

                                // 지도 중심을 출발지로 이동
                                map.setCenter(new naver.maps.LatLng(startCoordinates.y, startCoordinates.x));
                            }

                            alert("테스트 경로가 정상적으로 조회되었습니다.");
                        } else {
                            alert('테스트 경로 검색에 실패했습니다: ' + response.message);
                        }
                    },
                    error: function () {
                        alert('서버 오류가 발생했습니다.');
                    }
                });
            }

            // 페이지 로드 시 지도 중심을 출발지로 이동 (필요한 경우)
            // 만약 시작 주소가 고정되어 있다면, 그 좌표로 지도 중심을 이동시킬 수 있습니다.
            // 예를 들어:
            // var defaultStartX = 126.9783881; // 서울시청 좌표
            // var defaultStartY = 37.5666103;
            // map.setCenter(new naver.maps.LatLng(defaultStartY, defaultStartX));
        }
    )
</script>

</body>
</html>
