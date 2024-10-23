package com.sims.master.checklist_manage.service;

import com.sims.config.Exception.CustomException;
import com.sims.config.Exception.ErrorCode;
import com.sims.master.checklist_manage.mapper.ChecklistMapper;
import com.sims.master.checklist_manage.vo.ChecklistDeleteRequest;
import com.sims.master.checklist_manage.vo.ChecklistOptionsResponse;
import com.sims.master.checklist_manage.vo.ChecklistResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * @Author 유재원
 * @Classname ChecklistServiceImpl
 * @Date 2024.10.23
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
        /**
         * @Todo role체크 aop 구현 후 삭제 예정
         */
        GrantedAuthority role = (GrantedAuthority) SecurityContextHolder.getContext().getAuthentication().getAuthorities().iterator().next();
        String roleName = role.getAuthority();

        log.info("role : {}", roleName);
        log.info("사이즈 = {}", checklistMapper.selectChklstIdByChklstIdAndChklstUseW(checklistDeleteRequest).size());
        if (!"MR002".equals(roleName) && !"MR001".equals(roleName)) {
            throw new CustomException(ErrorCode.HANDLE_ACCESS_DENIED);
        } else if (checklistMapper.selectChklstIdByChklstIdAndChklstUseW(checklistDeleteRequest).size() > 0) {
            throw new CustomException(ErrorCode.CHECKLIST_IN_USE);
        }
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
