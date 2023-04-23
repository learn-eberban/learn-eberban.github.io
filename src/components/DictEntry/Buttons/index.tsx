import styles from "./index.module.css";

export function SearchButton() {
    const strokeColour = "#333333";
    const strokeWidth = "15";
    return (
        <button className={styles.search}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
                <circle cx="40" cy="40" r="30" stroke={strokeColour} strokeWidth={strokeWidth} fill="none" />
                <line x1="66" y1="66" x2="82" y2="82" stroke={strokeColour} strokeWidth={strokeWidth} strokeLinecap="round" />
            </svg>
        </button>
    );
}

export function FamilyButton({ children }: { children: string }) {
    return (
        <button className={[styles.mini, styles.lightText, styles.family].join(" ")}>{children}</button>
    )
}

export function TransitivityButton({ isTransitive }: { isTransitive: boolean }) {
    const TransitiveButton = () =>
        <button className={[styles.mini, styles.lightText, styles.transitive].join(" ")}>transitive</button>;
    const IntransitiveButton = () =>
        <button className={[styles.mini, styles.regular].join(" ")}>intransitive</button>;
    return isTransitive ? <TransitiveButton /> : <IntransitiveButton />;
}

export function TagButton({ tag }: { tag: string}) {
    const CoreTag = () =>
        <button className={[styles.mini, styles.lightText, styles.core].join(" ")}>core</button>;
    const Tag = () =>
        <button className={[styles.mini, styles.regular].join(" ")}>{tag}</button>;
    return tag === "core" ? <CoreTag /> : <Tag />;
}
