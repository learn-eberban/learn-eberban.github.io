import { Fragment } from "react";
import { renderToString } from "react-dom/server";
import htmr from "htmr";
import styles from "./index.module.css";
import strenderInline, {strenderParagraphs} from "./strenders";

export function Gloss({ children }: { children: string}) {
    return <small>{children}</small>;
}

export function Heading({ name }: { name: string }) {
    const compound = name.split(" ");
    if (compound.length === 1) {
        return <h3>{name}</h3>;
    }

    const anchoredHeading = compound.map((word, i) => {
        const space = i === compound.length - 1 ? "" : " ";
        if (i === 0 || word[0] === "u") {
            return word + space;
        }
        return <Fragment key={i}><a>{word}</a>{space}</Fragment>;
    })

    return <h3>{anchoredHeading}</h3>
}

export function Id({ children }: { children: string}) {
    return <small><a>{children}</a></small>
}

export function Meaning({ children }: { children: string}) {
    /*
      strender functions input and output HTML strings, not strings
      so we first renderToString to convert to HTML string
    */
    return (
        <p className={styles.meaning}>
            {htmr(strenderInline(renderToString(<>{children}</>)))}
        </p>
    );
}

export function Notes({ children }: { children: string}) {
    return (
        <details className={styles.dictionary}>
            <summary>Notes :</summary>
            {htmr(strenderParagraphs(strenderInline(children)))}
        </details>
    );
}

export function Definition({ children }: { children: string}) {
    return (
        <details className={styles.dictionary}>
            <summary>Definition :</summary>
            <pre>{children}</pre>
        </details>
    );    
}
