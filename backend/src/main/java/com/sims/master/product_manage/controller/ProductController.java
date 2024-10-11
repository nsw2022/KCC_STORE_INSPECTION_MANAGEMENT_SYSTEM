package com.sims.master.product_manage.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/master")
public class ProductController {
	
	@GetMapping("/product_manage/product_list")
	public void productManage() {
	}

}
