/* globals describe, it */
import { lock } from '../index.js'
import { deepStrictEqual as same } from 'assert'

describe('basics', () => {
  it('MyClass', () => {
    class MyClass {
      constructor ({ test }) {
        lock(this, { test })
      }
    }
    const c = new MyClass({ test: true })
    same(c.test, true)
    const { test: _test } = c
    same(_test, true)
    let threw = true
    try {
      c.test = false
      threw = false
    } catch (e) {
      console.error(e.message)
    }
    same(threw, true)
  })
})
