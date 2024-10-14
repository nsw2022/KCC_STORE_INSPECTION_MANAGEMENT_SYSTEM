package com.sims.testMap.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.sims.testMap.vo.Coordinates;
import com.sims.testMap.vo.RouteMatrix;
import com.sims.testMap.vo.RouteResponse;
import com.sims.testMap.vo.TSPSolver;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.http.client.ClientHttpRequestExecution;
import org.springframework.http.client.ClientHttpRequestInterceptor;
import org.springframework.http.client.ClientHttpResponse;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.*;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ExecutionException;
import java.util.stream.Collectors;

@Service
@Slf4j
public class MapTestService {

    @Value("${naver.maps.client.id}")
    private String apiKeyId;

    @Value("${naver.maps.client.key}")
    private String apiKey;

    private RestTemplate restTemplate;
    private ObjectMapper objectMapper = new ObjectMapper();
    private Map<String, Long> durationCache = new ConcurrentHashMap<>(); // 스레드 안전한 캐시
    private Map<String, Coordinates> geocodeCache = new ConcurrentHashMap<>();

    public MapTestService() {
        this.restTemplate = new RestTemplate();
        // 타임아웃 설정
        SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();
        factory.setConnectTimeout(5000); // 5초
        factory.setReadTimeout(5000);    // 5초
        this.restTemplate.setRequestFactory(factory);

        // 인터셉터 추가
        restTemplate.getInterceptors().add(new ClientHttpRequestInterceptor() {
            @Override
            public ClientHttpResponse intercept(HttpRequest request, byte[] body, ClientHttpRequestExecution execution) throws IOException {
                log.info("Request URI: {}", request.getURI());
                log.info("Request Method: {}", request.getMethod());
                log.info("Request Headers: {}", request.getHeaders());
                return execution.execute(request, body);
            }
        });
    }

    /**
     * 주소를 좌표로 변환하는 메서드
     *
     * @param address 변환할 주소
     * @return Coordinates 객체 또는 null
     */
    public Coordinates geocodeAddress(String address) {
        if (address == null || address.trim().isEmpty()) {
            log.warn("빈 주소가 전달되었습니다.");
            return null;
        }

        // 캐시 확인
        if (geocodeCache.containsKey(address)) {
            return geocodeCache.get(address);
        }

        // 네이버 지오코딩 API 호출
        UriComponentsBuilder builder = UriComponentsBuilder
                .fromHttpUrl("https://naveropenapi.apigw.ntruss.com/map-geocode/v2/geocode")
                .queryParam("query", address);

        String url = builder.toUriString();
        log.info("Geocode API URL: {}", url);

        // 요청 헤더 설정
        HttpHeaders headers = new HttpHeaders();
        headers.set("X-NCP-APIGW-API-KEY-ID", apiKeyId);
        headers.set("X-NCP-APIGW-API-KEY", apiKey);
        headers.setAccept(Collections.singletonList(MediaType.APPLICATION_JSON));

        // HTTP 요청 엔티티 생성 (헤더만 포함)
        HttpEntity<String> entity = new HttpEntity<>(headers);

        try {
            // REST 템플릿을 사용하여 GET 요청 실행
            ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, entity, String.class);

            // 응답 로깅
            log.info("Geocode API response status: {}", response.getStatusCode());
            log.info("Geocode API response body: {}", response.getBody());

            // 성공적인 응답 처리
            if (response.getStatusCode() == HttpStatus.OK) {
                JsonNode root = objectMapper.readTree(response.getBody());
                int count = root.path("meta").path("count").asInt();
                if (count > 0) {
                    JsonNode firstResult = root.path("addresses").get(0);
                    double x = firstResult.path("x").asDouble();
                    double y = firstResult.path("y").asDouble();
                    Coordinates coordinates = new Coordinates(x, y);
                    geocodeCache.put(address, coordinates); // 캐시에 저장
                    return coordinates;
                } else {
                    log.warn("해당 주소에 대한 결과가 없습니다: {}", address);
                }
            } else {
                log.warn("Geocode API 호출 실패: {}", response.getBody());
            }
        } catch (HttpClientErrorException e) {
            log.error("Geocode API 클라이언트 오류: {}", e.getResponseBodyAsString());
        } catch (Exception e) {
            log.error("Geocode API 호출 중 예외 발생: ", e);
        }

        return null; // 오류 발생 시 null 반환
    }

    /**
     * 최적화된 경로 검색 메서드
     *
     * @param start     시작 좌표
     * @param goals     목적지 좌표 리스트
     * @param viaPoints 경유지 좌표 리스트
     * @return RouteResponse 객체 또는 null
     */
    public RouteResponse getOptimizedDrivingRoute(Coordinates start, List<Coordinates> goals, List<Coordinates> viaPoints) {
        // 목적지 문자열 리스트 생성
        List<String> destinationStrings = goals.stream()
                .map(coord -> coord.getX() + "," + coord.getY())
                .collect(Collectors.toList());

        // RouteMatrix 생성
        RouteMatrix matrix = new RouteMatrix();

        // 모든 목적지 간 소요 시간 계산 (비동기 처리 및 캐싱 활용)
        List<CompletableFuture<Void>> futures = new ArrayList<>();

        for (int i = 0; i < goals.size(); i++) {
            for (int j = 0; j < goals.size(); j++) {
                if (i != j) {
                    final int fromIndex = i;
                    final int toIndex = j;
                    String from = destinationStrings.get(fromIndex);
                    String to = destinationStrings.get(toIndex);

                    CompletableFuture<Void> future = CompletableFuture.runAsync(() -> {
                        long duration = getDurationBetweenPoints(goals.get(fromIndex), goals.get(toIndex));
                        if (duration != Long.MAX_VALUE) {
                            matrix.setDuration(from, to, duration);
                        }
                    });

                    futures.add(future);
                }
            }
        }

        // 모든 비동기 작업이 완료될 때까지 대기
        try {
            CompletableFuture.allOf(futures.toArray(new CompletableFuture[0])).get();
        } catch (InterruptedException | ExecutionException e) {
            log.error("Error building route matrix: ", e);
            return null;
        }

        // TSP 솔버를 사용하여 최적의 순서 찾기
        TSPSolver solver = new TSPSolver(destinationStrings, matrix);
        List<String> optimalOrder = solver.solve();

        if (optimalOrder == null || optimalOrder.isEmpty()) {
            log.error("TSP 솔버가 최적의 경로를 찾지 못했습니다.");
            return null;
        }

        log.info("@@@@@@@@@@@@@@@@@@@@@@@@@@@");
        log.info("TSP 최적 순서: {}", String.join(" -> ", optimalOrder));

        // 최적 순서에 따라 goal과 waypoints 설정
        String goal = optimalOrder.get(optimalOrder.size() - 1);
        List<String> waypoints = optimalOrder.subList(0, optimalOrder.size() - 1);
//        // 최적 순서에 따른 총 거리와 시간 계산
//        long totalDistance = 0;
//        long totalDuration = 0;
//
//        for (int i = 0; i < optimalOrder.size() - 1; i++) {
//            String from = optimalOrder.get(i);
//            String to = optimalOrder.get(i + 1);
//            long duration = matrix.getDuration(from, to);
//            if (duration == Long.MAX_VALUE) {
//                log.warn("소요 시간을 가져올 수 없는 구간: {} -> {}", from, to);
//                continue;
//            }
//            totalDuration += duration;
//            // 거리 정보가 RouteMatrix에 포함되어 있지 않다면 별도로 계산 필요
//            // 예시로 duration과 거리를 동일하게 처리 (실제 거리 정보가 필요함)
//            totalDistance += duration; // 실제 거리 정보를 사용해야 합니다.
//        }

        //log.info("최적 순서 총 거리: {} m, 총 소요 시간: {} 분", totalDistance, totalDuration / 60000);

        // 네이버 지도 API에 경로 요청
        UriComponentsBuilder builder = UriComponentsBuilder
                .fromHttpUrl("https://naveropenapi.apigw.ntruss.com/map-direction-15/v1/driving")
                .queryParam("start", start.getX() + "," + start.getY())
                .queryParam("goal", goal)
                .queryParam("option", "trafast:traoptimal"); // 예시로 traoptimal 사용

        if (!waypoints.isEmpty()) {
            String waypointsParam = String.join("|", waypoints);
            builder.queryParam("waypoints", waypointsParam);
            log.info("Optimized waypointsParam: {}", waypointsParam);
        }

        // 경유지가 있는 경우 추가
        if (viaPoints != null && !viaPoints.isEmpty()) {
            String additionalWaypoints = viaPoints.stream()
                    .map(point -> point.getX() + "," + point.getY())
                    .collect(Collectors.joining("|"));
            builder.queryParam("waypoints", additionalWaypoints);
            log.info("Additional waypoints: {}", additionalWaypoints);
        }

        String url = builder.toUriString();
        log.info("Optimized Driving API URL: {}", url);
        log.info("API Key ID: {}", apiKeyId);
        log.info("API Key: {}", "********"); // API 키 마스킹

        // 요청 헤더 설정
        HttpHeaders headers = new HttpHeaders();
        headers.set("X-NCP-APIGW-API-KEY-ID", apiKeyId);
        headers.set("X-NCP-APIGW-API-KEY", apiKey);
        headers.setAccept(Collections.singletonList(MediaType.APPLICATION_JSON));

        // HTTP 요청 엔티티 생성 (헤더만 포함)
        HttpEntity<String> entity = new HttpEntity<>(headers);

        try {
            // REST 템플릿을 사용하여 GET 요청 실행
            ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, entity, String.class);

            // 응답 로깅
            log.info("Driving API response status: {}", response.getStatusCode());
            log.info("Driving API response body: {}", response.getBody());

            // 성공적인 응답 처리
            if (response.getStatusCode() == HttpStatus.OK) {
                // 응답 바디를 RouteResponse 객체로 변환
                RouteResponse routeResponse = objectMapper.readValue(response.getBody(), RouteResponse.class);
                return routeResponse;
            } else {
                // API 호출 실패 로깅
                log.warn("Driving API 호출 실패: {}", response.getBody());
            }
        } catch (HttpClientErrorException e) {
            // HTTP 클라이언트 에러 처리
            log.error("Driving API 오류: {}", e.getResponseBodyAsString());
        } catch (Exception e) {
            // 기타 예외 처리
            log.error("Driving API 호출 중 예외 발생: ", e);
        }
        return null; // 오류 발생 시 null 반환
    }

    /**
     * 두 지점 간 소요 시간 가져오기 메서드 (실제 API 호출 및 캐싱 적용)
     *
     * @param from 출발 좌표
     * @param to   도착 좌표
     * @return 소요 시간 (밀리초 단위). 실패 시 Long.MAX_VALUE 반환
     */
    private long getDurationBetweenPoints(Coordinates from, Coordinates to) {
        // 캐시 키 생성
        String key = from.getX() + "," + from.getY() + "->" + to.getX() + "," + to.getY();
        if (durationCache.containsKey(key)) {
            return durationCache.get(key);
        }

        // 네이버 지도 API를 사용하여 소요 시간 가져오기
        UriComponentsBuilder builder = UriComponentsBuilder
                .fromHttpUrl("https://naveropenapi.apigw.ntruss.com/map-direction-15/v1/driving")
                .queryParam("start", from.getX() + "," + from.getY())
                .queryParam("goal", to.getX() + "," + to.getY())
                .queryParam("option", "traoptimal"); // 소요 시간 최적 경로 요청

        String url = builder.toUriString();
        log.info("Duration API URL: {}", url);

        HttpHeaders headers = new HttpHeaders();
        headers.set("X-NCP-APIGW-API-KEY-ID", apiKeyId);
        headers.set("X-NCP-APIGW-API-KEY", apiKey);
        headers.setAccept(Collections.singletonList(MediaType.APPLICATION_JSON));

        HttpEntity<String> entity = new HttpEntity<>(headers);

        try {
            ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, entity, String.class);
            log.info("Duration API response status: {}", response.getStatusCode());

            if (response.getStatusCode() == HttpStatus.OK) {
                RouteResponse routeResponse = objectMapper.readValue(response.getBody(), RouteResponse.class);
                if (routeResponse.getCode() == 0 && routeResponse.getRoute() != null) {
                    List<RouteResponse.TraoptimalRoute> traoptimalRoutes = routeResponse.getRoute().getTraoptimal();
                    if (traoptimalRoutes != null && !traoptimalRoutes.isEmpty()) {
                        long duration = traoptimalRoutes.get(0).getSummary().getDuration();
                        durationCache.put(key, duration);
                        return duration;
                    } else {
                        log.warn("traoptimal 경로가 없습니다: from={}, to={}", from, to);
                    }
                } else {
                    log.warn("API 응답 코드가 0이 아니거나 route가 null입니다: code={}, message={}", routeResponse.getCode(), routeResponse.getMessage());
                }
            } else {
                log.warn("Duration API 호출 실패: status={}, body={}", response.getStatusCode(), response.getBody());
            }
        } catch (HttpClientErrorException e) {
            log.error("Duration API 오류: {}", e.getResponseBodyAsString());
        } catch (Exception e) {
            log.error("Duration API 호출 중 예외 발생: ", e);
        }
        return Long.MAX_VALUE; // 오류 발생 시 최대 값 반환
    }

    /**
     * 테스트용 메서드: 고정된 좌표로 최적화된 경로 계산
     *
     * @return RouteResponse 객체 또는 null
     */
    public RouteResponse testDrivingRoute() {
        Coordinates start = new Coordinates(127.0464837, 37.5840213); // 예시 시작 좌표
        List<Coordinates> goals = Arrays.asList(
                new Coordinates(127.0792776, 37.6025393),
                new Coordinates(127.0275579, 37.4980678),
//                new Coordinates(126.9134889, 37.5492583),

                new Coordinates(127.0598799, 37.655456)


        );
        return getOptimizedDrivingRoute(start, goals, null);
    }

    /**
     * 테스트용 메서드: 최적화된 경로 호출 및 로그 출력
     */
    public void executeTestDrivingRoute() {
        RouteResponse response = testDrivingRoute();

        if (response != null) {
            log.info("TestDrivingRoute Response: {}", response);
            if (response.getCode() == 0) {
                log.info("길찾기 성공: {}", response.getMessage());
                if (response.getRoute() != null) {
                    if (response.getRoute().getTraoptimal() != null && !response.getRoute().getTraoptimal().isEmpty()) {
                        log.info("traoptimal 경로가 정상적으로 반환되었습니다.");
                        // traoptimal 경로 활용 로직 추가
                    } else {
                        log.error("traoptimal 경로가 비어있습니다.");
                    }
                } else {
                    log.error("route 객체가 null입니다.");
                }
            } else {
                log.error("길찾기 실패: {}", response.getMessage());
            }
        } else {
            log.error("응답이 null입니다.");
        }
    }


    /**
     * **역지오코딩 메서드**
     * 좌표를 받아 주소를 반환합니다.
     *
     * @param coordinates 좌표 정보
     * @return 주소 문자열 또는 null
     */
    public String reverseGeocode(Coordinates coordinates) {
        String apiUrl = "https://naveropenapi.apigw.ntruss.com/map-reversegeocode/v2/gc?coords="
                + coordinates.getX() + "," + coordinates.getY()
                + "&output=json&orders=legalcode";

        try {
            URL url = new URL(apiUrl);
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("GET");
            conn.setRequestProperty("X-NCP-APIGW-API-KEY-ID", apiKeyId);
            conn.setRequestProperty("X-NCP-APIGW-API-KEY", apiKey);

            int responseCode = conn.getResponseCode();
            if (responseCode == 200) { // 정상 호출
                BufferedReader in = new BufferedReader(new InputStreamReader(conn.getInputStream()));
                String inputLine;
                StringBuilder response = new StringBuilder();

                while ((inputLine = in.readLine()) != null) {
                    response.append(inputLine);
                }
                in.close();


                JsonObject jsonObject = JsonParser.parseString(response.toString()).getAsJsonObject();
                JsonArray results = jsonObject.getAsJsonArray("results");
                if (results.size() > 0) {
                    JsonObject firstResult = results.get(0).getAsJsonObject();
                    JsonObject region = firstResult.getAsJsonObject("region");
                    String area1 = region.get("area1").getAsJsonObject().get("name").getAsString();
                    String area2 = region.get("area2").getAsJsonObject().get("name").getAsString();
                    String area3 = region.get("area3").getAsJsonObject().get("name").getAsString();

                    return area1 + " " + area2 + " " + area3;
                }
            } else {
                log.error("역지오코딩 API 호출 실패: HTTP 코드 " + responseCode);
            }
        } catch (Exception e) {
            log.error("역지오코딩 중 예외 발생: ", e);
        }

        return null; // 실패 시 null 반환
    }
}
