package com.sims.master.checklist_manage.service;

import com.sims.master.checklist_manage.vo.ChecklistResponse;

import java.util.List;

public interface ChecklistService {

    public List<ChecklistResponse> selectChecklistAll();

    public int deleteChecklistByChklstId(int chklstId);
}
