// 검색 버튼 클릭 시 호출되는 함수
async function onSearchRow() {
    let brandNm = $('.wrapper').eq(0).find('span').text();
    let storeNm = $('.wrapper').eq(1).find('span').text();
    let inspector = $('.wrapper').eq(2).find('span').text();
    let inspectorNm = inspector.slice(0, 3);
    let inspectorNo = inspector.slice(4,14) || null;


    // 특정 값일 경우 null로 설정
    if (storeNm === "가맹점 검색" || storeNm === "전체") {
        storeNm = null;
    }
    if (brandNm === "브랜드 검색" || brandNm === "전체") {
        brandNm = null;
    }
    if (inspector === "점검자 검색" || inspector === "전체") {
        inspectorNm = null;
        inspectorNo = null;
    }

    // 검색 조건 객체 생성
    const searchCriteria = {
        storeNm : storeNm,
        brandNm : brandNm,
        inspMbrNm : inspectorNm,
        mbrNo : inspectorNo
    };
    console.log(searchCriteria)
    await getStoreAll(searchCriteria); // await 추가


};

function onSearchInit(){
     $('.wrapper').eq(0).find('span').text("가맹점 검색");
     $('.wrapper').eq(1).find('span').text("브랜드 검색");
     $('.wrapper').eq(2).find('span').text("점검자 검색");
    gridApi.setGridOption("loading", true);
    gridApi.paginationGoToFirstPage()
    gridApi.setGridOption("rowData", defaultRowData); // 데이터 설정
    setTimeout(function () {
        gridApi.setGridOption("loading", false);
        updateStoreCount();
    }, 200)

}