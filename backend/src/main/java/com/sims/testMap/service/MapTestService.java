package com.sims.testMap.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.sims.testMap.vo.Coordinates;
import com.sims.testMap.vo.RouteResponse;
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

import java.io.IOException;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Map;
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

    // 생성자에서 인터셉터 및 타임아웃 설정 추가
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

    // 주소를 좌표로 변환 (지오코딩)
    public Coordinates geocodeAddress(String address) {
        try {
            // UriComponentsBuilder에 원본 주소 전달 (자동 인코딩)
            UriComponentsBuilder builder = UriComponentsBuilder
                    .fromHttpUrl("https://naveropenapi.apigw.ntruss.com/map-geocode/v2/geocode")
                    .queryParam("query", address);
            String url = builder.toUriString();

            log.info("Geocoding URL: {}", url);
            log.info("API Key ID: {}", apiKeyId);
            log.info("API Key: {}", "********"); // API 키 마스킹

            // 헤더 설정
            HttpHeaders headers = new HttpHeaders();
            headers.set("X-NCP-APIGW-API-KEY-ID", apiKeyId);
            headers.set("X-NCP-APIGW-API-KEY", apiKey);
            headers.setAccept(Collections.singletonList(MediaType.APPLICATION_JSON));

            // 요청 엔티티 생성 (헤더만 포함)
            HttpEntity<String> entity = new HttpEntity<>(headers);

            // GET 요청 보내기
            ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, entity, String.class);

            log.info("Geocoding API response status: {}", response.getStatusCode());
            log.info("Geocoding API response body: {}", response.getBody());

            if(response.getStatusCode() == HttpStatus.OK){
                Map<String, Object> result = objectMapper.readValue(response.getBody(), Map.class);
                List<Map<String, Object>> addresses = (List<Map<String, Object>>) result.get("addresses");
                if(addresses != null && !addresses.isEmpty()){
                    Map<String, Object> firstAddress = addresses.get(0);
                    double x = Double.parseDouble(firstAddress.get("x").toString());
                    double y = Double.parseDouble(firstAddress.get("y").toString());
                    log.info("Geocoding Result: x={}, y={}", x, y);
                    return new Coordinates(x, y);
                } else {
                    log.warn("No addresses found for the query: {}", address);
                }
            }
        } catch(HttpClientErrorException e){
            log.error("HTTP Client Error: {}", e.getResponseBodyAsString());
        } catch(Exception e){
            log.error("Error in geocodeAddress: ", e);
        }
        return null;
    }

    // 최단 경로 계산
    public RouteResponse getDrivingRoute(Coordinates start, Coordinates end, List<Coordinates> viaPoints){
        // URL과 쿼리 파라미터 구성
        UriComponentsBuilder builder = UriComponentsBuilder
                .fromHttpUrl("https://naveropenapi.apigw.ntruss.com/map-direction-15/v1/driving")
                .queryParam("start", start.getX() + "," + start.getY())
                .queryParam("goal", end.getX() + "," + end.getY())
                .queryParam("option", "trafast"); // 탐색 옵션 설정

        if(viaPoints != null && !viaPoints.isEmpty()){
            String waypoints = viaPoints.stream()
                    .map(point -> point.getX() + "," + point.getY())
                    .collect(Collectors.joining("|"));
            builder.queryParam("waypoints", waypoints); // 경유지 설정
        }

        String url = builder.toUriString();

        log.info("Driving API URL: {}", url);
        log.info("API Key ID: {}", apiKeyId);
        log.info("API Key: {}", "********"); // API 키 마스킹

        // 헤더 설정
        HttpHeaders headers = new HttpHeaders();
        headers.set("X-NCP-APIGW-API-KEY-ID", apiKeyId);
        headers.set("X-NCP-APIGW-API-KEY", apiKey);
        headers.setAccept(Collections.singletonList(MediaType.APPLICATION_JSON));

        // 요청 엔티티 생성 (헤더만 포함)
        HttpEntity<String> entity = new HttpEntity<>(headers);

        try {
            // GET 요청
            ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, entity, String.class);

            log.info("Driving API response status: {}", response.getStatusCode());
            log.info("Driving API response body: {}", response.getBody());

            if(response.getStatusCode() == HttpStatus.OK){
                RouteResponse routeResponse = objectMapper.readValue(response.getBody(), RouteResponse.class);
                return routeResponse;
            } else {
                log.warn("Driving API 호출 실패: {}", response.getBody());
            }
        } catch(HttpClientErrorException e){
            log.error("Driving API 오류: {}", e.getResponseBodyAsString());
        } catch(Exception e){
            log.error("Driving API 호출 중 예외 발생: ", e);
        }
        return null;
    }

    /**
     * 테스트용 메서드: 고정된 좌표를 사용하여 최단 경로 계산
     */
    public RouteResponse testDrivingRoute(){
        // 예시 좌표 3개 (임의의 값)
        Coordinates start = new Coordinates(127.0464837, 37.5840213); // 약령시로 147 미주아파트
        Coordinates end = new Coordinates(127.0000000, 37.5000000); // 임의의 목적지
        List<Coordinates> viaPoints = Arrays.asList(
                new Coordinates(127.0100000, 37.5200000),
                new Coordinates(127.0200000, 37.5300000)
        );

        return getDrivingRoute(start, end, viaPoints);
    }
}
