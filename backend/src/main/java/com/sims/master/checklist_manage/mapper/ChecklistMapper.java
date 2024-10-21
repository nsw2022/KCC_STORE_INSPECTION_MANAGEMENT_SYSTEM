package com.sims.master.checklist_manage.mapper;

import com.sims.master.checklist_manage.vo.ChecklistVo;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface ChecklistMapper {
    public List<ChecklistVo> getChecklistAll();
}
