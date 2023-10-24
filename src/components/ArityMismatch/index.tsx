const svgClass = "fill-white dark:fill-gray-900 drop-shadow-md";
const textClass = "fill-gray-700 dark:fill-gray-200";
const smallTextClass = `${textClass} stroke-none text-xs`;
const bigTextClass = `${textClass} text-xl stroke-gray-700 dark:stroke-gray-200`;

const makePercenter = (max: number) => (n: number) => (n / 100) * max;
const getTranslate = (coords: [number, number], strokeWidth: number) => {
    return `translate(${coords.map((x) => x + strokeWidth).join(",")})`;
}

interface LeftProps {
    translate: [number, number],
    width: number,
    height: number,
    strokeWidth: number,
}

function Left(props: LeftProps) {
    const widthPercent  = makePercenter(props.width);
    const heightPercent = makePercenter(props.height);
    const d = `
        m 0 0
        h ${widthPercent(100)}
        l ${widthPercent(-10)}, ${heightPercent(10)}
        v ${heightPercent(80)}
        l ${widthPercent(10)}, ${heightPercent(10)}
        h ${widthPercent(-100)}
        z 
    `;
    return (
        <g
            className={svgClass}
            transform={getTranslate(props.translate, props.strokeWidth)}
        >
            <path  d={d} strokeWidth={props.strokeWidth} />
            <text className={bigTextClass} x={widthPercent(33)} y={widthPercent(38)}>
                pa
            </text>
        </g>
    );
}

interface RightProps {
    arity: 0 | 1 | 2,
    text: string,
    translate: [number, number],
    width: number,
    height: number,
    strokeWidth: number,
}

function Right(props: RightProps) {
    const widthPercent  = makePercenter(props.width);
    const heightPercent = makePercenter(props.height);
    type Place = {
        className: string,
        x: number,
        y: number,
        text: string,
    };
    const chosenArity: { d: string, places: Place[]} = (() => {
        switch(props.arity) {
            case 0: return {
                d: `v ${heightPercent(-80)}`,
                places: [],
            }
            case 1: return {
                d: `
                    v ${heightPercent(-20)}
                    a 1.75 1 0 0 1 0 ${heightPercent(-40)}
                    v ${heightPercent(-20)}
                `,
                places: [
                    {
                        className: `${textClass} stroke-none`,
                        x: widthPercent(-13),
                        y: heightPercent(56),
                        text: "E",
                    },
                ],
            }
            case 2: return {
                d: `
                    v ${heightPercent(-10)}
                    a 2 1 0 0 1 0 ${heightPercent(-25)}
                    v ${heightPercent(-10)}
                    a 2 1 0 0 1 0 ${heightPercent(-25)}
                    v ${heightPercent(-10)}
                `,
                places: [
                    {
                        className: smallTextClass,
                        x: widthPercent(-10),
                        y: heightPercent(38),
                        text: "E",
                    },
                    {
                        className: smallTextClass,
                        x: widthPercent(-10),
                        y: heightPercent(72),
                        text: "A",
                    },
                ],
            }
        };
    })();
    const d = `
        m 0 0
        m ${widthPercent(10)} ${heightPercent(0)}
        h ${widthPercent(90)}
        v ${heightPercent(100)}
        h ${widthPercent(-90)}
        l ${widthPercent(-10)} ${heightPercent(-10)}
        ${chosenArity.d}
        l ${widthPercent(10)} ${heightPercent(-10)}
        z
    `;
    return (
        <g
            className={svgClass}
            transform={getTranslate(props.translate, props.strokeWidth)}
        >
            <path  d={d} strokeWidth={props.strokeWidth} />
            <text className={bigTextClass} x={`${widthPercent(33)}`} y={`${widthPercent(38)}`}>
                {props.text}
            </text>
            {chosenArity.places.map((p) => {
                return <text
                            key={p.text}
                            className={p.className}
                            x={p.x}
                            y={p.y}
                        >
                            {p.text}
                        </text>
            })}
        </g>
    );
}

type Jigsaw = {
    arity: 0 | 1 | 2,
    direction: "left" | "right",
    text: string,
    translate: [number, number],
}

export default function ArityMismatch({ jigsaws }: { jigsaws: Jigsaw[] }) {
    const each = {
        width: 120,
        height: 80,
        strokeWidth: 1,
    };
    const lowestStartingPoint = jigsaws.map(({ translate: [_, y]}) => y).reduce((acc, curr) => acc > curr ? acc : curr);
    const height = (jigsaws.length * each.strokeWidth) + each.height + lowestStartingPoint;
    return (
        <svg className={"my-8 stroke-stone-400"} width="100%" height={height} fill="none" xmlns="http://www.w3.org/2000/svg">
            {jigsaws.map(({arity, direction, text, translate}) => {
                if (direction === "left") {
                    return <Left
                                key={translate.join("")}
                                translate={translate}
                                {...each}
                            />;
                }
                return <Right
                            key={translate.join("")}
                            arity={arity}
                            text={text}
                            translate={translate}
                            {...each}
                        />;
            })}
        </svg>
    )
}
