import { ReactNode, useEffect, useState } from "react";
import InitGetEntryById, { FormattedDictEntry as EntryType } from "../../utils/dictionary";
import { SearchButton, FamilyButton, TransitivityButton, TagButton } from "./Buttons";
import { Definition, Gloss, Heading, Id, Meaning, Notes } from "./Textuals";
/* 
  Why CSS Module over tailwind? To mimic this website's style
  https://eberban.github.io/eberban/web/dictionary.html
*/
import styles from "./index.module.css";

const getEntryById = InitGetEntryById();

function DisplayBlock({ name, family, gloss, id, isTransitive, tags, short, notes, definition }: EntryType) {
    return (
        <article className={styles.entry}>
            <div className={styles.info}>
                <div className={styles.heading}>
                    <Heading name={name} />
                    <SearchButton />
                </div>
                <div><Gloss>{gloss}</Gloss></div>
                <div>
                    <FamilyButton>{family}</FamilyButton>
                    {isTransitive !== "n/a" && <TransitivityButton isTransitive={isTransitive} />}
                    {tags?.map((t, i) => <TagButton tag={t} key={i} />)}
                </div>
                <div><Id>{id}</Id></div>
            </div>
            <hr />
            <Meaning>{short}</Meaning>
            {notes      && <Notes>{notes}</Notes>}
            {definition && <Definition>{definition}</Definition>}
        </article>
    );
};

function DisplayInline({ name, short }: { name: string, short: string }) {
    return (
        <span className={styles.entryInline}>
            <strong>{name}</strong>
            :<> </> 
            <Meaning>{short}</Meaning>
        </span>
    );
}

function Placeholder({ inline, title, children }: { inline: boolean, title: string, children?: ReactNode }) {
    if (inline) {
        return <>{title}: {children}</>
    }
    return (
        <article className={styles.entry}>
            <h3>{title}</h3>
            {children}
        </article>
    );
};

function Error() {
    return (
        <>
            If you keep seeing this, please either let us know in the 
            #language-course channel of the<> </>
            <a href="https://discord.gg/FChFEHEet8">ber&nbsp;spua</a><> </>
            Discord server or<> </>
            <a href="https://github.com/learn-eberban/learn-eberban.github.io/issues/new">
                create an issue on GitHub
            </a>.
        </>
    );
}

export default function DictEntry({ id, inline }: { id: string, inline: boolean }) {
    const [entry, setEntry] = useState<EntryType | undefined>(undefined);
    const [hasLoaded, setHasLoaded] = useState(false);
    useEffect(() => {
        getEntryById(id).then((fetchedEntry) => {
            if (!hasLoaded) {
                setEntry(fetchedEntry);
                setHasLoaded(true);
            }
        });
    }, [entry, hasLoaded]);
    if (!hasLoaded) {
        return <Placeholder inline={inline} title="Loading..." />;
    }
    if (!entry) {
        return <Placeholder inline={inline} title="Failed to load"><Error /></Placeholder>
    }
    return inline ? <DisplayInline {...entry} /> : <DisplayBlock {...entry} />
};
