"use strict";

const becca = require('../../becca/becca');
const beccaService = require('../../becca/becca_service');

class SearchResult {
    constructor(notePathArray) {
        this.notePathArray = notePathArray;
        this.notePathTitle = beccaService.getNoteTitleForPath(notePathArray);
        this.notePathLinks = becca.getNote(this.notePathArray[this.notePathArray.length - 1]).getTargetRelations();
    }

    get notePath() {
        return this.notePathArray.join('/');
    }

    get noteId() {
        return this.notePathArray[this.notePathArray.length - 1];
    }

    computeScore(tokens) {
        this.score = 0;
        var linkScore = 0;
        var wordScore = 0;

        const chunks = this.notePathTitle.toLowerCase().split(" ");
        const links = this.notePathLinks;

        for (const chunk of chunks) {
            for (const token of tokens) {
                if (chunk === token) {
                    wordScore += 600 * token.length;
                }
                else if (chunk.startsWith(token)) {
                    wordScore += 400 * (token.length / chunk.length);
                }
                else if (chunk.includes(token)) {
                    wordScore += 300 * (token.length / chunk.length);
                }

            }

        }
        
        linkScore = links.length
        wordScore = log(wordScore / chunks.length)

        this.score = (3 * wordScore) + linkScore
    }
}

module.exports = SearchResult;
