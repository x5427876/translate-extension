import React, { FC } from 'react'
import styled from 'styled-components';
import { Avatar, Button, Card, Typography } from '@mui/material'

interface IProps {
    isLogin: boolean;
    userInfo: IUserInfo;
}

interface IUserInfo {
    displayName: string;
    email: string;
    photoUrl: string;
}

const Title = styled.h2`
    margin-bottom: 15px;
`

const LoginCard = styled(Card)`
    height: 60%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin: 10px;
`

const UserInfoCard = styled(Card)`
    height: 60%;
    display: flex;
    align-items: center;
    justify-content: space-around;
    margin: 10px;
`

const UserAvatar = styled(Avatar)`
    position: relative;
`

const UserInfo = styled.div`
    
`

export const UserCard: FC<IProps> = (props) => {
    const { isLogin, userInfo } = props;

    const handleLogin = () => {
        chrome.runtime.sendMessage({ action: "openLanguageToolTab" });
    }

    return (
        <React.Fragment>
            {!isLogin ? (
                <LoginCard variant="outlined">
                    <Title>請先登入 Language Tool</Title>
                    <Button variant="contained" onClick={handleLogin}>登入</Button>
                </LoginCard>
            ) : (
                <UserInfoCard variant="outlined">
                    <UserAvatar alt="user_avatar"
                        src={userInfo.photoUrl}
                        variant="square"
                        sx={{ width: 70, height: 70 }} />
                    <div>
                        <Typography component="div" variant="h6">{userInfo.displayName}</Typography>
                        <Typography variant="subtitle1" color="text.secondary" component="div">{userInfo.email}</Typography>
                    </div>
                </UserInfoCard>
            )}
        </React.Fragment>
    )
}

