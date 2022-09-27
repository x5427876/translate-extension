import React, { FC, useState, useEffect } from "react";
import { createRoot } from 'react-dom/client';
import styled from 'styled-components';
import { Options } from './Options';
import { UserCard } from "./UserCard";
import { Alert } from '@mui/material';
import { VALID_DOMAIN_LIST } from '../staticData'

interface IUserInfo {
    displayName: string;
    email: string;
    photoUrl: string;
}

interface IRequest {
    action: string;
}

const Container = styled.div`
    width: 320px;
    height: 180px;
`

export const Popup: FC = () => {
    const [isLogin, setIsLogin] = useState<boolean>(false);
    const [isEditMode, setIsEditMode] = useState<boolean>(false);
    const [isValidDomain, setIsValidDomain] = useState<boolean>();
    const [currentDoamin, SetCurrentDomain] = useState<string>('');
    const [userInfo, setUserInfo] = useState<IUserInfo>({
        displayName: '', email: '', photoUrl: ''
    });

    // 監聽 Chrome State 變更時修改 React State
    // 寫在這因為 useState 無法在非 Function Component 內使用 
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        if (request.action === "setReactUserInfo") {
            chrome.storage.sync.get(["displayName", "email", "photoUrl"], (result) => {
                const { displayName, email, photoUrl } = result;
                setUserInfo({ displayName, email, photoUrl })
                setIsLogin(true)
            });
        }
    });

    useEffect(() => {
        // 檢查是否已經登入過，若已登入過則不需再登入
        chrome.storage.sync.get(["displayName", "email", "photoUrl"], (result) => {
            const { displayName, email, photoUrl } = result
            if (displayName && email && photoUrl) {
                setUserInfo({ displayName, email, photoUrl })
                setIsLogin(true)
            }
        })

        // 檢查當前頁面 domain 是否可使用小工具
        chrome.tabs.query({ active: true, lastFocusedWindow: true }, async (tabs: chrome.tabs.Tab[]) => {
            let domainRegex = /:\/\/[^\/]+/g;
            let currentDomain = tabs[0].url as string;

            // @ts-ignore
            currentDomain = currentDomain.match(domainRegex) == null ? '' : currentDomain.match(domainRegex)[0].replace(/:\/\//, '');

            SetCurrentDomain(currentDomain)
            setIsValidDomain(VALID_DOMAIN_LIST.indexOf(currentDomain) >= 0)
        });
    }, [])

    return (
        <Container>
            <UserCard
                isLogin={isLogin}
                userInfo={userInfo}
            />
            <Options />
            <Alert severity={isValidDomain ? 'success' : 'error'}>
                {isValidDomain ? `當前頁面可使用小工具` : `當前頁面不支援小工具`}
            </Alert>
        </Container>
    )
}

const container = document.getElementById("popup") as HTMLElement;
const root = createRoot(container);
root.render(<Popup />);