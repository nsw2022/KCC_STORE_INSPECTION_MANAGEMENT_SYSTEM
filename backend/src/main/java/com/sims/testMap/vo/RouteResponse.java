package com.sims.testMap.vo;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import java.util.List;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class RouteResponse {
    private int code; // 응답 코드 (0: 성공, 그 외: 오류 코드)
    private String message; // 응답 메시지
    private String currentDateTime; // 응답이 생성된 현재 날짜와 시간
    private Route route; // 길찾기 결과를 담는 Route 객체

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Route {
        @JsonProperty("trafast")
        private List<TrafastRoute> trafast; // 빠른 경로(trafast) 리스트

        @JsonProperty("traoptimal")
        private List<TraoptimalRoute> traoptimal; // 최적 경로(traoptimal) 리스트
    }

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class TrafastRoute {
        private Summary summary; // 경로 요약 정보
        private List<List<Double>> path; // 경로 좌표 리스트 ([경도, 위도] 형태)
        private List<Section> section; // 경로를 구간별로 나눈 정보 리스트
        private List<Guide> guide; // 운전자에게 제공되는 안내 지침 리스트
    }

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class TraoptimalRoute {
        private Summary summary; // 경로 요약 정보
        private List<List<Double>> path; // 경로 좌표 리스트 ([경도, 위도] 형태)
        private List<Section> section; // 경로를 구간별로 나눈 정보 리스트
        private List<Guide> guide; // 운전자에게 제공되는 안내 지침 리스트
    }

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Summary {
        private Start start; // 출발지 정보
        private DetailedAddress goal; // 도착지 정보
        private List<DetailedAddress> waypoints; // 경유지 정보 리스트
        private int distance; // 총 거리 (미터 단위)
        private long duration; // 총 예상 소요 시간 (밀리초 단위)
        private String departureTime; // 출발 시간
        private List<List<Double>> bbox; // 경로를 포함하는 경계 박스 좌표
        private int tollFare; // 통행료 (원 단위)
        private int taxiFare; // 예상 택시 요금 (원 단위)
        private int fuelPrice; // 예상 연료비 (원 단위)
    }

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Start {
        private Coordinates location; // 출발지 좌표 ([경도, 위도])
    }

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class DetailedAddress {
        private Coordinates location; // 위치 좌표 ([경도, 위도])
        private int dir; // 방향 정보
        private int distance; // 남은 거리 (미터 단위)
        private long duration; // 남은 예상 소요 시간 (밀리초 단위)
        private int pointIndex; // 경로 상의 인덱스
    }

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Section {
        private int pointIndex; // 구간이 시작되는 경로 상의 인덱스
        private int pointCount; // 구간 내에 포함된 포인트의 수
        private int distance; // 구간의 거리 (미터 단위)
        private String name; // 도로명 또는 구간의 이름
        private int congestion; // 혼잡도 (예: 1~5)
        private int speed; // 해당 구간의 평균 속도 (km/h)
    }

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Guide {
        private int pointIndex; // 안내가 적용되는 경로 상의 인덱스
        private int type; // 안내 유형 코드 (예: 2는 좌회전)
        private String instructions; // 안내 메시지 또는 지시사항
        private int distance; // 다음 안내 지점까지의 거리 (미터 단위)
        private long duration; // 해당 구간의 예상 소요 시간 (밀리초 단위)
    }
}
