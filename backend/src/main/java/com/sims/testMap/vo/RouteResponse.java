package com.sims.testMap.vo;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;

import java.util.List;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class RouteResponse {
    private int code;
    private String message;
    private String currentDateTime;
    private Route route;

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Route {
        private List<TrafastRoute> trafast;
    }

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class TrafastRoute {
        private Summary summary;
        private List<List<Double>> path; // 경로 좌표
        private List<Section> section;
        private List<Guide> guide;
    }

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Summary {
        private Start start;
        private DetailedAddress goal;
        private List<DetailedAddress> waypoints;
        private int distance;
        private long duration;
        private String departureTime;
        private List<List<Double>> bbox;
        private int tollFare;
        private int taxiFare;
        private int fuelPrice;
    }

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Start {
        private Coordinates location; // "location": [x, y]
    }

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class DetailedAddress {
        private Coordinates location;
        private int dir;
        private int distance;
        private long duration;
        private int pointIndex;
    }

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Section {
        private int pointIndex;
        private int pointCount;
        private int distance;
        private String name;
        private int congestion;
        private int speed;
    }

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Guide {
        private int pointIndex;
        private int type;
        private String instructions;
        private int distance;
        private long duration;
    }
}
