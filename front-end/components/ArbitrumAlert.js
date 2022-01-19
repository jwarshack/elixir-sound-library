import React from 'react'
import { Alert, AlertDescription, AlertTitle, CloseButton } from '@chakra-ui/react'

export default function ArbitrumAlert() {
    return (
        <Alert position="absolute" px="10" justifyContent={"space-between"}>
            <AlertTitle>We are live on Arbitrum!</AlertTitle>
            <CloseButton />
        </Alert>
    )
}
