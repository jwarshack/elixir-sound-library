import React, { useState } from 'react'
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    Input,
    InputGroup,
    InputRightAddon,
    Alert,
    AlertDescription,
  } from '@chakra-ui/react'
import { useWeb3 } from '../context/useWeb3'
import { ethers } from 'ethers'
import { contractAddress, contractAbi } from '../config'


export default function UpdatePriceModal({ isOpen, onClose, sound }) {
    
    const [newPrice, setNewPrice] = useState(null)
    const [errorMsg, setErrorMsg] = useState(null)
    const [isLoading, setIsLoading] = useState(true)


    const { web3Provider } = useWeb3()

    async function updatePrice() {
        if (!newPrice) {
            setErrorMsg('Please fill out all fields.')
            return
        }

        if (newPrice === sound.price) {
            setErrorMsg('Please enter a new price.')
            return
        }

        if (web3Provider) {
            try {
                const signer = web3Provider.getSigner()
                const contract = new ethers.Contract(contractAddress, contractAbi, signer);
                const tx = await contract.updatePrice(sound.tokenId, ethers.utils.parseEther(newPrice))
                await tx.wait()

                onClose()

            } catch(err) {
                setErrorMsg('Transaction could not be completed.')
            }
        }

    }

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
            <ModalHeader>{sound.name}</ModalHeader>
            <ModalCloseButton />
            <ModalBody>

                {
                    errorMsg && (
                        <Alert status='error' mb={5}>
                            <AlertDescription>{errorMsg}</AlertDescription>
                        </Alert>
  

                    )
                }
                <InputGroup>
                    <Input placeholder={sound.price} type="number" onChange={(e) => setNewPrice(e.target.value)}/>
                    <InputRightAddon>ETH</InputRightAddon>
                </InputGroup>
            </ModalBody>


            <ModalFooter>
                <Button bgColor="pink.500" textColor="white" onClick={updatePrice}>Update Price</Button>

            </ModalFooter>
            </ModalContent>
        </Modal>
        
    )
}
