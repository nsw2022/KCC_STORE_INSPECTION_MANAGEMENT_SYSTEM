let filePath;

function uploadFile(file, callback) {
    const formData = new FormData();
    formData.append("file", file);

    fetch('/upload/brdPath', {
        method: 'POST',
        body: formData
    })
        .then(response => response.json())
        .then(data => {
            console.log("Upload response data:", data); // 디버깅 로그

            if (data.error) {
                throw new Error(data.error);
            }

            // S3 키 생성: data.path에 'brd/'가 포함되어 있지 않은지 확인
            const s3Key = data.path.startsWith('brd/') ? data.path : 'brd/' + data.path;
            console.log(s3Key);

            const filePathText = $('.file_name').text();
            console.log(filePathText)
            if (filePathText) {
                console.log("Fetching image from path:", s3Key);

                return fetch('/download', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ path: s3Key })
                });
            }
        })
        .then(downloadResponse => {
            if (!downloadResponse.ok) {
                throw new Error(`파일 다운로드 실패: ${downloadResponse.statusText}`);
            }

            return downloadResponse.blob();
        })
        .then(blob => {
            const imageUrl = URL.createObjectURL(blob);
            console.log("Image URL created:", imageUrl); // 디버깅 로그
            filePath = imageUrl.split('/')[3];
            console.log(filePath)

            // 콜백 호출
            callback(filePath);
        })
        .catch(error => {
            console.error("파일 업로드 실패:", error);
            alert("파일 업로드에 실패했습니다.");
        });
}

function updateAjax(storeRequest) {
    $.ajax({
        url : '/master/store/update',
        method: 'PATCH',
        headers: {
            "Content-Type": "application/json",
        },
        data: JSON.stringify(storeRequest),
        success: function () {
            Swal.fire({
                title: "수정 완료!",
                text: "완료되었습니다.",
                icon: "success",
                confirmButtonText: "OK",
            }).then((result) => {
                if (result.isConfirmed) {
                    location.href = "/master/store/manage";
                }
            });
        }, error: function (xhr) {
            // 응답 상태 코드에 따른 에러 처리
            if (xhr.status === 403) {
                Swal.fire("실패!", "권한이 없습니다.", "error");
                console.log(storeRequest)
            } else if (xhr.status === 400) {
                console.log(storeRequest)
                Swal.fire("실패", "저장에 실패했습니다", "error");
            } else if (xhr.status === 500) {
                console.log(storeRequest)
                Swal.fire("실패", "관리자에게 문의해주세요", "error");
            }
        }
    })
}

let selectedFile;
$(function () {
    
    // 점검자 입력할 때 자동으로 SV 가 입력되게 하는 이벤트
    $('.modal-body').on('click', $('.hide-list').eq(1).find('li'), function () {
        let inspMbrNm = $('li.selected').text().split('(')[0];
        let inspMbrNo = $('li.selected').text().split('(')[1].replace(')', '');
        const inspectorInfoRequest = {
            inspMbrNmm : inspMbrNm,
            inspMbrNo : inspMbrNo
        };
        $.ajax({
            url: '/master/store/superVisors',
            method : 'POST',
            data: JSON.stringify(inspectorInfoRequest),
            headers: {
            "Content-Type": "application/json",
            },
            success: function(data) {
                data.filter(x => {
                    let sv = x.mbrNm + '(' + x.mbrNo + ')';
                    $('.modal-body .wrapper').eq(2).find('span').text(sv);
                    let liTags = $('.modal-body .hide-list').eq(2).find('li');
                    $.each(liTags, function(index, item) {
                        console.log(item.innerHTML)
                        console.log(item)
                        if(item.innerHTML === sv) {
                            item.className +=' selected'
                        }
                    })
                })
            },
            error: function(xhr) {
                console.log(xhr.status);
                console.log(this.error());
            }

        })
    });
    
    // 사업자등록번호 입력할 때 자동 ('-') 입력 이벤트
    $('#brn').keyup(function () {
            this.value = this.value.match(/\d*/g).join('')
            .match(/(\d{0,3})(\d{0,2})(\d{0,5})/).slice(1).join('-')
            .replace(/-*$/g,'');
    })

    // 핸드폰 번호 입력할 때 자동 ('-') 입력 이벤트
    $('#ownerPhone').keyup(function () {
        this.value = this.value.match(/\d*/g).join('').match(/(\d{0,3})(\d{0,4})(\d{0,4})/)
            .slice(1).join('-').replace(/-*$/g,'');
    })

    // 모달안의 사업자등록증 이벤트
        $(".file_cus input[type=file]").on("change", function (event) {
            const fileName = $(this).val().split("\\").pop();
            const fileDisplay = $(this).siblings(".file_display");
            const fileNameDisplay = fileDisplay.find(".file_name");
            const fileRemoveButton = fileDisplay.find(".file_remove");

            fileNameDisplay.text(fileName || "파일을 선택해주세요.");

            // 파일이 선택되면 'X' 버튼을 보여줍니다.
            if (fileName) {
                fileRemoveButton.show();
            } else {
                fileRemoveButton.hide();
            }

            selectedFile = event.target.files[0];
        });
        // 'X' 버튼 클릭 시 파일 입력 초기화
        $(".file_cus .file_remove").on("click", function (e) {
            e.preventDefault(); // 기본 동작 방지
            const fileDisplay = $(this).closest(".file_display");
            const fileInput = $(this).closest("label").find("input[type=file]");
            const fileNameDisplay = fileDisplay.find(".file_name");

            // 파일 입력 초기화
            fileInput.val("");
            // 파일명 표시 영역 초기화
            fileNameDisplay.text("파일을 선택해주세요.");
            // 'X' 버튼 숨기기
            $(this).hide();

            // 선택된 파일 초기화
            selectedFile = null;
        });

    $('#save').click(function () {
        let storeId = $('input[type="hidden"]').val();
        console.log(storeId)
        let brand = $('.modal-body .wrapper span').eq(0).text()
        let insp = $('.modal-body .wrapper span').eq(1).text()
        let sv = $('.modal-body .wrapper span').eq(2).text()
        if(brand === "브랜드 검색" || brand ==='undefined') {
            brand = null;
        }

        console.log(insp);
        let inspMbrNmText;
        let inspMbrNoText;
        if(insp === "점검자 검색" || insp ==='undefined') {
            inspMbrNmText = null;
            inspMbrNoText = null;
        } else {
            inspMbrNmText = insp.split('(')[0];
            inspMbrNoText = insp.split('(')[1].replaceAll(')', '');
        }

        let svMbrNmText;
        let svMbrNoText;
        if(sv === "SV 검색" || sv ==='undefined' ) {
            svMbrNmText = null;
            svMbrNoText = null;
        } else {
            svMbrNmText = sv.split('(')[0];
            svMbrNoText = sv.split('(')[1].replaceAll(')', '');
        }

        let storeNmText = $('#storeName').val();
        let brnText = $('#brn').val();
        let openHmTime = $('#operationHours').val().slice(0,2) + $('#operationHours').val().slice(3);
        let addressText = $('#storeAddress').val() + ' ' + $('#detailedAddress').val();
        let ownNmText = $('#ownerName').val();
        let ownTelText = $('#ownerPhone').val();
        let storeBsnSttsNmText = $('.modal-body input[type="radio"]:checked').val();

        if(storeBsnSttsNmText ==='undefined') {
            storeBsnSttsNmText = null;
        }

        let storeRequest = {
            storeId : storeId,
            storeNm: storeNmText,
            brandNm: brand,
            brn: brnText,
            storeAddr: addressText,
            openHm: openHmTime,
            ownNm: ownNmText,
            ownTel: ownTelText,
            latitude: latitudeText,
            longitude: longitudeText,
            svMbrNm: svMbrNmText,
            svMbrNo: svMbrNoText,
            inspMbrNm: inspMbrNmText,
            inspMbrNo: inspMbrNoText,
            storeBsnSttsNm: storeBsnSttsNmText
        }
        let flag = true;
        if (storeId === '') {
            uploadFile(selectedFile, function (path) {
            if(flag === false) {
                return;
            }
            storeRequest.brdPath = path;
            $.ajax({
                    url: '/master/store/save',
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json",
                    },
                    data: JSON.stringify(storeRequest),
                    success: function () {
                        Swal.fire({
                            title: "등록 완료!",
                            text: "완료되었습니다.",
                            icon: "success",
                            confirmButtonText: "OK",
                        }).then((result) => {
                            console.log(storeRequest)
                            console.log(sv);
                            console.log(insp);
                            if (result.isConfirmed) {
                                flag = false;
                                location.href = "/master/store/manage";
                            }
                        });
                    }, error: function (xhr) {
                        // 응답 상태 코드에 따른 에러 처리
                        if (xhr.status === 403) {
                            Swal.fire("실패!", "권한이 없습니다.", "error");
                            console.log(storeRequest)
                        } else if (xhr.status === 400) {
                            console.log(storeRequest)
                            Swal.fire("실패", "저장에 실패했습니다", "error");
                        } else if (xhr.status === 500) {
                            console.log(storeRequest)
                            Swal.fire("실패", "관리자에게 문의해주세요", "error");
                        }
                    }
                })


            });
        } else {
            if(addressText.length ===1 && addressText === ' ') {
                addressText = null;
                storeRequest.storeAddr = addressText;
            }
            console.log(selectedFile)
            if(selectedFile === undefined) {

                updateAjax(storeRequest)

            } else {
                let key = 'brd/' +$('#deleteFile').val();
                $.ajax({
                    url:'/delete',
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json",
                    },
                    data: JSON.stringify({path : key}),
                    success : function () {
                        uploadFile(selectedFile, function(path) {
                            if(flag === false) {
                                return;
                            }
                            storeRequest.brdPath = path;
                            updateAjax(storeRequest);
                        })
                    },
                    error : function (xhr) {
                        console.log(xhr.status +"삭제 실패");
                        console.log(this.error);
                    }
                    

                })

            }

        }
    })
})