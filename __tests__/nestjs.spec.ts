import * as fs from 'fs';
import * as path from 'path';
import { GluegunToolbox } from 'gluegun';
import { Nestjs } from '../src/app/nestjs';

import fn = jest.fn;

jest.mock('fs');

describe('NestJS', () => {
    let nestjs: Nestjs;

    beforeEach(() => {
        nestjs = new Nestjs();
    });

    describe('Validators', () => {
        it('updateExportsModule - Atualizar exports vazio', () => {
            // @ts-ignore
            fs.readFileSync = (filename: string) => `
                import { Global, Module } from '@nestjs/common';
                @Global()
                @Module({
                    providers: [],
                    exports: [],
                })
                export class ValidatorsModule {}
            `;

            // @ts-ignore
            fs.writeFileSync = jest.fn();

            const modulePath = `src/validators/validators.module.ts`;
            nestjs.updateExportsModule(modulePath, `FooValidator`);

            expect(fs.writeFileSync).toHaveBeenCalledWith(
                modulePath,
                `
                import { Global, Module } from '@nestjs/common';
                @Global()
                @Module({
                    providers: [],
                    exports: [FooValidator],
                })
                export class ValidatorsModule {}
            `,
            );
        });

        it('updateExportsModule - Atualizar exports com valores', () => {
            // @ts-ignore
            fs.readFileSync = (filename: string) => `
                import { Global, Module } from '@nestjs/common';
                @Global()
                @Module({
                    providers: [],
                    exports: [FooValidator,Foo2Validator],
                })
                export class ValidatorsModule {}
            `;

            // @ts-ignore
            fs.writeFileSync = jest.fn();

            const modulePath = `src/validators/validators.module.ts`;
            nestjs.updateExportsModule(modulePath, `Foo3Validator`);

            expect(fs.writeFileSync).toHaveBeenCalledWith(
                modulePath,
                `
                import { Global, Module } from '@nestjs/common';
                @Global()
                @Module({
                    providers: [],
                    exports: [FooValidator,Foo2Validator, Foo3Validator],
                })
                export class ValidatorsModule {}
            `,
            );
        });

        it('updateExportsModule - Atualizar exports multi linha', () => {
            // @ts-ignore
            fs.readFileSync = (filename: string) => `
                import { Global, Module } from '@nestjs/common';
                @Global()
                @Module({
                    providers: [],
                    exports: [
                        FooValidator,
                        Foo2Validator
                    ],
                })
                export class ValidatorsModule {}
            `;

            // @ts-ignore
            fs.writeFileSync = jest.fn();

            const modulePath = `src/validators/validators.module.ts`;
            nestjs.updateExportsModule(modulePath, `Foo3Validator`);

            expect(fs.writeFileSync).toHaveBeenCalledWith(
                modulePath,
                `
                import { Global, Module } from '@nestjs/common';
                @Global()
                @Module({
                    providers: [],
                    exports: [
                        FooValidator,
                        Foo2Validator
                    , Foo3Validator],
                })
                export class ValidatorsModule {}
            `,
            );
        });

        it('updateProvidersModule - Atualizar exports vazio', () => {
            // @ts-ignore
            fs.readFileSync = (filename: string) => `
                import { Global, Module } from '@nestjs/common';
                @Global()
                @Module({
                    providers: [],
                    exports: [],
                })
                export class ValidatorsModule {}
            `;

            // @ts-ignore
            fs.writeFileSync = jest.fn();

            const modulePath = `src/validators/validators.module.ts`;
            nestjs.updateProvidersModule(modulePath, `FooValidator`);

            expect(fs.writeFileSync).toHaveBeenCalledWith(
                modulePath,
                `
                import { Global, Module } from '@nestjs/common';
                @Global()
                @Module({
                    providers: [FooValidator],
                    exports: [],
                })
                export class ValidatorsModule {}
            `,
            );
        });

        it('updateProvidersModule - Atualizar exports com valores', () => {
            // @ts-ignore
            fs.readFileSync = (filename: string) => `
                import { Global, Module } from '@nestjs/common';
                @Global()
                @Module({
                    providers: [FooValidator,Foo2Validator],
                    exports: [FooValidator,Foo2Validator],
                })
                export class ValidatorsModule {}
            `;

            // @ts-ignore
            fs.writeFileSync = jest.fn();

            const modulePath = `src/validators/validators.module.ts`;
            nestjs.updateProvidersModule(modulePath, `Foo3Validator`);

            expect(fs.writeFileSync).toHaveBeenCalledWith(
                modulePath,
                `
                import { Global, Module } from '@nestjs/common';
                @Global()
                @Module({
                    providers: [FooValidator,Foo2Validator, Foo3Validator],
                    exports: [FooValidator,Foo2Validator],
                })
                export class ValidatorsModule {}
            `,
            );
        });

        it('updateProvidersModule - Atualizar exports multi linha', () => {
            // @ts-ignore
            fs.readFileSync = (filename: string) => `
                import { Global, Module } from '@nestjs/common';
                @Global()
                @Module({
                    providers: [
                        FooValidator,
                        Foo2Validator
                    ],
                    exports: [
                        FooValidator,
                        Foo2Validator
                    ],
                })
                export class ValidatorsModule {}
            `;

            // @ts-ignore
            fs.writeFileSync = jest.fn();

            const modulePath = `src/validators/validators.module.ts`;
            nestjs.updateProvidersModule(modulePath, `Foo3Validator`);

            expect(fs.writeFileSync).toHaveBeenCalledWith(
                modulePath,
                `
                import { Global, Module } from '@nestjs/common';
                @Global()
                @Module({
                    providers: [
                        FooValidator,
                        Foo2Validator
                    , Foo3Validator],
                    exports: [
                        FooValidator,
                        Foo2Validator
                    ],
                })
                export class ValidatorsModule {}
            `,
            );
        });

        it('addImportToModule - Adicionar import', () => {
            // @ts-ignore
            fs.readFileSync = (filename: string) => `import { Global, Module } from '@nestjs/common';
                @Global()
                @Module({
                    providers: [],
                    exports: [],
                })
                export class ValidatorsModule {}
            `;

            // @ts-ignore
            fs.writeFileSync = jest.fn();

            const modulePath = `src/validators/validators.module.ts`;
            nestjs.addImportToModule(modulePath, `Foo3Validator`, './validators/validators-foo3-validator');

            expect(fs.writeFileSync).toHaveBeenCalledWith(
                modulePath,
                `import { Foo3Validator } from './validators/validators-foo3-validator';
import { Global, Module } from '@nestjs/common';
                @Global()
                @Module({
                    providers: [],
                    exports: [],
                })
                export class ValidatorsModule {}
            `,
            );
        });

        it('generate - Validator', async () => {
            // Mocks

            // @ts-ignore
            fs.readFileSync = (filename: string) => `
                import { Global, Module } from '@nestjs/common';
                @Global()
                @Module({
                    providers: [],
                    exports: [],
                })
                export class ValidatorsModule {}
            `;

            // @ts-ignore
            fs.writeFileSync = jest.fn();

            // Mocks
            const generateFn = jest.fn().mockResolvedValue(true);
            jest.spyOn(nestjs, 'updateExportsModule').mockImplementation();
            jest.spyOn(nestjs, 'updateProvidersModule').mockImplementation();
            jest.spyOn(nestjs, 'addImportToModule').mockImplementation();

            const toolbox = {
                template: {
                    generate: generateFn,
                },
                print: { info: () => {}, success: () => {}, error: () => {} },
                parameters: {
                    first: 'validator',
                    second: 'FooBoo',
                },
            };

            // Test
            await nestjs.generate(toolbox as any);

            expect(generateFn).toHaveBeenCalledWith({
                template: 'nestjs/validator.ts.ejs',
                target: `src/validators/foo-boo-validator/foo-boo.validator.ts`,
                props: { nameKebab: 'foo-boo', nameStudly: 'FooBoo' },
            });
            expect(generateFn).toHaveBeenCalledWith({
                template: 'nestjs/validator.spec.ts.ejs',
                target: `src/validators/foo-boo-validator/foo-boo.validator.spec.ts`,
                props: { nameKebab: 'foo-boo', nameStudly: 'FooBoo' },
            });
            expect(nestjs.updateExportsModule).toHaveBeenCalledWith(
                `src/validators/validators.module.ts`,
                `FooBooValidator`,
            );
            expect(nestjs.updateProvidersModule).toHaveBeenCalledWith(
                `src/validators/validators.module.ts`,
                `FooBooValidator`,
            );
            expect(nestjs.addImportToModule).toHaveBeenCalledWith(
                `src/validators/validators.module.ts`,
                `FooBooValidator`,
                `./src/validators/foo-boo-validator/foo-boo.validator.ts`,
            );
        });

        it('generate - Repository', async () => {
            // Mocks

            // @ts-ignore
            fs.readFileSync = (filename: string) => `
                import { Global, Module } from '@nestjs/common';
                @Global()
                @Module({
                    providers: [],
                    exports: [],
                })
                export class ValidatorsModule {}
            `;

            // @ts-ignore
            fs.writeFileSync = jest.fn();

            // Mocks
            const generateFn = jest.fn().mockResolvedValue(true);
            jest.spyOn(nestjs, 'updateExportsModule').mockImplementation();
            jest.spyOn(nestjs, 'updateProvidersModule').mockImplementation();
            jest.spyOn(nestjs, 'addImportToModule').mockImplementation();

            const toolbox = {
                template: {
                    generate: generateFn,
                },
                print: { info: () => {}, success: () => {}, error: () => {} },
                parameters: {
                    first: 'repository',
                    second: 'FooBoo',
                },
            };

            // Test
            await nestjs.generate(toolbox as any);

            expect(generateFn).toHaveBeenCalledWith({
                template: 'nestjs/repository-mysql.ts.ejs',
                target: `src/repositories/foo-boo-repository/foo-boo.repository.ts`,
                props: { nameKebab: 'foo-boo', nameStudly: 'FooBoo' },
            });
            expect(nestjs.updateExportsModule).toHaveBeenCalledWith(
                `src/repositories/repositories.module.ts`,
                `FooBooRepository`,
            );
            expect(nestjs.updateProvidersModule).toHaveBeenCalledWith(
                `src/repositories/repositories.module.ts`,
                `FooBooRepository`,
            );
            expect(nestjs.addImportToModule).toHaveBeenCalledWith(
                `src/repositories/repositories.module.ts`,
                `FooBooRepository`,
                `./src/repositories/foo-boo-repository/foo-boo.repository.ts`,
            );
        });

        it('generate - Repository', async () => {
            // Mocks

            // @ts-ignore
            fs.readFileSync = (filename: string) => `
                import { Global, Module } from '@nestjs/common';
                @Global()
                @Module({
                    providers: [],
                    exports: [],
                })
                export class ValidatorsModule {}
            `;

            // @ts-ignore
            fs.writeFileSync = jest.fn();

            // Mocks
            const generateFn = jest.fn().mockResolvedValue(true);
            jest.spyOn(nestjs, 'updateExportsModule').mockImplementation();
            jest.spyOn(nestjs, 'updateProvidersModule').mockImplementation();
            jest.spyOn(nestjs, 'addImportToModule').mockImplementation();

            const toolbox = {
                template: {
                    generate: generateFn,
                },
                print: { info: () => {}, success: () => {}, error: () => {} },
                parameters: {
                    first: 'repository',
                    second: 'FooBoo',
                },
            };

            // Test
            await nestjs.generate(toolbox as any);

            expect(generateFn).toHaveBeenCalledWith({
                template: 'nestjs/repository-mysql.ts.ejs',
                target: `src/repositories/foo-boo-repository/foo-boo.repository.ts`,
                props: { nameKebab: 'foo-boo', nameStudly: 'FooBoo' },
            });
            expect(nestjs.updateExportsModule).toHaveBeenCalledWith(
                `src/repositories/repositories.module.ts`,
                `FooBooRepository`,
            );
            expect(nestjs.updateProvidersModule).toHaveBeenCalledWith(
                `src/repositories/repositories.module.ts`,
                `FooBooRepository`,
            );
            expect(nestjs.addImportToModule).toHaveBeenCalledWith(
                `src/repositories/repositories.module.ts`,
                `FooBooRepository`,
                `./src/repositories/foo-boo-repository/foo-boo.repository.ts`,
            );
        });
    });
});
