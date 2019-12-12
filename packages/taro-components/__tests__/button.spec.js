import * as React from 'nervjs'
import { Button } from '../h5'
import { waitForChange, delay } from './utils'
import * as assert from 'assert'
import * as sinon from 'sinon'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const h = React.createElement

function fireTouchEvent (el, type) {
  const e = document.createEvent('UIEvent')
  e.initEvent(type, true, true)
  el.dispatchEvent(e)
}

describe('Button', () => {
  /**
   * @type {HTMLElement}
   */
  let scratch

  beforeAll(async () => {
    scratch = document.createElement('div')
    document.body.appendChild(scratch)
  })

  beforeEach(async () => {
    scratch.parentNode.removeChild(scratch)
    scratch = document.createElement('div')
    document.body.appendChild(scratch)
  })

  afterAll(async () => {
    scratch.parentNode.removeChild(scratch)
    scratch = null
  })

  it('props', async () => {
    const ref = React.createRef()

    const size = 'mini'
    const plain = true
    const loading = true
    const disabled = false
    /**
     * @type {import('react').ReactInstance}
     */
    let instance

    class App extends React.Component {
      state = {
        size,
        plain,
        loading,
        disabled
      }

      constructor (props) {
        super(props)
        instance = this
      }

      render () {
        const {
          size,
          plain,
          loading,
          disabled
        } = this.state
        return (
          <Button
            ref={ref}
            size={size}
            plain={plain}
            loading={loading}
            disabled={disabled}
          >
            button
          </Button>
        )
      }
    }

    React.render(<App />, scratch)

    /**
     * @type {HTMLElement}
     */
    const node = ref.current

    await waitForChange(node)

    /**
     * @type {HTMLButtonElement}
     */
    const button = node.children[0]
    assert(button.classList.contains('weui-btn_plain-default'))
    assert(button.classList.contains('weui-btn-default') === false)
    assert(button.classList.contains('weui-btn_mini'))
    assert(button.classList.contains('weui-btn_loading'))
    assert(button.classList.contains('weui-btn_disabled') === false)
    const icon = button.getElementsByTagName('i')[0]
    assert(icon.className === 'weui-loading')
    assert(button.innerHTML.includes('button'))

    instance.setState({
      plain: false
    })
    await waitForChange(button)
    assert(!button.classList.contains('weui-btn_plain-default'))
    assert(button.classList.contains('weui-btn_default'))

    instance.setState({
      loading: false
    })
    await waitForChange(button)
    assert(!button.classList.contains('weui-btn_loading'))
    assert(icon.parentNode === null)

    instance.setState({
      disabled: true
    })
    await waitForChange(button)
    assert(button.classList.contains('weui-btn_disabled'))

    instance.setState({
      size: 'big'
    })
    await waitForChange(button)
    assert(button.classList.contains('weui-btn_mini') === false)
  })

  it('event', async () => {
    const ref = React.createRef()

    const clickSpy = sinon.spy()
    const touchStartSpy = sinon.spy()
    const touchEndSpy = sinon.spy()

    const hoverStartTime = 50
    const hoverStayTime = 100

    class App extends React.Component {
      state = {
        hoverStartTime,
        hoverStayTime
      }

      render () {
        const {
          hoverStartTime,
          hoverStayTime
        } = this.state
        return (
          <Button
            ref={ref}
            size="fuck"
            hoverStartTime={hoverStartTime}
            hoverStayTime={hoverStayTime}
            onClick={() => {
              clickSpy()
            }}
            onTouchStart={() => {
              touchStartSpy()
            }}
            onTouchEnd={() => touchEndSpy()}
          >
            button
          </Button>
        )
      }
    }

    React.render(<App />, scratch)

    /**
     * @type {HTMLElement}
     */
    const node = ref.current

    await waitForChange(node)
    assert(node.hoverStartTime === hoverStartTime)
    assert(node.hoverStayTime === hoverStayTime)
    assert(node.hoverClass === 'button-hover')
    /**
     * @type {HTMLButtonElement}
     */
    const button = node.children[0]
    button.click()
    assert(clickSpy.callCount === 1)

    fireTouchEvent(button, 'touchstart')
    assert(touchStartSpy.callCount === 1)
    await delay(hoverStartTime + 10)

    // assert(button.classList.contains('button-hover'))

    fireTouchEvent(button, 'touchend')
    await delay(hoverStayTime + 10)
    assert(button.classList.contains('button-hover') === false)
    assert(touchStartSpy.callCount === 1)
  })
})
