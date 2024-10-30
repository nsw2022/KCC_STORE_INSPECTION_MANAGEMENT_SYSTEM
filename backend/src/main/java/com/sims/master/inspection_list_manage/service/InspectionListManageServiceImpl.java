package com.sims.master.inspection_list_manage.service;

import com.sims.master.inspection_list_manage.mapper.InspectionListManageMapper;
import com.sims.master.inspection_list_manage.vo.InspectionPageResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class InspectionListManageServiceImpl implements InspectionListManageService{

    private final InspectionListManageMapper inspectionListManageMapper;
    @Override
    public InspectionPageResponse selectChklstNmByChklstId(String chklstId) {

        return inspectionListManageMapper.selectChklstNmByChklstId(chklstId);
    }
}
