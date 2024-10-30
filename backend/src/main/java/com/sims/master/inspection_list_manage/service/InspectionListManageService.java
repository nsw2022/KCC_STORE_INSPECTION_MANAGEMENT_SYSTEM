package com.sims.master.inspection_list_manage.service;

import com.sims.master.inspection_list_manage.vo.InspectionPageResponse;

public interface InspectionListManageService {
    public InspectionPageResponse selectChklstNmByChklstId(String chklstId);
}
