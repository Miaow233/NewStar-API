/**
 * pixelit - convert an image to Pixel Art, with/out grayscale and based on a color palette.
 * @author José Moreira @ <https://github.com/giventofly/pixelit>
 **/

const { createCanvas } = require('canvas')
const {
    CIEDE2000,
    CIEDE76,
    CIEDE94,
    cmc,
    euclidean1,
    euclidean2,
    euclidean3,
    isLightColor,
    RGB2Lab,
} = require('./color')

const ALGORITHMS = {
  CIE76: 'CIE76',
  CIE94: 'CIE94',
  CIE2000: 'CIE2000',
  Euclidean_1: 'Euclidean_1',
  Euclidean_2: 'Euclidean_2',
  Euclidean_3: 'Euclidean_3',
  CMC: 'CMC'
}

// Lab空间颜色算法
const LAB_ALGORITHMS = [ALGORITHMS.CIE76, ALGORITHMS.CIE94, ALGORITHMS.CIE2000, ALGORITHMS.CMC]

class Pixelit {
    constructor(config = {}) {
        // target for canvas
        this.drawto = config.to || document.getElementById('pixelitcanvas')
        // origin of uploaded image/src img
        this.drawfrom = config.from || document.getElementById('pixelitimg')
        // 相似颜色算法
        this.similarColorAlgorithm =
            config.similarColorAlgorithm || ALGORITHMS.CIE76
        // range between 0 to 100
        this.scale =
            config.scale && config.scale > 0 && config.scale <= 50
                ? config.scale * 0.01
                : 8 * 0.01

        // 调色板
        this.palettes = [
            [
                [7, 5, 5],
                [33, 25, 25],
                [82, 58, 42],
                [138, 107, 62],
                [193, 156, 77],
                [234, 219, 116],
                [160, 179, 53],
                [83, 124, 68],
                [66, 60, 86],
                [89, 111, 175],
                [107, 185, 182],
                [251, 250, 249],
                [184, 170, 176],
                [121, 112, 126],
                [148, 91, 40],
            ],
            [
                [13, 43, 69],
                [32, 60, 86],
                [84, 78, 104],
                [141, 105, 122],
                [208, 129, 89],
                [255, 170, 94],
                [255, 212, 163],
                [255, 236, 214],
            ],
            [
                [43, 15, 84],
                [171, 31, 101],
                [255, 79, 105],
                [255, 247, 248],
                [255, 129, 66],
                [255, 218, 69],
                [51, 104, 220],
                [73, 231, 236],
            ],
            [
                [48, 0, 48],
                [96, 40, 120],
                [248, 144, 32],
                [248, 240, 136],
            ],
            [
                [239, 26, 26],
                [172, 23, 23],
                [243, 216, 216],
                [177, 139, 139],
                [53, 52, 65],
                [27, 26, 29],
            ],
            [
                [26, 28, 44],
                [93, 39, 93],
                [177, 62, 83],
                [239, 125, 87],
                [255, 205, 117],
                [167, 240, 112],
                [56, 183, 100],
                [37, 113, 121],
                [41, 54, 111],
                [59, 93, 201],
                [65, 166, 246],
                [115, 239, 247],
                [244, 244, 244],
                [148, 176, 194],
                [86, 108, 134],
                [51, 60, 87],
            ],
            [
                [44, 33, 55],
                [118, 68, 98],
                [237, 180, 161],
                [169, 104, 104],
            ],

            [
                [171, 97, 135],
                [235, 198, 134],
                [216, 232, 230],
                [101, 219, 115],
                [112, 157, 207],
                [90, 104, 125],
                [33, 30, 51],
            ],
            [
                [140, 143, 174],
                [88, 69, 99],
                [62, 33, 55],
                [154, 99, 72],
                [215, 155, 125],
                [245, 237, 186],
                [192, 199, 65],
                [100, 125, 52],
                [228, 148, 58],
                [157, 48, 59],
                [210, 100, 113],
                [112, 55, 127],
                [126, 196, 193],
                [52, 133, 157],
                [23, 67, 75],
                [31, 14, 28],
            ],
            [
                [94, 96, 110],
                [34, 52, 209],
                [12, 126, 69],
                [68, 170, 204],
                [138, 54, 34],
                [235, 138, 96],
                [0, 0, 0],
                [92, 46, 120],
                [226, 61, 105],
                [170, 92, 61],
                [255, 217, 63],
                [181, 181, 181],
                [255, 255, 255],
            ],
            [
                [49, 31, 95],
                [22, 135, 167],
                [31, 213, 188],
                [237, 255, 177],
            ],
            [
                [21, 25, 26],
                [138, 76, 88],
                [217, 98, 117],
                [230, 184, 193],
                [69, 107, 115],
                [75, 151, 166],
                [165, 189, 194],
                [255, 245, 247],
            ],
        ]
        this.palette = this.palettes[config.palette || 0]
        this.maxHeight = config.maxHeight
        this.maxWidth = config.maxWidth
        this.ctx = this.drawto.getContext('2d')
        // save latest converted colors
        this.endColorStats = {}
        this.paletteMap = {}
        this.paletteLab = {}
        if (LAB_ALGORITHMS.includes(this.similarColorAlgorithm)) {
            this.palette
                .map((color) => RGB2Lab(...color))
                .forEach((color, idx) => {
                    this.paletteLab[this.palette[idx].join(',')] = color
                })
        }
    }

    /**
     * @param {string} src Change the src from the image element
     */
    setFromImgSource(src) {
        this.drawfrom.src = src
        return this
    }

    /**
     *
     * @param {elem} elem set element to read image from
     */
    setDrawFrom(elem) {
        this.drawfrom = elem
        return this
    }

    /**
     *
     * @param {elem} elem set element canvas to write the image
     */
    setDrawTo(elem) {
        this.drawto = elem
        return this
    }

    /**
     *
     * @param {array} arr Array of rgb colors: [[int,int,int]]
     */
    setPalette(arr) {
        this.palette = arr
        return this
    }

    /**
     *
     * @param {string} similarColorAlgorithm
     */
    setSimilarColorAlgorithm(similarColorAlgorithm) {
        this.similarColorAlgorithm = similarColorAlgorithm
        if (LAB_ALGORITHMS.includes(this.similarColorAlgorithm)) {
            this.paletteLab = {}
            this.palette
                .map((color) => RGB2Lab(...color))
                .forEach((color, idx) => {
                    this.paletteLab[this.palette[idx].join(',')] = color
                })
        }
    }

    /**
     *
     * @param {int} width set canvas image maxWidth
     */
    setMaxWidth(width) {
        this.maxWidth = width
        return this
    }

    /**
     *
     * @param {int} Height set canvas image maxHeight
     */
    setMaxHeight(height) {
        this.maxHeight = height
        return this
    }

    /**
     *
     * @param {int} scale set pixelate scale [0...50]
     */
    setScale(scale) {
        this.scale = scale > 0 && scale <= 50 ? scale * 0.01 : 8 * 0.01
        return this
    }

    /**
     *
     * @return {arr} of current palette
     */
    getPalette() {
        return this.palette
    }

    getPaletteMap() {
        return this.paletteMap
    }
    /**
     * color similarity between colors, lower is better
     * @param {array} color array of ints to make a color: [double,double,double]
     * @param {array} compareColor array of ints to make a color: [double,double,double]
     * @param {string} type type of color default rgb
     * @returns {number} limits [0-441.6729559300637]
     */
    colorSim(color, compareColor, type = 'RGB') {
        switch (this.similarColorAlgorithm) {
            case ALGORITHMS.Euclidean_1:
                return euclidean1(color, compareColor)
            case ALGORITHMS.Euclidean_2:
                return euclidean2(color, compareColor)
            case ALGORITHMS.Euclidean_3:
                return euclidean3(color, compareColor)
            case ALGORITHMS.CIE76:
                return CIEDE76(color, compareColor)
            case ALGORITHMS.CIE94:
                return CIEDE94(color, compareColor)
            case ALGORITHMS.CIE2000:
                return CIEDE2000(color, compareColor)
            case ALGORITHMS.CMC:
                return cmc(color, compareColor)
            default:
                return 0
        }
    }

    /**
     * given actualColor, check from the paletteColors the most aproximated color
     * @param {array} actualColor rgb color to compare [int,int,int]
     * @returns {array} aproximated rgb color
     */
    similarColor(actualColor) {
        let selectedColor = []
        let minSim = Infinity
        let type = 'RGB'
        if (
            [ALGORITHMS.CIE76, ALGORITHMS.CIE94, ALGORITHMS.CIE2000].includes(
                this.similarColorAlgorithm
            )
        ) {
            actualColor = RGB2Lab(...actualColor)
            type = 'Lab'
        }
        this.palette.forEach((color) => {
            let _color = color
            if (
                [
                    ALGORITHMS.CIE76,
                    ALGORITHMS.CIE94,
                    ALGORITHMS.CIE2000,
                ].includes(this.similarColorAlgorithm)
            ) {
                _color = this.paletteLab[color.join(',')]
            }
            const currSim = this.colorSim(actualColor, _color, type)
            if (currSim <= minSim) {
                selectedColor = color
                minSim = currSim
            }
        })
        return selectedColor
    }

    /**
     * pixelate based on @author rogeriopvl <https://github.com/rogeriopvl/8bit>
     * Draws a pixelated version of an image in a given canvas
     */
    pixelate() {
        this.drawto.width = this.drawfrom.naturalWidth
        this.drawto.height = this.drawfrom.naturalHeight

        let scaledW = this.drawto.width * this.scale
        let scaledH = this.drawto.height * this.scale

        // make temporary canvas to make new scaled copy
        const tempCanvas = createCanvas(this.drawto.width, this.drawto.height)

        // Set temp canvas width/height & hide (fixes higher scaled cutting off image bottom)
        // tempCanvas.width = this.drawto.width;
        // tempCanvas.height = this.drawto.height;
        // tempCanvas.style.visibility = "hidden";
        // tempCanvas.style.position = "fixed";
        // tempCanvas.style.top = "0";
        // tempCanvas.style.left = "0";

        //corner case of bigger images, increase the temporary canvas size to fit everything
        if (this.drawto.width > 800 || this.drawto.height > 800) {
            //fix sclae to pixelate bigger images
            this.scale *= 0.25
            scaledW = this.drawto.width * this.scale
            scaledH = this.drawto.height * this.scale
            //make it big enough to fit
            tempCanvas.width = Math.max(scaledW, scaledH) + 50
            tempCanvas.height = Math.max(scaledW, scaledH) + 50
        }
        // get the context
        const tempContext = tempCanvas.getContext('2d')
        // draw the image into the canvas
        tempContext.drawImage(this.drawfrom, 0, 0, scaledW, scaledH)
        // document.body.appendChild(tempCanvas);

        // configs to pixelate
        this.ctx.mozImageSmoothingEnabled = false
        this.ctx.webkitImageSmoothingEnabled = false
        this.ctx.imageSmoothingEnabled = false

        // draw to final canvas
        // https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/drawImage
        this.ctx.drawImage(
            tempCanvas,
            0,
            0,
            scaledW,
            scaledH,
            0,
            0,
            this.drawfrom.naturalWidth + Math.max(24, 25 * this.scale),
            this.drawfrom.naturalHeight + Math.max(24, 25 * this.scale)
        )
        // remove temp element
        // tempCanvas.remove();

        return this
    }

    /**
     * Converts image to grayscale
     */
    convertGrayscale() {
        const w = this.drawto.width
        const h = this.drawto.height
        var imgPixels = this.ctx.getImageData(0, 0, w, h)
        for (var y = 0; y < imgPixels.height; y++) {
            for (var x = 0; x < imgPixels.width; x++) {
                var i = y * 4 * imgPixels.width + x * 4
                var avg =
                    (imgPixels.data[i] +
                        imgPixels.data[i + 1] +
                        imgPixels.data[i + 2]) /
                    3
                imgPixels.data[i] = avg
                imgPixels.data[i + 1] = avg
                imgPixels.data[i + 2] = avg
            }
        }
        this.ctx.putImageData(
            imgPixels,
            0,
            0,
            0,
            0,
            imgPixels.width,
            imgPixels.height
        )
        return this
    }

    /**
     * converts image to palette using the defined palette or default palette
     */
    convertPalette() {
        const w = this.drawto.width
        const h = this.drawto.height
        var imgPixels = this.ctx.getImageData(0, 0, w, h)
        for (var y = 0; y < imgPixels.height; y++) {
            for (var x = 0; x < imgPixels.width; x++) {
                var i = y * 4 * imgPixels.width + x * 4
                //var avg = (imgPixels.data[i] + imgPixels.data[i + 1] + imgPixels.data[i + 2]) / 3;
                const finalcolor = this.similarColor([
                    imgPixels.data[i],
                    imgPixels.data[i + 1],
                    imgPixels.data[i + 2],
                ])
                imgPixels.data[i] = finalcolor[0]
                imgPixels.data[i + 1] = finalcolor[1]
                imgPixels.data[i + 2] = finalcolor[2]
            }
        }
        this.ctx.putImageData(
            imgPixels,
            0,
            0,
            0,
            0,
            imgPixels.width,
            imgPixels.height
        )
        return this
    }

    /**
     * Resizes image proportionally according to a max width or max height
     * height takes precedence if definied
     */
    resizeImage() {
        //var ctx = canvas.getContext("2d")
        const canvasCopy = createCanvas(this.drawto.width, this.drawto.height)
        const copyContext = canvasCopy.getContext('2d')
        let ratio = 1.0

        //if none defined skip
        if (!this.maxWidth && !this.maxHeight) {
            return 0
        }

        if (this.maxWidth && this.drawto.width > this.maxWidth) {
            ratio = this.maxWidth / this.drawto.width
        }
        //max height overrides max width
        if (this.maxHeight && this.drawto.height > this.maxHeight) {
            ratio = this.maxHeight / this.drawto.height
        }

        // canvasCopy.width = this.drawto.width;
        // canvasCopy.height = this.drawto.height;
        copyContext.drawImage(this.drawto, 0, 0)

        this.drawto.width = this.drawto.width * ratio
        this.drawto.height = this.drawto.height * ratio
        this.ctx.drawImage(
            canvasCopy,
            0,
            0,
            canvasCopy.width,
            canvasCopy.height,
            0,
            0,
            this.drawto.width,
            this.drawto.height
        )

        return this
    }

    /**
     * draw to canvas from image source and resize
     *
     */
    draw() {
        //draw image to canvas
        this.drawto.width = this.drawfrom.width
        this.drawto.height = this.drawfrom.height
        //draw
        this.ctx.drawImage(this.drawfrom, 0, 0)
        //resize is always done
        this.resizeImage()
        return this
    }

    /**
     * 画分割线
     * @return {Pixelit}
     */
    drawLine() {
        const w = this.drawto.width
        const h = this.drawto.height
        const unit = this.drawto.width / this.pixelW
        var imgPixels = this.ctx.getImageData(0, 0, w, h)
        this.ctx.strokeStyle = 'black'
        this.ctx.lineWidth = 1
        for (var y = unit; y < imgPixels.height; y += unit) {
            this.ctx.beginPath()
            this.ctx.moveTo(0, y)
            this.ctx.lineTo(w, y)
            this.ctx.stroke()
        }
        for (var x = unit; x < imgPixels.width; x += unit) {
            this.ctx.beginPath()
            this.ctx.moveTo(x, 0)
            this.ctx.lineTo(x, h)
            this.ctx.stroke()
        }
        return this
    }

    /**
     * 填充数字
     * @return {Pixelit}
     */
    fillNumbers() {
        const containColorKeys = Object.keys(this.paletteMap)
        if (containColorKeys.length > 0) {
            const colors = this.palette.filter((c) =>
                containColorKeys.includes(c.join(','))
            )
            const unit = this.drawto.width / this.pixelW
            this.ctx.font = `${Math.floor(unit * 0.8)}px sans-serif`
            this.ctx.textBaseline = 'middle'
            this.ctx.textAlign = 'center'
            const offset = 1
            for (let i = 0; i < colors.length; i++) {
                const c = colors[i]
                const k = c.join(',')
                this.ctx.fillStyle = isLightColor(c[0], c[1], c[2])
                    ? '#000'
                    : '#fff'
                for (let j = 0; j < this.paletteMap[k].length; j++) {
                    const x = this.paletteMap[k][j] % this.pixelW
                    const y = Math.floor(this.paletteMap[k][j] / this.pixelW)
                    this.ctx.fillText(
                        `${i + 1}`,
                        x * unit + unit / 2,
                        y * unit + unit / 2 + offset,
                        unit
                    )
                }
            }
        }
        return this
    }

    /**
     * 统计颜色数量
     */
    statistics() {
        const containColorKeys = Object.keys(this.paletteMap)
        const colors = this.palette.filter((c) =>
            containColorKeys.includes(c.join(','))
        )
        return colors.map((c, index) => {
            const k = c.join(',')
            return {
                no: index + 1,
                color: k,
                count: this.paletteMap[k].length,
                isLightColor: isLightColor(...c),
            }
        })
    }

    /**
     * Save image from canvas
     */
    saveImage() {
        const link = document.createElement('a')
        link.download = 'pxArt.png'
        link.href = this.drawto
            .toDataURL('image/png')
            .replace('image/png', 'image/octet-stream')
        document.querySelector('body').appendChild(link)
        link.click()
        document.querySelector('body').removeChild(link)
    }

    //end class
}

module.exports = Pixelit;