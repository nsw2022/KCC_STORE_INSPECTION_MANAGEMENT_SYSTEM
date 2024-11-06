package com.sims.master.store_manage.controller;

import com.sims.master.store_manage.service.StoreService;
import com.sims.master.store_manage.vo.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.parameters.P;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * @Description 가맹점 관리 페이지
 * @Author 원승언
 * @Date 2024-11-03
 */
@Controller
@RequestMapping("/master")
@RequiredArgsConstructor
@Slf4j
public class StoreController{

    private final StoreService storeService;

    @Value("${naver.maps.client.id}")
    private String naverClientId;

    @GetMapping("/store/manage")
    public String storeManage(Model model){
        model.addAttribute("naverClientId", naverClientId);
        return "master/store_manage/store_list";
    }

    /**
     * 가맹점 조회(필터링 포함)
     * @param request
     * @return 검색 조건에 따라 StoreResponse LIST를 다르게 보여준다
     */
    @ResponseBody
    @PostMapping("/store/list")
    public ResponseEntity<List<StoreResponse>> selectAllStores(@RequestBody StoreRequest request) {
        List<StoreResponse> list = storeService.selectAllStores(request);
        if(list.isEmpty()){
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } else {
            return new ResponseEntity<>(list, HttpStatus.OK);
        }
    }

    /**
     * 검색 목록(가맹점명 브랜드명 점검자명)
     * @return 검색목록(가맹점명 브랜드명 점검자명)을 보여준다
     */
    @ResponseBody
    @GetMapping("/store/options")
    public ResponseEntity<StoreOptionsResponse> selectStoreOptions() {
        StoreOptionsResponse response = storeService.selectAllStoreOptions();
        if(response == null){
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } else {
            return new ResponseEntity<>(response, HttpStatus.OK);
        }
    }

//    @ResponseBody
//    @PostMapping("/store/options")
//    public ResponseEntity<StoreOptionsResponse> selectStoreOptions(@RequestBody StoreOptionsRequest storeOptionsRequest) {
//        StoreOptionsResponse response = storeService.selectAllStoreOptionsByFilter(storeOptionsRequest);
//        log.info("response ={}", response);
//        if(response==null){
//            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
//        } else {
//            return new ResponseEntity<>(response, HttpStatus.OK);
//        }
//    }


    @ResponseBody
    @PostMapping("/store/superVisors")
    public ResponseEntity<List<SvNmsResponse>> selectAllSuperVisors(@RequestBody InspectorInfoRequest inspectorInfoRequest) {
        List<SvNmsResponse> list = storeService.selectAllSvNms(inspectorInfoRequest);
        if(list.isEmpty()){
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } else {
            return new ResponseEntity<>(list, HttpStatus.OK);
        }
    }


    /**
     * 가맹점 상세 조회
     * @param storeId 가맹점ID
     * @return 가맹점ID에 따라 가맹점 정보(StoreModalResponse)를 보여준다.
     */
    @ResponseBody
    @PostMapping("/store/{storeId}")
    public ResponseEntity<StoreModalResponse> selectStoreByStoreId(@PathVariable("storeId") int storeId) {
        StoreModalResponse response = storeService.selectStoreByStoreId(storeId);
        if(response == null){
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } else {
            return new ResponseEntity<>(response, HttpStatus.OK);
        }
    }

    /**
     * 가맹점 삭제
     * @param storeDeleteRequests 가맹점ID LIST
     * @return 가맹점 ID에 해당하는 가맹점 삭제
     */
    @ResponseBody
    @PatchMapping("/store/delete")
    public ResponseEntity<?> deleteStoreByStoreId(@RequestBody List<StoreDeleteRequest> storeDeleteRequests) {
        int result = storeService.deleteStoreByStoreId(storeDeleteRequests);
        if(result < 1) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        } else {
            return new ResponseEntity<>(result, HttpStatus.OK);
        }
    }

    /**
     * 가맹점 추가
     * @param storeRequest
     * @return storeRequest를 받아 가맹점 추가
     */
    @ResponseBody
    @PostMapping("/store/save")
    public ResponseEntity<?> saveStore(@RequestBody StoreRequest storeRequest) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();
        storeRequest.setMbrNo(username);
        int result = storeService.saveStore(storeRequest);
        if(result < 1) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        } else {
            return new ResponseEntity<>(result, HttpStatus.OK);
        }
    }

    @ResponseBody
    @PatchMapping("/store/update")
    public ResponseEntity<?> updateStore(@RequestBody StoreRequest storeRequest) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();
        storeRequest.setMbrNo(username);
        int result = storeService.updateStoreByStoreId(storeRequest);
        if(result < 1) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        } else {
            return new ResponseEntity<>(result, HttpStatus.OK);
        }
    }

}
