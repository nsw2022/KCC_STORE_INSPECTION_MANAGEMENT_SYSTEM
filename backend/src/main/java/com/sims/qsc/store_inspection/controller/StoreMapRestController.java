package com.sims.qsc.store_inspection.controller;

import com.sims.qsc.store_inspection.service.StoreInspectionService;
import com.sims.qsc.store_inspection.vo.StoreAllLocationResponse;
import com.sims.qsc.store_inspection.vo.StoreLocationResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/qsc/store-inspection/map")
@RequiredArgsConstructor
public class StoreMapRestController {

    private final StoreInspectionService storeInspectionService;

    /**
     * @param mbrNo 로그인한 점검자의 고유번호(ID)
     * @return 로그인한 점검자의 매장목록
     */
    @GetMapping("/{mbrNo}")
    public List<StoreLocationResponse> getMap(@PathVariable("mbrNo") String mbrNo) {
        return storeInspectionService.selectInspectionsByInspector(mbrNo);
    }

    @GetMapping("/all-store")
    public ResponseEntity<List<StoreAllLocationResponse>> selectAllInspectionMap() {
        List<StoreAllLocationResponse> stores = storeInspectionService.selectAllInspectionMap();
        return ResponseEntity.ok(stores);
    }

}
