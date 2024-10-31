package com.sims.master.product_manage.controller;

import com.sims.master.product_manage.service.ProductService;
import com.sims.master.product_manage.vo.ProductOptionsResponse;
import com.sims.master.product_manage.vo.ProductRequest;
import com.sims.master.product_manage.vo.ProductResponse;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
@RequestMapping("/master")
@RequiredArgsConstructor
public class ProductController {

	private final ProductService productService;

	/**
	 * 제품관리 페이지 보여줌
	 */
	@GetMapping("/product_manage/product_list")
	public void productManage() {
	}

	/**
	 * productRequest를 통해 제품 목록을 다르게 보여줌
	 * @param productRequest
	 * @return productRequest를 통해서 List<ProductResponse> 반환
	 */
	@ResponseBody
	@PostMapping("/product/list")
	public ResponseEntity<List<ProductResponse>> selectProductList(@RequestBody ProductRequest productRequest) {
		List<ProductResponse> list = productService.selectAllProducts(productRequest);
		if(list.isEmpty()) {
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		} else {
			return new ResponseEntity<>(list, HttpStatus.OK);
		}
	}

	/**
	 * 제품 관리 옵션 목록 출력
	 * @return 제품 옵션 LIST (제품명 / 브랜드명 / 판매상태)
	 */
	@ResponseBody
	@GetMapping("/product/options")
	public ResponseEntity<ProductOptionsResponse> selectAllOptions() {
		return new ResponseEntity<>(productService.selectAllProductOptions(), HttpStatus.OK);
	}


}