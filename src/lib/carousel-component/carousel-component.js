import React, { Component } from 'react'
import PropTypes from 'prop-types'
import carouselStyle from './carousel-component.module.scss'

export class CarouselComponent extends Component {
  called = false
  constructor(props) {
    super(props)
    console.log(this.props.children)
    this.called = false
    this.children = this.props.children.map((el, id) =>
      React.cloneElement(el, {
        draggable: 'false',
        key: id,
        className:
          (el.props.className || '') + ' ' + carouselStyle.carousel_elements,
        ref: el.ref ? el.ref : React.createRef()
      })
    )
    this.state = {
      start: null,
      swiping: false,
      scrolled: false,
      ref: React.createRef(),
      index: 0,
      childrenRefs: this.children.map((el) => el.ref),
      size: null,
      length:
        this.props.length > this.props.children.length
          ? this.props.children.length
          : this.props.length || this.props.children.length,
      calculatedSize: [],
      call: 0,
      eventListener: { mouse: null, touch: null },
      ...this.setAlignment()
    }
    this.endSwipe = this.endSwipe.bind(this)
    this.startSwipe = this.startSwipe.bind(this)
    this.swipe = this.swipe.bind(this)
  }

  setAlignment() {
    let leftMargin
    let rightMargin
    let padding = 0
    if (typeof this.props.align === 'object') {
      leftMargin = this.props.align.first || 'center'
      rightMargin = this.props.align.last || 'center'
      padding = this.props.align.nth || 'center'
    } else {
      switch (this.props.align) {
        case 'left':
          leftMargin = 'left'
          rightMargin = 'left'
          padding = 'left'
          break
        case 'right':
          leftMargin = 'right'
          rightMargin = 'right'
          padding = 'right'
          break
        default:
          leftMargin = 'center'
          rightMargin = 'center'
          padding = 'center'
      }
    }
    return { leftMargin, rightMargin, padding }
  }

  startSwipe(e) {
    // eslint-disable-next-line no-extra-parens
    const x = e.clientX || (e.touches !== undefined && e.touches[0].clientX)
    const mouse = document.addEventListener('mousemove', this.swipe)
    const touch = document.addEventListener('touchmove', this.swipe)
    this.setState({
      ...this.state,
      swiping: true,
      start: x,
      eventListener: { mouse, touch }
    })
  }

  swipe(e) {
    // eslint-disable-next-line no-extra-parens
    const x = e.clientX || (e.touches !== undefined && e.touches[0].clientX)
    let { swiping, scrolled, ref, index, start, calculatedSize } = this.state
    if (start) {
      if (swiping && !scrolled && x !== start) {
        index += -Math.sign(x - start)
        // eslint-disable-next-line no-nested-ternary
        index =
          index >= this.state.length
            ? 0
            : index < 0
            ? this.state.length - 1
            : index
        // eslint-disable-next-line no-mixed-operators
        ref.current.scroll({
          left:
            this.state.padding === 'left'
              ? calculatedSize[index].x
              : this.state.padding === 'right'
              ? calculatedSize[index].x -
                this.state.size.width +
                calculatedSize[index].width
              : calculatedSize[index].x -
                (this.state.size.width - calculatedSize[index].width) / 2,
          behavior: 'smooth'
        })
        this.setState({ ...this.state, scrolled: true, index: index })
      }
    }
  }

  endSwipe() {
    this.setState({
      ...this.state,
      swiping: false,
      scrolled: false,
      start: undefined
    })
    document.removeEventListener('mousemove', this.swipe)
    document.removeEventListener('touchmove', this.swipe)
  }

  componentDidMount() {
    document.addEventListener('mouseup', this.endSwipe)
    document.addEventListener('touchend', this.endSwipe)

    this.setState({ ...this.state })
  }

  componentDidUpdate() {
    // Añadir un detector de resize
    if (!this.called || this.state.call === 1) {
      this.called = true
      let preValue = ''
      const interval = setInterval(() => {
        try {
          const currValue = JSON.stringify(
            this.state.childrenRefs[0].current.getBoundingClientRect()
          )
          if (preValue === currValue) {
            clearInterval(interval)
            this.setState({
              ...this.state,
              size: this.state.ref.current.getBoundingClientRect(),
              calculatedSize: this.state.childrenRefs.map((el) =>
                el.current.getBoundingClientRect()
              ),
              call: this.state.call + 1
            })
          }
          preValue = currValue
        } catch (e) {
          clearInterval(interval)
          throw new Error('Please provide children to the carousel')
        }
      }, 100)
    }
  }

  render() {
    return (
      <div
        className={carouselStyle.app_carousel}
        ref={this.state.ref}
        onMouseDown={this.startSwipe}
        onMouseUp={this.endSwipe}
        onTouchStart={this.startSwipe}
        onTouchEnd={this.endSwipe}
        draggable='false'
        style={{
          visibility: this.state.calculatedSize.length ? 'visible' : 'hidden'
        }}
      >
        {this.state.calculatedSize.length && (
          <div
            style={{
              minWidth:
                this.state.leftMargin === 'left'
                  ? '0px'
                  : this.state.leftMargin === 'right'
                  ? this.state.size.width - this.state.calculatedSize[0].width
                  : (this.state.size.width -
                      this.state.calculatedSize[0].width) /
                    2
            }}
          />
        )}
        {this.children.map((el, i) =>
          React.cloneElement(el, {
            className:
              (el.props.className || '') +
              (i === this.state.index ? ' selected' : ''),
            style: {
              ...el.style,
              marginRight:
                this.props.margin !== undefined
                  ? i === this.state.length - 1
                    ? 0
                    : this.props.margin
                  : ''
            }
          })
        )}
        {this.state.length - 1 && this.state.calculatedSize.length && (
          <div
            style={{
              minWidth:
                this.state.rightMargin === 'right'
                  ? '0px'
                  : this.state.rightMargin === 'right'
                  ? (this.state.size.width -
                      this.state.calculatedSize[0].width) /
                    2
                  : this.state.size.width - this.state.calculatedSize[0].width
            }}
          />
        )}
      </div>
    )
  }
}

CarouselComponent.defaultProps = {
  align: { first: 'left', last: 'right', nth: 'center' }
}

CarouselComponent.propTypes = {
  children: PropTypes.oneOfType([PropTypes.array, PropTypes.node]).isRequired,
  align: PropTypes.oneOfType([
    PropTypes.oneOf(['left', 'right', 'center']),
    PropTypes.shape({
      first: PropTypes.oneOf(['left', 'right', 'center']),
      last: PropTypes.oneOf(['left', 'right', 'center']),
      nth: PropTypes.oneOf(['left', 'right', 'center'])
    })
  ]).isRequired,
  length: PropTypes.number,
  margin: PropTypes.number
}
export default CarouselComponent
