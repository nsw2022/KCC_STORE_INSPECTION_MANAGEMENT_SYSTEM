package com.sims.master.product_manage.controller;

import com.sims.config.Exception.CustomException;
import com.sims.config.Exception.ErrorCode;
import com.sims.master.product_manage.service.ProductService;
import com.sims.master.product_manage.vo.ProductDeleteRequest;
import com.sims.master.product_manage.vo.ProductOptionsResponse;
import com.sims.master.product_manage.vo.ProductRequest;
import com.sims.master.product_manage.vo.ProductResponse;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import oracle.ucp.proxy.annotation.Post;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
@RequestMapping("/master")
@RequiredArgsConstructor
@Slf4j
public class ProductController {

	private final ProductService productService;

	/**
	 * 제품관리 페이지 보여줌
	 */
	@GetMapping("/product/manage")
	public String productManage() {
		return "master/product_manage/product_list";
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
		log.info("result = {}", list);
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


	/**
	 * 제품 상세 조회
	 * @param pdtId 제품ID
	 * @param model
	 * @return 제품 ID에 따라 제품 정보를 보여준다.
	 */
	@ResponseBody
	@PostMapping("/product/{pdtId}")
	public ResponseEntity<ProductResponse> selectProduct(@PathVariable("pdtId") int pdtId, Model model) {
		ProductResponse response = productService.selectProductByPdtId(pdtId);
		model.addAttribute("product", response);
		if(response == null) {
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		} else {
			return new ResponseEntity<>(response, HttpStatus.OK);
		}
	}

	/**
	 * 제품 저장
	 * @param productRequest
	 * @return 제품의 정보를 입력받아 저장한다
	 */
	@ResponseBody
	@PostMapping("/product/save")
	public ResponseEntity<?> saveProduct(@RequestBody ProductRequest productRequest) {
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		String username = auth.getName();
		productRequest.setMbrNo(username);
		log.info("saveProduct = {}", productRequest);
		int result = productService.saveProduct(productRequest);
		if(result <1) {
			return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
		} else {
			return new ResponseEntity<>(result, HttpStatus.OK);
		}

	}

	/**
	 *
	 * @param pdtId 제품ID
	 * @param productRequest
	 * @return
	 */
	@ResponseBody
	@PatchMapping("/product/update/{pdtId}")
	public ResponseEntity<?> updateProduct(@PathVariable("pdtId") int pdtId, @RequestBody ProductRequest productRequest) {
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		String username = auth.getName();
		productRequest.setPdtId(pdtId);
		productRequest.setMbrNo(username);
		int result = productService.updateProduct(productRequest);
		if(result <1) {
			return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
		} else {
			return new ResponseEntity<>(result, HttpStatus.OK);
		}
	}

	@ResponseBody
	@PatchMapping("/product/delete")
	public ResponseEntity<?> deleteProduct(@RequestBody List<ProductDeleteRequest> productDeleteRequests) {
		int result = productService.deleteProduct(productDeleteRequests);
		if(result <1) {
			return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
		} else {
			return new ResponseEntity<>(result, HttpStatus.OK);
		}
	}


}