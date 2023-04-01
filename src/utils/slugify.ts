import GitHubSlugger from "github-slugger";
// Using wrapper function as otherwise it's imported as null or undefined.
export default (value: string, maintainCase?: boolean | undefined) => new GitHubSlugger().slug(value, maintainCase);
