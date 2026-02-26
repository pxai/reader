// sample.js
import fs from "fs";

async function downloadRandomWords(wordCount = 3000) {
  try {
    const randomPage = Math.floor(Math.random() * 200) + 1;

    const res = await fetch(`https://gutendex.com/books/?page=${randomPage}`);
    const data = await res.json();

    const book = data.results[Math.floor(Math.random() * data.results.length)];

    const textUrl =
      book.formats["text/plain; charset=utf-8"] ||
      book.formats["text/plain"];

    if (!textUrl) {
      console.log("No text available");
      return;
    }

    console.log("Downloading from:", book.title);

    const textRes = await fetch(textUrl);
    let text = await textRes.text();

    // Remove Gutenberg header/footer if present
    const start = text.indexOf("*** START");
    const end = text.indexOf("*** END");

    if (start !== -1 && end !== -1) {
      text = text.slice(start, end);
    }

    text = text.replace(/\s+/g, " ").trim();

    const words = text.split(" ");

    if (words.length <= wordCount) {
      console.log("Book too short");
      return;
    }

    const startIndex = Math.floor(Math.random() * (words.length - wordCount));
    const selectedWords = words.slice(startIndex, startIndex + wordCount);

    const output = selectedWords.join(" ");

    fs.writeFileSync("random_words.txt", output);

    console.log(
      `Saved ${selectedWords.length} words from "${book.title}"`
    );

  } catch (err) {
    console.error(err);
  }
}

downloadRandomWords(3000);
