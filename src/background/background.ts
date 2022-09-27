import { setChromeListener } from './eventhandler'
import { useState } from 'react';
import { LANGUAGE_TOOL_API_KEY } from '../staticData'

// 開始執行所有事件監聽
setChromeListener();

const getUserGoogleInfoByToken = async (idToken: string) => {
    let response = await fetch(`https://www.googleapis.com/identitytoolkit/v3/relyingparty/getAccountInfo?key=${LANGUAGE_TOOL_API_KEY}`, {
        method: 'POST',
        body: JSON.stringify({ idToken: idToken })
    });
    let jsonObj = await response.json();

    // 儲存使用者資訊
    await chrome.storage.sync.set({
        displayName: jsonObj.users[0].displayName,
        email: jsonObj.users[0].email,
        photoUrl: jsonObj.users[0].photoUrl
    });

    chrome.runtime.sendMessage({ action: "setReactUserInfo" });
}

// 取得使用者資訊後關閉 LT tab
const closeLanguageToolTab = (tableId: number) => {
    if (tableId != 0) {
        chrome.tabs.remove(tableId, function () {
            tableId = 0;
        });
    }
}

export { getUserGoogleInfoByToken, closeLanguageToolTab }