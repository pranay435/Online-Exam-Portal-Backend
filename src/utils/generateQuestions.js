function generateQuestions(count, min, max) {
    const set = new Set();
    while (set.size < count) {
        const id = Math.floor(Math.random() * (max - min + 1)) + min;
        set.add(id);
    }
    return Array.from(set);
}

module.exports = generateQuestions