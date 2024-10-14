package com.sims.testMap.vo;

import lombok.Data;

import java.util.List;

@Data
public class RouteRequest {
    private Coordinates start;
    private String addressList; // ':' 로 구분도니 목적지 목록
    private List<Coordinates> viaPoints; // 경유지목록

}
