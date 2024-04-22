import {test, expect} from 'vitest'
import {hash, hashToNumber} from "$lib/games/Rugbull/decrypt.js";

test('hash method', () => {
  const round9 = "9e8d721a0f7bcb0f85c9679fdafafda21e65cf875ea8ee40a1389073b42714db"
  const round8 = "5da59a3c32d76f39b9353a36694f2f60be6ac8a6e5f074a38346578ae27da45f"
  const round7 = "916ac5ebdd7567ea52664188c32aeee136e0a4b1cc028c307f8dd6f545296dff"
  const clientSeed = "9cbd9b474ada1e75093ab5fb057bce06411a00a775a3cc0d0b8db4de3e314999"

  expect(hash(clientSeed, round9)).toBe(round8)
  expect(hash(clientSeed, round8)).toBe(round7)
})

test('hash to number', () => {
  expect(hashToNumber("5da59a3c32d76f39b9353a36694f2f60be6ac8a6e5f074a38346578ae27da45f")).toBe(2.7063366892051364)
})