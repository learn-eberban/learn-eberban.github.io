import ls from 'localstorage-slim';
import { parse } from "yaml";

interface FetchedDictEntry {
    id: string,
    family: string,
    gloss: string,
    tags?: string[],
    short: string,
    transitive?: boolean,
    notes?: string,
    definition?: string,   
};

export interface FormattedDictEntry {
    name: string,
    family: string,
    gloss: string,
    id: string,
    isTransitive: boolean | "n/a",
    tags?: string[]
    short: string,
    notes?: string,
    definition?: string,   
};

function checkIsTransitive(name: string, family: string) {
    const isRootOrCompound = ["R", "C2", "C3", "C+"].includes(family);
    if (!isRootOrCompound) {
        return "n/a";
    }
    const endsInVowel = ["i", "e", "a", "o", "u"].includes(name[name.length - 1]);
    return endsInVowel;
}

function formatDictionary(parsedDictionary: Record<string, FetchedDictEntry>) {
    const dictionaryList: Record<string, FormattedDictEntry>[] = 
        Object.entries(parsedDictionary).map(([name, entry]) => {
            const {
                id,
                family,
                gloss,
                tags,
                short,
                transitive,
                notes,
                definition,
            } = entry;

            return {
                [id]: {
                    name,
                    family,
                    gloss,
                    id,
                    isTransitive: transitive ?? checkIsTransitive(name, family),
                    tags,
                    short,
                    notes,
                    definition,
                }
            }
        });

    return dictionaryList.reduce((dictionary, currentEntry) => {
        const [[wordId, wordEntry]] = Object.entries(currentEntry);
        dictionary[wordId] = wordEntry;
        return dictionary; 
    }, {});
};

function setupCachedDictionary() {
    const url = "https://raw.githubusercontent.com/eberban/eberban/master/dictionary/en.yaml";
    return async () => {
        let cache: Record<string, FetchedDictEntry> | null = ls.get("dictionary");
        if (cache === null) {
            let cache: Record<string, FetchedDictEntry> =
            await fetch(url)
                .then((res) => res.text())
                .then(parse);
            ls.set("dictionary", cache, { ttl: 86_400 * 7 });
            return cache;
        }
        return cache;
    }
};

export default function InitGetEntryById(): (id: string) => Promise<FormattedDictEntry> {
    const getDictionary = setupCachedDictionary();
    return (id: string) => getDictionary().then(formatDictionary).then((dict) => dict[id]);
};
