package com.sims.master.inspection_list_manage.service;

import com.sims.config.common.aop.PRoleCheck;
import com.sims.master.inspection_list_manage.mapper.InspectionListManageMapper;
import com.sims.master.inspection_list_manage.vo.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * @Description 점검 항목 관리 서비스 구현 클래스
 * @Author 유재원
 * @Date 2024.10.31
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class InspectionListManageServiceImpl implements InspectionListManageService{

    private final InspectionListManageMapper inspectionListManageMapper;
    @Override
    public InspectionPageResponse selectChklstNmByChklstId(String chklstId) {

        return inspectionListManageMapper.selectChklstNmByChklstId(chklstId);
    }

    @Override
    public List<CtgResponse> selectCtgByChklstId(String chklstId) {
        log.info("chklstId = {}", chklstId);

        return inspectionListManageMapper.selectCtgByChklstId(chklstId);
    }

    @Override
    public List<SubCtgResponse> selectSubCtgByChklstIdAndCtgNm(String chklstId, String CtgNm) {

        return inspectionListManageMapper.selectSubCtgByChklstIdAndCtgNm(chklstId, CtgNm);
    }

    @Override
    public List<EvitResponse> selectEvitByCtgNmAndCtgId(String ctgId, String ctgNm) {
        log.info("result = {}", inspectionListManageMapper.selectEvitByCtgNmAndCtgId(ctgId, ctgNm));
        return inspectionListManageMapper.selectEvitByCtgNmAndCtgId(ctgId, ctgNm);
    }

    @Override
    public List<ChclstResponse> selectEvitChclstByCtgIdAndEvitNm(String ctgId, String evitNm) {
        return inspectionListManageMapper.selectEvitChclstByCtgIdAndEvitNm(ctgId, evitNm);
    }

    @Override
    @PRoleCheck
    @Transactional(rollbackFor = Exception.class)
    public int insertOrUpdateCtg(List<CtgRequest> ctgRequest) {
        String auth  = SecurityContextHolder.getContext().getAuthentication().getName();
        log.info("auth = {}", auth);
        ctgRequest.forEach(ctg -> {
            ctg.setCreMbrId(auth);
            ctg.setCtgId(ctg.getCtgId().replace("n", ""));
        });

        return inspectionListManageMapper.insertOrUpdateCtg(ctgRequest);
    }

    @Override
    @PRoleCheck
    @Transactional(rollbackFor = Exception.class)
    public int deleteCtg(List<String> ctgId) {

        return inspectionListManageMapper.deleteCtg(ctgId);
    }
}
