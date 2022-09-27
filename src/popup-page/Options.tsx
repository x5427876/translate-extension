import React, { FC, useState } from 'react'
import styled, { AnyStyledComponent } from 'styled-components';
import { Typography, Switch, FormControl, InputLabel, Select, MenuItem, SelectChangeEvent, OutlinedInput } from '@mui/material'
import { LANGUAGE_SELECT_DATA } from '../staticData'
import LangSelect from './langDropSelect'

interface IKeyValuePair {
    name: string;
    value: string;
}

const ToolsContainer = styled.div`
    height: 30%;
    margin: 10px;
    display: flex;
    justify-content: space-between;
`

const EditModeContainer = styled.div`
    display: flex;
    justify-content: end;
    align-items: center;
`

export const Options: FC = (props) => {

    return (
        <ToolsContainer>
            <LangSelect />
            <EditModeContainer>
                <Switch />
                <Typography component="span" variant="subtitle2">編輯模式</Typography>
            </EditModeContainer>
        </ToolsContainer>
    )
}

