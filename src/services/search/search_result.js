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
    

    computeScore(tokens) { // Token is query?
        this.score = 0;

        const chunks = this.notePathTitle.toLowerCase().split(" ");
        const links = this.notePathLinks;

        for (const chunk of chunks) {
            for (const token of tokens) {
                if (chunk === token) {
                    this.score += 100;
                }
                else if (chunk.includes(token)) {
                    this.score += 30;
                }
                
                this.score += links.length * this.score;
                this.score += this.score / chunks.length;
            }
        }
    }
}

module.exports = SearchResult;
