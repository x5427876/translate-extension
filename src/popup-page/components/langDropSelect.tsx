import React, { useState, useEffect } from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';

export default function LangSelect() {
    const [lang, setLang] = useState('zh-TW');

    const handleChange = (event: SelectChangeEvent) => {
        setLang(event.target.value);

        chrome.storage.sync.set({
            pageLang: event.target.value
        });

        // 透過更改 request header 中的 accept-language 切換頁面語系
        chrome.declarativeNetRequest.updateDynamicRules(
            {
                addRules: [{
                    'id': 1,
                    'priority': 1,
                    'action': {
                        'type': 'modifyHeaders' as chrome.declarativeNetRequest.RuleActionType,
                        'requestHeaders': [
                            {
                                header: 'accept-language',
                                operation: 'set' as chrome.declarativeNetRequest.HeaderOperation,
                                value: event.target.value
                            }
                        ]
                    },

                    'condition': {
                        'urlFilter': 'https://sms.qa.91dev.tw',
                        'resourceTypes': [
                            // @ts-ignore
                            'csp_report', 'font', 'image', 'main_frame', 'media', 'object', 'other', 'ping', 'script', 'stylesheet', 'sub_frame', 'webbundle', 'websocket', 'webtransport', 'xmlhttprequest'
                        ]
                    }
                }
                ],
                removeRuleIds: [1]
            }
        )

        chrome.tabs.reload();
    }

    useEffect(() => {
        chrome.storage.sync.get(["pageLang"], (result) => {
            const { pageLang } = result
            if (pageLang) {
                setLang(pageLang)
            }
        })
    },[])

    return (
        <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
            <InputLabel id="lang-select">語言</InputLabel>
            <Select
                labelId="lang-select"
                id="lang-select"
                value={lang}
                label="lang"
                onChange={handleChange}
            >
                <MenuItem value={'zh-TW'}>中文</MenuItem>
                <MenuItem value={'zh-HK'}>香港中文</MenuItem>
                <MenuItem value={'en-US'}>英文</MenuItem>
                <MenuItem value={'ms-MY'}>馬來文</MenuItem>
                <MenuItem value={'kok-IN'}>火星文</MenuItem>
            </Select>
        </FormControl>
    );
}