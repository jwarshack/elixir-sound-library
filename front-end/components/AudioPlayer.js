import { useState, useEffect, useRef } from "react"
import { Box, Flex, IconButton } from "@chakra-ui/react"
import WaveSurfer from "wavesurfer.js"
import { BsPauseFill, BsPlayFill } from "react-icons/bs"



export default function AudioPlayer({ src }) {

    const [isPlaying, setIsPlaying] = useState(false)
    const [waveSurfer, setWaveSurfer] = useState(null)
    const waveFormRef = useRef()



    useEffect(() => {
        const waveSurfer = WaveSurfer.create({
            container: waveFormRef.current,
            progressColor: '#EC4899',
            barWidth: 1,
            cursorWidth: 0,
            isPlaying
        })
        waveSurfer.load(src)
        setWaveSurfer(waveSurfer)
    }, [])



    function togglePlayPause() {
        const prevValue = isPlaying
        setIsPlaying(!prevValue)

        if (!prevValue) {
            waveSurfer.play()
        } else {
            waveSurfer.stop()
        }
    }
    return (

        <>
            <Box ref={waveFormRef}></Box>
            <Flex w="100%" justify="center" p={4}>
                <IconButton icon={isPlaying ? <BsPauseFill/> : <BsPlayFill style={{marginLeft: "2px"}}/>} isRound="true" bg="black" color="white"fontSize="2rem" onClick={togglePlayPause}/>
            </Flex>
        </>
    )
}

