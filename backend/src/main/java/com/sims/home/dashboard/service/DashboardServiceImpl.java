package com.sims.home.dashboard.service;


import com.sims.home.dashboard.mapper.DashboardMapper;
import com.sims.home.dashboard.vo.BsnSspnResponse;
import com.sims.home.dashboard.vo.InspSchdAndResultResponse;
import com.sims.home.dashboard.vo.PenaltyResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DashboardServiceImpl implements DashboardService{

    private final DashboardMapper dashboardMapper;
    @Override
    public InspSchdAndResultResponse selectInspSchdAndResult() {
        return dashboardMapper.selectInspSchdAndResult();
    }

    @Override
    public List<PenaltyResponse> selectPenalty() {
        return dashboardMapper.selectPenalty();
    }

    @Override
    public List<BsnSspnResponse> selectBsnSspn() {
        return dashboardMapper.selectBsnSspn();
    }
}
