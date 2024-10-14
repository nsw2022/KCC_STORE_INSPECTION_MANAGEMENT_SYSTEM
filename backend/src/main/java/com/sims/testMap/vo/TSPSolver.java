package com.sims.testMap.vo;

import lombok.extern.slf4j.Slf4j;

import java.util.ArrayList;
import java.util.List;

/**
 * **TSPSolver 클래스**
 * Traveling Salesman Problem (TSP)을 해결하여 최적의 방문 순서를 찾는 클래스입니다.
 * 이 클래스는 목적지 사이의 최소 소요 시간 경로를 찾아 순회하는 데 필요합니다.
 *
 * @desc
 *
 */
@Slf4j
public class TSPSolver {
    private List<String> destinations;  // 목적지 목록을 저장합니다.
    private RouteMatrix matrix;  // 각 목적지 사이의 이동 시간을 저장하는 변수입니다.
    private List<String> bestRoute;  // 발견된 최적의 경로를 저장합니다.
    private long minDuration = Long.MAX_VALUE;  // 가장 짧은 경로의 소요 시간을 저장합니다.

    /**
     * TSPSolver 클래스의 생성자
     *
     * @param destinations 목적지 리스트 (경도, 위도 문자열)
     * @param matrix       각 목적지 사이의 이동 시간을 저장하는 RouteMatrix 객체
     */
    public TSPSolver(List<String> destinations, RouteMatrix matrix) {
        this.destinations = destinations;
        this.matrix = matrix;
    }

    /**
     * TSP 문제를 해결하고 최적의 경로를 반환하는 메소드입니다.
     * 이 메소드는 backtrack 메소드를 사용하여 모든 가능한 경로를 탐색합니다.
     * currentRoute: 현재까지 탐색한 경로를 저장하는 리스트.
     * visited: 각 목적지의 방문 여부를 추적하는 배열.
     * minDuration: 현재까지 발견된 가장 짧은 총 소요 시간을 저장하는 변수.
     *
     * @return 최적의 방문 순서가 저장된 리스트
     */
    public List<String> solve() {
        List<String> currentRoute = new ArrayList<>();
        boolean[] visited = new boolean[destinations.size()];
        backtrack(currentRoute, visited, 0);
        log.info("최적의 경로: {}, 소요 시간: {} 분", bestRoute, minDuration);
        return bestRoute;  // 최적의 경로를 반환합니다.
    }

    /**
     * 백트래킹을 통해 모든 가능한 경로를 탐색하여 최적의 경로를 찾는 메소드입니다.
     * 재귀적으로 각 단계에서 가능한 모든 경로를 탐색하며, 더 짧은 경로를 찾으면 업데이트합니다.
     *
     * @param currentRoute    현재까지의 경로
     * @param visited         각 목적지의 방문 여부를 나타내는 배열
     * @param currentDuration 현재까지의 총 소요 시간
     */
    private void backtrack(List<String> currentRoute, boolean[] visited, long currentDuration) {
        // 모든 목적지를 방문한 경우, 현재 경로가 최소인지 확인하고 업데이트합니다.
        if (currentRoute.size() == destinations.size()) {
            if (currentDuration < minDuration) {
                minDuration = currentDuration;  // 최소 소요 시간을 업데이트합니다.
                bestRoute = new ArrayList<>(currentRoute);  // 최적의 경로를 업데이트합니다.
                log.info("새로운 최적 경로 발견: {}, 소요 시간: {} 분", bestRoute, minDuration);
            }
            return;
        }

        // 모든 목적지를 순회하며 방문하지 않은 곳을 찾아 다음 경로로 설정합니다.
        for (int i = 0; i < destinations.size(); i++) {
            if (!visited[i]) {
                String next = destinations.get(i);  // 다음 방문할 목적지
                long duration = 0;
                if (!currentRoute.isEmpty()) {
                    String last = currentRoute.get(currentRoute.size() - 1);
                    duration = matrix.getDuration(last, next);  // 이전 목적지에서 다음 목적지까지의 소요 시간을 계산합니다.
                }
                // 현재 경로를 업데이트하고 재귀적으로 backtrack 메소드를 호출합니다.
                if (currentDuration + duration < minDuration) {
                    visited[i] = true;
                    currentRoute.add(next);
                    log.debug("현재 경로: {}, 총 소요 시간: {} 분", currentRoute, currentDuration + duration);
                    backtrack(currentRoute, visited, currentDuration + duration);
                    // 경로 탐색을 마친 후에는 상태를 원래대로 복원합니다 (백트래킹).
                    currentRoute.remove(currentRoute.size() - 1);
                    visited[i] = false;
                }
            }
        }
    }
}
