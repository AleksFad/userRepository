import fs from 'fs';
import handlebars from 'handlebars';
import * as path from 'path';

export function renderEmailTemplate(data: any): string {
    const templateHtml = fs.readFileSync(path.resolve(__dirname, '../views/home.handlebars'), 'utf8');
    const template = handlebars.compile(templateHtml);

    return template(data);
}
