package com.sims.master.store_manage.vo;

import lombok.*;

import java.util.List;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class StoreOptionsResponse {
    private List<String> brandNmList;
    private List<String> storeNmList;
    private List<InspectorNmsResponse> inspectorNmList;
    private List<SvNmsResponse> svNmList;
}
