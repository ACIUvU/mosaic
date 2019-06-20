/**
 * Create a function that creates a new point on each invocation.
 *创建一个函数，该函数在每次调用时创建一个新点。
 *
 * Based on https://www.jasondavies.com/poisson-disc/
 *
 * @param width
 * @param height
 * @param radius Radius of the sampling circle.
 */
function poissonDiscSampler(width, height, radius) {
	// Maximum number of samples before rejection.
    //拒收前的最大样本量
	var k = 10,
			radius2 = radius * radius,
			R = 3 * radius2,
			cellSize = radius * Math.SQRT1_2,
			gridWidth = Math.ceil(width / cellSize),
			gridHeight = Math.ceil(height / cellSize),
			// Create an array containing every pixel in the grid.
            //创建一个包含网格中的每个像素的数组。
			// Index = y * gridWidth + x (i.e. read pixels left to right like a book).
            //Index = y * gridWidth + x(即像阅读一本书一样从左到右阅读像素)。
			grid = new Array(gridWidth * gridHeight),
			queue = [],
			queueSize = 0,
			sampleSize = 0;

	/**
	 * Create a sample, or do nothing if no more samples can be made.
	 *创建一个样本，如果没有更多的示例，则什么也不做
	 * @return {mixed}
	 */
	return function() {
		// If there are no samples yet (first time through), create a sample in the middle.
        //如果还没有样本(第一次通过)，在中间创建一个样本。
		if (!sampleSize) {
			return sample(width / 2, height /2 );
		}

		while (queueSize) {
			// Select an active sample to create a new sample from.
            //选择一个活动样例来创建一个新的样例。
			var i = Math.random() * queueSize | 0,
					s = queue[i];

			/*
			 * Attempt to make a new sample from candidate points
             * 尝试从候选点生成一个新的样本
			 * between [radius, 2 * radius] from the sample.
             * 在[半径，2 *半径]之间。
			 */
			for (var j = 0; j < k; ++j) {
				var a = 2 * Math.PI * Math.random(),
						r = Math.sqrt(Math.random() * R + radius2),
						x = s[0] + r * Math.cos(a),
						y = s[1] + r * Math.sin(a);

				/*
				 * Reject candidates that are outside the allowed extent,
				 * or closer than 2 * radius to any existing sample.
				 * 拒绝超出允许范围的候选人，或距离任何现有样本的半径小于2 *。
				 * This is the heart of Poisson-Disc.
				 */
				if (0 <= x && x < width && 0 <= y && y < height && far(x, y) ) {
					return sample(x, y);
				}
			}

			/*
			 * No candidates were good enough, deactivate the sample.
             * 没有候选人足够好，停用样本。
			 */
			queue[i] = queue[--queueSize];
			queue.length = queueSize;
		}
	};

	/**
	 * Whether a coordinate is far enough from other existing points.
	 * 坐标是否与其他现有点足够远。
	 * @param  {[type]} x [description]
	 * @param  {[type]} y [description]
	 * @return {[type]}   [description]
	 */
	function far(x, y) {
		var i = x / cellSize | 0,
				j = y / cellSize | 0,
				i0 = Math.max(i - 2, 0),
				j0 = Math.max(j - 2, 0),
				i1 = Math.min(i + 3, gridWidth),
				j1 = Math.min(j + 3, gridHeight);

		for (j = j0; j < j1; ++j) {
			var o = j * gridWidth;
			for (i = i0; i < i1; ++i) {
				if (s = grid[o + i]) {
					var s,
							dx = s[0] - x,
							dy = s[1] - y;
					if (dx * dx + dy * dy < radius2) return false;
				}
			}
		}

		return true;
	}

	/**
	 * Create a sample at an x,y coordinate.
	 * 在xy坐标处创建一个示例。
	 * @param  {Number} x
	 * @param  {Number} y
	 * @return {Array}
	 */
	function sample(x, y) {
		var s = [x, y];
		// Push the point onto the queue.
        // 将该点推入队列
		queue.push(s);
		grid[gridWidth * (y / cellSize | 0) + (x / cellSize | 0)] = s;
		++sampleSize;
		++queueSize;
		return s;
	}
}


//!!!!
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
emojiMap = loadEmojis();
emojiInts = emojiPoints();

function loadEmojis(){
    var colorMap = {};
    for (var i=0; i<emojiColors.length; i++){
        if ( emojiColors[i] == 'false' ) {
            continue;
        }
        fileNumber = pad(i+1 , 4);
        img = './resized-emoji-images/' + fileNumber + '.png';
        colorMap[emojiColors[i]] = img
    }
    return colorMap;
}

function pad(num, size) { return ('000' + num).substr(-size); }


/*
 * For a given RGB color, find the closest match Emoji.
 *
 * @param  {array}  RGB color value.
 * @return {string} Emoji filepath.
 */
var closestEmoji = function(color) {
    var distance = 99999999;
    var c, d, p;
    for (var i=0; i<emojiInts.length; i++){
        p = emojiInts[i];
        d = Math.sqrt( Math.pow((color[0]-p[0]), 2) + Math.pow((color[1]-p[1]), 2) + Math.pow((color[2]-p[2]), 2) );
        if (d < distance){
            distance = d;
            c = p[3];
        }
    }
    return emojiMap[c];
}

function emojiPoints(){
    var pointArray = [];
    var c, r, g, b;
    for (var i=0; i<emojiColors.length; i++){
        c = emojiColors[i];
        r = parseInt("0x"+c.substr(1,2));
        g = parseInt("0x"+c.substr(3,2));
        b = parseInt("0x"+c.substr(5,2));
        pointArray.push([r, g, b, c]);
    }
    return pointArray;
}

/**
 * Create a new Emoji Mosaic.
 *
 * @param {string} dataURI
 */
function EmojiMosaic(dataURI) {
    var img = this.img = new Image;
    this.dataURI = dataURI;
    img.addEventListener( 'load', this.imageLoaded.bind( this ) );
    img.src = this.dataURI;
}

/**
 * After the image is loaded, create the layout.
 */
EmojiMosaic.prototype.imageLoaded = function() {
    var margin,
            width,
            height,
            createSample,
            samples,
            ratio;
    margin = 100;
    // If the image is too big, make the dimensions smaller.
    ratio = ( window.innerWidth ) / ( this.img.width + margin * 2 );
    this.img.height *= ratio;
    this.img.width *= ratio;
    // A canvas element for extracting image pixel color data.
    this.extractionCanvas = document.createElement('canvas');
    this.extractionCanvas.width = this.img.width;
    this.extractionCanvas.height = this.img.height;
    this.extractionCanvasContext = this.extractionCanvas.getContext('2d');
    this.extractionCanvasContext.drawImage(this.img, 0, 0, this.extractionCanvas.width, this.extractionCanvas.height );

    var saveButton = document.createElement( 'a' );
    saveButton.innerHTML = 'Save as image';
    document.body.appendChild(saveButton);
    var self = this;

    // A canvas element that will be drawn to with Emoji.
    this.targetCanvas = document.createElement('canvas');
    this.targetCanvas.width = this.extractionCanvas.width + margin * 2;
    this.targetCanvas.height = this.extractionCanvas.height + margin * 2;

    this.targetCanvasContext = this.targetCanvas.getContext('2d');

    // Fill a background.
    this.targetCanvasContext.fillStyle = '#ffffff';
    this.targetCanvasContext.fillRect( 0, 0, this.targetCanvas.width, this.targetCanvas.height );

    document.body.appendChild(this.targetCanvas);
    //调配emoji间距的关键点！！！
    createSample = poissonDiscSampler(this.targetCanvas.width, this.targetCanvas.height, 8);
    samples = [];

    // Create an array of samples (x,y coordinates) to place Emoji in.
    //创建一个样本数组(x,y坐标)来放置表情符号。
    while (true) {
        var s = createSample();
        // If no new sample was can be made, all samples have been created.
        //如果不能生成新的样本，则创建所有的样本。
        if (!s) break;

        // Bail if the sample is out of bounds.
        //如果样品超出界限，请保释。
        if ( s[0] < margin || s[1] < margin ) {
            continue;
        }
        if ( s[0] > this.targetCanvas.width - margin || s[1] > this.targetCanvas.height - margin ) {
            continue;
        }
        samples.push(s);
    }

    var emojisRendered = 0;

    // At each sample, place an Emoji according to the image data at that point.
    //在每个样本中，根据当时的图像数据放置一个表情符号。
    samples.forEach(function(sample){
        var imageData, sums, i, red, green, blue, closest;
        // Get image pixel data.
        //获取图像像素数据。
        imageData = this.extractionCanvasContext.getImageData(Math.round( sample[0] - margin ), Math.round( sample[1] - margin ), 1, 1);

        // Get average color data for an area.
        //获取一个区域的平均颜色数据。
        sums = { red: 0, green: 0, blue: 0 };
        for ( i = 0; i < imageData.data.length; i++ ) {
            switch ( i % 4 ) {
                case 0:
                    sums.red += imageData.data[i];
                break;
                case 1:
                    sums.green += imageData.data[i];
                break;
                case 2:
                    sums.blue += imageData.data[i];
                break;
            }
        }
        red = sums.red / ( imageData.data.length / 4 );
        green = sums.green / ( imageData.data.length / 4 );
        blue = sums.blue / ( imageData.data.length / 4 );

        closest = closestEmoji( [ red, green, blue ] );

        emojiImage = new Image();
        emojiImage.src = closest;
        emojiImage.setAttribute('data-x', (sample[0] - 10 ) );
        emojiImage.setAttribute('data-y', (sample[1] - 10 ) );
        // After the image is loaded, draw it onto the canvas.
        //加载图像后，将其绘制到画布上。
        emojiImage.onload = (function(event){
            var image = event.target;
            this.targetCanvasContext.save();
            this.targetCanvasContext.translate( image.getAttribute('data-x'), image.getAttribute('data-y') );
            this.targetCanvasContext.rotate( Math.ceil( Math.random() * 360 ) * Math.PI / 180 );
            this.targetCanvasContext.drawImage( image, -15, -15, 30, 30 );
            this.targetCanvasContext.restore();
            emojisRendered++;
            if ( emojisRendered === samples.length ) {
                var canvasDataURI = self.targetCanvas.toDataURL('image/jpeg'),
                    blob = dataURItoBlob(canvasDataURI),
                    url = window.URL.createObjectURL(blob),
                    a = document.querySelector('a');
                a.href = url;
                a.download = 'emoji-mosaic.jpg';
            }
        }).bind(this);
    }, this );
}

function dataURItoBlob(dataURI) {
    var binary = atob(dataURI.split(',')[1]);
    var array = [];
    for(var i = 0; i < binary.length; i++) {
        array.push(binary.charCodeAt(i));
    }
    return new Blob([new Uint8Array(array)], {type: 'image/jpeg'});
}
