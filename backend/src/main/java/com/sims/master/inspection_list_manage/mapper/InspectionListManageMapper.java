package com.sims.master.inspection_list_manage.mapper;

import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface InspectionListManageMapper {

    public String selectChklstNmByChklstId(String chklstId);
}
