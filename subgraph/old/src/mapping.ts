import { BigInt } from "@graphprotocol/graph-ts"
import {
  Elixir,
  Approval,
  ApprovalForAll,
  PriceUpdated,
  SoundCreated,
  SoundLicensed,
  Transfer
} from "../../generated/Elixir/Elixir"

import {
  Sound,
  User
} from "../../generated/schema"

export function handleSoundCreated(event: SoundCreated): void {
  let sound = Sound.load(event.params.tokenId.toString())
  if (!sound) {
    sound = new Sound(event.params.tokenId.toString())
    sound.owner = event.params.owner.toHexString()
    sound.tokenID = event.params.tokenId
    sound.tokenURI = event.params.tokenURI
    sound.licenseCount = new BigInt(0)

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
  sound.licensees.push(event.params.licensee.toHexString())
  let user = User.load(event.params.licensee.toHexString())
  if (!user) {
    user = new User(event.params.licensee.toHexString())
  } 

  let contract = Elixir.bind(event.params.licensee)
  // sound.licenseCount = new BigInt(contract.sound(event.params.id).uri.length)

  sound.save()
}

export function handlePriceUpdated(event: PriceUpdated): void {
  let sound = Sound.load(event.params.id.toString())
  if (sound) {
    sound.creator = event.params.price.toString()
    sound.save()

  }
}

export function handleTransfer(event: Transfer): void {
  let sound = Sound.load(event.params.tokenId.toString())

  if (!sound) return

  sound.creator = event.params.to.toHexString()
  sound.save()


}