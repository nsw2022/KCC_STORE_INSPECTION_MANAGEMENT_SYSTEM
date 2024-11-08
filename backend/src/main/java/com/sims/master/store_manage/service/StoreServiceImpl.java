package com.sims.master.store_manage.service;

import com.sims.config.Exception.CustomException;
import com.sims.config.Exception.ErrorCode;
import com.sims.config.common.aop.ARoleCheck;
import com.sims.master.product_manage.vo.ProductRequest;
import com.sims.master.store_manage.mapper.StoreMapper;
import com.sims.master.store_manage.vo.*;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.catalina.Store;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.lang.reflect.Field;
import java.util.List;

/**
 * @Description 가맹점 관리 Service
 * @Author 원승언
 * @Date 2024-11-03
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class StoreServiceImpl implements StoreService {

    private final StoreMapper storeMapper;
    /**
     * Product에서 하나라도 null이 생기면 안되므로 null이면 false를 리턴하는 메서드
     * @param request
     * @return 객체 안에 필드 중 하나라도 null이면 false 리턴
     */
    private boolean validateFieldsNull(StoreRequest request) {
        Field[] fields = request.getClass().getDeclaredFields();
        for(Field field : fields) {
            field.setAccessible(true);
            try {
                if(field.get(request) == null) {
                    return true;
                }
            } catch (IllegalAccessException e) {
                e.printStackTrace();
            }
        }
        return false;
    }

    @Override
    public List<StoreResponse> selectAllStores(StoreRequest request) {
        List<StoreResponse> list = storeMapper.selectAllStores(request);
        if(list.isEmpty()) {
            throw new CustomException(ErrorCode.NOT_FOUND);
        } else {
            return list;
        }
    }

    @Override
    public StoreOptionsResponse selectAllStoreOptions() {
        List<InspectorNmsResponse> inspectorNms = storeMapper.selectAllInspectorNms();
        List<String> brandNms = storeMapper.selectAllBrandNms();
        List<String> storeNms = storeMapper.selectAllStoreNms();
        InspectorInfoRequest inspectorInfoRequest = new InspectorInfoRequest();
        List<SvNmsResponse> svNms = storeMapper.selectAllSvNms(inspectorInfoRequest);
        StoreOptionsResponse response = StoreOptionsResponse.builder().storeNmList(storeNms).svNmList(svNms)
                .brandNmList(brandNms).inspectorNmList(inspectorNms).build();
        if(response.getStoreNmList().isEmpty()) {
            throw new CustomException(ErrorCode.STORE_NOT_FOUND);
        } else if(response.getBrandNmList().isEmpty()) {
            throw new CustomException(ErrorCode.BRAND_NOT_FOUND);
        } else if(response.getInspectorNmList().isEmpty()) {
            throw new CustomException(ErrorCode.INSP_NOT_FOUND);
        } else if(response.getSvNmList().isEmpty()) {
            throw new CustomException(ErrorCode.SV_NOT_FOUND);
        } else {
            return response;
        }
    }

    @Override
    public List<SvNmsResponse> selectAllSvNms(InspectorInfoRequest inspectorInfoRequest) {
        List<SvNmsResponse> list = storeMapper.selectAllSvNms(inspectorInfoRequest);
        if(list.isEmpty()) {
            throw new CustomException(ErrorCode.STORE_NOT_FOUND);
        } else {
            return list;
        }
    }

    @Override
    public StoreModalResponse selectStoreByStoreId(int storeId) {
        StoreModalResponse response = storeMapper.selectStoreByStoreId(storeId);
        if(response == null) {
            throw new CustomException(ErrorCode.NOT_FOUND);
        } else {
            return response;
        }
    }

    @ARoleCheck
    @Override
    @Transactional(rollbackFor = Exception.class)
    public int deleteStoreByStoreId(List<StoreDeleteRequest> storeDeleteRequests) {
        int result = storeMapper.deleteStoreByStoreId(storeDeleteRequests);
        if(result < 1) {
            throw new CustomException(ErrorCode.SAVE_FAIL);
        } else  {
            return result;
        }
    }

    @ARoleCheck
    @Transactional(rollbackFor = Exception.class)
    @Override
    public int saveStore(StoreRequest storeRequest) {
        if(validateFieldsNull(storeRequest)) {
            throw new CustomException(ErrorCode.INVALID_PARAMETER);
        }
        int result = storeMapper.storeSave(storeRequest);
        if(result < 1) {
            throw new CustomException(ErrorCode.SAVE_FAIL);
        } else {
            return result;
        }
    }

    @ARoleCheck
    @Transactional(rollbackFor = Exception.class)
    @Override
    public int updateStoreByStoreId(StoreRequest storeRequest) {
        if(storeRequest.getStoreId() < 1) {
            throw new CustomException(ErrorCode.INVALID_PARAMETER);
        }
        int result = storeMapper.updateStoreByStoreId(storeRequest);
        if(result < 1) {
            throw new CustomException(ErrorCode.SAVE_FAIL);
        } else {
            return result;
        }
    }
}
