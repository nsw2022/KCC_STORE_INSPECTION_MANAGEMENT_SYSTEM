package com.sims.master.product_manage.controller.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/master")
public class StoreController{

    @Value("${naver.maps.client.id}")
    private String naverClientId;

    @GetMapping("/store_manage/store_list")
    public void storeManage(Model model){
        model.addAttribute("naverClientId", naverClientId);
    }
}
