package com.sims.home.dashboard.mapper;

import com.sims.home.dashboard.vo.InspSchdAndResultResponse;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface DashboardMapper {
    /**
     * 총 점검 갯수 / 완료 점검 갯수 조회
     */
    public InspSchdAndResultResponse selectInspSchdAndResult();
}
