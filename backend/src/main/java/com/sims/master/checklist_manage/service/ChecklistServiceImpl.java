package com.sims.master.checklist_manage.service;

import com.sims.master.checklist_manage.mapper.ChecklistMapper;
import com.sims.master.checklist_manage.vo.ChecklistResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class ChecklistServiceImpl implements ChecklistService{

    private final ChecklistMapper checklistMapper;


    @Override
    public List<ChecklistResponse> selectChecklistAll() {
        return checklistMapper.selectChecklistAll();
    }
<<<<<<< Updated upstream
=======

    @Override
    public int deleteChecklistByChklstId(int chklstId) {
        return checklistMapper.deleteChecklistByChklstId(chklstId);
    }

>>>>>>> Stashed changes
}
