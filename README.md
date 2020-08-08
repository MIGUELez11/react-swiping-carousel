# react-swiping-carousel

> A hackable carousel for react (mobile and desktop)

[![NPM](https://img.shields.io/npm/v/react-swiping-carousel.svg)](https://www.npmjs.com/package/react-swiping-carousel) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install react-swiping-carousel
```

## Usage

```jsx
import React, { Component } from 'react'

import CarouselComponent from 'react-swiping-carousel'

class Example extends Component {
  render() {
    return (
		<CarouselComponent>
			<div>
				<p>You can insert any tag as child</p>
			</div>
			<p>Even a lonely p</p>
			<img src="" alt="Or an image">
		</CarouselComponent>
	)
  }
}
```

The Carousel will expand 100% of its parent, then will calculate the space of each child and `voilá magic`

I'm currently working on detect windows resizes and/or element size rescaling for making the component fully responsive

## Flags

The Carousel have some flags which provide you some customization:

|FlagName|Values|Action|
|--|--|--|
|align|"left"/"center"/"right"|This sets the alignment for the selected item|
|align|{first: "left"/"center"/"right", last: "left"/"center"/"right", nth: "left"/"center"/"right"}|This sets the alignment for the first element, the last and the selected item|
|length|integer|The number of items to use as swipeable|
|margin|float|The space between items|

## License

MIT © [MIGUELez11](https://github.com/MIGUELez11)
