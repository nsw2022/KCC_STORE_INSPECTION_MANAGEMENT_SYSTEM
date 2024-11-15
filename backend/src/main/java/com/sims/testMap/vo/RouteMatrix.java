package com.sims.testMap.vo;


import java.util.HashMap;
import java.util.Map;

/**
 * **RouteMatrix 클래스**
 * 목적지 간의 소요 시간을 저장하고 조회하는 매트릭스 클래스입니다.
 */
public class RouteMatrix {
    private Map<String, Map<String, Long>> matrix = new HashMap<>();

    /**
     * 소요 시간을 설정합니다.
     *
     * @param from     출발지 (경도, 위도 문자열)
     * @param to       도착지 (경도, 위도 문자열)
     * @param duration 소요 시간 (밀리초 단위)
     */
    public void setDuration(String from, String to, Long duration) {
        matrix.computeIfAbsent(from, k -> new HashMap<>()).put(to, duration);
    }

    /**
     * 두 지점 간의 소요 시간을 가져옵니다.
     *
     * @param from 출발지 (경도, 위도 문자열)
     * @param to   도착지 (경도, 위도 문자열)
     * @return 소요 시간 (밀리초 단위). 존재하지 않으면 Long.MAX_VALUE 반환.
     */
    public Long getDuration(String from, String to) {
        return matrix.getOrDefault(from, new HashMap<>()).getOrDefault(to, Long.MAX_VALUE);
    }

    /**
     * 전체 매트릭스를 반환합니다.
     *
     * @return 매트릭스 데이터
     */
    public Map<String, Map<String, Long>> getMatrix() {
        return matrix;
    }
}

