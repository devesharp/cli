import * as fs from 'fs';
import * as path from 'path';
import { Nestjs } from '../src/app/nestjs';

jest.mock('fs');

describe('NestJS', () => {
    let nestjs: Nestjs;

    beforeEach(() => {
        nestjs = new Nestjs();
    });

    it('updateExportsModule - Atualizar exports', () => {
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
});
