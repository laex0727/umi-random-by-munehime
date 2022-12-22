const fs = require("fs");
const request = require("request");

const SEGA_JACKET_BASE_URL = "https://maimaidx-eng.com/maimai-mobile/img/Music";
const categories = {
    0: "POPS＆ANIME",
    1: "niconico＆VOCALOID™",
    2: "東方Project",
    3: "GAME＆VARIETY",
    4: "maimai",
    5: "オンゲキ＆CHUNITHM",
};

const configJson = require("fs").readFileSync("./config.json", "utf8");
const config = JSON.parse(configJson);


const songsJson = require("fs").readFileSync("./songs.json", "utf8");
const songs = JSON.parse(songsJson);

const currentRound = config.rounds.find((round) => round.abbreviation === config.currentRoundAbbreviation);
const filteredSongs = songs.filter((song) => song.charts.some((chart) => currentRound.levels.includes(chart.level)));

const song = filteredSongs[Math.floor(Math.random() * filteredSongs.length)];
const chart = song.charts.find((chart) => currentRound.levels.includes(chart.level));

const chartInfo = {
    artist: song.artist,
    title: song.title,
    level: chart.level,
};

const downloadImage = function(uri, filename){
    request.head(uri, function(err, res, body){
      request(uri).pipe(fs.createWriteStream(filename)).on("close", () => {});
    });
  };

downloadImage(`${SEGA_JACKET_BASE_URL}/${song.image_name}`, "cover.png");
require("fs").writeFileSync("./chart_info.txt", `${chartInfo.artist}\n${chartInfo.title}\n${chartInfo.level}`, "utf-8")


console.log(`Song: ${song.artist} - ${song.title}\nCategory: ${categories[song.category]}\nLevel: ${chart.level}\nDifficulty: ${chart.difficulty}\nCover: ${SEGA_JACKET_BASE_URL}/${song.image_name}`)