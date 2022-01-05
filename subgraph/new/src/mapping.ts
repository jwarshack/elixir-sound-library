import { BigInt } from "@graphprotocol/graph-ts"
import {
  ElixirSoundLibrary,
  PriceUpdated,
  SoundCreated,
  SoundLicensed,
  Transfer
} from "../generated/ElixirSoundLibrary/ElixirSoundLibrary"
import { User, Sound } from "../generated/schema"


export function handleSoundCreated(event: SoundCreated): void {
  let sound = Sound.load(event.params.tokenId.toString())
  if (!sound) {
    sound = new Sound(event.params.tokenId.toString())
    sound.owner = event.params.owner.toHexString()
    sound.tokenID = event.params.tokenId
    sound.tokenURI = event.params.tokenURI
    sound.price = event.params.price
    sound.licenseCount = 0
  }
  sound.save()


  let user = User.load(event.params.owner.toHexString())
  if (!user) {
    user = new User(event.params.owner.toHexString())
    user.save()

  }


}

export function handleSoundLicensed(event: SoundLicensed): void {
  let sound = Sound.load(event.params.tokenId.toString())
  if (!sound) return
  sound.licenseCount += 1
  sound.save()


  let user = User.load(event.params.licensee.toHexString())
  if (!user) {
    user = new User(event.params.licensee.toHexString())
    user.save()
  } 
}

export function handlePriceUpdated(event: PriceUpdated): void {
  let sound = Sound.load(event.params.tokenId.toString())
  if(!sound) return
  sound.price = event.params.price
  sound.save()
}

export function handleTransfer(event: Transfer): void {
  let sound = Sound.load(event.params.tokenId.toString())
  if (!sound) return
  sound.owner = event.params.to.toHexString()
  sound.save()

  let user = User.load(event.params.to.toHexString())
  if (!user) {
    user = new User(event.params.to.toHexString())
    user.save()
  }
}