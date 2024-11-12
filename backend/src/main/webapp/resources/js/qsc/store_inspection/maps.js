document.addEventListener("DOMContentLoaded", function () {
  /**
   * 공통 변수 및 설정
   */
  var map = null;
  var polylines = [];
  var initialMarkers = [];
  var startMarker = null;
  var endMarker = null;
  var waypointMarkers = [];
  var activeInfoWindow = null;
  var trafficInterval = 300000;
  var routesVisible = true;
  const congestionColors = {
    0: "#1cdf1c",
    1: "#FBD126",
    2: "#FF0000",
  };
  let allStores = [];
  let todayInspections = [];
  var cachedRouteData = null;
  var flagSchedule = false;

  /**
   * 공통 SweetAlert2 메시지 표시 함수
   * @param {string} title - 제목
   * @param {string} text - 내용
   * @param {string} icon - 아이콘 종류 (success, error, warning, info)
   */
  function showAlert(title, text, icon) {
    Swal.fire({
      title: title,
      text: text,
      icon: icon,
      confirmButtonText: "확인",
    });
  }

  // ----- 선언부 끝 구현부 시작 -----

  /**
   * 네이버 지도를 초기화하는 함수
   */
  function initNaverMap() {
    var mapOptions = {
      center: new naver.maps.LatLng(37.5665, 126.978),
      zoom: 11,
      mapTypeId: naver.maps.MapTypeId.NORMAL,
      scaleControl: true,
    };
    map = new naver.maps.Map("map", mapOptions);
  }

  /**
   * GeoJSON 데이터를 로드하고 지도에 레이어를 설정하는 함수
   * @param {Object} seoulGeoJson - 서울 지역의 GeoJSON 데이터
   */
  function startDataLayer(seoulGeoJson) {
    if (!seoulGeoJson) {
      console.warn(
        "GeoJSON 데이터가 제공되지 않았습니다. 데이터 레이어를 추가하지 않습니다.",
      );
      return;
    }

    map.data.setStyle(function (feature) {
      var styleOptions = {
        fillColor: "#dce8ff",
        fillOpacity: 0.4,
        strokeColor: "#f4f7ff",
        strokeWeight: 2,
        strokeOpacity: 1,
        zIndex: 10,
      };
      return styleOptions;
    });

    map.data.addGeoJson(seoulGeoJson);

    map.data.addListener("click", function (e) {
      var feature = e.feature;
      feature.setProperty("focus", feature.getProperty("focus") !== true);
    });

    var tooltip = $(
      '<div style="position:absolute;z-index:1000;padding:5px 10px;background-color:#fff;border:solid 2px #000;font-size:14px;pointer-events:none;display:none;"></div>',
    );
    tooltip.appendTo(map.getPanes().floatPane);

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
        fillOpacity: 0.8,
        strokeWeight: 4,
        strokeOpacity: 1,
      });
    });

    map.data.addListener("mouseout", function (e) {
      tooltip.hide().empty();
      map.data.revertStyle();
    });
  }

  /**
   * GeoJSON 파일을 로드하는 함수
   */
  function loadGeoJSON() {
    const geoJsonPath = "/resources/map/seoul.json";
    $.ajax({
      url: geoJsonPath,
      dataType: "json",
      success: function (geojson) {
        startDataLayer(geojson);
      },
      error: function (xhr, status, error) {
        console.error("GeoJSON 파일을 로드하는 데 실패했습니다:", error);
        startDataLayer(null);
      },
    });
  }

  /**
   * AJAX 요청을 통해 전체 매장 데이터를 가져오는 함수
   */
  function fetchAllStores() {
    $.ajax({
      url: `/qsc/store-inspection/map/all-store`,
      type: "GET",
      data: {
        currentMbrNo: currentUsername,
      },
      success: function (data) {
        allStores = data;
        console.log("전체 매장 데이터:", allStores);

        if ($("#map-all").hasClass("active")) {
          addMarkers(allStores);
        }

        // Autocomplete 초기화
        initializeAutocompletes();
      },
      error: function (xhr, status, error) {
        console.error("전체 매장 AJAX 요청 실패:", status, error);
      },
    });
  }

  /**
   * AJAX 요청을 통해 오늘의 점검 데이터를 가져오는 함수
   */
  function fetchTodayInspections() {
    $.ajax({
      url: `/qsc/store-inspection/map/today-inspection/${currentUsername}`,
      type: "GET",
      success: function (data) {
        todayInspections = data;
        console.log("오늘의 점검 데이터:", todayInspections);
      },
      error: function (xhr, status, error) {
        console.error("오늘의 점검 AJAX 요청 실패:", status, error);
      },
    });
  }

  /**
   * 마커를 지도에 추가하는 함수
   * @param {Object} options - 마커 옵션 객체
   * @returns {naver.maps.Marker} 생성된 마커 객체
   */
  function addMarker(options) {
    var marker = new naver.maps.Marker({
      map: map,
      position: options.position,
      title: options.title,
      icon: options.icon || null,
    });

    if (options.infoWindow) {
      var infowindow = new naver.maps.InfoWindow({
        content: options.infoWindow.content,
        backgroundColor: options.infoWindow.backgroundColor || "#fff",
        borderColor: options.infoWindow.borderColor || "#ccc",
        borderWidth: options.infoWindow.borderWidth || 1,
        anchorSize:
          options.infoWindow.anchorSize || new naver.maps.Size(10, 10),
        anchorSkew: options.infoWindow.anchorSkew || true,
      });

      naver.maps.Event.addListener(marker, "click", function (e) {
        infowindow.open(map, marker);
      });
    }

    return marker;
  }

  /**
   * 출발지 마커를 지도에 추가하는 함수
   * @param {Object} coordinates - 좌표 객체 ({ x: 경도, y: 위도 })
   */
  function addStartMarker(coordinates) {
    console.log("Adding Start Marker at:", coordinates);
    if (startMarker) {
      startMarker.setMap(null);
    }

    startMarker = addMarker({
      position: new naver.maps.LatLng(coordinates.y, coordinates.x),
      title: "출발지",
      icon: {
        url: "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png",
        size: new naver.maps.Size(24, 37),
        origin: new naver.maps.Point(0, 0),
        anchor: new naver.maps.Point(12, 37),
      },
      infoWindow: {
        content: '<div style="padding:5px;">출발지</div>',
      },
    });
  }

  /**
   * 도착지 마커를 지도에 추가하는 함수
   * @param {Object} coordinates - 좌표 객체 ({ x: 경도, y: 위도 })
   */
  function addEndMarker(coordinates) {
    console.log("Adding End Marker at:", coordinates);
    if (endMarker) {
      endMarker.setMap(null);
    }

    endMarker = addMarker({
      position: new naver.maps.LatLng(coordinates.y, coordinates.x),
      title: "도착지",
      icon: {
        url: "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerRed.png",
        size: new naver.maps.Size(24, 37),
        origin: new naver.maps.Point(0, 0),
        anchor: new naver.maps.Point(12, 37),
      },
      infoWindow: {
        content: '<div style="padding:5px;">도착지</div>',
      },
    });
  }

  /**
   * 경유지 마커들을 지도에 추가하는 함수 (가맹점명 사용 및 좌표 비교에 허용 오차 적용)
   * @param {Object[]} viaPoints - 경유지 좌표 배열
   */
  function addWaypointMarkers(viaPoints) {
    console.log("Adding Waypoint Markers:", viaPoints);

    // 기존 경유지 마커 제거
    $.each(waypointMarkers, function (index, marker) {
      marker.setMap(null);
    });
    waypointMarkers = [];

    var epsilon = 0.00001;

    // 경유지 포인트마다 마커 추가
    $.each(viaPoints, function (index, point) {
      console.log(`Processing waypoint ${index + 1}:`, point);

      var pointX = point.location.x;
      var pointY = point.location.y;

      console.log(`Current Waypoint Coordinates: x=${pointX}, y=${pointY}`);

      if (pointX != null && pointY != null) {
        // todayInspections 데이터에서 현재 포인트와 일치하는 가맹점 찾기 (허용 오차 적용)
        var matchingStore = todayInspections.find(function (store) {
          var isMatch =
            Math.abs(store.longitude - pointX) < epsilon &&
            Math.abs(store.latitude - pointY) < epsilon;
          if (isMatch) {
            console.log(`Match found for waypoint ${index + 1}:`, store);
          }
          return isMatch;
        });

        if (matchingStore) {
          console.log(
            `Waypoint ${index + 1} matched with store: ${matchingStore.storeNm}`,
          );
        } else {
          console.log(`Waypoint ${index + 1} did not match any store.`);
        }

        var markerTitle = matchingStore
          ? matchingStore.storeNm
          : "목적지 " + (index + 1);

        var marker = addMarker({
          position: new naver.maps.LatLng(pointY, pointX),
          title: markerTitle,
          icon: {
            url: "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/waypoint.png",
            size: new naver.maps.Size(24, 37),
            origin: new naver.maps.Point(0, 0),
            anchor: new naver.maps.Point(12, 37),
          },
          infoWindow: {
            content: '<div style="padding:5px;">' + markerTitle + "</div>",
          },
        });
        waypointMarkers.push(marker);
      } else {
        console.error("Invalid waypoint coordinates:", point);
      }
    });
  }

  /**
   * 최적화된 경로를 요청하는 함수
   * @param {Object} start - 출발지 좌표 객체 ({ x: 경도, y: 위도 })
   * @param {Object[]} goals - 목적지 좌표 배열
   */
  function testDrivingRoute(start, goals) {
    console.log(flagSchedule);
    if (flagSchedule) {
      displayRouteResults(cachedRouteData);
    } else {
      $.ajax({
        url: "/qsc/store-inspection/map/select-driving-route",
        method: "POST",
        contentType: "application/json",
        data: JSON.stringify({
          start: start,
          goals: goals,
        }),
        success: function (response) {
          console.log("TestDrivingRoute Response:", response);
          if (response.code === 0 && response.route && response.route.trafast) {
            var routes = response.route.trafast;
            cachedRouteData = routes;
            displayRouteResults(routes);

            if (routes.length > 0) {
              var firstRoute = routes[0];
              var startCoordinates = firstRoute.summary.start.location;
              map.setCenter(
                new naver.maps.LatLng(startCoordinates[1], startCoordinates[0]),
              );
            }
            flagSchedule = true;
            showAlert("성공!", "경로가 정상적으로 조회되었습니다.", "success");
          } else {
            showAlert(
              "실패!",
              "경로 검색에 실패했습니다: " +
                (response.message || "알 수 없는 오류"),
              "error",
              activateMapAll(),
            );
            console.error("TestDrivingRoute Error:", response);
          }
        },
        error: function (jqXHR, textStatus, errorThrown) {
          console.error(
            "TestDrivingRoute AJAX Error:",
            textStatus,
            errorThrown,
          );
          if (jqXHR.status === 403) {
            showAlert("실패!", "권한이 없습니다.", "error");
          } else if (jqXHR.status === 409) {
            showAlert("실패!", "사용중인 점검계획이 있습니다.", "error");
          } else if (jqXHR.status === 400) {
            showAlert("실패!", "잘못된 요청입니다.", "error");
          } else {
            showAlert("알림", "금일 점검하실 목록이 없습니다.", "info");
          }
          activateMapAll();
        },
      });
    }
  }

  /**
   * 전체보기 버튼을 활성화하고, 오늘의 점검 버튼을 비활성화하며, 전체보기 뷰를 표시하는 함수
   */
  function activateMapAll() {
    // 버튼 상태 변경
    $("#map-all").addClass("active");
    $("#map-tsp").removeClass("active");

    // 뷰 전환
    $("#all-view").show();
    $("#today-inspection-view").hide();

    // 캐시된 경로 데이터 초기화
    cachedRouteData = null;

    // 모든 매장 마커 추가
    addMarkers(allStores);
  }

  /**
   * 매장 데이터를 기반으로 마커를 지도에 추가하는 함수
   * @param {Object[]} dataArray - 매장 데이터 배열
   */
  function addMarkers(dataArray) {
    initialMarkers.forEach((marker) => {
      marker.setMap(null);
      marker.infoWindow && marker.infoWindow.close();
    });
    initialMarkers = [];

    dataArray.forEach((store) => {
      if (store.latitude && store.longitude) {
        const position = new naver.maps.LatLng(store.latitude, store.longitude);
        const marker = new naver.maps.Marker({
          map: map,
          position: position,
          title: store.storeNm,
          zIndex: 100,
        });

        const contentString = `
          <div class='custom_infowindow'>
            <strong>${store.storeNm}</strong><br>
            브랜드: ${store.brandNm}<br>
            점검자: ${store.inspectorName || "미정"}<br>
            SV : ${store.supervisorName || "미정"}<br>
            최근 점검일 : ${store.inspComplTm || "없음"}
            <div class='custom_tail'></div>
          </div>
        `;

        const infoWindow = new naver.maps.InfoWindow({
          content: contentString,
          disableAnchor: true,
          pixelOffset: new naver.maps.Point(0, -10),
          backgroundColor: "transparent",
          borderWidth: 0,
        });

        naver.maps.Event.addListener(marker, "click", function () {
          if (activeInfoWindow && activeInfoWindow !== infoWindow) {
            activeInfoWindow.close();
          }

          // 왼쪽요소
          $("#selectStore").val("");
          $("#selectStore").val(store.storeNm);

          $("#selectBrand").val("");
          $("#selectBrand").val(store.brandNm);

          $("#selectInspector").val("");
          $("#selectInspector").val(store.inspectorName);

          $("#selectSV").val("");
          $("#selectSV").val(store.supervisorName);
          $("#selectComplTm").val(store.inspComplTm !== null ? store.inspComplTm.slice(0, 8) : '');

          // 동일한 storeNm을 가진 모든 매장 필터링
          let matchingStores = allStores.filter(
            (s) => s.storeNm === store.storeNm,
          );

          addStoreInfoSideTable(matchingStores);

          if (infoWindow.getMap()) {
            infoWindow.close();
            activeInfoWindow = null;
          } else {
            infoWindow.open(map, marker);
            activeInfoWindow = infoWindow;
          }
        });

        marker.infoWindow = infoWindow;
        initialMarkers.push(marker);
      }
    });

    naver.maps.Event.addListener(map, "idle", function () {
      updateMarkers();
    });

    function updateMarkers() {
      var mapBounds = map.getBounds();

      initialMarkers.forEach(function (marker) {
        var position = marker.getPosition();
        if (mapBounds.hasLatLng(position)) {
          showMarker(marker);
        } else {
          hideMarker(marker);
        }
      });
    }

    function showMarker(marker) {
      if (marker.getMap()) return;
      marker.setMap(map);
    }

    function hideMarker(marker) {
      if (!marker.getMap()) return;
      marker.setMap(null);
    }
  }

  /**
   * 경로 결과를 지도에 표시하는 함수
   * @param {Object[]} routes - 경로 데이터 배열
   */
  function displayRouteResults(routes) {
    console.log("총경로 수 = " + routes.length);
    console.log("Routes:", routes);

    $("#route-container-id").empty();
    showLoading();
    hideError();

    $.each(polylines, function (index, polyline) {
      polyline.setMap(null);
    });
    polylines = [];

    if (endMarker) endMarker.setMap(null);
    $.each(waypointMarkers, function (index, marker) {
      marker.setMap(null);
    });
    waypointMarkers = [];

    var totalDistance = 0;
    var totalDuration = 0;

    $.each(routes, function (routeIndex, route) {
      var summary = route.summary;
      var startLocation = summary.start.location;
      var goalLocation = summary.goal.location;
      var waypoints = summary.waypoints || [];
      var sections = route.section || [];
      var path = route.path;

      if (!path || !Array.isArray(path)) {
        console.warn(
          `Route ${routeIndex + 1}: path 데이터가 유효하지 않습니다.`,
        );
        return true;
      }

      console.log(`Route ${routeIndex + 1} Path Length: ${path.length}`);
      console.log("Processing route:", routeIndex + 1);

      addEndMarker({ x: goalLocation[0], y: goalLocation[1] });
      addWaypointMarkers(waypoints);

      var waypointNames = [];

      $.each(waypointMarkers, function (index, marker) {
        waypointNames.push(marker.getTitle());
      });

      var segments = [];

      if (waypoints.length > 0) {
        segments.push({
          from: "출발지",
          to: waypointNames[0] || "목적지 1",
          distance: waypoints[0].distance,
          duration: waypoints[0].duration,
          congestion: sections[0] ? sections[0].congestion : 0,
        });

        for (var i = 1; i < waypoints.length; i++) {
          segments.push({
            from: waypointNames[i - 1] || "목적지 " + i,
            to: waypointNames[i] || "목적지 " + (i + 1),
            distance: waypoints[i].distance,
            duration: waypoints[i].duration,
            congestion: sections[i] ? sections[i].congestion : 0,
          });
        }

        segments.push({
          from:
            waypointNames[waypoints.length - 1] || "목적지 " + waypoints.length,
          to: "도착지",
          distance: summary.goal.distance,
          duration: summary.goal.duration,
          congestion: sections[waypoints.length]
            ? sections[waypoints.length].congestion
            : 0,
        });
      } else {
        segments.push({
          from: "출발지",
          to: "도착지",
          distance: summary.goal.distance,
          duration: summary.goal.duration,
          congestion: sections[0] ? sections[0].congestion : 0,
        });
      }

      $.each(segments, function (index, segment) {
        var $routeDiv = $("<div>", { class: "map-route" });
        var $detailDiv = $("<div>", { class: "map-route-detail" });
        console.table(segment)
        var routeName = $("<span>").html(
          `${segment.from}<i class="fa-solid fa-angles-right"></i> ${segment.to}`,
        );

        var $routeInfo = $("<span>");
        var $durationSpan = $("<strong>").text(
          Math.round(segment.duration / 60000),
        );
        $routeInfo.append($durationSpan).append("분 ");

        $routeInfo.append('<span class="divider"></span> ');

        var distanceKm = (segment.distance / 1000).toFixed(1);
        $routeInfo.append(`<span>${distanceKm}km</span> `);

        var $congestionSpan = $("<span>")
          .addClass(getCongestionClass(segment.congestion))
          .attr("id", `congestion${index + 1}`)
          .html(getCongestionLabel(segment.congestion));
        $routeInfo.append($congestionSpan);

        $detailDiv.append(routeName).append($routeInfo);
        $routeDiv.append($detailDiv);
        $("#route-container-id").append($routeDiv);

        totalDistance += segment.distance;
        totalDuration += Math.round(segment.duration / 60000);
      });

      if (sections.length > 0) {
        sections.sort(function (a, b) {
          return a.pointIndex - b.pointIndex;
        });

        var currentIdx = 0;

        $.each(sections, function (sectionIndex, section) {
          var sectionStart = section.pointIndex;
          var sectionEnd = sectionStart + section.pointCount;

          if (sectionStart < 0 || sectionEnd >= path.length) {
            console.warn(
              `Section ${sectionIndex + 1}: Invalid pointIndex (${sectionStart}) or pointCount (${section.pointCount}).`,
            );
            return true;
          }

          if (currentIdx < sectionStart) {
            var nonCongestedPathCoords = path.slice(currentIdx, sectionStart);
            if (nonCongestedPathCoords.length > 1) {
              var nonCongestedPath = $.map(
                nonCongestedPathCoords,
                function (coords) {
                  return new naver.maps.LatLng(coords[1], coords[0]);
                },
              );

              var outlinePolyline = new naver.maps.Polyline({
                map: map,
                path: nonCongestedPath,
                strokeColor: "#000000",
                strokeOpacity: 1,
                strokeWeight: 6,
                zIndex: 100,
              });

              polylines.push(outlinePolyline);

              var mainNonCongestedPolyline = new naver.maps.Polyline({
                map: map,
                path: nonCongestedPath,
                strokeColor: "#1cdf1c",
                strokeOpacity: 1,
                strokeWeight: 6,
                zIndex: 101,
              });

              polylines.push(mainNonCongestedPolyline);

              console.log(
                `Non-Congested Main Polyline (Section ${sectionIndex + 1}):`,
                mainNonCongestedPolyline,
              );
            }
          }

          var pathCoordinates = path.slice(sectionStart, sectionEnd + 1);
          var congestion = Number(section.congestion);
          var color = congestionColors[congestion] || "#FF0000";

          var polylinePath = $.map(pathCoordinates, function (coords) {
            return new naver.maps.LatLng(coords[1], coords[0]);
          });

          var outlinePolyline = new naver.maps.Polyline({
            map: map,
            path: polylinePath,
            strokeColor: "#000000",
            strokeOpacity: 1,
            strokeWeight: 6,
            zIndex: 100,
          });

          polylines.push(outlinePolyline);

          var mainPolyline = new naver.maps.Polyline({
            map: map,
            path: polylinePath,
            strokeColor: color,
            strokeOpacity: 1,
            strokeWeight: 6,
            zIndex: 101,
          });

          polylines.push(mainPolyline);

          console.log(
            `Section ${sectionIndex + 1} Main Polyline:`,
            mainPolyline,
          );

          currentIdx = sectionEnd + 1;
        });

        if (currentIdx < path.length) {
          var remainingPathCoords = path.slice(currentIdx, path.length);
          if (remainingPathCoords.length > 1) {
            var remainingPath = $.map(remainingPathCoords, function (coords) {
              return new naver.maps.LatLng(coords[1], coords[0]);
            });

            var remainingOutlinePolyline = new naver.maps.Polyline({
              map: map,
              path: remainingPath,
              strokeColor: "#000000",
              strokeOpacity: 1,
              strokeWeight: 6,
              zIndex: 100,
            });

            polylines.push(remainingOutlinePolyline);

            var remainingMainPolyline = new naver.maps.Polyline({
              map: map,
              path: remainingPath,
              strokeColor: "#FF0000",
              strokeOpacity: 1,
              strokeWeight: 6,
              zIndex: 101,
            });

            polylines.push(remainingMainPolyline);

            console.log(`Remaining Main Polyline:`, remainingMainPolyline);
          }
        }
      } else {
        var fullPath = $.map(path, function (coords) {
          return new naver.maps.LatLng(coords[1], coords[0]);
        });

        var fullOutlinePolyline = new naver.maps.Polyline({
          map: map,
          path: fullPath,
          strokeColor: "#000000",
          strokeOpacity: 1,
          strokeWeight: 6,
          zIndex: 100,
        });

        polylines.push(fullOutlinePolyline);

        var fullMainPolyline = new naver.maps.Polyline({
          map: map,
          path: fullPath,
          strokeColor: "#1cdf1c",
          strokeOpacity: 1,
          strokeWeight: 6,
          zIndex: 101,
        });

        polylines.push(fullMainPolyline);

        console.log(`Full Main Polyline:`, fullMainPolyline);
      }
    });

    // 총계 업데이트
    var totalHours = Math.floor(totalDuration / 60);
    var totalMinutes = totalDuration % 60;
    $("#today-total-time-hour").text(totalHours);
    $("#today-total-time-minute").text(totalMinutes);

    var totalDistanceKm = (totalDistance / 1000).toFixed(1);
    $("#today-total-distance").text(totalDistanceKm);

    adjustMapBounds();
    hideLoading();
  }

  /**
   * 혼잡도에 따른 CSS 클래스를 반환하는 함수
   * @param {number} congestion - 혼잡도 (0: 원활, 1: 보통, 2: 혼잡)
   * @returns {string} CSS 클래스명
   */
  function getCongestionClass(congestion) {
    switch (congestion) {
      case 0:
        return "congestionWant"; // 원활 congestionWant
      case 1:
        return "congestionWant"; // 원활 congestionWant
      case 2:
        return "congestionNormal"; // 보통 congestionNormal
      case 3:
        return "congestionConfusion" // 혼잡 congestionConfusion
      default:
        return "congestionConfusion"; // 혼잡
    }
  }

  /**
   * 혼잡도에 따른 라벨을 반환하는 함수
   * @param {number} congestion - 혼잡도 (0: 원활, 1: 보통, 2: 혼잡)
   * @returns {string} 혼잡도 라벨
   */
  function getCongestionLabel(congestion) {
    switch (congestion) {
      case 0:
        return "원활";
      case 1:
        return "월활";
      case 2:
        return "서행";
      case 3:
        return "혼잡"
      default:
        return "혼잡";
    }
  }

  /**
   * 로딩 스피너를 표시하는 함수
   */
  function showLoading() {
    $("#loadingSpinner").show();
  }

  /**
   * 로딩 스피너를 숨기는 함수
   */
  function hideLoading() {
    $("#loadingSpinner").hide();
  }

  /**
   * 오류 메시지를 표시하는 함수
   * @param {string} message - 표시할 오류 메시지
   */
  function showError(message) {
    $("#errorMessage").text(message).show();
  }

  /**
   * 오류 메시지를 숨기는 함수
   */
  function hideError() {
    $("#errorMessage").hide();
  }

  /**
   * 지도 범위를 마커들이 모두 보이도록 조정하는 함수
   */
  function adjustMapBounds() {
    var bounds = new naver.maps.LatLngBounds();

    if (startMarker) bounds.extend(startMarker.getPosition());
    if (endMarker) bounds.extend(endMarker.getPosition());
    $.each(waypointMarkers, function (index, marker) {
      bounds.extend(marker.getPosition());
    });
    $.each(initialMarkers, function (index, marker) {
      bounds.extend(marker.getPosition());
    });

    map.fitBounds(bounds);
  }

  /**
   * 경로의 표시 여부를 토글하는 함수
   */
  function toggleRoutesVisibility() {
    if (routesVisible) {
      polylines.forEach(function (polyline) {
        polyline.setMap(null);
      });
      routesVisible = false;
      $("#toggleRouteBtn").text("경로 표시하기");
    } else {
      polylines.forEach(function (polyline) {
        polyline.setMap(map);
      });
      routesVisible = true;
      $("#toggleRouteBtn").text("경로 숨기기");
    }
  }

  /**
   * 중복되지 않은 모든 매장 정보를 사이드 테이블에 추가
   * @param {Array} stores - 중복되지 않은 매장 정보 배열
   */
  function addStoreInfoSideTable(stores) {
    // 기존 테이블 내용 비우기 (처음 한 번만 수행)
    $(".custom-table tbody").empty();
    console.log(stores);
    // 각 매장 정보를 테이블에 추가
    stores.forEach((store) => {
      const newRow = $("<tr>");
      newRow.append($("<td>").text(store.storeNm));
      newRow.append($("<td>").text(store.inspPlanDt));
      newRow.append($("<td>").text(store.chkLstNm));
      newRow.append($("<td>").text(store.inspectorName));
      newRow.append($("<td>").text(store.supervisorName));
      $(".custom-table tbody").append(newRow);
    });
  }

  /**
   * 이벤트 리스너를 설정하는 함수
   */
  function setupEventListeners() {
    // 테스트 버튼 이벤트
    $("#testBtn").click(function () {
      testDrivingRoute(); // 기존 기능 유지
    });

    $("#toggleRouteBtn").on("click", function (e) {
      e.preventDefault();
      toggleRoutesVisibility();
    });

    // 전체보기 버튼 이벤트
    $("#map-all").on("click", function (e) {
      e.preventDefault();
      $(this).addClass("active");
      $("#map-tsp").removeClass("active");

      $("#all-view").show();
      $("#today-inspection-view").hide();

      cachedRouteData = null;

      addMarkers(allStores);
    });

    // 오늘의 점검 버튼 이벤트
    $("#map-tsp").on("click", function (e) {
      e.preventDefault();
      $(this).addClass("active");
      $("#map-all").removeClass("active");

      $("#today-inspection-view").show();
      $("#all-view").hide();

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          function (position) {
            var currentLat = position.coords.latitude;
            var currentLng = position.coords.longitude;

            var start = { x: currentLng, y: currentLat };

            var goals = todayInspections.map(function (store) {
              return { x: store.longitude, y: store.latitude };
            });

            addStartMarker(start);

            testDrivingRoute(start, goals);
          },
          function (error) {
            alert("현재 위치를 가져올 수 없습니다: " + error.message);
            console.error("Geolocation Error:", error);
          },
        );
      } else {
        alert("Geolocation을 지원하지 않는 브라우저입니다.");
      }

      addMarkers(todayInspections);
    });
  }

  /**
   * 초기화 함수를 호출하는 함수
   */
  function initialize() {
    initNaverMap();
    setupEventListeners();
    loadGeoJSON();
    fetchAllStores();
    fetchTodayInspections();
  }

  // 초기화 실행
  initialize();

  // ---------  지도 끝 ---------
  /**
   * Autocomplete 클래스 정의
   */
  class Autocomplete {
    /**
     * 생성자
     * @param {jQuery} $wrapper - 자동완성을 적용할 wrapper 요소
     * @param {Array} dataList - 자동완성에 사용할 데이터 목록 (객체 배열)
     */
    constructor($wrapper, dataList) {
      this.$wrapper = $wrapper;
      this.$searchBtn = $wrapper.find(".search-btn");
      this.$input = $wrapper.find("input");
      this.$options = $wrapper.find(".options");
      this.dataList = dataList;

      this.init();
    }

    /**
     * 초기화 메서드
     * 이벤트 리스너를 설정하고 초기 리스트를 렌더링
     */
    init() {
      this.renderOptions();
      this.bindEvents();
    }

    /**
     * 옵션 리스트를 렌더링.
     * @param {string} [selectedItem] - 선택된 아이템을 표시
     */
    renderOptions(selectedItem = null) {
      this.$options.empty();
      console.log("Rendering options with selectedItem:", selectedItem);

      // storeNm을 기준으로 중복 제거
      const uniqueStoreNames = [];
      const storeNameSet = new Set();

      this.dataList.forEach((item) => {
        if (!storeNameSet.has(item.storeNm)) {
          storeNameSet.add(item.storeNm);
          uniqueStoreNames.push(item.storeNm);
        }
      });

      uniqueStoreNames.sort((a, b) => a.localeCompare(b, "ko-KR"));

      uniqueStoreNames.forEach((storeNm) => {
        const isSelected = storeNm === selectedItem ? "selected" : "";
        const li = `<li onclick="window.updateName(this)" class="${isSelected} autocomplete-item list-group-item list-group-item-action">${storeNm}</li>`;
        this.$options.append(li);
      });
    }

    filterOptions(query) {
      console.log("Filtering options with query:", query);

      const filtered = this.dataList
          .filter((item) =>
              item.storeNm.toLowerCase().includes(query.toLowerCase()),
          )
          .map((item) => item.storeNm);

      const uniqueFiltered = [...new Set(filtered)];

      this.$options.empty();
      if (uniqueFiltered.length > 0) {
        uniqueFiltered.sort((a, b) => a.localeCompare(b, "ko-KR"));
        uniqueFiltered.forEach((storeNm) => {
          const isSelected =
              storeNm === this.$searchBtn.find(".storeNm").text()
                  ? "selected"
                  : "";
          const li = `<li onclick="window.updateName(this)" class="${isSelected} autocomplete-item list-group-item list-group-item-action">${storeNm}</li>`;
          this.$options.append(li);
        });
      } else {
        this.$options.html(
            `<li class="list-group-item">찾으시는 항목이 없습니다.</li>`,
        );
      }
    }

    bindEvents() {
      this.$searchBtn.on("click", (e) => {
        e.stopPropagation();
        $(".wrapper").not(this.$wrapper).removeClass("active");
        this.$wrapper.toggleClass("active");
        this.$input.focus();
      });

      this.$input.on("keyup", (e) => {
        e.stopPropagation();
        const query = this.$input.val();
        if (query) {
          this.filterOptions(query);
        } else {
          this.renderOptions();
        }
      });

      $(document).on("click", (e) => {
        if (
            !this.$wrapper.is(e.target) &&
            this.$wrapper.has(e.target).length === 0
        ) {
          this.$wrapper.removeClass("active");
        }
      });
    }

    updateSelected(selectedItem) {
      this.$input.val("");
      this.renderOptions(selectedItem);
      this.$wrapper.removeClass("active");
      this.$searchBtn.find(".storeNm").text(selectedItem);
    }
  }

  window.updateName = function (selectedLi) {
    const selectedText = $(selectedLi).text();
    console.log("Selected item:", selectedText);
    const $wrapper = $(selectedLi).closest(".wrapper");
    const instance = $wrapper.data("autocompleteInstance");

    if (instance) {
      instance.updateSelected(selectedText);

      if ($wrapper.data("autocomplete") === "store") {
        const selectedStores = allStores.filter(
            (store) => store.storeNm === selectedText,
        );

        if (
            selectedStores.length > 0 &&
            selectedStores[0].latitude &&
            selectedStores[0].longitude
        ) {
          const selectedStore = selectedStores[0];
          const selectedPosition = new naver.maps.LatLng(
              selectedStore.latitude,
              selectedStore.longitude,
          );

          $wrapper.find(".storeNm").text(selectedStore.storeNm);
          $("#selectBrand").val(selectedStore.brandNm);
          $("#selectInspector").val(selectedStore.inspectorName);
          $("#selectSV").val(selectedStore.supervisorName);
          $("#selectComplTm").val(selectedStore.inspComplTm);

          addStoreInfoSideTable(selectedStores);

          map.setCenter(selectedPosition);
          map.setZoom(15);

          const marker = initialMarkers.find(
              (m) => m.getTitle() === selectedText,
          );
          if (marker && marker.infoWindow) {
            if (activeInfoWindow && activeInfoWindow !== marker.infoWindow) {
              activeInfoWindow.close();
            }
            marker.infoWindow.open(map, marker);
            activeInfoWindow = marker.infoWindow;
          }
        } else {
          console.error(
            "선택된 매장의 좌표 정보가 부족합니다:",
            selectedStores,
          );
        }
      }
    } else {
      console.error("Autocomplete instance not found for wrapper:", $wrapper);
    }
  };

  const autocompleteData = {
    store: () =>
      Promise.resolve(
        allStores.sort((a, b) => a.storeNm.localeCompare(b.storeNm, "ko-KR")),
      ),
    inspector: () =>
      $.ajax({
        url: "/qsc/inspection-schedule/inspectors",
        method: "GET",
      }).then((data) => {
        return ["전체", ...data];
      }),
    INSP: () => Promise.resolve(["전체", "정기 점검", "제품 점검"]),
    CHKLST: () =>
      $.ajax({
        url: "/qsc/inspection-schedule/checklists",
        method: "GET",
      }).then((data) => {
        return ["전체", ...data];
      }),
    BRAND: () =>
      $.ajax({
        url: "/qsc/inspection-schedule/brands",
        method: "GET",
      }).then((data) => {
        return ["전체", ...data];
      }),
  };

  function initializeAutocomplete(type, dataList) {
    const $wrapper = $(`.wrapper[data-autocomplete="${type}"]`);
    if ($wrapper.length > 0) {
      const autocomplete = new Autocomplete($wrapper, dataList);
      $wrapper.data("autocompleteInstance", autocomplete);
      console.log(`Initialized Autocomplete for type: ${type}`);
    } else {
      console.error(`No wrapper found for autocomplete type: ${type}`);
    }
  }

  function initializeAutocompletes() {
    $(".wrapper").each(function () {
      const $wrapper = $(this);
      const type = $wrapper.data("autocomplete");
      if (type && autocompleteData[type]) {
        autocompleteData[type]()
          .then((response) => {
            let dataList;
            if (type === "INSP") {
              dataList = response;
            } else if (type === "store") {
              dataList = response; // store 타입은 객체 배열을 반환
            } else {
              dataList = response.data || response;
            }
            initializeAutocomplete(type, dataList);
          })
          .catch((error) => {
            console.error(
              `Error fetching autocomplete data for type ${type}:`,
              error,
            );
          });
      }
    });
  }
});
