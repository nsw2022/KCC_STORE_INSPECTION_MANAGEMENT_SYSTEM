package com.sims.testMap.vo;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

import java.util.List;

@Data
@JsonFormat(shape = JsonFormat.Shape.ARRAY)
public class Coordinates {
    private double x;
    private double y;

    // JSON 배열을 받아서 x와 y를 설정하는 생성자
    @JsonCreator
    public Coordinates(List<Double> location){
        if(location != null && location.size() == 2){
            this.x = location.get(0);
            this.y = location.get(1);
        }
    }

    // 수동 객체 생성을 위한 생성자
    public Coordinates(double x, double y){
        this.x = x;
        this.y = y;
    }
}
