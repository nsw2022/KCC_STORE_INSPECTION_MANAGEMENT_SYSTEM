// 검색 버튼 클릭 시 호출되는 함수
async function onSearchRow() {
    let brandNm = $('.wrapper').eq(0).find('span').text();
    let pdtNm = $('.wrapper').eq(1).find('span').text();
    let pdtSellSttsNm = $('.wrapper').eq(2).find('span').text();

    // 특정 값일 경우 null로 설정
    if (pdtNm === "제품명 검색" || pdtNm === "전체") {
        pdtNm = null;
    }
    if (brandNm === "브랜드 검색" || brandNm === "전체") {
        brandNm = null;
    }
    if (pdtSellSttsNm === "판매상태 검색" || pdtSellSttsNm === "전체") {
        pdtSellSttsNm = null;
    }

    // 검색 조건 객체 생성
    const searchCriteria = {
        brandNm : brandNm,
        pdtNm : pdtNm,
        pdtSellSttsNm : pdtSellSttsNm
    };
    console.log(searchCriteria)


    await getProductAll(searchCriteria); // await 추가
};

function onSearchInit(){
    $('.wrapper').eq(0).find('span').text("제품명 검색");
    $('.wrapper').eq(1).find('span').text("브랜드 검색");
    $('.wrapper').eq(2).find('span').text("판매상태 검색");
    gridApi.setGridOption("loading", true);
    gridApi.paginationGoToFirstPage()
    gridApi.setGridOption("rowData", defaultRowData); // 데이터 설정

    setTimeout(function () {
        gridApi.setGridOption("loading", false);
        updateProductCount();
    }, 200)
}