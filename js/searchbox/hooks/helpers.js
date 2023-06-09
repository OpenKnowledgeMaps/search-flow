const {createElement: e} = React;

// make bold searching word in the text and return ready result
function highlightWorld(text, word) {

    if (text.toString().toLowerCase().includes(word.toString().toLowerCase())) {
        // Find the index of the first occurrence of the word
        const index = text.toLowerCase().indexOf(word.toLowerCase());

        // If the word is not found, return the original string in an array
        if (index === -1) {
            return text;
        }

        // If the word is at the beginning of the string, return two parts
        if (index === 0) {
            return e(
                "span", {}, e("span", {style: {fontWeight: 800}}, text.slice(0, word.length)), text.slice(word.length)
            )
        }

        // Split the string into 3 parts iw word in the middle
        return e(
            "span", {}, text.slice(0, index), e("span", {style: {fontWeight: 800}}, text.slice(index, index + word.length)),
            text.slice(index + word.length)
        )
    }
    return text;
}

export default highlightWorld;


// cut string to needed length and add '...' at the end
export function cutString(str, length) {
    if (str.length > length) {
        return str.substring(0, length) + '... ';
    }
    return str;
}

