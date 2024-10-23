package com.sims.master.checklist_manage.vo;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@Builder
public class ChecklistOptionsResponse {
    private List<String> brandOptions;
    private List<String> inspTypeOptions;
    private List<String> checklistOptions;
}
