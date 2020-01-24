import * as fs from 'fs';
import * as path from 'path';
import { Nestjs } from '../src/app/nestjs';

jest.mock('fs');

describe('NestJS', () => {
    let nestjs: Nestjs;

    beforeEach(() => {
        nestjs = new Nestjs();
    });

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
});
