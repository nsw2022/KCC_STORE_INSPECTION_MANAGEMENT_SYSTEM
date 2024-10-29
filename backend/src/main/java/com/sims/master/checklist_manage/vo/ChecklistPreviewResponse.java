package com.sims.master.checklist_manage.vo;

import lombok.*;

import java.util.List;
import java.util.Map;

@Data
public class ChecklistPreviewResponse {
    private Map<String, Map<String, Map<String, List<String>>>> data;
}
