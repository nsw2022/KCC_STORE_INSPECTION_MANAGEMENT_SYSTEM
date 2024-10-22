package com.sims.master.checklist_manage.mapper;

import com.sims.master.checklist_manage.vo.ChecklistResponse;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface ChecklistMapper {
    public List<ChecklistResponse> selectChecklistAll();

    public int deleteChecklistByChklstId(int chklstId);

}
