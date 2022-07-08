import React, { FC, useState } from 'react'
import styled, { AnyStyledComponent } from 'styled-components';
import { Typography, Switch, FormControl, InputLabel, Select, MenuItem, SelectChangeEvent, OutlinedInput } from '@mui/material'
import { LANGUAGE_SELECT_DATA } from '../staticData'
import { BasicSelect } from './langDropSelect'

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

export const ToolsCard: FC = (props) => {

    const selectData: IKeyValuePair[] = LANGUAGE_SELECT_DATA;
    const [selectedLang, setSelectedLang] = useState<IKeyValuePair>({ name: "中文", value: 'zh-TW' })

    const handleSelectChange = (e: SelectChangeEvent<string>) => {
        setSelectedLang({ name: e.target.name, value: e.target.value })
    }

    return (
        <ToolsContainer>
            <BasicSelect />
            <EditModeContainer>
                <Switch />
                <Typography component="span" variant="subtitle2">編輯模式</Typography>
            </EditModeContainer>
        </ToolsContainer>
    )
}

