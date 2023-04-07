const cols = document.querySelectorAll('.col');

document.addEventListener('keydown', (event) => {
    event.preventDefault()
    if (event.code.toLowerCase() === 'space') {
        setRandomColors();
    } 
})

document.addEventListener('click', (event) => {
    const type = event.target.dataset.type;
    
    if (type === 'lock') {
        const node = event.target.tagName.toLowerCase() === 'i'
            ? event.target
            : event.target.children[0];

        node.classList.toggle('fa-lock-open')
        node.classList.toggle('fa-lock')
    } else if (type === 'copy') {
        copyToClickBoard(event.target.textContent);

        new Toast({
            title: 'Уведомление',
            text: 'Цвет скопирован в буфер обмена',
            theme: 'light',
            autohide: true,
            interval: 3000
        });
    }
})

function copyToClickBoard(text) {
    return navigator.clipboard.writeText(text);
}

function setRandomColors(isInitial) {
    const colors = isInitial ? getColorsFromHash() : [];

    cols.forEach((col, index) => {
        const isLocked = col.querySelector('i').classList.contains('fa-lock');
        const title = col.querySelector('h2');
        const button = col.querySelector('button');

        if (isLocked) {
            colors.push(title.textContent);
            return;
        }

        const color = isInitial 
            ? colors[index] 
                ? colors[index] 
                : chroma.random()
            : chroma.random();

        if (!isInitial) {
            colors.push(color);
        }
        
        title.textContent = color;
        col.style.background = color

        setTextColor(title, color);
        setTextColor(button, color);
    })

    updateColorsHash(colors);
}

function setTextColor(object, color) {
    const luminance = chroma(color).luminance()
    object.style.color = luminance > 0.5 ? 'black' : 'white';
}

function updateColorsHash(colors = []) {
    document.location.hash = colors
        .map((col) => {
        return col.toString().substring(1)
        })
        .join('-')
}

function getColorsFromHash() {
    if (document.location.hash.length > 1) {
        return document.location.hash
            .substring(1)
            .split('-')
            .map(color => '#' + color);
    }
    return [];
}

setRandomColors(true)

new Toast({
    title: 'Уведомление',
    text: 'Пробел - поменять цвета',
    theme: 'light',
    autohide: true,
    interval: 3000
});