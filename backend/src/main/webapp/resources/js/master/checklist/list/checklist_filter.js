// 검색 버튼 클릭 시 호출되는 함수
async function onSearchRow() {
    let searchBrandPlaceholder = $('.searchBrandPlaceholder').text();
    let searchChklstPlaceholder = $('.searchChklstPlaceholder').text();
    let searchMasterChklstPlaceholder = $('.searchMasterChklstPlaceholder').text();
    let searchInspTypePlaceholder = $('.searchInspTypePlaceholder').text();
    let searchDatePlaceholder = $('.searchDatePlaceholder').val();
    let searchMasterSttsPlaceholder = $('.searchMasterSttsPlaceholder').text();
    let searchUseWPlaceholder = $('.searchUseWPlaceholder').text();

    // 특정 값일 경우 null로 설정
    if (searchBrandPlaceholder === "브랜드 검색" || searchBrandPlaceholder === "-전체-") {
        searchBrandPlaceholder = null;
    }
    if (searchChklstPlaceholder === "체크리스트 검색" || searchChklstPlaceholder === "-전체-") {
        searchChklstPlaceholder = null;
    }
    if (searchMasterChklstPlaceholder === "마스터 체크리스트" || searchMasterChklstPlaceholder === "-전체-") {
        searchMasterChklstPlaceholder = null;
    }
    if (searchInspTypePlaceholder === "점검유형" || searchInspTypePlaceholder === "-전체-") {
        searchInspTypePlaceholder = null;
    }

    if(searchDatePlaceholder === null || searchDatePlaceholder === "") {
        searchDatePlaceholder = null;
    }
    if (searchMasterSttsPlaceholder === "마스터여부" || searchMasterSttsPlaceholder === "-전체-") {
        searchMasterSttsPlaceholder = null;
    }
    if (searchUseWPlaceholder === "사용여부" || searchUseWPlaceholder === "-전체-") {
        searchUseWPlaceholder = null;
    }

    // 검색 조건 객체 생성
    const searchCriteria = {
        brandNm: searchBrandPlaceholder,
        chklstNm: searchChklstPlaceholder,
        masterChklstNm: searchMasterChklstPlaceholder,
        inspTypeNm: searchInspTypePlaceholder,
        creTm: searchDatePlaceholder,
        chklstUseW: searchUseWPlaceholder
    };

    await getChecklistAll(searchCriteria); // await 추가

    console.log(searchCriteria);
};

function onSearchInit(){
    let searchBrandPlaceholder = $('.searchBrandPlaceholder').text("브랜드 검색");
    let searchChklstPlaceholder = $('.searchChklstPlaceholder').text("체크리스트 검색");
    let searchMasterChklstPlaceholder = $('.searchMasterChklstPlaceholder').text("마스터 체크리스트");
    let searchInspTypePlaceholder = $('.searchInspTypePlaceholder').text("점검유형");
    let searchDatePlaceholder = $('.searchDatePlaceholder').val('');
    let searchMasterSttsPlaceholder = $('.searchMasterSttsPlaceholder').text("마스터여부");
    let searchUseWPlaceholder = $('.searchUseWPlaceholder').text("사용여부");

    gridApi.setGridOption("rowData", defaultRowData); // 데이터 설정
    updateChecklistCount();
}