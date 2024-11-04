package com.sims.home.dashboard.service;


import com.sims.home.dashboard.mapper.DashboardMapper;
import com.sims.home.dashboard.vo.InspSchdAndResultResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class DashboardServiceImpl implements DashboardService{

    private final DashboardMapper dashboardMapper;
    @Override
    public InspSchdAndResultResponse selectInspSchdAndResult() {
        return dashboardMapper.selectInspSchdAndResult();
    }
}
