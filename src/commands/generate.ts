import { GluegunToolbox } from 'gluegun';
import { Nestjs } from '../app/nestjs';

module.exports = {
    name: 'generate',
    alias: ['g'],
    run: async (toolbox: GluegunToolbox) => {
        // try {
        await new Nestjs().generate(toolbox);
        // } catch (e) {
        //     console.log(`Schematic inválido "${toolbox.parameters.first}".`.red);
        // }
    },
};
