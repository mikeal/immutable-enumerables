'use strict'
/* eslint-env browser */

const ipc = () => {
  const { port1: sender, port2: receiver } = new MessageChannel()
  let out = true
  const move = async (data, transfer) => {
    await out
    return await new Promise(resolve => {
      receiver.onmessage = event => resolve(event.data)
      sender.postMessage(data, transfer)
    })
  }

  const ipcMove = async (data, transfer = []) => {
    out = move(data, transfer)
    return await out
  }
  ipcMove.close = () => {
    sender.close()
    receiver.close()
  }

  return ipcMove
}

const defer = () => {
  const result = []
  result.unshift(
    new Promise((resolve, reject) => {
      result.push(resolve, reject)
    })
  )
  return result
}

export { ipc, defer }
