import { GluegunToolbox } from 'gluegun';
import * as fs from 'fs';
import * as path from 'path';
import { Str } from '@devesharp/helpers-js';

export class Nestjs {
    async generate(toolbox: GluegunToolbox): Promise<void> {
        const {
            parameters,
            template: { generate },
            print: { info, success, error },
        } = toolbox;

        const schema = parameters.first;
        const name = parameters.second;
        const nameKebab = Str.kebab(name);
        const nameStudly = Str.studly(name);
        const nameLower = name.toLowerCase();

        await generate({
            template: 'validator.service.ts.ejs',
            target: `test/src/validators/${name}-validator/${name}-validator.service.ts`,
            props: { nameKebab, nameStudly, nameLower },
        });
        await generate({
            template: 'validator.service.spec.ts.ejs',
            target: `test/src/validators/${name}-validator/${name}-validator.service.spec.ts`,
            props: { nameKebab, nameStudly, nameLower },
        });

        // Adicionar Serviço noexports
        this.updateExportsModule(`test/src/validators/validators.module.ts`, `${nameStudly}Validator`);
        // Adicionar Serviço no providers
        this.updateProvidersModule(`test/src/validators/validators.module.ts`, `${nameStudly}Validator`);
        // Adicionar Import
        this.updateProvidersModule(`test/src/validators/validators.module.ts`, `${nameStudly}Validator`);

        info(`${`CREATE`.green} /src/validators/${name}-validator/${name}-validator.service.spec.ts`);
        info(`${`CREATE`.green} /src/validators/${name}-validator/${name}-validator.service.ts`);
        info(`${`UPDATE`.blue} /src/validators/validators.module.ts`);
    }

    /**
     * Adicionar servico na key exports
     * @param pathname
     * @param service
     */
    updateExportsModule(pathname: string, service: string): void {
        const regex = /exports:([^[]*)\[([^\]]*)]/gs;
        const file = fs.readFileSync(path.resolve(pathname)).toString();
        const math = regex.exec(file);

        if (math) {
            let exportsString = math[2];
            exportsString = exportsString.replace(/s+/gm, '');

            let fileUpdated;
            if (exportsString === '' || exportsString === ' ') {
                fileUpdated = file.replace(regex, `exports: [${service}]`);
            } else {
                fileUpdated = file.replace(regex, `exports: [${exportsString}, ${service}]`);
            }

            fs.writeFileSync(pathname, fileUpdated);
        } else {
            console.log('No exports found in module');
        }
    }

    /**
     * Adicionar servico na key providers
     * @param pathname
     * @param service
     */
    updateProvidersModule(pathname: string, service: string): void {
        const regex = /providers:([^[]*)\[([^\]]*)]/gs;
        const file = fs.readFileSync(path.resolve(pathname)).toString();
        const math = regex.exec(file);

        if (math) {
            let providersString = math[2];
            providersString = providersString.replace(/s+/gm, '');

            let fileUpdated;
            if (providersString === '' || providersString === ' ') {
                fileUpdated = file.replace(regex, `providers: [${service}]`);
            } else {
                fileUpdated = file.replace(regex, `providers: [${providersString}, ${service}]`);
            }

            fs.writeFileSync(pathname, fileUpdated);
        } else {
            console.log('No providers found in module');
        }
    }

    addImportToModule(pathname: string, service: string, servicePath: string): void {
        const file = fs.readFileSync(path.resolve(pathname)).toString();

        const fileUpdated = `import { ${service} } from '${servicePath}';\n${file}`;

        fs.writeFileSync(pathname, fileUpdated);
    }
}
