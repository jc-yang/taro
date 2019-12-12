import './polyfill'
import * as React from 'nervjs'
import { Audio } from '../h5'
import { waitForChange } from './utils'
import * as assert from 'assert'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const h = React.createElement

describe('Audio', () => {
  /**
   * @type {HTMLElement}
   */
  let scratch

  beforeAll(async () => {
    scratch = document.createElement('div')
    document.body.appendChild(scratch)
  })

  beforeEach(async () => {
    scratch = document.createElement('div')
    document.body.appendChild(scratch)
  })

  afterAll(async () => {
    scratch.parentNode.removeChild(scratch)
    scratch = null
  })

  it('props', async () => {
    const ref = React.createRef()

    const src = 'src'
    const controls = true
    const loop = true

    /**
     * @type {import('react').ReactInstance}
     */
    let instance

    class App extends React.Component {
      state = {
        src,
        controls,
        loop
      }

      constructor (props) {
        super(props)
        instance = this
      }

      render () {
        const {
          src,
          controls,
          loop
        } = this.state
        return <Audio ref={ref} src={src} controls={controls} loop={loop} />
      }
    }

    React.render(<App />, scratch)

    /**
     * @type {HTMLElement}
     */
    const node = ref.current

    await waitForChange(node)

    /**
     * @type {HTMLAudioElement}
     */
    const audio = node.childNodes[0]
    assert(audio instanceof HTMLAudioElement)
    assert(audio.src === location.origin + '/' + src)
    assert(audio.controls === controls)
    assert(audio.loop === loop)

    instance.setState({
      controls: false,
      loop: false
    })
    await waitForChange(audio)
    assert(audio.controls === false)
    assert(audio.loop === false)
  })
})
