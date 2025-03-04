// Загружаем AI-модель для анализа смысла текста
async function loadModel() {
    const model = await use.load();
    return model;
}

// Глобальная переменная для модели
let modelPromise = loadModel();

// Функция для обработки текста
async function processText() {
    let inputText = document.getElementById("inputText").value;
    if (inputText.trim() === "") {
        alert("Введите текст!");
        return;
    }

    // Загружаем модель
    const model = await modelPromise;

    // Анализируем смысл текста
    const embeddings = await model.embed([inputText]);
    const vector = embeddings.arraySync()[0];

    // Генерируем новый текст (здесь можно доработать AI-алгоритм)
    let newText = smartRewrite(inputText, vector);

    // Выводим результат
    document.getElementById("outputText").value = newText;
}

// Функция "умного" рерайта текста
function smartRewrite(text, vector) {
    let words = text.split(" ");
    let synonyms = {
        "проект": "инициатива",
        "разработка": "создание",
        "важно": "значительно",
        "вопрос": "аспект",
        "решение": "выбор",
        "данные": "информация",
        "работа": "деятельность",
        "процесс": "ход работы",
        "использование": "применение",
        "метод": "способ"
    };

    let newWords = words.map(word => synonyms[word.toLowerCase()] || word);

    // Перестановка частей текста для уникальности
    if (newWords.length > 5) {
        let temp = newWords[0];
        newWords[0] = newWords[newWords.length - 1];
        newWords[newWords.length - 1] = temp;
    }

    return newWords.join(" ");
}