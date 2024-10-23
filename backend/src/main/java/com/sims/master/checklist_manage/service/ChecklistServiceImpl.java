package com.sims.master.checklist_manage.service;

import com.sims.master.checklist_manage.mapper.ChecklistMapper;
import com.sims.master.checklist_manage.vo.ChecklistDeleteRequest;
import com.sims.master.checklist_manage.vo.ChecklistOptionsResponse;
import com.sims.master.checklist_manage.vo.ChecklistResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
/**
 *
 * @Classname ChecklistServiceImpl
 * @Description 체크리스트 관리 서비스 구현 클래스
 * @Author 유재원
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class ChecklistServiceImpl implements ChecklistService{

    private final ChecklistMapper checklistMapper;

    @Override
    public List<ChecklistResponse> selectChecklistAll() {
        return checklistMapper.selectChecklistAll();
    }

    @Override
    public int deleteChecklistByChklstId(List<ChecklistDeleteRequest> checklistDeleteRequest) {
        
        return checklistMapper.deleteChecklistByChklstId(checklistDeleteRequest);
    }

    @Override
    public ChecklistOptionsResponse selectChecklistOptions() {
        List<String> brandOptions = checklistMapper.selectBrandOptions();
        List<String> inspTypeOptions = checklistMapper.selectInspTypeOptions();
        List<String> checklistOptions = checklistMapper.selectChecklistOptions();

        return ChecklistOptionsResponse.builder()
                .brandOptions(brandOptions)
                .inspTypeOptions(inspTypeOptions)
                .checklistOptions(checklistOptions)
                .build();
    }
}
