document.addEventListener("DOMContentLoaded", function () {
  // 홈 경로 설정: window.HOME_PATH가 있으면 사용하고, 없으면 현재 디렉토리('.')
  var HOME_PATH = window.HOME_PATH || ".",
    // GeoJSON 파일의 경로 설정
    geoJsonPath = "/resources/map/seoul.json",
    // 로드된 GeoJSON 데이터를 저장할 변수
    seoulGeoJson;

  // 지도 객체 생성
  var map = new naver.maps.Map("map", {
    zoom: 11, // 서울 지역에 맞게 확대 수준 조정
    mapTypeId: "normal",
    center: new naver.maps.LatLng(37.5665, 126.978), // 서울의 중심 좌표
  });

  // 정보창 생성
  var infoWindow = new naver.maps.InfoWindow({
    anchorSkew: true,
  });

  map.setCursor("pointer");

  // GeoJSON 데이터 로드 및 지도에 추가
  $.ajax({
    url: geoJsonPath,
    success: function (geojson) {
      seoulGeoJson = geojson;
      startDataLayer();
    },
    error: function (xhr, status, error) {
      console.error("GeoJSON 파일을 로드하는 데 실패했습니다:", error);
    },
  });

  // 툴팁 생성
  var tooltip = $(
    '<div style="position:absolute;z-index:1000;padding:5px 10px;background-color:#fff;border:solid 2px #000;font-size:14px;pointer-events:none;display:none;"></div>',
  );
  tooltip.appendTo(map.getPanes().floatPane);

  // 데이터 레이어 시작 함수
  function startDataLayer() {
    map.data.setStyle(function (feature) {
      var styleOptions = {
        fillColor: "#b9e1ff",
        fillOpacity: 0.4,
        strokeColor: "#f4f7ff",
        strokeWeight: 2,
        strokeOpacity: 0.6,
      };

      // if (feature.getProperty("focus")) {
      //   styleOptions.fillOpacity = 0.6;
      //   styleOptions.fillColor = "#0f0";
      //   styleOptions.strokeColor = "#0f0";
      //   styleOptions.strokeWeight = 4;
      //   styleOptions.strokeOpacity = 1;
      // }

      return styleOptions;
    });

    // 로드된 GeoJSON 데이터를 지도에 추가
    map.data.addGeoJson(seoulGeoJson);

    // 데이터 레이어에 이벤트 리스너 추가
    map.data.addListener("click", function (e) {
      var feature = e.feature;

      if (feature.getProperty("focus") !== true) {
        feature.setProperty("focus", true);
      } else {
        feature.setProperty("focus", false);
      }
    });

    map.data.addListener("mouseover", function (e) {
      var feature = e.feature,
        regionName = feature.getProperty("adm_nm");

      tooltip
        .css({
          display: "",
          left: e.offset.x,
          top: e.offset.y,
        })
        .text(regionName);

      map.data.overrideStyle(feature, {
        fillOpacity: 0.6,
        strokeWeight: 4,
        strokeOpacity: 1,
      });
    });

    map.data.addListener("mouseout", function (e) {
      tooltip.hide().empty();
      map.data.revertStyle();
    });

    // 마커 추가 함수 호출
    addMarkers();

    // 경로 계산 기능 초기화
    initRouteCalculation();
  }

  // 좌표를 주소로 변환하는 함수
  function searchCoordinateToAddress(latlng) {
    infoWindow.close();

    naver.maps.Service.reverseGeocode(
      {
        coords: latlng,
        orders: [
          naver.maps.Service.OrderType.ADDR,
          naver.maps.Service.OrderType.ROAD_ADDR,
        ].join(","),
      },
      function (status, response) {
        if (status === naver.maps.Service.Status.ERROR) {
          return alert("Something Wrong!");
        }

        var items = response.v2.results,
          address = "",
          htmlAddresses = [];

        for (var i = 0, ii = items.length, item, addrType; i < ii; i++) {
          item = items[i];
          address = makeAddress(item) || "";
          addrType = item.name === "roadaddr" ? "[도로명 주소]" : "[지번 주소]";

          htmlAddresses.push(i + 1 + ". " + addrType + " " + address);
        }

        infoWindow.setContent(
          [
            '<div style="padding:10px;min-width:200px;line-height:150%;">',
            '<h4 style="margin-top:5px;">검색 좌표</h4><br />',
            htmlAddresses.join("<br />"),
            "</div>",
          ].join("\n"),
        );

        infoWindow.open(map, latlng);
      },
    );
  }

  // 주소를 좌표로 변환하는 함수
  function searchAddressToCoordinate(address) {
    naver.maps.Service.geocode(
      {
        query: address,
      },
      function (status, response) {
        if (status === naver.maps.Service.Status.ERROR) {
          return alert("Something Wrong!");
        }

        if (response.v2.meta.totalCount === 0) {
          return alert(
            "검색된 결과가 없습니다. 도로명주소 혹은 지번주소를 입력해주세요 ",
          );
        }

        var htmlAddresses = [],
          item = response.v2.addresses[0],
          point = new naver.maps.Point(item.x, item.y);

        if (item.roadAddress) {
          htmlAddresses.push("[도로명 주소] " + item.roadAddress);
        }

        if (item.jibunAddress) {
          htmlAddresses.push("[지번 주소] " + item.jibunAddress);
        }

        if (item.englishAddress) {
          htmlAddresses.push("[영문명 주소] " + item.englishAddress);
        }

        infoWindow.setContent(
          [
            '<div style="padding:10px;min-width:200px;line-height:150%;">',
            '<h4 style="margin-top:5px;">검색 주소 : ' +
              address +
              "</h4><br />",
            htmlAddresses.join("<br />"),
            "</div>",
          ].join("\n"),
        );

        map.setCenter(point);
        infoWindow.open(map, point);
      },
    );
  }

  // 초기화 함수
  function initGeocoder() {
    // 지도 클릭 시 좌표의 주소를 표시
    // map.addListener("click", function (e) {
    //   searchCoordinateToAddress(e.coord);
    // });

    // 주소 검색 입력창에서 Enter 키 처리
    $("#address").on("keydown", function (e) {
      var keyCode = e.which;

      if (keyCode === 13) {
        searchAddressToCoordinate($("#address").val());
      }
    });

    // 검색 버튼 클릭 처리
    $("#submit").on("click", function (e) {
      e.preventDefault();
      searchAddressToCoordinate($("#address").val());
    });

    // 초기 위치 설정 (예: '창경궁로 254')
    //searchAddressToCoordinate("창경궁로 254");
  }

  // 주소 문자열 생성 함수
  function makeAddress(item) {
    if (!item) {
      return;
    }

    var name = item.name,
      region = item.region,
      land = item.land,
      isRoadAddress = name === "roadaddr";

    var sido = "",
      sigugun = "",
      dongmyun = "",
      ri = "",
      rest = "";

    if (hasArea(region.area1)) {
      sido = region.area1.name;
    }

    if (hasArea(region.area2)) {
      sigugun = region.area2.name;
    }

    if (hasArea(region.area3)) {
      dongmyun = region.area3.name;
    }

    if (hasArea(region.area4)) {
      ri = region.area4.name;
    }

    if (land) {
      if (hasData(land.number1)) {
        if (hasData(land.type) && land.type === "2") {
          rest += "산";
        }

        rest += land.number1;

        if (hasData(land.number2)) {
          rest += "-" + land.number2;
        }
      }

      if (isRoadAddress === true) {
        if (checkLastString(dongmyun, "면")) {
          ri = land.name;
        } else {
          dongmyun = land.name;
          ri = "";
        }

        if (hasAddition(land.addition0)) {
          rest += " " + land.addition0.value;
        }
      }
    }

    return [sido, sigugun, dongmyun, ri, rest].join(" ");
  }

  function hasArea(area) {
    return !!(area && area.name && area.name !== "");
  }

  function hasData(data) {
    return !!(data && data !== "");
  }

  function checkLastString(word, lastString) {
    return new RegExp(lastString + "$").test(word);
  }

  function hasAddition(addition) {
    return !!(addition && addition.value);
  }

  // 지도 및 지오코더 초기화
  naver.maps.Event.once(map, "init", function () {
    initGeocoder();
    initRouteCalculation();
  });

  // 마커 추가 함수
  function addMarkers() {
    // 마커에 사용할 위치 데이터 배열 (5개의 좌표)
    var positions = [
      {
        title: "마커 1",
        latlng: new naver.maps.LatLng(37.5665, 126.978), // 서울특별시청
      },
      {
        title: "마커 2",
        latlng: new naver.maps.LatLng(37.57, 126.9768), // 광화문광장
      },
      {
        title: "마커 3",
        latlng: new naver.maps.LatLng(37.5512, 126.9882), // 남산서울타워
      },
      {
        title: "마커 4",
        latlng: new naver.maps.LatLng(37.5796, 126.977), // 경복궁
      },
      {
        title: "마커 5",
        latlng: new naver.maps.LatLng(37.5113, 127.0592), // 강남역
      },
    ];

    // 마커와 정보창을 저장할 배열 초기화
    var markers = [],
      infoWindows = [];

    // positions 배열을 반복하여 마커 생성
    for (var i = 0; i < positions.length; i++) {
      var position = positions[i];

      // 마커 생성
      var marker = new naver.maps.Marker({
        map: map,
        position: position.latlng,
        title: position.title,
        icon: {
          url: HOME_PATH + "/img/example/sp_pins_spot_v3.png",
          size: new naver.maps.Size(24, 37),
          anchor: new naver.maps.Point(12, 37),
          origin: new naver.maps.Point(0, 0),
        },
        zIndex: 100,
      });

      // 마커에 연결된 정보창 생성
      var infoWindow = new naver.maps.InfoWindow({
        content:
          '<div style="width:150px;text-align:center;padding:10px;">' +
          position.title +
          "</div>",
      });

      // 생성된 마커와 정보창을 배열에 추가
      markers.push(marker);
      infoWindows.push(infoWindow);
    }

    // 지도 이동 및 확대/축소 시 마커 표시 여부 업데이트
    naver.maps.Event.addListener(map, "idle", function () {
      updateMarkers(map, markers);
    });

    // 지도 범위 내에 있는 마커들만 표시하도록 업데이트하는 함수
    function updateMarkers(map, markers) {
      var mapBounds = map.getBounds(); // 지도 범위 가져오기
      var marker, position;

      for (var i = 0; i < markers.length; i++) {
        marker = markers[i];
        position = marker.getPosition();

        // 마커의 위치가 지도 범위 내에 있으면 표시, 아니면 숨김
        if (mapBounds.hasLatLng(position)) {
          showMarker(marker);
        } else {
          hideMarker(marker);
        }
      }
    }

    // 마커를 지도에 표시하는 함수
    function showMarker(marker) {
      if (marker.getMap()) return; // 이미 지도에 표시된 경우 종료
      marker.setMap(map); // 지도에 마커 추가
    }

    // 마커를 지도에서 숨기는 함수
    function hideMarker(marker) {
      if (!marker.getMap()) return; // 이미 숨겨진 경우 종료
      marker.setMap(null); // 마커를 지도에서 제거
    }

    // 마커 클릭 시 정보창을 열거나 닫는 이벤트 핸들러를 반환하는 함수
    function getClickHandler(seq) {
      return function (e) {
        var marker = markers[seq],
          infoWindow = infoWindows[seq];

        // 정보창이 열려 있으면 닫고, 닫혀 있으면 엽니다.
        if (infoWindow.getMap()) {
          infoWindow.close();
        } else {
          infoWindow.open(map, marker);
        }
      };
    }

    // 각 마커에 클릭 이벤트 리스너 추가
    for (var i = 0; i < markers.length; i++) {
      naver.maps.Event.addListener(markers[i], "click", getClickHandler(i));
    }
  }

  // 경로 계산 및 직선 표시 함수
  function initRouteCalculation() {
    var startCoord = null;
    var destinationCoords = [];
    var routeMarkers = [];
    var polylines = [];

    function geocodeAddress(address) {
      return new Promise(function (resolve, reject) {
        naver.maps.Service.geocode(
          {
            query: address,
          },
          function (status, response) {
            if (status !== naver.maps.Service.Status.OK) {
              reject(new Error("Geocoding failed for address: " + address));
            } else {
              var result = response.v2.addresses[0];
              var coord = new naver.maps.LatLng(result.y, result.x);
              resolve(coord);
            }
          },
        );
      });
    }

    function addRouteMarker(position, title) {
      var marker = new naver.maps.Marker({
        position: position,
        map: map,
        title: title,
      });
      routeMarkers.push(marker);

      var infoWindow = new naver.maps.InfoWindow({
        content:
          '<div style="width:150px;text-align:center;padding:10px;">' +
          title +
          "</div>",
      });

      naver.maps.Event.addListener(marker, "click", function () {
        if (infoWindow.getMap()) {
          infoWindow.close();
        } else {
          infoWindow.open(map, marker);
        }
      });
    }

    function calculateDistance(coord1, coord2) {
      var lat1 = coord1.lat();
      var lon1 = coord1.lng();
      var lat2 = coord2.lat();
      var lon2 = coord2.lng();

      var R = 6371; // 지구 반지름 (km)
      var dLat = deg2rad(lat2 - lat1);
      var dLon = deg2rad(lon2 - lon1);
      var a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) *
          Math.cos(deg2rad(lat2)) *
          Math.sin(dLon / 2) *
          Math.sin(dLon / 2);
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      var distance = R * c;
      return distance;
    }

    function deg2rad(deg) {
      return deg * (Math.PI / 180);
    }

    function findShortestRoute(startCoord, destinationCoords) {
      var route = [];
      var currentCoord = startCoord;
      var remainingCoords = destinationCoords.slice();
      var totalDistance = 0;

      while (remainingCoords.length > 0) {
        var closest = null;
        var closestIndex = -1;
        var shortestDistance = Infinity;

        for (var i = 0; i < remainingCoords.length; i++) {
          var distance = calculateDistance(currentCoord, remainingCoords[i]);
          if (distance < shortestDistance) {
            shortestDistance = distance;
            closest = remainingCoords[i];
            closestIndex = i;
          }
        }

        route.push(closest);
        totalDistance += shortestDistance;
        currentCoord = closest;
        remainingCoords.splice(closestIndex, 1);
      }

      return { route, totalDistance };
    }

    function drawLineBetweenPoints(points) {
      for (var i = 0; i < points.length - 1; i++) {
        var polyline = new naver.maps.Polyline({
          map: map,
          path: [points[i], points[i + 1]],
          strokeColor: "#" + ((Math.random() * 0xffffff) << 0).toString(16), // 랜덤 색상
          strokeWeight: 3,
        });
        polylines.push(polyline);
      }
    }

    document
      .getElementById("calculateRoutes")
      .addEventListener("click", function () {
        // 기존 마커와 폴리라인 제거
        for (var i = 0; i < routeMarkers.length; i++) {
          routeMarkers[i].setMap(null);
        }
        routeMarkers = [];
        for (var i = 0; i < polylines.length; i++) {
          polylines[i].setMap(null);
        }
        polylines = [];

        var startAddress = document.getElementById("start").value;
        var destinationAddresses = [
          document.getElementById("destination1").value,
          document.getElementById("destination2").value,
          document.getElementById("destination3").value,
        ].filter(Boolean);

        if (!startAddress || destinationAddresses.length === 0) {
          alert("출발지와 최소 하나의 목적지를 입력하세요.");
          return;
        }

        geocodeAddress(startAddress)
          .then(function (startCoord) {
            var geocodePromises = destinationAddresses.map(geocodeAddress);

            Promise.all(geocodePromises)
              .then(function (destinationCoords) {
                var { route, totalDistance } = findShortestRoute(
                  startCoord,
                  destinationCoords,
                );
                alert("최적 경로 총 거리: " + totalDistance.toFixed(2) + " km");

                // 경로 및 마커 표시
                var bounds = new naver.maps.LatLngBounds();
                bounds.extend(startCoord);
                route.forEach(function (coord, i) {
                  bounds.extend(coord);
                  addRouteMarker(coord, "목적지 " + (i + 1));
                });
                map.fitBounds(bounds);

                // 직선 경로 그리기
                drawLineBetweenPoints([startCoord, ...route]);
              })
              .catch(function (error) {
                console.error(error);
                alert("목적지 지오코딩에 실패했습니다.");
              });
          })
          .catch(function (error) {
            console.error(error);
            alert("출발지 지오코딩에 실패했습니다.");
          });
      });
  }
});
