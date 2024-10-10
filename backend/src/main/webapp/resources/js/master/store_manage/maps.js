// 전역 변수 선언
window.map = null;
window.infoWindow = null;

// 지도 및 관련 함수 초기화
document.addEventListener("DOMContentLoaded", function () {
  // 홈 경로 설정
  var HOME_PATH = window.HOME_PATH || ".",
    geoJsonPath = "/resources/map/seoul.json",
    seoulGeoJson;

  // 지도 객체 생성
  map = new naver.maps.Map("map", {
    zoom: 15,
    mapTypeId: "normal",
    center: new naver.maps.LatLng(37.5665, 126.978),
  });

  // 모달이 보여질 때 지도의 크기를 재설정
  $("#DetailStore").on("shown.bs.modal", function () {
    setTimeout(function () {
      window.dispatchEvent(new Event("resize"));
    }, 600);
  });

  // 정보창 생성
  infoWindow = new naver.maps.InfoWindow({
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

      if (feature.getProperty("focus")) {
        styleOptions.fillOpacity = 0.6;
        styleOptions.fillColor = "#0f0";
        styleOptions.strokeColor = "#0f0";
        styleOptions.strokeWeight = 4;
        styleOptions.strokeOpacity = 1;
      }

      return styleOptions;
    });

    // 로드된 seoulGeoJson 데이터를 지도에 추가
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

    // 필요 시 마커 추가 함수 호출
    // addMarkers();
  }

  // 주소를 좌표로 변환하는 함수 (전역 함수로 선언)
  window.searchAddressToCoordinate = function (address) {
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
        map.panBy(0, 100); // 필요에 따라 조정
        infoWindow.open(map, point);
      },
    );
  };

  // 지도 및 지오코더 초기화
  naver.maps.Event.once(map, "init", function () {
    initGeocoder();
  });

  // 초기화 함수
  function initGeocoder() {
    // 주소 검색 입력창에서 Enter 키 처리
    $("#storeAddress").on("keydown", function (e) {
      var keyCode = e.which;

      if (keyCode === 13) {
        searchAddressToCoordinate($("#storeAddress").val());
      }
    });

    // 검색 버튼 클릭 처리
    $("#submit").on("click", function (e) {
      e.preventDefault();

      searchAddressToCoordinate($("#storeAddress").val());
    });
  }
});
