import { GluegunToolbox } from 'gluegun';
import * as fs from 'fs';
import * as path from 'path';
import { Str } from '@devesharp/helpers-js';

export class Nestjs {
    async generate(toolbox: GluegunToolbox) {
        const {
            parameters,
            template: { generate },
            print: { info, success },
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

        // this.updateExportsModule(`test/src/validators/validators.module.ts`, `${nameStudly}Validator`);
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
    updateExportsModule(pathname: string, service: string) {
        const regex = /exports:.*\[(.+?|)\]/gs;
        const file = fs.readFileSync(path.resolve(pathname)).toString();
        let exportsString = regex.exec(file)[1];
        exportsString = exportsString.replace(/s+/gm, '');

        let fileUpdated;
        if (exportsString == '') {
            fileUpdated = file.replace(regex, `exports: [${service}]`);
        } else {
            fileUpdated = file.replace(regex, `exports: [${exportsString}, ${service}]`);
        }

        fileUpdated = `import { ${service} } from './${Str.kebab(service)}/${Str.kebab(
            service,
        )}.service';\n${fileUpdated}`;

        fs.writeFileSync(pathname, fileUpdated);
    }

    /**
     * Adicionar servico na key providers
     * @param pathname
     * @param service
     */
    updateProvidersModule(pathname: string, service: string) {
        const regex = /providers:.*\[(.+?|)\]/gs;
        const file = fs.readFileSync(path.resolve(pathname)).toString();
        let providersString = regex.exec(file)[1];
        providersString = providersString.replace(/s+/gm, '');

        let fileUpdated;
        if (providersString == '') {
            fileUpdated = file.replace(regex, `providers: [${service}]`);
        } else {
            fileUpdated = file.replace(regex, `providers: [${providersString}, ${service}]`);
        }

        fileUpdated = `import { ${service} } from './${Str.kebab(service)}/${Str.kebab(
            service,
        )}.service';\n${fileUpdated}`;

        fs.writeFileSync(pathname, fileUpdated);
    }
}
