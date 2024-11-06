package com.sims.qsc.inspection_result.vo;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InspectionResultOptionResponse {
    public List<String> brandNms;
    public List<String> storeNms;
    public List<String> chklstNms;
    public List<String> inspTypeNms;
    public List<InspectorNmsResponse> inspectorNms;
}
