const { containerBootstrap } = require('@nlpjs/core');
const { Nlp } = require('@nlpjs/nlp');
const { LangEs, NormalizerEs, TokenizerEs, StemmerEs } = require('@nlpjs/lang-es');
const fs = require('fs');

const nlp = async() => {

    const container = await containerBootstrap();
    container.use(Nlp);
    container.use(LangEs);

    const nlp = container.get('nlp');
    nlp.settings.autoSave = false;
    nlp.addLanguage('es');

    const files = fs.readdirSync('./intentos');
    for (const file of files) {
        let data = fs.readFileSync(`./intentos/${file}`);
        data = JSON.parse(data);
    
        const intent = file.replace('.json', '');
    
        // Adds the utterances and intents for the NLP
        for (const question of data.questions) {
            nlp.addDocument('es', question, intent);
        }
        
        // Train also the NLG
        for (const answer of data.answers) {
            nlp.addAnswer('es', intent, answer);
        }
    }

    await nlp.train();

    return nlp;

};

const botRespuesta = async(line) => {

    // console.log('line', line);

    let manager = await nlp();

    const normalizer = new NormalizerEs();
    let input = normalizer.normalize(line);

    const tokenizer = new TokenizerEs();
    input = tokenizer.tokenize(input);

    const stemmer = new StemmerEs();
    input = stemmer.stem(input);

    input = input.join();
    // console.log('input', input);

    const response = await manager.process('es', input);
    // console.log(response);
    // console.log(response.answer);

    return response.answer;

}

exports.botRespuesta = botRespuesta;