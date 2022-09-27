import { getUserGoogleInfoByToken, closeLanguageToolTab } from './background'
import { LANGUAGE_TOOL_URL } from '../staticData'

interface IRequest {
    action: string;
    data?: any;
}

let tabToClose: number = 0;
let idToken: string;

const setChromeListener = () => {
    // 點擊登入按鈕
    chrome.runtime.onMessage.addListener((request: IRequest) => {
        if (request.action === "openLanguageToolTab") {
            // 開啟新分頁讓使用者登入 Language Tool
            chrome.tabs.create({
                url: LANGUAGE_TOOL_URL,
                active: false
            }, (tab: any) => {
                // 儲存 tabId 以便在取得到用戶資訊後可關閉指定 tab
                tabToClose = tab.id;
            })
        }
    });

    // 攔截 LT 發送的 POST 請求，並提取其中的 idToken
    chrome.webRequest.onBeforeRequest.addListener(
        function (details: chrome.webRequest.WebRequestBodyDetails) {
            if (
                details.method == 'POST'
                && details.initiator == LANGUAGE_TOOL_URL
                && details.requestBody != undefined
                && details.requestBody.raw != undefined
            ) {
                // 解析請求 Body 中的資料
                let postedString = decodeURIComponent(String.fromCharCode.apply(null,
                    // @ts-ignore
                    new Uint8Array(details.requestBody.raw[0].bytes)));

                // Get the token then start to get user informaions and info dev panel to retry patch action
                if (postedString.includes('idToken')) {
                    let postJsonObj = JSON.parse(postedString);
                    if (postJsonObj.idToken.length >= 100) {
                        idToken = postJsonObj.idToken;

                        chrome.storage.sync.set({ token: postJsonObj.idToken }, function () {
                            getUserGoogleInfoByToken(idToken);
                            closeLanguageToolTab(tabToClose);
                            chrome.runtime.sendMessage({ action: ['autoRetryPatchAfterAutoGetToken'] });
                        });
                    }
                }
            }
        },
        { urls: ['<all_urls>'] },
        ['requestBody']
    );
}

export { setChromeListener }