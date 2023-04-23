import htmr from "htmr";
import { renderToString } from "react-dom/server";
import styles from "./strenders.module.css";

/*
  This file string-renders specific patterns in text with JSX.
  Hence the file being .tsx instead of .ts
*/

type HTMLString = string;
type Strender = (text: HTMLString) => HTMLString;

const pipe = (...fns: Strender[]) => {
    const leftThenRight = (fn1: Strender, fn2: Strender) =>
        (text: HTMLString) => fn2(fn1(text));
    const formatIdentity = (text: HTMLString) => text;
    return fns.reduce(leftThenRight, formatIdentity);
};

const removeDelimiters = (text: string) => text.substring(1, text.length - 1);

const getSource = (x: RegExp | string) => x instanceof RegExp ? x.source : x;

const composeRegExp = (list: (string | RegExp)[], isGlobal = false): RegExp => {
    const concatString = (s1: string, s2: string) => s1 + s2;
    return new RegExp(list.map(getSource).reduce(concatString), isGlobal ? "g" : "");
};

const OptRegExp = (list: (string | RegExp)[], quantifiers: string = ""): RegExp => {
    const concatOption = (regex1: string, regex2: string) => `${regex1}|${regex2}`;
    const options = new RegExp(list.map(getSource).reduce(concatOption));
    return composeRegExp(["(", options, ")", quantifiers ?? ""]);
}

/*
  STRENDERS
*/

function strenderItalics(text: HTMLString) {
    return text.replace(
        composeRegExp(["_", "\\w+", "_"], true),
        (underscoredText: string) => renderToString(
            <em>{removeDelimiters(underscoredText)}</em> 
        )
    );
};

function strenderPlaces(text: HTMLString) {
    const atom = composeRegExp(["\\w+", "\\*?", "(", "\\s\\w+", ")?"]);
    const predicate = composeRegExp(["\\(", "(", atom, ")?", "\\)"]);
    const placeNotationRegex = composeRegExp([
        "\\[",
          OptRegExp(["E", "A", "O", "U"]),
          "(", ":", OptRegExp([atom, predicate]), ")?",
        "\\]",
    ], true);

    const strenderWhitespace = (text: HTMLString) => {
        return text.replace(" ", renderToString(<>&nbsp;</>));
    };

    const strenderAnchor = (text: HTMLString) => {
        const moreThanTwoLetters = composeRegExp(["\\w\\w+"], true);
        return text.replace(
            moreThanTwoLetters,
            (word: string) => renderToString(<a>{word}</a>)
        );
    };

    const strender = pipe(
        removeDelimiters,
        strenderWhitespace,
        strenderAnchor,
    );

    return text.replace(
        placeNotationRegex, 
        (place: string) => renderToString(
            <span className={styles.place}>
                {htmr(strender(place))}
            </span>
        )
    );
};

function strenderReferences(text: HTMLString) {
    const bangWord = composeRegExp(["\\!", "\\w"]);
    const ellipsis = composeRegExp(["\\.\\.\\."]);
    const bracketedWord = composeRegExp(["\\(", "\\w+", "\\)"]);
    const slashedWord = composeRegExp(["\\w+", "(", "\\/", "\\w+", ")+"]);
    const content = OptRegExp([
            bangWord, bracketedWord, ellipsis, slashedWord, "\\w", "\\s",
    ], "*");

    const strenderAnchor = (text: HTMLString) => text.replace(/[\w!]+/g, (word: string) => {
        return word[0] === "!" ? word.substring(1) : renderToString(<a>{word}</a>);
    });

    const strender = pipe(
        removeDelimiters,
        strenderAnchor,
    );

    return text.replace(
        composeRegExp(["\\{", content, "\\}"], true),
        (reference: string) => renderToString(
            <span className={styles.reference}>
                {htmr(strender(reference))}
            </span>
        )
    );
};

function strenderEscapedBrackets(text: HTMLString) {
    return text.replace(
        composeRegExp(["\\\\", "\\[", "\\w+", "\\\\", "\\]"], true),
        (escapedBracketedText: string) => {
            return escapedBracketedText.replace(composeRegExp(["\\\\"], true), "")
        }
    );
};

function strenderBreaks(text: HTMLString) {
    return text.split("\\\n").join("<br />");
}

/*
  EXPORTS
*/

export function strenderParagraphs(text: HTMLString) {
    return `<p>${text.split("\n\n").join("</p><p>")}</p>`;
};

export default pipe(
    strenderItalics, // runs first as CSS module class names have underscores
    strenderPlaces,
    strenderReferences,
    strenderEscapedBrackets,
    strenderBreaks,
);
