let brightFilter = document.querySelector("#brightness");
let brightValue = document.getElementById('BrightValue');
let contrastFilter = document.querySelector("#contrast");
let contrastValue = document.getElementById('ContrastValue');
let imgLoader = document.querySelector("#imgLoader");
imgLoader.addEventListener('change', createImg, false);

let canvas = document.querySelector("#canvas");
let ctx = canvas.getContext('2d');

function createImg(e) {
    let fileReader = new FileReader();

    fileReader.onload = function (event) {
        let img = new Image();

        img.onload = function () {
            canvas.width = img.width;
            canvas.height = img.height;

            ctx.drawImage(img, 0, 0);
        }
        img.src = event.target.result;
    }
    fileReader.readAsDataURL(e.target.files[0]);
}

brightFilter.addEventListener('change', function (event) {
    var imgData;

    brightValue.innerText = event.currentTarget.value;


    imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    doBrightness(imgData.data, parseInt(brightFilter.value, 10));

    ctx.putImageData(imgData, 0, 0);
});


function doBrightness(data, brightness) {
    for (let i = 0; i < data.length; i += 4) {
        data[i] += 255 * (brightness / 100);
        data[i + 1] += 255 * (brightness / 100);
        data[i + 2] += 255 * (brightness / 100);
    }
}



contrastFilter.addEventListener('change', function (event) {
    var imgData;

    contrastValue.innerText = event.currentTarget.value;

    imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    doContrast(imgData.data, parseInt(contrastFilter.value, 10));
    ctx.putImageData(imgData, 0, 0);
});

function settingColor(value) {
    if (value < 0) {
        value = 0;
    } else if (value > 255) {
        value = 255;
    }
    return value;
}

function doContrast(data, contrast) {
    let param = (259.0 * (contrast + 255.0)) / (255.0 * (259.0 - contrast))

    for (let i = 0; i < data.length; i += 4) {
        data[i] = settingColor(param * (data[i] - 128.0) + 128.0);
        data[i + 1] = settingColor(param * (data[i + 1] - 128.0) + 128.0);
        data[i + 2] = settingColor(param * (data[i + 2] - 128.0) + 128.0);
    }
}
let invertFilter = document.querySelector("#invert");

invertFilter.addEventListener('click', function () {
    let imgData = ctx.getImageData(0, 0, canvas.width, canvas.height)

    doInvert(imgData.data, parseInt(invertFilter.value, 10));
    ctx.putImageData(imgData, 0, 0);
})


function doInvert(data) {

    for (var i = 0; i < data.length; i += 4) {
        data[i] = (data[i] ^ 255);
        data[i + 1] = (data[i + 1] ^ 255);
        data[i + 2] = (data[i + 2] ^ 255);

    }
}
let radius = 10,
    dragging = false;

ctx.lineWidth = radius * 2

let putPoint = function (e) {
    if (dragging) {
        ctx.lineTo(e.offsetX, e.offsetY);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(e.offsetX, e.offsetY, radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(e.offsetX, e.offsetY);
    }
};

let engage = function (e) {
    dragging = true
    putPoint(e)
};

let disengage = function (e) {
    dragging = false
    ctx.beginPath()
};

function layout() {
    let image = ctx.getImageData(0, 0, canvas.width, canvas.height)
    ctx.putImageData(image, 0, 0)
    ctx.lineWidth = radius * 2

}

window.addEventListener('resize', layout, false)
canvas.addEventListener('mousedown', engage, false)
canvas.addEventListener('mousemove', putPoint, false)
canvas.addEventListener('mouseup', disengage, false)
canvas.addEventListener('mouseout', disengage, false)
let minRad = 5,
    maxRad = 100,

    defaultRad = 10,
    interval = 5,
    radSpan = document.getElementById('radval'),
    decRad = document.getElementById('decrad'),
    incRad = document.getElementById('incrad')

var setRadius = function (newRadius) {
    if (newRadius < minRad || newRadius == undefined) {
        newRadius = minRad;
    } else if (newRadius > maxRad) {
        newRadius = maxRad
    }
    radius = newRadius;
    ctx.lineWidth = radius * 2
    radSpan.innerHTML = radius
};

decRad.addEventListener('click', function () {
    setRadius(radius - interval)
}, false);

incRad.addEventListener('click', function () {
    setRadius(radius + interval)
}, false)

setRadius(defaultRad)