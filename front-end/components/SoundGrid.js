import { Box, Grid } from '@chakra-ui/layout'
import { useState } from 'react'
import dynamic from 'next/dynamic'
import SoundCard from './SoundCard'

export default function SoundGrid({ sounds }) {
    const [allowPlay, setAllowPlay] = useState()



    return (
        <Grid
            p={10}
            templateColumns={{sm:"repeat(1, 1fr)", md: "repeat(2, 1fr)", xl: "repeat(4, 1fr)"}}
            gap={10}
        >
            {
                sounds.map((sound, key) => (
                    <SoundCard key={key} sound={sound} allowPlay={allowPlay} setAllowPlay={setAllowPlay} />

                ))
            }

        </Grid>
    )
}
