
/**
 * 조회 버튼 누를 때 검색에 따라 내용이 변경
 */
async function onSearchRow() {
    let brandName = $('.wrapper').eq(0).find('span').text();
    let storeName = $('.wrapper').eq(1).find('span').text();
    let chklstName = $('.wrapper').eq(2).find('span').text();
    let inspTypeName = $('.wrapper').eq(3).find('span').text();
    let inspector = $('.wrapper').eq(4).find('span').text();
    let inspComplTime = $('#topScheduleDate').val();
    let mbrName;
    let mbrNumber;

    if (storeName === '전체' || storeName ==='가맹점 검색') {
        storeName = null;
    }

    if (brandName === '전체' || brandName ==='브랜드 검색') {
        brandName = null;
    }

    if (chklstName === '전체' || chklstName ==='체크리스트 검색') {
        chklstName = null;
    }

    if (inspTypeName === '전체' || inspTypeName ==='점검유형 검색') {
          inspTypeName = null;
    }

    if (inspector === '전체' || inspector === "점검자 검색") {
        mbrName = null;
        mbrNumber = null;
    } else {
        const specialCharPattern = /[!@#$%^&*(),.?":{}|<>]/g;
        if(!specialCharPattern.test(inspector)) {
            mbrName = inspector;
            mbrNumber = null;
            console.log('aaaaa')
        } else {
            mbrName = inspector.split('(')[0]
            console.log('bbbb')
            mbrNumber = inspector.split('(')[1].slice(0,10);
        }

    }

    if(inspComplTime === undefined || inspComplTime ==='') {
        inspComplTime = null;
    } else {
        inspComplTime = inspComplTime.split('-').join('');
    }

    const searchCriteria = {
        storeNm: storeName,
        brandNm: brandName,
        inspComplTm: inspComplTime,
        chklstNm: chklstName,
        inspTypeNm: inspTypeName,
        mbrNm: mbrName,
        mbrNo : mbrNumber
    };
    console.log(searchCriteria)
    getInspResultAll(searchCriteria);

}

/**
 * 초기화 버튼을 통해 검색된 목록 초기화
 */
function onSearchInit() {
     $('.wrapper').eq(0).find('span').text("브랜드 검색");
     $('.wrapper').eq(1).find('span').text("가맹점 검색");
     $('.wrapper').eq(2).find('span').text("체크리스트 검색");
     $('.wrapper').eq(3).find('span').text("점검유형 검색");
     $('.wrapper').eq(4).find('span').text("점검자 검색");
     $('#topScheduleDate').val('');

    gridApi.setGridOption("loading", true);
    gridApi.paginationGoToFirstPage()
    gridApi.setGridOption("rowData", defaultRowData); // 데이터 설정

    setTimeout(function () {
        gridApi.setGridOption("loading", false);
        updateResultCount();
    }, 200)
}