package com.sims.testMap.vo;

import java.util.ArrayList;
import java.util.List;

/**
 * **TSPSolver 클래스**
 * Traveling Salesman Problem을 해결하여 최적의 방문 순서를 찾는 클래스입니다.
 */
public class TSPSolver {
    private List<String> destinations;
    private RouteMatrix matrix;
    private List<String> bestRoute;
    private long minDuration = Long.MAX_VALUE;

    /**
     * 생성자
     *
     * @param destinations 목적지 리스트 (경도, 위도 문자열)
     * @param matrix       소요 시간 매트릭스
     */
    public TSPSolver(List<String> destinations, RouteMatrix matrix) {
        this.destinations = destinations;
        this.matrix = matrix;
    }

    /**
     * TSP 문제를 해결하여 최적의 경로를 반환합니다.
     *
     * @return 최적의 방문 순서 리스트
     */
    public List<String> solve() {
        List<String> currentRoute = new ArrayList<>();
        boolean[] visited = new boolean[destinations.size()];
        backtrack(currentRoute, visited, 0);
        return bestRoute;
    }

    /**
     * 백트래킹을 통해 모든 가능한 경로를 탐색하여 최적의 경로를 찾습니다.
     *
     * @param currentRoute   현재까지의 경로
     * @param visited        방문 여부 배열
     * @param currentDuration 현재까지의 소요 시간
     */
    private void backtrack(List<String> currentRoute, boolean[] visited, long currentDuration) {
        if (currentRoute.size() == destinations.size()) {
            if (currentDuration < minDuration) {
                minDuration = currentDuration;
                bestRoute = new ArrayList<>(currentRoute);
            }
            return;
        }

        for (int i = 0; i < destinations.size(); i++) {
            if (!visited[i]) {
                String next = destinations.get(i);
                long duration = 0;
                if (!currentRoute.isEmpty()) {
                    String last = currentRoute.get(currentRoute.size() - 1);
                    duration = matrix.getDuration(last, next);
                }
                if (currentDuration + duration < minDuration) {
                    visited[i] = true;
                    currentRoute.add(next);
                    backtrack(currentRoute, visited, currentDuration + duration);
                    currentRoute.remove(currentRoute.size() - 1);
                    visited[i] = false;
                }
            }
        }
    }
}
