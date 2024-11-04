package com.sims.master.store_manage.vo;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@Builder
public class StoreOptionsResponse {
    private List<String> brandNmList;
    private List<String> storeNmList;
    private List<InspectorNmsResponse> inspectorNmList;
    private List<SvNmsResponse> svNmList;
}
