package com.sims.master.inspection_list_manage.mapper;

import com.sims.master.inspection_list_manage.vo.InspectionPageResponse;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface InspectionListManageMapper {

    public InspectionPageResponse selectChklstNmByChklstId(String chklstId);
}
