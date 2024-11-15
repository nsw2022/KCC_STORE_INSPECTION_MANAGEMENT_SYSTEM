package com.sims.testMap.vo;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

import java.util.List;

/**
 * **Coordinates 클래스**
 * 좌표 정보를 담는 클래스입니다. [경도, 위도] 형태의 JSON 배열을 객체로 매핑
 */
@Data
public class Coordinates {
    private double x; // 경도 (Longitude)
    private double y; // 위도 (Latitude)

    public Coordinates() {}

    /**
     * **JSON 배열을 받아서 x와 y를 설정하는 생성자
     * @param location [경도, 위도] 형태의 리스트
     */
    @JsonCreator // JSON 데이터를 객체로 변환할 때 사용하는 생성자임을 지정
    public Coordinates(List<Double> location){
        if(location != null && location.size() == 2){
            this.x = location.get(0); // 첫 번째 요소를 x로 설정
            this.y = location.get(1); // 두 번째 요소를 y로 설정
        }
    }

    /**
     * **수동 객체 생성을 위한 생성자**
     * @param x 경도 (Longitude)
     * @param y 위도 (Latitude)
     */
    public Coordinates(double x, double y){
        this.x = x;
        this.y = y;
    }
}