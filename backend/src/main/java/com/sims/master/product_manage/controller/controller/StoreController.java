package com.sims.master.product_manage.controller.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/master")
public class StoreController{

    @GetMapping("/store_manage/store_list")
    public void storeManage(){

    }
}
