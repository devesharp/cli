import { GluegunToolbox } from 'gluegun';
import * as fs from 'fs';
import * as path from 'path';
import { Str } from '@devesharp/helpers-js';

export class Nestjs {
    async generate(toolbox: GluegunToolbox): Promise<void> {
        const {
            parameters,
            template: { generate },
            print: { info, error },
        } = toolbox;

        const schema = parameters.first;
        const name = parameters.second;
        const nameKebab = Str.kebab(name);
        const nameStudly = Str.studly(name);

        if (this[`generateSchema${Str.studly(schema)}`]) {
            await this[`generateSchema${Str.studly(schema)}`](
                {
                    parameters,
                    generate,
                    info,
                },
                {
                    name,
                    nameKebab,
                    nameStudly,
                },
            );
        } else {
            error('Schema not found');
        }
    }

    async generateSchemaValidator(toolbox: any, data: any): Promise<void> {
        const { name, nameKebab, nameStudly } = data;

        // Criar arquivos
        await toolbox.generate({
            template: 'nestjs/validator.ts.ejs',
            target: `src/validators/${nameKebab}-validator/${nameKebab}.validator.ts`,
            props: { nameKebab, nameStudly },
        });
        await toolbox.generate({
            template: 'nestjs/validator.spec.ts.ejs',
            target: `src/validators/${nameKebab}-validator/${nameKebab}.validator.spec.ts`,
            props: { nameKebab, nameStudly },
        });

        // Adicionar Serviço noexports
        this.updateExportsModule(`src/validators/validators.module.ts`, `${nameStudly}Validator`);
        // Adicionar Serviço no providers
        this.updateProvidersModule(`src/validators/validators.module.ts`, `${nameStudly}Validator`);
        // Adicionar Import
        this.addImportToModule(
            `src/validators/validators.module.ts`,
            `${nameStudly}Validator`,
            `./src/validators/${nameKebab}-validator/${nameKebab}.validator.ts`,
        );

        // Logs
        toolbox.info(`${`CREATE`.green} /src/validators/${name}-validator/${name}-validator.service.spec.ts`);
        toolbox.info(`${`CREATE`.green} /src/validators/${name}-validator/${name}-validator.service.ts`);
        toolbox.info(`${`UPDATE`.blue} /src/validators/validators.module.ts`);
    }

    async generateSchemaRepository(toolbox: any, data: any): Promise<void> {
        const { name, nameKebab, nameStudly } = data;

        // Criar arquivos
        await toolbox.generate({
            template: 'nestjs/repository-mysql.ts.ejs',
            target: `src/repositories/${nameKebab}-repository/${nameKebab}.repository.ts`,
            props: { nameKebab, nameStudly },
        });

        // Adicionar Serviço noexports
        this.updateExportsModule(`src/repositories/repositories.module.ts`, `${nameStudly}Repository`);
        // Adicionar Serviço no providers
        this.updateProvidersModule(`src/repositories/repositories.module.ts`, `${nameStudly}Repository`);
        // Adicionar Import
        this.addImportToModule(
            `src/repositories/repositories.module.ts`,
            `${nameStudly}Repository`,
            `./src/repositories/${nameKebab}-repository/${nameKebab}.repository.ts`,
        );

        // Logs
        toolbox.info(`${`CREATE`.green} /src/repositories/${name}-repository/${name}-repository.service.spec.ts`);
        toolbox.info(`${`CREATE`.green} /src/repositories/${name}-repository/${name}-repository.service.ts`);
        toolbox.info(`${`UPDATE`.blue} /src/repositories/repositories.module.ts`);
    }

    async generateSchemaTransformer(toolbox: any, data: any): Promise<void> {
        const { name, nameKebab, nameStudly } = data;

        // Criar arquivos
        await toolbox.generate({
            template: 'nestjs/transformer.ts.ejs',
            target: `src/transformers/${nameKebab}-transformer/${nameKebab}.transformer.ts`,
            props: { nameKebab, nameStudly },
        });
        // Adicionar Serviço noexports
        this.updateExportsModule(`src/transformers/transformers.module.ts`, `${nameStudly}Transformer`);
        // Adicionar Serviço no providers
        this.updateProvidersModule(`src/transformers/transformers.module.ts`, `${nameStudly}Transformer`);
        // Adicionar Import
        this.addImportToModule(
            `src/transformers/transformers.module.ts`,
            `${nameStudly}Transformer`,
            `./src/transformers/${nameKebab}-transformer/${nameKebab}.transformer.ts`,
        );

        // Logs
        toolbox.info(`${`CREATE`.green} /src/transformers/${name}-transformer/${name}-transformer.service.spec.ts`);
        toolbox.info(`${`CREATE`.green} /src/transformers/${name}-transformer/${name}-transformer.service.ts`);
        toolbox.info(`${`UPDATE`.blue} /src/transformers/transformers.module.ts`);
    }

    async generateSchemaPolicy(toolbox: any, data: any): Promise<void> {
        const { name, nameKebab, nameStudly } = data;

        // Criar arquivos
        await toolbox.generate({
            template: 'nestjs/policy.ts.ejs',
            target: `src/policies/${nameKebab}-policy/${nameKebab}.policy.ts`,
            props: { nameKebab, nameStudly },
        });
        await toolbox.generate({
            template: 'nestjs/policy.spec.ts.ejs',
            target: `src/policies/${nameKebab}-policy/${nameKebab}.policy.spec.ts`,
            props: { nameKebab, nameStudly },
        });
        // Adicionar Serviço noexports
        this.updateExportsModule(`src/policies/policies.module.ts`, `${nameStudly}Policy`);
        // Adicionar Serviço no providers
        this.updateProvidersModule(`src/policies/policies.module.ts`, `${nameStudly}Policy`);
        // Adicionar Import
        this.addImportToModule(
            `src/policies/policies.module.ts`,
            `${nameStudly}Policy`,
            `./src/policies/${nameKebab}-policy/${nameKebab}.policy.ts`,
        );

        // Logs
        toolbox.info(`${`CREATE`.green} /src/policies/${name}-policy/${name}-policy.service.spec.ts`);
        toolbox.info(`${`CREATE`.green} /src/policies/${name}-policy/${name}-policy.service.ts`);
        toolbox.info(`${`UPDATE`.blue} /src/policies/policies.module.ts`);
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
