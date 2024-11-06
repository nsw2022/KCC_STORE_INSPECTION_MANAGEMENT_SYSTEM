package com.sims.home.dashboard.service;

import com.sims.home.dashboard.vo.*;

import java.util.List;

public interface DashboardService {
    /**
     * 총 점검 갯수 / 완료 점검 갯수 조회
     * @return 총 점검 갯수, 완료 점검 갯수
     */
    public InspSchdAndResultResponse selectInspSchdAndResult();

    /**
     * 패널티 가맹점 / 금액 조회
     * @return 패널티 가맹점, 금액
     */
    public List<PenaltyResponse> selectPenalty();

    /**
     * 영업정지 가맹점 / 영업정지 일 조회
     * @return 영업정지 가맹점, 영업정지 일
     */
    public List<BsnSspnResponse> selectBsnSspn();

    /**
     * 미완료 점검 현황 조회
     * @return 미완료 점검 현황
     */
    public List<NotCompleteResponse> selectNotComplete();

    /**
     * 최근 점검 완료 현황 조회
     * @return 최근 점검 완료 현황
     */
    public List<RecentInspResultResponse> selectRecentInspResult(int pageNumber);
}
