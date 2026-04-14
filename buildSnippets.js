const fs = require('fs');

const daisy = fs.readFileSync('public/daisy_SKILL.md', 'utf8');
const nex = fs.readFileSync('public/Nex_SKILL_PART2.md', 'utf8');
const text = daisy + '\n' + nex;

const blocks = [...text.matchAll(/```tsx\n([\s\S]*?)```/g)];
const templatesMap = {};

function standardizeName(name) {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "");
}

for (const block of blocks) {
    let code = block[1];

    const templateMatch = code.match(/\/\/\s*TEMPLATE[^:]*:?\s*(.*)/i);
    let name = "";

    if (templateMatch) {
        name = templateMatch[1].replace(/\(.*\)/, "").trim();
    } else {
        const compMatch = code.match(/(?:export\s+)?const\s+([A-Za-z0-9_]+Scene)\s*=\s*\(\{/);
        if (compMatch) name = compMatch[1].replace(/Scene$/, "");
    }

    if (!name || name === "Animation" || name.includes("<")) continue;

    const id = standardizeName(name);

    // Extract Zod Schema if present
    let schema = "";
    const schemaMatch = code.match(/export const propsSchema = (z\.object\(\{[\s\S]*?\}\));/);
    if (schemaMatch) {
        schema = schemaMatch[1];
    }

    // Extract duration from comments
    let duration = 150;
    const durMatch = code.match(/DURATION:.* (\d+) frames/i);
    if (durMatch) duration = parseInt(durMatch[1]);

    // Clean the component code
    // Remove schema exports, imports, loadFont, and default exports
    code = code.replace(/import .*?from .*?;/g, "");
    code = code.replace(/const \{ fontFamily \} = loadFont\(\);/g, "");
    code = code.replace(/export const propsSchema = [\s\S]*?\};\n/g, "");
    code = code.replace(/export type Props = z\.infer<typeof propsSchema>;/g, "");
    code = code.replace(/export default Animation;/g, "");

    // Replace `export const Animation =` with generic identifier
    code = code.replace(/(?:export\s+)?const\s+Animation\s*=\s*/g, "const __COMPONENT_NAME__ = ");

    templatesMap[id] = {
        id,
        originalName: name,
        defaultDuration: duration,
        schema: schema.trim(),
        code: code.trim(),
    };
}

let tsOutput = `// AUTO-GENERATED. DO NOT EDIT.
// This file contains statically extracted template code from the skill MD files.

export const TEMPLATE_SNIPPETS: Record<string, { id: string, originalName: string, defaultDuration: number, schema: string, code: string }> = `;
tsOutput += JSON.stringify(templatesMap, null, 2);
tsOutput += ";\n";

fs.writeFileSync('src/remotion/templateSnippets.ts', tsOutput);
console.log("Wrote " + Object.keys(templatesMap).length + " templates to src/remotion/templateSnippets.ts");
